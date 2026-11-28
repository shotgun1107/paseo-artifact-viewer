import test, { after } from "node:test";
import assert from "node:assert/strict";
import { DatabaseSync } from "node:sqlite";
import { mkdirSync, writeFileSync } from "node:fs";
import { resolve, join } from "node:path";
import { SqliteArtifactRepository } from "../src/server/repository";
import { RemoteArtifactStore } from "../src/client/remote-store";
import { observeArtifacts } from "../src/client/timeline";
import { serverHarness } from "./server-harness";

/**
 * Real RPC traffic of the conversation store against the real server handlers (no daemon, no provider).
 * Every scenario counts the calls the client really makes; the numbers are written to
 * `$PASEO_ARTIFACT_BUILD_DIR/remote-store-metrics.json` when that variable is set, and asserted here.
 */
const session = "remote-store-test", metrics: Record<string, Record<string, number>> = {};
after(() => {
  const dir = process.env.PASEO_ARTIFACT_BUILD_DIR;
  if (!dir) return;
  mkdirSync(resolve(dir), { recursive: true });
  writeFileSync(join(resolve(dir), "remote-store-metrics.json"), JSON.stringify(metrics, null, 2));
});

function fixture() {
  const repo = new SqliteArtifactRepository(new DatabaseSync(":memory:")), host = serverHarness(repo);
  const counts: Record<string, number> = {}, calls: { name: string; input: any }[] = [];
  let afterList: (() => void | Promise<void>) | undefined;
  const rpc = async (contract: any, input: any) => {
    counts[contract.name] = (counts[contract.name] ?? 0) + 1; calls.push({ name: contract.name, input });
    const result = await host.rpc(contract.name, input);
    // The list answer is already read: whatever happens next is newer than this answer.
    if (contract.name === "artifact.list" && afterList) { const run = afterList; afterList = undefined; await run(); }
    return result;
  };
  const publish = (key: string, revision: number) => {
    const value = repo.commit({ sessionId: session, key, title: key, format: "html", content: `<p>v${revision}</p>`, idemKey: JSON.stringify([session, key, revision]), request: { key, revision }, origin: { kind: "publish" } });
    if (value.status !== "ok") throw new Error("fixture commit failed");
    return value.artifactId;
  };
  return {
    repo, host, counts, calls, rpc, publish,
    reset() { for (const key of Object.keys(counts)) delete counts[key]; calls.length = 0; },
    /** Server reads of one artifact, by RPC name: `artifact.get` calls (head or a revision) and `artifact.history` calls. */
    reads: (name: "artifact.get" | "artifact.history", artifactId: string) => calls.filter(call => call.name === name && call.input.artifactId === artifactId).length,
    afterNextList(run: () => void | Promise<void>) { afterList = run; },
    snapshot: () => ({ list: counts["artifact.list"] ?? 0, history: counts["artifact.history"] ?? 0, get: counts["artifact.get"] ?? 0 }),
    close: () => host.cleanup(),
  };
}
const record = (name: string, value: Record<string, number>) => { metrics[name] = value; return value; };
const revisions = (store: RemoteArtifactStore) => store.snapshot().flatMap(r => r.versions.map(v => `${r.artifactId}:${v.artifactVersion}`));

test("a burst of equivalent observation refreshes (cards mounting) is one list call, not one plus a trailing", async () => {
  const f = fixture(), store = new RemoteArtifactStore(session, f.rpc as any);
  try {
    const ids = Array.from({ length: 12 }, (_, index) => f.publish(`card-${index}`, 1));
    f.reset();
    // Twelve saved cards mount at once; each asks what the server has and knows the version it displays.
    await Promise.all(ids.map(id => store.refreshPersistent({ observe: true, know: { artifactId: id, version: 1 } } as any)));
    const burst = record("observation-burst", { ...f.snapshot(), cards: ids.length });
    assert.deepEqual(burst, { list: 1, history: 0, get: 12, cards: 12 });
    assert.equal(store.snapshot().length, 12);
    // Nothing changed: a following refresh reloads no body (heads are cached).
    f.reset(); await store.refreshPersistent({ observe: true });
    assert.deepEqual(f.snapshot(), { list: 1, history: 0, get: 0 });
  } finally { store.dispose(); await f.close(); }
});

test("an observation that knows a version the in-flight answer lacks still gets a trailing refresh; one that is satisfied does not", async () => {
  const f = fixture(), store = new RemoteArtifactStore(session, f.rpc as any);
  try {
    const id = f.publish("timer", 1);
    await store.refreshPersistent(); f.reset();
    let joined!: Promise<void>;
    f.afterNextList(() => { f.publish("timer", 2); joined = store.refreshPersistent({ observe: true, know: { artifactId: id, version: 2 } } as any); });
    await store.refreshPersistent({ observe: true });
    await joined;
    record("know-unsatisfied", f.snapshot());
    assert.equal(f.snapshot().list, 2);
    assert.equal(store.snapshot()[0].headVersion, 2);

    f.reset();
    f.afterNextList(() => { joined = store.refreshPersistent({ observe: true, know: { artifactId: id, version: 2 } } as any); });
    await store.refreshPersistent({ observe: true });
    await joined;
    record("know-satisfied", f.snapshot());
    assert.equal(f.snapshot().list, 1);
  } finally { store.dispose(); await f.close(); }
});

test("true invalidations keep their trailing refresh: mutation, saved edit, restore, timeline artifact, changed focus", async () => {
  const f = fixture(), store = new RemoteArtifactStore(session, f.rpc as any);
  try {
    const one = f.publish("one", 1), two = f.publish("two", 1), three = f.publish("three", 1);
    f.publish("three", 2); f.publish("three", 3);
    await store.refreshPersistent();

    // A plain call (what the sidebar, library actions and timeline use) is an invalidation.
    f.reset();
    let joined!: Promise<void>;
    f.afterNextList(() => { f.repo.manage(session, one, { type: "rename", title: "Renamed" }); joined = store.refreshPersistent(); });
    await store.refreshPersistent({ observe: true }); await joined;
    assert.equal(f.snapshot().list, 2);
    assert.equal(store.snapshot().find(r => r.artifactId === one)!.title, "Renamed");

    // The store's own mutation.
    f.reset();
    f.afterNextList(() => { f.repo.manage(session, two, { type: "rename", title: "Second" }); joined = store.manage(one, { type: "pin", pinned: true }).then(() => undefined); });
    await store.refreshPersistent({ observe: true }); await joined;
    record("invalidate-manage", f.snapshot());
    assert.equal(f.snapshot().list, 2);
    assert.equal(store.snapshot().find(r => r.artifactId === two)!.title, "Second");
    assert.equal(store.snapshot().find(r => r.artifactId === one)!.pinned, true);

    // A focus change while a read runs: that read began too early, so one more follows and loads the focused history.
    f.reset();
    f.afterNextList(() => { store.focus(three); });
    await store.refreshPersistent({ observe: true });
    record("invalidate-focus", f.snapshot());
    assert.equal(f.snapshot().list, 2);
    assert.equal(f.reads("artifact.history", three), 1);
    assert.deepEqual(store.snapshot().find(r => r.artifactId === three)!.versions.map(v => v.artifactVersion), [1, 2, 3]);

    // Timeline plugin event / turn end / reconnect call the store without `observe`.
    const refreshes: any[] = [];
    let emit!: (value: any) => void;
    const fake: any = { ...store, refreshPersistent: (options?: unknown) => { refreshes.push(options); return Promise.resolve(); }, backfillPersistent: () => Promise.resolve(), ingest() {}, replace() {}, clear() {} };
    const agent: any = { timeline: { subscribe(callback: any) { emit = callback; return Object.assign(() => {}, { ready: new Promise(() => {}) }); }, refetch: async () => ({ entries: [], epoch: "e", hasOlder: false }) } };
    const observer = observeArtifacts(agent, fake, () => {});
    emit({ event: { type: "timeline", item: { type: "plugin", kind: "artifact" } } });
    emit({ event: { type: "turn_completed" } });
    emit({ event: { type: "subscription_restored" } });
    await new Promise(resolve => setImmediate(resolve)); observer.dispose();
    // The plugin event reads at once; the turn end is superseded by the newer reconnect read, which reads after its history.
    assert.equal(refreshes.length, 2);
    assert.ok(refreshes.every(options => options === undefined), "timeline-driven refreshes are plain invalidations");
  } finally { store.dispose(); await f.close(); }
});

test("a new head on the focused artifact loads only the new body; cached immutable revisions are reused", async () => {
  const f = fixture(), store = new RemoteArtifactStore(session, f.rpc as any);
  try {
    const id = f.publish("long", 1);
    for (let i = 2; i <= 25; i++) f.publish("long", i);
    f.reset();
    store.focus(id); await store.refreshPersistent({ observe: true });
    const first = record("focus-first-load", f.snapshot());
    assert.equal(first.get, 20);

    f.publish("long", 26);
    f.reset(); await store.refreshPersistent();
    const next = record("focus-new-head", f.snapshot());
    assert.equal(next.get, 1);
    assert.equal(store.snapshot()[0].headVersion, 26);
    const have = store.snapshot()[0].versions.map(v => v.artifactVersion);
    assert.deepEqual(have, Array.from({ length: 20 }, (_, i) => 7 + i));
    for (const v of store.snapshot()[0].versions) assert.equal(v.code, `<p>v${v.artifactVersion}</p>`);

    // Focus moves to a second artifact that was cached only by its head: its history reuses that body.
    const other = f.publish("other", 1);
    for (let i = 2; i <= 6; i++) f.publish("other", i);
    await store.refreshPersistent(); f.reset();
    store.focus(other); await store.refreshPersistent({ observe: true });
    const moved = record("focus-moves", f.snapshot());
    assert.equal(moved.get, 5);
  } finally { store.dispose(); await f.close(); }
});

test("an off-page focused target is fetched once, with its requested old revision, and a new head keeps that revision", async () => {
  const f = fixture(), store = new RemoteArtifactStore(session, f.rpc as any);
  try {
    const target = f.publish("target", 1);
    for (let i = 2; i <= 25; i++) f.publish("target", i);
    for (let i = 0; i < 45; i++) f.publish(`filler-${i}`, 1);
    // What SessionDetail.load does: focus() already reads, the explicit call shares that read. Counting starts first.
    f.reset();
    store.focus(target, 1);
    await store.refreshPersistent({ observe: true });
    const first = record("off-page-focus", f.snapshot());
    // 39 listed heads (the cache holds 40 records and the target takes one), the target's head (v25) once,
    // its window v6..v24 and the requested v1.
    assert.equal(first.get, 39 + 1 + 19 + 1);
    // Head body once (v25 via the lookup), v6..v24 and the requested v1: 21 reads, one history call.
    assert.equal(f.reads("artifact.get", target), 21);
    assert.equal(f.reads("artifact.history", target), 1);
    assert.ok(revisions(store).includes(`${target}:1`));
    assert.ok(revisions(store).includes(`${target}:25`));

    f.publish("target", 26);
    f.reset(); await store.refreshPersistent({ observe: true });
    const next = record("off-page-new-head", f.snapshot());
    assert.equal(f.reads("artifact.get", target), 1);
    assert.ok(revisions(store).includes(`${target}:1`), "the requested old revision stays cached");
    assert.ok(revisions(store).includes(`${target}:26`));
    assert.equal(next.get, 1);
  } finally { store.dispose(); await f.close(); }
});

test("drafts, failures and retries behave as before", async () => {
  const f = fixture(), store = new RemoteArtifactStore(session, f.rpc as any);
  try {
    const id = f.publish("draft", 1);
    await store.refreshPersistent();
    store.ingest([{ id: "draft", title: "draft", kind: "html", code: "<p>typing</p>", complete: false, explicit: true }], "msg:live", new Date().toISOString(), true);
    assert.equal(store.snapshot()[0].draft?.code, "<p>typing</p>");
    f.publish("draft", 2);
    await store.refreshPersistent();
    assert.equal(store.snapshot()[0].headVersion, 2);
    assert.equal(store.snapshot()[0].draft?.code, "<p>typing</p>", "a streaming draft is not a saved body and survives a refresh");
    assert.ok(store.snapshot()[0].versions.every(v => v.artifactVersion && v.source.startsWith(`stored:${id}:`)));

    // A failing server call rejects every joined caller and leaves the store retryable.
    let broken = true;
    const flaky = new RemoteArtifactStore(session, ((contract: any, input: any) => broken ? Promise.reject(new Error("offline")) : f.rpc(contract, input)) as any);
    const results = await Promise.allSettled([flaky.refreshPersistent({ observe: true } as any), flaky.refreshPersistent({ observe: true } as any), flaky.refreshPersistent()]);
    assert.deepEqual(results.map(r => r.status), ["rejected", "rejected", "rejected"]);
    broken = false;
    await flaky.refreshPersistent();
    assert.equal(flaky.snapshot().length, 1);
    flaky.dispose();
    // Another conversation's artifacts never appear (every call carries this store's session).
    assert.ok(f.calls.every(call => call.input.sessionId === session));
  } finally { store.dispose(); await f.close(); }
});
