import test from "node:test";
import assert from "node:assert/strict";
import { JSDOM, VirtualConsole } from "jsdom";
import { buildReactSetup, htmlDocument, readHtmlMessage } from "../src/client/sandbox";
import { createPreviewSession } from "../src/client/preview-session";

function fixture() { const dom = new JSDOM('<iframe sandbox="allow-scripts"></iframe>', { url: "https://paseo.test" }); return { dom, frame: dom.window.document.querySelector("iframe")! }; }
test("HTML bridge rejects wrong source, nonopaque origin, tokens and malformed payloads", () => {
  const { dom, frame } = fixture();
  const data = { channel: "paseo-artifact", token: "secret", sequence: 1, kind: "error", message: "test" };
  const event = { data, source: frame.contentWindow, origin: "null" } as unknown as MessageEvent;
  assert.equal(readHtmlMessage(event, frame, "secret")?.message, "test");
  assert.equal(readHtmlMessage({ ...event, origin: "https://evil.test" } as MessageEvent, frame, "secret"), null);
  assert.equal(readHtmlMessage({ ...event, source: dom.window } as unknown as MessageEvent, frame, "secret"), null);
  assert.equal(readHtmlMessage(event, frame, "old-token"), null);
  for (const sequence of [-1, 1.5, NaN, "1", undefined]) assert.equal(readHtmlMessage({ ...event, data: { ...data, sequence } } as MessageEvent, frame, "secret"), null);
  assert.equal(readHtmlMessage({ ...event, data: { ...data, kind: "SetContent" } } as MessageEvent, frame, "secret"), null);
  dom.window.close();
});
test("HTML boots once, sends only newest pending content and requires the current delivery acknowledgement", () => {
  const { dom, frame } = fixture(), status: any[] = [];
  const session = createPreviewSession(frame, "html", "<div>first</div>", next => status.push(next));
  const initialDocument = frame.srcdoc;
  const token = /"token":"([^"]+)"/.exec(initialDocument)![1];
  const posted: any[] = [];
  frame.contentWindow!.postMessage = (data: any) => { posted.push(data); };
  const send = (sequence: number, kind: string, message = "") => dom.window.dispatchEvent(new dom.window.MessageEvent("message", { source: frame.contentWindow, origin: "null", data: { channel: "paseo-artifact", token, sequence, kind, message } }));
  session.update("<div>second</div>"); session.update("<div>latest</div>");
  assert.equal(posted.length, 0);
  send(0, "ReadyForContent");
  assert.deepEqual(posted.map(p => [p.kind, p.sequence, p.content]), [["SetContent", 3, "<div>latest</div>"]]);
  assert.equal(frame.srcdoc, initialDocument);
  send(3, "ready"); assert.equal(status.at(-1).state, "loading");
  send(3, "ContentApplied"); send(3, "ready"); assert.equal(status.at(-1).state, "ready");
  session.update("<div>fourth</div>");
  assert.equal(posted.at(-1).sequence, 4); assert.equal(frame.srcdoc, initialDocument);
  send(3, "error", "old failure"); assert.equal(status.at(-1).state, "loading");
  send(4, "error", "current failure"); send(4, "ContentApplied"); send(4, "ready");
  assert.equal(status.at(-1).state, "error");
  assert.equal(status.at(-1).source, "<div>fourth</div>");
  const count = status.length;
  session.dispose(); session.dispose(); session.update("ignored"); send(4, "error");
  assert.equal(status.length, count);
  assert.equal(frame.src, "about:blank"); dom.window.close();
});

test("stable HTML host gives each complete document a fresh realm and forwards only current child results", async () => {
  // Execute only our public-source bootstrap, never extracted Claude code.
  const captured: any[] = [];
  const scriptErrors: any[] = [];
  const virtualConsole = new VirtualConsole();
  virtualConsole.on("jsdomError", error => scriptErrors.push(error));
  const dom = new JSDOM(htmlDocument("", "secret", "https://paseo.test"), {
    url: "https://frame.test", runScripts: "dangerously", pretendToBeVisual: true, virtualConsole,
    beforeParse(window) { Object.defineProperty(window, "parent", { value: { postMessage: (data: any) => captured.push(data) } }); },
  });
  const window = dom.window;
  const send = (sequence: number, content: string, overrides: any = {}) => window.dispatchEvent(new window.MessageEvent("message", { source: window.parent, origin: "https://paseo.test", data: { channel: "paseo-artifact", token: "secret", kind: "SetContent", sequence, content }, ...overrides }));
  await new Promise(resolve => setTimeout(resolve, 0));
  assert.equal(captured[0]?.kind, "ReadyForContent");
  send(1, '<!doctype html><html lang="en"><head><title>Complete document</title><style>body{color:blue}</style></head><body><button id="first">first</button><script>const count=1;window.initialExecuted=count</script></body></html>');
  const firstFrame = window.document.querySelector("iframe")!;
  const childMessage = (frame: any, data: any, origin = "null") => window.dispatchEvent(new window.MessageEvent("message", { source: frame.contentWindow, origin, data }));
  // jsdom does not execute srcdoc children. Create their actual serialized
  // documents as separate realms and relay the browser-equivalent message source.
  const child = (frame: any) => new JSDOM(frame.srcdoc, { url: "https://content.test", runScripts: "dangerously", pretendToBeVisual: true, virtualConsole, beforeParse(childWindow) { Object.defineProperty(childWindow, "parent", { value: { postMessage(data: any) { childMessage(frame, data); } } }); } });
  const first = child(firstFrame);
  await new Promise(resolve => setTimeout(resolve, 40));
  assert.equal(first.window.document.title, "Complete document");
  assert.equal(first.window.document.documentElement.lang, "en");
  assert.equal((first.window as any).initialExecuted, 1);
  assert.equal((window as any).initialExecuted, undefined);
  assert.ok(captured.some(m => m.sequence === 1 && m.kind === "ContentApplied"));
  assert.ok(captured.some(m => m.sequence === 1 && m.kind === "ready"));
  assert.equal(first.window.document.querySelector("head")!.firstElementChild!.getAttribute("http-equiv"), "Content-Security-Policy");
  assert.equal(firstFrame.getAttribute("sandbox"), "allow-scripts");
  assert.equal(firstFrame.title, "Artifact document");
  send(1, '<div id="old">old</div>');
  send(2, '<div id="wrong">wrong</div>', { origin: "https://evil.test" });
  assert.equal(window.document.querySelector("iframe"), firstFrame);
  send(2, '<div id="new">new</div><script>const count=2;window.currentExecuted=count;throw new Error("current-script-error")</script>');
  const secondFrame = window.document.querySelector("iframe")!;
  assert.notEqual(firstFrame, secondFrame);
  const second = child(secondFrame);
  await new Promise(resolve => setTimeout(resolve, 40));
  assert.ok(second.window.document.querySelector("#new"));
  assert.equal((second.window as any).currentExecuted, 2);
  assert.ok(captured.some(m => m.kind === "error" && m.sequence === 2 && m.message === "current-script-error"));
  const count = captured.length;
  childMessage(firstFrame, { channel: "paseo-artifact-content", token: "secret", sequence: 2, kind: "error", message: "retired child" });
  childMessage(secondFrame, { channel: "paseo-artifact-content", token: "secret", sequence: 1, kind: "error", message: "retired sequence" });
  childMessage(secondFrame, { channel: "paseo-artifact-content", token: "secret", sequence: 2, kind: "error", message: "wrong origin" }, "https://evil.test");
  assert.equal(captured.length, count);
  assert.deepEqual(scriptErrors.map(error => error.detail?.message), ["current-script-error"]);
  first.window.close(); second.window.close(); window.close();
});
test("a lazy React client destroyed after unmount cannot attach; pending code updates use the newest body", async () => {
  const { dom, frame } = fixture(); let finish!: (client: any) => void, destroyed = 0;
  const client = { destroy() { destroyed++; }, listen() { return () => {}; }, updateSandbox() {} };
  const session = createPreviewSession(frame, "react", "export default () => <div/>", () => {}, () => new Promise(resolve => { finish = resolve; }));
  session.dispose(); finish(client); await new Promise(resolve => setImmediate(resolve)); assert.equal(destroyed, 1);
  let latest = "";
  const second = createPreviewSession(frame, "react", "export default () => <div>old</div>", () => {}, () => new Promise(resolve => { finish = resolve; }));
  second.update("export default () => <div>new</div>"); finish({ ...client, updateSandbox(setup: any) { latest = setup.files["/App.tsx"].code; } });
  await new Promise(resolve => setImmediate(resolve)); assert.match(latest, />new</); second.dispose(); dom.window.close();
});

test("React rendered readiness and errors are bound to exact code revision, frame and external origin", async () => {
  const { dom, frame } = fixture(), states: any[] = [], setups: any[] = [];
  let listener!: (data: any) => void;
  let unlistened = 0, destroyed = 0;
  const session = createPreviewSession(frame, "react", "export default () => <div>one</div>", state => states.push(state), async (_frame, setup) => {
    frame.src = "https://sandpack.test/"; setups.push(setup);
    return { destroy() { destroyed++; }, listen(callback) { listener = callback; return () => { unlistened++; }; }, updateSandbox(setup) { setups.push(setup); } };
  });
  await new Promise(resolve => setImmediate(resolve));
  const revision = () => JSON.parse(/const revision = (\{[^\n]+\});/.exec(setups.at(-1).files["/index.tsx"].code)![1]);
  const initial = revision();
  const send = (data: any, origin = "https://sandpack.test") => dom.window.dispatchEvent(new dom.window.MessageEvent("message", { source: frame.contentWindow, origin, data: { channel: "paseo-artifact-react", ...data } }));
  listener({ type: "done" }); assert.equal(states.at(-1).state, "loading");
  listener({ type: "action", action: "show-error", message: "old-before-start" }); assert.equal(states.at(-1).state, "loading");
  send({ ...initial, kind: "ready", message: "" }, "https://evil.test"); assert.equal(states.at(-1).state, "loading");
  send({ ...initial, kind: "ready", message: "" }); assert.equal(states.at(-1).state, "ready");
  session.update("export default () => <div>two</div>"); const current = revision();
  assert.equal(current.sequence, initial.sequence + 1);
  send({ ...initial, kind: "error", message: "old-runtime" }); assert.equal(states.at(-1).state, "loading");
  listener({ type: "start" }); listener({ type: "action", action: "show-error", message: "new compile error" });
  send({ ...current, kind: "ready", message: "" }); assert.equal(states.at(-1).state, "error");
  assert.match(states.at(-1).source, />two</);
  session.dispose(); assert.equal(unlistened, 1); assert.equal(destroyed, 1);
  const count = states.length; listener({ type: "error", message: "late" }); assert.equal(states.length, count); dom.window.close();
});

test("React runtime bridge is embedded only when the host supplies a revision", () => {
  const setup = buildReactSetup("export default () => <div/>", { token: "bridge-token", sequence: 5, parentOrigin: "https://paseo.test" });
  assert.match(setup.files["/index.tsx"].code, /paseo-artifact-react/);
  assert.match(setup.files["/index.tsx"].code, /componentDidCatch/);
  assert.match(setup.files["/index.tsx"].code, /"sequence":5/);
});
