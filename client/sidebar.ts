import type { PluginClientContext } from "@getpaseo/plugin/client";
import { sidebarAck, sidebarPending, sidebarRefreshRequests, sidebarRequests, type SidebarReceipt, type SidebarRequest } from "../shared/sidebar";
import type { StoreRegistry } from "./store";
import type { PluginButtonRegistration } from "@getpaseo/plugin/client";
import type { PluginText } from "@getpaseo/plugin";
import { createPillIcon, onScreen, type Presence, type PresenceScope } from "./presence";
import { messages } from "./messages";

export type { SidebarRequest };

/** `expiresAt` is epoch milliseconds. */
const expired = (request: SidebarRequest) => !Number.isFinite(request.expiresAt) || request.expiresAt <= Date.now();

export type Foreground = "foreground" | "not_foreground" | "foreground_unknown";

/** Why a foreground check came out the way it did; "other_agent" is the only explicit contradiction. */
export type ForegroundReason = "selected" | "evidence" | "hidden" | "other_agent" | "unknown";

/**
 * Fail-closed foreground check. Window/input focus is not required: the conversation the user is
 * looking at counts even before they click its input.
 * - "foreground": the document is visible and Paseo's focused composer (the router/workspace
 *   selection, not DOM focus) is this agent's own composer, by object identity between
 *   `{ focused: true }` and `{ agentId }`. When that selector is empty or ambiguous, plugin-owned
 *   evidence may stand in: only this agent's artifact timeline items or pending pill on screen
 *   (and, when `scope.explorer`, this agent's own right-sidebar explorer panel, list included).
 * - "not_foreground": hidden document, or one focused composer that is clearly another one.
 * - "foreground_unknown": no DOM, SDK threw, no/several candidates without exclusive evidence.
 */
export function foregroundDetail(client: Pick<PluginClientContext, "composers">, agentId: string, presence?: Presence, scope?: PresenceScope): { state: Foreground; reason: ForegroundReason } {
  if (typeof document === "undefined") return { state: "foreground_unknown", reason: "unknown" };
  try {
    if (document.visibilityState !== "visible") return { state: "not_foreground", reason: "hidden" };
    const focused = client.composers({ focused: true }), mine = client.composers({ agentId });
    const a = focused.length === 1 ? focused[0] : undefined, b = mine.length === 1 ? mine[0] : undefined;
    if (a && b && b.context === "agent") return a === b ? { state: "foreground", reason: "selected" } : { state: "not_foreground", reason: "other_agent" };
    if (mine.length <= 1 && (!b || b.context === "agent") && presence?.exclusive(agentId, scope)) return { state: "foreground", reason: "evidence" };
    return { state: "foreground_unknown", reason: "unknown" };
  } catch { return { state: "foreground_unknown", reason: "unknown" }; }
}
export const foregroundOf = (client: Pick<PluginClientContext, "composers">, agentId: string, presence?: Presence): Foreground => foregroundDetail(client, agentId, presence).state;
export const isForegroundConversation = (client: Pick<PluginClientContext, "composers">, agentId: string, presence?: Presence) => foregroundOf(client, agentId, presence) === "foreground";

type AckOutcome = NonNullable<SidebarReceipt["outcome"]>;
/**
 * The only ack shape on the wire: the request's core ids/version, plus an optional outcome and,
 * for `recoverableClaim` requests only, the claim token this window drew for that attempt.
 */
function sendAck(client: Pick<PluginClientContext, "rpc">, request: SidebarRequest, outcome?: AckOutcome, claimToken?: string) {
  const { requestId, sessionId, artifactId, version } = request;
  const receipt: SidebarReceipt = { requestId, sessionId, artifactId, version };
  if (outcome) receipt.outcome = outcome;
  if (claimToken && request.recoverableClaim === true) receipt.claimToken = claimToken;
  return client.rpc(sidebarAck, receipt);
}

/** One random token per window and claim attempt; never derived from ids another window could know. */
function newClaimToken() {
  const c = (globalThis as { crypto?: Crypto }).crypto;
  if (typeof c?.randomUUID === "function") return c.randomUUID();
  const bytes = new Uint8Array(16);
  if (typeof c?.getRandomValues === "function") c.getRandomValues(bytes); else for (let i = 0; i < 16; i++) bytes[i] = Math.floor(Math.random() * 256);
  return Array.from(bytes, b => b.toString(16).padStart(2, "0")).join("");
}

/** Pending sidebar requests per conversation, read by the agent panel. */
export function createSidebarRequests() {
  const pending = new Map<string, SidebarRequest>(), tokens = new Map<string, string>(), listeners = new Set<() => void>(), timers = new Map<string, ReturnType<typeof setTimeout>>();
  let revision = 0;
  const emit = () => { revision++; for (const listener of listeners) listener(); };
  const drop = (sessionId: string, requestId?: string) => {
    const current = pending.get(sessionId);
    if (!current || (requestId && current.requestId !== requestId)) return;
    pending.delete(sessionId); tokens.delete(sessionId); clearTimeout(timers.get(sessionId)); timers.delete(sessionId); emit();
  };
  return {
    get: (sessionId: string) => { const request = pending.get(sessionId); return request && !expired(request) ? request : undefined; },
    /** The claim token won for exactly this request; another request of the conversation never inherits it. */
    token: (sessionId: string, requestId: string) => pending.get(sessionId)?.requestId === requestId ? tokens.get(sessionId) : undefined,
    put(request: SidebarRequest, claimToken?: string) {
      pending.set(request.sessionId, request); clearTimeout(timers.get(request.sessionId));
      if (claimToken) tokens.set(request.sessionId, claimToken); else tokens.delete(request.sessionId);
      timers.set(request.sessionId, setTimeout(() => drop(request.sessionId, request.requestId), Math.max(0, request.expiresAt - Date.now())));
      emit();
    },
    drop,
    subscribe(listener: () => void) { listeners.add(listener); return () => { listeners.delete(listener); }; },
    snapshot: () => revision,
    clear() { for (const timer of timers.values()) clearTimeout(timer); timers.clear(); pending.clear(); tokens.clear(); emit(); },
  };
}
export type SidebarRequests = ReturnType<typeof createSidebarRequests>;

/**
 * Server → client: "show this artifact version in the sidebar". Opens the explorer panel only
 * for the conversation the user is looking at; never switches window, workspace or agent and never
 * calls focus().
 *
 * - Old servers (no `foregroundRetry`): open now if foreground, otherwise drop silently.
 * - `foregroundRetry` without `deferAfterReply`: report "not_foreground"/"foreground_unknown" on
 *   each change and wait at most 20 seconds (0.5.3 behaviour).
 * - `deferAfterReply` (0.5.4): wait until `expiresAt` (never more than 5 minutes), sending one
 *   "waiting_not_foreground"/"waiting_foreground_unknown" receipt right after storing it. A
 *   refused receipt means another window already handled or cancelled it: the entry is dropped.
 * - `recoverableClaim` (0.5.5): each claim carries a token drawn by this window for that request
 *   (reused only to retry the same claim). A claim that was granted but cannot end in an open
 *   (final foreground check failed, `openPanel` threw, the plugin unloaded) is handed back with
 *   "release_not_foreground"/"release_foreground_unknown" and the same token; the server dismisses
 *   that request and redelivers a fresh requestId with the original deadline. The final "shown" ack
 *   from the panel carries the token too. A short per-conversation backoff follows every release.
 *   Such servers also answer `sidebarPending`; it is re-read on window focus, `pageshow` and the
 *   document becoming visible, never on a timer. A snapshot older than a subscription event for that
 *   conversation is ignored, and a snapshot never cancels a claim attempt of this window.
 * - `dismissed` (same requestId, `expiresAt: 0`): another window finished or the server cancelled;
 *   drops only that request, never a newer one, and is remembered against a late original.
 *
 * Waiting requests show an "아티팩트 열기" pill in their own agent's composer. Pressing it is an
 * explicit open in that conversation. Either way, open only after the server granted an
 * "opening" claim and, after the round trip, the request is still the latest, alive and on screen.
 */
export function receiveSidebarRequests(client: PluginClientContext, registry: StoreRegistry, requests: SidebarRequests, hooks: { onAccepted?: (request: SidebarRequest) => void; onLive?: (live: boolean) => void; presence?: Presence } = {}) {
  type Waiting = { request: SidebarRequest; deadline: number; deferred: boolean; reported?: Foreground; opening?: boolean; retryAt?: number; token?: string };
  /** At most one open per conversation: a newer request replaces the older one. */
  const waiting = new Map<string, Waiting>();
  /** Requests the server dismissed, kept so a late copy of the original is ignored. */
  const dismissed = new Set<string>();
  /** Requests this window won a claim for (opened or released): a late copy or old snapshot never revives them. */
  const settled = new Set<string>();
  /** Per conversation: no automatic claim before `until` (after a release), doubling on repeats so claim→release cannot spin. */
  const backoff = new Map<string, { until: number; strikes: number }>();
  /** Subscription event counter, last value per conversation: a snapshot started earlier is stale for it. */
  let sequence = 0;
  const touched = new Map<string, number>();
  /** `sidebarPending` support: "yes" once it answered or a `recoverableClaim` request arrived ("no" is cached). `live`: the subscription is up. */
  let pendingSupport: "unknown" | "yes" | "no" = "unknown", live = false;
  /** One pill per waiting conversation, in that agent's own composer. */
  type Pill = { workspaceId: string; opening: boolean; registration: PluginButtonRegistration<PluginText> };
  const pills = new Map<string, Pill>();
  const PillIcon = createPillIcon(hooks.presence);
  let timer: ReturnType<typeof setInterval> | undefined, disposed = false;
  const remember = (set: Set<string>, id: string) => { set.add(id); if (set.size > 256) set.delete(set.values().next().value!); };
  const latest = (entry: Waiting) => waiting.get(entry.request.sessionId) === entry;
  const gone = (entry: Waiting) => entry.deadline <= Date.now() || expired(entry.request);
  const visible = () => typeof document !== "undefined" && document.visibilityState === "visible";
  // Retry-capable requests may also count this conversation's own visible explorer panel (same workspace).
  const detail = (request: SidebarRequest) => foregroundDetail(client, request.sessionId, hooks.presence,
    request.foregroundRetry === true ? { workspaceId: request.workspaceId, explorer: true } : undefined);
  /** False when the host refused to open the panel; nothing stays pending for the panel then. */
  const open = (request: SidebarRequest, claimToken?: string) => {
    hooks.onAccepted?.(request);
    requests.put(request, claimToken);
    registry.forAgent(request.sessionId).focus(request.artifactId, request.version);
    try {
      // Right-sidebar explorer panel; acked there once the requested version is really shown.
      client.openPanel("artifacts", { workspaceId: request.workspaceId, agentId: request.sessionId, location: "explorer" });
      return true;
    } catch { requests.drop(request.sessionId, request.requestId); return false; }
  };
  const forget = (entry: Waiting) => { if (latest(entry)) waiting.delete(entry.request.sessionId); };
  /** Hand a granted claim back so the server redelivers it (new requestId). Best effort: a refusal changes nothing here. */
  const release = (entry: Waiting, state: Exclude<Foreground, "foreground">, pause = true) => {
    if (!entry.token || entry.request.recoverableClaim !== true) return;
    if (pause) {
      const strikes = Math.min((backoff.get(entry.request.sessionId)?.strikes ?? 0) + 1, 5);
      backoff.set(entry.request.sessionId, { until: Date.now() + 1_500 * 2 ** (strikes - 1), strikes });
    }
    void sendAck(client, entry.request, state === "not_foreground" ? "release_not_foreground" : "release_foreground_unknown", entry.token).catch(() => {});
  };
  /** `button`: the pill button the user pressed, captured before the host swaps its icon for a spinner. */
  const claim = async (entry: Waiting, explicit: boolean, button?: Element) => {
    // Same token for a retry of this very claim (the server treats it as idempotent), a new one for every other request.
    if (entry.request.recoverableClaim === true) entry.token ??= newClaimToken();
    entry.opening = true; sync();
    let accepted = false, failed = false;
    try { ({ accepted } = await sendAck(client, entry.request, "opening", entry.token)); } catch { failed = true; }
    if (accepted) remember(settled, entry.request.requestId);
    // Superseded, dismissed, cleared by a reconnect, or unloaded while the claim was in flight: never open.
    // A granted claim is still handed back (refused harmlessly if the server already finished it).
    if (!latest(entry) || disposed) { if (accepted) release(entry, "foreground_unknown", false); return; }
    // Not claimed because the call failed: keep waiting and retry with the same token (idempotent on the server).
    // Well inside the server's 5 s claim timeout, so a claim that did land is confirmed before it lapses.
    if (failed && !gone(entry)) { entry.opening = false; entry.retryAt = Date.now() + 1_000; sync(); return; }
    // Decide while the pill (a presence probe) is still mounted; removing it first would erase the evidence.
    // Automatic: foreground now. Pill press: the SDK selects this agent, or the selection is unresolved or
    // evidence-based and the very button pressed is still on screen (same element, laid out, in view,
    // hit-testable). Another agent, a hidden document, or a re-rendered/hidden button: do not open.
    const now = detail(entry.request);
    const go = accepted && !gone(entry) && visible() && (explicit
      ? now.reason === "selected" || ((now.reason === "unknown" || now.reason === "evidence") && !!button && onScreen(button))
      : now.state === "foreground");
    forget(entry); sync();
    if (go) {
      if (open(entry.request, entry.token)) backoff.delete(entry.request.sessionId); else release(entry, "foreground_unknown");
      return;
    }
    // Granted but not opened (the focus race this version fixes): give it back instead of dropping it.
    if (accepted && !gone(entry)) release(entry, !visible() || now.state === "not_foreground" ? "not_foreground" : "foreground_unknown");
  };
  const press = (sessionId: string) => {
    const entry = waiting.get(sessionId);
    // Started, not returned: the host disables the pressable until an action's promise settles.
    if (entry && !entry.opening && !gone(entry)) { void claim(entry, true, hooks.presence?.pillButton(sessionId)); return; }
    if (entry && gone(entry)) forget(entry);
    sync();
  };
  const report = (entry: Waiting, state: Exclude<Foreground, "foreground">) => {
    if (!entry.deferred) {
      if (state === entry.reported) return;
      entry.reported = state;
      void sendAck(client, entry.request, state).catch(() => {});
      return;
    }
    // Deferred: one receipt, right after storing. A refusal means the server no longer holds it.
    if (entry.reported) return;
    entry.reported = state;
    void sendAck(client, entry.request, state === "not_foreground" ? "waiting_not_foreground" : "waiting_foreground_unknown")
      .then(({ accepted }) => { if (!accepted && latest(entry) && !entry.opening) { forget(entry); sync(); } }, () => { /* connection cleanup handles it */ });
  };
  const check = (entry: Waiting) => {
    if (entry.opening || !latest(entry)) return;
    if (gone(entry)) { forget(entry); return; }
    const { state } = detail(entry.request);
    if (state === "foreground") {
      const now = Date.now();
      if ((entry.retryAt ?? 0) <= now && (backoff.get(entry.request.sessionId)?.until ?? 0) <= now) void claim(entry, false);
      return;
    }
    report(entry, state);
  };
  const recheck = () => { for (const entry of [...waiting.values()]) check(entry); sync(); };
  const syncPills = () => {
    if (typeof client.addComposerPill !== "function") return;
    for (const [sessionId, pill] of [...pills]) {
      const entry = waiting.get(sessionId);
      if (disposed || !entry || gone(entry) || entry.request.workspaceId !== pill.workspaceId) { pill.registration.remove(); pills.delete(sessionId); }
    }
    if (disposed) return;
    for (const [sessionId, entry] of waiting) {
      if (gone(entry)) continue;
      const opening = !!entry.opening, label = messages.message(opening ? "pillOpening" : "pillOpen");
      const pill = pills.get(sessionId);
      // Label only: a disabled button may stop taking pointer events and fail the hit test; entry.opening guards repeats.
      if (pill) { if (pill.opening !== opening) { pill.opening = opening; pill.registration.update({ label }); } continue; }
      try {
        const registration = client.addComposerPill({
          id: `artifact-open-${sessionId}`, workspaceId: entry.request.workspaceId, agentId: sessionId,
          button: { title: messages.message("pillTitle"), label, icon: PillIcon, behavior: { kind: "action", onPress: () => press(sessionId) } },
        });
        pills.set(sessionId, { workspaceId: entry.request.workspaceId, opening, registration });
      } catch { /* host without pills: automatic opening still works */ }
    }
  };
  const doc = typeof document === "undefined" ? undefined : document, win = typeof window === "undefined" ? undefined : window;
  // Rechecks run only while something waits: visibility/focus/pageshow events, plus a short timer for
  // conversation switches inside the app (and SDK selection that lags behind window focus after Alt+Tab).
  const sync = () => {
    syncPills();
    const need = !disposed && [...waiting.values()].some(entry => !entry.opening);
    if (need === !!timer) return;
    if (need) {
      timer = setInterval(recheck, 400);
      doc?.addEventListener("visibilitychange", recheck); win?.addEventListener("focus", recheck); win?.addEventListener("pageshow", recheck);
    } else {
      clearInterval(timer); timer = undefined;
      doc?.removeEventListener("visibilitychange", recheck); win?.removeEventListener("focus", recheck); win?.removeEventListener("pageshow", recheck);
    }
  };
  const reset = () => { waiting.clear(); sync(); };
  const dismiss = (request: SidebarRequest) => {
    remember(dismissed, request.requestId);
    const entry = waiting.get(request.sessionId);
    if (entry?.request.requestId === request.requestId) { waiting.delete(request.sessionId); sync(); }
    // Opened here but finished elsewhere: this panel's ack would only be refused.
    requests.drop(request.sessionId, request.requestId);
  };
  /** Shared by the subscription and `sidebarPending` snapshots; a granted claim is always required before opening. */
  const accept = (request: SidebarRequest) => {
    if (dismissed.has(request.requestId)) return;
    if (request.foregroundRetry !== true) {
      if (expired(request) || !isForegroundConversation(client, request.sessionId, hooks.presence)) return;
      open(request);
      return;
    }
    if (expired(request)) return;
    const current = waiting.get(request.sessionId);
    // Redelivery after a resubscribe (or the same request in a snapshot): keep the entry and its claim/receipt state.
    if (current?.request.requestId === request.requestId) { if (!current.opening) { current.request = request; check(current); } sync(); return; }
    if (settled.has(request.requestId)) return;
    const deferred = request.deferAfterReply === true;
    const entry: Waiting = { request, deferred, deadline: Math.min(request.expiresAt, Date.now() + (deferred ? 300_000 : 20_000)) };
    waiting.set(request.sessionId, entry);
    check(entry); sync();
  };
  // Server outstanding state, re-read when the window comes back. Coalesced: one call in flight, at most one more queued.
  // Once support is confirmed this also runs with the subscription closed (the RPC may have recovered while the
  // stream did not, and `ready` never resolves again); only teardown stops it for good.
  let reading = false, again = false;
  const reconcile = async () => {
    if (disposed || pendingSupport === "no" || (!live && pendingSupport !== "yes")) return;
    if (reading) { again = true; return; }
    reading = true;
    try {
      do {
        again = false;
        const start = sequence;
        let items: SidebarRequest[];
        try { ({ items } = await client.rpc(sidebarPending, {})); }
        catch { if (pendingSupport === "unknown") pendingSupport = "no"; return; }
        if (disposed) return;
        supported();
        // Newer subscription events for a conversation win over this snapshot.
        const fresh = (sessionId: string) => (touched.get(sessionId) ?? 0) <= start;
        const listed = new Set<string>();
        for (const item of items) {
          if (item.dismissed === true || item.recoverableClaim !== true || !fresh(item.sessionId)) continue;
          listed.add(item.requestId);
          accept(item);
        }
        // No longer unclaimed on the server (finished, cancelled or claimed elsewhere). Entries with a claim attempt
        // of their own (in flight, or a failed call that may have landed) are never cancelled by a snapshot.
        for (const entry of [...waiting.values()]) {
          if (entry.request.recoverableClaim === true && !entry.opening && !entry.token && fresh(entry.request.sessionId) && !listed.has(entry.request.requestId)) forget(entry);
        }
        sync();
      } while (again && !disposed);
    } finally { reading = false; }
  };
  const onReturn = () => { if (!doc || doc.visibilityState === "visible") void reconcile(); };
  let listening = false;
  const listen = (on: boolean) => {
    if (on === listening) return;
    listening = on;
    if (on) { win?.addEventListener("focus", onReturn); win?.addEventListener("pageshow", onReturn); doc?.addEventListener("visibilitychange", onReturn); }
    else { win?.removeEventListener("focus", onReturn); win?.removeEventListener("pageshow", onReturn); doc?.removeEventListener("visibilitychange", onReturn); }
  };
  const supported = () => { pendingSupport = "yes"; listen(!disposed); };
  // Listeners stay attached across onClosed: a resumed window re-reads the snapshot even without the stream.
  const handle = client.subscribe(sidebarRequests, {}, event => {
    const request: SidebarRequest = event;
    if (disposed) return;
    live = true;
    touched.set(request.sessionId, ++sequence);
    if (request.recoverableClaim === true && pendingSupport !== "yes") supported();
    // Before the expiry check: a dismissal carries `expiresAt: 0`.
    if (request.dismissed === true) { dismiss(request); return; }
    accept(request);
  }, { onClosed: () => { live = false; reset(); hooks.onLive?.(false); } });
  // The broker is "live" only once the server confirmed the subscription. Then one probe of `sidebarPending`:
  // an old server refuses it once and is never asked again (unless it later sends `recoverableClaim`).
  void handle.ready.then(() => { if (disposed) return; live = true; hooks.onLive?.(true); void reconcile(); }, () => hooks.onLive?.(false));
  const stop = () => { disposed = true; live = false; listen(false); reset(); };
  const releaseAll = () => { stop(); handle(); };
  return Object.assign(releaseAll, { ready: handle.ready, release: async () => { stop(); await handle.release(); } });
}

/** What a mounted agent panel reports about itself, read at the moment a refresh arrives. */
export interface ExplorerState {
  /** Laid out, non-zero size, in a visible document. */
  visible: boolean;
  mode: "workbench" | "list";
  artifactId?: string; version?: number;
  /** Showing "latest" (follows new versions). A pinned older version is left alone. */
  following: boolean;
}
export interface ExplorerHandle {
  state(): ExplorerState; refresh(request: SidebarRequest): void;
  /** The main-area full detail (library screen). Laid out + visible + same artifact is its own foreground evidence. */
  main?: boolean;
}

/** Mounted right-sidebar (explorer-only registration) panels per conversation. */
export function createExplorers() {
  const handles = new Map<string, Set<ExplorerHandle>>();
  return {
    register(sessionId: string, handle: ExplorerHandle) {
      let set = handles.get(sessionId); if (!set) { set = new Set(); handles.set(sessionId, set); }
      set.add(handle);
      return () => { set!.delete(handle); if (!set!.size) handles.delete(sessionId); };
    },
    get: (sessionId: string) => [...(handles.get(sessionId) ?? [])],
  };
}
export type Explorers = ReturnType<typeof createExplorers>;

type RefreshOutcome = "refreshed" | "unchanged" | "closed" | Exclude<Foreground, "foreground">;
export function replyRefresh(client: Pick<PluginClientContext, "rpc">, request: SidebarRequest, outcome: RefreshOutcome) {
  if (expired(request)) return;
  void sendAck(client, request, outcome).catch(() => {});
}

/**
 * Server → client: "a newer version exists; update the explorer if it is showing this artifact".
 * Never opens a panel, now or later: a background conversation only gets
 * a "not_foreground"/"foreground_unknown" reply (old servers reject those; that is harmless).
 */
export function receiveSidebarRefresh(client: PluginClientContext, explorers: Explorers, presence?: Presence) {
  const newest = new Map<string, number>();
  return client.subscribe(sidebarRefreshRequests, {}, event => {
    const request: SidebarRequest = event;
    if (expired(request)) return;
    // The chat is unmounted behind a main-area detail, so the composer check cannot pass there: a laid-out,
    // visible main detail of this very session showing this artifact stands in. Never navigates.
    const main = explorers.get(request.sessionId).some(handle => {
      if (!handle.main) return false;
      const state = handle.state();
      return state.visible && state.mode === "workbench" && state.artifactId === request.artifactId;
    });
    const state = main ? "foreground" : foregroundOf(client, request.sessionId, presence);
    if (state !== "foreground") { replyRefresh(client, request, state); return; }
    const key = `${request.sessionId}:${request.artifactId}`;
    // Stale redelivery or out-of-order event: never move backwards.
    if ((newest.get(key) ?? 0) > request.version) { replyRefresh(client, request, "unchanged"); return; }
    newest.set(key, request.version);
    const shown = explorers.get(request.sessionId).map(handle => ({ handle, state: handle.state() })).filter(({ state }) => state.visible && state.mode === "workbench");
    if (!shown.length) { replyRefresh(client, request, "closed"); return; }
    const same = shown.filter(({ state }) => state.artifactId === request.artifactId);
    if (same.some(({ state }) => state.version === request.version)) { replyRefresh(client, request, "refreshed"); return; }
    const movable = same.filter(({ state }) => state.following && (state.version ?? 0) < request.version);
    if (!movable.length) { replyRefresh(client, request, "unchanged"); return; }
    for (const { handle } of movable) handle.refresh(request);
  });
}

/** Ack exactly once, only for the request this panel is showing. */
export async function acknowledge(client: Pick<PluginClientContext, "rpc">, requests: SidebarRequests, request: SidebarRequest) {
  if (expired(request)) { requests.drop(request.sessionId, request.requestId); return false; }
  try {
    // The token this window won for exactly this request (recoverableClaim servers); none for older servers.
    const { accepted } = await sendAck(client, request, undefined, requests.token(request.sessionId, request.requestId));
    return accepted;
  } finally { requests.drop(request.sessionId, request.requestId); }
}
