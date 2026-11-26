import assert from "node:assert/strict";
import { DatabaseSync } from "node:sqlite";
import { join } from "node:path";
import type { Page } from "playwright-core";
import type { startServerFixture } from "./browser-server.mjs";

type Server = Awaited<ReturnType<typeof startServerFixture>>;
const sameTitle = "도록 공동 시안";
const safeSvg = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 10 10"><rect width="10" height="10" fill="blue"/></svg>';
const html = (value: string) => '<div id="gallery-detail">' + value + '</div>';
function entry(key: string, title: string, content: string, seq: number, language = "html") {
  return { seqStart: seq, seqEnd: seq, timestamp: new Date().toISOString(), item: {
    type: "assistant_message", messageId: key + "-" + seq,
    text: ['~~~' + language + ' artifact="' + key + '" title="' + title + '"', content, '~~~'].join("\n"),
  } };
}

async function seedLegacyVersions(server: Server) {
  const sessionId = "historical-owner";
  server.timelines.set(sessionId, [
    entry("legacy", "보관된 원본", html("보관본 1"), 0),
    entry("legacy", "보관된 원본", html("보관본 2"), 1),
  ]);
  await server.rpc("artifact.backfill", { sessionId });
  const { items } = await server.rpc("artifact.list", { sessionId });
  // The current publication API requires a conversation. Only this fixture's temporary SQLite
  // database is given the historical empty-session representation, ahead of any gallery reads.
  const db = new DatabaseSync(join(server.directory, "artifacts.sqlite"));
  try {
    assert.equal(db.prepare("UPDATE artifacts SET session='' WHERE id=? AND session=?").run(items[0].artifactId, sessionId).changes, 1);
  } finally { db.close(); }
  return items[0].artifactId;
}

export async function testGallery(page: Page, server: Server, calls: { name: string; input: any; output: any }[]) {
  // Backfill real stored versions in two conversations, leaving this window in a third conversation.
  const many = Array.from({ length: 45 }, (_, i) => entry("item-" + i, "도록 자료 " + i, html("sample " + i), i));
  server.timelines.set("gallery-a", [
    ...many, entry("shared-a", sameTitle, html("기획 원본"), 45),
    entry("shared-a", sameTitle, html("기획 수정본"), 46),
    entry("art", "도록 정적 그림", safeSvg, 47, "svg"),
    entry("component", "도록 컴포넌트", "export default function Sample(){return <p>Component body</p>}", 48, "tsx"),
  ]);
  server.timelines.set("gallery-b", [
    entry("shared-b", sameTitle, html("디자인 원본"), 0),
    entry("animated", "도록 동적 SVG", '<svg xmlns="http://www.w3.org/2000/svg"><animate attributeName="opacity" dur="1s"/></svg>', 1, "svg"),
    entry("outside", "검색에서 제외할 항목", html("다른 제목"), 2),
  ]);
  await server.rpc("artifact.backfill", { sessionId: "gallery-a" });
  await server.rpc("artifact.backfill", { sessionId: "gallery-b" });
  const legacyId = await seedLegacyVersions(server);
  await page.setViewportSize({ width: 820, height: 530 });
  await page.getByRole("navigation").getByRole("button", { name: "아티팩트", exact: true }).click();
  const gallery = page.getByRole("region", { name: "아티팩트 갤러리" });
  const query = gallery.getByRole("searchbox");
  const tile = (title: string) => gallery.getByRole("listitem", { name: title + " 열기", exact: true });
  const tiles = gallery.getByRole("listitem");
  await tile("검색에서 제외할 항목").waitFor();
  await query.fill("존재하지 않는 제목");
  await gallery.getByText(/맞는 아티팩트가 없어요/).waitFor();
  await query.fill("도록");
  await tile("도록 정적 그림").waitFor();
  assert.equal(await tile("검색에서 제외할 항목").count(), 0);
  // The result is one head per ID; two distinct IDs may share a title across workspaces.
  const twins = tile(sameTitle);
  assert.equal(await twins.count(), 2);
  const newest = twins.filter({ hasText: "기획 작업공간" });
  const pinnedId = await newest.getAttribute("data-artifact-id");
  assert.ok(pinnedId);
  assert.match(await newest.innerText(), /기획 대화/);
  assert.match(await newest.innerText(), /v2/);
  const foreign = twins.filter({ hasText: "디자인 작업공간" });
  assert.match(await foreign.innerText(), /디자인 대화/);
  assert.notEqual(await foreign.getAttribute("data-artifact-id"), await newest.getAttribute("data-artifact-id"));
  const thumb = tile("도록 정적 그림").locator("img");
  await thumb.scrollIntoViewIfNeeded();
  await thumb.evaluate(async node => { await (node as HTMLImageElement).decode(); });
  assert.match((await thumb.getAttribute("src"))!, /^data:image\/svg\+xml[;,]/);
  for (const [item, format] of [[foreign, "HTML"], [tile("도록 컴포넌트"), "React"], [tile("도록 동적 SVG"), "SVG"]] as const) {
    assert.equal(await item.locator("img,iframe,object,embed").count(), 0);
    assert.ok((await item.innerText()).includes(format));
  }
  const pages = () => calls.filter(c => c.name === "artifact.library_list" && c.input.query === "도록");
  assert.ok(pages().length > 0 && pages()[0].output.nextOffset !== null);
  const more = gallery.getByRole("button", { name: "더 보기" });
  const secondPage = page.waitForResponse(response => response.url().endsWith("/rpc") &&
    response.request().postDataJSON()?.name === "artifact.library_list" &&
    response.request().postDataJSON()?.input.query === "도록" && response.request().postDataJSON()?.input.offset > 0);
  await Promise.all([secondPage, more.scrollIntoViewIfNeeded()]);
  await page.waitForFunction(() => document.querySelectorAll('[aria-label="아티팩트 갤러리"] [role="listitem"]').length === 50);
  assert.ok(pages().some(call => call.input.offset > 0));
  for (const call of pages()) for (const summary of call.output.items) {
    assert.equal("content" in summary || "version" in summary, false, "list response leaked detail");
  }
  assert.equal(await page.locator("iframe,object,embed").count(), 0);
  const idsBefore = await tiles.evaluateAll(nodes => nodes.map(n => n.getAttribute("data-artifact-id")));
  assert.equal(new Set(idsBefore).size, 50);
  const scroller = gallery.locator(".avl-scroll");
  const last = tiles.last();
  await last.scrollIntoViewIfNeeded();
  const top = await scroller.evaluate(el => el.scrollTop);
  assert.ok(top > 0);
  const pageCount = pages().length;
  await last.click();
  const detail = page.getByRole("region", { name: "아티팩트 작업 공간" });
  await detail.waitFor();
  const body = page.frameLocator('iframe[title="아티팩트 실행 화면"]').frameLocator('iframe[title="아티팩트 문서"]');
  await body.locator("#gallery-detail").waitFor();
  async function checkFullSize() {
    const surface = await page.locator(".avl-root").boundingBox(), content = await detail.boundingBox();
    assert.ok(surface && content);
    for (const k of ["x", "y", "width", "height"] as const) assert.ok(Math.abs(surface[k] - content[k]) <= 1, "Full detail " + k);
  }
  await checkFullSize();
  assert.equal(await page.evaluate(() => !!document.fullscreenElement), false);
  const ownerDuringDetail = await page.evaluate(() => (window as any).fixture.state.agentOpens);
  assert.deepEqual(ownerDuringDetail, []);
  await page.getByRole("button", { name: "갤러리로 돌아가기" }).click();
  await gallery.waitFor();
  assert.equal(await query.inputValue(), "도록");
  assert.deepEqual(await tiles.evaluateAll(nodes => nodes.map(n => n.getAttribute("data-artifact-id"))), idsBefore);
  assert.ok(Math.abs(await scroller.evaluate(el => el.scrollTop) - top) <= 2);
  assert.equal(pages().length, pageCount);
  assert.equal(await last.locator("button.avl-open").evaluate(node => node === document.activeElement), true);
  await newest.click();
  await body.getByText("기획 수정본").waitFor();
  await page.getByRole("button", { name: "아티팩트 버전" }).click();
  await page.getByRole("menuitemradio", { name: "버전 1", exact: true }).click();
  await body.getByText("기획 원본").waitFor();
  await page.getByRole("button", { name: "갤러리로 돌아가기" }).click();
  await foreign.click();
  await body.getByText("디자인 원본").waitFor();
  await page.getByRole("button", { name: "갤러리로 돌아가기" }).click();
  await query.fill("보관된 원본");
  const legacy = tile("보관된 원본");
  await legacy.waitFor();
  const legacySummary = calls.flatMap(call => call.name === "artifact.library_list" ? call.output.items : [])
    .find((item: any) => item.artifactId === legacyId);
  assert.equal(legacySummary?.sessionId, null);
  await legacy.click();
  await body.getByText("보관본 2").waitFor();
  await page.getByRole("button", { name: "아티팩트 버전" }).click();
  await page.getByRole("menuitemradio", { name: "버전 1", exact: true }).click();
  await body.getByText("보관본 1").waitFor();
  assert.ok(calls.some(call => call.name === "artifact.library_get" && call.input.artifactId === legacyId && call.input.version === 1));
  await page.getByRole("button", { name: "갤러리로 돌아가기" }).click();
  assert.equal(await query.inputValue(), "보관된 원본");

  // The pin lives on the server, so filtering also works when two tiles have the same title.
  await server.rpc("artifact.manage", { sessionId: "gallery-a", artifactId: pinnedId, action: { type: "pin", pinned: true } });
  await query.fill(sameTitle);
  await newest.waitFor();
  await gallery.getByRole("button", { name: "고정됨", exact: true }).click();
  await foreign.waitFor({ state: "detached" });
  await newest.waitFor();
  assert.equal(await tiles.count(), 1);
  assert.ok(calls.some(c => c.name === "artifact.library_list" && c.input.pinnedOnly && c.input.query === sameTitle));
  const listView = gallery.getByRole("button", { name: "목록 보기" });
  await listView.click();
  assert.equal(await listView.getAttribute("aria-pressed"), "true");
  await page.evaluate(() => (window as any).fixture.setDark(true));
  await page.locator('.avl-root[data-dark="true"]').waitFor();
  await page.setViewportSize({ width: 425, height: 730 });
  await tile(sameTitle).click();
  await body.getByText("기획 수정본").waitFor();
  await checkFullSize();
  await page.getByRole("tab", { name: "코드", exact: true }).click();
  await page.keyboard.press("Escape");
  await detail.waitFor({ state: "detached" });
  assert.equal(await query.inputValue(), sameTitle);
  assert.equal(await listView.getAttribute("aria-pressed"), "true");
  assert.equal(await gallery.getByRole("button", { name: "고정됨", exact: true }).getAttribute("aria-pressed"), "true");
  assert.equal(await tiles.count(), 1);
  await gallery.getByRole("button", { name: "전체", exact: true }).click();
  await foreign.waitFor();

  assert.deepEqual(await page.evaluate(() => (window as any).fixture.state.agentOpens), []);
}
