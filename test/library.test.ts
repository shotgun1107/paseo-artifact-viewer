import assert from "node:assert/strict";
import { DatabaseSync } from "node:sqlite";
import test from "node:test";
import type { PaseoApi } from "@getpaseo/client";
import { SqliteArtifactRepository } from "../src/server/repository";
import { staticThumbnail, withSourceNames, type LibraryRow } from "../src/server/library";

test("global library searches current display titles and paginates artifacts across sessions", () => {
  const db = new DatabaseSync(":memory:");
  // Emulate a historical parent with a missing session; revisions themselves never had a session column.
  db.exec("CREATE TABLE artifacts(id TEXT PRIMARY KEY, session TEXT, key TEXT, title TEXT, format TEXT, head INTEGER, updated TEXT, UNIQUE(session,key))");
  const repo = new SqliteArtifactRepository(db);
  try {
    function save(sessionId: string, key: string, title: string, content: string) {
      const result = repo.commit({ sessionId, key, title, format:"html", content, idemKey:JSON.stringify([sessionId,key,content]),
        origin:{ kind:"publish" }, request:{ key, title, content } });
      assert.equal(result.status,"ok");
      return result.artifactId!;
    }
    const a = save("s1","dice","옛 이름","v1");
    assert.equal(save("s1","dice","주사위","v2"),a);
    const b = save("s2","other","주사위","v1");
    const c = save("s2","old","renamed","v1");
    const deleted = save("s1","hidden","주사위","hidden");
    repo.manage("s2",c,{ type:"rename", title:"표시명" });
    repo.manage("s1",deleted,{ type:"delete" });
    db.prepare("UPDATE artifacts SET session=NULL WHERE id=?").run(c);
    db.exec("UPDATE artifacts SET updated='2026-01-01'");
    const first = repo.libraryList("",0,2), second = repo.libraryList("",first.nextOffset!,2);
    assert.equal(first.items.length,2); assert.equal(second.items.length,1); assert.equal(second.nextOffset,null);
    assert.deepEqual([...first.items,...second.items].map(x=>x.artifactId),[a,b,c].sort().reverse());
    assert.deepEqual(repo.libraryList("옛 이름",0,8).items,[]);
    assert.deepEqual(repo.libraryList("rename",0,8).items,[]);
    assert.equal(repo.libraryList("주사위",0,1).nextOffset,1);
    assert.deepEqual(repo.libraryList("주사위",0,4).items.map(x=>x.headVersion).sort(),[1,2]);
    assert.equal(repo.libraryList("표시명",0,10).items[0].sessionId,null);
    assert.deepEqual(repo.libraryList("", 0, 1, true).items, []);
    repo.manage("s1", a, {type:"pin", pinned:true});
    repo.manage("s2", b, {type:"pin", pinned:true});
    const pinnedPage = repo.libraryList("주사위", 0, 1, true);
    assert.equal(pinnedPage.nextOffset, 1);
    assert.equal(pinnedPage.items[0].pinned, true);
    const lastPinnedPage = repo.libraryList("주사위", 1, 1, true);
    assert.equal(lastPinnedPage.nextOffset, null);
    assert.notEqual(lastPinnedPage.items[0].artifactId, pinnedPage.items[0].artifactId);
    repo.manage("s1", a, {type:"pin", pinned:false});
    assert.deepEqual(repo.libraryList("", 0, 10, true).items.map(item => item.artifactId), [b]);
    // An older pin leads the first page. Recent items still follow exactly once, including across the page boundary.
    db.prepare("UPDATE artifacts SET updated=? WHERE id=?").run("2020-01-01", b);
    const grouped = repo.libraryList("", 0, 1, false, true);
    assert.deepEqual(grouped.items.map(item => item.artifactId), [b]);
    assert.deepEqual(repo.libraryList("", grouped.nextOffset!, 3, false, true).items.map(item => item.artifactId), [a, c].sort().reverse());
    assert.notEqual(repo.libraryList("", 0, 1, false).items[0].artifactId, b);
    assert.deepEqual(repo.libraryList("표시명", 0, 10, false, true).items.map(item => item.artifactId), [c]);
    assert.equal(repo.libraryGet(c)?.version.content,"v1");
    assert.equal(repo.libraryGet(deleted),null);
    assert.equal(repo.libraryGet(a,1)?.version.title,"옛 이름");
  } finally { repo.close(); }
});

test("source labels use bulk directory pages, handle archived agents and avoid raw IDs", async () => {
  let agents=0, spaces=0;
  const api = {
    agents:{list: async (options:any) => {
      agents++;
      assert.ok(options.filter.includeArchived);
      return {entries: [{agent:{id:"s",title:"삭제된 대화",workspaceId:"ws"}},{agent:{id:"named",title:"named",workspaceId:"missing"}}],pageInfo:{nextCursor:null}};
    }},
    workspaces:{list:async () => { spaces++; return {entries:[{id:"ws",name:"작업장"}],pageInfo:{nextCursor:null}}; }},
  } as unknown as PaseoApi;
  const row: LibraryRow={artifactId:"id",sessionId:"s",title:"주사위",format:"html",headVersion:2,updatedAt:"now",thumbnail:null};
  const items=Array.from({length:35},(_,i)=>({...row,artifactId:String(i)}));
  items.push({...row,sessionId:"gone"}, {...row,sessionId:"named"});
  const mapped=await withSourceNames(items,api);
  assert.equal(agents,1); assert.equal(spaces,1);
  assert.deepEqual([mapped[0].sessionTitle,mapped[0].workspaceName],["삭제된 대화","작업장"]);
  assert.equal(mapped[0].sessionTitleStatus, undefined);
  assert.deepEqual([mapped[35].sessionTitle, mapped[35].sessionTitleStatus], ["Deleted conversation", "deleted"]);
  assert.deepEqual([mapped[36].sessionTitle,mapped[36].workspaceName,mapped[36].sessionTitleStatus],["Untitled conversation",null,"untitled"]);
  const unavailable = {agents:{list:async()=>{throw Error("offline");}}} as unknown as PaseoApi;
  assert.deepEqual((await withSourceNames([row,{...row,sessionId:null}],unavailable,"ko-KR")).map(v=>[v.sessionTitle,v.sessionTitleStatus]),
    [["출처 확인 불가","unavailable"],["삭제된 대화","deleted"]]);
});

test("only self-contained static SVGs can be thumbnails", () => {
  for (const source of ['<svg><circle r="3"/></svg>','<svg xmlns="http://www.w3.org/2000/svg"><text fill="#021234">주사위</text></svg>'])
    assert.match(staticThumbnail(source)!,/^data:image\/svg\+xml;base64,/);
  for (const source of ["<html></html>", "<svg><script/></svg>", '<svg><image href="external"/></svg>', "<svg><animate/></svg>",
      '<svg><rect fill="url(https://example.test/image)"/></svg>', '<svg onload="bad()"/>', '<?xml-stylesheet href="external"?><svg xmlns="http://www.w3.org/2000/svg"/>',
      '<!DOCTYPE svg><svg xmlns="http://www.w3.org/2000/svg"/>', "<svg>"])
    assert.equal(staticThumbnail(source),null);
});

test("title search handles non-ASCII case and equivalent Unicode spellings", () => {
  const repo = new SqliteArtifactRepository(new DatabaseSync(":memory:"));
  try {
    repo.commit({ sessionId: "coffee", key: "menu", title: "CAFÉ MENU", format: "html", content: "<main>Coffee</main>",
      idemKey: "unicode-search", request: "menu", origin: { kind: "publish" } });
    for (const query of ["café", "cafe\u0301", "CAFÉ", "menu"]) {
      assert.equal(repo.libraryList(query, 0, 40).items[0]?.title, "CAFÉ MENU");
    }
  } finally { repo.close(); }
});
