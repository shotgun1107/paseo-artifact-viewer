/**
 * Chat → full detail → X: return to the exact place the user left, using only what Paseo 0.16.1 really
 * renders on web (host sources, see artifacts/artifact-viewer/0.6.0/session-return-evidence.md):
 * - workspace route `/h/<encodedServer>/workspace/<workspaceSegment>` (segment decoded like host-routes.ts);
 * - plugin screen route `/h/<server>/plugin/<plugin>/surface/<screen>?param.<key>=…`, pushed with router.push;
 *   the host switcher replaces it (router.replace) with another server in the path;
 * - deck `[data-testid="workspace-deck-entry-<server>:<workspace>"]` › pane `[data-testid^="workspace-pane-"]`
 *   › selected chip `[data-testid="workspace-tab-agent_<agentId>"][aria-selected="true"]`;
 * - timeline viewport `[data-testid="agent-chat-scroll"]`, rows `[data-history-row-id]`.
 *
 * Captured at the moment of entry (card press / explicit open), never at X. history.state / idx and
 * history.length are never used as proof; the Web Navigation API is read (never driven). Drafts are never
 * touched (the host restores them by server+agent key). Nothing is written to the DOM besides the restored
 * scrollTop of a proven viewport.
 */
const WINDOW_ID = (() => { try { return crypto.randomUUID(); } catch { return `${Date.now()}-${Math.random()}`; } })();
/** Really at the bottom (host strategy-web: ≤1px). 2..64px may already be detached reading: kept as middle. */
const BOTTOM_PX = 1;

export interface ReadingPosition {
  /** The viewport node itself: identity is the strongest proof that the host retained it. */
  viewport: Element;
  deck: string; pane: string;
  /** Host follows the bottom: leave it to the host. */
  atBottom: boolean;
  /** Original scrollTop, re-applied first on a remounted viewport so a virtualized anchor row renders. */
  scrollTop: number;
  /** Middle reading: first row whose bottom is below the viewport top, and its viewport-relative top. */
  rowId?: string; offset?: number;
  /** The anchor row's virtualizer `data-index`, to search toward it when it is not mounted. */
  rowIndex?: number;
}
export interface Origin {
  windowId: string; serverId: string; agentId: string; workspaceId: string;
  /** pathname + search + hash of the workspace route the user was on. */
  route: string;
  /** Web Navigation API entry of the origin. Without it X never pops. */
  entry?: { key: string; id: string; url: string };
  reading?: ReadingPosition;
  /** Filled when the screen first mounts for this entry: the pushed screen URL. */
  screenRoute?: string;
}

const origins = new Map<string, Origin>();
const remember = (nonce: string, origin: Origin) => { origins.set(nonce, origin); if (origins.size > 20) origins.delete(origins.keys().next().value!); };

const here = () => typeof location === "undefined" ? "" : location.pathname + location.search + location.hash;
const attr = (value: string) => typeof CSS !== "undefined" && typeof CSS.escape === "function" ? CSS.escape(value) : value.replace(/["\\]/g, "\\$&");
const laidOut = (node: Element) => node.isConnected && node.getClientRects().length > 0 && (node as HTMLElement).offsetWidth > 0 && (node as HTMLElement).offsetHeight > 0;

/* Same decoding as Paseo 0.16.1 utils/host-routes.ts decodeWorkspaceIdFromPathSegment: percent-decoding, then
   `b64_` + UTF-8 base64url, or a legacy unprefixed base64 that round-trips and decodes to a clean path. */
const decodeSegment = (value: string) => { try { return decodeURIComponent(value); } catch { return value; } };
function base64UrlUtf8(input: string): string | null {
  const value = input.trim();
  if (!value || !/^[A-Za-z0-9_-]+$/.test(value)) return null;
  const base64 = value.replace(/-/g, "+").replace(/_/g, "/");
  try {
    const binary = atob(base64.padEnd(base64.length + ((4 - (base64.length % 4)) % 4), "="));
    return new TextDecoder("utf-8").decode(Uint8Array.from(binary, char => char.charCodeAt(0)));
  } catch { return null; }
}
function toBase64UrlNoPad(input: string) {
  let binary = "";
  for (const byte of new TextEncoder().encode(input)) binary += String.fromCharCode(byte);
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}
const strictBase64UrlUtf8 = (input: string) => { const decoded = base64UrlUtf8(input); return decoded && toBase64UrlNoPad(decoded) === input.trim() ? decoded : null; };
const cleanLegacyPath = (value: string) => (value.includes("/") || value.includes("\\") || /^[A-Za-z]:[\\/]/.test(value))
  && ![...value].some(char => { const code = char.codePointAt(0)!; return code < 0x20 || code === 0x7f || code === 0xfffd; });
export function decodeWorkspaceSegment(segment: string): string | null {
  const decoded = decodeSegment(segment.trim()).trim();
  if (!decoded) return null;
  if (decoded.startsWith("b64_")) { const value = base64UrlUtf8(decoded.slice(4)); return value ? value.trim() : null; }
  const strict = strictBase64UrlUtf8(decoded);
  if (strict && cleanLegacyPath(strict)) return strict.trim();
  const relaxed = base64UrlUtf8(decoded);
  if (relaxed && cleanLegacyPath(relaxed)) return relaxed.trim();
  return decoded;
}

/** `/h/<server>/workspace/<workspace>` of the current location, decoded like the host; null on any other page. */
export function workspaceRoute(pathname = typeof location === "undefined" ? "" : location.pathname) {
  const match = /^\/h\/([^/]+)\/workspace\/([^/?#]+)\/?$/.exec(pathname);
  if (!match) return null;
  const serverId = decodeSegment(match[1]).trim(), workspaceId = decodeWorkspaceSegment(match[2]);
  return serverId && workspaceId ? { serverId, workspaceId } : null;
}

/** Web Navigation API (Chromium/Electron), read only. */
type NavEntry = { key: string; id: string; url: string | null; index: number };
const navigationApi = () => (globalThis as { navigation?: { currentEntry?: NavEntry | null; entries?: () => NavEntry[] } }).navigation;

/** Selected, unique chip of this agent in exactly this pane, and its one laid-out viewport. Ambiguous → null. */
function paneProof(pane: Element, agentId: string) {
  const chips = pane.querySelectorAll(`[data-testid="workspace-tab-${attr(`agent_${agentId}`)}"]`);
  if (chips.length !== 1 || chips[0].getAttribute("aria-selected") !== "true") return null;
  const viewports = [...pane.querySelectorAll('[data-testid="agent-chat-scroll"]')].filter(laidOut);
  return viewports.length === 1 ? viewports[0] : null;
}

/** Reading position of the viewport `element` sits in, proven to be this agent's selected tab in its pane. */
function readPosition(element: Element | null | undefined, serverId: string, workspaceId: string, agentId: string): ReadingPosition | undefined {
  const viewport = element?.closest?.('[data-testid="agent-chat-scroll"]');
  if (!viewport || !laidOut(viewport)) return undefined;
  const pane = viewport.closest('[data-testid^="workspace-pane-"]'), deck = viewport.closest('[data-testid^="workspace-deck-entry-"]');
  const deckId = deck?.getAttribute("data-testid"), paneId = pane?.getAttribute("data-testid");
  if (!pane || !deck || !deckId || !paneId || deckId !== `workspace-deck-entry-${serverId}:${workspaceId}` || !deck.contains(pane)) return undefined;
  if (paneProof(pane, agentId) !== viewport) return undefined;
  const v = viewport as HTMLElement, distance = v.scrollHeight - v.scrollTop - v.clientHeight;
  const base = { viewport, deck: deckId, pane: paneId, scrollTop: v.scrollTop };
  if (distance <= BOTTOM_PX) return { ...base, atBottom: true };
  const top = viewport.getBoundingClientRect().top;
  for (const row of viewport.querySelectorAll("[data-history-row-id]")) {
    const rect = row.getBoundingClientRect();
    if (rect.height > 0 && rect.bottom > top) {
      const index = Number(row.getAttribute("data-index"));
      return { ...base, atBottom: false, rowId: row.getAttribute("data-history-row-id") ?? undefined, offset: rect.top - top, rowIndex: row.hasAttribute("data-index") && Number.isInteger(index) ? index : undefined };
    }
  }
  return { ...base, atBottom: false };
}

/** The viewport of the single pane in this deck proven to show this agent's selected tab; several/none → undefined. */
function deckViewport(serverId: string, workspaceId: string, agentId: string) {
  const decks = document.querySelectorAll(`[data-testid="${attr(`workspace-deck-entry-${serverId}:${workspaceId}`)}"]`);
  if (decks.length !== 1 || !laidOut(decks[0])) return undefined;
  const found = [...decks[0].querySelectorAll('[data-testid^="workspace-pane-"]')].flatMap(pane => { const viewport = paneProof(pane, agentId); return viewport ? [viewport] : []; });
  return found.length === 1 ? found[0] : undefined;
}

/* ── card anchors, so an explicit open can find the viewport the user is reading ── */
const anchors = new Map<string, Set<() => unknown>>();
export function registerCardAnchor(agentId: string, node: () => unknown) {
  let set = anchors.get(agentId); if (!set) { set = new Set(); anchors.set(agentId, set); }
  set.add(node);
  return () => { set!.delete(node); if (!set!.size) anchors.delete(agentId); };
}
/** One element of this agent's cards inside the single laid-out viewport that shows them; ambiguous → undefined. */
function anchorFor(agentId: string) {
  const byViewport = new Map<Element, Element>();
  for (const get of anchors.get(agentId) ?? []) {
    const node = get();
    if (!(node instanceof Element) || !laidOut(node)) continue;
    const viewport = node.closest('[data-testid="agent-chat-scroll"]');
    if (viewport && laidOut(viewport) && !byViewport.has(viewport)) byViewport.set(viewport, node);
  }
  return byViewport.size === 1 ? [...byViewport.values()][0] : undefined;
}

/**
 * Capture at entry. `serverId`: the card's own `host.id`; for an explicit open, the host in the workspace URL
 * (checked against the request's workspace by the caller). Nothing is captured unless the user is on that
 * workspace route of that host: X then only uses openAgent with the given host.
 */
export function captureOrigin(input: { serverId: string; agentId: string; workspaceId?: string; element?: unknown; nonce: string }) {
  if (typeof window === "undefined") return;
  const route = workspaceRoute();
  if (!route || route.serverId !== input.serverId || (input.workspaceId && route.workspaceId !== input.workspaceId)) return;
  // Card press: the card itself. Explicit open: a mounted card of this agent; with none (virtualized away),
  // the one pane of this deck whose selected chip is this agent with exactly one visible viewport.
  const element = input.element instanceof Element ? input.element : anchorFor(input.agentId) ?? deckViewport(route.serverId, route.workspaceId, input.agentId);
  const current = navigationApi()?.currentEntry;
  remember(input.nonce, {
    windowId: WINDOW_ID, serverId: input.serverId, agentId: input.agentId, workspaceId: route.workspaceId, route: here(),
    entry: current?.key && current.id && current.url ? { key: current.key, id: current.id, url: current.url } : undefined,
    reading: readPosition(element, route.serverId, route.workspaceId, input.agentId),
  });
}

/** The screen mounted for this entry: remember its pushed URL (first mount only, and only if it carries the nonce). */
export function arrived(nonce: string) {
  const origin = origins.get(nonce);
  if (origin && !origin.screenRoute && new URLSearchParams(location.search).get("param.nonce") === nonce) origin.screenRoute = here();
}

export type ReturnOutcome = "popped" | "popped_restored" | "popped_retained" | "popped_unverified" | "fallback";
let lastOutcome: ReturnOutcome | null = null;
/** How the last X returned (module state only; nothing is written to the DOM). */
export const lastReturnOutcome = () => lastOutcome;
const mark = (outcome: ReturnOutcome) => { lastOutcome = outcome; };

/** The entry right below the current one is exactly the captured origin (same key, same id = not replaced, same URL). */
function previousIsOrigin(origin: Origin) {
  const api = navigationApi();
  if (!origin.entry || !api?.currentEntry || typeof api.entries !== "function") return false;
  try {
    const current = api.currentEntry, previous = api.entries()[current.index - 1];
    return !!previous && current.key !== origin.entry.key && previous.key === origin.entry.key && previous.id === origin.entry.id && previous.url === origin.entry.url;
  } catch { return false; }
}

/**
 * X from a chat-opened detail. Pops the one entry the screen push created only when everything proves the
 * entry below is the captured origin of this window: same window, the screen URL this entry mounted on
 * (a host switch replaces it), and the Navigation API's previous entry = origin key+id+URL. After the pop the
 * location and current entry must be the origin; otherwise `fallback` (openAgent with the captured host).
 */
export function returnToOrigin(nonce: string | undefined, fallback: () => void) {
  const origin = nonce ? origins.get(nonce) : undefined;
  if (!origin || typeof window === "undefined" || origin.windowId !== WINDOW_ID || !origin.screenRoute
    || here() !== origin.screenRoute || origin.screenRoute === origin.route || !previousIsOrigin(origin)) { mark("fallback"); fallback(); return; }
  let done = false;
  const settle = () => {
    if (done) return; done = true;
    window.removeEventListener("popstate", settle); clearTimeout(timer);
    if (here() !== origin.route || navigationApi()?.currentEntry?.key !== origin.entry?.key) { mark("fallback"); fallback(); return; }
    origins.delete(nonce!);
    mark("popped");
    restoreReading(origin);
  };
  const timer = setTimeout(settle, 1000);
  window.addEventListener("popstate", settle);
  history.back();
}

/**
 * After the pop. Retained viewport (same node): the host holds the position; no write. Remounted viewport:
 * only on the same deck+pane with exactly one selected chip of this agent and one laid-out viewport, when the
 * user was reading in the middle (more than 1px from the bottom). The host follows the bottom on mount, after
 * its history is ready (+200ms settle) and on resize/new rows while following, and a plain scrollTop does not
 * switch that off. Paseo 0.16.1 leaves follow mode on an upward wheel inside the viewport, so the first write is
 * preceded by exactly one local, non-bubbling, non-cancelable `wheel` (deltaY -1) dispatched on that proven
 * viewport node only (never on the window, another pane, or as OS input). Then: wait for stable geometry, put
 * the original scrollTop back once if the anchor row is not rendered, step toward it by `data-index` while it
 * is virtualized away, and correct by the anchor row's offset. Virtualizer height corrections are tolerated;
 * real (trusted) user input cancels at once, and repeated re-sticking to the bottom means the host won: yield.
 * Bounded: at most 6 writes within 3 seconds. Not a guarantee for virtualized rows.
 */
function restoreReading(origin: Origin) {
  const reading = origin.reading;
  if (!reading) { mark("popped_unverified"); return; }
  const started = Date.now(), LIMIT = 3000, MAX_WRITES = 6;
  let cancelled = false, writes = 0, seeded = false, signalled = false, bottomHits = 0;
  let lastHeight = -1, stableSince = 0;
  // Any input cancels, except the one wheel event object this function dispatches itself (it still passes
  // the window capture phase while being dispatched).
  let pendingSignal: Event | null = null;
  const cancel = (event: Event) => { if (event !== pendingSignal) cancelled = true; };
  const inputs = ["wheel", "touchstart", "pointerdown", "keydown"] as const;
  for (const type of inputs) window.addEventListener(type, cancel, { capture: true, passive: true });
  const stop = (outcome: ReturnOutcome) => { for (const type of inputs) window.removeEventListener(type, cancel, { capture: true }); mark(outcome); };
  const locate = () => {
    const deck = document.querySelector(`[data-testid="${attr(reading.deck)}"]`);
    const pane = deck?.querySelector(`[data-testid="${attr(reading.pane)}"]`);
    return pane ? paneProof(pane, origin.agentId) : null;
  };
  const later = () => { if (Date.now() - started < LIMIT) requestAnimationFrame(tick); else stop("popped_unverified"); };
  const tick = () => {
    if (cancelled || here() !== origin.route) { stop("popped_unverified"); return; }
    const viewport = locate() as HTMLElement | null;
    if (viewport && viewport === reading.viewport) { stop("popped_retained"); return; }
    // Proof lost after we started moving (tab switch, pane change): stop; before that, keep waiting.
    if (!viewport) { if (writes) stop("popped_unverified"); else later(); return; }
    if (reading.atBottom) { stop("popped_restored"); return; }
    if (!reading.rowId) { stop("popped_unverified"); return; }
    const distance = viewport.scrollHeight - viewport.scrollTop - viewport.clientHeight;
    // After our writes, back at the very bottom again: the host's follow mode won. Yield after a second time.
    if (writes > 0 && distance <= 1) { if (++bottomHits >= 2) { stop("popped_unverified"); return; } }
    // Stable geometry before each step: scroll height unchanged for 300ms first, 120ms between corrections.
    if (viewport.scrollHeight !== lastHeight) { lastHeight = viewport.scrollHeight; stableSince = Date.now(); later(); return; }
    if (Date.now() - stableSince < (writes ? 120 : 300)) { later(); return; }
    const move = (top: number) => {
      if (writes >= MAX_WRITES) { stop("popped_unverified"); return false; }
      const target = Math.max(0, top);
      // The single up-reading signal, only when this write really moves up (never toward the bottom).
      if (!signalled && target < viewport.scrollTop) {
        signalled = true;
        const signal = new WheelEvent("wheel", { deltaY: -1, bubbles: false, cancelable: false });
        pendingSignal = signal;
        try { viewport.dispatchEvent(signal); } finally { pendingSignal = null; }
        if (cancelled) { stop("popped_unverified"); return false; }
      }
      viewport.scrollTop = target; writes++; stableSince = Date.now();
      return true;
    };
    const top = viewport.getBoundingClientRect().top, saved = reading.offset ?? 0;
    // Final check is always the original row id; data-index is only a search hint.
    const row = viewport.querySelector(`[data-history-row-id="${attr(reading.rowId)}"]`);
    if (row) {
      const delta = row.getBoundingClientRect().top - top - saved;
      if (Math.abs(delta) <= 1) { stop("popped_restored"); return; }
      if (move(viewport.scrollTop + delta)) later();
      return;
    }
    // Anchor row not rendered (long unmount / virtualization). First the original scrollTop, once.
    if (!seeded) { seeded = true; if (move(reading.scrollTop)) later(); return; }
    // Then step from the nearest rendered row by index: its top + (index gap × its height) − the saved offset.
    if (reading.rowIndex !== undefined) {
      let nearest: { index: number; rect: DOMRect } | undefined;
      for (const node of viewport.querySelectorAll("[data-history-row-id][data-index]")) {
        const index = Number(node.getAttribute("data-index")), rect = node.getBoundingClientRect();
        if (!Number.isInteger(index) || rect.height <= 0) continue;
        if (!nearest || Math.abs(index - reading.rowIndex) < Math.abs(nearest.index - reading.rowIndex)) nearest = { index, rect };
      }
      if (nearest) {
        const delta = nearest.rect.top - top + (reading.rowIndex - nearest.index) * nearest.rect.height - saved;
        if (Math.abs(delta) > 1) { if (move(viewport.scrollTop + delta)) later(); return; }
      }
    }
    later();
  };
  requestAnimationFrame(tick);
}
