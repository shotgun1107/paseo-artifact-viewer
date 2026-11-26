import assert from "node:assert/strict";
import type { FrameLocator, Page, Route } from "playwright-core";
import type { startServerFixture } from "./browser-server.mjs";

type Server = Awaited<ReturnType<typeof startServerFixture>>;

// In-document navigation must stay inside the artifact. Only safe, ordinary document features are used here.
const filler = '<div style="height:1600px">spacer</div>';
export const hashDocument = (extra = "") => '<!doctype html><html><head><title>Links</title><style>#section:target{color:green}</style></head><body>'
  + '<a id="jump" href="#section">Jump</a> <a id="totop" href="#">Top</a> <a id="topname" href="#top">Top name</a> <a id="encoded" href="#a%20b">Encoded</a> <a id="missing" href="#nothing-here">Missing</a>'
  + '<button id="prog-hash" onclick="location.hash=\'#section\'">hash</button>'
  + '<p id="still">still here</p><svg width="80" height="20"><a id="svglink" href="#section"><text x="0" y="14">svg</text></a></svg>' + filler
  + '<h2 id="section">Section</h2><h3 id="a b">Spaced</h3><p id="hashes"></p><script>addEventListener("hashchange",()=>{document.getElementById("hashes").textContent=location.hash})</script>' + filler + extra + "</body></html>";

const scrollOf = (child: FrameLocator) => child.locator("#still").evaluate(() => ({ y: Math.round(window.scrollY), top: Math.round(document.getElementById("section")!.getBoundingClientRect().top), hash: location.hash }));

async function exercise(child: FrameLocator, label: string, pages: () => string[]) {
  const reset = () => child.locator("#still").evaluate(() => { location.hash = "#reset"; window.scrollTo(0, 0); });
  for (const [id, expected] of [["#jump", "#section"], ["#svglink", "#section"], ["#prog-hash", "#section"]] as const) {
    await reset();
    const before = pages().join("|");
    await child.locator(id).click();
    await child.locator("#still").waitFor().catch(() => assert.fail(label + " " + id + ": the document vanished: " + pages().join("|")));
    await new Promise(done => setTimeout(done, 350));
    assert.equal(await child.locator("#still").count(), 1, label + " " + id + ": the document survives");
    const at = await scrollOf(child);
    assert.ok(at.y > 800 && Math.abs(at.top) < 4, label + " " + id + ": scrolled to the target " + JSON.stringify(at));
    assert.equal(at.hash, expected, label + " " + id + ": location.hash");
    assert.equal(pages().join("|"), before, label + " " + id + ": no frame navigated");
  }
  // :target styling follows the fragment, and "#" / "#top" return to the top.
  assert.equal(await child.locator("#section").evaluate(el => getComputedStyle(el).color), "rgb(0, 128, 0)", label + ": :target applies");
  await child.locator("#totop").click();
  await new Promise(done => setTimeout(done, 250));
  assert.equal((await scrollOf(child)).y, 0, label + ": # returns to the top");
  await child.locator("#jump").click();
  await child.locator("#topname").click();
  await new Promise(done => setTimeout(done, 250));
  assert.equal((await scrollOf(child)).y, 0, label + ": #top returns to the top");
  await child.locator("#encoded").click();
  await new Promise(done => setTimeout(done, 250));
  assert.ok((await scrollOf(child)).y > 1500, label + ": percent-encoded fragment finds id with a space");
  await child.locator("#jump").click();
  await child.locator("#missing").click();
  await new Promise(done => setTimeout(done, 250));
  assert.equal(await child.locator("#still").count(), 1, label + ": a missing target keeps the document");
}

export async function testHashLinks(page: Page, server: Server) {
  const panelChild = page.frameLocator('iframe[title="아티팩트 실행 화면"]').frameLocator('iframe[title="아티팩트 문서"]');
  const panelFrames = () => page.frames().map(frame => frame.url().replace(/:\d+/, ":<port>").replace(/#.*$/, ""));
  await page.getByRole("button", { name: "테스트 결과 아티팩트 열기", exact: true }).first().click();
  await panelChild.locator("#counter").waitFor();
  await page.evaluate(source => (window as any).fixture.append("html", source), hashDocument());
  await panelChild.locator("#still").waitFor();
  await exercise(panelChild, "panel", panelFrames);

  // The same document survives an older version and returning to the latest, and a new version keeps working.
  await page.getByRole("button", { name: "아티팩트 버전", exact: true }).click();
  await page.getByRole("menuitemradio", { name: "버전 1", exact: true }).click();
  await panelChild.locator("#counter").waitFor();
  await page.getByRole("button", { name: "아티팩트 버전", exact: true }).click();
  await page.getByRole("menuitemradio", { name: "최신 버전 따라가기" }).click();
  await panelChild.locator("#still").waitFor();
  await panelChild.locator("#jump").click();
  await new Promise(done => setTimeout(done, 300));
  assert.equal(await panelChild.locator("#still").count(), 1, "panel: version round trip keeps links working");

  // Offline static mode (the document mentions an external URL) keeps in-document anchors usable.
  await page.evaluate(source => (window as any).fixture.append("html", source), hashDocument('<p><a id="ext" href="https://example.invalid/x">external</a></p>'));
  await panelChild.locator("#still").waitFor();
  await page.getByTestId("artifact-external-allow").waitFor();
  await panelChild.locator("#ext").waitFor();
  await panelChild.locator("#prog-hash").waitFor({ state: "detached" });
  await panelChild.locator("#jump").click();
  await new Promise(done => setTimeout(done, 300));
  assert.equal(await panelChild.locator("#still").count(), 1, "panel static mode: in-document link keeps the document");
  assert.equal((await scrollOf(panelChild)).hash, "#section", "panel static mode: fragment applied");
  assert.equal(await page.getByTestId("artifact-external-allow").count(), 1, "static mode still asks for consent");

  const sessionId = "hash-links";
  const artifact = (await server.rpc("artifact.list", { sessionId })).items[0];
  const { url } = await server.rpc("artifact.manage", { sessionId, artifactId: artifact.artifactId, action: { type: "web", version: artifact.headVersion } });
  const web = await page.context().newPage();
  const errors: string[] = [];
  web.on("pageerror", error => errors.push(error.message));
  try {
    await web.goto(url);
    const child = web.frameLocator("iframe");
    const webFrames = () => web.frames().map(frame => frame.url().replace(/:\d+/, ":<port>").replace(/#.*$/, ""));
    await child.locator("#still").waitFor();
    // The latest version is the static-mode document; link works before consent.
    await child.locator("#jump").click();
    await new Promise(done => setTimeout(done, 300));
    assert.equal(await child.locator("#still").count(), 1, "web static mode: link keeps the document");
    await web.getByRole("button", { name: /Allow external resources|외부 리소스 허용/ }).click();
    await child.locator("#ext").waitFor();
    await exercise(child, "web allowed", webFrames);
    await web.getByRole("button", { name: /Block external resources|외부 리소스 차단/ }).click();
    await child.locator("#still").waitFor();
    await child.locator("#jump").click();
    await new Promise(done => setTimeout(done, 300));
    assert.equal(await child.locator("#still").count(), 1, "web blocked again: link keeps the document");
    assert.deepEqual(errors, []);
  } finally { await web.close(); }

  // A plain (non-external) document in the web view, before any consent decision.
  await page.evaluate(source => (window as any).fixture.append("html", source), hashDocument());
  const latest = (await server.rpc("artifact.list", { sessionId })).items[0];
  const plain = await server.rpc("artifact.manage", { sessionId, artifactId: latest.artifactId, action: { type: "web", version: latest.headVersion } });
  const second = await page.context().newPage();
  try {
    await second.goto(plain.url);
    const child = second.frameLocator("iframe");
    await child.locator("#still").waitFor();
    await exercise(child, "web plain", () => second.frames().map(frame => frame.url().replace(/:\d+/, ":<port>").replace(/#.*$/, "")));
  } finally { await second.close(); }
}

export async function testDynamicExternalConsent(page: Page, server: Server) {
  const requested: string[] = [];
  const domain = "https://dynamic-resources.invalid";
  // Only requests that reach the network layer are counted; a request the policy refuses never gets here.
  await page.context().route(domain + "/**", async (route: Route) => {
    const path = new URL(route.request().url()).pathname;
    requested.push(path);
    await route.fulfill(path.endsWith(".css") ? { contentType: "text/css", body: "p{color:green}" } : { contentType: "text/javascript", body: "document.body.dataset.loaded='true'" });
  });
  // The URL is assembled at run time, so the static reference check cannot see it.
  const content = (name: string) => '<!doctype html><title>Dynamic</title><p id="sample">' + name + '</p><script>var h=["https:","","dynamic-resources.invalid"].join("/");'
    + 'var l=document.createElement("link");l.rel="stylesheet";l.href=h+"/' + name + '.css";document.head.append(l);'
    + 'var s=document.createElement("script");s.src=h+"/' + name + '.js";document.head.append(s)</script>';
  const preview = page.frameLocator('iframe[title="아티팩트 실행 화면"]').frameLocator('iframe[title="아티팩트 문서"]');
  await page.getByRole("button", { name: "테스트 결과 아티팩트 열기", exact: true }).first().click();
  await preview.locator("#counter").waitFor();
  assert.equal(await page.getByTestId("artifact-external-notice").count(), 0, "plain documents show no notice");
  await page.evaluate(source => (window as any).fixture.append("html", source), content("dyn"));
  await preview.locator("#sample").waitFor();
  const notice = page.getByTestId("artifact-external-notice");
  await notice.waitFor();
  assert.equal(await notice.getAttribute("data-external"), "blocked");
  assert.deepEqual(requested, [], "nothing is requested before consent");
  await page.getByTestId("artifact-external-allow").click();
  await preview.locator('body[data-loaded="true"]').waitFor();
  assert.deepEqual([...new Set(requested)].sort(), ["/dyn.css", "/dyn.js"]);
  assert.equal(await notice.getAttribute("data-external"), "allowed");
  // Blocking again returns to the blocked state, and the notice returns once the document is reloaded blocked.
  requested.length = 0;
  await page.getByTestId("artifact-external-block").click();
  await preview.locator("#sample").waitFor();
  await page.getByTestId("artifact-external-allow").waitFor();
  assert.deepEqual(requested, []);
  // A new version needs its own consent and shows no stale notice for a clean document.
  await page.evaluate(source => (window as any).fixture.append("html", source), '<div id="clean">clean</div>');
  await preview.locator("#clean").waitFor();
  await new Promise(done => setTimeout(done, 400));
  assert.equal(await page.getByTestId("artifact-external-notice").count(), 0, "a clean new version clears the notice");
  // Blocked connections (fetch) cannot be fixed by consent: no prompt for them.
  await page.evaluate(source => (window as any).fixture.append("html", source), '<div id="net">net</div><script>fetch(["https:","","dynamic-resources.invalid"].join("/")+"/x.json").catch(()=>{})</script>');
  await preview.locator("#net").waitFor();
  await new Promise(done => setTimeout(done, 400));
  assert.equal(await page.getByTestId("artifact-external-notice").count(), 0, "connect-src violations do not offer consent");
  assert.deepEqual(requested, []);
  void server;
}
