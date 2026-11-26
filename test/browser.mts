import { testAppLanguage, testExternalResources } from "./browser-release.mts";
import { testDynamicExternalConsent, testHashLinks } from "./browser-links.mts";
import assert from "node:assert/strict";
import { createServer } from "node:http";
import { existsSync, mkdirSync, readFileSync, unlinkSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { build } from "esbuild";
import { chromium, type Page } from "playwright-core";
import { root, metadata, output, readRelease, startServerFixture } from "./browser-server.mjs";
import { testFileEditor } from "./browser-file.mts";
import { testGallery } from "./browser-gallery.mts";
import { testRetainedOrigin, testExpiredOrigin, testChangedHost, testHostDefaults, testReplacedOrigin } from "./browser-origin.mts";
import { testOpen, testWindowReturn } from "./browser-open.mts";
import { testManagement } from "./browser-management.mts";

const packageMode = process.argv.includes("--package") || process.env.ARTIFACT_TEST_PACKAGE === "1";
const installed = process.env.ARTIFACT_TEST_INSTALLED === "1";
assert.ok(!(installed && packageMode), "Choose one client entry");
const mode = packageMode ? "package" : installed ? "installed" : "source";
const sandpack = process.argv.includes("--sandpack");
const originOnly = process.argv.includes("--origin-only");
const release = packageMode ? readRelease() : undefined;
const host = join(root, "test/browser-host.tsx");
const installedCode = installed ? readFileSync(join(output, "installed-client.bundle.js"), "utf8") : undefined;
mkdirSync(output, { recursive: true });
const code = await build({ entryPoints: [join(root, "test/browser-app.tsx")], bundle: true, write: false, format: "iife", platform: "browser", jsx: "automatic", define: { "process.env.NODE_ENV": '"production"' }, plugins: [{ name: "test-host", setup(build) {
  build.onResolve({ filter: /^(@getpaseo\/plugin\/client(?:\/ui)?|react-native)$/ }, () => ({ path: host }));
  if (release || installed) {
    build.onResolve({ filter: /^\.\.\/index.client$/ }, () => ({ path: "client", namespace: "package-entry" }));
    build.onLoad({ filter: /.*/, namespace: "package-entry" }, () => {
      if (release) return { contents: release.client, loader: "ts", resolveDir: root };
      return { contents: `import * as react from "react"; import * as jsx from "react/jsx-runtime"; import * as sdk from "@getpaseo/plugin"; import * as zod from "zod"; import * as host from ${JSON.stringify(host)};
        const deps={react,"react/jsx-runtime":jsx,"react-native":host,"@getpaseo/plugin":sdk,"@getpaseo/plugin/client":host,"@getpaseo/plugin/client/ui":host,zod};
        export default (${installedCode})(id=>{if(!(id in deps))throw new Error("Unknown host module "+id);return deps[id]}).default`, resolveDir: root };
    });
  }
} }] });
const fixture = await startServerFixture(release);
const calls: { name: string; input: any; output: any }[] = [];
const server = createServer(async (req, res) => {
  const stream = req.url?.match(/^\/sidebar-events\/(artifact\.sidebar_(?:refresh_)?requests)$/);
  if (stream) {
    res.writeHead(200, { "Content-Type":"text/event-stream", "Cache-Control":"no-store" });
    res.write(": ready\n\n");
    const lifetime = new AbortController();
    res.on("close", () => lifetime.abort());
    fixture.handlers.get(stream[1])!.handler({}, { signal:lifetime.signal, push:async (event: unknown) => { res.write("data: "+JSON.stringify(event)+"\n\n"); } });
    return;
  }
  if (req.method === "POST" && req.url === "/rpc") {
    res.setHeader("Content-Type", "application/json");
    try {
      const chunks: Buffer[] = []; let size = 0;
      for await (const chunk of req) {
        size += chunk.length;
        if (size > 4_000_000) throw new Error("Fixture request exceeds limit");
        chunks.push(chunk);
      }
      const { name, input, entries, sessionId } = JSON.parse(Buffer.concat(chunks).toString("utf8"));
      if (sessionId === input.sessionId) fixture.timelines.set(sessionId, entries);
      const output = await fixture.rpc(name, input);
      calls.push({ name, input, output });
      res.end(JSON.stringify({ output, notices: [...(fixture.notices.get(sessionId)?.values() ?? [])] }));
    } catch (err) { res.statusCode = 400; res.end(JSON.stringify({ error: String(err) })); }
    return;
  }
  if (req.url === "/app.js") { res.setHeader("Content-Type", "text/javascript"); res.end(code.outputFiles[0].contents); return; }
  const path = req.url?.split("?")[0];
  if (path !== "/" && !path?.startsWith("/h/")) { res.statusCode = 404; res.end(); return; }
  res.setHeader("Content-Type", "text/html;charset=utf-8");
  res.end('<!doctype html><html lang="ko"><meta charset="utf-8"><style>body{margin:0}</style><div id="root"></div><script src="/app.js"></script></html>');
});
await new Promise<void>(resolve => server.listen(0, "127.0.0.1", resolve));
const address = server.address() as { port: number };
const base = "http://127.0.0.1:" + address.port + "/";
const executablePath = process.env.ARTIFACT_TEST_BROWSER ?? ["C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe", "C:/Program Files/Google/Chrome/Application/chrome.exe", chromium.executablePath()].find(existsSync);
const results: Record<string, { passed: boolean; error?: string }> = {};
let browser: Awaited<ReturnType<typeof chromium.launch>> | undefined;
async function scenario(name: string, params: string, test: (page: Page) => Promise<void>) {
  if (originOnly && !name.startsWith("origin-")) return;
  if (process.env.ARTIFACT_TEST_ONLY && !process.env.ARTIFACT_TEST_ONLY.split(",").includes(name)) return;
  const context = await browser!.newContext({ viewport: { width: 1400, height: 840 } });
  const page = await context.newPage();
  page.setDefaultTimeout(6500);
  const errors: string[] = [];
  page.on("pageerror", err => errors.push(err.message)); if (process.env.QA_DEBUG) page.on("console", m => console.log("CONSOLE", m.text().slice(0, 400)));
  try {
    await page.goto(base + "?" + params);
    await test(page);
    assert.deepEqual(errors.filter(x => x !== "qa-preview-error"), []);
    const oldScreenshot = resolve(output, mode + "-" + name + "-failure.png");
    assert.equal(dirname(oldScreenshot), output);
    if (existsSync(oldScreenshot)) unlinkSync(oldScreenshot);
    results[name] = { passed: true };
    console.log("PASS", name);
  } catch (err) {
    results[name] = { passed: false, error: [err instanceof Error ? err.stack ?? err.message : String(err), ...errors].join("\n") };
    console.error("FAIL", name, results[name].error);
    if (process.env.QA_DEBUG) console.log("BODY", await page.locator("body").innerText().catch(() => "?"));
    await page.screenshot({ path: join(output, mode + "-" + name + "-failure.png") }).catch(() => {});
  } finally { await context.close(); }
}
const button = (page: Page, name: string) => page.getByRole("button", { name, exact: true });
const frame = (page: Page) => page.frameLocator('iframe[title="아티팩트 실행 화면"]').frameLocator('iframe[title="아티팩트 문서"]');
const counterCard = (page: Page) => button(page, "테스트 결과 아티팩트 열기").first();
try {
  if (!executablePath) throw new Error("Set ARTIFACT_TEST_BROWSER to an installed Chromium executable.");
  browser = await chromium.launch({ executablePath, headless: true });
  if (sandpack) {
    await scenario("external-sandpack", "react", async page => {
      await button(page, "React 카운터 아티팩트 열기").click();
      await button(page, "미리보기 시작").click();
      const preview = page.frameLocator('iframe[title="아티팩트 실행 화면"]');
      const counter = preview.locator("#react-counter");
      await counter.waitFor({ timeout: 40_000 }); await counter.click();
      assert.equal(await counter.textContent(), "1");
      await page.evaluate(() => (window as any).fixture.append("tsx", 'export default function App(){return <div id="updated">updated</div>}', "react-counter"));
      await preview.locator("#updated").waitFor({ timeout: 20_000 });
    });
  } else {
    await scenario("file-editor", "file", testFileEditor);
    await scenario("empty", "remote&empty", async page => {
      const chat = page.getByTestId("timeline");
      await chat.waitFor();
      await page.evaluate(() => (window as any).fixture.finishAnswer('~~~html artifact="blank"\n   \n~~~'));
      await chat.getByText(/artifact="blank"/).waitFor();
      assert.equal(await chat.getByRole("button").count(), 0);
      assert.equal(await page.locator("iframe").count(), 0);
      await page.getByRole("navigation").getByRole("button", { name: "아티팩트" }).click();
      await page.getByText(/아직 아티팩트가 없어요/).waitFor();
      assert.equal(await page.locator("iframe").count(), 0);
      await page.setViewportSize({ width: 320, height: 640 });
      await page.evaluate(() => (window as any).fixture.setDark(true));
      const gallery = page.getByRole("region", { name: "아티팩트 갤러리" });
      await gallery.locator('xpath=ancestor::*[@data-dark="true"]').waitFor();
      await page.waitForFunction(() => document.querySelector('.avl-gallery')?.getAttribute("data-cols") === "1");
      const widths = await gallery.evaluate(el => ({ content: el.scrollWidth, viewport: el.clientWidth }));
      assert.equal(widths.content <= widths.viewport, true, "Narrow gallery overflow: " + JSON.stringify(widths));
    });
    await scenario("host-gallery", "remote&unseeded&session=gallery-reader", page => testGallery(page, fixture, calls));
    await scenario("html-history", "", async page => {
      await counterCard(page).waitFor();
      assert.equal(await page.locator("iframe").count(), 0);
      assert.match(await page.getByTestId("native-markdown").innerText(), /문서/);
      assert.doesNotMatch(await page.getByTestId("native-markdown").innerText(), /onclick/);
      await counterCard(page).click();
      const preview = frame(page);
      await preview.locator("#counter").click();
      assert.equal(await preview.locator("#counter").textContent(), "1");
      assert.equal(await page.locator('iframe[title="아티팩트 실행 화면"]').getAttribute("sandbox"), "allow-scripts");
      await page.evaluate(() => { (window as any).outerPreview = document.querySelector("iframe"); });
      await page.evaluate(() => (window as any).fixture.append("html", '<div id="v2">two</div>'));
      await preview.locator("#v2").waitFor();
      await page.evaluate(() => (window as any).fixture.streamHtml('<div id="v3">pending'));
      assert.ok(await preview.locator("#v2").isVisible());
      await page.evaluate(() => (window as any).fixture.streamHtml('<div id="v3">complete</div>', true));
      await preview.locator("#v3").waitFor();
      assert.ok(await page.evaluate(() => (window as any).outerPreview === document.querySelector("iframe")));
      await button(page, "아티팩트 버전").click();
      await page.getByRole("menuitemradio", { name: "버전 1", exact: true }).click();
      await preview.locator("#counter").waitFor();
      await button(page, "아티팩트 버전").click();
      await page.getByRole("menuitemradio", { name: "최신 버전 따라가기" }).click();
      await preview.locator("#v3").waitFor();
      await page.evaluate(() => (window as any).fixture.append("html", '<script>throw new Error("qa-preview-error")</script>'));
      await button(page, "이 오류를 대화에서 수정").click();
      assert.match(await page.evaluate(() => (window as any).fixture.state.sends.at(-1)), /qa-preview-error/);
    });
    await scenario("close-reopen", "remote&session=card-reader", async page => {
      const chatUrl = page.url();
      const timeline = page.locator('[data-testid="timeline"][data-session="card-reader"]');
      const close = button(page, "아티팩트 탭 닫기");
      const gallery = page.getByRole("region", { name: "아티팩트 갤러리" });
      await timeline.waitFor();
      await counterCard(page).click();
      await frame(page).locator("#counter").waitFor();
      assert.equal(await timeline.isVisible(), true);
      assert.equal(page.url(), chatUrl);
      await page.getByTestId("explorer-content").waitFor();
      await close.click();
      await page.getByTestId("explorer-content").waitFor({ state: "detached" });
      await counterCard(page).click();
      await frame(page).locator("#counter").waitFor();
      await close.click();
      assert.deepEqual(await page.evaluate(() => (window as any).fixture.state.agentOpens), []);
      assert.deepEqual(await page.evaluate(() => (window as any).fixture.state.screenOpens), []);
      for (const method of ["slash", "command"]) {
        // Both entry points belong to the conversation. Start there, with no previous gallery
        // query or pending menu reset that could consume an identical input value.
        if (page.url() !== chatUrl) await page.goBack();
        await timeline.waitFor();
        await page.evaluate(m => m === "slash" ? (window as any).fixture.openSlash() : (window as any).fixture.openCommand(), method);
        await gallery.waitFor();
        await gallery.getByRole("listitem").first().waitFor();
        const search = gallery.getByRole("searchbox");
        const filtered = page.waitForResponse(response => response.url().endsWith("/rpc") &&
          response.request().postDataJSON()?.name === "artifact.library_list" &&
          response.request().postDataJSON()?.input.query === "테스트 결과");
        await search.fill("테스트 결과");
        await filtered;
        await gallery.locator('.avl-scroll[aria-busy="false"]').waitFor();
        await gallery.getByRole("listitem", { name: "테스트 결과 열기", exact: true }).click();
        await frame(page).locator("#counter").waitFor();
        await button(page, "갤러리로 돌아가기").click();
        assert.equal(await search.inputValue(), "테스트 결과");
      }
      await page.goBack();
      await timeline.waitFor();
      await page.evaluate(() => (window as any).fixture.openSlash("make a chart"));
      assert.equal(await page.getByTestId("artifact-screen").count(), 0);
      const creationPrompt = await page.evaluate(() => (window as any).fixture.state.sends.at(-1));
      assert.match(creationPrompt, /make a chart/);
      assert.match(creationPrompt, /artifact_publish/);
      for (const args of ["", "원하는 색을 고르는 아티팩트 만들어줘"]) {
        const sent = await page.evaluate(async task => {
          const f = (window as any).fixture, before = f.state.sends.length;
          await f.openSlash(task, "artifact-guide");
          return f.state.sends.slice(before);
        }, args);
        assert.equal(sent.length, 1);
        assert.ok(sent[0].includes("[paseo-artifact-viewer]"));
        assert.ok(sent[0].includes(args || "확인"));
        assert.equal(await page.getByTestId("artifact-screen").count(), 0);
      }
    });
    await scenario("codex-publication", "running&remote&unseeded&answer-cards&session=published", async page => {
      await page.bringToFront();
      await page.waitForFunction(() => document.hasFocus() && !!(window as any).fixture);
      const agent = { id: "published", provider: "codex", cwd: "C:/fixture" };
      const context = { paseo: fixture.paseo };
      const open = fixture.hooks.get("agent.open.before")({ request: { agentId: agent.id, provider: agent.provider, purpose: "interactive", tools: [], mcpServers: {} } }, context);
      const publish = open.tools.find((tool: { name: string }) => tool.name === "artifact_publish");
      const send = async (n: number) => {
        const result = await publish.execute({ requestId: "publish-" + n, key: "live", kind: "html", title: "발행 결과", content: '<div id="published">revision ' + n + "</div>" }, { ...context, agent, signal: new AbortController().signal });
        assert.equal(result.structuredContent.version, n);
        if (n === 1) assert.equal(result.structuredContent.sidebar, "closed");
        await page.evaluate(() => (window as any).fixture.syncRemote());
      };
      await fixture.hooks.get("agent.turn.before")({ agent, turnId: "qa-turn" }, context);
      await send(1);
      const savedCard = button(page, "발행 결과 저장된 아티팩트 열기");
      assert.equal(await savedCard.count(), 0);
      assert.equal(fixture.notices.get(agent.id)?.size ?? 0, 0);
      await page.evaluate(async () => {
        (window as any).fixture.finishAnswer("발행한 결과입니다.");
        await (window as any).fixture.syncRemote();
      });
      await fixture.hooks.get("agent.turn.after")({ agent, turnId: "qa-turn", outcome: { kind: "completed" } }, context);
      await page.evaluate(() => (window as any).fixture.syncRemote());
      await savedCard.waitFor();
      assert.equal(await savedCard.count(), 1);
      assert.match(await savedCard.innerText(), /HTML *· *v1/);
      const answerBox = await page.getByText("발행한 결과입니다.", { exact: true }).boundingBox();
      const cardBox = await savedCard.boundingBox();
      assert.ok(cardBox && answerBox && cardBox.y >= answerBox.y + answerBox.height);
      assert.equal(await page.locator("[data-inline-viewer]").count(), 0);
      assert.equal(await page.getByTestId("artifact-screen").count(), 0);
      assert.equal(await page.evaluate(() => (window as any).fixture.state.screenOpens.length), 0);
      await savedCard.click();
      await frame(page).locator("#published").filter({ hasText: "revision 1" }).waitFor();
      await button(page, "아티팩트 탭 닫기").click();
      await page.getByTestId("timeline").waitFor();
      await send(2);
      await savedCard.nth(1).click();
      await frame(page).locator("#published").filter({ hasText: "revision 2" }).waitFor();
      await button(page, "아티팩트 탭 닫기").click();
      await savedCard.first().click();
      await frame(page).locator("#published").filter({ hasText: "revision 1" }).waitFor();
      const artifactId = await page.locator("section[data-artifact-id]").getAttribute("data-artifact-id");
      await button(page, "아티팩트 탭 닫기").click();
      await page.locator('[data-testid="timeline"][data-session="published"]').waitFor();
      const history = await fixture.rpc("artifact.history", { sessionId: agent.id, artifactId });
      assert.deepEqual(history.items.map((item: any) => item.version), [2, 1]);
      assert.equal(await savedCard.count(), 2);
    });
    await scenario("card-placements", "remote&placements&answer-cards&session=placements&locale=ko", async page => {
      const shape = async () => {
        const timeline = page.getByTestId("timeline");
        await button(page, "옛 결과 저장된 아티팩트 열기").first().waitFor();
        await button(page, "새 결과 저장된 아티팩트 열기").waitFor();
        // Old rows without a placement or marked legacy render nothing, however many there are; the proven card shows once.
        assert.equal(await button(page, "옛 결과 저장된 아티팩트 열기").count(), 1);
        assert.equal(await button(page, "엉뚱한 결과 저장된 아티팩트 열기").count(), 0, "a card whose reply text does not match is never shown");
        assert.equal(await timeline.getByRole("button").count(), 2);
        const old = await page.getByText("예전 질문에 대한 답변입니다.", { exact: true }).boundingBox();
        const last = await page.getByText("마지막 일반 답변입니다.", { exact: true }).boundingBox();
        const saved = await button(page, "옛 결과 저장된 아티팩트 열기").boundingBox(), live = await button(page, "새 결과 저장된 아티팩트 열기").boundingBox();
        assert.ok(old && last && saved && live);
        assert.ok(saved.y >= old.y + old.height - 1 && saved.y + saved.height <= last.y + 1, "the card sits directly under its own old answer");
        assert.ok(live.y >= last.y + last.height - 1, "the live card of this turn follows the latest answer");
        // The unrelated latest answer stays the host's own row: not wrapped by the plugin renderer.
        assert.equal(await page.locator('[data-testid="native-markdown"]', { hasText: "마지막 일반 답변입니다." }).count(), 0);
        assert.equal(await page.locator("p", { hasText: "마지막 일반 답변입니다." }).count(), 1);
      };
      await shape();
      // One load for the conversation, not one per reply or row.
      const sessionCalls = await page.evaluate(() => (window as any).placementCalls.filter((input: any) => input.sessionId === "placements").length);
      assert.equal(sessionCalls, 1);
      // Reopening the conversation (a new window of the same host) shows the very same result.
      await page.goto(base + "?remote&placements&answer-cards&session=placements&locale=ko");
      await shape();
      // Switching to another conversation and back remounts every row and still shows it once.
      await page.evaluate(() => { (window as any).fixture.state.viewedAgent = "elsewhere"; (window as any).fixture.state.viewedAgent = "placements"; });
      await shape();
    });
    await scenario("explicit-open", "remote&unseeded&sidebar&session=sidebar-test", page => testOpen(page, fixture));
    await scenario("window-return", "remote&unseeded&sidebar&session=return-test", page => testWindowReturn(page, fixture));
    await scenario("origin-host-defaults", "workspace-fixture=duplicate&remote&session=host-defaults", testHostDefaults);
    await scenario("origin-retained-tab", "workspace-fixture=duplicate&remote&session=retained-origin", testRetainedOrigin);
    await scenario("origin-expired-workspace", "workspace-fixture=single&remote&sidebar&encoded-path=v2&virtual&session=expired-origin", page => testExpiredOrigin(page, fixture));
    await scenario("origin-near-bottom", "workspace-fixture=single&remote&sidebar&encoded-path=legacy&session=near-bottom-origin", page => testExpiredOrigin(page, fixture, true));
    await scenario("origin-replaced-history", "workspace-fixture=single&remote&session=replaced-history", testReplacedOrigin);
    await scenario("origin-changed-host", "workspace-fixture=single&remote&session=host-change", testChangedHost);
    await scenario("react-consent", "react", async page => {
      await button(page, "React 카운터 아티팩트 열기").click();
      await button(page, "미리보기 시작").waitFor();
      assert.equal(await page.locator("iframe").count(), 0);
      assert.match(await page.getByTestId("explorer-content").innerText(), /CodeSandbox/);
    });
    await scenario("sqlite-management", "remote&session=management", page => testManagement(page, fixture, calls, output, mode));
    await scenario("app-language", "remote&session=release-language&locale=en-US", testAppLanguage);
    await scenario("external-resources", "remote&session=release-network&locale=ko", page => testExternalResources(page, fixture));
    await scenario("hash-links", "remote&session=hash-links&locale=ko", page => testHashLinks(page, fixture));
    await scenario("dynamic-external", "remote&session=dynamic-consent&locale=ko", page => testDynamicExternalConsent(page, fixture));
  }
} finally {
  const reportName = mode + (originOnly ? "-origin" : "") + (sandpack ? "-sandpack" : "") + "-browser-verification.json";
  writeFileSync(join(output, reportName), JSON.stringify({ version: metadata.version, mode, archiveSha256: release?.sha256, browser: browser?.version(), node: process.versions.node, sqlite: process.versions.sqlite, scope: "Headless browser, real registered contributions and isolated SQLite, simulated Paseo host", results }, null, 2) + "\n");
  await browser?.close();
  await new Promise<void>(done => server.close(() => done()));
  await fixture.close();
}
if (!Object.keys(results).length || Object.values(results).some(r => !r.passed)) process.exitCode = 1;
