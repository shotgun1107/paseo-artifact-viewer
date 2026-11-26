// Captures the public screenshots (media/gallery.png, media/preview.png) and renders media/icon.png.
// It drives the real client and server entries through the isolated browser fixture in test/, with
// synthetic data only. Nothing is installed or published. Usage:
//   node --import tsx scripts/release-media.mts [--lang=en|ko] [--out=media]
import { createServer } from "node:http";
import { existsSync, mkdirSync, readFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { build } from "esbuild";
import { chromium, type Page } from "playwright-core";
import { startServerFixture } from "../test/browser-server.mjs";
import { gallerySamples, type Sample } from "./release-media/samples.mts";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const arg = (name: string, fallback: string) => process.argv.find(a => a.startsWith("--" + name + "="))?.split("=")[1] ?? fallback;
const lang = arg("lang", "en");
const out = resolve(root, arg("out", "media"));
mkdirSync(out, { recursive: true });
const SIZE = { width: 1440, height: 1000 };

const host = join(root, "test/browser-host.tsx");
const code = await build({ entryPoints: [join(root, "test/browser-app.tsx")], bundle: true, write: false, format: "iife", platform: "browser", jsx: "automatic", define: { "process.env.NODE_ENV": '"production"' }, plugins: [{ name: "test-host", setup(b) {
  b.onResolve({ filter: /^(@getpaseo\/plugin\/client(?:\/ui)?|react-native)$/ }, () => ({ path: host, namespace: "media-host" }));
  // The fixture host is reused unchanged. Translation hooks are added here only while it does not provide them,
  // so the capture follows the page language the way the host app language drives the real plugin.
  b.onLoad({ filter: /.*/, namespace: "media-host" }, () => {
    const source = readFileSync(host, "utf8");
    const shim = /useTranslation/.test(source) ? "" : '\nexport const defineTranslations = (value: any) => value;\nexport const useTranslation = () => ({ locale: document.documentElement.lang || "en" });\n';
    return { contents: source + shim, loader: "tsx", resolveDir: dirname(host) };
  });
} }] });
const fixture = await startServerFixture();
// The habit tracker is published through the chat in the panel scenario, then the gallery lists it with the rest.
// Synthetic workspace and conversation names with public English wording.
const workspaces = [{ id: "test-workspace", name: "Design studio" }, { id: "gallery-workspace", name: "Travel planning" }];
const agents = [
  { id: "gallery-a", title: "Landing page ideas", workspaceId: "test-workspace" },
  { id: "gallery-b", title: "Weekend trip", workspaceId: "gallery-workspace" },
  { id: "gallery-c", title: "Language practice", workspaceId: "gallery-workspace" },
  { id: "gallery-d", title: "Weekly routines", workspaceId: "gallery-workspace" },
];
const directory = (entries: unknown[]) => ({ entries, pageInfo: { nextCursor: null, prevCursor: null, hasMore: false } });
(fixture.paseo.workspaces as any).list = async () => directory(workspaces);
(fixture.paseo.agents as any).list = async () => directory(agents.map(agent => ({ agent })));

const entry = (s: Sample, seq: number) => ({ seqStart: seq, seqEnd: seq, timestamp: new Date().toISOString(), item: {
  type: "assistant_message", messageId: s.key + "-" + seq,
  text: ["~~~" + s.language + ' artifact="' + s.key + '" title="' + s.title + '"', s.content, "~~~"].join("\n") } });
const place: Record<string, string> = { "sunrise-poster": "gallery-a", "quarterly-chart": "gallery-a", "geometric-pattern": "gallery-a", "bloom-pattern": "gallery-a",
  "budget-planner": "gallery-b", "flashcard-deck": "gallery-c", "forest-badge": "gallery-b", "pomodoro-timer": "gallery-c" };
for (const agent of agents) fixture.timelines.set(agent.id, gallerySamples.filter(s => place[s.key] === agent.id).map(entry));
for (const agent of agents) await fixture.rpc("artifact.backfill", { sessionId: agent.id });

const server = createServer(async (req, res) => {
  const stream = req.url?.match(/^\/sidebar-events\/(artifact\.sidebar_(?:refresh_)?requests)$/);
  if (stream) { res.writeHead(200, { "Content-Type": "text/event-stream" }); res.write(": ready\n\n"); return; }
  if (req.method === "POST" && req.url === "/rpc") {
    res.setHeader("Content-Type", "application/json");
    try {
      const chunks: Buffer[] = [];
      for await (const chunk of req) chunks.push(chunk);
      const { name, input, entries, sessionId } = JSON.parse(Buffer.concat(chunks).toString("utf8"));
      if (sessionId === input.sessionId) fixture.timelines.set(sessionId, entries);
      const output = await fixture.rpc(name, input);
      res.end(JSON.stringify({ output, notices: [...(fixture.notices.get(sessionId)?.values() ?? [])] }));
    } catch (err) { res.statusCode = 400; res.end(JSON.stringify({ error: String(err) })); }
    return;
  }
  if (req.url === "/app.js") { res.setHeader("Content-Type", "text/javascript"); res.end(code.outputFiles[0].contents); return; }
  const path = req.url?.split("?")[0];
  if (path !== "/" && !path?.startsWith("/h/")) { res.statusCode = 404; res.end(); return; }
  res.setHeader("Content-Type", "text/html;charset=utf-8");
  res.end(`<!doctype html><html lang="${lang}"><meta charset="utf-8"><title>Artifact Viewer</title><style>body{margin:0}</style><div id="root"></div><script src="/app.js"></script></html>`);
});
await new Promise<void>(r => server.listen(0, "127.0.0.1", r));
const base = "http://127.0.0.1:" + (server.address() as { port: number }).port + "/";
const executablePath = process.env.ARTIFACT_TEST_BROWSER ?? ["C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe", "C:/Program Files/Google/Chrome/Application/chrome.exe", chromium.executablePath()].find(existsSync);
if (!executablePath) throw new Error("Set ARTIFACT_TEST_BROWSER to a Chromium executable.");
const browser = await chromium.launch({ executablePath, headless: true });

async function open(params: string) {
  const context = await browser.newContext({ viewport: SIZE, locale: lang === "ko" ? "ko-KR" : "en-US", colorScheme: "light", deviceScaleFactor: 1 });
  const page = await context.newPage();
  page.setDefaultTimeout(15000);
  page.on("pageerror", err => console.error("pageerror", err.message));
  await page.goto(base + "?" + params + "&locale=" + lang);
  return { page, context };
}
// The fixture draws a bare host sidebar button and a tab label that real Paseo draws itself; hide them in the shot.
const hideFixtureChrome = (page: Page) => page.addStyleTag({ content: 'nav[aria-label],[data-testid^="workspace-tab-"]{visibility:hidden}' });
const settle = (page: Page) => page.evaluate(async () => { await document.fonts.ready; await new Promise(r => setTimeout(r, 500)); });

try {
  // Panel beside the conversation: the preview of one artifact next to its chat message.
  {
    const { page, context } = await open("remote&unseeded&session=gallery-d");
    const habit = gallerySamples.find(s => s.key === "habit-tracker")!;
    // The same message the conversation already holds, so the library keeps a single version.
    await page.evaluate(({ id, text }) => {
      const state = (window as any).fixture.state;
      state.entries.push({ seqStart: 0, seqEnd: 0, timestamp: new Date().toISOString(), provider: "fixture", item: { type: "assistant_message", messageId: id, text } });
    }, { id: "habit-tracker-0", text: ["~~~html artifact=\"habit-tracker\" title=\"Habit tracker\"", habit.content, "~~~"].join("\n") });
    await page.evaluate(() => (window as any).fixture.syncRemote());
    await page.evaluate(() => (window as any).fixture.finishAnswer("Here is a weekly habit tracker you can click through. Tap a day to mark it done."));
    const card = page.getByRole("button", { name: /Habit tracker/ }).first();
    await card.waitFor();
    await card.click();
    const preview = page.frameLocator("iframe").first().frameLocator("iframe");
    await preview.locator(".row").first().waitFor();
    await preview.locator(".d").nth(2).click();
    await hideFixtureChrome(page);
    // The fixture timeline lists the history card and the live card; real Paseo shows one. Keep the first, add padding.
    await page.addStyleTag({ content: '[data-testid="timeline"]{padding:28px 32px}' });
    await page.evaluate(() => { const cards = [...document.querySelectorAll('[data-testid="timeline"] button')]; cards.slice(1).forEach(c => ((c.parentElement as HTMLElement).style.display = "none")); });
    await page.setViewportSize({ width: 1440, height: 780 });
    await settle(page);
    await page.screenshot({ path: join(out, "preview.png") });
    await context.close();
  }
  // Gallery: every conversation's artifacts in one grid.
  {
    const { page, context } = await open("remote&unseeded&session=gallery-reader");
    await page.getByRole("navigation").getByRole("button").first().click();
    await page.waitForFunction(n => document.querySelectorAll('[role="listitem"]').length >= n, gallerySamples.length);
    await page.locator(".avl-gallery img").first().evaluate(async n => { await (n as HTMLImageElement).decode(); });
    await hideFixtureChrome(page);
    await settle(page);
    await page.screenshot({ path: join(out, "gallery.png") });
    await context.close();
  }
  // Icon: a preview window holding a code glyph, rendered from a self-contained page.
  {
    const context = await browser.newContext({ viewport: { width: 512, height: 512 }, deviceScaleFactor: 1 });
    const page = await context.newPage();
    await page.setContent(`<!doctype html><style>html,body{margin:0;background:transparent}</style>
<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512">
<defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#6a5cff"/><stop offset="1" stop-color="#2fb7e8"/></linearGradient></defs>
<rect width="512" height="512" rx="112" fill="url(#g)"/>
<rect x="88" y="120" width="336" height="272" rx="32" fill="#fff"/>
<path d="M88 152a32 32 0 0 1 32-32h272a32 32 0 0 1 32 32v28H88z" fill="#e4e7f7"/>
<circle cx="126" cy="150" r="9" fill="#ff6b6b"/><circle cx="156" cy="150" r="9" fill="#ffc94d"/><circle cx="186" cy="150" r="9" fill="#4cd68b"/>
<path d="M214 252l-42 40 42 40M298 252l42 40-42 40" fill="none" stroke="#5b4fe6" stroke-width="22" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M270 244l-28 96" stroke="#2fb7e8" stroke-width="20" stroke-linecap="round"/>
</svg>`);
    await page.screenshot({ path: join(out, "icon.png"), omitBackground: true });
    await context.close();
  }
  console.log("Wrote gallery.png, preview.png and icon.png to " + out);
} finally {
  await browser.close();
  server.close();
  await fixture.close();
}
