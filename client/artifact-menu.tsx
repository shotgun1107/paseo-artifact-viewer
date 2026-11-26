import { useEffect, useRef, useState } from "react";
import { Action, ArtifactIcon, type IconName } from "./chrome";
import { ui, uiLocale, useUiLocale } from "./ui-locale";

/** Management capabilities supplied by the agent panel. Absent for file previews. */
export interface ArtifactManagement {
  pinned: boolean;
  /** False until the artifact has a server id; items stay visible but disabled. */
  available: boolean;
  pin(next: boolean): Promise<void>;
  rename(title: string): Promise<void>;
  duplicate(version: number): Promise<void>;
  remove(): Promise<void>;
  openWeb(version: number): Promise<void>;
}

export type MenuCommand = "export" | "web" | "pin" | "rename" | "duplicate" | "refresh" | "delete";

export function stampText(timestamp: string | undefined, versions: number) {
  const date = timestamp ? new Date(timestamp) : null;
  const day = date && !Number.isNaN(date.valueOf()) ? date.toLocaleDateString(uiLocale() === "ko" ? "ko-KR" : "en-US", { month: "long", day: "numeric" }) : "";
  return day ? `${day} ${versions > 1 ? ui("updated", "업데이트됨") : ui("created", "생성됨")}` : versions > 1 ? ui(`Version ${versions}`, `버전 ${versions}`) : ui("New artifact", "새 아티팩트");
}

function Item({ icon, label, command, onCommand, disabled, danger }: { icon: IconName; label: string; command: MenuCommand; onCommand: (command: MenuCommand) => void; disabled?: boolean; danger?: boolean }) {
  return <button type="button" role="menuitem" className={`av-menu-item${danger ? " av-danger" : ""}`} data-command={command} disabled={disabled} onClick={() => onCommand(command)}><ArtifactIcon name={icon} size={15} />{label}</button>;
}

/** Current-artifact menu: date, then export/web, then manage, then delete. */
export function ArtifactMenu({ stamp, management, canRefresh, onCommand }: { stamp: string; management?: ArtifactManagement; canRefresh: boolean; onCommand: (command: MenuCommand) => void }) {
  const off = !management?.available; useUiLocale();
  return <div role="menu" aria-label={ui("Current artifact menu", "현재 아티팩트 메뉴")}>
    <div className="av-menu-stamp">{stamp}</div>
    <Item icon="download" label={ui("Export", "내보내기")} command="export" onCommand={onCommand} />
    {management && <Item icon="web" label={ui("Open on the web", "웹에서 열기")} command="web" onCommand={onCommand} disabled={off} />}
    <div className="av-menu-divider" role="separator" />
    {management && <Item icon="pin" label={management.pinned ? ui("Unpin", "고정 해제") : ui("Pin", "고정")} command="pin" onCommand={onCommand} disabled={off} />}
    {management && <Item icon="edit" label={ui("Rename", "이름 변경")} command="rename" onCommand={onCommand} disabled={off} />}
    {management && <Item icon="duplicate" label={ui("Duplicate", "복제")} command="duplicate" onCommand={onCommand} disabled={off} />}
    <Item icon="refresh" label={ui("Refresh", "새로고침")} command="refresh" onCommand={onCommand} disabled={!canRefresh} />
    {management && <><div className="av-menu-divider" role="separator" /><Item icon="trash" label={ui("Delete", "삭제")} command="delete" onCommand={onCommand} disabled={off} danger /></>}
  </div>;
}

export function RenameField({ value, onDone }: { value: string; onDone: (next: string | null) => void }) {
  const ref = useRef<HTMLInputElement>(null), done = useRef(false), [text, setText] = useState(value); useUiLocale();
  useEffect(() => { ref.current?.focus(); ref.current?.select(); }, []);
  const finish = (next: string | null) => { if (done.current) return; done.current = true; onDone(next); };
  return <input ref={ref} className="av-rename" aria-label={ui("Artifact name", "아티팩트 이름")} maxLength={100} value={text} onChange={event => setText(event.target.value)}
    onKeyDown={event => { if (event.nativeEvent.isComposing) return; if (event.key === "Enter") { event.preventDefault(); finish(text.trim() || null); } if (event.key === "Escape") { event.preventDefault(); event.stopPropagation(); finish(null); } }}
    onBlur={() => finish(text.trim() || null)} />;
}

function Dialog({ label, children, onCancel }: { label: string; children: React.ReactNode; onCancel: () => void }) {
  const ref = useRef<HTMLDivElement>(null), cancel = useRef(onCancel); cancel.current = onCancel;
  useEffect(() => {
    const previous = document.activeElement as HTMLElement | null;
    ref.current?.querySelector<HTMLElement>("textarea,button.av-primary,button.av-destructive")?.focus();
    const escape = (event: KeyboardEvent) => { if (event.key === "Escape") { event.stopPropagation(); cancel.current(); } };
    document.addEventListener("keydown", escape, true);
    return () => { document.removeEventListener("keydown", escape, true); previous?.focus(); };
  }, []);
  return <div className="av-dialog-backdrop" onPointerDown={event => { if (event.target === event.currentTarget) cancel.current(); }}>
    <div ref={ref} className="av-dialog" role="dialog" aria-modal="true" aria-label={label}>{children}</div>
  </div>;
}

export function DeleteDialog({ title, onConfirm, onCancel }: { title: string; onConfirm: () => Promise<void>; onCancel: () => void }) {
  const [busy, setBusy] = useState(false), [error, setError] = useState(""); useUiLocale();
  return <Dialog label={ui("Delete artifact", "아티팩트 삭제")} onCancel={onCancel}>
    <h3>{ui(`Delete “${title}”`, `‘${title}’ 삭제`)}</h3>
    <p>{ui("The conversation card and every version disappear from the list. You can undo this right after deleting.", "대화의 카드와 모든 버전이 목록에서 사라져요. 삭제 직후에는 되돌릴 수 있어요.")}</p>
    {error && <p role="alert" style={{ color: "var(--av-danger)" }}>{error}</p>}
    <div className="av-dialog-actions"><Action onClick={onCancel}>{ui("Cancel", "취소")}</Action><Action className="av-destructive" disabled={busy} onClick={() => { setBusy(true); setError(""); void onConfirm().catch(reason => { setError(reason instanceof Error ? reason.message : String(reason)); setBusy(false); }); }}>{busy ? ui("Deleting…", "삭제 중…") : ui("Delete", "삭제")}</Action></div>
  </Dialog>;
}

/** React pages load React from a public CDN in the browser; HTML/SVG stay on the local daemon. */
export function WebConsentDialog({ onConfirm, onCancel }: { onConfirm: () => void; onCancel: () => void }) {
  useUiLocale();
  return <Dialog label={ui("Open on the web", "웹에서 열기")} onCancel={onCancel}>
    <h3>{ui("Open on the web", "웹에서 열기")}</h3>
    <p>{ui("The browser loads the React libraries for a React artifact from esm.sh and runs it. The code itself is served by your local Paseo.", "React 아티팩트는 브라우저가 React 라이브러리를 esm.sh에서 불러와 실행해요. 코드는 로컬 Paseo에서 제공됩니다.")}</p>
    <div className="av-dialog-actions"><Action onClick={onCancel}>{ui("Cancel", "취소")}</Action><Action primary onClick={onConfirm}>{ui("Open", "열기")}</Action></div>
  </Dialog>;
}
