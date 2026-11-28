import { useCallback, useEffect, useMemo, useRef, useState, useSyncExternalStore } from "react";
import { ExternalLink } from "@getpaseo/plugin/client/ui";
import { orderRecords, useArtifactManagement, useUndo } from "./management";
import { ArtifactList, ArtifactSwitcher, listStyles } from "./switcher";
import { Text } from "react-native";
import { usePaseo, type PluginAgentPanelProps, type PluginFilePanelProps, type PluginClientContext } from "@getpaseo/plugin/client";
import { artifactPrompt, kindFromFilename, MAX_SOURCE_LENGTH } from "../shared/artifacts";
import { ArtifactStore, type StoreRegistry, type ArtifactRecord } from "./store";
import { Workbench, type ShownVersion } from "./workbench";
import { createFileEditor, type EditorState } from "./file-editor";
import { useArtifactObserver } from "./use-observer";
import { IconButton, workbenchStyles, workbenchVariables } from "./chrome";
import type { Presence } from "./presence";
import { closeExplorerTab, closeTabMessage } from "./host-tab";
import type { CardPicks, ShownExplorers } from "./card-open";
import { acknowledge, isForegroundConversation, replyRefresh, type Explorers, type SidebarRequest, type SidebarRequests } from "./sidebar";
import { ui, uiLocale, useUiLocale } from "./ui-locale";

const noRequests = { subscribe: () => () => {}, snapshot: () => 0 };

/** Host tab list. The workbench's list button returns here; the right-sidebar tab also gets its own X. */
function ListView({ theme, records, onSelect, onCloseTab }: { theme: PluginAgentPanelProps["theme"]; records: readonly ArtifactRecord[]; onSelect: (id: string) => void; onCloseTab?: () => void }) {
  useUiLocale();
  return <section className="av-workbench av-list-view" aria-label={ui("Artifact list", "아티팩트 목록")} style={workbenchVariables(theme)}>
    <style>{workbenchStyles + listStyles}</style>
    <div className="av-list-head"><span style={{ flex: 1, minWidth: 0 }}>{ui("Artifacts", "아티팩트")}</span>{onCloseTab && <IconButton className="av-head-button" data-action="close-tab" icon="close" label={ui("Close artifact tab", "아티팩트 탭 닫기")} onClick={onCloseTab} />}</div>
    {records.length ? <ArtifactList records={records} onSelect={onSelect} /> : <p className="av-list-empty">{ui("No artifacts yet. Ask for one in the conversation with ", "아직 아티팩트가 없어요. 대화에서 ")}<code>/artifact</code>{ui(".", "로 결과물을 요청해 보세요.")}</p>}
  </section>;
}

const panelStyles = `.av-panel{height:100%;min-width:0;min-height:0;display:flex;flex-direction:column;font:13px/1.5 -apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;color:inherit}.av-panel *{box-sizing:border-box}.av-picker{display:flex;gap:8px;align-items:center;padding:10px 12px;border-bottom:1px solid var(--av-panel-border);flex:none}.av-picker select{min-width:0;flex:1;border:0;border-radius:6px;padding:6px 24px 6px 6px;color:inherit;background:transparent;font:inherit;cursor:pointer;text-overflow:ellipsis}.av-picker button{border:0;background:transparent;color:inherit;border-radius:6px;padding:6px;cursor:pointer;line-height:1;font-size:17px}.av-picker button:hover{background:var(--av-panel-raised)}.av-panel-notice{font-size:12px;padding:8px 12px;margin:0;color:inherit;border-bottom:1px solid var(--av-panel-border)}.av-empty{margin:auto;padding:28px 22px;max-width:400px;text-align:center;line-height:1.8}.av-empty h3{font-size:17px;font-weight:600;margin:0 0 10px}.av-empty code{padding:4px 7px;border-radius:6px;background:var(--av-panel-raised);font-size:12px}.av-stage-host{flex:1;min-height:0}.av-panel-alert{margin:12px;padding:12px;border:1px solid #be654244;border-radius:10px;font-size:12px}.av-panel-alert button{border:0;background:transparent;color:inherit;text-decoration:underline;padding:8px 0;font:inherit;cursor:pointer}.av-panel-bar{display:flex;align-items:center;gap:10px;flex:none;min-height:40px;padding:6px 8px 6px 12px;border-top:1px solid var(--av-panel-border);background:var(--av-panel-raised);font-size:12px}.av-panel-bar span{flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.av-panel-bar button{flex:none;height:28px;padding:0 10px;border:1px solid var(--av-panel-border);border-radius:7px;background:transparent;color:inherit;font:inherit;font-weight:600;cursor:pointer}.av-panel-bar .av-bar-dismiss{border:0;width:28px;padding:0;font-weight:400}`;

/**
 * `closeTab`: the right-sidebar ("explorer") registration, whose host tab can be closed from inside the panel.
 * `picks`: result-card presses for this conversation, shown on exactly the pressed artifact/version.
 * `shown`: what this panel really has on screen, read by the result cards' "opened" state.
 */
export function createAgentPanel(registry: StoreRegistry, client?: PluginClientContext, requests?: SidebarRequests, explorers?: Explorers, presence?: Presence, options: { closeTab?: boolean; picks?: CardPicks; shown?: ShownExplorers } = {}) {
  const { picks, shown: shownExplorers } = options;
  return function AgentPanel({ params, theme, layout, tab, workspaceId, navigation }: PluginAgentPanelProps) {
    useUiLocale();
    const paseo = usePaseo(), agent = useMemo(() => paseo.agents.ref(params.agentId), [paseo, params.agentId]);
    const store = registry.forAgent(params.agentId), records = useSyncExternalStore(store.subscribe, store.snapshot, store.snapshot);
    useEffect(() => {
      const state = tab.state as { selectedArtifact?: unknown } | undefined;
      if (!store.focused && typeof state?.selectedArtifact === "string") store.focus(state.selectedArtifact);
    }, [store]);
    const { notice, observer } = useArtifactObserver(agent, store);
    const ordered = orderRecords(records, store.isDeleted?.bind(store));
    const selected = store.visible ? ordered.find(record => record.id === store.focused) : undefined;
    const [webLink, setWebLink] = useState<string | null>(null);
    // Sidebar requests (server -> client): show the requested version, then ack once it is on screen.
    useSyncExternalStore(requests?.subscribe ?? noRequests.subscribe, requests?.snapshot ?? noRequests.snapshot, requests?.snapshot ?? noRequests.snapshot);
    const request = requests?.get(params.agentId);
    // What to show on open: the latest server request or card press, whichever came last. `key` remounts the
    // workbench so it waits for that version (loaded by store.focus) instead of flashing the latest first.
    const [display, setDisplay] = useState<{ key: string; artifactId: string; version?: number } | null>(null);
    useEffect(() => { if (request) setDisplay({ key: request.requestId, artifactId: request.artifactId, version: request.version }); }, [request?.requestId]);
    useSyncExternalStore(picks?.subscribe ?? noRequests.subscribe, picks?.snapshot ?? noRequests.snapshot, picks?.snapshot ?? noRequests.snapshot);
    const pick = picks?.get(params.agentId);
    // Applied once, then consumed: a panel remounted after X never replays an old press over a newer request.
    useEffect(() => { if (!pick) return; setDisplay({ key: `card:${pick.nonce}`, artifactId: pick.artifactId, version: pick.version }); picks?.take(params.agentId, pick.nonce); }, [pick?.nonce]);
    const acking = useRef<string | null>(null);
    // Refresh requests: this panel's live state, read by the refresh receiver.
    const rootRef = useRef<HTMLDivElement>(null);
    const live = useRef<ShownVersion | null>(null);
    const refreshing = useRef<SidebarRequest | null>(null);
    // The record this panel currently selects. A report only counts if it is about this record,
    // so a previous selection's report can never stand in for the new one.
    const selectedId = useRef<string | null>(null);
    const laidOut = () => {
      const node = rootRef.current;
      return !!node && node.isConnected && node.getClientRects().length > 0 && node.offsetWidth > 0 && node.offsetHeight > 0 && typeof document !== "undefined" && document.visibilityState === "visible";
    };
    const currentShown = () => live.current && selectedId.current && live.current.recordId === selectedId.current ? live.current : null;
    useEffect(() => {
      if (!explorers) return;
      return explorers.register(params.agentId, {
        state: () => {
          const shown = currentShown();
          return { visible: laidOut(), mode: shown ? "workbench" : "list", artifactId: shown?.artifactId, version: shown?.version, following: !!shown?.following };
        },
        refresh: request => { refreshing.current = request; store.focus(request.artifactId, request.version); },
      });
    }, [explorers, params.agentId, store]);
    // Right-sidebar panel only (the workspace tab gets no presence): this conversation's own panel, list or
    // workbench, counts as evidence only while it passes the on-screen check, and only for the same workspace.
    useEffect(() => presence?.register(params.agentId, () => rootRef.current, "explorer", workspaceId), [presence, params.agentId, workspaceId]);
    // Card "열림" state: this panel's on-screen version and layout, cleared in list mode and on unmount.
    const owner = useRef({}).current;
    useEffect(() => {
      const node = rootRef.current;
      if (!shownExplorers || !node) return;
      const update = () => shownExplorers.visible(params.agentId, owner, laidOut());
      update();
      const observer = typeof ResizeObserver === "function" ? new ResizeObserver(update) : undefined;
      observer?.observe(node);
      document.addEventListener("visibilitychange", update);
      return () => { observer?.disconnect(); document.removeEventListener("visibilitychange", update); shownExplorers.remove(params.agentId, owner); };
    }, [params.agentId]);
    const onShown = useCallback((shown: ShownVersion) => {
      if (shown.recordId !== selectedId.current) return;
      live.current = shown;
      shownExplorers?.set(params.agentId, owner, { recordId: shown.recordId, artifactId: shown.artifactId, version: shown.version, following: shown.following });
      const refresh = refreshing.current;
      // "refreshed" only for the right sidebar's own selection, on screen, in the foreground conversation now.
      if (refresh && client && shown.artifactId === refresh.artifactId && shown.version === refresh.version) {
        refreshing.current = null;
        if (laidOut() && isForegroundConversation(client, params.agentId, presence)) replyRefresh(client, refresh, "refreshed");
      }
      const pending = requests?.get(params.agentId);
      if (!pending || !client || !requests || acking.current === pending.requestId) return;
      if (shown.artifactId !== pending.artifactId || shown.version !== pending.version) return;
      if (typeof document === "undefined" || document.visibilityState !== "visible") return;
      acking.current = pending.requestId;
      void acknowledge(client, requests, pending).catch(() => {});
    }, [requests, client, params.agentId]);
    selectedId.current = selected?.id ?? null;
    if (live.current && live.current.recordId !== selectedId.current) live.current = null;
    useEffect(() => { if (!selected) shownExplorers?.set(params.agentId, owner, null); }, [selected?.id]);
    const select = useCallback((id: string) => { setDisplay(null); store.focus(id); tab.setState({ selectedArtifact: id }); }, [store, tab]);
    const { undo, setUndo, failure, setFailure, onDeleting, onDeleted, onDeleteFailed, restore } = useUndo(store, select);
    useEffect(() => { if (undo?.phase !== "deleted") return; const timer = setTimeout(() => setUndo(null), 10000); return () => clearTimeout(timer); }, [undo?.phase, setUndo]);
    const deleting = useCallback((artifactId: string, title: string) => { setWebLink(null); onDeleting(artifactId, title); }, [onDeleting]);
    const openUrl = useCallback((url: string) => { if (navigation?.openBrowser) navigation.openBrowser({ url, workspaceId }); else setWebLink(url); }, [navigation, workspaceId]);
    const management = useArtifactManagement({ store, record: selected, onSelect: select, onDeleting: deleting, onDeleted, onDeleteFailed, onWebUrl: openUrl });
    // Closes only this panel's own selected explorer tab; chat, other tabs and the artifact history stay.
    const [tabNotice, setTabNotice] = useState<string | null>(null);
    const closeTab = useMemo(() => options.closeTab ? () => {
      const result = closeExplorerTab(rootRef.current, params.agentId);
      setTabNotice(result === "closed" ? null : closeTabMessage(result));
    } : undefined, [params.agentId]);
    const requested = !!display && !!selected && (selected.artifactId === display.artifactId || selected.id === display.artifactId || selected.key === display.artifactId || !!selected.legacyIds?.includes(display.artifactId));
    if (layout.platform !== "web") return <Text style={{ color: theme.colors.foreground }}>{ui("Running previews are supported in Paseo desktop and web only.", "이 버전의 실행 미리보기는 Paseo 데스크톱·웹을 지원합니다.")}</Text>;
    return <div ref={rootRef} className="av-panel" style={{ color: theme.colors.foreground, background: theme.colors.surface0, "--av-panel-border": theme.colors.border, "--av-panel-raised": theme.colors.surface1 } as React.CSSProperties}>
      <style>{panelStyles}</style>
      {notice && <p className="av-panel-notice" role="status">{notice}</p>}
      {selected ? <div className="av-stage-host"><Workbench key={`${selected.id}:${requested ? display!.key : ""}`} record={selected} theme={theme} management={management} closeAs="list" onClose={() => { setDisplay(null); store.dismiss(); tab.setState({}); }}
        initialVersion={requested ? display!.version : undefined} onShown={onShown} onCloseTab={closeTab}
        artifactSwitcher={<ArtifactSwitcher records={ordered} selected={selected.id} onSelect={select} />}
        onRefreshHistory={() => void observer.current?.refresh()}
        onFix={async (current, error) => {
          await agent.send(artifactPrompt(current.artifactKey ?? (current.explicit ? current.id : `artifact-${Date.now().toString(36)}`), `${ui("Please fix this runtime error:", "다음 실행 오류를 고쳐 주세요:")}
${error}`, current, uiLocale()), { activeTurnBehavior: "steer" });
        }} /></div> : <div className="av-stage-host"><ListView theme={theme} records={ordered} onSelect={select} onCloseTab={closeTab} /></div>}
      {webLink && <div className="av-panel-bar" role="status" data-bar="web"><span>{ui("The web address is ready", "웹 주소를 준비했어요")}</span><ExternalLink href={webLink} accessibilityLabel={ui("Open on the web link", "웹에서 열기 링크")}>{ui("Open on the web", "웹에서 열기")}</ExternalLink><button type="button" className="av-bar-dismiss" aria-label={ui("Close web link", "웹 링크 닫기")} onClick={() => setWebLink(null)}>✕</button></div>}
      {tabNotice && <div className="av-panel-bar" role="alert" data-bar="close-tab"><span>{tabNotice}</span><button type="button" className="av-bar-dismiss" aria-label={ui("Dismiss tab notice", "탭 닫기 안내 닫기")} onClick={() => setTabNotice(null)}>✕</button></div>}
      {failure && !undo && <div className="av-panel-bar" role="alert" data-bar="delete-error"><span>{failure}</span><button type="button" className="av-bar-dismiss" aria-label={ui("Dismiss delete error", "삭제 오류 닫기")} onClick={() => setFailure(null)}>✕</button></div>}
      {undo && <div className="av-panel-bar" role="status" data-bar="undo" data-phase={undo.phase}><span>{undo.phase === "deleting" ? ui(`Deleting “${undo.title}”…`, `‘${undo.title}’ 삭제 중…`) : undo.phase === "restoring" ? ui(`Restoring “${undo.title}”…`, `‘${undo.title}’ 되돌리는 중…`) : undo.error ? `${ui("Could not undo.", "되돌리지 못했어요.")} ${undo.error}` : ui(`“${undo.title}” deleted`, `‘${undo.title}’ 삭제됨`)}</span><button type="button" aria-label={ui("Undo delete", "삭제 되돌리기")} disabled={undo.phase !== "deleted"} onClick={() => void restore()}>{ui("Undo", "되돌리기")}</button></div>}
    </div>;
  };
}
export function FilePanel({ file, tab, theme, layout }: PluginFilePanelProps) {
  useUiLocale();
  const [state, setState] = useState<EditorState>({ code: "", dirty: false, conflict: false, deleted: false, loading: true, saving: false, error: null });
  const [reset, setReset] = useState(0), controller = useRef<ReturnType<typeof createFileEditor> | null>(null);
  const store = useMemo(() => new ArtifactStore(), [file]);
  const fileVersion = useRef(0);
  const records = useSyncExternalStore(store.subscribe, store.snapshot, store.snapshot), kind = kindFromFilename(file.name);
  const modified = useRef(tab.setModified); modified.current = value => tab.setModified(value);
  useEffect(() => {
    if (file.size > MAX_SOURCE_LENGTH) { setState(old => ({ ...old, loading: false, error: ui("Previews support files up to 512KB.", "미리보기는 512KB 이하의 파일을 지원합니다.") })); return; }
    const current = createFileEditor(file, setState, value => modified.current(value)); controller.current = current;
    return () => { controller.current = null; current.dispose(); };
  }, [file]);
  useEffect(() => {
    if (!kind || state.loading || state.dirty || state.deleted || state.error) return;
    store.ingest([{ id: file.path, title: file.name, kind, code: state.code, complete: true, explicit: true }], `read:${++fileVersion.current}`, new Date().toISOString());
  }, [state.code, state.dirty, state.loading, state.deleted, state.error, kind, file, store]);
  if (layout.platform !== "web") return <Text style={{ color: theme.colors.foreground }}>{ui("Running previews are available in Paseo desktop and web.", "실행 미리보기는 Paseo 데스크톱·웹에서 사용할 수 있습니다.")}</Text>;
  return <div className="av-panel" style={{ color: theme.colors.foreground, background: theme.colors.surface0, "--av-panel-border": theme.colors.border, "--av-panel-raised": theme.colors.surface1 } as React.CSSProperties}>
    <style>{panelStyles}</style>
    {state.loading && <p role="status">{ui("Loading file…", "파일을 불러오는 중…")}</p>}
    {state.error && <p role="alert">{state.error}</p>}
    {(state.conflict || state.error) && <div className="av-panel-alert" role="alert">{state.conflict && <p>{ui("The file changed outside this panel. Your edits were kept and not overwritten.", "파일이 외부에서 변경되었습니다. 편집 내용은 보존했으며 덮어쓰지 않습니다.")}</p>}<button onClick={() => { void controller.current?.reload().then(() => setReset(value => value + 1)); }}>{ui("Discard edits and reload file", "편집 내용을 버리고 파일 다시 불러오기")}</button></div>}
    {records[0] && <div className="av-stage-host"><Workbench key={`${file.path}:${reset}`} record={records[0]} theme={theme} showSource saving={state.saving} conflict={state.conflict || state.deleted} onEdit={code => controller.current?.edit(code)} onSave={async () => await controller.current?.save() ?? false} /></div>}
  </div>;
}
