import assert from "node:assert/strict";
import type { Page } from "playwright-core";
import type { startServerFixture } from "./browser-server.mjs";

const sessionDraft = "보내지 않은 초안 · 두 번째 줄\n값을 그대로 유지";
const viewportOf = (page: Page) => page.getByTestId("agent-chat-scroll");
const chatCard = (page: Page) => page.getByRole("button", {name: "테스트 결과 아티팩트 열기", exact: true}).first();
const close = (page: Page) => page.getByRole("button", {name: "아티팩트 탭 닫기", exact: true}).click();
const preview = (page: Page) => page.frameLocator('iframe[title="아티팩트 실행 화면"]').frameLocator('iframe[title="아티팩트 문서"]').locator("#counter").waitFor();
const input = (page: Page) => page.getByRole("textbox", { name: "메시지 초안" });

async function position(page: Page) {
  return viewportOf(page).evaluate(el => {
    const bounds = el.getBoundingClientRect();
    const row = Array.from(el.querySelectorAll("[data-history-row-id]")).find(r => r.getBoundingClientRect().bottom > bounds.top);
    if (!row) throw Error("No reading anchor in test viewport");
    return {id: row.getAttribute("data-history-row-id"), offset: Math.round(row.getBoundingClientRect().top - bounds.top),
      bottom: el.scrollHeight - el.clientHeight - el.scrollTop, top: el.scrollTop,
      firstMountedRow: el.querySelector("[data-history-row-id]")?.getAttribute("data-history-row-id"), height: el.scrollHeight};
  });
}
async function prepare(page: Page) {
  const draft = input(page), viewport = viewportOf(page);
  await draft.fill(sessionDraft);
  await page.waitForFunction(() => {
    const el = document.querySelector('[data-testid="agent-chat-scroll"]');
    return el && el.scrollHeight - el.clientHeight - el.scrollTop <= 1;
  });
  const box = await viewport.boundingBox(); assert.ok(box);
  await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
  await page.mouse.wheel(0, -1750);
  await chatCard(page).scrollIntoViewIfNeeded();
  await page.waitForFunction(() => {
    const el = document.querySelector('[data-testid="agent-chat-scroll"]');
    return !!el && el.scrollTop > 400 && el.scrollHeight - el.clientHeight - el.scrollTop > 400;
  });
  const before = await position(page);
  await viewport.evaluate(el => { (window as any).originalViewport = el; });
  return before;
}
function assertReading(before: Awaited<ReturnType<typeof position>>, after: Awaited<ReturnType<typeof position>>) {
  assert.equal(after.id, before.id, "returned to another message: " + JSON.stringify({before, after}));
  assert.ok(Math.abs(before.offset - after.offset) <= 2, "reader offset changed: " + JSON.stringify({before, after}));
}

// Negative controls: the SDK-only return must actually lose the invoking instance; an expired host-only
// return must lose its detached position. This prevents an always-preserving fixture from masking regressions.
export async function testHostDefaults(page: Page) {
  await page.clock.install();
  const before = await prepare(page);
  await page.getByRole("navigation").getByRole("button", { name: "아티팩트" }).click(); await page.getByTestId("artifact-screen").waitFor();
  await page.evaluate(() => { const f = (window as any).fixture; f.workspaceHost.openAgent({serverId: "test", agentId: f.state.viewedAgent}); });
  await page.getByRole("button", {name: "first", exact: true}).waitFor();
  assert.equal(await page.getByRole("button", {name: "first", exact: true}).getAttribute("aria-selected"), "true");
  assert.notEqual((await position(page)).id, before.id);
  assert.equal(await input(page).inputValue(), sessionDraft);

  await page.getByRole("button", {name: "invoking", exact: true}).click();
  await prepare(page);
  await page.getByRole("navigation").getByRole("button", { name: "아티팩트" }).click(); await page.getByTestId("artifact-screen").waitFor();
  await page.clock.fastForward(600_100);
  await viewportOf(page).waitFor({state: "detached"});
  // The host header goes back without invoking the plugin's X or its scroll restoration.
  await page.getByTestId("plugin-surface-close").click();
  await viewportOf(page).waitFor();
  await page.clock.runFor(550);
  assert.ok((await position(page)).bottom <= 1);
  assert.equal(await input(page).inputValue(), sessionDraft);
}

export async function testRetainedOrigin(page: Page) {
  const before = await prepare(page);
  const originUrl = page.url();
  await chatCard(page).click(); await preview(page);
  assert.ok(await viewportOf(page).isVisible());
  assert.equal(page.url(), originUrl);
  assert.equal(await page.getByTestId("artifact-screen").count(), 0);
  await close(page);
  await page.waitForURL(originUrl);
  await viewportOf(page).waitFor();
  assert.equal(await page.getByRole("button", {name: "invoking", exact: true}).getAttribute("aria-selected"), "true");
  assert.equal(await viewportOf(page).evaluate(el => el === (window as any).originalViewport), true);
  assertReading(before, await position(page));
  assert.equal(await input(page).inputValue(), sessionDraft);
}

export async function testExpiredOrigin(page: Page, server: Awaited<ReturnType<typeof startServerFixture>>, nearBottom = false) {
  await page.clock.install();
  const before = await prepare(page);
  const originUrl = page.url();
  const id = nearBottom ? "near-bottom-origin" : "expired-origin";
  let expected = before;
  if (nearBottom) {
    const viewport = viewportOf(page);
    await viewport.evaluate(el => { el.scrollTop = el.scrollHeight; });
    await page.mouse.wheel(0, -20);
    await page.waitForFunction(() => {
      const el = document.querySelector('[data-testid="agent-chat-scroll"]')!;
      return Math.abs(el.scrollHeight - el.clientHeight - el.scrollTop - 20) <= 1;
    });
    expected = await position(page);
  } else {
    // Navigate from a reading position where virtualization unmounts even the source card.
    await page.mouse.wheel(0, -1300);
    await chatCard(page).waitFor({ state: "detached" });
    expected = await position(page);
    assert.ok(expected.top > 100 && expected.id !== "artifact-answer");
  }
  await page.waitForFunction(() => (window as any).fixture.state.listening);
  const {items} = await server.rpc("artifact.list", {sessionId: id});
  const agent = { id, workspaceId: "C:/작업/산출물", provider: "codex", cwd: "C:/fixture" };
  const context = {agent, paseo: server.paseo, signal: new AbortController().signal};
  const launch = server.hooks.get("agent.open.before")({request: {agentId: id, provider: "codex", purpose: "interactive", tools: [], mcpServers: {}}}, context);
  const result = await launch.tools.find((tool: any) => tool.name === "artifact_open").execute({artifactId: items[0].artifactId, version: 1}, context);
  assert.equal(result.structuredContent.status, "opened");
  await preview(page);
  await page.clock.fastForward(600_100);
  assert.ok(await viewportOf(page).isVisible());
  assert.equal(page.url(), originUrl);
  assert.equal(await viewportOf(page).evaluate(el => el === (window as any).originalViewport), true);
  await close(page);
  const restored = await position(page);
  assertReading(expected, restored);
  // Background chat output must not pull a detached reader to the end.
  await page.evaluate(() => (window as any).fixture.workspaceHost.appendOutput());
  await page.waitForFunction(prior => document.querySelector('[data-testid="agent-chat-scroll"]')!.scrollHeight > prior, restored.height);
  assertReading(expected, await position(page));
  assert.equal(await input(page).inputValue(), sessionDraft);
}

export async function testChangedHost(page: Page) {
  await prepare(page);
  await chatCard(page).click(); await preview(page);
  await page.getByRole("navigation").getByRole("button", {name: "아티팩트"}).click();
  await page.getByRole("button", {name: "테스트 호스트 변경"}).click();
  await page.waitForURL(/\/h\/second-host\/plugin\//);
  assert.equal(await page.getByTestId("explorer-content").count(), 0);
  assert.deepEqual(await page.evaluate(() => (window as any).fixture.workspaceHost.openCalls), []);
}

export async function testReplacedOrigin(page: Page) {
  await prepare(page);
  await chatCard(page).click(); await preview(page);
  const edited = await page.evaluate(() => {
    const url = new URL(location.href);
    url.searchParams.set("workspace-state", "changed");
    history.replaceState(history.state, "", url);
    return url.href;
  });
  await close(page);
  assert.equal(page.url(), edited);
  assert.deepEqual(await page.evaluate(() => (window as any).fixture.workspaceHost.openCalls), []);
  assert.equal(await input(page).inputValue(), sessionDraft);
}
