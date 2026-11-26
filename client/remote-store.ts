import type { PluginClientContext } from "@getpaseo/plugin/client";
import { artifactList, artifactGet, artifactHistory, artifactSaveEdit, artifactBackfill, artifactManage, type ArtifactAction, type ArtifactSummary, type StoredVersion } from "../shared/contracts";
import type { ExtractedArtifact } from "../shared/artifacts";
import { MemoryArtifactStore, type ArtifactRecord, type ArtifactVersion, type RefreshOptions } from "./store";
import { ui } from "./ui-locale";

/** UI cache only. Server SQLite owns committed versions; streaming never writes. */
export class RemoteArtifactStore extends MemoryArtifactStore {
  private stopped = false;
  private refreshing: Promise<void> | null = null;
  /** Invalidations asked for since the running read began; a change from the value a read started with means one more read. */
  private invalidations = 0;
  /** Versions callers of the running read showed, for answers that must contain them (see `RefreshOptions.know`). */
  private awaited: NonNullable<RefreshOptions["know"]>[] = [];
  /** Content hash of every cached saved revision body: a body is reused only while the server's history still reports it. */
  private hashes = new Map<string, string>();
  private hidden = new Set<string>();
  isDeleted(id: string) { return this.hidden.has(id); }
  async manage(artifactId: string, action: ArtifactAction) {
    const result = await this.rpc(artifactManage, { sessionId: this.sessionId, artifactId, action });
    if (action.type !== "web") {
      if (action.type === "duplicate" || action.type === "restore") super.focus(result.artifactId);
      if (action.type === "delete" && this.records.some(r => r.artifactId === artifactId && r.id === this.focused)) this.focused = null;
      await this.refreshPersistent();
    }
    return result;
  }
  constructor(readonly sessionId: string, private rpc: PluginClientContext["rpc"]) { super(); }
  dispose() { this.stopped = true; }
  private requested?: { id: string; version: number };
  override focus(id: string, revision?: number) {
    const was = { focused: this.focused, requested: this.requested };
    this.requested = revision ? { id, version: revision } : undefined;
    const record = this.records.find(value => value.id === id || value.artifactId === id || value.key === id || value.legacyIds?.includes(id));
    super.focus(record?.id ?? id);
    // The same target again is not news: a read already running (or a caller's own right after) covers it.
    const same = was.focused === this.focused && was.requested?.id === this.requested?.id && was.requested?.version === this.requested?.version;
    void this.refreshPersistent(same ? { observe: true } : undefined).catch(() => { /* panel observer reports RPC errors */ });
  }
  override ingest(values: readonly ExtractedArtifact[], source: string, timestamp: string, streaming = false) {
    super.ingest(values.flatMap(value => {
      if (this.hidden.has(value.id)) return [];
      const record = this.records.find(record => record.id === value.id || record.key === value.id || record.legacyIds?.includes(value.id));
      if (record?.artifactId && (!streaming || record.versions.at(-1)?.code === value.code)) return [];
      return [record ? { ...value, id: record.id } : value];
    }), source, timestamp, true);
  }
  async backfillPersistent() { await this.rpc(artifactBackfill, { sessionId: this.sessionId }); }
  /**
   * Reads the server's list and the revisions the cache lacks. Without options this is an invalidation (a mutation,
   * new content, a reconnect, a changed focus): a read already running began before it, so exactly one more follows.
   * `observe` is for callers that only want the current picture: they share the running read.
   */
  refreshPersistent(options: RefreshOptions = {}): Promise<void> {
    if (this.stopped) return Promise.resolve();
    if (this.refreshing) {
      if (!options.observe) this.invalidations++;
      else if (options.know) this.awaited.push(options.know);
      return this.refreshing;
    }
    this.refreshing = this.refreshUntilCurrent().finally(() => { this.refreshing = null; this.awaited = []; });
    return this.refreshing;
  }
  private knows({ artifactId, version }: NonNullable<RefreshOptions["know"]>) {
    return this.hidden.has(artifactId) || this.records.some(record => record.artifactId === artifactId && (record.headVersion ?? 0) >= version);
  }
  private async refreshUntilCurrent() {
    let again: boolean;
    do {
      const seen = this.invalidations;
      this.awaited = [];
      await this.readOnce();
      again = !this.stopped && (this.invalidations !== seen || this.awaited.some(wanted => !this.knows(wanted)));
    } while (again);
  }
  /** One pass: the list, the focused target when it is off the first page, and only the revision bodies the cache lacks. */
  private async readOnce() {
    // Cache at most 40 artifacts; all pages and revisions stay on the server.
    const { items, hidden } = await this.rpc(artifactList, { sessionId: this.sessionId, limit: 40 });
    this.hidden = new Set(hidden ?? []);
    const cachedFocus = this.records.find(record => record.id === this.focused);
    const target = cachedFocus?.artifactId ?? this.focused;
    // Head body of an off-page target, read once here and reused below instead of asking for it again.
    const prefetched = new Map<string, StoredVersion>();
    let extra: ArtifactSummary | undefined;
    if (target && !this.hidden.has(target) && /^[0-7][0-9A-HJKMNP-TV-Z]{25}$/.test(target) && !items.some(item => item.artifactId === target)) {
      const found = await this.rpc(artifactGet, { sessionId: this.sessionId, artifactId: target });
      if (found) { items.push(found.artifact); extra = found.artifact; prefetched.set(`${found.artifact.artifactId}:${found.version.version}`, found.version); }
    }
    // The cache keeps 40 records and the off-page target takes one: the last listed one would only be read and dropped.
    const loadable = extra ? [...items.slice(0, 39), extra] : items;
    const loaded: { summary: ArtifactSummary; versions: StoredVersion[] }[] = [];
    for (const summary of loadable) {
      const cached = this.records.find(record => record.artifactId === summary.artifactId);
      const focused = this.focused === (cached?.id ?? summary.artifactId) || this.focused === summary.key || summary.legacyIds.includes(this.focused ?? "");
      const wanted = focused && this.requested?.id === summary.artifactId ? this.requested.version : undefined;
      if (cached?.headVersion === summary.headVersion && (!focused || cached.versions.length >= Math.min(20, summary.headVersion)) && (!wanted || cached.versions.some(v => v.artifactVersion === wanted))) continue;
      const metas: { version: number; contentHash?: string }[] = focused ? (await this.rpc(artifactHistory, { sessionId: this.sessionId, artifactId: summary.artifactId, limit: 20 })).items : [{ version: summary.headVersion }];
      if (wanted && !metas.some(v => v.version === wanted)) metas.push({ version: wanted });
      const versions: StoredVersion[] = [];
      for (const meta of [...metas].reverse()) {
        const key = `${summary.artifactId}:${meta.version}`;
        // A saved revision never changes: a cached stored body is kept, and where the server reports its hash it
        // must match. A streaming draft has no artifact version and a message source, never `stored:`, so it is not mistaken for one.
        const saved = cached?.versions.some(v => v.artifactVersion === meta.version && v.source === `stored:${key}`);
        if (saved && (meta.contentHash === undefined || this.hashes.get(key) === meta.contentHash)) continue;
        const found = prefetched.get(key) ?? (await this.rpc(artifactGet, { sessionId: this.sessionId, artifactId: summary.artifactId, version: meta.version }))?.version;
        if (found) versions.push(found);
      }
      loaded.push({ summary, versions });
    }
    if (this.stopped) return;
    const indexed = new Map(items.map(summary => [summary.artifactId, summary]));
    let records = this.records.filter(record => !this.hidden.has(record.id) && (!record.artifactId || indexed.has(record.artifactId))).map(record => {
      const summary = record.artifactId && indexed.get(record.artifactId);
      return summary ? { ...record, title: summary.title, pinned: !!summary.pinned } : record;
    });
    for (const { summary, versions } of loaded) {
      const cached = records.find(record => record.artifactId === summary.artifactId || record.id === summary.artifactId || record.id === summary.key || summary.legacyIds.includes(record.id));
      const id = cached?.id ?? summary.artifactId;
      if (this.focused === summary.artifactId || this.focused === summary.key || summary.legacyIds.includes(this.focused ?? "")) this.focused = id;
      const converted = versions.map(version => this.convert(summary, version, id));
      const persisted = cached?.versions.filter(version => version.artifactId === summary.artifactId && !converted.some(next => next.artifactVersion === version.artifactVersion)) ?? [];
      const sorted = [...persisted, ...converted].sort((a, b) => a.artifactVersion! - b.artifactVersion!);
      const current = sorted.filter((version, i) => i >= sorted.length - 20 || (this.requested?.id === summary.artifactId && this.requested?.version === version.artifactVersion));
      const draft = cached?.draft && !current.some(version => version.code === cached.draft!.code) ? { ...cached.draft, id } : undefined;
      records = records.filter(record => record !== cached);
      records.push({ id, artifactId: summary.artifactId, key: summary.key, title: summary.title, pinned: !!summary.pinned, legacyIds: summary.legacyIds, headVersion: summary.headVersion, versions: current, draft });
    }
    // Keep the focus even when an older card points outside the first page.
    if (records.length > 40) records = records.filter(r => r.id === this.focused || r.artifactId === target).concat(records.filter(r => r.id !== this.focused && r.artifactId !== target)).slice(0, 40);
    for (const value of loaded.flatMap(entry => entry.versions)) this.hashes.set(`${value.artifactId}:${value.version}`, value.contentHash);
    const cachedKeys = new Set(records.flatMap(record => record.versions.map(version => `${version.artifactId}:${version.artifactVersion}`)));
    for (const key of this.hashes.keys()) if (!cachedKeys.has(key)) this.hashes.delete(key);
    this.publish(records);
  }
  private convert(summary: ArtifactSummary, value: StoredVersion, id: string): ArtifactVersion {
    return { id, title: value.title, kind: value.format === "react" ? "react" : "html", format: value.format, code: value.content, complete: true, explicit: true, source: `stored:${summary.artifactId}:${value.version}`, timestamp: value.createdAt, artifactId: summary.artifactId, artifactVersion: value.version, artifactKey: summary.key };
  }
  async savePersistent(version: ArtifactVersion, content: string, clientMutationId: string) {
    if (!version.artifactId || !version.artifactVersion) throw new Error(ui("The base version for saving is not ready yet. Reload the server history.", "저장 기준 버전이 아직 준비되지 않았습니다. 서버 기록을 다시 불러와 주세요."));
    const result = await this.rpc(artifactSaveEdit, { sessionId: this.sessionId, artifactId: version.artifactId, baseVersion: version.artifactVersion, content, clientMutationId });
    await this.refreshPersistent();
    if (result.status === "conflict") throw new Error(ui(`Changed on another device. Your edits were kept. Latest server version: v${result.version}`, `다른 기기에서 변경됐습니다. 편집 내용은 보존했습니다. 서버 최신 버전: v${result.version}`));
    return true;
  }
}
