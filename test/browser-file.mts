import assert from "node:assert/strict";
import type { Page } from "playwright-core";

export async function testFileEditor(page: Page) {
  await page.getByRole("tab", { name: "코드", exact: true }).click();
  const editor = page.getByLabel("아티팩트 코드", { exact: true });
  const edit = async (text: string) => {
    await editor.click();
    await page.keyboard.press("ControlOrMeta+a");
    await page.keyboard.insertText(text);
    await page.waitForFunction(() => (window as any).fixture.state.modified === true);
  };
  const saved = '<div id="saved">저장 테스트</div>';
  await edit(saved);
  await page.getByRole("button", { name: "파일 저장", exact: true }).click();
  await page.waitForFunction(() => (window as any).fixture.state.modified === false);
  assert.equal(await page.evaluate(() => (window as any).fixture.state.fileText), saved);
  await edit("unsaved edits");
  await page.evaluate(() => (window as any).fixture.externalFile("<div>external edit</div>"));
  await page.locator(".av-conflict").waitFor();
  assert.equal(await editor.innerText(), "unsaved edits");
  assert.ok(await page.getByRole("button", { name: "파일 저장" }).isDisabled());
  await page.getByRole("button", { name: "편집 내용을 버리고 파일 다시 불러오기" }).click();
  await page.getByRole("tab", { name: "코드" }).click();
  await page.waitForFunction(() => (window as any).fixture.state.modified === false);
  assert.equal(await editor.innerText(), "<div>external edit</div>");
}
