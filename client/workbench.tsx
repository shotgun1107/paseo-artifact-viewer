import { useCallback, useEffect, useRef, useState, useId, type ReactNode } from "react";
import type { PluginTheme } from "@getpaseo/plugin";
import type { ArtifactVersion, ArtifactRecord } from "./store";
import { Preview } from "./preview";
import { CodeEditor } from "./code-editor";
import { Action, ArtifactIcon, IconButton, Popover, useTransientMessage, workbenchStyles, workbenchVariables } from "./chrome";
import { ArtifactMenu, DeleteDialog, RenameField, WebConsentDialog, stampText, type ArtifactManagement, type MenuCommand } from "./artifact-menu";
import { copyArtifact, exitArtifactFullscreen, exportArtifact, toggleArtifactFullscreen } from "./viewer-actions";
import { ui, uiDate, useUiLocale } from "./ui-locale";

export function downloadSource(code: string, name: string) {
  const blob = new Blob([code], { type: "text/plain;charset=utf-8" }), url = URL.createObjectURL(blob), link = document.createElement("a");
  link.href = url; link.download = name.replace(/[<>:"/\\|?*\x00-\x1f]/g, "_").slice(0, 120);
  document.body.appendChild(link); link.click(); link.remove(); setTimeout(() => URL.revokeObjectURL(url), 1000);
}
/** What a laid-out workbench shows. `following` is false once a specific (older) version is pinned. */
export interface ShownVersion { recordId: string; artifactId?: string; version?: number; following: boolean; }
export interface WorkbenchProps {
  record: ArtifactRecord; onEdit?: (code: string) => void; onSave?: (base: ArtifactVersion, code: string, mutationId: string) => Promise<boolean>;
  onFix?: (version: ArtifactVersion, error: string) => Promise<void>;
  saving?: boolean; conflict?: boolean; theme?: PluginTheme; onClose?: () => void;
  autoPreview?: boolean; artifactSwitcher?: ReactNode; onRefreshHistory?: () => void; saveLabel?: string;
  /** File previews keep the source editor. Conversation artifacts show the result only. */
  showSource?: boolean;
  /** Conversation artifacts: pin, rename, duplicate, web, delete. */
  management?: ArtifactManagement;
  /** "close" removes a plugin-owned view; "list" returns a host tab to its artifact list. */
  closeAs?: "close" | "list";
  /** Open on this stored version (an older card); otherwise follow the latest. */
  initialVersion?: number;
  /** Called after commit whenever a complete version is on screen in a laid-out workbench. */
  onShown?: (shown: ShownVersion) => void;
  /** Right-sidebar host tab only: close that tab itself. Called synchronously inside the click. */
  onCloseTab?: () => void;
  /** Accessible label of the X when `closeAs` is "close" (e.g. "Back to the conversation"). */
  closeLabel?: string;
  /** Hosts that already fill the main area (library screen) hide the fullscreen toggle. */
  hideFullscreen?: boolean;
  /** Library focus sheet: its own header, read-only code view and footer around the same preview and state. */
  chrome?: WorkbenchChrome;
}
/** Everything a custom chrome needs; the workbench keeps owning versions, runtime, consent and dialogs. */
export interface WorkbenchApi {
  ids: string; record: ArtifactRecord; title: string; current?: ArtifactVersion; code: string;
  versions: readonly ArtifactVersion[]; versionNumber: number;
  /** Source of the version on screen, whether picked or followed. */
  selectedSource?: string; following: boolean; changeVersion: (source: string) => void;
  view: "preview" | "source"; setView: (view: "preview" | "source") => void;
  management?: ArtifactManagement; command: (name: MenuCommand) => void;
  renaming: boolean; finishRename: (next: string | null) => void;
}
export interface WorkbenchChrome {
  header: (api: WorkbenchApi) => ReactNode; source: (api: WorkbenchApi) => ReactNode; footer?: (api: WorkbenchApi) => ReactNode;
  /** Short result messages; without it they appear inside the workbench. */
  notify?: (message: string) => void;
}
function versionTime(value: string) {
  const date = new Date(value);
  return Number.isNaN(date.valueOf()) ? "" : uiDate(date, { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" });
}

export function Workbench({ record, onEdit, onSave, onFix, saving = false, conflict = false, theme, onClose, autoPreview = true, artifactSwitcher, onRefreshHistory, saveLabel, showSource = false, management, closeAs = "close", initialVersion, onShown, onCloseTab, closeLabel, hideFullscreen = false, chrome }: WorkbenchProps) {
  useUiLocale();
  const ids = useId(), [view, setView] = useState<"preview" | "source">("preview"), [pinned, setPinned] = useState("latest");
  const [editing, setEditing] = useState<{ base: ArtifactVersion; code: string } | null>(null);
  const [execution, setExecution] = useState({ html: autoPreview, react: false }), [restart, setRestart] = useState(0);
  const [popup, setPopup] = useState<"title" | "versions" | null>(null);
  const [dialog, setDialog] = useState<"delete" | "web" | null>(null), [renaming, setRenaming] = useState(false);
  const [fullscreen, setFullscreen] = useState<"native" | "local" | null>(null);
  const [runtimeError, setRuntimeError] = useState<{ version: ArtifactVersion; error: string } | null>(null);
  const [runtimeState, setRuntimeState] = useState<"loading" | "ready" | "error">("loading");
  // Consent is bound to one exact preview identity: record, version source, stored version and body.
  const [external, setExternal] = useState<{ key: string; code: string } | null>(null);
  const [feedback, setFeedback] = useTransientMessage(), [sending, setSending] = useState(false);
  const root = useRef<HTMLElement>(null);
  const lastComplete = useRef<ArtifactVersion | null>(null), previousIdentity = useRef(record.id);
  const saveRequest = useRef<{ base: string; code: string; id: string } | null>(null);
  useEffect(() => {
    if (previousIdentity.current === record.id) return;
    previousIdentity.current = record.id; lastComplete.current = null;
    setPinned("latest"); setEditing(null); setExecution({ html: autoPreview, react: false }); setRuntimeError(null); setPopup(null); setDialog(null); setRenaming(false); setView("preview"); setExternal(null);
  }, [record.id, autoPreview]);

  // Fullscreen: the standard API when the host allows it, otherwise fill the window in place.
  useEffect(() => {
    const sync = () => setFullscreen(value => document.fullscreenElement && document.fullscreenElement === root.current ? "native" : value === "native" ? null : value);
    document.addEventListener("fullscreenchange", sync);
    return () => { document.removeEventListener("fullscreenchange", sync); if (document.fullscreenElement && document.fullscreenElement === root.current) void exitArtifactFullscreen(); };
  }, []);
  useEffect(() => {
    if (fullscreen !== "local" || popup || dialog || renaming) return;
    const escape = (event: KeyboardEvent) => { if (event.key === "Escape") setFullscreen(null); };
    document.addEventListener("keydown", escape);
    return () => document.removeEventListener("keydown", escape);
  }, [fullscreen, popup, dialog, renaming]);

  const versions = [...record.versions, ...(record.draft ? [record.draft] : [])];
  // An older card opens on its own version. Until that version is loaded nothing runs,
  // so the latest never flashes first; if it never arrives, fall back to the latest.
  const [awaitingInitial, setAwaitingInitial] = useState(() => !!initialVersion);
  const requested = initialVersion ? versions.find(version => version.artifactVersion === initialVersion) : undefined;
  // A requested version that is the server head keeps following the latest (v1 opened, then v2
  // arrives → v2). A requested older version stays pinned, like a manual pick.
  useEffect(() => {
    if (!awaitingInitial || !requested) return;
    setPinned(record.headVersion !== undefined && requested.artifactVersion === record.headVersion ? "latest" : requested.source);
    setAwaitingInitial(false);
  }, [awaitingInitial, requested?.source, record.headVersion]);
  useEffect(() => { if (!awaitingInitial) return; const timer = setTimeout(() => setAwaitingInitial(false), 8000); return () => clearTimeout(timer); }, [awaitingInitial]);
  const selected = awaitingInitial ? requested : pinned === "latest" ? versions.at(-1) : versions.find(version => version.source === pinned) ?? versions.at(-1);
  const current = editing?.base ?? selected, code = editing?.code ?? current?.code ?? "";
  if (current?.complete) lastComplete.current = current;
  const previewVersion = editing && current ? { ...current, code, complete: true } : current?.complete ? current : lastComplete.current?.id === current?.id && lastComplete.current?.kind === current?.kind ? lastComplete.current : null;
  const activeIndex = current ? versions.findIndex(version => version.source === current.source) : -1;
  const versionNumber = current?.artifactVersion ?? Math.max(1, activeIndex + 1);
  const running = !!current && execution[current.kind];
  const currentError = runtimeError && previewVersion && runtimeError.version.id === previewVersion.id && runtimeError.version.code === previewVersion.code ? runtimeError : null;
  const title = record.title || current?.title || ui("Artifact", "아티팩트");
  // External https resources are allowed for exactly one source text; any other source (edit, version, restart of the record) is blocked again.
  const externalKey = previewVersion ? JSON.stringify([record.id, previewVersion.source, previewVersion.artifactVersion ?? null, previewVersion.kind]) : null;
  // Compared during render (before any effect), so a different identity or body is never "allowed"; the effect only clears the stale grant.
  const externalAllowed = !!external && !!previewVersion && external.key === externalKey && external.code === previewVersion.code;
  useEffect(() => { if (external && !externalAllowed) setExternal(null); }, [external, externalAllowed]);
  // Report what is really on screen: a complete, selected version in a laid-out workbench.
  const shown = useRef(onShown); shown.current = onShown;
  useEffect(() => {
    const node = root.current;
    if (!shown.current || awaitingInitial || editing || !current?.complete || !node) return;
    const report: ShownVersion = { recordId: record.id, artifactId: current.artifactId ?? record.artifactId, version: current.artifactVersion, following: pinned === "latest" };
    const check = () => { if (node.isConnected && node.getClientRects().length > 0 && node.offsetWidth > 0 && node.offsetHeight > 0) shown.current?.(report); };
    check();
    if (typeof ResizeObserver === "undefined") return;
    const observer = new ResizeObserver(check); observer.observe(node);
    return () => observer.disconnect();
  }, [awaitingInitial, editing, current?.source, current?.complete, current?.artifactVersion, record.id, record.artifactId, pinned]);
  const say = chrome?.notify ?? setFeedback;
  const act = async (task: () => Promise<unknown>, message: string) => { try { await task(); if (message) say(message); return true; } catch (error) { say(error instanceof Error ? error.message : String(error)); return false; } };
  const changeVersion = (value: string) => { if (editing) return; setPinned(value); setPopup(null); setRuntimeError(null); };
  const cancelEdit = () => { if (!editing) return; onEdit?.(editing.base.code); setEditing(null); setRuntimeError(null); };
  const toggle = (value: NonNullable<typeof popup>) => setPopup(popup === value ? null : value);
  const copy = () => { setPopup(null); void act(() => copyArtifact(code), ui("Code copied.", "코드를 복사했어요.")); };
  const refresh = () => {
    setPopup(null); onRefreshHistory?.();
    if (!current || !previewVersion) return;
    setView("preview"); if (current.kind === "react" && !execution.react) return;
    setExecution(value => ({ ...value, [current.kind]: true })); setRestart(value => value + 1); setRuntimeError(null);
  };
  const toggleFullscreen = async () => {
    setPopup(null);
    if (fullscreen === "local") { setFullscreen(null); return; }
    if (fullscreen === "native") { await exitArtifactFullscreen().catch(() => {}); setFullscreen(null); return; }
    let entered = false;
    try { entered = !!root.current && await toggleArtifactFullscreen(root.current); } catch { entered = false; }
    setFullscreen(entered ? "native" : "local");
  };
  const close = async () => {
    if (fullscreen === "native") await exitArtifactFullscreen().catch(() => {});
    setFullscreen(null); onClose?.();
  };
  const command = (name: MenuCommand) => {
    setPopup(null);
    if (!current) return;
    if (name === "export") void act(async () => { await exportArtifact({ ...current, code }, title); }, chrome ? ui("File saved", "파일을 저장했습니다") : "");
    if (name === "refresh") refresh();
    if (!management) return;
    if (name === "web") { if (current.kind === "react") setDialog("web"); else void act(() => management.openWeb(versionNumber), ""); }
    if (name === "pin") void act(() => management.pin(!management.pinned), management.pinned ? ui("Unpinned.", "고정을 해제했어요.") : ui("Pinned.", "고정했어요."));
    if (name === "rename") setRenaming(true);
    if (name === "duplicate") void act(() => management.duplicate(versionNumber), ui("Duplicate created.", "사본을 만들었어요."));
    if (name === "delete") setDialog("delete");
  };
  const finishRename = (next: string | null) => { setRenaming(false); if (next && next !== title && management) void act(() => management.rename(next), ui("Renamed.", "이름을 바꿨어요.")); };
  const save = async () => {
    if (!editing || !onSave) return;
    const old = saveRequest.current;
    if (!old || old.base !== editing.base.source || old.code !== editing.code) saveRequest.current = { base: editing.base.source, code: editing.code, id: crypto.randomUUID() };
    if (!await onSave(editing.base, editing.code, saveRequest.current!.id)) throw new Error(ui("Could not save. Check the state of the file.", "저장하지 못했습니다. 파일 상태를 확인해 주세요."));
    setEditing(null); saveRequest.current = null;
  };

  const api: WorkbenchApi = { ids, record, title, current, code, versions, versionNumber, selectedSource: current?.source, following: pinned === "latest", changeVersion, view, setView, management, command, renaming, finishRename };
  const tabbed = showSource || !!chrome;
  return <section ref={root} className={`av-workbench${fullscreen === "local" ? " av-maximized" : ""}`} aria-label={ui("Artifact workspace", "아티팩트 작업 공간")} data-artifact-id={record.artifactId} data-artifact-version={current?.artifactVersion} data-fullscreen={fullscreen ?? "off"} data-runtime={running ? runtimeState : "paused"} style={workbenchVariables(theme)}>
    <style>{workbenchStyles}</style>
    {!current ? <>{chrome?.header(api)}<div className="av-empty" role="status">{ui("Waiting for the result…", "결과물을 기다리는 중…")}</div></> : <>
      {chrome ? chrome.header(api) : <header className="av-toolbar" role="toolbar" aria-label={ui("Artifact tools", "아티팩트 도구")}>
        <div className="av-toolbar-lead">
          {artifactSwitcher}
          {showSource && <div className="av-tabs" role="tablist" aria-label={ui("Artifact view", "아티팩트 보기")}>
            {(["preview", "source"] as const).map(tab => <button key={tab} className="av-tab" role="tab" aria-label={tab === "preview" ? ui("Preview", "미리보기") : ui("Code", "코드")} title={tab === "preview" ? ui("Preview", "미리보기") : ui("Code", "코드")} id={`${ids}-${tab}-tab`} aria-selected={view === tab} aria-controls={`${ids}-${tab}-panel`} tabIndex={view === tab ? 0 : -1} onKeyDown={event => { if (event.key === "ArrowRight" || event.key === "ArrowLeft") { event.preventDefault(); const next = tab === "preview" ? "source" : "preview"; setView(next); document.getElementById(`${ids}-${next}-tab`)?.focus(); } }} onClick={() => setView(tab)}><ArtifactIcon name={tab === "preview" ? "preview" : "code"} /></button>)}
          </div>}
          {renaming && management ? <RenameField value={title} onDone={finishRename} />
            : <div className="av-title-anchor">
              <button type="button" className="av-title-trigger" aria-label={ui(`${title} menu`, `${title} 메뉴`)} title={title} aria-haspopup="menu" aria-expanded={popup === "title"} onClick={() => toggle("title")}>
                <span className="av-title-text">{title}</span>
                {management?.pinned && <span className="av-title-flag" aria-label={ui("Pinned", "고정됨")}><ArtifactIcon name="pin" size={13} /></span>}
                <span className="av-title-caret"><ArtifactIcon name="down" size={14} /></span>
              </button>
              <Popover open={popup === "title"} onClose={() => setPopup(null)} label={ui("Current artifact", "현재 아티팩트")} className="av-title-menu">
                <ArtifactMenu stamp={stampText(current.timestamp, versions.length)} management={management} canRefresh={!!previewVersion || !!onRefreshHistory} onCommand={command} />
              </Popover>
            </div>}
          {versions.length > 1 && <div className="av-version-anchor"><button className="av-version-trigger" aria-label={ui("Artifact version", "아티팩트 버전")} aria-haspopup="dialog" aria-expanded={popup === "versions"} disabled={!!editing} onClick={() => toggle("versions")}><span>v{versionNumber}</span>{pinned === "latest" && <span className="av-version-latest">· {ui("latest", "최신")}</span>}<ArtifactIcon name="down" size={12} /></button>
            <Popover open={popup === "versions"} onClose={() => setPopup(null)} label={ui("Artifact version history", "아티팩트 버전 기록")} className="av-history"><div role="menu" aria-label={ui("Choose a version", "버전 선택")}>
              {[...versions].reverse().map((version, reverseIndex) => <button key={version.source} className="av-version-item" role="menuitemradio" aria-label={ui(`Version ${version.artifactVersion ?? versions.length - reverseIndex}`, `버전 ${version.artifactVersion ?? versions.length - reverseIndex}`)} aria-checked={pinned === version.source || pinned === "latest" && reverseIndex === 0} onClick={() => changeVersion(version.source)}><span className="av-version-check">{(pinned === version.source || pinned === "latest" && reverseIndex === 0) && <ArtifactIcon name="check" size={14} />}</span><span className="av-version-copy"><strong>{ui("Version", "버전")} {version.artifactVersion ?? versions.length - reverseIndex}{reverseIndex === 0 ? ` · ${ui("latest", "최신")}` : ""}{!version.complete ? ` · ${ui("writing", "작성 중")}` : ""}</strong><small>{versionTime(version.timestamp) || version.title}</small></span></button>)}
              <div className="av-menu-divider" /><button className="av-version-item" role="menuitemradio" aria-checked={pinned === "latest"} onClick={() => changeVersion("latest")}><span className="av-version-check">{pinned === "latest" && <ArtifactIcon name="check" size={14} />}</span><span>{ui("Follow the latest version", "최신 버전 따라가기")}</span></button>
            </div></Popover>
          </div>}
        </div>
        <div className="av-header-actions">
          <IconButton className="av-head-button" icon="copy" label={ui("Copy code", "코드 복사")} onClick={copy} />
          {!hideFullscreen && <IconButton className="av-head-button" icon={fullscreen ? "collapse" : "expand"} label={fullscreen ? ui("Exit full screen", "전체 화면 종료") : ui("Full screen", "전체 화면")} aria-pressed={!!fullscreen} onClick={() => void toggleFullscreen()} />}
          {onClose && <IconButton className="av-head-button" icon={closeAs === "list" ? "list" : "close"} label={closeAs === "list" ? ui("Back to artifact list", "아티팩트 목록으로") : closeLabel ?? ui("Close artifact", "아티팩트 닫기")} onClick={() => void close()} />}
          {onCloseTab && <IconButton className="av-head-button" data-action="close-tab" icon="close" label={ui("Close artifact tab", "아티팩트 탭 닫기")} onClick={onCloseTab} />}
        </div>
      </header>}
      {(editing || conflict) && <div className={`av-notice ${conflict ? "av-conflict" : ""}`} role="status">{conflict && <ArtifactIcon name="warning" size={14} />}<span className="av-notice-text">{conflict ? ui("There is an external change. Your edits were kept.", "외부 변경이 있습니다. 편집 내용은 보존했어요.") : onSave ? ui("Unsaved changes", "저장하지 않은 변경") : ui("Edits are kept in this panel.", "편집 내용은 이 패널에 보관됩니다.")}</span>{editing && <Action onClick={cancelEdit}>{ui("Cancel edit", "편집 취소")}</Action>}{onSave && <Action primary disabled={saving || conflict || !editing} onClick={() => void act(save, ui("Saved.", "저장했습니다."))}>{saving ? ui("Saving…", "저장 중…") : saveLabel ?? ui("Save file", "파일 저장")}</Action>}</div>}
      <div className="av-body">
        <div id={`${ids}-preview-panel`} role={tabbed ? "tabpanel" : undefined} aria-labelledby={tabbed ? `${ids}-preview-tab` : undefined} className="av-preview" style={{ display: view === "preview" ? "flex" : "none", flexDirection: "column" }}>
          {!previewVersion ? <div className="av-consent"><div className="av-consent-card"><h3>{ui("Creating the artifact", "아티팩트를 만들고 있어요")}</h3><p>{ui("The result appears here once the code is complete.", "코드가 완성되면 결과물이 여기에 나타납니다.")}</p></div></div> : !running ? <div className="av-consent"><div className="av-consent-card"><h3>{current.kind === "react" ? ui("React preview", "React 미리보기") : ui("The preview is paused", "미리보기가 일시 정지됐어요")}</h3><p>{current.kind === "react" ? ui("Starting the preview sends the code to the external CodeSandbox bundler. An internet connection is needed to load packages.", "미리보기를 시작하면 코드가 외부 CodeSandbox 번들러로 전송됩니다. 패키지를 불러오려면 인터넷이 필요합니다.") : ui("Check the result again in the isolated frame.", "분리된 실행 화면에서 결과물을 다시 확인하세요.")}</p><Action primary icon="play" onClick={() => { setExecution(value => ({ ...value, [current.kind]: true })); setRuntimeError(null); }}>{ui("Start preview", "미리보기 시작")}</Action></div></div> : <Preview kind={previewVersion.kind} code={previewVersion.code} running restart={restart} externalAllowed={externalAllowed} onExternalChange={allow => setExternal(allow && externalKey ? { key: externalKey, code: previewVersion.code } : null)} onError={() => { /* onStatus carries the exact runtime body. */ }} onStatus={status => { if (status.source !== previewVersion.code) return; setRuntimeState(status.state); setRuntimeError(status.state === "error" ? { version: previewVersion, error: status.message ?? ui("Runtime error", "실행 오류") } : null); }} />}
        </div>
        {chrome && view === "source" && <div id={`${ids}-source-panel`} className="av-source" role="tabpanel" aria-labelledby={`${ids}-source-tab`}>{chrome.source(api)}</div>}
        {!chrome && showSource && view === "source" && <div id={`${ids}-source-panel`} className="av-source" role="tabpanel" aria-labelledby={`${ids}-source-tab`}><CodeEditor value={code} kind={current.kind} theme={theme} onChange={value => { setEditing(old => ({ base: old?.base ?? current, code: value })); onEdit?.(value); }} /></div>}
        {feedback && <div className="av-feedback" role="status">{feedback}</div>}
        {view === "preview" && currentError && <div className="av-error" role="alert"><div className="av-error-heading"><ArtifactIcon name="warning" size={15} />{ui("The preview has an error", "미리보기에 오류가 있어요")}<span style={{ flex: 1 }} /><IconButton icon="close" label={ui("Dismiss error", "오류 닫기")} onClick={() => setRuntimeError(null)} /></div><pre>{currentError.error}</pre>{onFix && <Action icon="send" disabled={sending} onClick={() => { setSending(true); void act(() => onFix(currentError.version, currentError.error), ui("Sent a fix request to the conversation.", "현재 대화에 수정 요청을 보냈습니다.")).finally(() => setSending(false)); }}>{sending ? ui("Requesting…", "요청 중…") : ui("Fix this error in the conversation", "이 오류를 대화에서 수정")}</Action>}</div>}
      </div>
      {chrome?.footer?.(api)}
      {dialog === "web" && management && <WebConsentDialog onCancel={() => setDialog(null)} onConfirm={() => { setDialog(null); void act(() => management.openWeb(versionNumber), ""); }} />}
      {dialog === "delete" && management && <DeleteDialog title={title} onCancel={() => setDialog(null)} onConfirm={async () => { await management.remove(); setDialog(null); }} />}
    </>}
  </section>;
}
