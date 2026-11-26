import { useEffect, useRef, useState } from "react";
import type { ArtifactKind } from "../shared/artifacts";
import { createPreviewSession, referencesExternalResources, type PreviewStatus } from "./preview-session";
import { ui, useUiLocale } from "./ui-locale";

/**
 * `externalAllowed`: the owner (workbench) has allowed external https resources for exactly this `code`.
 * The permission is a property of the source, not of the frame: the owner derives it from `code` on every render,
 * so a changed source is already "not allowed" in the very render that carries it. A frame that was created with
 * the permission is never fed a different source; it is torn down and rebuilt blocked instead.
 */
export function Preview({ kind, code, running, restart, onError, onStatus, externalAllowed = false, onExternalChange }: { kind: ArtifactKind; code: string; running: boolean; restart: number; onError: (error: string | null) => void; onStatus?: (status: PreviewStatus) => void; externalAllowed?: boolean; onExternalChange?: (allow: boolean) => void }) {
  useUiLocale();
  const frame = useRef<HTMLIFrameElement>(null), session = useRef<ReturnType<typeof createPreviewSession> | null>(null);
  const latest = useRef(code), callback = useRef(onError), lastSent = useRef<string | null>(null);
  latest.current = code; callback.current = onError;
  const report = useRef(onStatus); report.current = onStatus;
  const [status, setStatus] = useState<PreviewStatus>({ state: "loading" }), [blocked, setBlocked] = useState(false);
  const external = kind === "html" && externalAllowed, mentions = kind === "html" && referencesExternalResources(code);
  useEffect(() => {
    if (!running || !frame.current) return;
    const current = createPreviewSession(frame.current, kind, latest.current, next => { setStatus(next); if (next.state === "loading") setBlocked(false); callback.current(next.state === "error" ? next.message ?? ui("Runtime error", "실행 오류") : null); report.current?.(next); }, undefined, { allowExternal: external, onExternalBlocked: () => setBlocked(true) });
    session.current = current; lastSent.current = latest.current;
    return () => { session.current = null; current.dispose(); };
  }, [kind, running, restart, external]);
  useEffect(() => {
    // An allowed frame only ever shows the source it was allowed for; any other source gets a fresh blocked frame.
    if (!running || external || code === lastSent.current) return;
    const timer = setTimeout(() => { session.current?.update(code); lastSent.current = code; }, 300);
    return () => clearTimeout(timer);
  }, [code, running, external]);
  if (!running) return <div style={{ padding: 28, lineHeight: 1.7, textAlign: "center", color: "var(--av-muted,#777)" }}>
    <p>{ui("The preview is paused.", "미리보기가 일시 중지되었습니다.")}</p>
  </div>;
  const barStyle = { display: "flex", alignItems: "center", gap: 10, flex: "none", padding: "6px 10px", fontSize: 12, borderBottom: "1px solid var(--av-border,#ddd)", background: "var(--av-raised,#f5f5f5)", color: "var(--av-muted,#777)" } as const;
  const buttonStyle = { flex: "none", height: 26, padding: "0 10px", border: "1px solid var(--av-border,#ddd)", borderRadius: 7, background: "transparent", color: "inherit", font: "inherit", fontWeight: 600, cursor: "pointer" } as const;
  return <div style={{ position: "relative", height: "100%", minHeight: 160, display: "flex", flexDirection: "column" }}>
    {kind === "html" && (mentions || blocked) && !external && onExternalChange && <div style={barStyle} role="status" data-testid="artifact-external-notice" data-external="blocked">
      <span style={{ flex: 1, minWidth: 0 }}>{mentions ? ui("This artifact refers to external https resources. Only its static text and basic shapes are shown; allow external resources to run the full document.", "이 아티팩트는 외부 https 리소스를 참조해요. 정적 텍스트와 기본 도형만 보여 주고 있어요. 전체 문서를 실행하려면 외부 리소스를 허용하세요.") : ui("This artifact tried to load external https resources, and they were blocked. Allow external resources to load them.", "이 아티팩트가 외부 https 리소스를 불러오려 했고 차단됐어요. 불러오려면 외부 리소스를 허용하세요.")}</span>
      <button type="button" style={buttonStyle} data-testid="artifact-external-allow" aria-label={ui("Allow external resources", "외부 리소스 허용")} onClick={() => onExternalChange(true)}>{ui("Allow external resources", "외부 리소스 허용")}</button>
    </div>}
    {external && onExternalChange && <div style={barStyle} role="status" data-testid="artifact-external-notice" data-external="allowed">
      <span style={{ flex: 1, minWidth: 0 }}>{ui("External https resources are allowed for this version only.", "이 버전에 한해 외부 https 리소스를 허용했어요.")}</span>
      <button type="button" style={buttonStyle} data-testid="artifact-external-block" aria-label={ui("Block external resources", "외부 리소스 차단")} onClick={() => onExternalChange(false)}>{ui("Block external resources", "외부 리소스 차단")}</button>
    </div>}
    <div style={{ position: "relative", flex: 1, minHeight: 160 }}>
      <iframe ref={frame} title={ui("Artifact preview frame", "아티팩트 실행 화면")} sandbox={kind === "html" ? "allow-scripts" : "allow-scripts allow-same-origin"} referrerPolicy="no-referrer" style={{ display: "block", border: 0, width: "100%", height: "100%", minHeight: 160, background: "white" }} />
      {status.state === "loading" && <div role="status" style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 12, background: "var(--av-surface,#fff)", color: "var(--av-muted,#777)", fontSize: 13 }}><span style={{ width: 22, height: 22, border: "2px solid currentColor", borderRightColor: "transparent", borderRadius: "50%", animation: "av-spin .9s linear infinite" }} /><span>{ui("Preparing preview…", "미리보기 준비 중…")}</span></div>}
    </div>
  </div>;
}
