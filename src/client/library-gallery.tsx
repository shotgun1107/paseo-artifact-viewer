import { useEffect, useLayoutEffect, useRef, useState, type ReactNode } from "react";
import type { LibraryItem } from "../shared/library";
import { Cover, workspaceColor } from "./library-cover";
import { monoFontFace } from "./mono-font";
import { ui, uiLocale, useUiLocale } from "./ui-locale";

/* ───────────────────────────── state shared with the screen ───────────────────────────── */

export type Gallery = { query: string; pinnedOnly: boolean; items: LibraryItem[]; nextOffset: number | null; status: "idle" | "loading" | "more" | "error"; error?: string; loaded: boolean };
export const emptyGallery: Gallery = { query: "", pinnedOnly: false, items: [], nextOffset: null, status: "idle", loaded: false };
export type ViewMode = "grid" | "list";

const VIEW_KEY = "paseo-artifact-viewer:library-view";
export function readViewMode(): ViewMode {
  try { return globalThis.localStorage?.getItem(VIEW_KEY) === "list" ? "list" : "grid"; } catch { return "grid"; }
}
export function storeViewMode(mode: ViewMode) {
  try { globalThis.localStorage?.setItem(VIEW_KEY, mode); } catch { /* private mode: the choice lasts for this screen */ }
}
/** What the current tab and query show of the loaded items; typing and switching tabs answer before the server does. */
export const visibleItems = (state: Pick<Gallery, "items" | "query" | "pinnedOnly">) => {
  const query = state.query.trim().toLowerCase();
  return state.items.filter(item => (!state.pinnedOnly || item.pinned) && (!query || item.title.toLowerCase().includes(query)));
};

/* ───────────────────────────── text helpers ───────────────────────────── */

export const formatLabel = (format: LibraryItem["format"]) => format === "react" ? "React" : format === "svg" ? "SVG" : "HTML";
const DAY = 86_400_000;
const startOfDay = (value: number) => { const d = new Date(value); d.setHours(0, 0, 0, 0); return d.valueOf(); };

const dateLocale = () => uiLocale() === "ko" ? "ko-KR" : "en-US";
export function updatedText(value: string, now = Date.now()) {
  const date = new Date(value);
  if (Number.isNaN(date.valueOf())) return "";
  const diff = now - date.valueOf();
  if (diff < 60_000) return ui("Just now", "방금 전");
  if (diff < 3_600_000) { const n = Math.floor(diff / 60_000); return ui(`${n}m ago`, `${n}분 전`); }
  if (date.valueOf() >= startOfDay(now)) { const n = Math.floor(diff / 3_600_000); return ui(`${n}h ago`, `${n}시간 전`); }
  if (date.valueOf() >= startOfDay(now) - DAY) return ui("Yesterday", "어제");
  if (date.getFullYear() === new Date(now).getFullYear()) return date.toLocaleDateString(dateLocale(), { month: "short", day: "numeric" });
  return date.toLocaleDateString(dateLocale(), { year: "numeric", month: "short", day: "numeric" });
}
export const fullDate = (value: string) => { const date = new Date(value); return Number.isNaN(date.valueOf()) ? "" : date.toLocaleString(dateLocale(), { dateStyle: "long", timeStyle: "short" }); };

/* ───────────────────────────── layout ───────────────────────────── */

/**
 * The reference's odd-snapped grid: proportional gutters, 1 · 2 · 3 columns, and 5 only when five cards can
 * each stay full-sized. The container is clamped to the column tracks so the header edges stay flush with the
 * outer cards; the list keeps a 940px measure.
 */
export function galleryLayout(width: number, view: ViewMode = "grid", aspect = 16 / 9) {
  const gutter = width >= 1200 ? Math.round(Math.min(300, Math.max(132, width * 0.115)))
    : width >= 768 ? Math.round(Math.min(132, Math.max(72, width * 0.105)))
      : width >= 520 ? Math.round(Math.max(44, width * 0.085)) : 28;
  const pad = gutter * 2, avail = Math.max(0, width - pad);
  const five = 5 * 280 + 4 * 28;
  const raw = Math.max(1, Math.floor((avail + 26) / (264 + 26)));
  const cols = avail >= five ? 5 : raw >= 3 ? 3 : raw;
  let track = 320, gap = 26;
  if (cols === 1) track = 460;
  else if (cols === 2) track = 316;
  else if (cols === 3) {
    const buffer = Math.min(1, Math.max(0, (avail - 940) / 560));
    track = Math.round(320 + buffer * 38); gap = Math.round(26 + buffer * 3);
  } else {
    const progress = Math.min(1, Math.max(0, (avail - five) / 860)), damped = Math.pow(progress, 0.85);
    track = Math.round(320 + damped * 48 + (aspect >= 1.95 ? 10 * progress : 0)); gap = Math.round(28 + damped * 2);
  }
  const max = Math.round(Math.min(width, view === "list" ? 940 + pad : cols * track + (cols - 1) * gap + pad));
  return { gutter, gap, cols, wide: width >= 640, max };
}
function useWidth(ref: React.RefObject<HTMLElement | null>) {
  const [state, setState] = useState(() => ({ width: typeof window === "undefined" ? 1024 : Math.max(320, window.innerWidth - 280), aspect: 16 / 9, ready: false }));
  useLayoutEffect(() => {
    const node = ref.current;
    if (!node) return;
    const read = () => {
      const width = node.clientWidth, aspect = window.innerWidth / Math.max(1, window.innerHeight);
      if (width > 0) setState(old => old.ready && Math.abs(old.width - width) < 1 && Math.abs(old.aspect - aspect) < 0.01 ? old : { width, aspect, ready: true });
    };
    read();
    window.addEventListener("resize", read);
    const observer = typeof ResizeObserver === "undefined" ? null : new ResizeObserver(read);
    observer?.observe(node);
    return () => { window.removeEventListener("resize", read); observer?.disconnect(); };
  }, []);
  return state;
}

/* ───────────────────────────── icons ───────────────────────────── */

export const Svg = ({ children, size = 14, width = 1.8 }: { children: ReactNode; size?: number; width?: number }) =>
  <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth={width} strokeLinecap="round" aria-hidden="true" focusable="false">{children}</svg>;
export const Dots = ({ size = 14, r = 1.6 }: { size?: number; r?: number }) =>
  <svg viewBox="0 0 24 24" width={size} height={size} fill="currentColor" aria-hidden="true" focusable="false"><circle cx="5" cy="12" r={r} /><circle cx="12" cy="12" r={r} /><circle cx="19" cy="12" r={r} /></svg>;
export const icons = {
  search: <><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" /></>,
  close: <path d="M18 6 6 18M6 6l12 12" />,
  down: <path d="m6 9 6 6 6-6" />,
};
const gridIcon = <><rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" /><rect x="3" y="14" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" /></>;
const listIcon = <path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01" />;
const refreshIcon = <><path d="M21 12a9 9 0 1 1-2.64-6.36" /><path d="M21 3v6h-6" /></>;

/* ───────────────────────────── items ───────────────────────────── */

type ItemProps = {
  item: LibraryItem; dark: boolean; now: number; menuOpen: boolean;
  onOpen: (item: LibraryItem, from: HTMLElement) => void; onMenu: (item: LibraryItem, anchor: HTMLElement) => void;
};

/** Where the item came from: the workspace, or the conversation state when no workspace is known. */
type SourceLike = { sessionTitle?: string | null; sessionTitleStatus?: "named" | "untitled" | "deleted" | "unavailable" };
/** Generated labels follow the server's status (never the title text, which may be anything the user typed). */
export const sessionLabel = (item: SourceLike) => item.sessionTitleStatus === "untitled" ? ui("Untitled conversation", "이름 없는 대화")
  : item.sessionTitleStatus === "deleted" ? ui("Deleted conversation", "삭제된 대화")
    : item.sessionTitleStatus === "unavailable" ? ui("Source unavailable", "출처 확인 불가")
      : item.sessionTitle || ui("No linked conversation", "연결된 대화 없음");
export const sourceName = (item: Pick<LibraryItem, "workspaceName" | "sessionTitle"> & SourceLike) => item.workspaceName || sessionLabel(item);
export function Dot({ item }: { item: Pick<LibraryItem, "workspaceName"> }) {
  const color = workspaceColor(item.workspaceName);
  return <span className="avl-dot" aria-hidden="true" data-none={color ? undefined : "true"} style={color ? { background: color } : undefined} />;
}
const sourceTitle = (item: LibraryItem) => [item.workspaceName, item.sessionTitle ? sessionLabel(item) : ""].filter(Boolean).join(" · ");
/** Not drawn: the conversation, format and pin for assistive technology (the plate keeps two quiet lines). */
const Spoken = ({ item }: { item: LibraryItem }) => <span className="avl-sr">{`, ${[item.workspaceName ? sessionLabel(item) : "", formatLabel(item.format), item.pinned ? ui("Pinned", "고정됨") : ""].filter(Boolean).join(", ")}`}</span>;

function MenuButton({ item, menuOpen, onMenu, dots }: Pick<ItemProps, "item" | "menuOpen" | "onMenu"> & { dots: ReactNode }) {
  return <button type="button" className="avl-dots" aria-label={ui("Actions menu", "작업 메뉴")} title={ui("Actions menu", "작업 메뉴")} aria-haspopup="menu" aria-expanded={menuOpen} data-open={menuOpen ? "true" : undefined} onClick={event => onMenu(item, event.currentTarget)}>{dots}</button>;
}

function Card({ item, dark, now, menuOpen, onOpen, onMenu }: ItemProps) {
  useUiLocale();
  const describe = `avl-d-${item.artifactId}`;
  return <article role="listitem" className="avl-card" aria-label={ui(`Open ${item.title}`, `${item.title} 열기`)} data-artifact-id={item.artifactId} data-pinned={item.pinned ? "true" : undefined}>
    <button type="button" className="avl-open" aria-label={ui(`Open ${item.title}`, `${item.title} 열기`)} aria-describedby={describe} onClick={event => onOpen(item, event.currentTarget)}>
      <span className="avl-plate"><Cover item={item} dark={dark} /></span>
      <span className="avl-copy">
        <span className="avl-name" title={item.title}>{item.title}</span>
        <span className="avl-meta" id={describe} title={sourceTitle(item)}>
          <Dot item={item} /><span className="avl-ws">{sourceName(item)}</span><span aria-hidden="true">·</span>
          <span className="avl-ver">v{item.headVersion}</span><span aria-hidden="true">·</span>
          <time className="avl-time" dateTime={item.updatedAt} title={fullDate(item.updatedAt)}>{updatedText(item.updatedAt, now)}</time><Spoken item={item} />
        </span>
      </span>
    </button>
    <MenuButton item={item} menuOpen={menuOpen} onMenu={onMenu} dots={<Dots />} />
  </article>;
}

function Row({ item, dark, now, menuOpen, onOpen, onMenu }: ItemProps) {
  useUiLocale();
  const describe = `avl-d-${item.artifactId}`;
  return <div role="listitem" className="avl-row" aria-label={ui(`Open ${item.title}`, `${item.title} 열기`)} data-artifact-id={item.artifactId} data-pinned={item.pinned ? "true" : undefined}>
    <button type="button" className="avl-open" aria-label={ui(`Open ${item.title}`, `${item.title} 열기`)} aria-describedby={describe} onClick={event => onOpen(item, event.currentTarget)}>
      <span className="avl-mini"><Cover item={item} dark={dark} size="mini" /></span>
      <span className="avl-name" title={item.title}>{item.title}</span>
      <span className="avl-row-meta" id={describe}>
        <span className="avl-row-ws" title={sourceTitle(item)}><Dot item={item} /><span className="avl-ws">{sourceName(item)}</span></span>
        <span className="avl-row-ver">v{item.headVersion}</span>
        <time className="avl-row-time" dateTime={item.updatedAt} title={fullDate(item.updatedAt)}>{updatedText(item.updatedAt, now)}</time><Spoken item={item} />
      </span>
    </button>
    <MenuButton item={item} menuOpen={menuOpen} onMenu={onMenu} dots={<Dots r={1.5} />} />
  </div>;
}

function Skeleton({ view, count }: { view: ViewMode; count: number }) {
  return <div className={view === "grid" ? "avl-grid" : "avl-rows"} aria-hidden="true">
    {Array.from({ length: count }, (_, i) => view === "grid"
      ? <span key={i} className="avl-card"><span className="avl-plate" /><span className="avl-copy"><span className="avl-bar" style={{ width: `${46 + (i * 17) % 30}%` }} /><span className="avl-bar" style={{ width: `${30 + (i * 23) % 22}%` }} /></span></span>
      : <span key={i} className="avl-row"><span className="avl-mini" /><span className="avl-bar" style={{ width: `${30 + (i * 17) % 26}%` }} /></span>)}
  </div>;
}

/* ───────────────────────────── view ───────────────────────────── */

export function GalleryView({ state, view, dark, inert, refreshing, menuId, onView, onQuery, onScope, onMore, onRefresh, onRetry, onOpen, onMenu, scrollRef, searchRef, hidden }: {
  state: Gallery; view: ViewMode; dark: boolean; inert: boolean; refreshing: boolean; menuId: string | null;
  onView: (view: ViewMode) => void; onQuery: (query: string) => void; onScope: (pinnedOnly: boolean) => void;
  onMore: () => void; onRefresh: () => void; onRetry: () => void; onOpen: ItemProps["onOpen"]; onMenu: ItemProps["onMenu"];
  scrollRef: React.RefObject<HTMLDivElement | null>; searchRef: React.RefObject<HTMLInputElement | null>; hidden: boolean;
}) {
  useUiLocale();
  const rootRef = useRef<HTMLElement>(null), sentinel = useRef<HTMLDivElement>(null);
  const { width, aspect, ready } = useWidth(scrollRef);
  const layout = galleryLayout(width, view, aspect);
  // The focus sheet covers the gallery; it stays mounted and laid out, just not reachable by keyboard.
  useLayoutEffect(() => { if (rootRef.current) rootRef.current.inert = inert; }, [inert]);
  // Infinite scroll, with the button below as the fallback.
  useEffect(() => {
    const node = sentinel.current, root = scrollRef.current;
    if (hidden || !node || !root || typeof IntersectionObserver === "undefined" || state.nextOffset === null) return;
    const observer = new IntersectionObserver(entries => { if (entries.some(entry => entry.isIntersecting)) onMore(); }, { root, rootMargin: "400px" });
    observer.observe(node);
    return () => observer.disconnect();
  }, [hidden, state.nextOffset, state.items.length, onMore]);
  // Relative dates follow the clock while the screen stays open.
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => { const timer = setInterval(() => setNow(Date.now()), 60_000); return () => clearInterval(timer); }, []);
  useEffect(() => { if (!hidden) setNow(Date.now()); }, [hidden, state.items]);
  // The icon turns in whole 0.55s turns: once per press, then on for as long as the reload really takes.
  const [turning, setTurning] = useState(0), busyRef = useRef(refreshing); busyRef.current = refreshing;
  const spin = () => { setTurning(value => value + 1); onRefresh(); };

  const busy = state.status === "loading", items = visibleItems(state);
  const render = (list: LibraryItem[], label: string) => {
    const Item = view === "grid" ? Card : Row;
    return <div className={view === "grid" ? "avl-grid" : "avl-rows"} role="list" aria-label={label}>
      {list.map(item => <Item key={item.artifactId} item={item} dark={dark} now={now} menuOpen={menuId === item.artifactId} onOpen={onOpen} onMenu={onMenu} />)}
    </div>;
  };
  const pinned = state.pinnedOnly ? [] : items.filter(item => item.pinned), rest = state.pinnedOnly ? items : items.filter(item => !item.pinned);
  const style = { "--avl-gutter": `${layout.gutter}px`, "--avl-cols": layout.cols, "--avl-gap": `${layout.gap}px`, "--avl-max": `${layout.max}px` } as React.CSSProperties;

  let body: ReactNode;
  if (state.status === "error" && !items.length) body = <div className="avl-empty" role="alert">
    <p className="avl-empty-title">{ui("Couldn't load the list.", "목록을 불러오지 못했어요.")}</p>{state.error && <p className="avl-empty-hint">{state.error}</p>}
    <button type="button" className="avl-link" onClick={onRetry}>{ui("Try again", "다시 시도")}</button>
  </div>;
  else if (!items.length && !state.loaded) body = <div role="status"><span className="avl-sr">{ui("Loading…", "불러오는 중…")}</span><Skeleton view={view} count={view === "grid" ? layout.cols * 2 : 6} /></div>;
  else if (!items.length && busy) body = <div className="avl-empty" role="status"><span className="avl-sr">{ui("Loading…", "불러오는 중…")}</span></div>;
  else if (!items.length) body = <div className="avl-empty" role="status">
    <p className="avl-empty-title">{!state.query && state.pinnedOnly ? ui("No pinned artifacts.", "고정한 아티팩트가 없어요.") : ui("No artifacts to show", "표시할 아티팩트가 없습니다")}</p>
    {state.query ? <><p className="avl-empty-hint">{ui(`No artifacts match “${state.query}”. Check your search.`, `‘${state.query}’와 맞는 아티팩트가 없어요. 검색어를 확인해 주세요.`)}</p><button type="button" className="avl-link" onClick={() => { onQuery(""); if (state.pinnedOnly) onScope(false); searchRef.current?.focus(); }}>{ui("Show all artifacts", "전체 아티팩트 보기")}</button></>
      : state.pinnedOnly ? <><p className="avl-empty-hint">{ui("Choose “Pin to top” in a card’s ⋯ menu and it will appear here.", "카드의 ⋯ 메뉴에서 ‘상단에 고정’을 누르면 여기에 모여요.")}</p><button type="button" className="avl-link" onClick={() => onScope(false)}>{ui("Show all artifacts", "전체 아티팩트 보기")}</button></>
        : <p className="avl-empty-hint">{uiLocale() === "ko" ? <>아직 아티팩트가 없어요. 대화에서 <code>/artifact</code>로 결과물을 요청해 보세요.</> : <>No artifacts yet. Ask for one in a conversation with <code>/artifact</code>.</>}</p>}
  </div>;
  else body = <>
    {pinned.length > 0 && <section className="avl-pinned" aria-label={ui("Pinned", "고정됨")}>
      <div className="avl-label" aria-hidden="true">{ui("Pinned", "고정됨")}</div>
      {render(pinned, ui("Pinned artifacts", "고정된 아티팩트"))}
      {rest.length > 0 && <div className="avl-divider" />}
    </section>}
    {rest.length > 0 && <section aria-label={state.pinnedOnly ? ui("Pinned", "고정됨") : pinned.length ? ui("Recent", "최근") : ui("All", "전체")}>
      {pinned.length > 0 && <div className="avl-label" aria-hidden="true">{ui("Recent", "최근")}</div>}
      {render(rest, state.pinnedOnly ? ui("Pinned artifacts", "고정된 아티팩트") : ui("Artifact list", "아티팩트 목록"))}
    </section>}
    <div ref={sentinel} className="avl-foot">
      {state.status === "error" ? <><span role="alert">{ui("Couldn't load more.", "더 불러오지 못했어요.")}</span><button type="button" className="avl-link" onClick={onMore}>{ui("Try again", "다시 시도")}</button></>
        : state.status === "more" ? <span role="status">{ui("Loading more…", "더 불러오는 중…")}</span>
          : state.nextOffset !== null && !busy ? <button type="button" className="avl-link" onClick={onMore}>{ui("Show more", "더 보기")}</button> : null}
    </div>
  </>;

  return <section ref={rootRef} className="avl-gallery" aria-label={ui("Artifact gallery", "아티팩트 갤러리")} hidden={hidden} data-view={view} data-cols={layout.cols} data-wide={layout.wide ? "true" : "false"} data-ready={ready ? "true" : "false"}
    style={hidden ? { ...style, display: "none" } : style}>
    <div ref={scrollRef} className="avl-scroll" tabIndex={-1} aria-busy={busy || refreshing}>
      <div className="avl-container">
        <header className="avl-head">
          <div className="avl-title">
            <h1>{ui("Artifacts", "아티팩트")}</h1>
            <div className="avl-scope" role="group" aria-label={ui("Scope", "표시 범위")}>
              <button type="button" aria-pressed={!state.pinnedOnly} onClick={() => { if (state.pinnedOnly) onScope(false); }}>{ui("All", "전체")}</button>
              <button type="button" aria-pressed={state.pinnedOnly} onClick={() => { if (!state.pinnedOnly) onScope(true); }}>{ui("Pinned", "고정됨")}</button>
            </div>
          </div>
          <div className="avl-tools">
            <div className="avl-search">
              <Svg>{icons.search}</Svg>
              <input ref={searchRef} type="search" value={state.query} placeholder={ui("Search titles", "제목 검색")} aria-label={ui("Search artifacts", "아티팩트 검색")} aria-keyshortcuts="/" autoComplete="off" spellCheck={false} onChange={event => onQuery(event.target.value)} />
              {state.query && <button type="button" className="avl-clear" aria-label={ui("Clear search", "검색어 지우기")} onClick={() => { onQuery(""); searchRef.current?.focus(); }}><Svg size={12} width={2}>{icons.close}</Svg></button>}
            </div>
            <div className="avl-views" role="group" aria-label={ui("View mode", "보기 방식")}>
              <button type="button" className="avl-tool" aria-pressed={view === "grid"} aria-label={ui("Gallery view", "갤러리 보기")} title={ui("Gallery view", "갤러리 보기")} onClick={() => onView("grid")}><Svg>{gridIcon}</Svg></button>
              <button type="button" className="avl-tool" aria-pressed={view === "list"} aria-label={ui("List view", "목록 보기")} title={ui("List view", "목록 보기")} onClick={() => onView("list")}><Svg>{listIcon}</Svg></button>
            </div>
            <button type="button" className="avl-tool avl-refresh" aria-label={ui("Refresh", "새로고침")} title={ui("Refresh", "새로고침")} aria-busy={refreshing} onClick={spin}>
              <span key={turning} className="avl-turn" data-turn={turning ? "true" : undefined} data-busy={refreshing ? "true" : undefined}
                onAnimationIteration={event => { if (!busyRef.current) event.currentTarget.removeAttribute("data-turn"); }}><Svg>{refreshIcon}</Svg></span>
            </button>
          </div>
        </header>
        {body}
      </div>
    </div>
  </section>;
}

/* ───────────────────────────── styles ───────────────────────────── */

/** The reference's tokens. Light values are its own; dark keeps the same roles on the host surface. */
export const galleryStyles = `
${monoFontFace}
.avl-root{--avl-bg:var(--avl-surface,#fff);--avl-ink:#141414;--avl-muted:#737373;--avl-faint:#A3A3A3;--avl-border:#EAEAEA;--avl-subtle:#F2F2F2;--avl-side:rgba(247,247,247,.7);--avl-side-solid:#F7F7F7;--avl-hover:#EFEFEF;--avl-focus:#A3A3A3;--avl-ring:rgba(0,0,0,.06);--avl-ring-hover:rgba(0,0,0,.12);--avl-lift:0 10px 26px -14px rgba(0,0,0,.14);--avl-stage:#FAFAFA;--avl-pop:#fff;--avl-num:#D4D4D4;--avl-code:#262626;--avl-red:#DC2626;--avl-red-bg:#FEF2F2;--avl-dots:rgba(255,255,255,.9);--avl-dots-hover:#fff;--avl-mono:"Paseo Artifact Mono","JetBrains Mono",ui-monospace,SFMono-Regular,Menlo,monospace;--avl-ease:cubic-bezier(.22,1,.36,1);--avl-std:cubic-bezier(.4,0,.2,1)}
.avl-root[data-dark=true]{--avl-ink:#EDEDED;--avl-muted:#A3A3A3;--avl-faint:#7D7D7D;--avl-border:rgba(255,255,255,.1);--avl-subtle:rgba(255,255,255,.08);--avl-side:rgba(255,255,255,.045);--avl-side-solid:rgba(255,255,255,.045);--avl-hover:rgba(255,255,255,.09);--avl-focus:rgba(255,255,255,.36);--avl-ring:rgba(255,255,255,.07);--avl-ring-hover:rgba(255,255,255,.16);--avl-lift:0 12px 28px -14px rgba(0,0,0,.7);--avl-stage:color-mix(in srgb,var(--avl-bg) 88%,#000);--avl-pop:color-mix(in srgb,var(--avl-bg) 92%,#fff);--avl-num:#5C5C5C;--avl-code:#E5E5E5;--avl-red:#F87171;--avl-red-bg:rgba(248,113,113,.12);--avl-dots:rgba(32,32,32,.86);--avl-dots-hover:#202020}
.avl-sr{position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0 0 0 0);white-space:nowrap;border:0}
.avl-gallery{flex:1;min-height:0;display:flex;flex-direction:column;position:relative;background:var(--avl-bg);color:var(--avl-ink);user-select:none;-webkit-user-select:none}
.avl-gallery button,.avl-gallery input{font:inherit;letter-spacing:inherit;color:inherit;margin:0}
.avl-scroll{flex:1;min-height:0;overflow-x:hidden;overflow-y:auto;outline:none}
.avl-scroll::-webkit-scrollbar,.avl-code-scroll::-webkit-scrollbar,.avl-versions::-webkit-scrollbar{width:6px;height:6px}
.avl-scroll::-webkit-scrollbar-track,.avl-code-scroll::-webkit-scrollbar-track,.avl-versions::-webkit-scrollbar-track{background:transparent}
.avl-scroll::-webkit-scrollbar-thumb,.avl-code-scroll::-webkit-scrollbar-thumb,.avl-versions::-webkit-scrollbar-thumb{background:color-mix(in srgb,var(--avl-ink) 12%,transparent);border-radius:9999px}
.avl-scroll::-webkit-scrollbar-thumb:hover,.avl-code-scroll::-webkit-scrollbar-thumb:hover{background:color-mix(in srgb,var(--avl-ink) 22%,transparent)}
.avl-container{width:100%;max-width:var(--avl-max);margin:0 auto;padding:40px var(--avl-gutter) 96px}
.avl-gallery[data-ready=true] .avl-container{transition:max-width .2s var(--avl-std),padding .2s var(--avl-std)}
.avl-head{display:flex;flex-direction:column;justify-content:space-between;gap:16px;margin:0 0 36px}
.avl-gallery[data-wide=true] .avl-head{flex-direction:row;align-items:center}
.avl-title{display:flex;align-items:baseline;gap:12px;min-width:0}
.avl-title h1{margin:0;font-size:20px;line-height:30px;font-weight:600;letter-spacing:-.025em;color:var(--avl-ink);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.avl-scope{display:flex;align-items:center;gap:12px;margin-left:8px;font-size:13px;line-height:19.5px;white-space:nowrap}
.avl-scope button{position:relative;padding:0;border:0;background:transparent;color:var(--avl-faint);cursor:pointer;transition:color .15s var(--avl-std)}
.avl-scope button::after{content:"";position:absolute;inset:-7px -6px}
.avl-scope button:hover{color:var(--avl-ink)}
.avl-scope button[aria-pressed=true]{color:var(--avl-ink);font-weight:500}
.avl-tools{display:flex;align-items:center;gap:8px;min-width:0}
.avl-search{position:relative;flex:1 1 0;min-width:0;color:var(--avl-faint)}
.avl-gallery[data-wide=true] .avl-search{flex:0 0 230px}
.avl-search>svg{position:absolute;left:12px;top:50%;transform:translateY(-50%);pointer-events:none}
.avl-gallery .avl-search input{display:block;width:100%;height:32px;padding:0 28px 0 32px;border:1px solid var(--avl-border);border-radius:9999px;outline:none;background:transparent;font-size:12.5px;line-height:18.75px;color:var(--avl-ink);appearance:none;-webkit-appearance:none;transition:color .15s var(--avl-std),background-color .15s var(--avl-std),border-color .15s var(--avl-std);user-select:text;-webkit-user-select:text}
.avl-gallery .avl-search input:hover{background:var(--avl-side)}
.avl-gallery .avl-search input:focus{background:var(--avl-bg);border-color:var(--avl-focus)}
.avl-search input::placeholder{color:var(--avl-faint);opacity:1}
.avl-search input::-webkit-search-cancel-button,.avl-search input::-webkit-search-decoration{-webkit-appearance:none;appearance:none}
.avl-gallery .avl-clear{position:absolute;right:6px;top:50%;transform:translateY(-50%);display:grid;place-items:center;width:20px;height:20px;padding:0;border:0;border-radius:9999px;background:transparent;color:var(--avl-faint);cursor:pointer}
.avl-gallery .avl-clear:hover{color:var(--avl-ink)}
.avl-views{display:flex;align-items:center}
.avl-gallery .avl-tool{display:flex;align-items:center;justify-content:center;flex:none;width:32px;height:32px;padding:0;border:0;border-radius:8px;background:transparent;color:var(--avl-faint);cursor:pointer;transition:color .15s var(--avl-std),background-color .15s var(--avl-std)}
.avl-gallery .avl-tool:hover{color:var(--avl-ink)}
.avl-gallery .avl-refresh:hover,.avl-gallery .avl-tool[aria-pressed=true]{color:var(--avl-ink);background:var(--avl-subtle)}
.avl-turn{display:flex}
.avl-turn[data-turn=true]{animation:avl-spin .55s var(--avl-ease) infinite}
.avl-root button:focus-visible{outline:2px solid var(--av-accent);outline-offset:2px}
.avl-pinned{margin:0 0 44px}
.avl-label{margin:0 0 16px;font-size:11.5px;line-height:17.25px;font-weight:500;letter-spacing:.025em;color:var(--avl-faint)}
.avl-divider{margin-top:44px;border-top:1px solid var(--avl-border)}
.avl-grid{display:grid;grid-template-columns:repeat(var(--avl-cols,3),minmax(0,1fr));column-gap:var(--avl-gap,28px);row-gap:36px}
.avl-card{position:relative;display:block;min-width:0}
.avl-gallery .avl-open{border:0;background:transparent;text-align:start;cursor:pointer}
.avl-card>.avl-open{display:block;width:100%;padding:0;border-radius:10px}
.avl-plate{position:relative;display:block;width:100%;aspect-ratio:16/10;border-radius:10px;overflow:hidden;background:var(--avl-side-solid);transition:transform 240ms var(--avl-ease),box-shadow 240ms var(--avl-ease)}
.avl-plate:has([data-kind=thumbnail])::after,.avl-root[data-dark=true] .avl-plate::after{content:"";position:absolute;inset:0;border-radius:inherit;box-shadow:inset 0 0 0 1px var(--avl-ring);pointer-events:none;transition:box-shadow 240ms var(--avl-ease)}
.avl-card:hover .avl-plate,.avl-card:has([data-open=true]) .avl-plate{box-shadow:var(--avl-lift)}
.avl-card:hover .avl-plate::after,.avl-card:has([data-open=true]) .avl-plate::after{box-shadow:inset 0 0 0 1px var(--avl-ring-hover)}
.avl-root .avl-card>.avl-open:focus-visible{outline:none}
.avl-card>.avl-open:focus-visible .avl-plate{box-shadow:0 0 0 2px var(--avl-bg),0 0 0 4px var(--av-accent)}
.avl-cover{position:absolute;inset:0;display:block}
.avl-cover>svg{display:block;width:100%;height:100%}
.avl-cover img{display:block;width:100%;height:100%;object-fit:cover;object-position:top center}
.avl-cover[data-format=svg] img{object-fit:contain}
.avl-copy{display:block;margin-top:12px;padding:0 2px}
.avl-name{font-size:13.5px;font-weight:500;line-height:1.4;letter-spacing:-.01em;color:var(--avl-ink)}
.avl-copy .avl-name{display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;overflow-wrap:anywhere}
.avl-meta{position:relative;display:flex;align-items:center;gap:6px;margin-top:4px;font-size:12px;line-height:18px;font-weight:400;color:var(--avl-faint)}
.avl-meta>*{flex:none}
.avl-ws{min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;color:var(--avl-muted)}
.avl-meta>.avl-ws{flex:0 1 auto}
.avl-dot{flex:none;width:6px;height:6px;border-radius:9999px}
.avl-dot[data-none=true]{box-shadow:inset 0 0 0 1.2px var(--avl-faint)}
.avl-ver{font-family:var(--avl-mono);font-size:11px;font-variant-numeric:tabular-nums}
.avl-time{font-variant-numeric:tabular-nums;white-space:nowrap}
.avl-gallery .avl-dots{display:flex;align-items:center;justify-content:center;width:28px;height:28px;padding:0;cursor:pointer;opacity:0;transition:opacity .15s var(--avl-std),color .15s var(--avl-std),background-color .15s var(--avl-std)}
.avl-card:hover .avl-dots,.avl-row:hover .avl-dots,.avl-card:has(:focus-visible) .avl-dots,.avl-row:has(:focus-visible) .avl-dots,.avl-dots[data-open=true]{opacity:1!important}
@media (hover:none){.avl-gallery .avl-dots{opacity:1}}
.avl-card>.avl-dots{position:absolute;top:10px;right:10px;border:1px solid color-mix(in srgb,var(--avl-ink) 8%,transparent);border-radius:8px;background:var(--avl-dots);color:var(--avl-muted)}
.avl-gallery .avl-card>.avl-dots{color:var(--avl-muted)}
.avl-gallery .avl-card>.avl-dots:hover,.avl-gallery .avl-card>.avl-dots[data-open=true]{background:var(--avl-dots-hover);color:var(--avl-ink)}
.avl-rows{border-top:1px solid var(--avl-border)}
.avl-row{position:relative;display:flex;align-items:center;gap:16px;padding:12px 8px;margin:0 -8px;border-radius:8px;transition:background-color .15s var(--avl-std)}
.avl-row+.avl-row{border-top:1px solid var(--avl-border)}
.avl-row:hover,.avl-row:has([data-open=true]){background:var(--avl-side)}
.avl-row>.avl-open{flex:1;min-width:0;display:flex;align-items:center;gap:16px;padding:0}
.avl-row>.avl-open::after{content:"";position:absolute;inset:0;border-radius:8px}
.avl-root .avl-row>.avl-open:focus-visible{outline:none}
.avl-row>.avl-open:focus-visible::after{outline:2px solid var(--av-accent);outline-offset:-2px}
.avl-mini{position:relative;flex:none;display:block;width:44px;height:28px;border-radius:5px;overflow:hidden;background:var(--avl-side-solid)}
.avl-mini::after{content:"";position:absolute;inset:0;border-radius:inherit;box-shadow:inset 0 0 0 1px var(--avl-ring)}
.avl-row .avl-name{flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.avl-row-meta{position:relative;flex:none;display:flex;align-items:center;gap:16px;font-size:12px;line-height:18px;font-weight:400;color:var(--avl-faint)}
.avl-row-ws{display:flex;align-items:center;gap:6px;width:176px;min-width:0}
.avl-gallery[data-wide=false] .avl-row-ws{display:none}
.avl-row-ver{width:32px;text-align:right;font-family:var(--avl-mono);font-size:11.5px;font-variant-numeric:tabular-nums}
.avl-row-time{min-width:64px;text-align:right;white-space:nowrap;font-variant-numeric:tabular-nums}
.avl-gallery .avl-row>.avl-dots{position:relative;z-index:1;flex:none;border:0;border-radius:6px;background:transparent;color:var(--avl-faint)}
.avl-gallery .avl-row>.avl-dots:hover,.avl-gallery .avl-row>.avl-dots[data-open=true]{color:var(--avl-ink);background:var(--avl-hover)}
.avl-bar{display:block;height:9px;margin-top:7px;border-radius:5px;background:var(--avl-subtle)}
.avl-foot{display:flex;justify-content:center;align-items:center;gap:12px;padding-top:36px;color:var(--avl-faint);font-size:12.5px}
.avl-foot:empty{padding:0}
.avl-gallery .avl-link,.avl-sheet .avl-link{padding:0;border:0;background:transparent;font-size:12.5px;color:var(--avl-ink);text-decoration:underline;text-decoration-color:#D4D4D4;text-underline-offset:4px;cursor:pointer;transition:text-decoration-color .15s var(--avl-std)}
.avl-gallery .avl-link:hover,.avl-sheet .avl-link:hover{text-decoration-color:currentColor}
.avl-gallery .avl-empty{margin:0;padding:112px 0;max-width:none;text-align:center;display:block}
.avl-gallery .avl-empty-title{margin:0 0 6px;font-size:14px;line-height:21px;font-weight:500;color:var(--avl-ink)}
.avl-gallery .avl-empty-hint{margin:0 0 20px;font-size:12.5px;line-height:18.75px;color:var(--avl-faint)}
@keyframes avl-spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}
@media (prefers-reduced-motion:reduce){.avl-root *,.avl-root *::after,.avl-root *::before{animation:none!important;transition:none!important}.avl-turn[data-busy=true]{opacity:.35}}
@media (forced-colors:active){.avl-plate::after,.avl-mini::after{box-shadow:none;border:1px solid CanvasText}.avl-scope button[aria-pressed=true],.avl-gallery .avl-tool[aria-pressed=true]{outline:1px solid CanvasText}}
`;
