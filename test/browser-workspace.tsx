import { useLayoutEffect, useRef, useState, type ReactNode } from "react";
import { launchOptions, sessionId, workspaceId } from "./browser-host";

type Screen = { screenId: string; params: Record<string, string> };
const originHost = "test";
const alternateHost = "second-host";
const mode = new URLSearchParams(location.search).get("workspace-fixture");
const encoding = launchOptions.get("encoded-path");
const base64path = btoa(String.fromCharCode(...new TextEncoder().encode(workspaceId))).replaceAll("+","-").replaceAll("/","_").replace(/=+$/, "");
const workspaceSegment = encoding === "legacy" ? base64path : encoding === "v2" ? "b64_" + base64path : workspaceId;
const workspaceRoute = (host: string) => "/h/" + host + "/workspace/" + workspaceSegment;
export function screenRoute(host: string, screen: Screen) {
  const params = new URLSearchParams(Object.entries(screen.params).map(([key, value]) => ["param." + key, value]));
  return "/h/" + host + "/plugin/paseo-artifact-viewer/surface/" + screen.screenId + (params.size ? "?" + params : "");
}

function createHost() {
  const tabs = mode === "duplicate" ? ["first", "invoking"] : ["invoking"];
  const drafts = new Map([[alternateHost + ":" + sessionId, "다른 호스트의 초안"]]);
  let activeHost = originHost, selectedTab = tabs.at(-1)!, screen: Screen | null = null;
  let redraw = () => {}, evict: ReturnType<typeof setTimeout> | undefined;
  let mounted = true, mountCount = 0, olderRows = 0, outputRows = 0;
  const openCalls: string[] = [];
  function showWorkspace(host: string) {
    activeHost = host;
    screen = null;
    clearTimeout(evict);
    mounted = true;
    redraw();
  }
  function openScreen(next: Screen) {
    screen = next;
    history.pushState(null, "", screenRoute(activeHost, next));
    clearTimeout(evict);
    evict = setTimeout(() => { mounted = false; olderRows = 3; redraw(); }, 10 * 60_000);
    redraw();
  }
  history.replaceState(null, "", workspaceRoute(originHost));
  window.addEventListener("popstate", () => {
    const routeHost = /^\/h\/([^/]+)\/workspace\//.exec(location.pathname)?.[1];
    if (routeHost) { showWorkspace(routeHost); return; }
    const surface = /^\/h\/([^/]+)\/plugin\/paseo-artifact-viewer\/surface\/([^/]+)/.exec(location.pathname);
    if (surface) {
      const params = Object.fromEntries([...new URLSearchParams(location.search)]
        .filter(([key]) => key.startsWith("param.")).map(([key, value]) => [key.slice(6), value]));
      activeHost = surface[1];
      screen = {screenId: surface[2], params};
      redraw();
    }
  });
  return {
    tabs, drafts, openCalls, openScreen,
    get host() { return activeHost; }, get tab() { return selectedTab; }, get screen() { return screen; },
    get mounted() { return mounted; }, get mounts() { return mountCount; }, get olderRows() { return olderRows; },
    get outputRows() { return outputRows; }, appendOutput() { outputRows++; redraw(); },
    onMount() { mountCount++; },
    onRedraw(fn: () => void) { redraw = fn; },
    select(tab: string) { selectedTab = tab; redraw(); },
    openAgent({agentId, serverId}: {agentId: string; serverId?: string}) {
      if (agentId !== sessionId) throw Error("Unknown fixture agent " + agentId);
      // The host's SDK reveal chooses the first matching target, including duplicate tabs.
      const host = serverId ?? activeHost;
      selectedTab = tabs[0];
      openCalls.push(host + ":" + selectedTab);
      history.replaceState(null, "", workspaceRoute(host));
      showWorkspace(host);
    },
    changeHost() {
      if (!screen) throw Error("Host filter is only available on a plugin screen");
      activeHost = alternateHost;
      history.replaceState(null, "", screenRoute(activeHost, screen));
      redraw();
    },
  };
}
export const workspaceHost = mode ? createHost() : null;
type WorkspaceHost = NonNullable<typeof workspaceHost>;
function historyRows(start: number, count: number, range?: readonly number[]) {
  return Array.from({ length: count }, (_, i) => {
    const n = start + i, id = "chat-message-" + n;
    if (range && (n < range[0] || n > range[1])) return <div key={id} aria-hidden="true" style={{height: 55}} />;
    return <div key={id} data-history-row-id={id} data-message-id={id} style={{ height: 55 }}>대화 기록 {n}</div>;
  });
}
function ChatViewport({host, deckHost, children}: {host: WorkspaceHost; deckHost: string; children: ReactNode}) {
  const scroll = useRef<HTMLDivElement>(null);
  const draftKey = deckHost + ":" + sessionId;
  const [text, setText] = useState(() => host.drafts.get(draftKey) ?? "");
  const latest = useRef(text);
  const draftWrite = useRef(0);
  const virtual = launchOptions.has("virtual");
  const [firstRendered, setFirstRendered] = useState(0);
  const range = virtual ? [firstRendered - 6, firstRendered + 23] : undefined;
  const following = useRef(true);
  useLayoutEffect(() => {
    host.onMount();
    const node = scroll.current!;
    const bottom = () => {
      if (following.current) node.scrollTop = node.scrollHeight;
      if (virtual) setFirstRendered(Math.floor(node.scrollTop / 55) - host.olderRows);
    };
    const onWheel = (event: WheelEvent) => { if (event.deltaY < 0) following.current = false; };
    node.addEventListener("wheel", onWheel, {passive: true});
    bottom();
    const firstPaint = requestAnimationFrame(bottom);
    const settled = setTimeout(bottom, 200);
    return () => {
      node.removeEventListener("wheel", onWheel);
      cancelAnimationFrame(firstPaint); clearTimeout(settled);
      cancelAnimationFrame(draftWrite.current);
      host.drafts.set(draftKey, latest.current);
    };
  }, []);
  useLayoutEffect(() => {
    const node = scroll.current;
    if (node && following.current) node.scrollTop = node.scrollHeight;
  }, [host.outputRows]);
  return <>
    <div ref={scroll} id="agent-chat-scroll-web-dom-scroll" tabIndex={-1} data-testid="agent-chat-scroll"
      onScroll={event => { if (virtual) setFirstRendered(Math.floor(event.currentTarget.scrollTop / 55) - host.olderRows); }}
      style={{ overflowY: "auto", overflowAnchor: "none", flex: 1, minHeight: 0 }}>
      {historyRows(-host.olderRows, host.olderRows, range)}
      {historyRows(0, 34, range)}
      {range && (34 < range[0] || 34 > range[1]) ? <div aria-hidden="true" style={{height: 130}} /> :
        <div data-history-row-id="artifact-answer" data-message-id="message-1" data-plugin-row="true" style={{minHeight: 130}}>{children}</div>}
      {historyRows(34, 40 + host.outputRows, range)}
    </div>
    <textarea aria-label="메시지 초안" value={text} onChange={event => {
      latest.current = event.target.value;
      setText(latest.current);
      cancelAnimationFrame(draftWrite.current);
      draftWrite.current = requestAnimationFrame(() => host.drafts.set(draftKey, latest.current));
    }} />
  </>;
}
export function FixtureWorkspace({host, children}: {host: WorkspaceHost; children: ReactNode}) {
  // The original deck can be retained while a different plugin host is selected. Its props stay at the origin.
  const deckHost = host.screen ? originHost : host.host;
  return <div data-testid={"workspace-deck-entry-" + deckHost + ":" + workspaceId} hidden={!!host.screen}
    style={{display: host.screen ? "none" : "flex", height: "100%", flexDirection: "column"}}>
    <div data-testid="workspace-pane-main" style={{display: "flex", minHeight: 0, flex: 1, flexDirection: "column"}}>
      <div>{host.tabs.map(tab => <button key={tab} data-testid={"workspace-tab-agent_" + sessionId}
        aria-selected={host.tab === tab} onClick={() => host.select(tab)}>{tab}</button>)}</div>
      <ChatViewport key={deckHost + ":" + host.tab} host={host} deckHost={deckHost}>{children}</ChatViewport>
    </div>
  </div>;
}
export function FixtureSurfaceControls({host}: {host: WorkspaceHost}) {
  return <>
    <button aria-label="Close plugin" data-testid="plugin-surface-close" onClick={() => history.back()}>×</button>
    <button aria-label="테스트 호스트 변경" onClick={() => host.changeHost()}>호스트 변경</button>
  </>;
}
