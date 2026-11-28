import { useSyncExternalStore } from "react";

/**
 * Result card → right-sidebar explorer. A press records which artifact/version the user picked for that
 * conversation; the explorer panel (mounted or about to mount) shows exactly that pick once and consumes it.
 * Client-only: no server request, receipt or claim is involved, so the sidebar broker is unchanged.
 */
export interface CardPick { artifactId: string; version?: number; nonce: number; at: number; }
/** A pick no panel took within this time (the panel never opened) is ignored by a later mount. */
const PICK_TTL = 10_000;

function createSignal() {
  const listeners = new Set<() => void>();
  let revision = 0;
  return {
    emit() { revision++; for (const listener of listeners) listener(); },
    subscribe(listener: () => void) { listeners.add(listener); return () => { listeners.delete(listener); }; },
    snapshot: () => revision,
  };
}

export function createCardPicks() {
  const picks = new Map<string, CardPick>(), signal = createSignal();
  let nonce = 0;
  return {
    get(agentId: string) { const pick = picks.get(agentId); return pick && Date.now() - pick.at <= PICK_TTL ? pick : undefined; },
    put(agentId: string, artifactId: string, version?: number) { picks.set(agentId, { artifactId, version, nonce: ++nonce, at: Date.now() }); signal.emit(); },
    /** The panel applied this pick; a later mount (after X) must not replay it. */
    take(agentId: string, nonce: number) { if (picks.get(agentId)?.nonce === nonce) { picks.delete(agentId); signal.emit(); } },
    /** A server request was accepted for the conversation: it wins over an earlier, unapplied card press. */
    drop(agentId: string) { if (picks.delete(agentId)) signal.emit(); },
    subscribe: signal.subscribe, snapshot: signal.snapshot,
    clear() { picks.clear(); signal.emit(); },
  };
}
export type CardPicks = ReturnType<typeof createCardPicks>;

/** What a mounted explorer panel really has on screen: set from its workbench `onShown`, cleared in list mode or on unmount. */
export interface ExplorerShown { recordId: string; artifactId?: string; version?: number; following: boolean; }
export function createShownExplorers() {
  const panels = new Map<string, Map<object, { shown: ExplorerShown | null; visible: boolean }>>(), signal = createSignal();
  const entry = (agentId: string, owner: object) => {
    let set = panels.get(agentId); if (!set) { set = new Map(); panels.set(agentId, set); }
    let value = set.get(owner); if (!value) { value = { shown: null, visible: false }; set.set(owner, value); }
    return value;
  };
  const same = (a: ExplorerShown | null, b: ExplorerShown | null) => a === b || (!!a && !!b && a.recordId === b.recordId && a.artifactId === b.artifactId && a.version === b.version && a.following === b.following);
  return {
    set(agentId: string, owner: object, shown: ExplorerShown | null) { const value = entry(agentId, owner); if (same(value.shown, shown)) return; value.shown = shown; signal.emit(); },
    visible(agentId: string, owner: object, visible: boolean) { const value = entry(agentId, owner); if (value.visible === visible) return; value.visible = visible; signal.emit(); },
    remove(agentId: string, owner: object) { const set = panels.get(agentId); if (set?.delete(owner)) { if (!set.size) panels.delete(agentId); signal.emit(); } },
    /** Shown entries of laid-out panels only. */
    list: (agentId: string) => [...(panels.get(agentId)?.values() ?? [])].filter(value => value.visible && value.shown).map(value => value.shown!),
    subscribe: signal.subscribe, snapshot: signal.snapshot,
  };
}
export type ShownExplorers = ReturnType<typeof createShownExplorers>;

/**
 * Card "열림": a visible explorer of this conversation shows this card. A versioned card (stored notice or a
 * code block linked to a stored version) matches only that exact version; an unversioned code block matches
 * its record while the explorer follows the latest.
 */
export function useCardShown(shown: ShownExplorers, agentId: string, ids: readonly (string | undefined)[], version?: number) {
  useSyncExternalStore(shown.subscribe, shown.snapshot, shown.snapshot);
  const known = ids.filter((id): id is string => !!id);
  return shown.list(agentId).some(value => (known.includes(value.recordId) || (!!value.artifactId && known.includes(value.artifactId)))
    && (version !== undefined ? value.version === version : value.following));
}
