import { useCallback, useEffect, useLayoutEffect, useRef, useState, type ReactNode, type RefObject } from "react";
import type { LibraryItem } from "../shared/library";
import type { ArtifactVersion } from "./store";
import type { WorkbenchApi, WorkbenchChrome } from "./workbench";
import { RenameField } from "./artifact-menu";
import { copyArtifact } from "./viewer-actions";
import { Dot, Dots, Svg, formatLabel, fullDate, icons, sessionLabel, updatedText } from "./library-gallery";
import { ui, uiLocale, useUiLocale } from "./ui-locale";

/* ───────────────────────────── dismissal ───────────────────────────── */

/**
 * Outside press and Escape, in the order things opened: an Escape taken here never also closes the sheet.
 * The press itself is not swallowed, so a card under an open menu still opens with that same click. A press
 * inside the preview frame never reaches this document; the window losing focus to it stands in.
 */
function useDismiss(inside: () => (Element | null | undefined)[], close: (reason: "outside" | "escape") => void) {
  const latest = useRef({ inside, close }); latest.current = { inside, close };
  useEffect(() => {
    const outside = (event: PointerEvent) => { if (!(event.target instanceof Node) || !latest.current.inside().some(node => node?.contains(event.target as Node))) latest.current.close("outside"); };
    const escape = (event: KeyboardEvent) => { if (event.key !== "Escape" || event.isComposing) return; event.preventDefault(); event.stopPropagation(); latest.current.close("escape"); };
    const blur = () => { if (document.activeElement instanceof HTMLIFrameElement) latest.current.close("outside"); };
    document.addEventListener("pointerdown", outside, true); document.addEventListener("keydown", escape, true); window.addEventListener("blur", blur);
    return () => { document.removeEventListener("pointerdown", outside, true); document.removeEventListener("keydown", escape, true); window.removeEventListener("blur", blur); };
  }, []);
}

/* ───────────────────────────── ⋯ menu ───────────────────────────── */

export type MenuEntry = { id: string; label: string; hint?: string; danger?: boolean; disabled?: boolean; run: () => void } | "divider";
export type OpenMenu = { key: string; artifactId: string; anchor: HTMLElement; entries: MenuEntry[] };

/** Card, row and sheet actions, anchored to their ⋯ button inside the screen (the host owns the rest of the window). */
export function ActionMenu({ menu, rootRef, onClose }: { menu: OpenMenu; rootRef: RefObject<HTMLElement | null>; onClose: () => void }) {
  useUiLocale();
  const ref = useRef<HTMLDivElement>(null), [place, setPlace] = useState<{ left: number; top: number } | null>(null);
  useLayoutEffect(() => {
    const root = rootRef.current, node = ref.current;
    if (!root || !node) return;
    const bounds = root.getBoundingClientRect(), rect = menu.anchor.getBoundingClientRect(), width = node.offsetWidth, height = node.offsetHeight;
    const left = Math.min(bounds.width - width - 12, Math.max(12, rect.right - bounds.left - width));
    const below = rect.bottom - bounds.top + 6, above = rect.top - bounds.top - 6 - height;
    setPlace({ left, top: below + height <= bounds.height - 8 || above < 8 ? Math.max(8, Math.min(bounds.height - height - 8, below)) : above });
  }, [menu]);
  useEffect(() => { if (place) ref.current?.querySelector<HTMLElement>("button:not(:disabled)")?.focus({ preventScroll: true }); }, [!!place]);
  useDismiss(() => [ref.current, menu.anchor], reason => { onClose(); if (reason === "escape") menu.anchor.focus({ preventScroll: true }); });
  // The anchor moves with the gallery: scrolling it away or resizing closes the menu instead of leaving it adrift.
  // A last scroll event that was already on its way when the button was pressed does not.
  useEffect(() => {
    const root = rootRef.current, start = menu.anchor.getBoundingClientRect();
    const moved = () => { const now = menu.anchor.getBoundingClientRect(); if (Math.abs(now.top - start.top) > 8 || Math.abs(now.left - start.left) > 8) onClose(); };
    root?.addEventListener("scroll", moved, true); window.addEventListener("resize", onClose);
    return () => { root?.removeEventListener("scroll", moved, true); window.removeEventListener("resize", onClose); };
  }, [menu, onClose]);
  return <div ref={ref} className="avl-menu" role="menu" aria-label={ui("Actions menu", "작업 메뉴")} style={place ? { left: place.left, top: place.top } : { left: 0, top: 0, visibility: "hidden" }} onKeyDown={event => {
    if (event.key === "Tab") { event.preventDefault(); onClose(); menu.anchor.focus({ preventScroll: true }); return; }
    if (!["ArrowDown", "ArrowUp", "Home", "End"].includes(event.key)) return;
    const buttons = Array.from(event.currentTarget.querySelectorAll<HTMLButtonElement>("button:not(:disabled)")), index = buttons.indexOf(document.activeElement as HTMLButtonElement);
    if (!buttons.length) return;
    event.preventDefault();
    buttons[event.key === "Home" ? 0 : event.key === "End" ? buttons.length - 1 : (index + (event.key === "ArrowDown" ? 1 : -1) + buttons.length) % buttons.length].focus();
  }}>
    {menu.entries.map((entry, index) => entry === "divider" ? <div key={index} className="avl-menu-divider" role="separator" />
      : <button key={entry.id} type="button" role="menuitem" data-command={entry.id} className={entry.danger ? "avl-menu-danger" : undefined} disabled={entry.disabled} onClick={() => {
        onClose();
        // Back on the button first, so an action that opens a dialog or field takes focus from there.
        menu.anchor.focus({ preventScroll: true });
        entry.run();
      }}><span>{entry.label}</span>{entry.hint && <span className="avl-menu-hint" aria-hidden="true">{entry.hint}</span>}</button>)}
  </div>;
}

/* ───────────────────────────── toast ───────────────────────────── */

export type Toast = { id: number; text: string; undo?: () => void };
export function useToast() {
  const [toast, setToast] = useState<Toast | null>(null), id = useRef(0);
  const show = useCallback((text: string, undo?: () => void) => setToast({ id: ++id.current, text, undo }), []);
  const clear = useCallback((which: number) => setToast(old => old?.id === which ? null : old), []);
  return { toast, show, clear };
}
export function Toasts({ toast, onClear }: { toast: Toast | null; onClear: (id: number) => void }) {
  useUiLocale();
  const [leaving, setLeaving] = useState<number | null>(null), held = useRef(false);
  useEffect(() => {
    if (!toast) return;
    held.current = false;
    let timer: ReturnType<typeof setTimeout>;
    const leave = () => {
      if (held.current) { timer = setTimeout(leave, 600); return; }
      setLeaving(toast.id); timer = setTimeout(() => onClear(toast.id), 200);
    };
    // An undo stays longer than a plain message, and never leaves from under the pointer.
    timer = setTimeout(leave, toast.undo ? 4500 : 2200);
    return () => clearTimeout(timer);
  }, [toast, onClear]);
  return <div className="avl-toasts" role="status" aria-live="polite">
    {toast && <div key={toast.id} className="avl-toast" data-leaving={leaving === toast.id ? "true" : undefined} onPointerEnter={() => { held.current = true; }} onPointerLeave={() => { held.current = false; }}>
      <span>{toast.text}</span>
      {toast.undo && <button type="button" aria-label={ui("Undo delete", "삭제 되돌리기")} onClick={() => { toast.undo?.(); onClear(toast.id); }}>{ui("Undo", "실행 취소")}</button>}
    </div>}
  </div>;
}

/* ───────────────────────────── sheet shell ───────────────────────────── */

/** Full-surface detail over the still-mounted (inert) gallery; mounted only while open. */
export function FocusSheet({ label, children }: { label: string; children: ReactNode }) {
  const ref = useRef<HTMLElement>(null);
  useLayoutEffect(() => { ref.current?.focus({ preventScroll: true }); }, []);
  return <aside ref={ref} className="avl-sheet" role="dialog" aria-label={label} tabIndex={-1}>{children}</aside>;
}

/* ───────────────────────────── sheet chrome ───────────────────────────── */

const versionOf = (version: ArtifactVersion, index: number) => version.artifactVersion ?? index + 1;
const lines = (code: string) => code.split("\n").length;
/** What is stored about a version: no note is invented for it. */
function versionNote(version: ArtifactVersion, title: string) {
  const format = formatLabel(version.format ?? (version.kind === "react" ? "react" : "html"));
  return [version.title !== title ? version.title : "", format, ui(`${lines(version.code).toLocaleString("en-US")} lines`, `${lines(version.code).toLocaleString("ko-KR")}줄`), version.complete ? "" : ui("Drafting", "작성 중")].filter(Boolean).join(" · ");
}

function Versions({ api, anchor, canRestore, onRestore, onClose }: { api: WorkbenchApi; anchor: RefObject<HTMLButtonElement | null>; canRestore: boolean; onRestore: (version: ArtifactVersion, number: number) => void; onClose: () => void }) {
  useUiLocale();
  const ref = useRef<HTMLDivElement>(null), [left, setLeft] = useState<number | null>(null);
  useLayoutEffect(() => {
    const node = ref.current, scope = node?.offsetParent as HTMLElement | null;
    if (!node || !scope || !anchor.current) return;
    setLeft(Math.max(12, Math.min(scope.clientWidth - node.offsetWidth - 12, anchor.current.getBoundingClientRect().left - scope.getBoundingClientRect().left)));
    node.querySelector<HTMLElement>('[aria-checked="true"]')?.focus({ preventScroll: true });
  }, []);
  useDismiss(() => [ref.current, anchor.current], reason => { onClose(); if (reason === "escape") anchor.current?.focus({ preventScroll: true }); });
  const list = api.versions.map((version, index) => ({ version, number: versionOf(version, index) })).reverse(), now = Date.now();
  return <div ref={ref} className="avl-versions" role="menu" aria-label={ui("Version history", "버전 기록")} style={left === null ? { visibility: "hidden" } : { left }} onKeyDown={event => {
    if (event.key !== "ArrowDown" && event.key !== "ArrowUp") return;
    const buttons = Array.from(event.currentTarget.querySelectorAll<HTMLButtonElement>("button")), index = buttons.indexOf(document.activeElement as HTMLButtonElement);
    event.preventDefault(); buttons[(index + (event.key === "ArrowDown" ? 1 : -1) + buttons.length) % buttons.length]?.focus();
  }}>
    {list.map(({ version, number }, index) => {
      const current = version.source === api.selectedSource, latest = index === 0;
      return <div key={version.source} className="avl-version" data-current={current ? "true" : undefined}>
        <button type="button" role="menuitemradio" aria-checked={current} aria-label={ui(`Version ${number}`, `버전 ${number}`)} className="avl-version-pick" onClick={() => { api.changeVersion(latest ? "latest" : version.source); onClose(); anchor.current?.focus({ preventScroll: true }); }}>
          <span className="avl-version-line"><span className="avl-version-name">v{number}</span>{latest && <span className="avl-version-latest">{ui("Latest", "최신")}</span>}
            <time className="avl-version-time" dateTime={version.timestamp} title={fullDate(version.timestamp)}>{updatedText(version.timestamp, now)}</time></span>
          <span className="avl-version-note">{versionNote(version, api.title)}</span>
        </button>
        {!latest && canRestore && version.complete && version.artifactVersion !== undefined && <button type="button" className="avl-version-restore" aria-label={ui(`Restore version ${number}`, `버전 ${number}으로 복원`)} onClick={() => { onClose(); anchor.current?.focus({ preventScroll: true }); onRestore(version, number); }}>{ui("Restore this version", "이 버전으로 복원")}</button>}
      </div>;
    })}
  </div>;
}

export type SheetActions = {
  onClose: () => void; onMenu: (anchor: HTMLElement, api: WorkbenchApi | null) => void; onSession?: () => void;
  onRestore: (version: ArtifactVersion, number: number, api: WorkbenchApi) => void; canRestore: boolean; notify: (message: string) => void;
};

function SheetHeader({ title, headVersion, api, actions }: { title: string; headVersion: number; api: WorkbenchApi | null; actions: SheetActions }) {
  useUiLocale();
  const [open, setOpen] = useState(false), anchor = useRef<HTMLButtonElement>(null);
  const close = useCallback(() => setOpen(false), []);
  const tabs = [["preview", ui("Preview", "미리보기")], ["source", ui("Code", "코드")]] as const;
  return <header className="avl-sheet-head" role="toolbar" aria-label={ui("Artifact tools", "아티팩트 도구")}>
    <div className="avl-sheet-lead">
      {api?.renaming ? <RenameField value={title} onDone={api.finishRename} /> : <h2 className="avl-sheet-title" title={title}>{title}</h2>}
      <button ref={anchor} type="button" className="avl-version-button" aria-label={ui("Artifact version", "아티팩트 버전")} aria-haspopup="menu" aria-expanded={open} disabled={!api} onClick={() => {
        if (!api) return;
        if (api.versions.length <= 1) { actions.notify(ui("This artifact has a single version", "단일 버전 아티팩트입니다")); return; }
        setOpen(value => !value);
      }}><span>v{api?.versionNumber ?? headVersion}</span>{(api ? api.versions.length > 1 : headVersion > 1) && <Svg size={12} width={2}>{icons.down}</Svg>}</button>
    </div>
    <div className="avl-sheet-tools">
      <div className="avl-tabs" role="tablist" aria-label={ui("Artifact view", "아티팩트 보기")}>
        {tabs.map(([tab, label]) => <button key={tab} type="button" role="tab" id={api ? `${api.ids}-${tab}-tab` : undefined} aria-controls={api ? `${api.ids}-${tab}-panel` : undefined}
          aria-selected={(api?.view ?? "preview") === tab} tabIndex={(api?.view ?? "preview") === tab ? 0 : -1} disabled={!api} onClick={() => api?.setView(tab)}
          onKeyDown={event => { if (!api || event.key !== "ArrowRight" && event.key !== "ArrowLeft") return; event.preventDefault(); const next = tab === "preview" ? "source" : "preview"; api.setView(next); document.getElementById(`${api.ids}-${next}-tab`)?.focus(); }}>{label}</button>)}
      </div>
      <span className="avl-sheet-rule" aria-hidden="true" />
      <button type="button" className="avl-session" title={actions.onSession ? ui("Go to the original conversation", "원본 대화 세션으로 이동") : ui("No linked conversation", "연결된 대화가 없습니다")} aria-label={ui("Go to the original conversation", "원본 대화 세션으로 이동")} disabled={!actions.onSession} onClick={actions.onSession}><span>{ui("Session", "세션")}</span><span className="avl-arrow" aria-hidden="true">↗</span></button>
      <button type="button" className="avl-sheet-icon" data-action="more" title={ui("More", "더 보기")} aria-label={ui("More", "더 보기")} aria-haspopup="menu" onClick={event => actions.onMenu(event.currentTarget, api)}><Dots size={16} r={1.5} /></button>
      <button type="button" className="avl-sheet-icon" data-action="close" title={ui("Close", "닫기")} aria-label={ui("Back to gallery", "갤러리로 돌아가기")} onClick={actions.onClose}><Svg size={16}>{icons.close}</Svg></button>
    </div>
    {open && api && <Versions api={api} anchor={anchor} canRestore={actions.canRestore} onClose={close} onRestore={(version, number) => actions.onRestore(version, number, api)} />}
  </header>;
}

/** Read-only source of the version on screen. Two columns of text, not one node per line: artifacts reach 512KB. */
function SourceView({ api, notify }: { api: WorkbenchApi; notify: (message: string) => void }) {
  useUiLocale();
  const format = api.current?.format ?? (api.current?.kind === "react" ? "react" : "html"), count = lines(api.code);
  const name = `${api.title.replace(/[<>:"/\\|?*\u0000-\u001f]/g, "_").trim() || "artifact"}.${format === "react" ? "tsx" : format}`;
  return <div className="avl-code">
    <div className="avl-code-head"><span className="avl-code-name" title={name}>{name}</span>
      <button type="button" aria-label={ui("Copy code", "코드 복사")} onClick={() => { void copyArtifact(api.code).then(() => notify(ui("Code copied", "코드를 복사했습니다")), () => notify(ui("Couldn't copy", "복사하지 못했습니다"))); }}>{ui("Copy", "복사")}</button></div>
    <div className="avl-code-scroll" tabIndex={0} role="region" aria-label={ui("Artifact code", "아티팩트 코드")}>
      <pre className="avl-code-lines" aria-hidden="true">{Array.from({ length: count }, (_, i) => i + 1).join("\n")}</pre>
      <pre className="avl-code-text">{api.code}</pre>
    </div>
  </div>;
}

function SheetFooter({ item }: { item: LibraryItem }) {
  useUiLocale();
  const session = sessionLabel(item);
  return <footer className="avl-sheet-foot">
    <span className="avl-sheet-source"><Dot item={item} />{item.workspaceName && <><span className="avl-ws">{item.workspaceName}</span><span aria-hidden="true">·</span></>}<span className="avl-sheet-session">{session}</span></span>
    <time className="avl-sheet-time" dateTime={item.updatedAt} title={fullDate(item.updatedAt)}>{uiLocale() === "ko" ? `${updatedText(item.updatedAt)} 수정` : `Edited ${updatedText(item.updatedAt)}`}</time>
  </footer>;
}

/** The workbench's chrome inside the sheet. */
export function sheetChrome(item: LibraryItem, actions: SheetActions): WorkbenchChrome {
  return {
    notify: actions.notify,
    header: api => <SheetHeader title={api.title} headVersion={item.headVersion} api={api} actions={actions} />,
    source: api => <SourceView api={api} notify={actions.notify} />,
    footer: () => <SheetFooter item={item} />,
  };
}
/** Loading, missing, deleted and failed states keep the same header and footer around them. */
export function SheetState({ item, title, actions, children }: { item: LibraryItem; title?: string; actions: SheetActions; children: ReactNode }) {
  return <section className="avl-sheet-state" aria-label={ui("Artifact details", "아티팩트 상세")}><SheetHeader title={title ?? item.title} headVersion={item.headVersion} api={null} actions={actions} /><div className="avl-sheet-body">{children}</div><SheetFooter item={item} /></section>;
}

/* ───────────────────────────── styles ───────────────────────────── */

export const sheetStyles = `
.avl-menu{position:absolute;z-index:60;box-sizing:border-box;width:176px;padding:4px 0;border:1px solid var(--avl-border);border-radius:12px;background:var(--avl-pop);box-shadow:0 12px 32px -8px rgba(0,0,0,.12);font-size:12.5px;line-height:18.75px;color:var(--avl-ink);user-select:none;-webkit-user-select:none}
.avl-menu button{display:flex;align-items:center;justify-content:space-between;width:100%;margin:0;padding:6px 12px;border:0;background:transparent;color:inherit;font:inherit;text-align:left;cursor:pointer}
.avl-menu button:not(:disabled):hover,.avl-menu button:focus-visible{background:var(--avl-subtle)}
.avl-root .avl-menu button:focus-visible{outline:none}
.avl-menu button:disabled{color:var(--avl-faint);cursor:default}
.avl-menu .avl-menu-danger:not(:disabled){color:var(--avl-red)}
.avl-menu .avl-menu-danger:not(:disabled):hover,.avl-menu .avl-menu-danger:focus-visible{background:var(--avl-red-bg)}
.avl-menu-hint,.avl-arrow{font-family:var(--avl-mono);font-size:11px;color:var(--avl-faint)}
.avl-menu-divider{margin:4px 0;border-top:1px solid var(--avl-border)}
.avl-toasts{position:absolute;left:0;right:0;bottom:24px;z-index:70;display:flex;justify-content:center;pointer-events:none}
.avl-toast{pointer-events:auto;display:flex;align-items:center;gap:12px;max-width:calc(100% - 48px);padding:8px 16px;border-radius:9999px;background:#171717;color:#fff;font-size:12.5px;line-height:18.75px;box-shadow:0 10px 15px -3px rgba(0,0,0,.1),0 4px 6px -4px rgba(0,0,0,.1);transition:opacity .2s var(--avl-std)}
.avl-root[data-dark=true] .avl-toast{background:#EDEDED;color:#171717}
.avl-toast[data-leaving=true]{opacity:0}
.avl-toast>span{min-width:0;overflow:hidden;text-overflow:ellipsis}
.avl-toast button{flex:none;padding:0;border:0;background:transparent;color:inherit;opacity:.8;font:inherit;text-decoration:underline;text-underline-offset:2px;cursor:pointer}
.avl-toast button:hover{opacity:1}
.avl-sheet{position:absolute;inset:0;z-index:50;display:flex;flex-direction:column;box-sizing:border-box;width:100%;background:var(--avl-bg);color:var(--avl-ink);outline:none}.avl-sheet button{font:inherit;letter-spacing:inherit;margin:0}
.avl-sheet>.avl-detail,.avl-sheet-state{flex:1;min-height:0;min-width:0;display:flex;flex-direction:column}
.avl-sheet .av-workbench{background:var(--avl-bg);color:var(--avl-ink);font:inherit}
.avl-sheet-head{position:relative;z-index:30;flex:none;display:flex;align-items:center;justify-content:space-between;gap:16px;box-sizing:border-box;height:56px;padding:0 24px;border-bottom:1px solid var(--avl-border);font-size:12.5px;line-height:18.75px;user-select:none;-webkit-user-select:none}
.avl-sheet-lead{display:flex;align-items:center;gap:8px;min-width:0}
.avl-sheet-title{min-width:0;margin:0;font-size:14.5px;line-height:21.75px;font-weight:600;letter-spacing:-.015em;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.avl-sheet .av-rename{width:200px;height:30px;font-size:14px}
.avl-sheet .avl-version-button{flex:none;display:inline-flex;align-items:center;gap:4px;padding:2px 6px;border:0;border-radius:6px;background:transparent;font-family:var(--avl-mono);font-size:11.5px;line-height:17.25px;font-variant-numeric:tabular-nums;color:var(--avl-muted);cursor:pointer;transition:color .15s var(--avl-std),background-color .15s var(--avl-std)}
.avl-sheet .avl-version-button:not(:disabled):hover{color:var(--avl-ink);background:var(--avl-subtle)}
.avl-version-button svg{opacity:.6}
.avl-sheet .avl-sheet-head button:disabled{opacity:1;cursor:default}
.avl-sheet-tools{flex:none;display:flex;align-items:center;gap:12px}
.avl-tabs{display:flex;align-items:center;gap:12px;margin-right:4px}
.avl-sheet .avl-tabs button,.avl-sheet .avl-session{position:relative;padding:0;border:0;background:transparent;color:var(--avl-faint);white-space:nowrap;cursor:pointer;transition:color .15s var(--avl-std)}
.avl-sheet .avl-tabs button::after,.avl-session::after{content:"";position:absolute;inset:-8px -6px}
.avl-sheet .avl-tabs button:not(:disabled):hover{color:var(--avl-ink)}
.avl-sheet .avl-tabs button[aria-selected=true]{color:var(--avl-ink);font-weight:500}
.avl-sheet-rule{width:1px;height:14px;background:var(--avl-border)}
.avl-sheet .avl-session{display:flex;align-items:center;gap:2px;color:var(--avl-muted)}
.avl-sheet .avl-session .avl-arrow{color:inherit}
.avl-sheet .avl-session:not(:disabled):hover{color:var(--avl-ink)}
.avl-sheet .avl-session:disabled{color:var(--avl-faint)}
.avl-sheet .avl-sheet-icon{flex:none;display:flex;align-items:center;justify-content:center;width:28px;height:28px;padding:0;border:0;border-radius:8px;background:transparent;color:var(--avl-faint);cursor:pointer;transition:color .15s var(--avl-std),background-color .15s var(--avl-std)}
.avl-sheet .avl-sheet-icon:hover,.avl-sheet .avl-sheet-icon[data-open=true]{color:var(--avl-ink);background:var(--avl-subtle)}
.avl-versions{position:absolute;top:48px;z-index:50;box-sizing:border-box;width:288px;max-width:calc(100% - 24px);max-height:min(480px,calc(100vh - 160px));overflow-y:auto;padding:6px;border:1px solid var(--avl-border);border-radius:12px;background:var(--avl-pop);box-shadow:0 14px 36px -8px rgba(0,0,0,.14)}
.avl-version{padding:8px;border-radius:8px;transition:background-color .15s var(--avl-std)}
.avl-version:hover{background:var(--avl-side-solid)}
.avl-version[data-current=true]{background:var(--avl-subtle)}
.avl-sheet .avl-version-pick{display:block;width:100%;padding:0;border:0;background:transparent;color:inherit;text-align:left;cursor:pointer}
.avl-version-line{display:flex;align-items:center;gap:6px;margin-bottom:2px}
.avl-version-name{font-family:var(--avl-mono);font-size:12px;line-height:18px;font-weight:500;color:var(--avl-ink)}
.avl-version-latest{font-size:10.5px;line-height:15.75px;color:var(--avl-faint)}
.avl-version-time{margin-left:auto;font-family:var(--avl-mono);font-size:10.5px;line-height:15.75px;color:var(--avl-faint)}
.avl-version-note{display:block;font-size:11.5px;line-height:1.375;color:var(--avl-muted);overflow-wrap:anywhere}
.avl-sheet .avl-version-restore{margin-top:6px;padding:0;border:0;background:transparent;font-size:11px;line-height:16.5px;font-weight:500;color:var(--avl-ink);text-decoration:underline;text-decoration-color:#D4D4D4;text-underline-offset:2px;cursor:pointer}
.avl-sheet .avl-version-restore:hover{text-decoration-color:currentColor}
.avl-sheet .av-body,.avl-sheet-body{flex:1;min-height:0;min-width:0;display:flex;flex-direction:column;box-sizing:border-box;border-radius:0;padding:32px;background:var(--avl-stage)}
.avl-sheet .av-preview{height:auto;min-height:0;border:1px solid var(--avl-border);border-radius:12px;overflow:hidden;background:var(--avl-bg)}
.avl-sheet .av-preview iframe{min-height:0!important}
.avl-sheet .av-source{min-height:0}
.avl-sheet .av-body:has(>.av-source){padding:24px}
.avl-sheet .av-error{bottom:44px;inset-inline:44px}
.avl-sheet .av-consent-card h3{font-size:14px;font-weight:500;color:var(--avl-ink)}
.avl-sheet .av-consent-card p{font-size:12.5px;color:var(--avl-muted)}
.avl-sheet .av-consent-card .av-action{min-height:34px;padding:0 18px;border-radius:9999px;font-size:12.5px}
.avl-sheet .av-feedback{display:none}
.avl-code{flex:1;min-height:0;display:flex;flex-direction:column;background:var(--avl-bg);border:1px solid var(--avl-border);border-radius:12px;overflow:hidden}
.avl-code-head{flex:none;display:flex;align-items:center;justify-content:space-between;gap:16px;box-sizing:border-box;height:40px;padding:0 16px;border-bottom:1px solid var(--avl-border);font-size:12px;line-height:18px}
.avl-code-name{min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-family:var(--avl-mono);color:var(--avl-muted)}
.avl-sheet .avl-code-head button{flex:none;padding:0;border:0;background:transparent;color:var(--avl-muted);cursor:pointer;transition:color .15s var(--avl-std)}
.avl-sheet .avl-code-head button:hover{color:var(--avl-ink)}
.avl-code-scroll{flex:1;min-height:0;display:flex;align-items:flex-start;overflow:auto;padding:16px;outline-offset:-2px}
.avl-code pre{margin:0;font-family:var(--avl-mono);font-size:12px;line-height:1.7;white-space:pre;tab-size:2}
.avl-code-lines{flex:none;min-width:32px;box-sizing:border-box;padding-right:16px;text-align:right;color:var(--avl-num);font-variant-numeric:tabular-nums;user-select:none;-webkit-user-select:none}
.avl-code-text{flex:1 0 auto;padding-right:16px;color:var(--avl-code);user-select:text;-webkit-user-select:text}
.avl-sheet-foot{flex:none;display:flex;align-items:center;justify-content:space-between;box-sizing:border-box;height:40px;padding:0 24px;border-top:1px solid var(--avl-border);background:var(--avl-bg);font-size:11.5px;line-height:17.25px;color:var(--avl-faint)}
.avl-sheet-source{display:flex;align-items:center;gap:8px;min-width:0}
.avl-sheet-session{min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.avl-sheet-source .avl-ws{flex:0 1 auto;max-width:60%}
.avl-sheet-time{flex:none;margin-left:12px;font-family:var(--avl-mono);font-variant-numeric:tabular-nums}
.avl-sheet-body{align-items:center;justify-content:center;gap:8px;text-align:center;font-size:12.5px;line-height:1.6;color:var(--avl-muted)}
.avl-sheet-body p{margin:0}
@container avl (max-width:639px){.avl-sheet .av-body,.avl-sheet-body{padding:24px}}
`;
