import test from "node:test";
import assert from "node:assert/strict";
import { createPlacementIndex, visiblePlacements, type PlacementEntry, type PlacementPage } from "../src/client/placements";
import { fingerprint } from "../src/shared/artifacts";

const flush = () => new Promise<void>(resolve => setImmediate(resolve));
const notice = (artifactId: string, artifactVersion = 1, extra: object = {}) => ({ artifactId, artifactVersion, title: artifactId, format: "html" as const, originKind: "extract" as const, ...extra });
const text = "answer text";
const entry = (sessionId: string, messageId: string, artifactId: string, extra: Partial<PlacementEntry> = {}, version = 1): PlacementEntry =>
  ({ sessionId, messageId, textHash: fingerprint(text), notice: notice(artifactId, version, { placement: "legacy" }), ...extra });

function harness(pages: Record<string, PlacementPage | Error | (() => Promise<PlacementPage>)>) {
  const calls: (string | undefined)[] = [];
  const index = createPlacementIndex(async id => {
    calls.push(id);
    const page = pages[id ?? "*"];
    if (typeof page === "function") return page();
    if (page instanceof Error) throw page;
    return page ?? { items: [] };
  });
  let changes = 0; index.subscribe(() => { changes++; });
  return { index, calls, changes: () => changes };
}

test("a conversation is read once however many replies and rows ask, and each read changes the index once", async () => {
  const { index, calls, changes } = harness({ s1: { items: [entry("s1", "m1", "a"), entry("s1", "m2", "b")] } });
  await Promise.all([index.ensure("s1"), index.ensure("s1"), index.ensure("s1")]);
  index.ensure("s1");
  assert.deepEqual(calls, ["s1"]); assert.equal(changes(), 1);
  assert.equal(index.lookup("m1", text).length, 1); assert.equal(index.lookup("nope", text).length, 0);
  await index.refresh("s1"); assert.equal(changes(), 1, "an unchanged re-read does not recompute the timeline");
});

test("only proven rows count: another conversation, a different reply text, and exact duplicates are dropped", async () => {
  const { index } = harness({ s1: { items: [
    entry("s1", "m1", "a"), entry("s1", "m1", "a"), entry("s1", "m1", "a", { blockIndex: 0 }),
    entry("s1", "m1", "a", { textHash: "other" }, 2), entry("s2", "m1", "stranger"), entry("s1", "m1", "a", {}, 3),
  ] } });
  await index.ensure("s1");
  const found = index.lookup("m1", text);
  // a v1 (block-bound wins over the supplementary duplicate), a v3; v2 has another text, s2 never loaded for s1
  assert.deepEqual(found.map(card => [card.notice.artifactId, card.notice.artifactVersion, card.blockIndex]), [["a", 1, 0], ["a", 3, undefined]]);
});

test("the same message id in two conversations is told apart by the conversation of each card", async () => {
  const { index } = harness({ s1: { items: [entry("s1", "m1", "one")] }, s2: { items: [entry("s2", "m1", "two")] } });
  await Promise.all([index.ensure("s1"), index.ensure("s2")]);
  const placed = index.lookup("m1", text);
  assert.equal(placed.length, 2);
  assert.deepEqual(visiblePlacements(placed, "s1", 0).extra.map(n => n.artifactId), ["one"]);
  assert.deepEqual(visiblePlacements(placed, "s2", 0).extra.map(n => n.artifactId), ["two"]);
  assert.equal(visiblePlacements(placed, "s3", 0).extra.length, 0);
});

test("visible placements: a card replaces its fenced block, stray indexes and shown artifacts are never repeated", () => {
  const card = (artifactId: string, blockIndex?: number, version = 1) => ({ sessionId: "s", blockIndex, notice: notice(artifactId, version) });
  const result = visiblePlacements([card("a", 0), card("a", 0, 2), card("b", 5), card("c"), card("c"), card("fenced"), card("d", undefined, 2), card("d", undefined, 3)], "s", 2, [undefined, "fenced"]);
  assert.deepEqual([...result.forBlock].map(([index, n]) => [index, n.artifactId]), [[0, "a"]]);
  assert.deepEqual(result.extra.map(n => `${n.artifactId}${n.artifactVersion}`), ["c1", "d2", "d3"]);
});

test("host-wide start seeds verified rows and returns the sessions, then the open read replaces them", async () => {
  const { index, calls } = harness({ "*": { items: [entry("s1", "m1", "a")], sessions: ["s1", "s2"] }, s1: { items: [entry("s1", "m1", "a"), entry("s1", "m3", "z")] } });
  assert.deepEqual(await index.bootstrap(), ["s1", "s2"]);
  assert.equal(index.lookup("m1", text).length, 1); assert.equal(index.lookup("m3", text).length, 0);
  await index.ensure("s1");
  assert.deepEqual(calls, [undefined, "s1"]); assert.equal(index.lookup("m3", text).length, 1);
  await index.bootstrap();
  assert.equal(index.lookup("m3", text).length, 1, "a later host-wide cache never overwrites a conversation read on its own");
});

test("a failed read (history not ready yet) is retried after a pause", async () => {
  let attempt = 0, session = "f";
  const pages: Record<string, () => Promise<PlacementPage>> = {
    f: async () => { if (++attempt === 1) throw new Error("history not ready"); return { items: [entry("f", "m1", "a")] }; },
  };
  const errors = console.error; console.error = () => {};
  try {
    const { index, calls } = harness(pages);
    await index.ensure(session); assert.equal(index.lookup("m1", text).length, 0);
    await new Promise(resolve => setTimeout(resolve, 2100)); await flush();
    assert.equal(calls.length, 2); assert.equal(index.lookup("m1", text).length, 1);
    index.dispose();
  } finally { console.error = errors; }
});

test("an invalidation during a read queues exactly one more read", async () => {
  let release!: () => void, reads = 0;
  const index = createPlacementIndex(async () => { reads++; await new Promise<void>(resolve => { release = resolve; }); return { items: [entry("s", `m${reads}`, "a")] }; });
  const first = index.ensure("s"); index.refresh("s"); index.refresh("s");
  await flush(); release(); await flush(); await flush(); release(); await first; await flush();
  assert.equal(reads, 2); assert.equal(index.lookup("m2", text).length, 1); assert.equal(index.lookup("m1", text).length, 0);
});
