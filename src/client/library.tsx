import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";
import { Text } from "react-native";
import { SidebarRow } from "@getpaseo/plugin/client/ui";
import type { PluginClientContext, PluginScreenProps, PluginSidebarItemProps } from "@getpaseo/plugin/client";
import { artifactLibraryGet, artifactLibraryList, type LibraryItem } from "../shared/library";
import { artifactManage, artifactRestoreVersion, type ArtifactAction } from "../shared/contracts";
import type { StoreRegistry } from "./store";
import { arrived, returnToOrigin } from "./origin";
import type { ShownVersion, WorkbenchApi } from "./workbench";
import { workbenchStyles, workbenchVariables } from "./chrome";
import { exportArtifact } from "./viewer-actions";
import { GalleryView, emptyGallery, galleryStyles, readViewMode, storeViewMode, type Gallery, type ViewMode } from "./library-gallery";
import { ActionMenu, FocusSheet, Toasts, sheetStyles, useToast, type MenuEntry, type OpenMenu, type SheetActions } from "./library-sheet";
import { LibraryDetail, SessionDetail } from "./library-detail";
import { LIBRARY_SCREEN_ID, detailFromParams, listBelow, makeSheet, renameSheetEntry, replaceWithList, type Detail, type LibraryNav, type Sheet } from "./library-route";
import { acknowledge, type Explorers, type SidebarRequests } from "./sidebar";
import type { ShownExplorers } from "./card-open";
import { ui, useUiLocale } from "./ui-locale";

export { LIBRARY_SCREEN_ID, createLibraryNav, chatDetailParams, requestDetailParams, libraryScreenTitle, type LibraryNav } from "./library-route";

/**
 * Host-wide artifact library: one plugin screen in the main area.
 * - The left "아티팩트" menu always opens the gallery (list view).
 * - A gallery card opens a full-surface detail over the same, still-mounted gallery. X and Escape
 *   close it instantly: query, loaded pages and scroll position never moved.
 * - A chat card or an explicit artifact_open opens the screen with params; X there returns to the
 *   conversation the user was viewing (`returnAgent`), never to a guessed artifact owner.
 * Route parsing and history entries live in `library-route.ts`, the detail surfaces in `library-detail.tsx`.
 */

/* ───────────────────────────── left menu ───────────────────────────── */

export function createLibraryMenu(nav: LibraryNav) {
  return function LibraryMenu({ currentScreen, openScreen }: PluginSidebarItemProps) {
    useUiLocale();
    return <SidebarRow icon="LayoutGrid" label={ui("Artifacts", "아티팩트")} active={currentScreen?.screenId === LIBRARY_SCREEN_ID}
      onPress={() => nav.open(openScreen)} />;
  };
}

/* ───────────────────────────── gallery ───────────────────────────── */

const PAGE = 40;
/** Same rule as the workbench palette: a dark host surface selects the dark covers and tokens. */
function isDark(theme: PluginScreenProps["theme"]) {
  const hex = /^#([\da-f]{6}|[\da-f]{3})$/i.exec(theme?.colors.surface0 ?? "")?.[1];
  const full = hex?.length === 3 ? [...hex].map(char => char + char).join("") : hex;
  return full ? [0, 2, 4].reduce((sum, at) => sum + parseInt(full.slice(at, at + 2), 16), 0) < 384 : false;
}
/** 전체 asks for pinned items first (recent within each group), so one paged request fills both of its sections. */
const listInput = (query: string, offset: number, limit: number, pinnedOnly: boolean) => ({ query: query.trim(), offset, limit, ...(pinnedOnly ? { pinnedOnly: true } : { pinnedFirst: true }) });
/** The server's order, for changes shown before it answers. */
const inOrder = (items: readonly LibraryItem[]) => [...items].sort((a, b) => Number(!!b.pinned) - Number(!!a.pinned) || (a.updatedAt < b.updatedAt ? 1 : a.updatedAt > b.updatedAt ? -1 : a.artifactId < b.artifactId ? 1 : -1));
const reasonText = (reason: unknown) => reason instanceof Error ? reason.message : String(reason);

/* ───────────────────────────── screen ───────────────────────────── */

export function createLibraryScreen(deps: { client: PluginClientContext; registry: StoreRegistry; nav: LibraryNav; requests?: SidebarRequests; shown?: ShownExplorers; explorers?: Explorers }) {
  const { client, registry, nav, requests, shown: shownExplorers, explorers } = deps;
  return function LibraryScreen({ params, theme, layout, host, navigation }: PluginScreenProps) {
    useUiLocale();
    const paramsKey = `${params.view ?? ""}|${params.nonce ?? ""}|${params.artifactId ?? ""}|${params.version ?? ""}|${params.sessionId ?? ""}`;
    const [detail, setDetail] = useState<Detail | null>(() => detailFromParams(params));
    const [gallery, setGallery] = useState<Gallery>(emptyGallery);
    const [sheet, setSheet] = useState<Sheet | null>(null), [menu, setMenu] = useState<OpenMenu | null>(null);
    const { toast, show, clear } = useToast();
    const rootRef = useRef<HTMLDivElement>(null), scrollRef = useRef<HTMLDivElement>(null), searchRef = useRef<HTMLInputElement>(null);
    const sequence = useRef(0), galleryRef = useRef(gallery); galleryRef.current = gallery;
    const sheetRef = useRef(sheet); sheetRef.current = sheet;

    const fetchPage = useCallback(async (query: string, offset: number, pinnedOnly: boolean) => {
      const id = ++sequence.current;
      // Loaded items stay while the server answers; the view filters them to the new query and tab meanwhile.
      setGallery(old => ({ ...old, query, pinnedOnly, status: offset ? "more" : "loading", error: undefined }));
      try {
        const page = await client.rpc(artifactLibraryList, listInput(query, offset, PAGE, pinnedOnly));
        if (id !== sequence.current) return;
        setGallery(old => {
          // Same artifact ID once (newest page wins); same title with another ID stays a separate tile.
          const merged = offset ? [...old.items.filter(item => !page.items.some(next => next.artifactId === item.artifactId)), ...page.items] : page.items;
          return { ...old, items: merged, nextOffset: page.nextOffset, status: "idle", loaded: true };
        });
      } catch (reason) {
        if (id !== sequence.current) return;
        setGallery(old => ({ ...old, ...(offset ? {} : { items: [], nextOffset: null }), status: "error", loaded: true, error: reasonText(reason) }));
      }
    }, []);
    const toTop = () => { if (scrollRef.current) scrollRef.current.scrollTop = 0; };
    // Typing: the loaded items answer at once; the whole library follows after a short pause.
    const debounce = useRef<ReturnType<typeof setTimeout>>(undefined);
    const onQuery = useCallback((query: string) => {
      sequence.current++; // an answer for the previous query no longer applies
      setGallery(old => ({ ...old, query, status: "loading", error: undefined }));
      clearTimeout(debounce.current);
      debounce.current = setTimeout(() => { toTop(); void fetchPage(query, 0, galleryRef.current.pinnedOnly); }, 180);
    }, [fetchPage]);
    useEffect(() => () => clearTimeout(debounce.current), []);
    // 전체 / 고정됨: the list restarts from the top with the same query.
    const onScope = useCallback((pinnedOnly: boolean) => {
      clearTimeout(debounce.current); toTop();
      void fetchPage(galleryRef.current.query, 0, pinnedOnly);
    }, [fetchPage]);
    const [view, setView] = useState<ViewMode>(readViewMode);
    const onView = useCallback((next: ViewMode) => { setView(next); storeViewMode(next); }, []);
    const onMore = useCallback(() => {
      const current = galleryRef.current;
      if (current.nextOffset === null || current.status === "loading" || current.status === "more") return;
      void fetchPage(current.query, current.nextOffset, current.pinnedOnly);
    }, [fetchPage]);
    const onRetry = useCallback(() => { const current = galleryRef.current; void fetchPage(current.query, 0, current.pinnedOnly); }, [fetchPage]);
    /** Fresh gallery: the left menu, or the first time the list is shown. */
    const fresh = useCallback(() => {
      clearTimeout(debounce.current); toTop(); setSheet(null); setMenu(null);
      void fetchPage("", 0, false);
    }, [fetchPage]);

    // New screen params (chat card / explicit open, or the menu's empty params) decide the view.
    // The focus sheet is a real history entry (`view: "sheet"` + artifact ID, pushed by the host router): back,
    // forward and reload follow the params, and the gallery behind it (query, pages, scroll) is never reset.
    const firstParams = useRef(true), lastView = useRef<string | undefined>(undefined), pushed = useRef(false), backing = useRef(false), resolveRun = useRef(0);
    useEffect(() => {
      const next = detailFromParams(params), first = firstParams.current, wasSheet = lastView.current === "sheet", run = ++resolveRun.current;
      firstParams.current = false; lastView.current = params.view; backing.current = false;
      if (next?.nonce) arrived(next.nonce);
      setDetail(next);
      if (next) { setSheet(null); setMenu(null); return; }
      if (first || (params.view !== "sheet" && !wasSheet)) fresh();
      const id = params.view === "sheet" ? params.artifactId : undefined;
      if (!id) { pushed.current = false; setSheet(null); setMenu(null); if (wasSheet && stale.current) reconcile(); return; }
      if (sheetRef.current?.artifactId === id) return;
      const known = galleryRef.current.items.find(item => item.artifactId === id);
      if (known) { setSheet(makeSheet(known)); return; }
      // Reload / forward onto an entry whose card is not loaded: the stored artifact decides (gone → no sheet).
      setSheet(null);
      void client.rpc(artifactLibraryGet, { artifactId: id }).then(found => {
        if (run !== resolveRun.current) return;
        if (!found) { show(ui("This artifact was deleted or can’t be found", "삭제됐거나 찾을 수 없는 아티팩트예요")); return; }
        const { key: _key, ...rest } = found.artifact;
        setSheet(makeSheet({ ...rest, sessionTitle: "", workspaceName: null, thumbnail: null }));
      }, reason => { if (run === resolveRun.current) show(ui(`Couldn’t open the artifact. ${reasonText(reason)}`, `아티팩트를 열지 못했습니다. ${reasonText(reason)}`)); });
    }, [paramsKey]);
    useEffect(() => () => { resolveRun.current++; }, []); // a late answer never lands after unmount
    // Menu press while this screen is already open (same empty params): back to a fresh list.
    const menuRevision = useSyncExternalStore(nav.subscribe, nav.snapshot, nav.snapshot), seenMenu = useRef(menuRevision);
    useEffect(() => {
      if (seenMenu.current === menuRevision) return;
      seenMenu.current = menuRevision;
      if (detailFromParams(params)) return; // the params effect handles a detail → list change
      setDetail(null); fresh();
    }, [menuRevision]);
    // A chat-opened detail shows no gallery yet; load it lazily the first time the list appears.
    useEffect(() => { if (!detail && !gallery.loaded && gallery.status === "idle") void fetchPage(gallery.query, 0, gallery.pinnedOnly); }, [detail]);

    // Reload the same query and the same number of loaded items in place; scroll and the query stay.
    const reload = useCallback(async () => {
      const start = galleryRef.current, id = ++sequence.current, want = Math.max(start.items.length, PAGE);
      const same = () => id === sequence.current && galleryRef.current.query === start.query && galleryRef.current.pinnedOnly === start.pinnedOnly;
      try {
        const items: LibraryItem[] = [];
        let offset: number | null = 0;
        while (offset !== null && items.length < want) {
          const page: { items: LibraryItem[]; nextOffset: number | null } = await client.rpc(artifactLibraryList, listInput(start.query, offset, Math.min(100, want - items.length), start.pinnedOnly));
          for (const item of page.items) if (!items.some(other => other.artifactId === item.artifactId)) items.push(item);
          offset = page.items.length ? page.nextOffset : null;
        }
        if (!same()) return;
        const sig = (list: readonly LibraryItem[]) => JSON.stringify(list.map(item => [item.artifactId, item.title, item.headVersion, item.updatedAt, item.thumbnail, item.sessionTitle, item.workspaceName, !!item.pinned]));
        setGallery(old => sig(old.items) === sig(items) && old.nextOffset === offset && old.status === "idle" ? old : { ...old, items: sig(old.items) === sig(items) ? old.items : items, nextOffset: offset, status: "idle", error: undefined, loaded: true });
      } catch (reason) {
        if (same()) setGallery(old => old.status === "loading" || old.status === "more" ? { ...old, status: "idle" } : old);
        throw reason;
      }
    }, []);
    const [refreshing, setRefreshing] = useState(false), refreshRun = useRef(0);
    const onRefresh = useCallback(() => {
      const run = ++refreshRun.current;
      clearTimeout(debounce.current); setRefreshing(true);
      void reload().catch(reason => show(ui(`Couldn’t refresh. ${reasonText(reason)}`, `새로고침하지 못했습니다. ${reasonText(reason)}`))).finally(() => { if (run === refreshRun.current) setRefreshing(false); });
    }, [reload, show]);
    // The gallery is in view (under the sheet): follow a change at once. A chat-opened detail hides it, so there
    // the change only marks it stale until the list is back.
    const stale = useRef(false);
    const reconcile = useCallback(() => { stale.current = false; if (galleryRef.current.loaded) void reload().catch(() => { stale.current = true; /* keep the list; the next change or return retries */ }); }, [reload]);
    const markStale = useCallback(() => { stale.current = true; }, []);
    const close = useCallback(() => {
      if (detail?.returnAgent && navigation?.openAgent) {
        // The conversation the user was viewing when the card / explicit open fired: pop back to that exact
        // workspace route when provable (no tab re-selection), else openAgent on the captured host.
        const agentId = detail.returnAgent, serverId = detail.returnServerId ?? host.id, open = navigation.openAgent;
        returnToOrigin(detail.nonce, () => open({ agentId, serverId }));
        return;
      }
      setDetail(null);
      if (stale.current) reconcile();
    }, [detail, navigation, host.id, reconcile]);
    const closeLabel = detail?.returnAgent && navigation?.openAgent ? ui("Back to conversation", "대화로 돌아가기") : ui("Back to gallery", "갤러리로 돌아가기");

    /* ── focus sheet ── */
    const openedFrom = useRef<HTMLElement | null>(null);
    // One open = exactly one pushed screen entry (the host's router.push); the sheet shows at once.
    const openSheet = useCallback((item: LibraryItem, from: HTMLElement) => {
      if (sheetRef.current) return;
      openedFrom.current = from; pushed.current = true; setMenu(null);
      client.openScreen({ screenId: LIBRARY_SCREEN_ID, params: { view: "sheet", artifactId: item.artifactId, ...(item.sessionId ? { sessionId: item.sessionId } : {}) } });
    }, []);
    // X, Escape and delete leave through the entry the open pushed (history back, once); the sheet closes when the
    // params return to the list. An entry opened by URL/reload has nothing of ours below it: show the list instead.
    const closeSheet = useCallback(() => {
      setMenu(null);
      if (lastView.current !== "sheet") setSheet(null);
      else if (!backing.current) { backing.current = true; if (listBelow(pushed.current)) history.back(); else replaceWithList(); }
      if (stale.current) reconcile();
    }, [reconcile]);
    const sheetOpen = !!sheet, wasOpen = useRef(false);
    useEffect(() => {
      if (wasOpen.current && !sheetOpen && !detail) {
        // Back on the card it came from, without moving the gallery.
        const from = openedFrom.current;
        (from?.isConnected ? from : scrollRef.current)?.focus({ preventScroll: true });
      }
      wasOpen.current = sheetOpen;
    }, [sheetOpen]);
    /** The gallery's own copy of what the sheet shows, so a pin, rename or new version is current in both. */
    const sheetItem = sheet ? gallery.items.find(item => item.artifactId === sheet.artifactId) ?? sheet.item : null;
    const sheetItemRef = useRef(sheetItem); sheetItemRef.current = sheetItem;
    const sheetShown = useCallback((shown: ShownVersion) => {
      const item = sheetItemRef.current;
      if (item && shown.artifactId === item.artifactId && shown.version && shown.version > item.headVersion) reconcile();
    }, [reconcile]);
    const sheetSelect = useCallback((artifactId: string) => {
      if (lastView.current === "sheet" && sheetRef.current && sheetRef.current.artifactId !== artifactId) renameSheetEntry(artifactId);
      setSheet(old => old && old.artifactId !== artifactId ? { ...old, artifactId, item: { ...old.item, artifactId, title: ui(`${old.item.title} copy`, `${old.item.title} 사본`), headVersion: 1, pinned: false, updatedAt: new Date().toISOString() } } : old);
    }, []);

    /* ── actions (the stored artifact, through the existing RPCs) ── */
    const manage = (item: LibraryItem, action: ArtifactAction) => client.rpc(artifactManage, { sessionId: item.sessionId!, artifactId: item.artifactId, action });
    const syncStore = (item: LibraryItem) => { const store = registry.forAgent(item.sessionId!); if (store.snapshot().length) void store.refreshPersistent?.().catch(() => {}); };
    const pending = useRef(new Set<string>());
    const once = async (item: LibraryItem, task: () => Promise<void>) => {
      if (!item.sessionId || pending.current.has(item.artifactId)) return;
      pending.current.add(item.artifactId);
      try { await task(); } finally { pending.current.delete(item.artifactId); }
    };
    const patch = (artifactId: string, change: Partial<LibraryItem>) => setGallery(old => ({ ...old, items: inOrder(old.items.map(item => item.artifactId === artifactId ? { ...item, ...change } : item)) }));
    const togglePin = (item: LibraryItem) => once(item, async () => {
      const pinned = !item.pinned;
      patch(item.artifactId, { pinned });
      setSheet(old => old && old.artifactId === item.artifactId ? { ...old, item: { ...old.item, pinned } } : old);
      try { await manage(item, { type: "pin", pinned }); show(pinned ? ui("Pinned to top", "상단에 고정했습니다") : ui("Unpinned", "고정을 해제했습니다")); syncStore(item); reconcile(); }
      catch (reason) { patch(item.artifactId, { pinned: !pinned }); setSheet(old => old && old.artifactId === item.artifactId ? { ...old, item: { ...old.item, pinned: !pinned } } : old); show(ui(`Couldn’t change the pin. ${reasonText(reason)}`, `고정 상태를 바꾸지 못했습니다. ${reasonText(reason)}`)); }
    });
    const bringBack = (item: LibraryItem) => setGallery(old => old.items.some(other => other.artifactId === item.artifactId) ? old : { ...old, items: inOrder([...old.items, item]) });
    const undoRemove = (item: LibraryItem) => once(item, async () => {
      bringBack(item);
      try { await manage(item, { type: "restore" }); show(ui("Delete undone", "삭제를 되돌렸습니다")); syncStore(item); reconcile(); }
      catch (reason) { setGallery(old => ({ ...old, items: old.items.filter(other => other.artifactId !== item.artifactId) })); show(ui(`Couldn’t undo. ${reasonText(reason)}`, `되돌리지 못했습니다. ${reasonText(reason)}`), () => void undoRemove(item)); }
    });
    const remove = (item: LibraryItem) => once(item, async () => {
      if (sheetRef.current?.artifactId === item.artifactId) closeSheet();
      setGallery(old => ({ ...old, items: old.items.filter(other => other.artifactId !== item.artifactId) }));
      try { await manage(item, { type: "delete" }); show(ui(`Deleted “${item.title}”`, `‘${item.title}’을(를) 삭제했습니다`), () => void undoRemove(item)); syncStore(item); reconcile(); }
      catch (reason) { bringBack(item); show(ui(`Couldn’t delete. ${reasonText(reason)}`, `삭제하지 못했습니다. ${reasonText(reason)}`)); }
    });
    const saveFile = async (item: LibraryItem) => {
      try {
        const found = await client.rpc(artifactLibraryGet, { artifactId: item.artifactId });
        if (!found) throw new Error(ui("Couldn’t find the stored content.", "저장된 내용을 찾지 못했습니다."));
        const { version } = found;
        exportArtifact({ id: item.artifactId, title: version.title, kind: version.format === "react" ? "react" : "html", format: version.format, code: version.content, complete: true, explicit: true, source: `library:${version.artifactId}:${version.version}`, timestamp: version.createdAt }, item.title);
        show(ui("File saved", "파일을 저장했습니다"));
      } catch (reason) { show(ui(`Couldn’t save the file. ${reasonText(reason)}`, `파일을 저장하지 못했습니다. ${reasonText(reason)}`)); }
    };
    const sessionOf = (item: LibraryItem) => item.sessionId && item.sessionTitleStatus !== "deleted" && navigation?.openAgent
      ? () => navigation.openAgent({ agentId: item.sessionId!, serverId: host.id }) : undefined;
    const entriesFor = (item: LibraryItem, api: WorkbenchApi | null): MenuEntry[] => {
      const off = !item.sessionId, session = sessionOf(item), managed = api?.management;
      return [
        { id: "pin", label: item.pinned ? ui("Unpin", "고정 해제") : ui("Pin to top", "상단에 고정"), disabled: off, run: () => void togglePin(item) },
        { id: "session", label: ui("Go to original session", "원본 세션으로 이동"), hint: "↗", disabled: !session, run: () => session?.() },
        { id: "export", label: ui("Save file", "파일 저장"), run: () => api ? api.command("export") : void saveFile(item) },
        // Only inside the sheet: what the detail's title menu offered for the version on screen.
        ...(api ? ["divider", ...(managed ? [
          { id: "rename", label: ui("Rename", "이름 변경"), disabled: !managed.available, run: () => api.command("rename") },
          { id: "duplicate", label: ui("Duplicate", "복제"), disabled: !managed.available, run: () => api.command("duplicate") },
          { id: "web", label: ui("Open in web", "웹에서 열기"), disabled: !managed.available, run: () => api.command("web") },
        ] : []), { id: "refresh", label: ui("Refresh preview", "미리보기 새로고침"), run: () => api.command("refresh") }] as MenuEntry[] : []),
        "divider",
        { id: "delete", label: ui("Delete", "삭제"), danger: true, disabled: off, run: () => void remove(item) },
      ];
    };
    const toggleMenu = (key: string, item: LibraryItem, anchor: HTMLElement, api: WorkbenchApi | null) =>
      setMenu(old => old?.key === key ? null : { key, artifactId: item.artifactId, anchor, entries: entriesFor(item, api) });
    const closeMenu = useCallback(() => setMenu(null), []);
    const restoreVersion = async (item: LibraryItem, version: number, api: WorkbenchApi) => once(item, async () => {
      const store = registry.forAgent(item.sessionId!);
      try {
        const result = await client.rpc(artifactRestoreVersion, { sessionId: item.sessionId!, artifactId: item.artifactId, version, baseVersion: api.record.headVersion ?? item.headVersion, clientMutationId: crypto.randomUUID() });
        await store.refreshPersistent?.().catch(() => {});
        if (result.status === "conflict") { show(ui("A newer version was saved in the meantime, so nothing was restored. Check the latest version.", "그 사이 새 버전이 저장돼 복원하지 않았습니다. 최신 버전을 확인해 주세요.")); reconcile(); return; }
        api.changeVersion("latest");
        show(ui(`Restored v${version} as v${result.version}`, `v${version} 내용을 v${result.version}으로 복원했습니다`)); reconcile();
      } catch (reason) { show(ui(`Couldn’t restore. ${reasonText(reason)}`, `복원하지 못했습니다. ${reasonText(reason)}`)); }
    });
    const sheetProps = sheet && sheetItem ? {
      item: sheetItem, onSelect: sheetSelect,
      actions: {
        onClose: closeSheet, notify: show, onSession: sessionOf(sheetItem), canRestore: !!sheetItem.sessionId,
        onMenu: (anchor: HTMLElement, api: WorkbenchApi | null) => toggleMenu("sheet", sheetItem, anchor, api),
        onRestore: (version, _number, api) => { if (version.artifactVersion) void restoreVersion(sheetItem, version.artifactVersion, api); },
      } satisfies SheetActions,
    } : undefined;

    // "/" focuses the search, Escape closes the sheet. Menus, the version list, dialogs and fields take theirs first.
    useEffect(() => {
      const key = (event: KeyboardEvent) => {
        const root = rootRef.current;
        if (!root || !root.getClientRects().length || event.defaultPrevented || event.isComposing) return;
        if (event.key === "Escape" && sheetRef.current) { event.preventDefault(); closeSheet(); return; }
        if (event.key !== "/" || event.ctrlKey || event.metaKey || event.altKey || detail || sheetRef.current) return;
        const at = document.activeElement as HTMLElement | null;
        if (at && (/^(?:INPUT|TEXTAREA|SELECT)$/.test(at.tagName) || at.isContentEditable)) return;
        event.preventDefault(); searchRef.current?.focus(); searchRef.current?.select();
      };
      document.addEventListener("keydown", key);
      return () => document.removeEventListener("keydown", key);
    }, [detail, closeSheet]);

    // Explicit open: ack only once this exact request's version is on screen in the full detail.
    const acked = useRef<string | null>(null);
    const onShown = useCallback((shown: ShownVersion) => {
      if (!requests || !detail?.requestId || !detail.sessionId || acked.current === detail.requestId) return;
      const pending = requests.get(detail.sessionId);
      if (!pending || pending.requestId !== detail.requestId) return;
      if (shown.artifactId !== pending.artifactId || shown.version !== pending.version) return;
      if (typeof document === "undefined" || document.visibilityState !== "visible") return;
      acked.current = pending.requestId;
      void acknowledge(client, requests, pending).catch(() => {});
    }, [detail?.requestId, detail?.sessionId]);

    const dark = isDark(theme);
    if (layout.platform !== "web") return <Text style={{ color: theme.colors.foreground, padding: 16 }}>{ui("The artifact gallery is available in Paseo desktop and web.", "아티팩트 갤러리는 Paseo 데스크톱·웹에서 사용할 수 있습니다.")}</Text>;
    return <div ref={rootRef} className="avl-root" data-view={detail ? "detail" : "gallery"} data-sheet={sheetOpen ? "open" : "none"} data-compact={layout.compact ? "true" : "false"} data-dark={dark ? "true" : "false"} style={{ ...workbenchVariables(theme), color: theme.colors.foreground, background: theme.colors.surface0, "--avl-surface": theme.colors.surface0, "--av-panel-border": theme.colors.border, "--av-panel-raised": theme.colors.surface1 } as React.CSSProperties}>
      <style>{workbenchStyles + libraryStyles + galleryStyles + sheetStyles}</style>
      <GalleryView state={gallery} view={view} dark={dark} hidden={!!detail} inert={sheetOpen} refreshing={refreshing} menuId={menu && menu.key !== "sheet" ? menu.artifactId : null} scrollRef={scrollRef} searchRef={searchRef} onView={onView} onQuery={onQuery} onScope={onScope} onMore={onMore} onRefresh={onRefresh} onRetry={onRetry} onOpen={openSheet}
        onMenu={(item, anchor) => toggleMenu(item.artifactId, item, anchor, null)} />
      {detail && (detail.sessionId
        ? <SessionDetail key={detail.key} detail={detail} sessionId={detail.sessionId} registry={registry} client={client} shownExplorers={shownExplorers} explorers={explorers} onChanged={markStale} theme={theme} closeLabel={closeLabel} onClose={close} onShown={onShown} openBrowser={navigation?.openBrowser} serverId={host.id} />
        : <LibraryDetail key={detail.key} detail={detail} client={client} theme={theme} closeLabel={closeLabel} onClose={close} onShown={onShown} serverId={host.id} />)}
      {!detail && sheet && sheetItem && <FocusSheet label={sheetItem.title}>
        {sheet.detail.sessionId
          ? <SessionDetail key={sheet.detail.key} detail={sheet.detail} sessionId={sheet.detail.sessionId} registry={registry} client={client} shownExplorers={shownExplorers} explorers={explorers} onChanged={reconcile} theme={theme} closeLabel={ui("Back to gallery", "갤러리로 돌아가기")} onClose={closeSheet} onShown={sheetShown} openBrowser={navigation?.openBrowser} serverId={host.id} sheet={sheetProps} />
          : <LibraryDetail key={sheet.detail.key} detail={sheet.detail} client={client} theme={theme} closeLabel={ui("Back to gallery", "갤러리로 돌아가기")} onClose={closeSheet} onShown={sheetShown} serverId={host.id} sheet={sheetProps} />}
      </FocusSheet>}
      {menu && <ActionMenu key={menu.key} menu={menu} rootRef={rootRef} onClose={closeMenu} />}
      <Toasts toast={toast} onClear={clear} />
    </div>;
  };
}

const libraryStyles = `
.avl-root{container:avl/inline-size;position:relative;overflow:hidden;height:100%;width:100%;min-width:0;min-height:0;display:flex;flex-direction:column;font:13px/1.5 "Pretendard Variable",Pretendard,Inter,-apple-system,BlinkMacSystemFont,"Segoe UI","Apple SD Gothic Neo","Malgun Gothic",sans-serif;-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale;background:var(--av-bg);color:var(--av-fg)}
.avl-root *{box-sizing:border-box}
.avl-state .avl-more{height:30px;padding:0 14px;border:1px solid var(--av-border);border-radius:8px;background:var(--av-surface);color:var(--av-fg);font:inherit;font-weight:600;cursor:pointer}
.avl-state .avl-more:hover{background:var(--av-hover)}
.avl-empty{margin:auto;padding:48px 20px;max-width:420px;text-align:center;color:var(--av-muted);line-height:1.7;display:flex;flex-direction:column;align-items:center;gap:8px}
.avl-empty p{margin:0}
.avl-empty code{padding:2px 6px;border-radius:6px;background:var(--av-raised);font-size:12px}
.avl-detail{flex:1;min-height:0;display:flex;flex-direction:column}
.avl-stage{flex:1;min-height:0;display:flex;flex-direction:column}
.avl-stage>.av-workbench{flex:1;min-height:0}
.avl-state{flex:1;display:flex;flex-direction:column;min-height:0}
.avl-state-title{font-weight:600;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;padding-inline-start:4px}
.avl-root .av-panel-bar{display:flex;align-items:center;gap:10px;flex:none;min-height:40px;padding:6px 8px 6px 12px;border-top:1px solid var(--av-border);background:var(--av-raised);font-size:12px}
.avl-root .av-panel-bar span{flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.avl-root .av-panel-bar button{flex:none;height:28px;padding:0 10px;border:1px solid var(--av-border);border-radius:7px;background:transparent;color:inherit;font:inherit;font-weight:600;cursor:pointer}
.avl-root .av-panel-bar .av-bar-dismiss{border:0;width:28px;padding:0;font-weight:400}
`;
