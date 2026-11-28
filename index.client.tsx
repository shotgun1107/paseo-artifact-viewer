import { useEffect, useMemo, useRef, useState, useSyncExternalStore } from "react";
import { Text, View } from "react-native";
import { z } from "zod";
import { Markdown } from "@getpaseo/plugin/client/ui";
import { useComposer, type PluginClientContext, type PluginTimelineItemProps } from "@getpaseo/plugin/client";
import { artifactMessageText, artifactPrompt, extractArtifacts, fingerprint } from "./src/shared/artifacts";
import { getArtifactGuide } from "./src/shared/agent-guide";
import { artifactSetLocale } from "./src/shared/locale";
import { configureUiLocale, subscribeUiLocale, ui, uiLocale, useUiLocale, type UiLocale } from "./src/client/ui-locale";
import { messages } from "./src/client/messages";
import { createStoreRegistry } from "./src/client/store";
import { createAgentPanel, FilePanel } from "./src/client/panels";
import { RemoteArtifactStore } from "./src/client/remote-store";
import { artifactCardPlacements, artifactCardPlacementsChanged, noticeSchema } from "./src/shared/contracts";
import { findRecord, ResultCard, useCardState } from "./src/client/result-card";
import { createPlacementIndex, visiblePlacements } from "./src/client/placements";
import { createCardPicks, createShownExplorers, useCardShown } from "./src/client/card-open";
import { createPresence, usePresence } from "./src/client/presence";
import { isForegroundConversation, createExplorers, createSidebarRequests, receiveSidebarRefresh, receiveSidebarRequests } from "./src/client/sidebar";
import { registerCardAnchor, workspaceRoute } from "./src/client/origin";
import { createLibraryMenu, createLibraryNav, createLibraryScreen, LIBRARY_SCREEN_ID, libraryScreenTitle } from "./src/client/library";

const placedSchema = z.object({ sessionId: z.string(), blockIndex: z.number().int().nonnegative().optional(), notice: noticeSchema });
const messageSchema = z.object({ text: z.string(), source: z.string(), streaming: z.boolean(), placed: z.array(placedSchema).default([]) });
type Notice = z.output<typeof noticeSchema>;
export default function contribute(client: PluginClientContext) {
  const picks = createCardPicks(), shown = createShownExplorers(), sidebar = createSidebarRequests(), explorers = createExplorers(), presence = createPresence(), nav = createLibraryNav();
  // The app language is the only language source. The server learns it once a real locale is known (and on each
  // change) so its agent guide, tool texts and prompts follow; a failed report is retried, never assumed delivered.
  // One report in flight at a time, always the newest selection: a flip while a call is pending is sent after it
  // settles, so calls reach the server in order and the last chosen language is what it keeps.
  let sentLocale: UiLocale | undefined, localeRetry: ReturnType<typeof setTimeout> | undefined, stopped = false, reporting = false;
  const reportLocale = (attempt = 0) => {
    if (stopped || reporting || typeof client.rpc !== "function" || !client.i18n?.locale) return;
    const locale = uiLocale();
    if (sentLocale === locale) return;
    clearTimeout(localeRetry); reporting = true;
    void client.rpc(artifactSetLocale, { locale }).then(() => { sentLocale = locale; reporting = false; reportLocale(); }, error => {
      reporting = false;
      console.error("artifact locale report failed", error);
      if (!stopped && attempt < 5) localeRetry = setTimeout(() => reportLocale(attempt + 1), 1000 * 2 ** attempt);
    });
  };
  // Every language change reaches the store, whether the SDK instance can be subscribed to or only a mounted
  // component's host useTranslation notices it (the always-mounted sidebar item keeps that hook alive).
  const stopLocale = configureUiLocale(client.i18n, () => reportLocale());
  const stopLocaleListener = subscribeUiLocale(() => reportLocale());
  // Saved cards proven to belong to an original reply. The host transformer is synchronous and sees one reply
  // at a time, so it reads this per-host index; a changed index re-registers the transformer (below).
  const placements = createPlacementIndex(async sessionId => typeof client.rpc === "function" ? await client.rpc(artifactCardPlacements, sessionId ? { sessionId } : {}) : { items: [] });
  const registry = createStoreRegistry(typeof client.rpc === "function" ? agentId => new RemoteArtifactStore(agentId, client.rpc.bind(client)) : undefined);
  // Card press: this conversation's own right-sidebar (explorer) panel shows exactly this artifact/version and the
  // chat stays. The press only records the pick; the panel applies it once and reports what is really on screen.
  // The workspace is the agent's own (else the one in the URL for this host); never another conversation.
  let latestPress = 0;
  const openCard = (serverId: string, agentId: string, anchor: unknown, id: string, version: number | undefined, fail: (message: string | null) => void) => {
    const press = ++latestPress, route = workspaceRoute(), here = route && route.serverId === serverId ? route : null;
    fail(null);
    const open = (workspaceId: string) => {
      picks.put(agentId, id, version);
      registry.forAgent(agentId).focus(id, version);
      try { client.openPanel("artifacts", { workspaceId, agentId, location: "explorer" }); }
      catch (error) { picks.drop(agentId); console.error("failed to open the artifact panel", error); fail(ui("Could not open the right panel. Please press again in a moment.", "오른쪽 패널을 열지 못했어요. 잠시 후 다시 눌러 주세요.")); }
    };
    const known = client.paseo.agents.ref(agentId).workspaceId ?? here?.workspaceId;
    if (known) { open(known); return; }
    // Async lookup: a late result opens only for the newest press, this same card still on screen, the same
    // host/workspace page, and this conversation still in the foreground.
    const agent = client.paseo.agents.ref(agentId);
    void agent.refresh().then(result => {
      const workspaceId = result?.agent.workspaceId ?? agent.workspaceId;
      const now = workspaceRoute();
      if (press !== latestPress || !workspaceId) { if (!workspaceId && press === latestPress) fail(ui("Could not find this conversation's workspace.", "이 대화의 작업공간을 찾지 못했어요.")); return; }
      if (anchor instanceof Element && !anchor.isConnected) return;
      if (here ? now?.serverId !== here.serverId || now.workspaceId !== here.workspaceId : !!now && now.serverId !== serverId) return;
      if (!isForegroundConversation(client, agentId, presence)) return;
      open(workspaceId);
    }).catch(error => { if (press === latestPress) { console.error("artifact workspace lookup failed", error); fail(ui("Could not open the right panel. Please press again in a moment.", "오른쪽 패널을 열지 못했어요. 잠시 후 다시 눌러 주세요.")); } });
  };
  function NoticeCard({ agentId, data, theme, host }: { agentId: string; data: Notice; theme: PluginTimelineItemProps<unknown>["theme"]; host: PluginTimelineItemProps<unknown>["host"] }) {
    useUiLocale();
    const store = registry.forAgent(agentId), { record } = useCardState(store, data.artifactId);
    const open = useCardShown(shown, agentId, [data.artifactId, record?.id, record?.artifactId], data.artifactVersion);
    const anchor = useRef<View>(null), [notice, setNotice] = useState<string | null>(null);
    usePresence(presence, agentId, anchor);
    useEffect(() => registerCardAnchor(agentId, () => anchor.current), [agentId]);
    // Cards mounting together share one read; it repeats only if its answer lacks the version this card shows.
    useEffect(() => { void store.refreshPersistent?.({ observe: true, know: { artifactId: data.artifactId, version: data.artifactVersion } }).catch(() => {}); }, [agentId, data.artifactId, data.artifactVersion]);
    const deleted = !!data.deleted || !!store.isDeleted?.(data.artifactId), title = record?.title || data.title || ui("Artifact", "아티팩트");
    return <View ref={anchor}>
      <ResultCard theme={theme} title={title} format={data.format} meta={`v${data.artifactVersion}${data.originKind === "edit" ? ` · ${ui("edited", "편집됨")}` : ""}`} open={open} pinned={record?.pinned ?? data.pinned} deleted={deleted}
        accessibilityLabel={ui(`Open saved artifact ${title}`, `${title} 저장된 아티팩트 열기`)} onPress={() => openCard(host.id, agentId, anchor.current, data.artifactId, data.artifactVersion, setNotice)} />
      {!!notice && <Text accessibilityRole="alert" style={{ color: "#be6542", fontSize: 12, marginTop: 4 }}>{notice}</Text>}
    </View>;
  }
  // A standalone row is only a live publish of this turn. Rows from older versions (no placement, or "legacy")
  // were appended after the conversation and are shown under their original reply instead; they render nothing.
  function PublishedArtifact({ agentId, item, theme, host }: PluginTimelineItemProps<z.output<typeof noticeSchema>>) {
    useSyncExternalStore(placements.subscribe, placements.snapshot, placements.snapshot);
    useEffect(() => { void placements.ensure(agentId); }, [agentId]);
    const { artifactId, artifactVersion, placement } = item.data;
    if (placement !== "live" || placements.projected(agentId, artifactId, artifactVersion)) return null;
    return <NoticeCard agentId={agentId} data={item.data} theme={theme} host={host} />;
  }
  function MessageCard({ agentId, serverId, source, theme, artifact, streaming, saved }: { agentId: string; serverId: string; source: string; theme: PluginTimelineItemProps<unknown>["theme"]; artifact: ReturnType<typeof extractArtifacts>[number]; streaming: boolean; saved?: Notice }) {
    useUiLocale();
    // `saved`: the server proved this very block is that stored artifact version (the same card, never a second one).
    const store = registry.forAgent(agentId), { record } = useCardState(store, saved?.artifactId ?? artifact.id);
    // This code block's own stored version, when the store linked it; otherwise the card means "latest".
    const version = saved?.artifactVersion ?? record?.versions.find(value => value.source === source)?.artifactVersion;
    const open = useCardShown(shown, agentId, [artifact.id, record?.id, record?.artifactId], version);
    const title = record?.title ?? saved?.title ?? artifact.title, done = artifact.complete && !streaming;
    const deleted = !!saved?.deleted || !!store.isDeleted?.(saved?.artifactId ?? artifact.id) || !!(record?.artifactId && store.isDeleted?.(record.artifactId));
    const anchor = useRef<View>(null), [notice, setNotice] = useState<string | null>(null);
    usePresence(presence, agentId, anchor);
    useEffect(() => registerCardAnchor(agentId, () => anchor.current), [agentId]);
    return <View ref={anchor}>
      <ResultCard theme={theme} title={title} format={artifact.kind === "react" ? "react" : "html"} meta={done ? (saved ? `v${saved.artifactVersion}` : record?.headVersion ? `v${record.headVersion}` : ui("Artifact", "아티팩트")) : ui("Writing…", "작성 중…")} open={open} pinned={record?.pinned ?? saved?.pinned} deleted={deleted} disabled={!done && !record && !saved}
        accessibilityLabel={ui(`Open artifact ${artifact.title}`, `${artifact.title} 아티팩트 열기`)} onPress={() => openCard(serverId, agentId, anchor.current, saved?.artifactId ?? record?.artifactId ?? record?.id ?? artifact.id, version, setNotice)} />
      {!!notice && <Text accessibilityRole="alert" style={{ color: "#be6542", fontSize: 12, marginTop: 4 }}>{notice}</Text>}
    </View>;
  }
  function ArtifactMessage({ agentId, item, theme, timestamp, host }: PluginTimelineItemProps<z.output<typeof messageSchema>>) {
    const locale = useUiLocale();
    const store = registry.forAgent(agentId);
    const records = useSyncExternalStore(store.subscribe, store.snapshot, store.snapshot);
    const artifacts = useMemo(() => extractArtifacts(item.data.text, item.data.source, locale), [item.data.text, item.data.source, locale]);
    const prose = useMemo(() => artifactMessageText(item.data.text, artifacts), [item.data.text, artifacts]);
    useEffect(() => { registry.forAgent(agentId).ingest(artifacts, item.data.source, timestamp.toISOString(), item.data.streaming); }, [agentId, artifacts, item.data.source, item.data.streaming, timestamp]);
    useEffect(() => { void placements.ensure(agentId); }, [agentId]);
    // Saved cards of this very reply: one replaces a fenced block's card, the rest follow the reply.
    const { forBlock, extra } = visiblePlacements(item.data.placed, agentId, artifacts.length, artifacts.map(artifact => findRecord(records, artifact.id)?.artifactId));
    return <View style={{ gap: 8 }}>
      {!!prose && <Markdown>{prose}</Markdown>}
      {artifacts.map((artifact, index) => <MessageCard key={artifact.id} agentId={agentId} serverId={host.id} source={item.data.source} theme={theme} artifact={artifact} streaming={item.data.streaming} saved={forBlock.get(index)} />)}
      {extra.map(notice => <NoticeCard key={`${notice.artifactId}:${notice.artifactVersion}`} agentId={agentId} data={notice} theme={theme} host={host} />)}
    </View>;
  }
  // The one-time on-open load for conversations that show no artifact row or fenced block of their own: the
  // composer item is mounted with every conversation. It identifies its conversation by the composer object
  // the host hands out for that agent id, from the ids this window has seen; unproven or ambiguous = no load.
  const knownAgents = new Set<string>(), agentListeners = new Set<() => void>();
  let knownRevision = 0;
  const noteAgent = (id: string) => { if (knownAgents.has(id)) return; knownAgents.add(id); knownRevision++; for (const listener of [...agentListeners]) listener(); };
  const watchAgents = (listener: () => void) => { agentListeners.add(listener); return () => { agentListeners.delete(listener); }; };
  function PlacementBootstrap() {
    const composer = useComposer(), seen = useSyncExternalStore(watchAgents, () => knownRevision, () => knownRevision);
    useEffect(() => {
      if (composer.context !== "agent") return;
      try {
        const mine = [...knownAgents].filter(id => client.composers({ agentId: id }).includes(composer));
        if (mine.length === 1) void placements.ensure(mine[0]);
      } catch (error) { console.error("artifact placement bootstrap failed", error); }
    }, [composer, seen]);
    return null;
  }
  // The transformer reads the placement index. The host recomputes the timeline whenever a contribution is
  // registered, so a changed index re-registers it (coalesced), which is how a loaded conversation's rows change.
  const transformer = () => ({ id: "artifact-cards", query: { itemType: "assistant_message" as const }, transform: ({ item, phase }: { item: { messageId?: string; text: string }; phase: "streaming" | "complete" }) => {
    if (!item.messageId && phase === "streaming") return undefined;
    const source = item.messageId ? `msg:${item.messageId}` : `text:${fingerprint(item.text)}`;
    const placed = item.messageId ? placements.lookup(item.messageId, item.text) : [];
    if (!placed.length && !extractArtifacts(item.text, source, uiLocale()).length) return undefined;
    return { items: [{ type: "plugin" as const, kind: "artifact-message", version: 1, data: { text: item.text, source, streaming: phase === "streaming", placed } }] };
  } });
  let removeTransformer = client.addTimelineTransformer(transformer()), refreshTimer: ReturnType<typeof setTimeout> | undefined;
  const stopPlacements = placements.subscribe(() => {
    if (stopped || refreshTimer) return;
    refreshTimer = setTimeout(() => { refreshTimer = undefined; if (stopped) return; removeTransformer(); removeTransformer = client.addTimelineTransformer(transformer()); }, 0);
  });
  const cleanup = [
    client.addAgentPanel({ id: "artifacts", title: messages.message("artifacts"), icon: "PanelsTopLeft", locations: ["explorer"], Component: createAgentPanel(registry, client, sidebar, explorers, presence, { closeTab: true, picks, shown }) }),
    // Host-wide library: left "아티팩트" menu → gallery and full detail in the main area (library clicks only).
    client.addScreen({ id: LIBRARY_SCREEN_ID, title: libraryScreenTitle, Component: createLibraryScreen({ client, registry, nav, requests: sidebar, shown, explorers }) }),
    client.addSidebarHeaderItem({ id: "artifact-library", title: messages.message("artifacts"), Component: createLibraryMenu(nav) }),
    // Workspace tab keeps the same panel, without sidebar requests, acks or the explorer registry.
    client.addAgentPanel({ id: "artifacts-workspace", title: messages.message("artifacts"), icon: "PanelsTopLeft", locations: ["workspace"], Component: createAgentPanel(registry, client) }),
    client.addFilePanel({ id: "artifact-file", title: messages.message("preview"), icon: "PanelsTopLeft", files: { extensions: ["html", "htm", "svg", "jsx", "tsx"] }, Component: FilePanel }),
    client.addCommandCenterItem({ id: "open-artifacts", title: messages.message("openLibrary"), icon: "PanelsTopLeft", context: "agent", keywords: ["artifact", "preview", "library", "미리보기", "보관함", "React", "HTML"], onSelect: ({ openScreen }) => nav.open(openScreen) }),
    client.addSlashCommand({ name: "artifact", description: messages.message("slashArtifact"), argumentHint: messages.message("slashArtifactHint"), context: "agent", onSubmit: async context => {
      // No argument: the library. With one: send the request and stay in the conversation (the card appears there).
      if (!context.args.trim()) { nav.open(target => context.openScreen(target)); return; }
      await context.paseo.agents.ref(context.agent.id).send(artifactPrompt(`artifact-${Date.now().toString(36)}`, context.args, undefined, uiLocale()), { activeTurnBehavior: "steer" });
    } }),
    client.addSlashCommand({ name: "artifact-guide", description: messages.message("slashGuide"), argumentHint: messages.message("slashGuideHint"), context: "agent", onSubmit: async context => {
      // Only sends text to the current agent; no tool run, screen open or fabricated result.
      const request = context.args.trim();
      const guide = getArtifactGuide(uiLocale());
      const text = request
        ? `${guide}\n\n---\n${ui("Carry out the request below following the guide above.", "아래 요청을 위 가이드에 따라 수행하세요.")}\n\n${request}`
        : `${guide}\n\n---\n${ui("Apply the guide above to this conversation from now on. Do not start any work now; just reply with a short confirmation that you applied it.", "위 가이드를 이 대화에서 앞으로 적용하세요. 지금은 작업하지 말고 적용했다고 짧게 확인만 답하세요.")}`;
      await context.paseo.agents.ref(context.agent.id).send(text, { activeTurnBehavior: "steer" });
    } }),
    () => removeTransformer(),
    client.addTimelineRenderer({ kind: "artifact-message", version: 1, schema: messageSchema, Component: ArtifactMessage }),
    client.addTimelineRenderer({ kind: "artifact", version: 1, schema: noticeSchema, Component: PublishedArtifact }),
  ];
  if (typeof client.addComposerItem === "function") cleanup.push(client.addComposerItem({ id: "artifact-placements", Component: PlacementBootstrap }));
  // Start of this window (install, reload, reconnect all run this again): the sessions that have saved artifacts
  // are the only ones a composer is matched against. A server invalidation reads that conversation again,
  // whether or not it has a composer on screen (archived conversations included).
  if (typeof client.rpc === "function") {
    void placements.bootstrap().then(ids => { for (const id of ids) noteAgent(id); }).catch(error => console.error("artifact placement bootstrap failed", error));
    if (typeof client.subscribe === "function") {
      const handle = client.subscribe(artifactCardPlacementsChanged, {}, event => { noteAgent(event.sessionId); void placements.refresh(event.sessionId); });
      cleanup.push(() => handle());
    }
  }
  // Agent-requested sidebar opens arrive over the plugin subscription, independent of timeline cards.
  if (typeof client.subscribe === "function") {
    // An accepted server request supersedes an unapplied card press for that conversation.
    // Explicit opens use the same right-sidebar panel only for the foreground conversation.
    const handle = receiveSidebarRequests(client, registry, sidebar, { presence, onAccepted: request => picks.drop(request.sessionId) });
    cleanup.push(() => handle());
    // Newer versions update an explorer already showing that artifact; never opens a panel.
    const refresh = receiveSidebarRefresh(client, explorers, presence);
    cleanup.push(() => refresh());
  }
  return async () => { stopped = true; clearTimeout(localeRetry); clearTimeout(refreshTimer); stopPlacements(); placements.dispose(); stopLocale(); stopLocaleListener(); for (const remove of cleanup.reverse()) await remove(); picks.clear(); sidebar.clear(); registry.dispose(); };
}
