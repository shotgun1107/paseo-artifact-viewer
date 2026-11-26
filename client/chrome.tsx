import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import type { PluginTheme } from "@getpaseo/plugin";
import { claudeReference } from "./claude-reference";

export const fallbackTheme: PluginTheme = { colors: { surface0: "#fff", surface1: "#fcfcfb", surface2: "#f0efec", border: "#0b0b0b1a", foreground: "#0b0b0b", foregroundMuted: "#52514e", accent: "#3d638f", accentForeground: "#fff", statusSuccess: "#39765d", statusWarning: "#a97523", statusDanger: "#b8453c" } };
export function workbenchVariables(theme?: PluginTheme): CSSProperties {
  const input = theme?.colors.surface0 ?? "#fff";
  const hex = /^#([\da-f]{6}|[\da-f]{3})$/i.exec(input)?.[1];
  const expanded = hex?.length === 3 ? [...hex].map(char => char + char).join("") : hex;
  const dark = expanded ? [0, 2, 4].reduce((sum, at) => sum + parseInt(expanded.slice(at, at + 2), 16), 0) < 384 : false;
  const c = dark ? claudeReference.dark : claudeReference.light;
  return { "--av-bg": c.surface3, "--av-surface": c.surface3, "--av-raised": c.surface1, "--av-control": c.control, "--av-hover": c.hover, "--av-border": c.control, "--av-fg": c.foreground, "--av-muted": c.secondary, "--av-accent": theme?.colors.accent ?? "#3d638f", "--av-accent-fg": "#fff", "--av-danger": theme?.colors.statusDanger ?? "#b8453c", "--av-warning": theme?.colors.statusWarning ?? "#a97523" } as CSSProperties;
}
export type IconName = "code" | "preview" | "more" | "expand" | "collapse" | "close" | "copy" | "download" | "refresh" | "stop" | "left" | "right" | "history" | "check" | "send" | "warning" | "play" | "file" | "undo" | "down" | "list" | "edit" | "pin" | "web" | "duplicate" | "trash";
const paths: Record<IconName, ReactNode> = {
  code: <path d="m8 7-5 5 5 5m8-10 5 5-5 5m-2-14-4 18" />,
  preview: <><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z" /><circle cx="12" cy="12" r="3" /></>,
  more: <><circle cx="12" cy="5" r=".8" fill="currentColor" /><circle cx="12" cy="12" r=".8" fill="currentColor" /><circle cx="12" cy="19" r=".8" fill="currentColor" /></>,
  expand: <path d="M14 3h7v7m0-7-8 8M10 21H3v-7m0 7 8-8" />,
  close: <path d="m6 6 12 12M18 6 6 18" />,
  copy: <><rect x="8" y="8" width="12" height="13" rx="2" /><path d="M16 8V4H4v12h4" /></>,
  download: <><path d="M12 3v12m-5-5 5 5 5-5M4 16v5h16v-5" /></>,
  refresh: <><path d="M20 8a8 8 0 1 0 .1 8M20 3v5h-5" /></>,
  stop: <rect x="6" y="6" width="12" height="12" rx="1" />,
  left: <path d="m14 6-6 6 6 6" />, right: <path d="m10 6 6 6-6 6" />, down: <path d="m6 9 6 6 6-6" />,
  history: <><path d="M3 11a9 9 0 1 1 2 7M3 5v6h6m3-4v5l3 2" /></>,
  check: <path d="m5 12 4 4L19 6" />, send: <path d="M12 20V4m-6 6 6-6 6 6" />,
  warning: <><path d="m12 3-10 18h20L12 3Zm0 6v5m0 3h.01" /></>,
  play: <path d="m8 4 12 8-12 8Z" />, file: <><path d="M14 2H5v20h14V7Zm0 0v5h5M8 12h8m-8 4h8" /></>,
  undo: <path d="M4 10h10a6 6 0 0 1 0 12M4 10l5-5m-5 5 5 5" />,
  list: <><path d="M8 6h13M8 12h13M8 18h13" /><circle cx="3" cy="6" r=".75" fill="currentColor" /><circle cx="3" cy="12" r=".75" fill="currentColor" /><circle cx="3" cy="18" r=".75" fill="currentColor" /></>,
  edit: <><path d="m15 4 5 5M4 20l5-1L21 7l-5-5L4 14v6Z" /></>,
  collapse: <path d="M4 14h6v6m-6 0 6-6M20 10h-6V4m6 0-6 6" />,
  pin: <path d="M12 17v5M9 10.8V4h6v6.8l3 3.2v2H6v-2z" />,
  web: <path d="M15 3h6v6M10 14 21 3M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />,
  duplicate: <><rect x="8" y="8" width="13" height="13" rx="2" /><path d="M4 16V5a1 1 0 0 1 1-1h11" /></>,
  trash: <path d="M4 7h16M10 11v6m4-6v6M6 7l1 13h10l1-13M9 7V4h6v3" />,
};
export function ArtifactIcon({ name, size = 20 }: { name: IconName; size?: number }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={{ flexShrink: 0 }}>{paths[name]}</svg>;
}
export function IconButton({ icon, label, ...props }: { icon: IconName; label: string } & Omit<React.ComponentProps<"button">, "children">) {
  return <button type="button" {...props} className={`av-icon-button ${props.className ?? ""}`} aria-label={label} title={label}><ArtifactIcon name={icon} /></button>;
}
export function Action({ icon, children, primary = false, ...props }: { icon?: IconName; children: ReactNode; primary?: boolean } & React.ComponentProps<"button">) {
  return <button type="button" {...props} className={`av-action ${primary ? "av-primary" : ""} ${props.className ?? ""}`}>{icon && <ArtifactIcon name={icon} size={14} />}{children}</button>;
}

/** Anchored capability menu. Text editing keeps its own arrow and composition keys. */
export function Popover({ open, onClose, label, children, className = "" }: { open: boolean; onClose: () => void; label: string; children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null), close = useRef(onClose); close.current = onClose;
  useEffect(() => {
    if (!open) return;
    const previous = document.activeElement as HTMLElement | null, popup = ref.current, scope = popup?.closest(".av-workbench");
    const fit = () => { if (!popup || !scope) return; const bounds = scope.getBoundingClientRect(), rect = popup.getBoundingClientRect(); popup.style.maxHeight = `${Math.max(70, bounds.bottom - rect.top - 8)}px`; };
    fit();
    const observer = typeof ResizeObserver === "undefined" ? null : new ResizeObserver(fit);
    if (scope) observer?.observe(scope);
    popup?.querySelector<HTMLElement>("textarea:not(:disabled),button:not(:disabled)")?.focus();
    const outside = (event: PointerEvent) => { if (event.target instanceof Node && !ref.current?.parentElement?.contains(event.target)) close.current(); };
    const escape = (event: KeyboardEvent) => { if (event.key === "Escape") { event.stopPropagation(); close.current(); previous?.focus(); } };
    document.addEventListener("pointerdown", outside); document.addEventListener("keydown", escape);
    return () => { observer?.disconnect(); document.removeEventListener("pointerdown", outside); document.removeEventListener("keydown", escape); };
  }, [open]);
  if (!open) return null;
  return <div ref={ref} className={`av-popover ${className}`} role="dialog" aria-label={label} onKeyDown={event => {
    if ((event.target as HTMLElement).matches("textarea,input") || !["ArrowDown", "ArrowUp", "Home", "End"].includes(event.key)) return;
    const buttons = Array.from(event.currentTarget.querySelectorAll<HTMLButtonElement>("button:not(:disabled)"));
    if (!buttons.length) return;
    event.preventDefault(); const index = buttons.indexOf(document.activeElement as HTMLButtonElement);
    const next = event.key === "Home" ? 0 : event.key === "End" ? buttons.length - 1 : (index + (event.key === "ArrowDown" ? 1 : -1) + buttons.length) % buttons.length;
    buttons[next]?.focus();
  }}>{children}</div>;
}
export function useTransientMessage() {
  const [message, setMessage] = useState("");
  useEffect(() => { if (!message) return; const timer = setTimeout(() => setMessage(""), 5000); return () => clearTimeout(timer); }, [message]);
  return [message, setMessage] as const;
}

/** Classic CDS PanelHeader in actual provider-default comfortable density; no hosted shell layout. */
export const workbenchStyles = `
.av-workbench{container-type:inline-size;container-name:artifact-workbench;box-sizing:border-box;display:flex;flex-direction:column;height:100%;min-height:0;min-width:0;overflow:hidden;position:relative;color:var(--av-fg);background:var(--av-surface);font:13px/1.46 -apple-system,BlinkMacSystemFont,"Malgun Gothic","Segoe UI",sans-serif;isolation:isolate}
.av-workbench *{box-sizing:border-box}.av-workbench button,.av-workbench textarea{font:inherit}.av-workbench button{appearance:none;cursor:pointer;color:inherit;margin:0;box-shadow:none}.av-workbench button:disabled{opacity:.4;cursor:default}.av-workbench button:focus-visible,.av-workbench textarea:focus-visible{outline:2px solid var(--av-accent);outline-offset:2px}
.av-toolbar{position:relative;display:flex;flex:none;align-items:center;gap:4px;padding:6px 8px 6px 12px;min-height:36px;min-width:0;background:var(--av-surface)}.av-toolbar-lead{display:flex;align-items:center;gap:4px;flex:1;min-width:0;min-height:24px}.av-header-actions{display:flex;align-items:center;gap:8px;position:relative;flex:none}.av-icon-button{display:inline-flex;align-items:center;justify-content:center;flex:none;width:24px;height:24px;border:0;border-radius:6px;background:transparent;color:var(--av-muted)!important;padding:4px}.av-icon-button:not(:disabled):hover,.av-ghost:not(:disabled):hover{background:var(--av-hover)}
.av-tabs{display:flex;align-items:center;gap:0;border-radius:6px;background:var(--av-control);padding:0;flex:none;height:24px}.av-tab{width:26px;height:24px;padding:4px 5px;border:0;border-radius:6px;display:flex;justify-content:center;align-items:center;background:transparent;color:var(--av-muted)!important}.av-tab[aria-selected=true]{background:var(--av-surface);color:var(--av-fg)!important;box-shadow:inset 0 0 0 1px var(--av-border)}.av-version-anchor,.av-menu-anchor,.av-copy-group,.av-request-anchor{position:relative;display:flex;align-items:center;min-width:0}.av-version-trigger{display:flex;align-items:center;gap:5px;min-height:24px;white-space:nowrap;border:0;background:transparent;border-radius:6px;padding:2px 6px;color:var(--av-muted)!important}.av-version-trigger:not(:disabled):hover{background:var(--av-hover)}.av-version-latest{color:var(--av-muted)}
.av-action{border:1px solid var(--av-border);background:transparent;border-radius:6px;padding:2px 7px;display:inline-flex;align-items:center;justify-content:center;gap:4px;min-height:24px;line-height:1.3;white-space:nowrap}.av-action:not(:disabled):hover{background:var(--av-hover)}.av-primary{background:var(--av-fg)!important;color:var(--av-surface)!important;border-color:transparent!important}.av-copy-group{gap:0;border:1px solid var(--av-border);border-radius:6px;height:24px}.av-copy-primary{border:0;border-radius:6px 0 0 6px;min-height:22px;height:22px;padding:2px 8px}.av-copy-options{width:22px;height:22px;border-inline-start:1px solid var(--av-border);border-radius:0 6px 6px 0;padding:4px}.av-wide{display:flex}.av-narrow{display:none}
.av-body{flex:1;min-height:0;min-width:0;position:relative;display:flex;flex-direction:column;overflow:hidden;border-radius:0 0 4px 4px}.av-preview{height:100%;min-height:0;flex:1;overflow:auto;background:var(--av-surface)}.av-source{flex:1;min-height:0;overflow:hidden;display:flex;flex-direction:column}.av-notice{padding:6px 12px;display:flex;align-items:center;gap:8px;flex-wrap:wrap;font-size:12px;color:var(--av-muted);background:var(--av-raised);border-bottom:1px solid var(--av-border);flex:none}.av-notice-text{flex:1;min-width:100px}.av-conflict{color:var(--av-warning)}
.av-popover{position:absolute;z-index:20;border:1px solid var(--av-border);border-radius:8px;background:var(--av-surface);padding:4px;box-shadow:0 2px 8px #00000014;max-width:calc(100cqw - 16px);overflow-y:auto}.av-menu{inset-inline-end:0;top:30px;width:216px}.av-menu-item{width:100%;display:flex;gap:8px;align-items:center;background:transparent;border:0;border-radius:6px;padding:6px 8px;text-align:start;min-height:28px;white-space:normal}.av-menu-item:not(:disabled):hover,.av-version-item:not(:disabled):hover{background:var(--av-hover)}.av-menu-divider{height:1px;background:var(--av-border);margin:4px}.av-history{inset-inline-start:0;top:30px;width:232px}.av-version-item{width:100%;display:flex;align-items:center;gap:8px;background:transparent;border:0;border-radius:6px;padding:6px 8px;text-align:start}.av-version-item[aria-checked=true]{background:var(--av-hover)}.av-version-copy{flex:1;min-width:0;display:flex;flex-direction:column;gap:2px}.av-version-copy strong{font-weight:400;font-size:13px}.av-version-copy small{font-size:11px;color:var(--av-muted);overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.av-version-check{width:14px;flex:none;color:var(--av-muted)}
.av-artifact-list{inset-inline-start:0;top:32px;width:288px;padding:8px 12px 8px 0;background:transparent;border:0;box-shadow:none;display:flex;flex-direction:column;gap:4px}.av-artifact-list .av-menu-item,.av-artifact-item{display:flex;flex-direction:column;align-items:stretch;gap:2px;width:100%;padding:8px 16px 8px 12px;border:1px solid var(--av-border);border-radius:8px;background:var(--av-surface);text-align:start;box-shadow:0 2px 8px #00000014}.av-artifact-item[aria-checked=true]{border-color:var(--av-accent);box-shadow:0 0 0 1px var(--av-accent)}.av-artifact-title{display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden}.av-artifact-meta{color:var(--av-muted);font-size:12px}
.av-request-popover{inset-inline-end:0;top:30px;width:320px;padding:12px}.av-request-form{display:flex;flex-direction:column;gap:8px}.av-request-form label{font-size:13px;font-weight:500}.av-request{border:1px solid var(--av-border);background:var(--av-surface);border-radius:6px;resize:vertical;min-width:0;width:100%;min-height:80px;max-height:180px;padding:8px;color:var(--av-fg);line-height:1.5}.av-request-caption{font-size:11px;color:var(--av-muted)}.av-request-actions{display:flex;justify-content:flex-end;gap:8px}
.av-consent{display:flex;flex:1;min-height:180px;align-items:center;justify-content:center;padding:24px 16px}.av-consent-card{max-width:320px;text-align:center;display:flex;flex-direction:column;align-items:center;gap:12px}.av-consent-card h3{font-size:14px;margin:0;font-weight:500}.av-consent-card p{font-size:13px;color:var(--av-muted);margin:0;line-height:1.6}.av-error{position:absolute;bottom:12px;inset-inline:12px;z-index:10;border:1px solid var(--av-border);border-radius:8px;padding:10px 12px;max-height:190px;overflow:auto;background:var(--av-surface);box-shadow:0 2px 8px #00000014}.av-error-heading{display:flex;align-items:center;gap:7px;color:var(--av-danger);font-size:13px;font-weight:500}.av-error pre{white-space:pre-wrap;overflow-wrap:anywhere;font:12px/1.5 ui-monospace,SFMono-Regular,Consolas,monospace;margin:7px 0 10px;color:var(--av-muted);max-height:72px;overflow:auto}.av-feedback{position:absolute;bottom:9px;left:10px;right:10px;z-index:25;padding:8px 10px;background:var(--av-surface);border:1px solid var(--av-border);border-radius:6px;font-size:12px;overflow-wrap:anywhere}.av-empty{display:flex;align-items:center;justify-content:center;flex:1;padding:32px;color:var(--av-muted)}
@keyframes av-spin{to{transform:rotate(360deg)}}@media(prefers-reduced-motion:reduce){.av-workbench *{animation:none!important}}
${headerStyles()}
`;

/** Approved 2026-11 header: every control stays visible; only the title shrinks. */
function headerStyles() {
  return `
.av-toolbar{min-height:44px;padding:6px 6px 6px 8px;gap:4px;border-bottom:1px solid var(--av-border)}
.av-toolbar>*,.av-toolbar-lead>*{flex:none}.av-toolbar-lead{flex:1 1 auto;min-width:0}
.av-header-actions{gap:2px}
.av-head-button{width:32px;height:32px;padding:7px;border-radius:8px}
.av-title-anchor{position:relative;display:flex;align-items:center;min-width:0;flex:0 1 auto!important}
.av-title-trigger{display:inline-flex;align-items:center;gap:6px;min-width:0;max-width:100%;height:32px;padding:0 6px 0 8px;border:0;border-radius:8px;background:transparent;color:var(--av-fg)!important;font-weight:600}
.av-title-trigger:not(:disabled):hover,.av-title-trigger[aria-expanded=true]{background:var(--av-hover)}
.av-title-text{min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.av-title-flag,.av-title-caret{display:inline-flex;flex:none;color:var(--av-muted)}
.av-rename{height:32px;width:220px;min-width:64px;flex:0 1 auto!important;padding:0 9px;border:1px solid var(--av-accent);border-radius:8px;background:var(--av-surface);color:var(--av-fg);font:600 13px/1 inherit;outline:none}
.av-version-trigger{min-height:28px;border:1px solid var(--av-border);border-radius:7px;padding:0 6px 0 8px;font-size:12px}
.av-title-menu{inset-inline-start:0;top:calc(100% + 2px);width:max-content;min-width:0;padding:4px}
.av-title-menu .av-menu-item{min-height:28px;padding:0 12px 0 8px;gap:8px;white-space:nowrap}
.av-title-menu .av-menu-item svg{width:15px;height:15px}
.av-title-menu .av-menu-divider{margin:3px 4px}
.av-menu-stamp{padding:5px 8px 4px;font-size:12px;color:var(--av-muted);white-space:nowrap}
.av-menu-item.av-danger{color:var(--av-danger)!important}
.av-dialog-backdrop{position:absolute;inset:0;z-index:40;display:grid;place-items:center;padding:16px;background:#14141347}
.av-dialog{width:100%;max-width:360px;display:flex;flex-direction:column;gap:12px;padding:18px;border:1px solid var(--av-border);border-radius:12px;background:var(--av-surface);box-shadow:0 20px 50px #00000033}
.av-dialog h3{margin:0;font-size:15px;font-weight:600}.av-dialog p{margin:0;color:var(--av-muted)}
.av-dialog textarea{min-height:88px;max-height:200px;resize:vertical;padding:9px 10px;border:1px solid var(--av-border);border-radius:8px;background:var(--av-raised);color:var(--av-fg);line-height:1.5}
.av-dialog-log{margin:0;padding:8px 0 0;list-style:none;border-top:1px solid var(--av-border);max-height:96px;overflow:auto;font-size:12px;color:var(--av-muted)}
.av-dialog-log li{overflow-wrap:anywhere;padding:2px 0}
.av-dialog-actions{display:flex;justify-content:flex-end;gap:8px}.av-dialog-actions .av-action{min-height:32px;padding:0 14px;border-radius:8px;font-weight:600}
.av-action.av-destructive{background:var(--av-danger)!important;color:#fff!important;border-color:transparent!important}
.av-workbench.av-maximized{position:fixed;inset:0;z-index:2147483000;height:auto}
.av-workbench:fullscreen{width:100%;height:100%}
@container artifact-workbench (max-width:503px){.av-version-latest{display:none}}
@container artifact-workbench (max-width:360px){.av-toolbar{padding:6px 4px 6px 6px;gap:2px}.av-head-button{width:30px;padding:6px}.av-title-trigger{padding:0 4px 0 6px}.av-rename{width:auto;flex:1 1 auto!important}}
`;
}
