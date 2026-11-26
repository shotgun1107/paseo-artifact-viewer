import { temporaryDirectory } from "./temp-directory.mjs";
import test from "node:test";
import assert from "node:assert/strict";
import { DatabaseSync } from "node:sqlite";
import { join } from "node:path";
import { SqliteArtifactRepository } from "../server/repository";
import { LocalWebPreview } from "../server/web-preview";
import { RemoteArtifactStore } from "../client/remote-store";
import { serverHarness } from "./server-harness";

const session = "management-test";
function seed(repo: SqliteArtifactRepository, key: string, revision: number, format: "html" | "react" = "html") {
  const value = repo.commit({ sessionId: session, key, title: key, format, content: format === "html" ? "<p>v"+revision+"</p>" : "export default function App(){return <b>ok</b>}",
    idemKey: JSON.stringify([session,key,revision]), request: { key,revision }, origin: { kind: "publish" } });
  if (value.status !== "ok") throw new Error("fixture commit failed"); return value.artifactId;
}
test("rename, pin, selected-version duplication and soft deletion survive reopening", t => {
  const temp = temporaryDirectory();
  t.after(temp.discard);
  const dbPath = join(temp.directory, "artifacts.sqlite");
  let repo = new SqliteArtifactRepository(new DatabaseSync(dbPath));
  try {
    const src = seed(repo,"one",1); seed(repo,"one",2); const other = seed(repo,"two",1);
    repo.manage(session,src,{type:"pin",pinned:true});
    repo.manage(session,src,{type:"rename",title:"사용자 이름"});
    const first = repo.list(session,undefined,1);
    assert.equal(first.items[0].artifactId,src);
    assert.equal(repo.list(session,first.cursor!,1).items[0].artifactId,other);
    const duplicate = {type:"duplicate",requestId:"retry-copy",version:1} as const;
    repo.setHostLocale("ko");
    const copy = repo.manage(session,src,duplicate);
    repo.setHostLocale("en");
    assert.equal(repo.manage(session,src,duplicate).artifactId,copy.artifactId);
    assert.equal(repo.get(session,copy.artifactId)!.version.content,"<p>v1</p>");
    assert.equal(repo.get(session,copy.artifactId)!.artifact.title,"사용자 이름 사본");
    assert.equal(repo.get(session,repo.manage(session,src,{...duplicate,requestId:"en-copy"}).artifactId)!.artifact.title,"사용자 이름 copy");
    assert.throws(()=>repo.manage("other-session",src,{type:"delete"}));
    repo.manage(session,src,{type:"delete"});
    repo.close(); repo = new SqliteArtifactRepository(new DatabaseSync(dbPath));
    assert.equal(repo.get(session,src),null);
    assert.equal(repo.list(session).hidden?.includes("one"),true);
    seed(repo,"one",2); // same publisher replay must not surface the deleted result
    assert.equal(repo.get(session,src),null);
    repo.manage(session,src,{type:"restore"});
    const restored = repo.get(session,src)!;
    assert.equal(restored.artifact.pinned,true); assert.equal(restored.artifact.title,"사용자 이름");
    assert.equal(restored.artifact.headVersion,2);
    assert.equal(repo.notices(session).find(n=>n.payload.artifactId===src)!.payload.deleted,false);
  } finally { repo.close(); }
});

test("two clients see metadata-only changes, deleted aliases and undo on refresh", async () => {
  const repo = new SqliteArtifactRepository(new DatabaseSync(":memory:"));
  const host = serverHarness(repo);
  const rpc = (contract:any,input:any) => host.rpc(contract.name,input) as any;
  const a = new RemoteArtifactStore(session,rpc), b = new RemoteArtifactStore(session,rpc);
  try {
    const id = seed(repo,"timer",1); await b.refreshPersistent();
    await a.manage(id,{type:"rename",title:"작업 시간"}); await b.refreshPersistent();
    assert.equal(b.snapshot()[0].title,"작업 시간");
    await a.manage(id,{type:"delete"}); await b.refreshPersistent();
    b.ingest([{id:"timer",title:"timer",kind:"html",code:"안녕",complete:true,explicit:true}],"old","now");
    assert.equal(b.snapshot().length,0); assert.equal(b.isDeleted("timer"),true);
    await a.manage(id,{type:"restore"}); await b.refreshPersistent(); assert.equal(b.snapshot().length,1);
    assert.equal(b.isDeleted("timer"),false);
  } finally { a.dispose(); b.dispose(); await host.cleanup(); }
});

test("web preview restricts access to the requested session and version, revokes deleted links and closes", async () => {
  const repo = new SqliteArtifactRepository(new DatabaseSync(":memory:")), web = new LocalWebPreview(repo);
  try {
    const id = seed(repo,"timer",1); seed(repo,"timer",2);
    await assert.rejects(web.open("other",id,1));
    const url = await web.open(session,id,1);
    assert.equal(new URL(url).hostname,"127.0.0.1");
    const response = await fetch(url); assert.equal(response.status,200);
    assert.match(response.headers.get("content-security-policy")!,/sandbox allow-scripts;/);
    assert.match(await response.text(), /<iframe\b/i);
    assert.equal((await fetch(new URL("/unknown",url))).status,404);
    repo.manage(session,id,{type:"delete"}); assert.equal((await fetch(url)).status,404);
    const jsx = await fetch(await web.open(session,seed(repo,"jsx",1,"react"),1));
    assert.equal(jsx.status,200); assert.match(await jsx.text(),/createElement/);
  } finally { await web.close(); repo.close(); }
});

test("opening an old card loads its exact revision outside the recent history cache", async () => {
  const repo = new SqliteArtifactRepository(new DatabaseSync(":memory:"));
  const host = serverHarness(repo);
  const store = new RemoteArtifactStore(session, (contract, input) => host.rpc(contract.name,input));
  try {
    const id = seed(repo,"long-history",1);
    for (let i=2; i<=25; i++) seed(repo,"long-history",i);
    store.focus(id,1);
    await store.refreshPersistent();
    const saved = store.snapshot()[0];
    assert.ok(saved.versions.some(v=>v.artifactVersion===1 && v.code==="<p>v1</p>"));
    assert.equal(saved.versions.at(-1)?.artifactVersion,25);
  } finally { store.dispose(); await host.cleanup(); }
});

test("migration from v1 retains original revision bodies and request ownership", () => {
  const db = new DatabaseSync(":memory:");
  // The original release had no management tables or deleted flag on artifacts.
  db.exec(`CREATE TABLE artifacts(id TEXT PRIMARY KEY,session TEXT NOT NULL,key TEXT NOT NULL,title TEXT NOT NULL,format TEXT NOT NULL,head INTEGER NOT NULL,updated TEXT NOT NULL,UNIQUE(session,key));
    CREATE TABLE versions(artifact TEXT NOT NULL REFERENCES artifacts(id),version INTEGER NOT NULL,parent INTEGER NOT NULL,title TEXT NOT NULL,format TEXT NOT NULL,content TEXT NOT NULL,hash TEXT NOT NULL,origin TEXT NOT NULL,created TEXT NOT NULL,PRIMARY KEY(artifact,version));
    INSERT INTO artifacts VALUES('old-id','legacy','timer','기존 타이머','html',1,'2026-11-05');
    INSERT INTO versions VALUES('old-id',1,0,'기존 타이머','html','<b>old</b>','old-hash','{"kind":"publish"}','2026-11-05');
    PRAGMA user_version=1;`);
  const repo = new SqliteArtifactRepository(db);
  try {
    assert.equal(db.prepare("PRAGMA user_version").get()?.user_version,2);
    assert.equal(repo.list("legacy").items[0].title,"기존 타이머");
    repo.manage("legacy","old-id",{type:"rename",title:"바뀐 이름"});
    const result = repo.get("legacy","old-id")!;
    assert.equal(result.version.content,"<b>old</b>");
    assert.equal(result.version.title,"기존 타이머");
    assert.equal(result.artifact.title,"바뀐 이름");
    assert.equal(repo.get("another","old-id"),null);
  } finally { repo.close(); }
});

test("feedback is unavailable and existing local records survive upgrade", async () => {
  const db = new DatabaseSync(":memory:");
  const repo = new SqliteArtifactRepository(db);
  const fixture = serverHarness(repo);
  try {
    assert.equal(db.prepare("SELECT name FROM sqlite_master WHERE name='artifact_feedback'").get(), undefined);
    const id = seed(repo, "retained", 1);
    db.exec("CREATE TABLE artifact_feedback(artifact TEXT, request TEXT, version INTEGER, message TEXT)");
    db.prepare("INSERT INTO artifact_feedback VALUES(?,?,?,?)").run(id, "existing", 1, "old note");
    new SqliteArtifactRepository(db);
    await assert.rejects(fixture.rpc("artifact.feedback", {sessionId: session, artifactId: id}), /Unknown test RPC/);
    await assert.rejects(fixture.rpc("artifact.manage", {sessionId: session, artifactId: id, action: {type: "feedback", requestId: "new", version: 1, message: "new note"}}));
    assert.deepEqual(db.prepare("SELECT message FROM artifact_feedback").all().map(row => row.message), ["old note"]);
    assert.equal(repo.get(session, id)?.version.version, 1);
  } finally { await fixture.cleanup(); }
});
