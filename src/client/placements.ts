import { fingerprint } from "../shared/artifacts";
import type { noticeSchema } from "../shared/contracts";
import type { z } from "zod";

export type PlacementNotice = z.output<typeof noticeSchema>;
/** One saved card the server proved belongs to a specific original assistant reply of a specific conversation. */
export interface PlacementEntry { sessionId: string; messageId: string; textHash?: string; blockIndex?: number; notice: PlacementNotice }
/** The JSON that travels inside the transformed timeline item (the host transformer cannot see the session). */
export type PlacedCard = Pick<PlacementEntry, "sessionId" | "blockIndex" | "notice">;
export interface PlacementPage { items: readonly PlacementEntry[]; sessions?: readonly string[] }
/** With a session: that conversation, verified now. Without: what the server already verified, plus the sessions that have saved artifacts. */
export type PlacementLoader = (sessionId?: string) => Promise<PlacementPage>;

const MAX_SESSIONS = 64, RETRY_MS = 2_000, MAX_ATTEMPTS = 4, FRESH_MS = 60_000;
type Slot = { state: "loading" | "ready" | "failed" | "seeded"; entries: PlacementEntry[]; at: number; again: boolean; failures: number; timer?: ReturnType<typeof setTimeout> };

/**
 * Per-host cache of the server-verified card placements. The host's timeline transformer is synchronous and
 * only sees one reply at a time (no conversation id), so this index is read synchronously by message id and
 * filled per conversation: once on open, again on explicit refresh, never once per message. A changed index
 * bumps `revision` so the plugin can ask the host to recompute the timeline.
 */
export function createPlacementIndex(load: PlacementLoader, now: () => number = Date.now) {
  const slots = new Map<string, Slot>(), byMessage = new Map<string, PlacementEntry[]>(), listeners = new Set<() => void>();
  let revision = 0, disposed = false;
  const rebuild = () => {
    byMessage.clear();
    for (const slot of slots.values()) for (const entry of slot.entries) { const rows = byMessage.get(entry.messageId); if (rows) rows.push(entry); else byMessage.set(entry.messageId, [entry]); }
    revision++;
    for (const listener of [...listeners]) listener();
  };
  const same = (a: readonly PlacementEntry[], b: readonly PlacementEntry[]) => JSON.stringify(a) === JSON.stringify(b);
  async function run(sessionId: string) {
    let slot = slots.get(sessionId);
    if (!slot) {
      // Bounded cache: forget the least recently opened conversation, never the one being loaded.
      if (slots.size >= MAX_SESSIONS) { const oldest = slots.keys().next().value; if (oldest !== undefined) { slots.delete(oldest); rebuild(); } }
      slot = { state: "loading", entries: [], at: now(), again: false, failures: 0 }; slots.set(sessionId, slot);
    } else { clearTimeout(slot.timer); slot.timer = undefined; slot.state = "loading"; slot.again = false; slots.delete(sessionId); slots.set(sessionId, slot); }
    try {
      const loaded = await load(sessionId);
      if (disposed || slots.get(sessionId) !== slot) return;
      // A row for another conversation is never trusted, whatever the server sent.
      const entries = loaded.items.filter(entry => entry.sessionId === sessionId);
      slot.state = "ready"; slot.at = now(); slot.failures = 0;
      if (!same(slot.entries, entries)) { slot.entries = entries; rebuild(); }
    } catch (error) {
      if (disposed || slots.get(sessionId) !== slot) return;
      slot.state = "failed"; slot.at = now();
      console.error("artifact card placement load failed", error);
      // A conversation whose history is not ready yet fails and is read again shortly, a few times.
      if (++slot.failures < MAX_ATTEMPTS) { const failed = slot; failed.timer = setTimeout(() => { failed.timer = undefined; if (!disposed && slots.get(sessionId) === failed) void run(sessionId); }, RETRY_MS * 2 ** (failed.failures - 1)); }
    }
    if (!disposed && slot.again && slots.get(sessionId) === slot) await run(sessionId);
  }
  return {
    /**
     * Host-wide start (install, reload, reconnect): the already verified placements are shown at once, and the
     * sessions that have saved artifacts are returned. A seeded conversation is still read once on its own open.
     */
    async bootstrap(): Promise<readonly string[]> {
      if (disposed) return [];
      const loaded = await load();
      if (disposed) return [];
      let changed = false;
      const grouped = new Map<string, PlacementEntry[]>();
      for (const entry of loaded.items) { const rows = grouped.get(entry.sessionId); if (rows) rows.push(entry); else grouped.set(entry.sessionId, [entry]); }
      for (const [id, entries] of grouped) {
        const slot = slots.get(id);
        if (slot) continue; // a conversation read on its own is newer than the host-wide cache
        slots.set(id, { state: "seeded", entries, at: now(), again: false, failures: 0 }); changed = true;
      }
      if (changed) rebuild();
      return loaded.sessions ?? [...grouped.keys()];
    },
    /** Load a conversation once; concurrent and repeated calls share it. A failed load is retried after a pause. */
    ensure(sessionId: string): Promise<void> | void {
      if (disposed || !sessionId) return;
      const slot = slots.get(sessionId);
      // Loaded or loading: shared. A read older than a minute is refreshed by the next open; a failed one is
      // retried by its own timer, or here once those attempts are spent and the conversation is opened again.
      if (slot && (slot.state === "loading" || (slot.state === "ready" && now() - slot.at < FRESH_MS) || (slot.state === "failed" && (slot.timer || slot.failures < MAX_ATTEMPTS)))) return;
      return run(sessionId);
    },
    /** The conversation's placements may have changed (reconnect, new history): read them again. */
    refresh(sessionId: string): Promise<void> | void {
      if (disposed || !sessionId) return;
      const slot = slots.get(sessionId);
      if (slot?.state === "loading") { slot.again = true; return; }
      return run(sessionId);
    },
    /** Reconnect or host change: every cached conversation is re-read; the old rows stay until the new ones arrive. */
    refreshAll() { for (const id of [...slots.keys()]) void this.refresh(id); },
    /**
     * Cards proven for this reply. Entries whose recorded text hash differs from the actual text are dropped
     * (rewound or edited reply, or an id reused by another conversation). One card per artifact version; a card
     * tied to a fenced block wins over a supplementary one.
     */
    lookup(messageId: string, text: string): PlacedCard[] {
      const rows = byMessage.get(messageId);
      if (!rows?.length) return [];
      const hash = fingerprint(text), seen = new Map<string, PlacedCard>();
      for (const row of [...rows].sort((a, b) => Number(b.blockIndex !== undefined) - Number(a.blockIndex !== undefined))) {
        if (row.textHash !== undefined && row.textHash !== hash) continue;
        const key = `${row.sessionId}\0${row.notice.artifactId}\0${row.notice.artifactVersion}`;
        if (!seen.has(key)) seen.set(key, { sessionId: row.sessionId, ...(row.blockIndex === undefined ? {} : { blockIndex: row.blockIndex }), notice: row.notice });
      }
      return [...seen.values()];
    },
    /** True when this artifact version already shows under an original reply of the conversation. */
    projected(sessionId: string, artifactId: string, version: number) {
      for (const slot of slots.values()) for (const entry of slot.entries)
        if (entry.sessionId === sessionId && entry.notice.artifactId === artifactId && entry.notice.artifactVersion === version) return true;
      return false;
    },
    subscribe(listener: () => void) { listeners.add(listener); return () => { listeners.delete(listener); }; },
    snapshot: () => revision,
    dispose() { disposed = true; for (const slot of slots.values()) clearTimeout(slot.timer); listeners.clear(); slots.clear(); byMessage.clear(); },
  };
}
export type PlacementIndex = ReturnType<typeof createPlacementIndex>;

/**
 * The cards one rendered reply shows, split into the ones that replace a fenced block's card and the
 * supplementary ones under the reply. Only entries of this conversation count, an index outside the reply's
 * actual blocks is unverified and dropped, and an artifact already shown by a block is not shown twice.
 */
export function visiblePlacements(placed: readonly PlacedCard[], agentId: string, blockCount: number, blockArtifactIds: readonly (string | undefined)[] = []) {
  const forBlock = new Map<number, PlacementNotice>(), extra: PlacementNotice[] = [], shown = new Set<string>();
  const mine = placed.filter(card => card.sessionId === agentId);
  for (const card of mine) {
    if (card.blockIndex === undefined || card.blockIndex >= blockCount || forBlock.has(card.blockIndex)) continue;
    forBlock.set(card.blockIndex, card.notice); shown.add(`${card.notice.artifactId}\0${card.notice.artifactVersion}`);
  }
  // A fenced block's own card (no saved placement) already stands for its artifact; only that is matched by id alone.
  const blockIds = new Set(blockArtifactIds.filter((id): id is string => !!id));
  for (const card of mine) {
    if (card.blockIndex !== undefined) continue;
    const key = `${card.notice.artifactId}\0${card.notice.artifactVersion}`;
    if (shown.has(key) || blockIds.has(card.notice.artifactId)) continue;
    shown.add(key); extra.push(card.notice);
  }
  return { forBlock, extra };
}
