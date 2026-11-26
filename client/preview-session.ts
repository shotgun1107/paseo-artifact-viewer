import type { ArtifactKind } from "../shared/artifacts";
import { buildReactSetup, htmlDocument, loadReactRuntime, readHtmlMessage, type ContentRevision, type ReactRuntime, type RuntimeLoader } from "./sandbox";
import { ui } from "./ui-locale";

/** https:// anywhere in the source, or a protocol-relative src/href. Decides whether the external-resource notice is shown. */
export const referencesExternalResources = (code: string) => /https:\/\/|(?:src|href)\s*=\s*["']\/\//i.test(code);
export interface PreviewOptions {
  /** HTML only: let the frame load external https resources. Fixed for the life of the session. */ allowExternal?: boolean;
  /** HTML only: the policy refused an external https resource that consent could allow (for example a URL built at run time). */ onExternalBlocked?: (sequence: number) => void;
}

export type PreviewStatus = { state: "loading" | "ready" | "error"; message?: string; sequence?: number; source?: string };

/** One explicit run owns one frame/bridge; body updates do not replace the host. */
export function createPreviewSession(frame: HTMLIFrameElement, kind: ArtifactKind, initial: string, report: (status: PreviewStatus) => void, loader: RuntimeLoader = loadReactRuntime, options: PreviewOptions = {}) {
  const allowExternal = kind === "html" && options.allowExternal === true;
  const host = frame.ownerDocument.defaultView!;
  const token = host.crypto.randomUUID(), parentOrigin = host.location.origin;
  let disposed = false, code = initial, runtime: ReactRuntime | undefined, unlisten: (() => void) | undefined;
  let timeout: ReturnType<typeof setTimeout> | undefined;
  let sequence = 1, posted = 0, applied = 0, failed = false, frameReady = false, reactCompiling = false;
  const revision = (): ContentRevision => ({ token, sequence, parentOrigin });
  const status = (value: PreviewStatus, expected = sequence) => {
    if (disposed || expected !== sequence || (value.state === "ready" && failed)) return;
    if (value.state === "error") failed = true;
    if (value.state !== "loading") clearTimeout(timeout);
    report({ ...value, sequence, source: code });
  };
  const fail = (error: unknown, expected = sequence) => status({ state: "error", message: String(error instanceof Error ? error.message : error).slice(0, 4000) }, expected);
  const loading = () => {
    failed = false;
    clearTimeout(timeout);
    status({ state: "loading" });
    const expected = sequence;
    timeout = setTimeout(() => fail(ui("The preview did not respond. Check your network or run it again.", "실행 화면이 응답하지 않습니다. 네트워크를 확인하거나 다시 실행해 주세요."), expected), 30_000);
  };
  const postHtml = () => {
    if (disposed || !frameReady || posted === sequence || failed) return;
    try {
      if (code.length > 512_000) throw new Error(ui("The preview code is over 512KB.", "미리보기 코드가 512KB를 넘습니다."));
      frame.contentWindow!.postMessage({ channel: "paseo-artifact", token, kind: "SetContent", sequence, content: code }, "*");
      posted = sequence;
    } catch (error) { fail(error); }
  };
  const message = (event: MessageEvent) => {
    if (disposed) return;
    if (kind === "html") {
      const data = readHtmlMessage(event, frame, token);
      if (!data) return;
      if (data.kind === "ReadyForContent") {
        if (data.sequence !== posted) return;
        frameReady = true;
        postHtml();
        return;
      }
      if (data.sequence !== sequence || data.sequence !== posted) return;
      if (data.kind === "blocked") { if (!allowExternal) options.onExternalBlocked?.(data.sequence); return; }
      if (data.kind === "ContentApplied") applied = data.sequence;
      else if (data.kind === "ready" && applied === data.sequence) status({ state: "ready" });
      else if (data.kind === "error") status({ state: "error", message: data.message });
      return;
    }
    // Sandpack compile messages lack source revisions; commit/runtime errors use
    // our own source-tagged bridge instead of interpreting `done` as a render.
    const data = event.data;
    if (event.source !== frame.contentWindow || !data || data.channel !== "paseo-artifact-react" || data.token !== token || data.sequence !== sequence || posted !== sequence || typeof data.message !== "string") return;
    let origin: string;
    try { origin = new URL(frame.src).origin; } catch { return; }
    if (!origin.startsWith("https://") || event.origin !== origin) return;
    if (data.kind === "ready") status({ state: "ready" });
    else if (data.kind === "error") status({ state: "error", message: data.message.slice(0, 4000) });
  };
  const postReact = () => {
    if (!runtime || disposed) return;
    const setup = buildReactSetup(code, revision());
    posted = sequence;
    reactCompiling = false;
    runtime.updateSandbox(setup);
  };
  function update(next: string) {
    // A session that allowed external resources belongs to exactly the source it was created for.
    if (disposed || next === code || allowExternal) return;
    code = next;
    sequence++;
    loading();
    try {
      if (kind === "html") postHtml();
      else { buildReactSetup(code, revision()); postReact(); }
    } catch (error) { fail(error); }
  }
  host.addEventListener("message", message);
  loading();
  if (kind === "html") {
    try { frame.srcdoc = htmlDocument("", token, parentOrigin, allowExternal); }
    catch (error) { fail(error); }
  } else {
    try {
      const initialSetup = buildReactSetup(initial, revision());
      void loader(frame, initialSetup).then(client => {
        if (disposed) { client.destroy(); return; }
        runtime = client;
        unlisten = client.listen((data: unknown) => {
          if (disposed || posted !== sequence || !data || typeof data !== "object") return;
          const m = data as { type?: string; action?: string; message?: string; title?: string; compilatonError?: boolean; error?: { message?: string }; errors?: { message?: string }[] };
          if (m.type === "start") { reactCompiling = true; return; }
          if (!reactCompiling) return;
          if ((m.type === "action" && m.action === "show-error") || m.type === "compile-error" || m.type === "error") {
            fail(m.message ?? m.error?.message ?? m.errors?.[0]?.message ?? m.title ?? ui("React compile error", "React 컴파일 오류"));
          } else if (m.type === "done" && m.compilatonError) fail(ui("A React compile error occurred.", "React 컴파일 오류가 발생했습니다."));
        });
        try { postReact(); } catch (error) { fail(error); }
      }).catch(error => fail(error));
    } catch (error) { fail(error); }
  }
  return {
    update,
    dispose() {
      if (disposed) return;
      disposed = true;
      clearTimeout(timeout);
      host.removeEventListener("message", message);
      unlisten?.();
      runtime?.destroy();
      frame.removeAttribute("srcdoc");
      frame.src = "about:blank";
    },
  };
}
