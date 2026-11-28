import test from "node:test";
import assert from "node:assert/strict";
import { observeArtifacts } from "../src/client/timeline";
import { ArtifactStore } from "../src/client/store";
const flush = () => new Promise<void>(resolve => setImmediate(resolve));
const item = (id: string, body: string, seq = 1) => ({ seqStart: seq, timestamp: String(seq), item: { type: "assistant_message", messageId: id, text: '```html artifact="same"\n<div>' + body + '</div>\n```' } });
test("history/live overlap is replayed after history, and reconnect replacements remove rewound artifacts", async () => {
  let event!: (value: any) => void, finish!: (value: any) => void, off = 0;
  const store = new ArtifactStore();
  const handle: any = { timeline: { subscribe(cb: any) { event = cb; return Object.assign(() => { off++; }, { ready: Promise.resolve({}) }); }, refetch: () => new Promise(resolve => { finish = resolve; }) } };
  const observer = observeArtifacts(handle, store, () => {}); await flush();
  event({ event: { type: "timeline", item: item("new", "B").item } });
  finish({ entries: [item("old", "A")], epoch: "a", hasOlder: false }); await flush();
  assert.equal(store.snapshot()[0].versions.length, 2); assert.match(store.snapshot()[0].versions.at(-1)!.code, /B/);
  event({ event: { type: "replacement", epoch: "b" } }); assert.equal(store.snapshot().length, 0);
  finish({ entries: [], epoch: "b", hasOlder: false }); await flush(); assert.equal(store.snapshot().length, 0);
  observer.dispose(); assert.equal(off, 1);
});
test("unmounted history requests cannot publish a result", async () => {
  let finish!: (value: any) => void;
  const store = new ArtifactStore(), handle: any = { timeline: { subscribe: () => Object.assign(() => {}, { ready: Promise.resolve({}) }), refetch: () => new Promise(resolve => { finish = resolve; }) } };
  const observer = observeArtifacts(handle, store, () => {}); await flush(); observer.dispose();
  finish({ entries: [item("old", "A")], epoch: "a", hasOlder: false }); await flush(); assert.equal(store.snapshot().length, 0);
});
test("a successful capped history read clears the error without displaying a range notice", async () => {
  const history = Array.from({ length: 1001 }, (_, index) => ({
    seqStart: index + 1, timestamp: String(index + 1), item: { type: "user_message", text: "test" }
  }));
  const entries = [item("unread", "outside-window"), ...history.slice(1, -1), item("new", "visible", 1001)];
  const reports: (string | null)[] = [], starts: number[] = [];
  let fail = true;
  const store = new ArtifactStore();
  const handle: any = { timeline: {
    subscribe: () => Object.assign(() => {}, { ready: new Promise(() => {}) }),
    async refetch({ cursor, limit }: { cursor?: string; limit: number }) {
      if (fail) throw new Error("timeline unavailable");
      const end = Number(cursor ?? entries.length), start = Math.max(0, end - limit);
      starts.push(start);
      return { epoch: "qa", entries: entries.slice(start, end), startCursor: String(start), hasOlder: start > 0 };
    }
  } };
  const observer = observeArtifacts(handle, store, status => reports.push(status));
  try {
    await observer.refresh();
    fail = false;
    await observer.refresh();
    assert.deepEqual(starts, [801, 601, 401, 201, 1]);
    assert.deepEqual(reports, ["timeline unavailable", null]);
    assert.equal(store.snapshot()[0].versions.length, 1);
    assert.match(store.snapshot()[0].versions[0].code, /visible/);
  } finally { observer.dispose(); }
});

test("opening the timeline reads saved cards; only a manual history reload requests import", async () => {
  const calls: string[] = [];
  const store = Object.assign(new ArtifactStore(), {
    backfillPersistent: async () => { calls.push("import"); },
    refreshPersistent: async () => { calls.push("saved"); },
  });
  const timeline = {
    subscribe: () => Object.assign(() => {}, { ready: Promise.resolve() }),
    refetch: async () => { calls.push("timeline"); return { entries: [], epoch: "qa", hasOlder: false }; },
  };
  const observer = observeArtifacts({ timeline } as any, store, () => {});
  try {
    await flush();
    assert.deepEqual(calls, ["timeline", "saved"]);
    await observer.refresh();
    assert.deepEqual(calls, ["timeline", "saved", "import", "timeline", "saved"]);
  } finally { observer.dispose(); }
});
