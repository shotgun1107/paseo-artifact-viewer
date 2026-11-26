import { createElement, memo, useState } from "react";
import { createRoot } from "react-dom/client";
import contribute from "../index.client";
import { FixtureSurfaceControls, FixtureWorkspace, screenRoute, workspaceHost } from "./browser-workspace";
import { fingerprint } from "../shared/artifacts";
import { harnessState, entry, fileHandle, sessionId, agentHandle, SidebarItemTitle, launchOptions, workspaceId, i18n, resolveText } from "./browser-host";

// The workspace fixture has a real URL and browser history. Its launch flags are captured before navigation.
const options = launchOptions;
const remote = options.has("remote");
const initiallyEmpty = options.has("empty");
const registrations: Record<string, any[]> = {};
// Like the host, a changed transformer registration recomputes every timeline row (memoized rows included).
let transformerRevision = 0;
function register(group: string) {
  const groupItems = registrations[group] = [] as any[];
  const changed = () => { if (group === "transformers") { transformerRevision++; repaint(); } };
  return (item: any) => {
    groupItems.push(item); changed();
    return () => { const at = groupItems.indexOf(item); if (at >= 0) { groupItems.splice(at, 1); changed(); } };
  };
}
const seenNotices = new Map<string, string>();
const pills = new Map<string,any>();
const notices: any[] = [];
type Screen = { screenId: string; params: Record<string, string> };
let changeScreen = (_screen: Screen | null) => {}, repaint: () => void = () => {};
function screenFromUrl(): Screen | null {
  const screenId = /^\/h\/test\/plugin\/paseo-artifact-viewer\/surface\/([^/]+)$/.exec(location.pathname)?.[1];
  const params = Object.fromEntries([...new URLSearchParams(location.search)].filter(([k]) => k.startsWith("param.")).map(([k, v]) => [k.slice(6), v]));
  return screenId ? { screenId, params } : null;
}
if (!workspaceHost) window.addEventListener("popstate", () => changeScreen(screenFromUrl()));
const navigation = { openAgent(input: { agentId: string; serverId?: string }) {
  if (workspaceHost) { workspaceHost.openAgent(input); return; }
  if (!input.agentId || (input.serverId && input.serverId !== "test")) throw new Error("Invalid agent route");
  harnessState.agentOpens.push(input);
  harnessState.viewedAgent = input.agentId;
  history.replaceState(null, "", "/?" + launchOptions);
  changeScreen(null);
} };
let pressedPill: string | undefined;
let changeTheme = (_dark: boolean) => {};
function notify(event: any) {
  for (const listener of harnessState.listeners) listener({ agentId: sessionId, event });
}
async function call(name: string, input: any) {
  const res = await fetch("/rpc", { method: "POST", headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, input, sessionId, entries: harnessState.entries }) });
  const result = await res.json();
  if (!res.ok) throw new Error(result.error);
  if (name === "artifact.sidebar_ack") harnessState.sidebarReceipts.push(input);
  if (name === "artifact.sidebar_ack" && input.outcome === "opening" && result.output.accepted && harnessState.switchAfterClaim) {
    harnessState.switchAfterClaim = false;
    harnessState.foreground = false;
  }
  for (const item of result.notices) {
    const serialized = JSON.stringify(item);
    if (seenNotices.get(item.id) === serialized) continue;
    seenNotices.set(item.id, serialized);
    const prior = notices.findIndex(x => x.id === item.id);
    if (prior < 0) notices.push({ ...item, timestamp: new Date().toISOString() });
    else notices[prior] = { ...item, timestamp: notices[prior].timestamp };
    notify({ type: "timeline", item });
    repaint();
  }
  return result.output;
}
const client: any = {
  i18n,
  addScreen: register("screens"), addSidebarHeaderItem: register("header"),
  addAgentPanel: register("agent"), addFilePanel: register("file"),
  addSlashCommand: register("slash"), addCommandCenterItem: register("commands"),
  addTimelineTransformer: register("transformers"), addTimelineRenderer: register("renderers"),
  openScreen(input: { screenId: string; params?: Record<string, string> }) {
    if (!registrations.screens.some(screen => screen.id === input.screenId)) throw new Error("Unknown screen " + input.screenId);
    const params = { ...input.params };
    if (Object.values(params).some(value => typeof value !== "string")) throw new Error("Invalid SDK screen params");
    harnessState.screenOpens.push({ ...input, params });
    if (workspaceHost) workspaceHost.openScreen({ screenId: input.screenId, params });
    else {
      const screen = { screenId: input.screenId, params };
      history.pushState(null, "", screenRoute("test", screen));
      changeScreen(screen);
    }
  },
  openPanel(id: string, target: { workspaceId: string; agentId: string; location: string }) {
    const registration = registrations.agent.find(panel => panel.id === id && panel.locations.includes(target.location));
    if (!registration || target.location !== "explorer" || target.workspaceId !== workspaceId || target.agentId !== harnessState.viewedAgent)
      throw new Error("Unexpected explorer target " + JSON.stringify({ id, target }));
    harnessState.panelOpens.push({ id, ...target });
    harnessState.panel = registration;
    repaint();
  },
  paseo: { agents: {
    list: async () => ({ subscription: { subscribe: (observer: any) => observer.snapshot({ entries: [{ agent: { id: sessionId, workspaceId, status: "running" } }] }), release: async () => {} } }),
    ref: agentHandle,
  } },
};
if (options.has("sidebar")) {
  const mine = { context: "agent" }, other = { context: "agent" };
  harnessState.foreground = true;
  harnessState.sidebarReceipts = [];
  harnessState.composerVisible = false;
  client.addComposerPill = (item:any) => {
    pills.set(item.id,item); repaint();
    return {
      update: (patch:any) => { Object.assign(item.button,patch); repaint(); },
      remove: () => { pills.delete(item.id); repaint(); },
    };
  };
  client.composers = (selector: any) => selector.focused
    ? harnessState.foreground === false ? [other] : harnessState.onScreen || harnessState.foreground === "unknown" ? [] : [mine]
    : selector.agentId === sessionId ? (harnessState.foreground === "ambiguous" ? [mine,other] : [mine]) : [];
  const listening = new Set<string>();
  client.subscribe = (contract: { name: string }, _input: unknown, receive: (event: unknown) => void, callbacks?: {onClosed?: () => void}) => {
    if (!contract.name.startsWith("artifact.sidebar_")) return Object.assign(() => {}, { ready: Promise.resolve() });
    if (contract.name === "artifact.sidebar_requests") harnessState.loseLocalWaiting = callbacks?.onClosed;
    const stream = new EventSource("/sidebar-events/" + contract.name);
    const ready = new Promise<void>(done => { stream.onopen = () => { listening.add(contract.name); harnessState.listening = listening.size === 2; done(); }; });
    stream.onmessage = event => receive(JSON.parse(event.data));
    return Object.assign(() => stream.close(), { ready });
  };
}
// `placements`: the server-verified card placements are a fixture answer; every other RPC is the real server.
const placementRows: any[] = [], placementCalls: any[] = [];
if (remote) client.rpc = (contract: any, input: any) => {
  if (options.has("placements") && contract.name === "artifact.card_placements") { placementCalls.push(input); return Promise.resolve().then(() => contract.output.parse({ items: placementRows.filter(row => !input.sessionId || row.sessionId === input.sessionId), sessions: [sessionId] })); }
  return call(contract.name, input);
};
harnessState.panelOpens = [];
harnessState.screenOpens = [];
harnessState.agentOpens = [];
harnessState.viewedAgent = sessionId;
contribute(client);
const colors = { foreground: "#222", foregroundMuted: "#777", surface0: "#fff", surface1: "#f8f8f6", surface2: "#efefec", border: "#ddd", accent: "#386c61", accentForeground: "#fff", statusSuccess: "#39765d", statusWarning: "#a97523", statusDanger: "#b8453c" };
const base: any = { navigation, theme: { colors }, host: { id: "test", label: "테스트" }, layout: { platform: "web", compact: false }, workspaceId, revision: 1, params: { agentId: sessionId }, agentId: sessionId, context: "agent",
  tab: { setModified(value: boolean) { harnessState.modified = value; }, setState(value: any) { this.state = value; }, state: undefined } };
const testFile = fileHandle();
const counter = '<!doctype html><button id="counter" onclick="this.textContent=Number(this.textContent)+1">0</button>';
const reactCounter = 'import React,{useState} from "react"; export default function App(){const [n,setN]=useState(0);return <button id="react-counter" onClick={()=>setN(n+1)}>{n}</button>}';
if (!initiallyEmpty && !options.has("unseeded") && !options.has("placements")) harnessState.entries.push(options.has("react") ? entry("message-1", "tsx", reactCounter, "react-counter") : entry("message-1", "html", counter));

if (options.has("placements")) {
  // A conversation recorded before 0.9.2: an old answer with a saved result, a newer unrelated answer, and the
  // standalone rows the old versions appended at the end (one without any placement, one a duplicate), plus one
  // card published live in the current version.
  const push = (id: string, text: string) => { const seq = harnessState.entries.length; harnessState.entries.push({ seqStart: seq, seqEnd: seq, timestamp: new Date().toISOString(), provider: "fixture", item: { type: "assistant_message", messageId: id, text } }); };
  const oldText = "예전 질문에 대한 답변입니다.", lastText = "마지막 일반 답변입니다.";
  push("old-answer", oldText); push("last-answer", lastText);
  const data = (artifactId: string, title: string, extra: object = {}) => ({ artifactId, artifactVersion: 1, title, format: "html", originKind: "extract", ...extra });
  const row = (id: string, value: object) => ({ type: "plugin", id, pluginId: "paseo-artifact-viewer", kind: "artifact", version: 1, data: value, timestamp: new Date().toISOString() });
  notices.push(row("legacy-a", data("art-old", "옛 결과", { placement: "legacy" })), row("legacy-b", data("art-old", "옛 결과")), row("legacy-c", data("art-old", "옛 결과", { placement: "legacy" })), row("live-b", data("art-live", "새 결과", { placement: "live" })));
  const proven = { sessionId, messageId: "old-answer", textHash: fingerprint(oldText), notice: data("art-old", "옛 결과", { placement: "legacy" }) };
  placementRows.push(proven, { ...proven }, { ...proven, messageId: "last-answer", textHash: "not-this-text", notice: data("art-wrong", "엉뚱한 결과", { placement: "legacy" }) });
  (window as any).placementCalls = placementCalls;
}
const TimelineRow = memo(function TimelineRow({ item, timestamp, phase }: { item: any; timestamp: string; phase?: string; revision?: number }) {
  const transformed = item.type === "plugin" ? [item] : registrations.transformers
    .filter(transformer => transformer.query.itemType === item.type)
    .flatMap(transformer => transformer.transform({ item, phase: phase ?? "complete" })?.items ?? []);
  if (item.type === "assistant_message" && !transformed.length) return <p>{item.text}</p>;
  return transformed.map((visible: any, i: number) => {
    const renderer = registrations.renderers.find(r => r.kind === visible.kind && r.version === visible.version);
    if (!renderer) throw new Error("Missing renderer for " + visible.kind);
    const data = renderer.schema.parse(visible.data);
    return createElement(renderer.Component, { ...base, key: i, timestamp: new Date(timestamp), item: { ...visible, data } });
  });
});
function App() {
  const [basicScreen, setScreen] = useState<Screen | null>(screenFromUrl);
  const [dark, setDark] = useState(false);
  const [, setRevision] = useState(0);
  repaint = () => setRevision(n => n + 1);
  const screen = workspaceHost ? workspaceHost.screen : basicScreen;
  workspaceHost?.onRedraw(() => { harnessState.onScreen = !!workspaceHost?.screen; repaint(); });
  changeScreen = next => { harnessState.onScreen = !!next; setScreen(next); };
  changeTheme = setDark;
  const hostProps = {
    host: workspaceHost ? { id: workspaceHost.host, label: workspaceHost.host } : base.host, layout: base.layout,
    theme: { colors: dark ? { ...colors, surface0: "#151515", foreground: "#f0efec" } : colors },
  };
  const screenItem = screen && registrations.screens.find(item => item.id === screen.screenId);
  const file = options.has("file") && registrations.file.find(p => p.files.extensions.includes(testFile.extension));
  const timeline = <article style={{ flex: 1, minWidth: 0, overflow: "auto" }} data-testid="timeline" data-session={harnessState.viewedAgent}>
      {harnessState.viewedAgent === sessionId && <>
      {harnessState.entries.map((value: any) => <TimelineRow key={value.item.messageId} item={value.item} timestamp={value.timestamp} phase={value.phase} revision={transformerRevision} />)}
      {(!options.has("sidebar") || options.has("answer-cards")) && notices.map(item => <TimelineRow key={item.id} item={item} timestamp={item.timestamp} revision={transformerRevision} />)}
      {harnessState.composerVisible && [...pills.values()].filter(p => p.workspaceId === base.workspaceId && p.agentId === sessionId).map(p =>
        <button key={p.id} aria-label={resolveText(p.button.title)} disabled={p.button.disabled} onClick={() => {
          pressedPill=p.id;
          p.button.behavior.onPress();
          repaint();
          setTimeout(() => { pressedPill=undefined; repaint(); },100);
        }}>
          <span aria-hidden="true" style={{pointerEvents:"none"}}>
            {pressedPill===p.id ? "…" : typeof p.button.icon === "function" && createElement(p.button.icon, { ...base, size:16, color:"#222" })}
          </span>
          {resolveText(p.button.label)}
        </button>)}
      </>}
    </article>;
  return <div style={{ height: "100vh", display: "flex", fontFamily: "sans-serif" }}>
    <nav aria-label="호스트 사이드바" style={{ flex: "none", maxWidth: "16vw", overflow: "hidden" }}>
      {registrations.header.map(item => <SidebarItemTitle.Provider key={item.id} value={resolveText(item.title)}>
        {createElement(item.Component, { ...hostProps, currentScreen: screen, openScreen: client.openScreen })}
      </SidebarItemTitle.Provider>)}
    </nav>
    <main data-testid="host-main" style={{ flex: 1, minWidth: 0, height: "100%", display: "flex", flexDirection: "column" }}>
    {screen && screenItem ? <div data-testid="artifact-screen" style={{ flex: 1, minHeight: 0, minWidth: 0 }}>
      {workspaceHost && <FixtureSurfaceControls host={workspaceHost} />}
      {createElement(screenItem.Component, { ...hostProps, navigation, key: hostProps.host.id + ":" + screen.screenId, params: screen.params })}
    </div> : file ? createElement(file.Component, { ...base, ...hostProps, file: testFile, params: { path: testFile.path } })
    : null}
    {workspaceHost
      ? workspaceHost.mounted && <FixtureWorkspace host={workspaceHost}>{timeline}</FixtureWorkspace>
      : !screen && !file && timeline}

    </main>
    {!screen && !file && harnessState.panel && <aside data-testid="workspace-explorer-sidebar"
      style={{ width: "min(520px, max(300px, 42vw))", maxWidth: "84vw", flexShrink: 0, display: "flex", flexDirection: "column" }}>
      <div onAuxClick={event => {
        if (event.button === 1) { event.preventDefault(); harnessState.panel = null; base.tab.state = undefined; repaint(); }
      }}>
        <button aria-selected="true" data-testid={`workspace-tab-plugin_agent_21_paseo-artifact-viewer_9_artifacts_${sessionId.length}_${sessionId}`}>아티팩트</button>
      </div>
      <div data-testid="explorer-content" style={{ flex: 1, minHeight: 0 }}>
        {createElement(harnessState.panel.Component, { ...base, ...hostProps })}
      </div>
    </aside>}
  </div>;
}

let streaming: any;
(window as any).fixture = {
  finishAnswer: (text:string) => {
    const seq=harnessState.entries.length;
    harnessState.entries.push({seqStart:seq,seqEnd:seq,timestamp:new Date().toISOString(),provider:"fixture",item:{type:"assistant_message",messageId:"plain-answer",text}});
    repaint();
  },
  showComposer: (value:boolean) => { harnessState.composerVisible=value; repaint(); },
  workspaceHost, state: harnessState, setDark: (dark: boolean) => changeTheme(dark),
  openSlash: (args = "", name = "artifact") => registrations.slash.find(command => command.name === name).onSubmit({ ...base, agent: { id: sessionId }, openScreen: client.openScreen, openPanel: client.openPanel, paseo: client.paseo, args }),
  openCommand: () => registrations.commands[0].onSelect({ ...base, agent: { id: sessionId }, openScreen: client.openScreen, openPanel: client.openPanel }),
  restoreScreen: client.openScreen,
  syncRemote: () => call("artifact.list", { sessionId }),
  async append(language: string, code: string, id = "counter") {
    harnessState.entries.push(entry("message-" + (harnessState.entries.length + 1), language, code, id));
    if (remote) await call("artifact.backfill", { sessionId });
    notify({ type: "turn_completed" });
    repaint();
  },
  streamHtml(code: string, finish = false) {
    if (!streaming) { streaming = entry("streamed-message", "html", code); harnessState.entries.push(streaming); }
    streaming.phase = finish ? "complete" : "streaming";
    streaming.item = { ...streaming.item };
    streaming.item.text = '```html artifact="counter" title="테스트 결과"\n' + code + (finish ? '\n```' : '');
    notify(finish ? { type: "turn_completed" } : { type: "timeline", item: streaming.item });
    repaint();
  },
  externalFile(code: string) {
    harnessState.fileText = code;
    for (const listener of harnessState.fileWatchers) listener({ type: "changed" });
  },
};
async function mount() {
  // The provider turn arrives before the user opens a historical conversation.
  if (remote && !options.has("running")) await call("artifact.backfill", { sessionId });
  createRoot(document.getElementById("root")!).render(<App />);
}
void mount();
