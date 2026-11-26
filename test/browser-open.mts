import assert from "node:assert/strict";
import type { Page } from "playwright-core";
import type { startServerFixture } from "./browser-server.mjs";

type Server = Awaited<ReturnType<typeof startServerFixture>>;
function sessionTools(server: Server, sessionId: string) {
  const agent = { id: sessionId, workspaceId: "test-workspace", provider: "codex", cwd: "C:/fixture" };
  const context = { agent, paseo: server.paseo, signal: new AbortController().signal };
  const launch = server.hooks.get("agent.open.before")({ request: { agentId: agent.id, provider: agent.provider, purpose: "interactive", tools: [], mcpServers: {} } }, context);
  return async (name: string, input: object) => {
    const result = await launch.tools.find((tool: any) => tool.name === name).execute(input, context);
    assert.equal(result.isError, false, JSON.stringify(result.structuredContent));
    return result.structuredContent;
  };
}
const frame = (page: Page) => page.frameLocator('iframe[title="아티팩트 실행 화면"]').frameLocator('iframe[title="아티팩트 문서"]');
const panelCount = (page: Page) => page.evaluate(() => (window as any).fixture.state.panelOpens.length);
async function closeToChat(page: Page, id: string) {
  assert.ok(await page.getByTestId("timeline").isVisible());
  assert.ok(await page.getByTestId("explorer-content").isVisible());
  await page.getByRole("button", { name: "아티팩트 탭 닫기", exact: true }).click();
  await page.getByTestId("explorer-content").waitFor({state:"detached"});
  await page.locator('[data-testid="timeline"][data-session="' + id + '"]').waitFor();
  assert.equal(await page.getByTestId("artifact-screen").count(), 0);
  assert.deepEqual(await page.evaluate(() => [(window as any).fixture.state.agentOpens.length,(window as any).fixture.state.screenOpens.length]), [0,0]);
}

export async function testOpen(page: Page, server: Server) {
  const id = "sidebar-test", invoke = sessionTools(server, id);
  await page.waitForFunction(() => (window as any).fixture?.state.listening);
  // SDK route/composer identifies the visible conversation even without browser input focus.
  await page.evaluate(() => Object.defineProperty(document, "hasFocus", { configurable: true, value: Boolean.bind(null, false) }));
  const publish = (n: number) => invoke("artifact_publish", { requestId: "clock-v" + n, key: "clock", format: "html", title: "집중 타이머", content: "<h2>clock revision " + n + "</h2>" });
  const first = await publish(1);
  assert.equal(first.sidebar, "closed");
  await page.getByTestId("timeline").waitFor();
  assert.equal(await page.locator("iframe").count(), 0);
  assert.equal(await panelCount(page), 0);
  assert.deepEqual(await server.rpc("artifact.sidebar_pending", {}), {items: []});
  const open = (version: number) => invoke("artifact_open", {artifactId: first.artifactId, version});
  assert.equal((await open(1)).status, "opened");
  await frame(page).getByText("clock revision 1").waitFor();
  assert.equal((await publish(2)).sidebar, "refreshed");
  await frame(page).getByText("clock revision 2").waitFor();
  assert.equal((await publish(1)).sidebar, "unchanged");
  assert.equal(await panelCount(page), 1);
  await page.getByRole("button", {name: "아티팩트 버전"}).click();
  await page.getByRole("menuitemradio", {name: "버전 1", exact: true}).click();
  assert.equal((await publish(3)).sidebar, "unchanged");
  await frame(page).getByText("clock revision 1").waitFor();
  const other = await invoke("artifact_publish", { requestId: "other", key: "another", format: "html", title: "다른 결과물", content: "<h2>other artifact</h2>" });
  assert.equal(other.sidebar, "closed");
  await frame(page).getByText("clock revision 1").waitFor();
  assert.equal(await panelCount(page), 1);
  assert.equal(await page.evaluate(() => !!document.fullscreenElement), false);
  await closeToChat(page, id);
  assert.equal((await publish(4)).sidebar, "closed");
  await page.evaluate(() => { (window as any).fixture.state.foreground = false; });
  assert.equal((await open(1)).status, "deferred");
  const replaced = await invoke("artifact_open", { artifactId: other.artifactId, version: 1 });
  assert.equal(replaced.status, "deferred");
  const updated = await invoke("artifact_publish", { requestId: "other-v2", artifactId: other.artifactId, format: "html", title: "다른 결과물", content: "<h2>other revised</h2>" });
  assert.equal(updated.sidebar, "deferred");
  assert.equal(updated.expiresAt, replaced.expiresAt);
  assert.equal(await panelCount(page), 1);
  await page.clock.setFixedTime(new Date(Date.now() + 25_000));
  await page.evaluate(() => { (window as any).fixture.state.foreground = "unknown"; (window as any).fixture.showComposer(true); });
  await frame(page).getByText("other revised").waitFor();
  await closeToChat(page, id);
  await page.evaluate(() => { (window as any).fixture.state.foreground = "ambiguous"; });
  assert.equal((await open(1)).status, "deferred");
  await page.getByRole("button", { name: /대기 중인 아티팩트/ }).click();
  await frame(page).getByText("clock revision 1").waitFor();
  await closeToChat(page, id);
  await page.evaluate(() => {
    (window as any).fixture.state.foreground = true;
    Object.defineProperty(document, "visibilityState", { configurable: true, value: "hidden" });
  });
  const hidden = await open(2);
  assert.equal(hidden.status, "deferred");
  assert.equal(hidden.reason, "not_foreground");
  assert.equal(await page.locator("iframe").count(), 0);
  await page.evaluate(() => { Reflect.deleteProperty(document, "visibilityState"); document.dispatchEvent(new Event("visibilitychange")); });
  await frame(page).getByText("clock revision 2").waitFor();
  await closeToChat(page, id);
}

export async function testWindowReturn(page: Page, server: Server) {
  const id = "return-test", invoke = sessionTools(server, id);
  await page.waitForFunction(() => (window as any).fixture?.state.listening);
  const otherWindow = await page.context().newPage();
  const otherRoute = new URL(page.url());
  otherRoute.searchParams.set("session", "background-reader");
  await otherWindow.goto(otherRoute.href);
  await otherWindow.waitForFunction(() => (window as any).fixture?.state.listening);
  await page.bringToFront();
  const first = await invoke("artifact_publish", { requestId:"counter", format:"html", title:"카운터", content:"<h2>return counter</h2>" });
  assert.equal(first.sidebar, "closed");
  const open = () => invoke("artifact_open", { artifactId: first.artifactId, version: 1 });
  await page.evaluate(() => { (window as any).fixture.state.foreground = false; });
  assert.equal((await open()).status, "deferred");
  await page.evaluate(() => {
    const state = (window as any).fixture.state;
    state.switchAfterClaim = true;
    state.foreground = true;
    window.dispatchEvent(new Event("focus"));
  });
  await page.waitForFunction(() => (window as any).fixture.state.sidebarReceipts.some((r: any) => r.outcome === "release_not_foreground"));
  assert.equal(await panelCount(page), 0);
  await page.evaluate(() => { (window as any).fixture.state.foreground = true; window.dispatchEvent(new Event("focus")); });
  await frame(page).getByText("return counter").waitFor();
  await closeToChat(page, id);
  // A window that lost the local subscription must recover the pending request from the server.
  await page.evaluate(() => { (window as any).fixture.state.foreground = false; });
  assert.equal((await open()).status, "deferred");
  await page.evaluate(() => {
    const state = (window as any).fixture.state;
    state.loseLocalWaiting();
    state.foreground = true;
    window.dispatchEvent(new Event("pageshow")); window.dispatchEvent(new Event("focus"));
  });
  await frame(page).getByText("return counter").waitFor();
  await closeToChat(page, id);
  assert.deepEqual(await server.rpc("artifact.sidebar_pending", {}), { items: [] });
  assert.equal(await panelCount(page), 2);
  assert.equal(await panelCount(otherWindow), 0);
  assert.deepEqual(await otherWindow.evaluate(() => (window as any).fixture.state.agentOpens), []);
  await otherWindow.locator('[data-testid="timeline"][data-session="background-reader"]').waitFor();
}
