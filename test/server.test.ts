import { temporaryDirectory } from "./temp-directory.mjs";
import test from "node:test";
import assert from "node:assert/strict";
import { DatabaseSync } from "node:sqlite";
import { execFileSync } from "node:child_process";
import { join } from "node:path";
import { SqliteArtifactRepository, openRepository } from "../server/repository";
import { ArtifactService } from "../server/service";
import { registerServer } from "../server/register";
import { observeArtifacts } from "../client/timeline";
import { RemoteArtifactStore } from "../client/remote-store";
import { artifactList, artifactGet, artifactHistory, artifactSaveEdit, artifactRestoreVersion, publishSchema, type MutationResult } from "../shared/contracts";
import { artifactSetLocale } from "../shared/locale";
import { getArtifactGuide } from "../shared/agent-guide";
import contributeServer from "../index.server";

test("publish accepts the legacy kind field and rejects a mistyped update target", () => {
  const input = { requestId: "update", title: "Clock", content: "<main/>" };
  assert.ok(publishSchema.safeParse({ ...input, kind: "html" }).success);
  assert.ok(publishSchema.safeParse({ ...input, format: "html", artifactId: "clock" }).success);
  assert.equal(publishSchema.safeParse({ ...input, format: "html", artifactID: "clock" }).success, false);
});

function repository() { return new SqliteArtifactRepository(new DatabaseSync(":memory:")); }
function commit(repo: SqliteArtifactRepository, content: string, requestId: string, sessionId = "agent-a", key = "counter") {
  return repo.commit({ sessionId, key, title: "계산기", format: "html", content, idemKey: JSON.stringify(["test", sessionId, requestId]), request: { content, key }, origin: { kind: "publish", turnId: "turn" } });
}
test("restoring a historical version preserves its format and body, checks the head and deduplicates retries", async () => {
  const f = fixture();
  try {
    const first = commit(f.repo, "one", "v1", "agent-a");
    const artifactId = first.artifactId!;
    f.repo.commit({ sessionId: "agent-a", artifactId, baseVersion: 1, title: "Diagram", format: "svg", content: "<svg/>", idemKey: "v2", request: "v2", origin: { kind: "publish" } });
    const input = { sessionId: "agent-a", artifactId, version: 1, baseVersion: 2, clientMutationId: "restore-1" };
    const applied = await f.rpc(artifactRestoreVersion, input);
    assert.equal(applied.status, "ok");
    assert.equal(applied.version, 3);
    assert.deepEqual(await f.rpc(artifactRestoreVersion, input), applied);
    const source = f.repo.get("agent-a", artifactId, 1)!.version;
    const restored = f.repo.get("agent-a", artifactId, 3)!.version;
    assert.deepEqual([restored.format, restored.title, restored.content], [source.format, source.title, source.content]);
    assert.equal(restored.origin.restoredFromVersion, 1);
    assert.equal(restored.parentVersion, 2);
    assert.equal((await f.rpc(artifactRestoreVersion, { ...input, clientMutationId: "old-head" })).reason, "baseVersion");
    await assert.rejects(f.rpc(artifactRestoreVersion, { ...input, sessionId: "agent-b" }));
  } finally { await f.cleanup(); }
});

function fixture(repo = repository()) {
  const handlers = new Map<string, any>(), hooks = new Map<string, any>(), before = new Map<string, any>(), timelines = new Map<string, any[]>(), appended = new Map<string, any>();
  const paseo: any = { agents: { ref: (id: string) => ({ id, timeline: {
    refetch: async (options: any = {}) => {
      const all = timelines.get(id) ?? [], end = options.direction === "before" ? Number(options.cursor) : all.length, start = Math.max(0, end - (options.limit ?? 200));
      return { entries: all.slice(start, end), epoch: "fixture-epoch", hasOlder: start > 0, startCursor: start ? String(start) : undefined, staleCursor: false };
    },
    append: async (item: any) => { appended.set(`${id}:${item.id}`, item); return { seq: appended.size, epoch: "fixture-epoch" }; },
  } }) } };
  const service = new ArtifactService(repo, () => {});
  const cleanup = registerServer({ handle: (contract: any, handler: any) => handlers.set(contract.name, handler), on: (name: string, fn: any) => { hooks.set(name, fn); return () => hooks.delete(name); }, before: (name: string, fn: any) => { before.set(name, fn); return () => before.delete(name); } } as any, service);
  const rpc: any = async (contract: any, input: any) => contract.output.parse(await handlers.get(contract.name)(contract.input.parse(input), { paseo }));
  return { repo, service, handlers, hooks, before, timelines, appended, paseo, rpc, cleanup };
}
test("a delivered file from a completed edit produces one durable gallery entry and one conversation card", async () => {
  const f = fixture(), id = "file-delivery";
  const handle = f.paseo.agents.ref(id);
  f.paseo.agents.ref = () => ({ ...handle, cwd: "C:\\demo" });
  const content = '<!doctype html><html><title>Colour lab</title><button>Pick</button></html>\n';
  const items = [
    { type: "user_message", text: "아무 아티팩트 만들어봐" },
    { type: "tool_call", name: "apply_patch", callId: "edit-1", status: "completed", detail: { type: "edit", filePath: "web/lab (1).html", newString: content } },
    { type: "assistant_message", messageId: "answer", text: "[열기](<C:/demo/web/lab%20(1).html>)" },
  ];
  const entries = items.map((item, seqStart) => ({ seqStart, item }));
  f.timelines.set(id, entries);
  try {
    f.service.beginTurn(id, "turn1");
    await f.service.backfill(id, f.paseo, "turn1", true);
    await f.service.endTurn(id, "turn1");
    await f.service.backfill(id, f.paseo);
    const [row] = f.repo.libraryList("Colour lab", 0, 5).items;
    assert.deepEqual([row.sessionId, row.headVersion, f.appended.size], [id, 1, 1]);
    assert.equal(f.repo.libraryGet(row.artifactId)?.version.content, content);
    assert.equal([...f.appended.values()][0].data.artifactId, row.artifactId);
    assert.equal(f.repo.list(id).items.length, 1);
  } finally { await f.cleanup(); }
});

test("file delivery only takes matching completed writes from the same turn and avoids double publication", async () => {
  const f = fixture(), id = "links";
  const content = '<html><title>Example</title><main>preview</main></html>';
  const write = (filePath: string, status = "completed") => ({ type: "tool_call", callId: filePath, name: "write", status, detail: { type: "write", filePath, content } });
  const user = (text: string) => ({ type: "user_message", text });
  const reply = (text: string) => ({ type: "assistant_message", text });
  const items = [user("docs"), write("manual.html"), reply("[manual](manual.html)"),
    user("artifact please"), reply("[old](manual.html)"), write("failed.html", "failed"), reply("[failed](failed.html)"),
    write("new.html"), reply("[unrelated](https://example.org/new.html) [unread](missing.html)"),
    reply("[제출](new.html)")];
  const entries = items.map((item, seqStart) => ({ seqStart, item }));
  f.timelines.set(id, entries.slice(0, -1));
  try {
    await f.service.backfill(id, f.paseo);
    assert.equal(f.repo.list(id).items.length, 0);
    f.timelines.set(id, entries);
    f.service.beginTurn(id, "turn");
    await f.service.publish(id, { requestId: "p", key: "original", format: "html", title: "Example", content }, f.paseo);
    await f.service.backfill(id, f.paseo, "turn", true);
    await f.service.endTurn(id, "turn");
    await f.service.backfill(id, f.paseo);
    assert.deepEqual(f.repo.list(id).items.map(row => [row.key, row.headVersion]), [["original", 1]]);
    assert.equal(f.appended.size, 1);
  } finally { await f.cleanup(); }
});
const message = (id: string, content: string, key = "counter", seq = 1) => ({ seqStart: seq, seqEnd: seq, timestamp: new Date().toISOString(), item: { type: "assistant_message", messageId: id, text: `\`\`\`html artifact="${key}" title="계산기"\n${content}\n\`\`\`` } });

test("server scopes keys to agent IDs and preserves A to B to A as three revisions", () => {
  const repo = repository();
  try {
    const a = commit(repo, "A", "1"), b = commit(repo, "B", "2"), again = commit(repo, "A", "3"), other = commit(repo, "A", "1", "agent-b");
    assert.equal(a.status, "ok"); assert.equal(b.version, 2); assert.equal(again.version, 3); assert.notEqual(a.artifactId, other.artifactId);
    assert.match(a.artifactId!, /^[0-7][0-9A-HJKMNP-TV-Z]{25}$/);
    assert.equal(repo.get("agent-b", a.artifactId!), null);
    assert.deepEqual(repo.history("agent-a", a.artifactId!, undefined, 2).items.map(item => item.version), [3, 2]);
    assert.deepEqual(repo.history("agent-a", a.artifactId!, "2", 2).items.map(item => item.version), [1]);
  } finally { repo.close(); }
});
test("same idempotency token returns the same result and rejects changed input without writes", () => {
  const repo = repository();
  try {
    const first = commit(repo, "A", "1"); assert.deepEqual(commit(repo, "A", "1"), first);
    assert.equal(commit(repo, "B", "1").status, "conflict");
    assert.equal(repo.get("agent-a", first.artifactId!)!.artifact.headVersion, 1); assert.equal(repo.pending().length, 1);
  } finally { repo.close(); }
});
test("keyless publication gets a parser-compatible key and artifactId updates retain identity", async () => {
  const f = fixture();
  try {
    const first = await f.service.publish("agent-a", { requestId: "first", kind: "html", title: "새 결과물", content: "<div>A</div>" }, f.paseo);
    const summary = f.repo.get("agent-a", first.artifactId!)!.artifact;
    assert.match(summary.key, /^[a-zA-Z0-9][\w.-]{0,79}$/);
    const second = await f.service.publish("agent-a", { requestId: "second", artifactId: first.artifactId!, kind: "html", title: "갱신", content: "<div>B</div>" }, f.paseo);
    assert.equal(second.artifactId, first.artifactId); assert.equal(second.version, 2);
  } finally { await f.cleanup(); }
});
test("outbox failure rolls back version, head and idempotency record atomically", () => {
  const db = new DatabaseSync(":memory:"), repo = new SqliteArtifactRepository(db);
  try {
    db.exec("CREATE TRIGGER fail_outbox BEFORE INSERT ON outbox BEGIN SELECT RAISE(ABORT,'simulated-disk-write'); END");
    assert.throws(() => commit(repo, "A", "1"), /simulated-disk-write/); assert.equal(repo.list("agent-a").items.length, 0);
    db.exec("DROP TRIGGER fail_outbox"); assert.equal(commit(repo, "A", "1").version, 1);
  } finally { repo.close(); }
});
test("extraction aliases only a unique same-turn same-format publish and conflicting keys stay separate", () => {
  const repo = repository();
  try {
    const a = commit(repo, "A", "p1");
    const extract = (id: string, key?: string, turnId = "turn") => repo.commit({ sessionId: "agent-a", key, title: "표", format: "html", content: "A", idemKey: id, request: { id, key: key ?? null }, origin: { kind: "extract", turnId, messageId: id, legacyId: `msg:${id}:0` } });
    const alias = extract("e1", "counter"); assert.equal(alias.status === "ok" && alias.alias, true); assert.equal(alias.artifactId, a.artifactId);
    assert.equal(repo.get("agent-a", a.artifactId!)!.artifact.legacyIds.includes("msg:e1:0"), true);
    const otherKey = extract("e2", "different"); assert.notEqual(otherKey.artifactId, a.artifactId);
    commit(repo, "A", "p2", "agent-a", "second-publish");
    const ambiguous = extract("e3"); assert.equal(ambiguous.status === "ok" && ambiguous.alias, false);
    const past = extract("e4", "counter", "older-turn"); assert.equal(past.version, 2);
  } finally { repo.close(); }
});
test("SQLite survives process-style reopen; crash-window outbox resend keeps one timeline card", async t => {
  const temp = temporaryDirectory();
  t.after(temp.discard);
  const folder = temp.directory, file = join(folder, "artifacts.sqlite");
  let repo = await openRepository(file); const initial = commit(repo, "<div>A</div>", "first"); repo.close();
  repo = await openRepository(file); const f = fixture(repo);
  try {
    assert.equal(repo.get("agent-a", initial.artifactId!)!.version.content, "<div>A</div>");
    // A pending row spanning a restart no longer proves a live position.
    await f.service.flush(f.paseo);
    assert.equal(repo.pending().length,0);
    assert.equal(f.appended.size,0);
    // A lost acknowledgement within the same delivery window is retried using the same id.
    const append = f.paseo.agents.ref("agent-a").timeline.append;
    let fail = true;
    const api: any = { agents: { ref: () => ({ timeline: { append: async (item: any) => { await append(item); if (fail) { fail = false; throw new Error("ack-lost-after-write"); } } } }) } };
    await f.service.publish("agent-a",{requestId:"fresh",format:"html",title:"Fresh",content:"<main>new</main>"},api);
    assert.equal(repo.pending(Date.now()+600000).length,1);
    await f.service.flush(api, Date.now()+600000);
    assert.equal(f.appended.size,1);
    assert.equal([...f.appended.values()][0].data.placement,"live");
  } finally { await f.cleanup(); }
});
test("explicit-key extraction aliases the latest matching A/B/A publish instead of adding v4", () => {
  const repo = repository();
  try {
    commit(repo, "A", "first"); commit(repo, "B", "second"); const third = commit(repo, "A", "third");
    const alias = repo.commit({ sessionId: "agent-a", key: "counter", title: "계산기", format: "html", content: "A", idemKey: "last-response", request: { content: "A" }, origin: { kind: "extract", turnId: "turn" } });
    assert.equal(alias.status === "ok" && alias.alias, true); assert.equal(alias.version, 3);
    assert.equal(repo.get("agent-a", third.artifactId!)!.artifact.headVersion, 3);
  } finally { repo.close(); }
});
test("turn hooks extract with no UI, tool publish aliases prose, and history sessions receive no tools", async () => {
  const f = fixture();
  try {
    const agent: any = { id: "agent-a", provider: "codex", cwd: "C:/fixture" };
    const request: any = { agentId: agent.id, provider: "codex", purpose: "interactive", tools: [], mcpServers: {} };
    const registration = f.before.get("agent.session_open")({ request }, { paseo: f.paseo });
    assert.equal(registration.tools.length, 4);
    assert.equal(f.before.get("agent.session_open")({ request: { ...request, purpose: "history" } }, { paseo: f.paseo }), undefined);
    assert.equal(f.before.get("agent.session_open")({ request: { ...request, provider: "unknown" } }, { paseo: f.paseo }), undefined);
    await f.hooks.get("agent.turn_started")({ agent, turnId: null }, { paseo: f.paseo });
    const signal = new AbortController().signal;
    const result = await registration.tools[0].execute({ requestId: "one", kind: "html", title: "계산기", key: "counter", content: "<div>A</div>" }, { agent, paseo: f.paseo, signal });
    assert.equal(f.appended.size, 0);
    assert.ok(f.repo.get(agent.id, result.structuredContent.artifactId));
    const other = await f.service.publish("other", { requestId: "other", format: "html", title: "다른 대화", content: "<b>B</b>" }, f.paseo);
    assert.equal(other.status, "ok");
    assert.equal(f.appended.size, 1);
    assert.ok([...f.appended.keys()][0].startsWith("other:"));
    f.timelines.set(agent.id, [message("m1", "<div>A</div>")]);
    await f.hooks.get("agent.turn_ended")({ agent, turnId: null, outcome: { kind: "completed" } }, { paseo: f.paseo });
    assert.equal(f.appended.size, 2);
    assert.equal(f.repo.get(agent.id, result.structuredContent.artifactId)!.artifact.headVersion, 1);
    assert.equal(f.repo.get(agent.id, result.structuredContent.artifactId)!.artifact.legacyIds.includes("counter"), true);
    f.timelines.set(agent.id, [...f.timelines.get(agent.id)!, message("m2", "<div>B</div>", "counter", 2)]);
    const backfill = await f.service.backfill(agent.id, f.paseo); assert.equal(backfill.conflicts, 0);
    assert.equal(f.repo.get(agent.id, result.structuredContent.artifactId)!.artifact.headVersion, 2);
  } finally { await f.cleanup(); }
});
test("edit optimistic concurrency, request replay and session ownership are enforced outside a turn", async () => {
  const f = fixture();
  try {
    const initial = commit(f.repo, "A", "first");
    const input = { sessionId: "agent-a", artifactId: initial.artifactId!, baseVersion: 1, content: "B", clientMutationId: "edit-a" };
    const saved = await f.rpc(artifactSaveEdit, input); assert.equal(saved.version, 2);
    assert.deepEqual(await f.rpc(artifactSaveEdit, input), saved);
    assert.equal((await f.rpc(artifactSaveEdit, { ...input, content: "C" })).status, "conflict");
    assert.equal((await f.rpc(artifactSaveEdit, { ...input, clientMutationId: "edit-b" })).reason, "baseVersion");
    await assert.rejects(() => f.rpc(artifactSaveEdit, { ...input, sessionId: "agent-b" }), /Base version/);
    await f.service.flush(); assert.equal(f.appended.size, 2);
    assert.equal([...f.appended.values()].at(-1).data.originKind, "edit");
  } finally { await f.cleanup(); }
});

test("reopen projects the saved revision under its original reply without appending, across pages and sessions", async () => {
  const f = fixture();
  try {
    const session = "agent-a", id = commit(f.repo, "v1", "one").artifactId;
    const edit = await f.service.saveEdit({sessionId:session,artifactId:id!,baseVersion:1,content:"v2",clientMutationId:"local"}, f.paseo);
    assert.equal(edit.status,"ok"); commit(f.repo,"unrelated","other","agent-b");
    const appended = f.appended.size;
    const tail = Array.from({length:204}, (_,i) => ({item:{type:"assistant_message",messageId:"later-"+i,text:"other reply"}}));
    f.timelines.set(session,[{turnId:"turn",item:{type:"assistant_message",messageId:"original",text:"original answer"}}, ...tail]);
    const first = await f.service.placements.read(session,f.paseo);
    assert.deepEqual(first.items.map(p=>[p.sessionId,p.messageId,p.notice.artifactId,p.notice.artifactVersion]),[[session,"original",id,1]]);
    assert.deepEqual(await f.service.placements.read(session,f.paseo),first);
    assert.equal(f.appended.size,appended);
    assert.equal(f.repo.headVersion(session,id!),2);
    assert.deepEqual((await f.service.placements.read(undefined,f.paseo)).sessions?.sort(),["agent-a","agent-b"]);
  } finally { await f.cleanup(); }
});

test("request id links a completed publish to exactly one following reply within its prompt", async () => {
  const f=fixture(), session="agent-a";
  try {
    const publish=await f.service.publish(session,{requestId:"demo",key:"demo",title:"demo",format:"html",content:"<p>sample</p>"},f.paseo);
    assert.equal(publish.status,"ok");
    const tool={item:{type:"tool_call",name:"paseo.artifact_publish",status:"completed",detail:{type:"unknown",input:{requestId:"demo"}}}};
    const reply={item:{type:"assistant_message",messageId:"original",text:"Saved."}};
    const user={item:{type:"user_message",text:"new question"}};
    const legacy={...f.appended.values().next().value,pluginId:"paseo-artifact-viewer"};
    delete legacy.data.placement;
    const post=async (entries: unknown[]) => { f.timelines.set(session,entries); return (await f.service.placements.read(session,f.paseo)).items; };
    assert.deepEqual((await post([tool,reply,user,{item:{...reply.item,messageId:"unrelated"}},{item:legacy}])).map(x=>x.messageId),["original"]);
    for (const entries of [[tool,user,reply],[tool,reply,reply],[tool,reply,{item:{...reply.item,messageId:"ambiguous"}}],
      [{item:{...tool.item,status:"failed"}},reply],[{item:{...tool.item,name:"other.artifact_publish"}},reply]]) {
      assert.deepEqual(await post(entries),[]);
    }
    assert.deepEqual(await post([tool,reply,{item:{...legacy,data:{...legacy.data,placement:"live"}}}]),[]);
  } finally { await f.cleanup(); }
});

test("history-only import binds a saved fenced revision to its exact block and never enqueues a tail card",async()=>{
  const f=fixture(), session="agent-a";
  try {
    const text="Result\n```html id=demo\n<html>old</html>\n```";
    f.timelines.set(session,[{seqStart:1,timestamp:"2026-11-01T00:00:00Z",item:{type:"assistant_message",messageId:"old",text}}]);
    await f.service.backfill(session,f.paseo);
    const placed=await f.service.placements.read(session,f.paseo);
    assert.deepEqual(placed.items.map(p=>[p.messageId,p.blockIndex,p.notice.artifactVersion]),[["old",0,1]]);
    await f.service.flush(f.paseo);
    assert.equal(f.appended.size,0);
    f.timelines.get(session)![0].item.text=text.replace("old","changed");
    assert.deepEqual((await f.service.placements.read(session,f.paseo)).items,[]);
  } finally { await f.cleanup(); }
});

test("placement scan rejects invalid epochs and gaps and never publishes partial history",async()=>{
  const f=fixture(); commit(f.repo,"A","one");
  try {
    const api:any={agents:{ref:()=>({timeline:{refetch:async(options:any)=>options.direction==="before"
          ? {epoch:"new",entries:[],hasOlder:false} : {epoch:"old",entries:[],hasOlder:true,startCursor:"older"}}})}};
    await assert.rejects(f.service.placements.read("agent-a",api),/history changed/);
    assert.deepEqual((await f.service.placements.read(undefined,f.paseo)).items,[]);
  } finally {await f.cleanup();}
});
test("reopening archived history invalidates placements without appending missing versions", async()=>{
  const f=fixture(); commit(f.repo,"A","one");
  try {
    const events:string[]=[]; const ac=new AbortController();
    f.service.placements.subscribe(e=>events.push(e.sessionId),ac.signal);
    f.before.get("agent.session_open")({request:{agentId:"agent-a",provider:"codex",purpose:"history",tools:[],mcpServers:[]}}, {paseo:f.paseo});
    await new Promise(r=>setImmediate(r));
    assert.deepEqual(events,["agent-a"]);
    assert.deepEqual((await f.service.placements.read("agent-a",f.paseo)).items,[]);
    assert.equal(f.appended.size,0);
    ac.abort();
  } finally {await f.cleanup();}
});
test("two remote clients converge after edit, retain the losing draft, and reconnect reads the disk head", async () => {
  const f = fixture(); const initial = commit(f.repo, "<div>A</div>", "first");
  const a = new RemoteArtifactStore("agent-a", f.rpc), b = new RemoteArtifactStore("agent-a", f.rpc);
  try {
    a.focus(initial.artifactId!); b.focus(initial.artifactId!); await Promise.all([a.refreshPersistent(), b.refreshPersistent()]);
    const stale = b.snapshot()[0].versions.at(-1)!;
    await a.savePersistent(a.snapshot()[0].versions.at(-1)!, "<div>B</div>", "a-edit");
    await assert.rejects(() => b.savePersistent(stale, "<div>my draft</div>", "b-edit"), /Your edits were kept/);
    assert.equal(b.snapshot()[0].versions.at(-1)!.code, "<div>B</div>");
    const reconnected = new RemoteArtifactStore("agent-a", f.rpc); await reconnected.refreshPersistent();
    assert.equal(reconnected.snapshot()[0].versions.at(-1)!.artifactVersion, 2);
    const history = await f.rpc(artifactHistory, { sessionId: "agent-a", artifactId: initial.artifactId!, limit: 1 }); assert.equal("content" in history.items[0], false);
    assert.equal((await f.rpc(artifactGet, { sessionId: "agent-b", artifactId: initial.artifactId! })), null);
    assert.equal((await f.rpc(artifactList, { sessionId: "agent-a" })).items.length, 1);
    reconnected.dispose();
  } finally { a.dispose(); b.dispose(); await f.cleanup(); }
});
test("a separate Node process exits without close and committed versions plus outbox recover from WAL", async t => {
  const temp = temporaryDirectory();
  t.after(temp.discard);
  const folder = temp.directory, file = join(folder, "artifacts.sqlite");
  const stdout = execFileSync(process.execPath, ["--import", "tsx", "test/sqlite-child.mts", file], { encoding: "utf8", windowsHide: true });
  const value = JSON.parse(stdout.trim()), repo = await openRepository(file);
  try { assert.equal(repo.get("child-agent", value.artifactId)!.version.content, "<div>committed-before-exit</div>"); assert.equal(repo.pending().length, 1); }
  finally { repo.close(); }
});
test("server entry initializes only in an explicit isolated data directory and registers all contracts", async t => {
  const temp = temporaryDirectory();
  t.after(temp.discard);
  const directory = temp.directory, previous = process.env.PASEO_ARTIFACT_DATA_DIR;
  const calls: string[] = [];
  process.env.PASEO_ARTIFACT_DATA_DIR = directory;
  try {
    const dispose = await contributeServer({ handle: (contract: any) => calls.push(contract.name), on: () => () => {}, before: () => () => {} } as any);
    assert.deepEqual(calls.sort(), ["artifact.backfill", "artifact.card_placements", "artifact.card_placements_changed", "artifact.failed_notices", "artifact.get", "artifact.history", "artifact.library_get", "artifact.library_list", "artifact.list", "artifact.manage", "artifact.open", "artifact.restore_version", "artifact.save_edit", "artifact.set_locale", "artifact.sidebar_ack", "artifact.sidebar_pending", "artifact.sidebar_refresh_requests", "artifact.sidebar_requests"]);
    await dispose(); const repo = await openRepository(join(directory, "artifacts.sqlite")); repo.close();
  } finally { if (previous === undefined) delete process.env.PASEO_ARTIFACT_DATA_DIR; else process.env.PASEO_ARTIFACT_DATA_DIR = previous; }
});

function ledgerCounts(db: DatabaseSync) {
  return Object.fromEntries(["artifacts", "versions", "outbox", "requests"].map(table =>
    [table, db.prepare("SELECT count(*) n FROM " + table).get()!.n]));
}

test("the locale bridge scopes guides, tools and errors to each daemon", async () => {
  const a = fixture(), b = fixture();
  const config = { provider: "codex", cwd: "/fixture" };
  const guide = (f: ReturnType<typeof fixture>) =>
    f.before.get("agent.create")({ request: { config } }).config.systemPrompt;
  const tools = (f: ReturnType<typeof fixture>, metadata = {}) => f.before.get("agent.session_open")({
    request: { agentId: "agent", provider: "codex", purpose: "interactive", tools: [], metadata },
  }, { paseo: f.paseo }).tools;
  const invalid = { requestId: "bad", format: "html", kind: "react", content: "<main/>", title: "My title" };
  const ctx = (f: ReturnType<typeof fixture>) => ({ agent: { id: "agent" }, paseo: f.paseo, signal: new AbortController().signal });
  try {
    assert.equal(guide(a), getArtifactGuide("en"));
    assert.equal(tools(b, { "paseo-artifact-viewer.guideLocale": "ko" })[0].title, "아티팩트 발행");
    assert.deepEqual(await a.rpc(artifactSetLocale, { locale: "ko-KR" }), { locale: "ko" });
    assert.equal(guide(a), getArtifactGuide("ko"));
    assert.equal(guide(b), getArtifactGuide("en"));
    const korean = tools(a), english = tools(b);
    assert.deepEqual(korean.map((tool: any) => tool.name), english.map((tool: any) => tool.name));
    for (const [i, tool] of korean.entries()) {
      assert.match(tool.title + tool.description, /[가-힣]/);
      assert.doesNotMatch(english[i].title + english[i].description, /[가-힣]/);
    }
    await assert.rejects(korean[0].execute(invalid, ctx(a)), /일치하지 않습니다/);
    await assert.rejects(english[0].execute(invalid, ctx(b)), /must match/);
    const badKey = { ...invalid, kind: undefined, key: "!" };
    assert.match(korean[0].input.safeParse(badKey).error.message, /식별자/);
    assert.match(english[0].input.safeParse(badKey).error.message, /Use a key/);
    for (const [i, invalidInput] of [[0, { ...invalid, title: "x".repeat(101) }], [1, { artifactId: "", version: 0 }], [2, { limit: 101 }], [3, { version: 0 }]] as const) {
      assert.match(korean[i].input.safeParse(invalidInput).error.issues[0].message, /[가-힣]/);
      assert.doesNotMatch(english[i].input.safeParse(invalidInput).error.issues[0].message, /[가-힣]/);
    }
    await assert.rejects(korean[3].execute({}, ctx(a)), /이 대화에/);
    await assert.rejects(english[3].execute({}, ctx(b)), /No matching artifact/);
    assert.deepEqual(await a.rpc(artifactSetLocale, { locale: "fr" }), { locale: "en" });
    assert.equal(guide(a), getArtifactGuide("en"));
  } finally { await a.cleanup(); await b.cleanup(); }
});

test("backfill after a 0.8.8 upgrade preserves the ledger and user titles across language changes", async () => {
  const db = new DatabaseSync(":memory:");
  const legacy = new SqliteArtifactRepository(db);
  const sessionId = "upgrade", content = "<main>Old body</main>", title = "HTML 아티팩트 1";
  // 0.8.8 hashed this exact request for untitled fences. Its DB had no locale table.
  const old = legacy.commit({ sessionId, title, format: "html", content,
    idemKey: JSON.stringify(["extract", sessionId, "old", 0]),
    request: { content, format: "html", title, key: null, artifactId: null },
    origin: { kind: "extract", messageId: "old", blockIndex: 0, legacyId: "msg:old:0" } });
  db.exec("DROP TABLE artifact_host_locale");
  const f = fixture(new SqliteArtifactRepository(db));
  const entry = (seqStart: number, messageId: string, text: string) =>
    ({ seqStart, item: { type: "assistant_message", messageId, text } });
  const entries = [entry(1, "old", "```html\n" + content + "\n```")];
  f.timelines.set(sessionId, entries);
  try {
    assert.equal((await f.service.backfill(sessionId, f.paseo)).conflicts, 0);
    assert.equal(f.repo.get(sessionId, old.artifactId!)?.artifact.title, title);
    assert.deepEqual(ledgerCounts(db), { artifacts: 1, versions: 1, outbox: 1, requests: 1 });
    entries.push(entry(2, "new", "```html\n<div>New body</div>\n```"),
      entry(3, "named", '<artifact type="html" title="아티팩트"><div>Named</div></artifact>'));
    assert.equal((await f.service.backfill(sessionId, f.paseo)).conflicts, 0);
    const counts = ledgerCounts(db);
    assert.deepEqual(f.repo.list(sessionId).items.map(x => x.title).sort(), [title, "HTML artifact 1", "아티팩트"].sort());
    await f.rpc(artifactSetLocale, { locale: "ko" });
    assert.equal((await f.service.backfill(sessionId, f.paseo)).conflicts, 0);
    assert.deepEqual(ledgerCounts(db), counts);
    entries.push(entry(4, "new-ko", '<artifact type="html"><div>New Korean fallback</div></artifact>'));
    assert.equal((await f.service.backfill(sessionId, f.paseo)).conflicts, 0);
    assert.equal(f.repo.list(sessionId).items.filter(x => x.title === "아티팩트").length, 2);
    await f.rpc(artifactSetLocale, { locale: "en" });
    assert.equal((await f.service.backfill(sessionId, f.paseo)).conflicts, 0);
    assert.deepEqual(ledgerCounts(db), { artifacts: 4, versions: 4, outbox: 4, requests: 4 });
  } finally { await f.cleanup(); }
});

test("file deliveries record a durable publish alias across spellings, turn closure and trailing whitespace", async () => {
  for (const tool of ["mcp__paseo__artifact_publish", "paseo.artifact_publish"]) {
    for (const live of [true, false]) for (const trailing of ["", "\n"]) {
      const db = new DatabaseSync(":memory:"), f = fixture(new SqliteArtifactRepository(db));
      const id = "files", entries: any[] = [];
      try {
        for (const version of [1, 2]) {
          const content = "<html>v" + version + "</html>", token = "turn" + version;
          const input = { key: "sample", format: "html" as const, title: "result", requestId: token, content };
          f.service.beginTurn(id, token);
          await f.service.publish(id, input, f.paseo);
          entries.push(...[
            { type: "user_message", text: "artifact" },
            { type: "tool_call", name: tool, status: "completed", callId: "pub" + version, detail: { type: "unknown", input } },
            { type: "tool_call", name: "Write", status: "completed", callId: "write" + version, detail: { type: "write", filePath: "sample.html", content: content + trailing } },
            { type: "assistant_message", text: "[artifact](sample.html)", messageId: "reply" + version },
          ].map((item, i) => ({ item, seqStart: entries.length + i })));
          f.timelines.set(id, entries);
          if (!live) await f.service.endTurn(id, token);
          await f.service.backfill(id, f.paseo, live ? token : null, live);
          if (live) await f.service.endTurn(id, token);
          const counts = { artifacts: 1, versions: version, outbox: version, requests: 2 * version };
          assert.deepEqual(ledgerCounts(db), counts);
          assert.equal(f.appended.size, version);
          assert.equal(db.prepare("SELECT count(*) n FROM requests WHERE alias=1").get()!.n, version);
          await f.service.backfill(id, f.paseo);
          assert.deepEqual(ledgerCounts(db), counts);
        }
      } finally { await f.cleanup(); }
    }
  }
});

test("file matching respects ownership, format, ambiguity, historical versions and tombstones", () => {
  const repo = repository();
  const file = (content: string, requestId: string, sessionId = "agent-a", format: "html" | "svg" = "html") =>
    repo.commit({ sessionId, key: "file-" + requestId, inferredKey: true, format, content, title: "linked", request: { content }, idemKey: requestId, origin: { kind: "extract" } });
  try {
    const first = commit(repo, "A", "one");
    commit(repo, "B", "two");
    assert.deepEqual(file(" A\n", "historic"), { status: "ok", artifactId: first.artifactId, version: 1, alias: true });
    assert.equal(repo.headVersion("agent-a", first.artifactId!), 2);
    assert.notEqual(file("A", "other", "other-session").artifactId, first.artifactId);
    assert.notEqual(file("A", "format", "agent-a", "svg").artifactId, first.artifactId);
    assert.notEqual(file("C", "different").artifactId, first.artifactId);
    repo.manage("agent-a", first.artifactId!, { type: "delete" });
    assert.deepEqual(file("A", "hidden"), { status: "ok", artifactId: first.artifactId, version: 1, alias: true });
    assert.equal(repo.libraryGet(first.artifactId!), null);
    const other = commit(repo, "A", "three", "agent-a", "separate");
    assert.equal(file("A", "mixed").status, "conflict");
    repo.manage("agent-a", first.artifactId!, { type: "restore" });
    assert.ok(![first.artifactId, other.artifactId].includes(file("A", "ambiguous").artifactId));
  } finally { repo.close(); }
});

test("anonymous extraction preserves A/B/A through renumbering and a moving 1000-entry tail", async () => {
  const db = new DatabaseSync(":memory:"), f = fixture(new SqliteArtifactRepository(db)), id = "replay";
  let epoch = "old";
  const handle = f.paseo.agents.ref(id);
  f.paseo.agents.ref = () => ({ timeline: { ...handle.timeline, refetch: async (q: any) => ({ ...await handle.timeline.refetch(q), epoch }) } });
  const entry = (body: string, seqStart: number) => ({ seqStart, item: { ...message("x", "<main>" + body + "</main>").item, messageId: undefined } });
  const backfill = async (items: any[]) => { f.timelines.set(id, items); assert.equal((await f.service.backfill(id, f.paseo)).conflicts, 0); };
  try {
    await backfill([entry("A", 1), entry("B", 2), entry("A", 3)]);
    const counts = { artifacts: 1, versions: 3, outbox: 3, requests: 3 };
    assert.deepEqual(ledgerCounts(db), counts);
    epoch = "renumbered";
    const repeated = [entry("A", 10), entry("B", 11), entry("A", 12)];
    await backfill(repeated);
    assert.deepEqual(ledgerCounts(db), counts);
    const padding = Array.from({ length: 998 }, (_, i) => ({ seqStart: 13 + i, item: { type: "assistant_message", text: "plain" } }));
    await backfill([...repeated, ...padding]);
    assert.deepEqual(ledgerCounts(db), counts);
    await backfill([...repeated, ...padding, entry("A", 1011)]);
    assert.equal(ledgerCounts(db).versions, 4);
    epoch = "different";
    await backfill([entry("C", 10)]);
    assert.equal(f.repo.libraryGet(f.repo.latestId(id)!)!.version.content, "<main>C</main>");
    assert.equal(ledgerCounts(db).versions, 5);
  } finally { await f.cleanup(); }
});

test("deleted publish targets explain recovery and allow a new revision after restore", async () => {
  const db = new DatabaseSync(":memory:"), f = fixture(new SqliteArtifactRepository(db)), id = "agent-a";
  const request = { agentId: id, provider: "codex", purpose: "interactive", tools: [] };
  const tools = f.before.get("agent.session_open")({ request }, { paseo: f.paseo }).tools;
  const publish = (input: any) => tools.find((t: any) => t.name === "artifact_publish").execute(input, { agent: { id }, paseo: f.paseo, signal: new AbortController().signal });
  try {
    const artifactId = commit(f.repo, "A", "p").artifactId!;
    f.repo.manage(id, artifactId, { type: "delete" });
    const counts = ledgerCounts(db);
    const input = { key: "counter", format: "html", title: "changed", requestId: "next", content: "B" };
    for (const target of [input, { ...input, key: undefined, artifactId }]) {
      const result = await publish(target);
      assert.equal(result.isError, true);
      assert.equal(result.structuredContent.status, "conflict");
      assert.equal(result.structuredContent.reason, "deleted");
      assert.match(result.structuredContent.message, /Restore.*different key/);
      assert.deepEqual(ledgerCounts(db), counts);
    }
    f.repo.manage(id, artifactId, { type: "restore" });
    assert.equal((await f.service.publish(id, input as any, f.paseo)).version, 2);
  } finally { await f.cleanup(); }
});

test("outbox exhausts its retry budget once, exposes failures, and reopens the same card", async () => {
  const db = new DatabaseSync(":memory:"), repo = new SqliteArtifactRepository(db), f = fixture(repo);
  const id = "agent-a", artifact = commit(repo, "A", "p"), logs: string[] = [];
  const service = new ArtifactService(repo, line => logs.push(line));
  let failing = true, calls = 0;
  const written: string[] = [];
  const paseo: any = { agents: { ref: () => ({ timeline: { append: async (row: any) => { calls++; if (failing) throw new Error("offline"); written.push(row.id); } } }) } };
  try {
    let now = 0;
    for (let n = 0; n < 24; n++) {
      if (n === 23) assert.equal(now, 4_350_000);
      await service.flush(paseo, now);
      now = Number(db.prepare("SELECT next FROM outbox").get()!.next);
    }
    assert.equal(calls, 24);
    assert.equal(logs.filter(line => line.includes("delivery failed")).length, 1);
    await service.flush(paseo, Number.MAX_SAFE_INTEGER);
    assert.equal(calls, 24);
    assert.equal(logs.length, 24);
    const cardId = "artifact:" + artifact.artifactId + ":1";
    assert.deepEqual(f.handlers.get("artifact.failed_notices")({ sessionId: id, limit: 10 }), { items: [{ id: cardId, artifactId: artifact.artifactId, version: 1, attempts: 24 }], cursor: null });
    assert.equal(repo.get(id, artifact.artifactId!)!.version.content, "A");
    const archive = { agents: { ref: () => ({ refresh: async () => ({ agent: { status: "idle", archivedAt: "archived" } }),
      timeline: { refetch: async () => ({ entries: [], epoch: "archive" }), append: async () => { throw new Error("terminal card was retried"); } } }) } };
    assert.deepEqual((await service.placements.read(id, archive as any)).items, []);
    repo.requeueFailed("other");
    assert.equal(repo.failedNotices(id).items.length, 1);
    f.before.get("agent.session_open")({ request: { agentId: id, purpose: "history" } }, { paseo });
    assert.equal(repo.failedNotices(id).items.length, 1, "viewing history cannot rearm delivery");
    f.before.get("agent.session_open")({ request: { agentId:id, provider:"codex", purpose:"interactive", tools:[] } }, { paseo });
    assert.deepEqual(repo.pending().map(row => [row.id, row.attempts]), [[cardId, 0]]);
    failing = false;
    await service.flush(paseo);
    await service.flush(paseo);
    assert.deepEqual(written, [cardId]);
    assert.equal(repo.failedNotices(id).items.length, 0);
    for (const action of [{ type: "rename", title: "new" }, { type: "pin", pinned: true }, { type: "delete" }, { type: "restore" }] as const) {
      db.exec("UPDATE outbox SET state='failed',attempts=24");
      repo.manage(id, artifact.artifactId!, action);
      assert.deepEqual(repo.pending().map(row => [row.id, row.attempts]), [[cardId, 0]]);
    }
  } finally { await f.cleanup(); }
});

test("after a truncated replacement, a new repeat cannot spend an occurrence outside the replay window", async () => {
  const db = new DatabaseSync(":memory:"), f = fixture(new SqliteArtifactRepository(db));
  const id = "window", handle = f.paseo.agents.ref(id);
  let epoch = "first";
  f.paseo.agents.ref = () => ({ timeline: { ...handle.timeline, refetch: async (q: any) => ({ ...await handle.timeline.refetch(q), epoch }) } });
  const reply = (seqStart: number) => ({ seqStart, item: { ...message("unused", "<main>A</main>").item, messageId: undefined } });
  const padding = Array.from({ length: 999 }, (_, i) => ({ seqStart: i + 10, item: { type: "notification", text: "padding" } }));
  try {
    f.timelines.set(id, [reply(1), reply(2)]);
    await f.service.backfill(id, f.paseo);
    epoch = "second";
    f.timelines.set(id, [...padding, reply(2000)]);
    await f.service.backfill(id, f.paseo);
    assert.equal(ledgerCounts(db).versions, 2);
    f.timelines.get(id)!.push(reply(2001));
    await f.service.backfill(id, f.paseo);
    assert.equal(ledgerCounts(db).versions, 3);
    epoch = "prose-only";
    f.timelines.set(id, padding);
    await f.service.backfill(id, f.paseo);
    f.timelines.get(id)!.push(reply(3000));
    await f.service.backfill(id, f.paseo);
    assert.equal(ledgerCounts(db).versions, 4);
  } finally { await f.cleanup(); }
});

test("when turn completion overlaps a new prompt, the older reply aliases its publish and the new reply waits", async () => {
  const f = fixture(), id = "overlap";
  try {
    f.service.beginTurn(id, "first");
    const body = "<main>First result</main>";
    const first = await f.service.publish(id, { requestId: "first", key: "counter", title: "First", format: "html", content: body }, f.paseo);
    f.timelines.set(id, [
      { seqStart: 1, turnId: "first", item: { type: "user_message", text: "first" } },
      { ...message("first-reply", body, "counter", 2), turnId: "first" },
      { seqStart: 3, turnId: "second", item: { type: "user_message", text: "second" } },
      { ...message("second-reply", "<main>Second result</main>", "other", 4), turnId: "second" },
    ]);
    f.service.beginTurn(id, "second");
    await f.service.backfill(id, f.paseo, "first", true);
    assert.equal(f.repo.get(id, first.artifactId!)?.artifact.headVersion, 1);
    assert.deepEqual(f.repo.list(id).items.map(item => item.key), ["counter"]);
    await f.service.endTurn(id, "first");
    await f.service.backfill(id, f.paseo, "second", true);
    await f.service.endTurn(id, "second");
    assert.equal(f.repo.get(id, first.artifactId!)?.artifact.headVersion, 1);
    assert.deepEqual(f.repo.list(id).items.map(item => item.key).sort(), ["counter", "other"]);
    assert.equal(f.appended.size, 0);
    assert.deepEqual((await f.service.placements.read(id,f.paseo)).items.map(p=>p.messageId).sort(),["first-reply","second-reply"]);
  } finally { await f.cleanup(); }
});

test("late historical extraction does not replace a more recent explicit publication", async () => {
  const f = fixture(), id = "late-history";
  try {
    const previous = { ...message("old", "<main>old</main>"), timestamp: new Date(Date.now() - 60_000).toISOString() };
    f.service.beginTurn(id, "new-turn");
    const latest = await f.service.publish(id, { requestId: "new", key: "counter", title: "Current", format: "html", content: "<main>new</main>" }, f.paseo);
    f.timelines.set(id, [previous, { seqStart: 2, item: { type: "user_message", text: "update the result" } }]);
    await f.service.backfill(id, f.paseo, "new-turn", true);
    await f.service.endTurn(id, "new-turn");
    await f.service.backfill(id, f.paseo);
    assert.equal(f.repo.get(id, latest.artifactId!)?.version.content, "<main>new</main>");
    assert.equal(f.repo.history(id, latest.artifactId!).items.length, 1);
    const following = { ...message("next", "<main>next</main>", "counter", 3), timestamp: new Date(Date.now() + 1_000).toISOString() };
    f.timelines.get(id)!.push(following);
    await f.service.backfill(id, f.paseo);
    assert.equal(f.repo.get(id, latest.artifactId!)?.version.content, "<main>next</main>");
  } finally { await f.cleanup(); }
});

test("opening a conversation while a turn is active cannot duplicate the published artifact", async () => {
  const f = fixture();
  try {
    for (const [id, explicit] of [["with-key", true], ["without-key", false]] as const) {
      const body = "<main>Same result</main>";
      f.service.beginTurn(id, "active");
      await f.service.publish(id, { requestId: "one", key: "counter", title: "First", format: "html", content: body }, f.paseo);
      const result = message("answer", body, "counter", 2);
      if (!explicit) result.item.text = result.item.text.replace(' artifact="counter"', "");
      f.timelines.set(id, [{ seqStart: 1, item: { type: "user_message", text: "create" } }, result]);
      await f.service.backfill(id, f.paseo);
      assert.equal([...f.appended.keys()].filter(key => key.startsWith(id + ":")).length, 0);
      await f.service.backfill(id, f.paseo, "active", true);
      await f.service.endTurn(id, "active");
      assert.deepEqual(f.repo.list(id).items.map(item => item.headVersion), [1]);
      assert.equal([...f.appended.keys()].filter(key => key.startsWith(id + ":")).length, 1);
    }
  } finally { await f.cleanup(); }
});

test("a blocked append in one session does not block a different session's publication", async () => {
  const f = fixture();
  let release!: () => void, started!: () => void;
  const blocked = new Promise<void>(resolve => { release = resolve; });
  const ready = new Promise<void>(resolve => { started = resolve; });
  const ref = f.paseo.agents.ref;
  f.paseo.agents.ref = (id: string) => {
    const handle = ref(id);
    if (id !== "delayed") return handle;
    return { ...handle, timeline: { ...handle.timeline, append: async (item: any) => {
      started();
      await blocked;
      return handle.timeline.append(item);
    } } };
  };
  let delayed: Promise<MutationResult> | undefined;
  const deadline = (label: string) => new Promise<never>((_, reject) => { setTimeout(() => reject(new Error(label)), 1500).unref(); });
  try {
    delayed = f.service.publish("delayed", { requestId: "one", title: "Delayed", format: "html", content: "<main>A</main>" }, f.paseo);
    await Promise.race([ready, deadline("The first append did not start")]);
    const result = await Promise.race([
      f.service.publish("independent", { requestId: "one", title: "Independent", format: "html", content: "<main>B</main>" }, f.paseo),
      deadline("The second publication waited for the first conversation"),
    ]);
    assert.equal(result.status, "ok");
    assert.equal(f.appended.size, 1);
    assert.ok([...f.appended.keys()][0].startsWith("independent:"));
  } finally {
    release();
    await delayed;
    await f.cleanup();
  }
});

test("a linked HTML file remains deliverable after a completed deletion edit", async () => {
  const f = fixture(), id = "file-edit-delete";
  try {
    const removed = "<aside>Draft</aside>";
    const source = "<html><body>" + removed + "<main>Kept</main></body></html>";
    f.timelines.set(id, [
      { seqStart: 1, item: { type: "user_message", text: "Make an artifact" } },
      { seqStart: 2, item: { type: "tool_call", callId: "write", status: "completed", detail: { type: "write", filePath: "result.html", content: source } } },
      { seqStart: 3, item: { type: "tool_call", callId: "edit", status: "completed", detail: { type: "edit", filePath: "result.html", oldString: removed, newString: "" } } },
      { seqStart: 4, item: { type: "assistant_message", messageId: "link", text: "[Open artifact](result.html)" } },
    ]);
    await f.service.backfill(id, f.paseo);
    const [summary] = f.repo.list(id).items;
    assert.equal(f.repo.get(id, summary.artifactId)?.version.content, source.replace(removed, ""));
    assert.equal(f.appended.size, 0);
    assert.deepEqual((await f.service.placements.read(id,f.paseo)).items.map(p=>p.messageId),["link"]);
  } finally { await f.cleanup(); }
});

test("backfill rejects incomplete history pages before writing any part of the conversation", async () => {
  const f = fixture();
  try {
    const first = { entries: [message("source", "<main>first</main>")], epoch:"e", hasOlder:true, startCursor:"older" };
    for (const fault of [{gap:true}, {reset:true}, {staleCursor:true}, {error:"history unavailable"}]) {
      for (const faultyPage of [1, 2]) {
        let reads = 0;
        const api = { agents: { ref: () => ({timeline:{refetch: async () => {
          reads++;
          const page = reads === 1 ? first : {entries:[],epoch:"e",hasOlder:false};
          return reads === faultyPage ? {...page,...fault} : page;
        }}}) } };
        await assert.rejects(f.service.backfill("s", api as any), /history changed/i);
        assert.deepEqual(f.repo.list("s").items, []);
      }
    }
  } finally { await f.cleanup(); }
});

test("reading an unsaved historical reply is read-only; an explicit import persists it once", async () => {
  const db = new DatabaseSync(":memory:");
  const f = fixture(new SqliteArtifactRepository(db));
  const sessionId = "legacy-history";
  f.timelines.set(sessionId, [message("legacy", "<main>Legacy</main>", "demo", 1)]);
  const agent = f.paseo.agents.ref(sessionId);
  agent.timeline.subscribe = () => Object.assign(() => {}, { ready: Promise.resolve() });
  const store = new RemoteArtifactStore(sessionId, f.rpc);
  const errors: (string | null)[] = [];
  db.exec("PRAGMA query_only=ON");
  const observer = observeArtifacts(agent, store, error => errors.push(error));
  try {
    await new Promise(resolve => setImmediate(resolve));
    assert.deepEqual(errors, [null]);
    assert.equal(f.repo.list(sessionId).items.length, 0);
    assert.equal(f.appended.size, 0);
    db.exec("PRAGMA query_only=OFF");
    await observer.refresh();
    await observer.refresh();
    assert.deepEqual(f.repo.list(sessionId).items.map(row => row.headVersion), [1]);
    assert.equal(f.appended.size, 0);
    assert.equal(errors.filter(Boolean).length, 0);
  } finally {
    observer.dispose();
    store.dispose();
    await f.cleanup();
  }
});
