import { useCallback, useEffect, useMemo, useRef, useState, useSyncExternalStore } from "react";
import { ExternalLink } from "@getpaseo/plugin/client/ui";
import { usePaseo, type PluginClientContext, type PluginScreenProps } from "@getpaseo/plugin/client";
import { artifactLibraryGet, type LibraryItem } from "../shared/library";
import type { StoredVersion } from "../shared/contracts";
import { artifactPrompt } from "../shared/artifacts";
import type { ArtifactRecord, ArtifactVersion, ArtifactViewStore, StoreRegistry } from "./store";
import { findRecord } from "./result-card";
import { useArtifactManagement, useUndo } from "./management";
import { useArtifactObserver } from "./use-observer";
import { Workbench, type ShownVersion } from "./workbench";
import { IconButton } from "./chrome";
import { SheetState, sheetChrome, type SheetActions } from "./library-sheet";
import { replyRefresh, type Explorers, type SidebarRequest } from "./sidebar";
import type { ShownExplorers } from "./card-open";
import type { Detail } from "./library-route";
import { ui, uiLocale, useUiLocale } from "./ui-locale";

/**
 * What the library screen shows for one artifact, full surface or inside the gallery's focus sheet:
 * a conversation's stored artifact (`SessionDetail`) or a legacy one without a conversation (`LibraryDetail`).
 */
export type DetailProps = {
  detail: Detail; theme: PluginScreenProps["theme"]; closeLabel: string; onClose: () => void;
  onShown?: (shown: ShownVersion) => void;
  /** In-app browser (Electron); absent elsewhere, then the web link bar is shown. */
  openBrowser?: (input: { url: string; workspaceId: string; serverId?: string }) => void; serverId: string;
  /** Rename/pin/duplicate/delete/restore happened here: the gallery behind it is stale. */
  onChanged?: () => void;
  /** Shown inside the gallery's focus sheet instead of filling the screen. */
  sheet?: { item: LibraryItem; actions: SheetActions; onSelect: (artifactId: string) => void };
};

/**
 * The agent's workspace through the imperative handle. Not `useAgent`: Paseo 0.16.1 plugin screens
 * (`PluginSurfaceScreen`) mount no entity-state provider, so any state hook there throws
 * "Plugin state hooks must run inside a plugin host". A `ref()` handle reads null until a snapshot
 * arrives, so this fetches one once and follows agent updates.
 */
function useAgentWorkspaceId(agent: ReturnType<ReturnType<typeof usePaseo>["agents"]["ref"]>): string | null {
  const [workspaceId, setWorkspaceId] = useState<string | null>(() => agent.workspaceId);
  useEffect(() => {
    let live = true;
    const read = () => { if (live) setWorkspaceId(agent.workspaceId); };
    read();
    let unsubscribe: (() => void) | undefined;
    try { unsubscribe = agent.subscribe(read); } catch { /* host without agent updates: the refetch below still answers */ }
    // Only the in-app browser needs it: a failed lookup must never take the detail down.
    if (!agent.workspaceId) { try { void agent.refresh().then(result => { if (live && result?.agent.workspaceId) setWorkspaceId(result.agent.workspaceId); }, () => {}); } catch { /* link bar fallback */ } }
    return () => { live = false; unsubscribe?.(); };
  }, [agent]);
  return workspaceId;
}

/**
 * Chat cards' "열림" and the newer-version refresh, for a detail that fills the main area: this detail counts as
 * showing the artifact while it is laid out, and it is its own foreground evidence (laid out, visible, same session
 * and artifact, following latest) for a server refresh request. It only reloads its own store; it never navigates.
 */
function useShownEvidence({ client, store, sessionId, record, deleted, shownExplorers, explorers, onShown }: {
  client: PluginClientContext; store: ArtifactViewStore; sessionId: string; record: ArtifactRecord | undefined; deleted: boolean;
  shownExplorers?: ShownExplorers; explorers?: Explorers; onShown?: (shown: ShownVersion) => void;
}) {
  const owner = useRef({}).current, live = useRef<ShownVersion | null>(null), rootRef = useRef<HTMLDivElement>(null);
  const refreshing = useRef<SidebarRequest | null>(null);
  const laidOut = () => {
    const node = rootRef.current;
    return !!node && node.isConnected && node.getClientRects().length > 0 && node.offsetWidth > 0 && node.offsetHeight > 0 && typeof document !== "undefined" && document.visibilityState === "visible";
  };
  const report = useCallback((value: ShownVersion) => {
    live.current = value;
    // A refresh this main detail took: "refreshed" once exactly that version is on screen here.
    const refresh = refreshing.current;
    if (refresh && value.artifactId === refresh.artifactId && value.version === refresh.version) {
      refreshing.current = null;
      if (laidOut()) replyRefresh(client, refresh, "refreshed");
    }
    shownExplorers?.set(sessionId, owner, { recordId: value.recordId, artifactId: value.artifactId, version: value.version, following: value.following });
    shownExplorers?.visible(sessionId, owner, typeof document === "undefined" || document.visibilityState === "visible");
    onShown?.(value);
  }, [sessionId, onShown]);
  useEffect(() => {
    if (!shownExplorers) return;
    const update = () => shownExplorers.visible(sessionId, owner, document.visibilityState === "visible" && !!live.current);
    document.addEventListener("visibilitychange", update);
    return () => { document.removeEventListener("visibilitychange", update); shownExplorers.remove(sessionId, owner); };
  }, [sessionId]);
  useEffect(() => { if (!record || deleted) { live.current = null; shownExplorers?.set(sessionId, owner, null); } }, [record?.id, deleted]);
  useEffect(() => explorers?.register(sessionId, {
    main: true,
    state: () => { const shown = live.current; return { visible: laidOut(), mode: shown ? "workbench" : "list", artifactId: shown?.artifactId, version: shown?.version, following: !!shown?.following }; },
    refresh: request => {
      if (live.current?.artifactId !== request.artifactId) return;
      refreshing.current = request;
      void store.refreshPersistent?.().catch(() => { if (refreshing.current === request) { refreshing.current = null; replyRefresh(client, request, "unchanged"); } });
    },
  }), [explorers, sessionId, store]);
  return { rootRef, report };
}

/** Stored conversation artifact: the conversation store, history and management, as in the side panel. */
export function SessionDetail(props: DetailProps & { sessionId: string; registry: StoreRegistry; client: PluginClientContext; shownExplorers?: ShownExplorers; explorers?: Explorers }) {
  useUiLocale();
  const { detail, sessionId, registry, client, theme, closeLabel, onClose, onShown, openBrowser, serverId, shownExplorers, explorers, onChanged, sheet } = props;
  const paseo = usePaseo(), agent = useMemo(() => paseo.agents.ref(sessionId), [paseo, sessionId]);
  const store = registry.forAgent(sessionId), records = useSyncExternalStore(store.subscribe, store.snapshot, store.snapshot);
  const [target, setTarget] = useState(detail.artifactId);
  const [phase, setPhase] = useState<"loading" | "ready" | "error">("loading");
  const [error, setError] = useState<string | null>(null);
  // Like the side panel: with the chat unmounted behind this screen, this keeps timeline updates and
  // turn completion (new stored versions, history) flowing into the conversation store.
  const { notice, observer } = useArtifactObserver(agent, store);
  const load = useCallback(() => {
    setPhase("loading"); setError(null);
    store.focus(detail.artifactId, detail.version);
    // focus() already reads when the target changed; this call shares that read (and is the retry after a failure).
    void (store.refreshPersistent?.({ observe: true }) ?? Promise.resolve()).then(() => setPhase("ready"), reason => { setPhase("error"); setError(reason instanceof Error ? reason.message : String(reason)); });
  }, [store, detail.key]);
  useEffect(() => { setTarget(detail.artifactId); load(); }, [load]);
  const record = findRecord(records, target);
  const deleted = !!store.isDeleted?.(target) || !!(record?.artifactId && store.isDeleted?.(record.artifactId));
  const selected = useRef(sheet?.onSelect); selected.current = sheet?.onSelect;
  const select = useCallback((id: string) => { setTarget(id); store.focus(id); selected.current?.(id); }, [store]);
  const [webLink, setWebLink] = useState<string | null>(null);
  const changed = useRef(onChanged); changed.current = onChanged;
  const { undo, setUndo, failure, setFailure, onDeleting, onDeleted, onDeleteFailed, restore: restoreDeleted } = useUndo(store, select);
  const restore = useCallback(async () => { await restoreDeleted(); changed.current?.(); }, [restoreDeleted]);
  useEffect(() => { if (undo?.phase !== "deleted") return; const timer = setTimeout(() => setUndo(null), 10000); return () => clearTimeout(timer); }, [undo?.phase, setUndo]);
  const deleting = useCallback((artifactId: string, title: string) => { setWebLink(null); onDeleting(artifactId, title); }, [onDeleting]);
  const workspaceId = useAgentWorkspaceId(agent);
  const web = useCallback((url: string) => {
    if (!openBrowser) { setWebLink(url); return; }
    const known = workspaceId ?? agent.workspaceId;
    if (known) { openBrowser({ url, workspaceId: known, serverId }); return; }
    // No snapshot yet: one refetch, then the in-app browser or the link bar as before.
    void Promise.resolve().then(() => agent.refresh()).then(result => result?.agent.workspaceId ?? null, () => null)
      .then(id => { if (id) openBrowser({ url, workspaceId: id, serverId }); else setWebLink(url); });
  }, [openBrowser, workspaceId, agent, serverId]);
  const managed = useArtifactManagement({ store, record: deleted ? undefined : record, onSelect: select, onDeleting: deleting, onDeleted, onDeleteFailed, onWebUrl: web });
  // Same actions; those that change what the gallery lists also mark it stale.
  const management = useMemo(() => {
    if (!managed) return undefined;
    const mark = <A extends unknown[]>(run: (...args: A) => Promise<void>) => async (...args: A) => { try { await run(...args); } finally { changed.current?.(); } };
    return { ...managed, pin: mark(managed.pin), rename: mark(managed.rename), duplicate: mark(managed.duplicate), remove: mark(managed.remove) };
  }, [managed]);
  // Only the record that was asked for opens on the requested version; a duplicate opens on its latest.
  const initial = record && target === detail.artifactId ? detail.version : undefined;
  const { rootRef, report } = useShownEvidence({ client, store, sessionId, record, deleted, shownExplorers, explorers, onShown });
  // The conversation store could not produce the record (lookup failed, old conversation gone, outside
  // its first page): fall back to the stored copy through the library RPC instead of hiding it.
  if (!deleted && !record && (phase === "error" || phase === "ready") && target === detail.artifactId)
    return <LibraryDetail detail={detail} client={client} theme={theme} closeLabel={closeLabel} onClose={onClose} onShown={onShown} serverId={serverId} sheet={sheet} />;
  return <div ref={rootRef} className="avl-detail">
    {notice && <p className="av-panel-notice" role="status">{notice}</p>}
    {record && !deleted ? <div className="avl-stage"><Workbench key={`${record.id}:${detail.key}`} record={record} theme={theme} management={management} closeLabel={closeLabel} onClose={onClose} hideFullscreen chrome={sheet && sheetChrome(sheet.item, sheet.actions)}
      initialVersion={initial} onShown={report} onRefreshHistory={() => { void observer.current?.refresh(); load(); }}
      onFix={async (current, message) => {
        await agent.send(artifactPrompt(current.artifactKey ?? (current.explicit ? current.id : `artifact-${Date.now().toString(36)}`), ui(`Please fix this runtime error:\n${message}`, `다음 실행 오류를 고쳐 주세요:\n${message}`), current, uiLocale()), { activeTurnBehavior: "steer" });
      }} /></div>
      : <DetailState theme={theme} title={detail.title} closeLabel={closeLabel} onClose={onClose} sheet={sheet}
        state={deleted ? "deleted" : phase === "error" ? "error" : phase === "loading" ? "loading" : "missing"} error={error} onRetry={load} />}
    {webLink && <div className="av-panel-bar" role="status" data-bar="web"><span>{ui("Web address is ready", "웹 주소를 준비했어요")}</span><ExternalLink href={webLink} accessibilityLabel={ui("Open in web link", "웹에서 열기 링크")}>{ui("Open in web", "웹에서 열기")}</ExternalLink><button type="button" className="av-bar-dismiss" aria-label={ui("Dismiss web link", "웹 링크 닫기")} onClick={() => setWebLink(null)}>✕</button></div>}
    {failure && !undo && <div className="av-panel-bar" role="alert" data-bar="delete-error"><span>{failure}</span><button type="button" className="av-bar-dismiss" aria-label={ui("Dismiss delete error", "삭제 오류 닫기")} onClick={() => setFailure(null)}>✕</button></div>}
    {undo && <div className="av-panel-bar" role="status" data-bar="undo" data-phase={undo.phase}><span>{undo.phase === "deleting" ? ui(`Deleting “${undo.title}”…`, `‘${undo.title}’ 삭제 중…`) : undo.phase === "restoring" ? ui(`Restoring “${undo.title}”…`, `‘${undo.title}’ 되돌리는 중…`) : undo.error ? ui(`Couldn’t undo. ${undo.error}`, `되돌리지 못했어요. ${undo.error}`) : ui(`“${undo.title}” deleted`, `‘${undo.title}’ 삭제됨`)}</span><button type="button" aria-label={ui("Undo delete", "삭제 되돌리기")} disabled={undo.phase !== "deleted"} onClick={() => void restore()}>{ui("Undo", "되돌리기")}</button></div>}
  </div>;
}

/** Legacy artifact without a conversation: read-only, versions loaded through the library RPC. */
export function LibraryDetail({ detail, client, theme, closeLabel, onClose, onShown, sheet }: DetailProps & { client: PluginClientContext }) {
  const [record, setRecord] = useState<ArtifactRecord | null>(null);
  const [phase, setPhase] = useState<"loading" | "ready" | "error">("loading");
  const [error, setError] = useState<string | null>(null);
  const [round, setRound] = useState(0);
  useEffect(() => {
    let live = true;
    setPhase("loading"); setError(null);
    void (async () => {
      // First paint needs only the head and the requested version; the rest of the (≤20) history follows in
      // the background, three calls at a time, merged into the version menu as it arrives.
      const head = await client.rpc(artifactLibraryGet, { artifactId: detail.artifactId });
      if (!head) return null;
      const convert = (value: StoredVersion): ArtifactVersion => ({ id: head.artifact.artifactId, title: value.title, kind: value.format === "react" ? "react" : "html", format: value.format, code: value.content, complete: true, explicit: true, source: `library:${value.artifactId}:${value.version}`, timestamp: value.createdAt, artifactId: value.artifactId, artifactVersion: value.version, artifactKey: head.artifact.key });
      const loaded = new Map<number, StoredVersion>([[head.version.version, head.version]]);
      const build = (): ArtifactRecord => ({ id: head.artifact.artifactId, artifactId: head.artifact.artifactId, key: head.artifact.key, title: head.artifact.title, pinned: !!head.artifact.pinned, headVersion: head.artifact.headVersion, versions: [...loaded.values()].sort((a, b) => a.version - b.version).map(convert) });
      if (detail.version && !loaded.has(detail.version)) {
        const found = await client.rpc(artifactLibraryGet, { artifactId: detail.artifactId, version: detail.version }).catch(() => null);
        if (found) loaded.set(found.version.version, found.version);
      }
      const rest: number[] = [];
      for (let v = head.artifact.headVersion; v >= 1 && loaded.size + rest.length < 20; v--) if (!loaded.has(v)) rest.push(v);
      void (async () => {
        for (let i = 0; i < rest.length && live; i += 3) {
          const found = await Promise.all(rest.slice(i, i + 3).map(version => client.rpc(artifactLibraryGet, { artifactId: detail.artifactId, version }).catch(() => null)));
          if (!live) return;
          for (const value of found) if (value) loaded.set(value.version.version, value.version);
          setRecord(build());
        }
      })();
      return build();
    })().then(next => { if (!live) return; setRecord(next); setPhase("ready"); }, reason => { if (!live) return; setPhase("error"); setError(reason instanceof Error ? reason.message : String(reason)); });
    return () => { live = false; };
  }, [client, detail.key, round]);
  return <div className="avl-detail">
    {record ? <div className="avl-stage"><Workbench key={`${record.id}:${detail.key}`} record={record} theme={theme} closeLabel={closeLabel} onClose={onClose} hideFullscreen chrome={sheet && sheetChrome(sheet.item, sheet.actions)} initialVersion={detail.version} onShown={onShown} onRefreshHistory={() => setRound(value => value + 1)} /></div>
      : <DetailState theme={theme} title={detail.title} closeLabel={closeLabel} onClose={onClose} sheet={sheet} state={phase === "error" ? "error" : phase === "loading" ? "loading" : "missing"} error={error} onRetry={() => setRound(value => value + 1)} />}
  </div>;
}

function DetailState({ title, state, error, closeLabel, onClose, onRetry, sheet }: { theme: PluginScreenProps["theme"]; title?: string; state: "loading" | "error" | "missing" | "deleted"; error: string | null; closeLabel: string; onClose: () => void; onRetry: () => void; sheet?: DetailProps["sheet"] }) {
  useUiLocale();
  if (sheet) return <SheetState item={sheet.item} title={state === "loading" ? undefined : title} actions={sheet.actions}>
    <div role={state === "error" ? "alert" : "status"}>{state === "loading" ? <p className="avl-sr">{ui("Loading…", "불러오는 중…")}</p> : state === "deleted" ? <p>{ui("This artifact was deleted.", "이 아티팩트는 삭제됐어요.")}</p>
      : <><p>{state === "error" ? ui(`Couldn’t load the artifact.${error ? ` ${error}` : ""}`, `아티팩트를 불러오지 못했어요.${error ? ` ${error}` : ""}`) : ui("Couldn’t find this artifact.", "이 아티팩트를 찾지 못했어요.")}</p><button type="button" className="avl-link" onClick={onRetry}>{ui("Try again", "다시 시도")}</button></>}</div>
  </SheetState>;
  return <section className="av-workbench avl-state" aria-label={ui("Artifact details", "아티팩트 상세")}>
    <header className="av-toolbar"><div className="av-toolbar-lead"><span className="avl-state-title">{title ?? ui("Artifacts", "아티팩트")}</span></div><div className="av-header-actions"><IconButton className="av-head-button" icon="close" label={closeLabel} onClick={onClose} /></div></header>
    <div className="avl-empty" role={state === "error" ? "alert" : "status"}>
      {state === "loading" ? <p>{ui("Loading…", "불러오는 중…")}</p>
        : state === "deleted" ? <p>{ui("This artifact was deleted.", "이 아티팩트는 삭제됐어요.")}</p>
          : state === "error" ? <><p>{ui("Couldn’t load the artifact.", "아티팩트를 불러오지 못했어요.")}{error ? ` ${error}` : ""}</p><button type="button" className="avl-more" onClick={onRetry}>{ui("Try again", "다시 시도")}</button></>
            : <><p>{ui("Couldn’t find this artifact.", "이 아티팩트를 찾지 못했어요.")}</p><button type="button" className="avl-more" onClick={onRetry}>{ui("Try again", "다시 시도")}</button></>}
    </div>
  </section>;
}
