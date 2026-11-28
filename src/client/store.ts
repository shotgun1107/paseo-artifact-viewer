import type { ExtractedArtifact } from "../shared/artifacts";
import type { ArtifactAction, ArtifactActionResult } from "../shared/contracts";

export interface ArtifactVersion extends ExtractedArtifact { source: string; timestamp: string; artifactId?: string; artifactVersion?: number; artifactKey?: string; format?: "svg" | "html" | "react"; }
export interface ArtifactRecord { id: string; versions: readonly ArtifactVersion[]; draft?: ArtifactVersion; artifactId?: string; key?: string; legacyIds?: readonly string[]; headVersion?: number; title?: string; pinned?: boolean; }
/** How a caller wants the saved state read. No options = an invalidation (something changed): a read already running began too early, so one more follows. */
export interface RefreshOptions {
  /** Only the current picture is wanted: share a read that is already running instead of queueing another after it. */
  observe?: boolean;
  /** With `observe`: the version this caller displays. If the shared answer lacks it, one more read follows. */
  know?: { artifactId: string; version: number };
}
export interface ArtifactViewStore {
  focused: string | null; visible: boolean;
  snapshot(): readonly ArtifactRecord[]; subscribe(listener: () => void): () => void;
  focus(id: string, revision?: number): void; reveal(): void; dismiss(): void; clear(): void;
  ingest(values: readonly ExtractedArtifact[], source: string, timestamp: string, streaming?: boolean): void;
  replace(entries: readonly { values: ExtractedArtifact[]; source: string; timestamp: string }[]): void;
  refreshPersistent?: (options?: RefreshOptions) => Promise<void>; backfillPersistent?: () => Promise<void>;
  savePersistent?: (version: ArtifactVersion, code: string, mutationId: string) => Promise<boolean>;
  manage?(id: string, action: ArtifactAction): Promise<ArtifactActionResult>;
  isDeleted?(id: string): boolean;
  dispose?: () => void;
}
export class MemoryArtifactStore implements ArtifactViewStore {
  focused: string | null = null;
  visible = true;
  protected records: readonly ArtifactRecord[] = [];
  private listeners = new Set<() => void>();
  private pending = false;
  snapshot = () => this.records;
  subscribe = (listener: () => void) => { this.listeners.add(listener); return () => { this.listeners.delete(listener); }; };
  focus(id: string) { this.focused = id; this.visible = true; this.publish([...this.records]); }
  reveal() { this.visible = true; this.publish([...this.records]); }
  dismiss() { this.visible = false; this.publish([...this.records]); }
  protected publish(next: readonly ArtifactRecord[]) {
    this.records = next;
    if (this.pending) return;
    this.pending = true;
    queueMicrotask(() => { this.pending = false; for (const listener of this.listeners) listener(); });
  }
  ingest(values: readonly ExtractedArtifact[], source: string, timestamp: string, streaming = false) {
    for (const value of values) {
      const old = this.records.find(r => r.id === value.id), version = { ...value, source, timestamp };
      let versions = old?.versions ?? [];
      if (streaming || !value.complete) {
        if (old?.draft?.code === value.code && old.draft.source === source) continue;
        this.publish([...this.records.filter(r => r.id !== value.id), { ...old, id: value.id, versions, draft: version }].slice(-40));
        continue;
      }
      const index = versions.findIndex(v => v.source === source);
      if (index >= 0 && versions[index].code === value.code && !old?.draft) continue;
      if (index >= 0) versions = versions.map((v, i) => i === index ? version : v);
      else if (versions.at(-1)?.code !== value.code) versions = [...versions, version];
      this.publish([...this.records.filter(r => r.id !== value.id), { ...old, id: value.id, versions: versions.slice(-20), draft: undefined }].slice(-40));
    }
  }
  clear() { if (this.records.length) this.publish([]); }
  replace(entries: readonly { values: ExtractedArtifact[]; source: string; timestamp: string }[]) {
    this.clear();
    for (const entry of entries) this.ingest(entry.values, entry.source, entry.timestamp);
  }
}
export { MemoryArtifactStore as ArtifactStore };
export function createStoreRegistry(factory: (agentId: string) => ArtifactViewStore = () => new MemoryArtifactStore()) {
  const stores = new Map<string, ArtifactViewStore>();
  return {
    forAgent(id: string) { let store = stores.get(id); if (!store) { store = factory(id); stores.set(id, store); } return store; },
    dispose() { for (const store of stores.values()) { store.dispose?.(); store.clear(); } stores.clear(); },
  };
}
export type StoreRegistry = ReturnType<typeof createStoreRegistry>;
