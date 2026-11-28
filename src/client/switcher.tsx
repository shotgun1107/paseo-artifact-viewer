import { useState } from "react";
import type { ArtifactRecord } from "./store";
import { ArtifactIcon, Popover } from "./chrome";
import { recordTitle } from "./management";
import { ui, useUiLocale } from "./ui-locale";

const formatOf = (record: ArtifactRecord) => (record.draft ?? record.versions.at(-1))?.kind === "react" ? "React" : "HTML";

/** Header switcher. `records` arrive already ordered: pinned first. */
export function ArtifactSwitcher({ records, selected, onSelect }: { records: readonly ArtifactRecord[]; selected: string; onSelect: (id: string) => void }) {
  const [open, setOpen] = useState(false); useUiLocale();
  if (records.length < 2) return null;
  return <div className="av-artifact-switcher" style={{ position: "relative", flexShrink: 0 }}>
    <button type="button" className="av-icon-button av-head-button" aria-label={ui("Switch artifact", "아티팩트 전환")} title={ui("Switch artifact", "아티팩트 전환")} aria-haspopup="dialog" aria-expanded={open} onClick={() => setOpen(!open)}><ArtifactIcon name="list" size={16} /></button>
    <Popover open={open} onClose={() => setOpen(false)} label={ui("Artifact list", "아티팩트 전환 목록")} className="av-artifact-list">
      {records.map(record => <button type="button" role="menuitemradio" aria-label={`${record.pinned ? ui("Pinned ", "고정됨 ") : ""}${recordTitle(record)}`} aria-checked={record.id === selected} className="av-artifact-item" data-pinned={record.pinned ? "true" : "false"} key={record.id} onClick={() => { onSelect(record.id); setOpen(false); }}>
        <span className="av-artifact-title">{record.pinned && <span className="av-artifact-pin" aria-hidden="true"><ArtifactIcon name="pin" size={12} /></span>}{recordTitle(record)}</span>
        <span className="av-artifact-meta">{ui("Version", "버전")} {record.versions.length || 1} · {formatOf(record)}</span>
      </button>)}
    </Popover>
  </div>;
}

/** Host tab list: every live artifact of the conversation, reopenable. */
export function ArtifactList({ records, onSelect }: { records: readonly ArtifactRecord[]; onSelect: (id: string) => void }) {
  useUiLocale();
  return <div className="av-list" role="list" aria-label={ui("Conversation artifacts", "대화 아티팩트 목록")}>
    {records.map(record => <button type="button" role="listitem" key={record.id} className="av-list-item" aria-label={ui(`Open ${recordTitle(record)}`, `${recordTitle(record)} 열기`)} data-pinned={record.pinned ? "true" : "false"} onClick={() => onSelect(record.id)}>
      <span className="av-list-thumb" aria-hidden="true">{formatOf(record) === "React" ? "JSX" : "</>"}</span>
      <span className="av-list-copy"><strong>{recordTitle(record)}</strong><small>{formatOf(record)} · v{record.headVersion ?? (record.versions.length || 1)}{record.pinned ? ` · ${ui("Pinned", "고정됨")}` : ""}</small></span>
      {record.pinned && <span className="av-list-pin" aria-hidden="true"><ArtifactIcon name="pin" size={14} /></span>}
    </button>)}
  </div>;
}

export const listStyles = `
.av-artifact-pin{display:inline-flex;vertical-align:-1px;margin-inline-end:5px;color:var(--av-muted)}
.av-list-view{display:flex;flex-direction:column;flex:1;min-height:0}
.av-list-head{display:flex;align-items:center;min-height:44px;padding:0 12px;border-bottom:1px solid var(--av-border);font-weight:600}
.av-list{flex:1;min-height:0;overflow:auto;display:flex;flex-direction:column;gap:8px;padding:12px}
.av-list-item{display:flex;align-items:stretch;width:100%;min-height:56px;padding:0;border:1px solid var(--av-border);border-radius:12px;background:var(--av-surface);text-align:start;overflow:hidden}
.av-list-item:hover{border-color:var(--av-accent)}
.av-list-thumb{display:grid;place-items:center;width:52px;flex:none;background:var(--av-raised);border-inline-end:1px solid var(--av-border);color:var(--av-muted);font:600 12px ui-monospace,Consolas,monospace}
.av-list-copy{flex:1;min-width:0;display:flex;flex-direction:column;justify-content:center;gap:2px;padding:8px 12px}
.av-list-copy strong{font-weight:600;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.av-list-copy small{font-size:12px;color:var(--av-muted)}
.av-list-pin{display:flex;align-items:center;padding-inline-end:12px;color:var(--av-muted)}
.av-list-empty{margin:auto;padding:24px 16px;max-width:300px;text-align:center;color:var(--av-muted);line-height:1.6}
.av-bar{display:flex;align-items:center;gap:10px;flex:none;min-height:40px;padding:6px 8px 6px 12px;border-top:1px solid var(--av-border);background:var(--av-raised);font-size:12px}
.av-bar>span{flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.av-bar button{flex:none;height:28px;padding:0 10px;border:1px solid var(--av-border);border-radius:7px;background:transparent;font-weight:600}
`;
