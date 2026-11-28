import test from "node:test";
import assert from "node:assert/strict";
import { extractArtifacts, artifactMessageText, artifactPrompt, MAX_SOURCE_LENGTH } from "../src/shared/artifacts";
import { ArtifactStore } from "../src/client/store";
import { buildReactSetup } from "../src/client/sandbox";

const html = (id: string, content: string) => `\`\`\`html artifact="${id}" title="계산기"\n<div>${content}</div>\n\`\`\``;
test("fenced artifacts preserve identity across messages; ordinary snippets are not claimed", () => {
  assert.deepEqual(extractArtifacts("본문 [파일](C:/test%20file.md)\n```python\nprint(1)\n```", "a"), []);
  const a = extractArtifacts(html("counter", "A"), "message-1")[0], b = extractArtifacts(html("counter", "B"), "message-2")[0];
  assert.equal(a.id, b.id); assert.equal(a.title, "계산기"); assert.equal(a.complete, true);
  assert.notEqual(extractArtifacts("```html\n<div>A</div>\n```", "m1")[0].id, extractArtifacts("```html\n<div>A</div>\n```", "m2")[0].id);
});
test("partial fences and nested longer fences are bounded and never treated as complete prematurely", () => {
  assert.equal(extractArtifacts("```tsx artifact=chart\nexport default () => <div/>", "x")[0].complete, false);
  assert.equal(extractArtifacts("````html\n<div>```</div>\n```\nmore\n````", "x")[0].complete, true);
  assert.deepEqual(extractArtifacts("```html\n<div>" + "x".repeat(MAX_SOURCE_LENGTH) + "</div>\n```", "x"), []);
});
test("generated titles and prompts follow locale while authored titles, code and keys survive unchanged", () => {
  const text = '```html artifact="clock"\n<main/>\n```\n<artifact type="html"><div/></artifact>';
  const en = extractArtifacts(text, "msg"), ko = extractArtifacts(text, "msg", "ko-KR");
  assert.deepEqual(en.map(a => a.title), ["HTML artifact 1", "Artifact"]);
  assert.deepEqual(ko.map(a => a.title), ["HTML 아티팩트 1", "아티팩트"]);
  assert.deepEqual(en.map(a => a.id), ko.map(a => a.id));
  const titled = extractArtifacts('```html\n<title>한국어 제목</title><main/>\n```', "msg")[0];
  assert.equal(titled.title, "한국어 제목");
  const current = { ...titled, artifactId: "stored" };
  for (const tag of ["en", "ko-KR"]) {
    const prompt = artifactPrompt("clock", "Change 색상", current, tag);
    for (const literal of ["Change 색상", "stored", 'artifact="clock" title="한국어 제목"', current.code])
      assert.ok(prompt.includes(literal));
    assert.match(prompt, tag === "en" ? /Publish a new version/ : /새 버전으로 발행/);
  }
});
test("Claude artifact envelopes retain identity and prose; nested fences are not duplicated", () => {
  const source = '설명 [파일](C:/test%20file.md)\n<antArtifact identifier="dashboard" type="application/vnd.ant.react" title="대시보드">\n```tsx\nexport default function App(){return <div/>}\n```\n</antArtifact>\n다음 설명';
  const values = extractArtifacts(source, "m1");
  assert.equal(values.length, 1); assert.equal(values[0].id, "dashboard"); assert.equal(values[0].kind, "react"); assert.equal(values[0].complete, true);
  assert.match(values[0].code, /^export default/);
  assert.equal(artifactMessageText(source, values), '설명 [파일](C:/test%20file.md)\n\n다음 설명');
  const partial = extractArtifacts('<antArtifact identifier="a" type="text/html"><div>partial', "m2")[0];
  assert.equal(partial.complete, false);
  assert.deepEqual(extractArtifacts('```python\ntext="<artifact type=html><div>literal</div></artifact>"\n```', "m3"), []);
});
test("stream revisions replace a draft, commits form versions, repeat hydration does not duplicate them", () => {
  const store = new ArtifactStore(), a = extractArtifacts(html("counter", "A"), "m1"), b = extractArtifacts(html("counter", "B"), "m2");
  store.ingest(a, "m1", "1"); store.ingest(b, "m2", "2", true);
  assert.equal(store.snapshot()[0].versions.length, 1); assert.equal(store.snapshot()[0].draft?.code, b[0].code);
  store.ingest(b, "m2", "2"); store.ingest(b, "m2", "2");
  assert.equal(store.snapshot()[0].versions.length, 2); assert.equal(store.snapshot()[0].draft, undefined);
  store.replace([{ values: a, source: "m1", timestamp: "1" }]); assert.equal(store.snapshot()[0].versions.length, 1);
});
test("closing an artifact does not discard versions, and clicking its card reopens it", () => {
  const store = new ArtifactStore(); store.ingest(extractArtifacts(html("counter", "A"), "m1"), "m1", "1");
  store.focus("counter"); store.dismiss(); assert.equal(store.visible, false); assert.equal(store.snapshot()[0].versions.length, 1);
  store.ingest(extractArtifacts(html("counter", "B"), "m2"), "m2", "2"); assert.equal(store.visible, false);
  store.focus("counter"); assert.equal(store.visible, true); assert.equal(store.snapshot()[0].versions.length, 2);
});
test("React setup pins dependencies, accepts App fallback, rejects unresolved local or arbitrary package imports", () => {
  const setup = buildReactSetup('import {useState} from "react"; import {Plus} from "lucide-react"; function App(){return <Plus/>}');
  assert.equal(setup.dependencies?.react, "18.3.1"); assert.equal(setup.dependencies?.["lucide-react"], "0.468.0");
  assert.match(setup.files["/App.tsx"].code, /export default App/);
  assert.throws(() => buildReactSetup('import Widget from "./Widget"; export default Widget;'), /Unsupported import/);
  assert.throws(() => buildReactSetup('import danger from "arbitrary-package"; export default danger;'), /Unsupported import/);
  assert.match(artifactPrompt("counter", "고쳐줘"), /artifact="counter"/);
});
