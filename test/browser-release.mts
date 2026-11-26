import assert from "node:assert/strict";
import type { Page, Route } from "playwright-core";
import type { startServerFixture } from "./browser-server.mjs";

type Server = Awaited<ReturnType<typeof startServerFixture>>;

export async function testAppLanguage(page: Page) {
  await page.getByRole("navigation").getByRole("button", { name: "Artifacts", exact: true }).click();
  const search = page.getByRole("searchbox", { name: "Search artifacts" });
  await search.waitFor();
  await page.getByRole("listitem", { name: "Open 테스트 결과" }).first().waitFor();
  await page.evaluate(() => (window as any).fixture.state.setLocale("ko-KR"));
  await page.getByRole("searchbox", { name: "아티팩트 검색" }).waitFor();
  await page.getByRole("listitem", { name: "테스트 결과 열기" }).first().waitFor();
  await page.evaluate(() => (window as any).fixture.state.setLocale("fr-FR"));
  await search.waitFor();
  assert.equal(await search.getAttribute("placeholder"), "Search titles");
}

export async function testExternalResources(page: Page, server: Server) {
  const requested: string[] = [];
  const domain = "https://preview-resources.invalid";
  page.context().on("request", request => {
    if (request.url().startsWith(domain + "/")) requested.push(new URL(request.url()).pathname);
  });
  const handle = async (route: Route) => {
    const path = new URL(route.request().url()).pathname;
    const response = path.endsWith(".css") ? { contentType: "text/css", body: "p{color:green}" }
      : path.endsWith(".js") ? { contentType: "text/javascript", body: "document.body.dataset.loaded='true'" }
      : { contentType: "image/svg+xml", body: '<svg xmlns="http://www.w3.org/2000/svg"/>' };
    await route.fulfill(response);
  };
  await page.context().route(domain + "/**", handle);
  const content = (name: string) => '<!doctype html><title>Resources</title><link rel="stylesheet" href="' + domain + '/' + name + '.css">' +
    '<p id="sample">' + name + '</p><img src="' + domain + '/' + name + '.svg"><script src="' + domain + '/' + name + '.js"></script>';
  const paths = (name: string) => ["/" + name + ".css", "/" + name + ".js", "/" + name + ".svg"];
  const assertRequests = (expected: string[]) => assert.deepEqual([...new Set(requested)].sort(), expected.sort());
  const preview = page.frameLocator('iframe[title="아티팩트 실행 화면"]').frameLocator('iframe[title="아티팩트 문서"]');
  await page.getByRole("button", { name: "테스트 결과 아티팩트 열기", exact: true }).first().click();
  await preview.locator("#counter").waitFor();
  await page.evaluate(source => (window as any).fixture.append("html", source), content("first"));
  await preview.locator("#sample").waitFor();
  assertRequests([]);
  await page.getByTestId("artifact-external-allow").click();
  await preview.locator('body[data-loaded="true"]').waitFor();
  assertRequests(paths("first"));
  requested.length = 0;
  // A new version with the very same bytes still needs its own consent.
  await page.evaluate(source => (window as any).fixture.append("html", source), content("first"));
  await page.getByTestId("artifact-external-allow").waitFor();
  assertRequests([]);
  await page.evaluate(source => (window as any).fixture.append("html", source), content("second"));
  await preview.getByText("second").waitFor();
  await page.getByTestId("artifact-external-allow").waitFor();
  assertRequests([]);

  const sessionId = "release-network";
  const artifact = (await server.rpc("artifact.list", { sessionId })).items[0];
  const { url } = await server.rpc("artifact.manage", { sessionId, artifactId: artifact.artifactId, action: { type: "web", version: artifact.headVersion } });
  const web = await page.context().newPage();
  try {
    await web.goto(url);
    const doc = web.frameLocator("iframe");
    await doc.getByText("second").waitFor();
    assertRequests([]);
    await web.getByRole("button", { name: /Allow external resources|외부 리소스 허용/ }).click();
    await doc.locator('body[data-loaded="true"]').waitFor();
    assertRequests(paths("second"));
    requested.length = 0;
    await web.reload();
    await doc.getByText("second").waitFor();
    assert.equal(await doc.locator('body[data-loaded="true"]').count(), 0);
    assertRequests([]);
  } finally { await web.close(); }
}
