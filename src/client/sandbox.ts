import { blockedResourceScript, hashLinkScript, htmlPolicy, offlineMarkupScript } from "../shared/html-policy";
import { ui, uiLocale } from "./ui-locale";
import { MAX_SOURCE_LENGTH } from "../shared/artifacts";
import type { SandboxSetup } from "@codesandbox/sandpack-client";

export interface ContentRevision { token: string; sequence: number; parentOrigin: string; }

export function buildReactSetup(code: string, revision?: ContentRevision): SandboxSetup {
  if (code.length > MAX_SOURCE_LENGTH) throw new Error(ui("Preview code exceeds 512 KB.", "미리보기 코드가 512KB를 넘습니다."));
  const imports = [...code.matchAll(/(?:\bfrom\s*|\bimport\s*\(|\brequire\s*\(|\bimport\s*)["']([^"']+)["']/g)].map(m => m[1]);
  const dependencies: Record<string, string> = { react: "18.3.1", "react-dom": "18.3.1" };
  const supported: Record<string, string> = { "lucide-react": "0.468.0", recharts: "2.15.4" };
  for (const specifier of imports) {
    const name = specifier.startsWith("@") ? specifier.split("/").slice(0, 2).join("/") : specifier.split("/")[0];
    if (name === "react" || name === "react-dom") continue;
    if (!Object.hasOwn(supported, name)) throw new Error(ui(`Unsupported import: ${specifier}. Use a single file with react, react-dom, lucide-react or recharts.`, `지원하지 않는 import: ${specifier}. 단일 파일과 react, react-dom, lucide-react, recharts를 사용할 수 있습니다.`));
    dependencies[name] = supported[name];
  }
  const source = /\bexport\s+default\b/.test(code) ? code : /\b(?:function|class|const|let)\s+App\b/.test(code) ? `${code}\nexport default App;` : code;
  return {
    template: "create-react-app-typescript", entry: "/index.tsx", dependencies,
    files: {
      "/App.tsx": { code: source },
      "/index.tsx": { code: reactEntry(revision) },
      "/public/index.html": { code: `<!doctype html><html lang="${uiLocale()}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head><body><div id="root"></div></body></html>` },
      "/package.json": { code: JSON.stringify({ name: "artifact-preview", main: "/index.tsx", dependencies }) },
    },
  };
}

function reactEntry(revision?: ContentRevision): string {
  if (!revision) return 'import React from "react"; import {createRoot} from "react-dom/client"; import App from "./App"; createRoot(document.getElementById("root")!).render(<App/>);';
  return `import React from "react"; import {createRoot} from "react-dom/client"; import App from "./App";
const revision = ${JSON.stringify(revision)};
const marker = revision.token + ":" + revision.sequence;
const bridgeWindow = window as any;
bridgeWindow.__paseoArtifactCleanup?.();
bridgeWindow.__paseoArtifactRevision = marker;
const send = (kind: string, message = "") => { if (bridgeWindow.__paseoArtifactRevision === marker) parent.postMessage({channel:"paseo-artifact-react", token:revision.token, sequence:revision.sequence, kind, message:String(message).slice(0,4000)}, revision.parentOrigin === "null" ? "*" : revision.parentOrigin); };
const error = (event: ErrorEvent) => send("error", event.message);
const rejection = (event: PromiseRejectionEvent) => send("error", event.reason?.message || event.reason);
addEventListener("error", error); addEventListener("unhandledrejection", rejection);
bridgeWindow.__paseoArtifactCleanup = () => { removeEventListener("error", error); removeEventListener("unhandledrejection", rejection); };
class Boundary extends React.Component<React.PropsWithChildren, {error:boolean}> {
  state = {error:false};
  static getDerivedStateFromError() { return {error:true}; }
  componentDidCatch(error: Error) { send("error", error.message); }
  render() { return this.state.error ? <div role="alert">{${JSON.stringify(ui("A runtime error occurred. See the panel for details.", "실행 오류가 발생했습니다. 패널에서 오류 내용을 확인해 주세요."))}}</div> : this.props.children; }
}
function Root() { React.useEffect(() => { send("ready"); }, []); return <Boundary><App/></Boundary>; }
const element = document.getElementById("root")!;
if (!bridgeWindow.__paseoArtifactRoot) bridgeWindow.__paseoArtifactRoot = createRoot(element);
bridgeWindow.__paseoArtifactRoot.render(<Root key={marker}/>);`;
}
const HTML_BOOTSTRAP = String.raw`(function artifactBootstrap(config) {
  const channel = "paseo-artifact";
  let child = null, sequence = 0;
  const send = (kind, message = "") => parent.postMessage({ channel, token: config.token, sequence, kind, message: String(message).slice(0, 4000) }, config.parentOrigin === "null" ? "*" : config.parentOrigin);
  function contentBridge(revision, watchBlocked) {
    const send = (kind, message = "") => parent.postMessage({channel:"paseo-artifact-content", token:revision.token, sequence:revision.sequence, kind, message:String(message).slice(0,4000)}, "*");
    addEventListener("error", event => {
      const resource = event.target && (event.target.currentSrc || event.target.src || event.target.href);
      if (!revision.allowExternal && typeof resource === "string" && /^https?:/i.test(resource)) return;
      send("error", event.message || (resource ? revision.resourceError + resource : revision.runtimeError));
    }, true);
    addEventListener("unhandledrejection", event => send("error", event.reason?.message || event.reason));
    if (!revision.allowExternal) watchBlocked(() => send("blocked"));
    const applied = () => { send("ContentApplied"); requestAnimationFrame(() => send("ready")); };
    if (document.readyState === "loading") addEventListener("DOMContentLoaded", applied, {once:true}); else applied();
  }
  addEventListener("message", event => {
    const data = event.data;
    if (child && event.source === child.contentWindow && event.origin === "null" && data && data.channel === "paseo-artifact-content" && data.token === config.token && data.sequence === sequence && ["ContentApplied","ready","error","blocked"].includes(data.kind) && typeof data.message === "string") {
      send(data.kind, data.message);
      return;
    }
    if (event.source !== parent || event.origin !== config.parentOrigin || !data || data.channel !== channel || data.token !== config.token || data.kind !== "SetContent" || !Number.isSafeInteger(data.sequence) || data.sequence <= sequence || typeof data.content !== "string" || data.content.length > 512_000) return;
    sequence = data.sequence;
    try {
      const offlineMarkup = ${offlineMarkupScript};
      const source = config.allowExternal ? data.content : offlineMarkup(data.content);
      const parsed = new DOMParser().parseFromString(source, "text/html");
      const policy = parsed.createElement("meta");
      policy.httpEquiv = "Content-Security-Policy";
      policy.content = config.contentPolicy;
      const script = parsed.createElement("script");
      script.textContent = "(" + contentBridge.toString() + ")(" + JSON.stringify({token:config.token,sequence,allowExternal:config.allowExternal,resourceError:config.resourceError,runtimeError:config.runtimeError}).replace(/</g, "\\u003c") + ", " + ${blockedResourceScript} + ");";
      const links = parsed.createElement("script");
      links.textContent = "(" + ${hashLinkScript} + ")();";
      parsed.head.prepend(policy, script, links);
      const next = document.createElement("iframe");
      next.title = config.title;
      next.setAttribute("sandbox", "allow-scripts");
      next.referrerPolicy = "no-referrer";
      next.style.cssText = "width:100%;height:100%;border:0;display:block;background:white";
      next.srcdoc = "<!doctype html>" + parsed.documentElement.outerHTML;
      // A fresh inner realm is essential: document.open on this host would
      // retain global lexical declarations and unresolved promises from old code.
      child = next;
      document.body.replaceChildren(next);
    } catch (cause) {
      send("error", cause instanceof Error ? cause.message : cause);
    }
  });
  if (document.readyState === "loading") addEventListener("DOMContentLoaded", () => send("ReadyForContent"), {once:true}); else send("ReadyForContent");
})`;
export function htmlDocument(code: string, token: string, parentOrigin = "null", allowExternal = false): string {
  if (code.length > MAX_SOURCE_LENGTH) throw new Error(ui("Preview code exceeds 512 KB.", "미리보기 코드가 512KB를 넘습니다."));
  const config = JSON.stringify({ token, sequence: 0, parentOrigin, allowExternal, contentPolicy: htmlPolicy(allowExternal),
    title: ui("Artifact document", "아티팩트 문서"), resourceError: ui("Could not load resource: ", "리소스를 불러오지 못했습니다: "), runtimeError: ui("HTML runtime error", "HTML 실행 오류") }).replace(/</g, "\\u003c");
  return `<!doctype html><html lang="${uiLocale()}"><head><meta charset="utf-8"><meta http-equiv="Content-Security-Policy" content="${htmlPolicy(allowExternal, true)}"><style>html,body{width:100%;height:100%;margin:0;overflow:hidden}</style><script>${HTML_BOOTSTRAP}(${config});</script></head><body></body></html>`;
}

type HtmlMessageKind = "ReadyForContent" | "ContentApplied" | "ready" | "error" | "blocked";

export function readHtmlMessage(event: MessageEvent, frame: HTMLIFrameElement, token: string): { kind: HtmlMessageKind; sequence: number; message: string } | null {
  if (!frame.contentWindow || event.source !== frame.contentWindow || event.origin !== "null") return null;
  const data = event.data;
  if (!data || data.channel !== "paseo-artifact" || data.token !== token ||
      !Number.isSafeInteger(data.sequence) || data.sequence < 0 || typeof data.message !== "string") return null;
  if (!["ReadyForContent", "ContentApplied", "ready", "error", "blocked"].includes(data.kind)) return null;
  return { kind: data.kind, sequence: data.sequence, message: data.message.slice(0, 4000) };
}

export interface ReactRuntime { updateSandbox(setup: SandboxSetup): void; destroy(): void; listen(callback: (message: any) => void): () => void; }
export type RuntimeLoader = (frame: HTMLIFrameElement, setup: SandboxSetup) => Promise<ReactRuntime>;
export const loadReactRuntime: RuntimeLoader = async (frame, setup) => {
  const { SandpackRuntime } = await import("@codesandbox/sandpack-client/clients/runtime");
  return new SandpackRuntime(frame, setup, { showOpenInCodeSandbox: false, showErrorScreen: true, showLoadingScreen: true, skipEval: false });
};
