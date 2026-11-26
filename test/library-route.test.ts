import test from "node:test";
import assert from "node:assert/strict";
import { LIBRARY_SCREEN_ID, chatDetailParams, createLibraryNav, detailFromParams, libraryScreenTitle, listBelow, makeSheet, renameSheetEntry, replaceWithList, requestDetailParams } from "../client/library-route";

/** `window.navigation`, `location` and `history` as the library screen sees them, restored afterwards. */
function inBrowser(href: string, entries: { index: number; urls: (string | null)[] | "throws" } | undefined, run: (spy: { replaced: string[]; states: { state: unknown; url: string }[] }) => void) {
  const global = globalThis as Record<string, unknown>, saved = { window: global.window, location: global.location, history: global.history };
  const spy = { replaced: [] as string[], states: [] as { state: unknown; url: string }[] };
  const url = new URL(href);
  global.location = { href: url.href, origin: url.origin, pathname: url.pathname, replace: (value: string) => { spy.replaced.push(value); } };
  global.history = { state: { step: 7 }, replaceState: (state: unknown, _title: string, next: URL) => { spy.states.push({ state, url: String(next) }); } };
  global.window = entries ? { navigation: { currentEntry: { index: entries.index }, entries: () => { if (entries.urls === "throws") throw new Error("denied"); return entries.urls.map(value => ({ url: value })); } } } : {};
  try { run(spy); } finally { Object.assign(global, saved); }
}

test("a chat card's params round-trip into one detail with a stable key", () => {
  const params = chatDetailParams({ sessionId: "agent-1", artifactId: "A1", version: 3, title: "T".repeat(150), requestId: "req-9", returnServerId: "host-2" });
  assert.equal(params.view, "detail"); assert.equal(params.from, "chat");
  assert.equal(params.title!.length, 100);
  const detail = detailFromParams(params)!;
  assert.deepEqual({ ...detail, key: undefined, title: undefined }, {
    key: undefined, artifactId: "A1", version: 3, sessionId: "agent-1", title: undefined, from: "chat",
    returnAgent: "agent-1", returnServerId: "host-2", nonce: params.nonce, requestId: "req-9",
  });
  assert.equal(detail.key, `chat:${params.nonce}:A1:3`);
  assert.notEqual(chatDetailParams({ sessionId: "agent-1", artifactId: "A1" }).nonce, params.nonce, "every open is its own entry");
  assert.equal("version" in chatDetailParams({ sessionId: "s", artifactId: "A" }), false);
});

test("only a well-formed detail URL names a detail; odd versions and empty fields fall back", () => {
  assert.equal(detailFromParams({}), null);
  assert.equal(detailFromParams({ view: "sheet", artifactId: "A" }), null);
  assert.equal(detailFromParams({ view: "detail" }), null);
  for (const version of ["0", "-2", "1.5", "abc", ""]) assert.equal(detailFromParams({ view: "detail", artifactId: "A", version })!.version, undefined, version);
  const bare = detailFromParams({ view: "detail", artifactId: "A", sessionId: "", returnAgent: "", returnServerId: "", nonce: "", requestId: "" })!;
  assert.equal(bare.sessionId, null);
  assert.deepEqual([bare.returnAgent, bare.returnServerId, bare.nonce, bare.requestId], [undefined, undefined, undefined, undefined]);
  assert.equal(bare.key, "chat::A:");
});

test("an agent's open request becomes the same detail, carrying its request id", () => {
  const detail = detailFromParams(requestDetailParams({ requestId: "r-1", sessionId: "agent-2", artifactId: "A2", version: 4 } as any, "host-1"))!;
  assert.deepEqual([detail.sessionId, detail.artifactId, detail.version, detail.requestId, detail.returnAgent, detail.returnServerId], ["agent-2", "A2", 4, "r-1", "agent-2", "host-1"]);
});

test("the screen title follows a detail's title only", () => {
  assert.equal(libraryScreenTitle({ view: "detail", title: "Clock" }), "Clock");
  const fallback = libraryScreenTitle({});
  assert.ok(fallback.length > 0);
  for (const params of [{ view: "detail" }, { view: "sheet", title: "Clock" }, { title: "Clock" }]) assert.equal(libraryScreenTitle(params), fallback);
});

test("a gallery sheet is a detail of its own artifact, from the gallery", () => {
  const item = { artifactId: "A3", sessionId: "agent-3", title: "Dice" } as any, other = { artifactId: "A4", sessionId: null, title: "Old" } as any;
  const sheet = makeSheet(item);
  assert.deepEqual([sheet.artifactId, sheet.item, sheet.detail.artifactId, sheet.detail.sessionId, sheet.detail.title, sheet.detail.from], ["A3", item, "A3", "agent-3", "Dice", "gallery"]);
  assert.match(sheet.detail.key, /^gallery:A3:\d+$/);
  assert.equal(makeSheet(other).detail.sessionId, null);
});

test("every way into the library resets a mounted screen once, then shows it", () => {
  const nav = createLibraryNav(), seen: number[] = [], opened: unknown[] = [];
  const stop = nav.subscribe(() => seen.push(nav.snapshot()));
  nav.open(target => opened.push(target));
  nav.menu();
  assert.deepEqual(seen, [1, 2]); assert.deepEqual(opened, [{ screenId: LIBRARY_SCREEN_ID }]);
  stop(); nav.menu(); assert.deepEqual(seen, [1, 2]); assert.equal(nav.snapshot(), 3);
});

test("back lands on the list only when the entry below is this screen's list", () => {
  const here = "https://paseo.test/h/server/artifacts?param.view=sheet&param.artifactId=A";
  inBrowser(here, { index: 2, urls: ["https://paseo.test/", "https://paseo.test/h/server/artifacts", here] }, () => assert.equal(listBelow(false), true));
  inBrowser(here, { index: 2, urls: ["https://paseo.test/", "https://paseo.test/h/server/artifacts?param.view=detail&param.artifactId=B", here] }, () => assert.equal(listBelow(true), false));
  inBrowser(here, { index: 2, urls: ["https://paseo.test/", "https://other.test/h/server/artifacts", here] }, () => assert.equal(listBelow(true), false));
  inBrowser(here, { index: 2, urls: ["https://paseo.test/", "https://paseo.test/h/server/chat", here] }, () => assert.equal(listBelow(true), false));
  // Without a readable entry list the answer is what this window itself pushed.
  inBrowser(here, { index: 0, urls: [here] }, () => { assert.equal(listBelow(true), true); assert.equal(listBelow(false), false); });
  inBrowser(here, { index: 2, urls: "throws" }, () => assert.equal(listBelow(true), true));
  inBrowser(here, undefined, () => { assert.equal(listBelow(true), true); assert.equal(listBelow(false), false); });
});

test("leaving a reloaded sheet replaces the entry with the plain list; a duplicate renames it in place", () => {
  inBrowser("https://paseo.test/h/server/artifacts?keep=1&param.view=sheet&param.artifactId=A&param.sessionId=s", undefined, spy => {
    replaceWithList();
    assert.deepEqual(spy.replaced, ["https://paseo.test/h/server/artifacts?keep=1"]);
  });
  inBrowser("https://paseo.test/h/server/artifacts?param.view=sheet&param.artifactId=A", undefined, spy => {
    renameSheetEntry("A-copy");
    assert.equal(spy.states.length, 1);
    assert.deepEqual(spy.states[0].state, { step: 7 });
    assert.equal(new URL(spy.states[0].url).searchParams.get("param.artifactId"), "A-copy");
    assert.equal(new URL(spy.states[0].url).searchParams.get("param.view"), "sheet");
  });
});
