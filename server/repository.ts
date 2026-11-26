import { artifactLocale, localized, type ArtifactLocale } from "../shared/language";
import { contentHash as hashContent, hash, noticeId } from "./artifact-identity";
export { hash } from "./artifact-identity";
import { randomBytes } from "node:crypto";
import { mkdirSync } from "node:fs";
import { dirname } from "node:path";
import { resolve } from "node:path";
import { createRequire } from "node:module";
import { maxThumbnailBytes, staticThumbnail, type LibraryRow } from "./library";
import type { DatabaseSync } from "node:sqlite";
import type { ArtifactAction, ArtifactReadRepository, ArtifactSummary, StoredVersion, VersionMeta, MutationResult, ArtifactOrigin, ArtifactFormat } from "../shared/contracts";

type Row = Record<string, any>;
// Used in projections of artifact_listing (aliased as a). The limit belongs
// to each artifact, including when several summaries are read in one page.
const legacyIdsColumn = `(SELECT json_group_array(id) FROM (
  SELECT DISTINCT alias.value AS id
  FROM requests r, json_each(json_array(
    json_extract(r.origin,'$.legacyId'), json_extract(r.origin,'$.observedLegacyId')
  )) alias
  WHERE r.artifact=a.id AND alias.value IS NOT NULL LIMIT 1000
)) AS legacy_ids`;

type ReplayPosition = { epoch: string; seq: number; through: number; textHash: string; timestamp?: string };
export const MAX_NOTICE_ATTEMPTS = 24;
export interface CommitInput { historyOnly?: boolean; replay?: ReplayPosition; sourceTimestamp?: string; sessionId: string; key?: string; inferredKey?: boolean; artifactId?: string; title: string; format: ArtifactFormat; content: string; idemKey: string; request: unknown; origin: ArtifactOrigin; baseVersion?: number; }
export interface OutboxEntry { id: string; sessionId: string; payload: { liveDelivery?: string; artifactId: string; artifactVersion: number; title: string; format: ArtifactFormat; originKind: ArtifactOrigin["kind"]; managed?: boolean; pinned?: boolean; deleted?: boolean }; attempts: number; }
export function ulid(): string {
  const alphabet = "0123456789ABCDEFGHJKMNPQRSTVWXYZ";
  let value = (BigInt(Date.now()) << 80n) | BigInt("0x" + randomBytes(10).toString("hex")), result = "";
  for (let i = 0; i < 26; i++) { result = alphabet[Number(value & 31n)] + result; value >>= 5n; }
  return result;
}
export function openRepositorySync(path: string): SqliteArtifactRepository {
  mkdirSync(dirname(path), { recursive: true });
  let database: DatabaseSync | undefined;
  try {
    // The SDK contribution is synchronous. Resolve only the Node built-in at
    // initialization; no file at this synthetic require base is read or written.
    const { DatabaseSync } = createRequire(resolve("artifact-runtime.cjs"))("node:sqlite") as typeof import("node:sqlite");
    database = new DatabaseSync(path); return new SqliteArtifactRepository(database);
  } catch (error) {
    database?.close();
    throw new Error(`Cannot open the artifact database. Check the data path and node:sqlite support in the plugin runtime: ${error instanceof Error ? error.message : error}`);
  }
}
export async function openRepository(path: string) { return openRepositorySync(path); }
/** One SQLite transaction owns head, immutable revision, request identity and outbox. */
export class SqliteArtifactRepository implements ArtifactReadRepository {
  hostLocale?: ArtifactLocale;
  constructor(private db: DatabaseSync) {
    if (Number((db.prepare("PRAGMA user_version").get() as Row).user_version) > 2) throw new Error("This database requires a newer plugin version.");
    db.exec(`PRAGMA journal_mode=WAL; PRAGMA synchronous=FULL; PRAGMA foreign_keys=ON; PRAGMA busy_timeout=5000;
      CREATE TABLE IF NOT EXISTS artifacts(id TEXT PRIMARY KEY, session TEXT NOT NULL, key TEXT NOT NULL, title TEXT NOT NULL, format TEXT NOT NULL, head INTEGER NOT NULL, updated TEXT NOT NULL, UNIQUE(session,key));
      CREATE TABLE IF NOT EXISTS versions(artifact TEXT NOT NULL REFERENCES artifacts(id), version INTEGER NOT NULL, parent INTEGER NOT NULL, title TEXT NOT NULL, format TEXT NOT NULL, content TEXT NOT NULL, hash TEXT NOT NULL, origin TEXT NOT NULL, created TEXT NOT NULL, PRIMARY KEY(artifact,version));
      CREATE TABLE IF NOT EXISTS requests(id TEXT PRIMARY KEY, hash TEXT NOT NULL, artifact TEXT NOT NULL REFERENCES artifacts(id), version INTEGER NOT NULL, origin TEXT NOT NULL, alias INTEGER NOT NULL);
      CREATE INDEX IF NOT EXISTS requests_by_artifact ON requests(artifact);
      CREATE INDEX IF NOT EXISTS requests_by_hash ON requests(hash);
      CREATE INDEX IF NOT EXISTS versions_publish_turn ON versions(json_extract(origin,'$.turnId'), json_extract(origin,'$.kind'));
      CREATE TABLE IF NOT EXISTS outbox(id TEXT PRIMARY KEY, session TEXT NOT NULL, payload TEXT NOT NULL, state TEXT NOT NULL DEFAULT 'pending', attempts INTEGER NOT NULL DEFAULT 0, next INTEGER NOT NULL DEFAULT 0);
      CREATE TABLE IF NOT EXISTS artifact_host_locale (
        id INTEGER PRIMARY KEY CHECK(id=1), locale TEXT NOT NULL CHECK(locale IN ('en','ko')));
      CREATE TABLE IF NOT EXISTS turns(session TEXT PRIMARY KEY, token TEXT NOT NULL);
      BEGIN IMMEDIATE;
      CREATE TABLE IF NOT EXISTS artifact_settings (
        artifact TEXT PRIMARY KEY REFERENCES artifacts(id), display_title TEXT,
        pinned INTEGER NOT NULL DEFAULT 0, deleted INTEGER NOT NULL DEFAULT 0);
      CREATE VIEW IF NOT EXISTS artifact_listing AS
        SELECT a.*, COALESCE(s.display_title,a.title) AS display_title,
               COALESCE(s.pinned,0) AS pinned, COALESCE(s.deleted,0) AS deleted
        FROM artifacts a LEFT JOIN artifact_settings s ON s.artifact=a.id;
      PRAGMA user_version=2; COMMIT;`);
    db.function("artifact_search_key", { deterministic: true }, value => String(value ?? "").normalize("NFC").toLowerCase());
    this.hostLocale = this.row("SELECT locale FROM artifact_host_locale WHERE id=1")?.locale;
  }
  setHostLocale(tag: string): ArtifactLocale {
    const locale = artifactLocale(tag);
    if (this.hostLocale !== locale) {
      this.db.prepare("INSERT INTO artifact_host_locale VALUES(1,?) ON CONFLICT(id) DO UPDATE SET locale=excluded.locale").run(locale);
      this.hostLocale = locale;
    }
    return locale;
  }
  close() { this.db.close(); }
  private row(sql: string, ...args: (string | number | null)[]): Row | undefined { return this.db.prepare(sql).get(...args) as Row | undefined; }
  private rows(sql: string, ...args: (string | number | null)[]): Row[] { return this.db.prepare(sql).all(...args) as Row[]; }
  private summary(row: Row): ArtifactSummary {
    const legacyIds: string[] = JSON.parse(row.legacy_ids);
    return { artifactId: row.id, sessionId: row.session, key: row.key, title: row.display_title, pinned: !!row.pinned, format: row.format, headVersion: row.head, updatedAt: row.updated, legacyIds };
  }
  private versionMeta(row: Row): VersionMeta {
    return { artifactId: row.artifact, version: row.version, parentVersion: row.parent, title: row.title,
      format: row.format, contentHash: row.hash, origin: JSON.parse(row.origin), createdAt: row.created };
  }
  private version(row: Row): StoredVersion {
    return { ...this.versionMeta(row), content: row.content };
  }
  latestId(sessionId: string): string | undefined {
    return this.row("SELECT id FROM artifact_listing WHERE session=? AND deleted=0 ORDER BY updated DESC,id DESC LIMIT 1", sessionId)?.id;
  }
  headVersion(sessionId: string, artifactId: string): number | undefined {
    return this.row("SELECT head FROM artifact_listing WHERE session=? AND id=? AND deleted=0", sessionId, artifactId)?.head;
  }
  libraryList(query: string, offset: number, limit: number, pinnedOnly = false, pinnedFirst = false) {
    // The (artifact,version) primary key supports a max lookup for each distinct artifact.
    // Search and paginate only after selecting its latest revision.
    const rows = this.rows(`SELECT a.id, NULLIF(trim(a.session),'') AS session, a.updated,
        COALESCE(s.display_title,v.title) AS title, v.version, v.format, COALESCE(s.pinned,0) AS pinned,
        CASE WHEN v.format='svg' AND length(CAST(v.content AS BLOB))<=? THEN v.content END AS svg
      FROM artifacts a
      JOIN versions v ON v.artifact=a.id AND v.version=(SELECT MAX(h.version) FROM versions h WHERE h.artifact=a.id)
      LEFT JOIN artifact_settings s ON s.artifact=a.id
      WHERE COALESCE(s.deleted,0)=0 AND (?=0 OR s.pinned=1)
        AND instr(artifact_search_key(COALESCE(s.display_title,v.title)),?)>0
      ORDER BY CASE WHEN ?=1 THEN COALESCE(s.pinned,0) ELSE 0 END DESC, a.updated DESC, a.id DESC
      LIMIT ? OFFSET ?`, maxThumbnailBytes, Number(pinnedOnly), query.normalize("NFC").toLowerCase(), Number(pinnedFirst), limit + 1, offset);
    const items: LibraryRow[] = rows.slice(0, limit).map(row => ({
      artifactId: row.id, sessionId: row.session, title: row.title, format: row.format,
      headVersion: row.version, pinned: !!row.pinned, updatedAt: row.updated, thumbnail: staticThumbnail(row.svg),
    }));
    return { items, nextOffset: rows.length > limit ? offset + limit : null };
  }
  libraryGet(id: string, requestedVersion?: number) {
    const row = this.row(`SELECT a.session,a.key,a.updated,COALESCE(s.pinned,0) AS pinned,
        COALESCE(s.display_title,h.title) AS title,h.format,h.version AS latest
      FROM artifacts a JOIN versions h ON h.artifact=a.id
      LEFT JOIN artifact_settings s ON s.artifact=a.id
      WHERE a.id=? AND COALESCE(s.deleted,0)=0 ORDER BY h.version DESC LIMIT 1`, id);
    if (!row) return null;
    const revision = this.row("SELECT * FROM versions WHERE artifact=? AND version=?", id, requestedVersion ?? row.latest);
    if (!revision) return null;
    return { artifact: { artifactId: id, sessionId: row.session?.trim() || null, key: row.key, title: row.title,
      format: row.format, headVersion: row.latest, updatedAt: row.updated, pinned: !!row.pinned }, version: this.version(revision) };
  }
  list(sessionId: string, cursor?: string, limit = 40) {
    const after = cursor ? this.row("SELECT pinned FROM artifact_listing WHERE session=? AND id=?", sessionId, cursor) : undefined;
    const rows = this.rows(`SELECT a.*, ${legacyIdsColumn} FROM artifact_listing a WHERE session=? AND deleted=0 AND (pinned,id)<(?,?) ORDER BY pinned DESC,id DESC LIMIT ?`, sessionId, after?.pinned ?? 2, cursor ?? "", Math.min(100, limit) + 1);
    const hidden = this.rows(`SELECT a.id, a.key, ${legacyIdsColumn} FROM artifact_listing a WHERE session=? AND deleted=1`, sessionId)
      .flatMap(row => [row.id, row.key, ...JSON.parse(row.legacy_ids)]);
    return { items: rows.slice(0, limit).map(row => this.summary(row)), cursor: rows.length > limit ? rows[limit - 1].id as string : null, ...(hidden.length ? { hidden } : {}) };
  }
  get(sessionId: string, artifactId: string, version?: number) {
    const artifact = this.row(`SELECT a.*, ${legacyIdsColumn} FROM artifact_listing a WHERE id=? AND session=? AND deleted=0`, artifactId, sessionId);
    if (!artifact) return null;
    const value = this.row("SELECT * FROM versions WHERE artifact=? AND version=?", artifactId, version ?? artifact.head);
    return value ? { artifact: this.summary(artifact), version: this.version(value) } : null;
  }
  history(sessionId: string, artifactId: string, cursor?: string, limit = 40) {
    if (!this.row("SELECT id FROM artifact_listing WHERE id=? AND session=? AND deleted=0", artifactId, sessionId)) return { items: [], cursor: null };
    const before = cursor === undefined ? Number.MAX_SAFE_INTEGER : Number(cursor);
    if (!Number.isSafeInteger(before) || before < 1) throw new Error(localized(this.hostLocale, "Invalid version cursor.", "잘못된 버전 커서입니다"));
    const rows = this.rows(`SELECT artifact,version,parent,title,format,hash,origin,created FROM versions
      WHERE artifact=? AND version<? ORDER BY version DESC LIMIT ?`, artifactId, before, Math.min(100, limit) + 1);
    const items: VersionMeta[] = rows.slice(0, limit).map(row => this.versionMeta(row));
    return { items, cursor: rows.length > limit ? String(items.at(-1)!.version) : null };
  }
  manage(sessionId: string, id: string, action: Exclude<ArtifactAction, { type: "web" }>): { artifactId: string } {
    const row = this.row("SELECT * FROM artifact_listing WHERE session=? AND id=?", sessionId, id);
    if (!row || (row.deleted && action.type !== "restore" && action.type !== "delete")) throw new Error(localized(this.hostLocale, "Artifact not found in this conversation.", "이 대화에서 아티팩트를 찾을 수 없습니다."));
    if (action.type === "duplicate") {
      const selected = this.get(sessionId, id, action.version);
      if (!selected) throw new Error(localized(this.hostLocale, "Selected version not found.", "선택한 버전을 찾을 수 없습니다."));
      const suffix = localized(this.hostLocale, " copy", " 사본");
      const result = this.commit({ sessionId, title: row.display_title.slice(0, 100 - suffix.length) + suffix, format: selected.version.format,
        content: selected.version.content, origin: { kind: "edit" }, idemKey: JSON.stringify(["duplicate",sessionId,action.requestId]),
        request: { source: id, version: action.version } });
      if (result.status !== "ok") throw new Error(localized(this.hostLocale, "The copy request conflicts with another operation.", "복제 요청이 다른 작업과 충돌했습니다."));
      return { artifactId: result.artifactId };
    }
    this.db.exec("BEGIN IMMEDIATE");
    try {
      this.db.prepare("INSERT INTO artifact_settings(artifact) VALUES(?) ON CONFLICT DO NOTHING").run(id);
      if (action.type === "rename") this.db.prepare("UPDATE artifact_settings SET display_title=? WHERE artifact=?").run(action.title, id);
      else if (action.type === "pin") this.db.prepare("UPDATE artifact_settings SET pinned=? WHERE artifact=?").run(+action.pinned, id);
      else this.db.prepare("UPDATE artifact_settings SET deleted=? WHERE artifact=?").run(+(action.type === "delete"), id);
      const updated = this.row("SELECT * FROM artifact_listing WHERE id=?", id)!;
      this.db.prepare(`UPDATE outbox SET state=CASE WHEN state='history' THEN state ELSE 'pending' END, attempts=0, next=0,
        payload=json_set(payload,'$.title',?,'$.deleted',json(?),'$.pinned',json(?),'$.managed',json('true'))
        WHERE session=? AND json_extract(payload,'$.artifactId')=?`).run(updated.display_title, JSON.stringify(!!updated.deleted), JSON.stringify(!!updated.pinned), sessionId, id);
      this.db.exec("COMMIT");
      return { artifactId: id };
    } catch (error) { this.db.exec("ROLLBACK"); throw error; }
  }
  private windows = new Map<string,string>();
  deliveryWindow(sessionId: string) {
    let token = this.windows.get(sessionId);
    if (!token) { token = ulid(); this.windows.set(sessionId,token); }
    return token;
  }
  resetWindow(sessionId: string) { this.windows.delete(sessionId); }
  beginTurn(sessionId: string, token: string) { this.db.prepare("INSERT INTO turns(session,token) VALUES(?,?) ON CONFLICT(session) DO UPDATE SET token=excluded.token").run(sessionId, token); }
  currentTurn(sessionId: string): string | null { return this.row("SELECT token FROM turns WHERE session=?", sessionId)?.token ?? null; }
  endTurn(sessionId: string, token: string) { this.db.prepare("DELETE FROM turns WHERE session=? AND token=?").run(sessionId, token); }
  // A later append cannot consume an older occurrence that fell outside the first bounded scan of this epoch.
  replayThrough(sessionId: string, epoch: string, tail: number): number {
    // Keep one scan boundary on the first artifact's first request. Both survive soft deletion.
    // This also records a replacement whose visible tail contains only ordinary prose.
    const anchor = this.row(`SELECT id,json_extract(origin,'$.scanWindow') AS saved FROM requests
      WHERE artifact=(SELECT id FROM artifacts WHERE session=? ORDER BY rowid LIMIT 1) ORDER BY rowid LIMIT 1`, sessionId);
    if (!anchor) return tail;
    const saved = anchor.saved && JSON.parse(anchor.saved);
    if (saved?.epoch === epoch) return saved.tail;
    this.db.prepare("UPDATE requests SET origin=json_set(origin,'$.scanWindow',json(?)) WHERE id=?")
      .run(JSON.stringify({ epoch, tail }), anchor.id);
    return tail;
  }
  // A request can account for only one occurrence in a timeline generation. Old rows have just the original position.
  private replayRequest(input: CommitInput, requestHash: string): Row | undefined {
    const position = input.replay!;
    const rows = this.db.prepare(`SELECT r.* FROM requests r JOIN artifacts a ON a.id=r.artifact
      WHERE r.hash=? AND a.session=? AND json_extract(r.origin,'$.blockIndex')=? ORDER BY r.rowid`)
      .iterate(requestHash, input.sessionId, input.origin.blockIndex!);
    let best: Row | undefined, bestScore = -1;
    for (const row of rows) {
      const origin = JSON.parse(String(row.origin));
      const legacy = /^seq:(.*):(\d+)$/s.exec(origin.messageId);
      if (!legacy || origin.providerMessageId || origin.legacyId?.startsWith("msg:")) continue;
      const last: ReplayPosition | undefined = origin.replay;
      if (last && last.textHash !== position.textHash) continue;
      const originalEpoch = legacy[1], originalSeq = Number(legacy[2]);
      if (last?.epoch === position.epoch) {
        if (last.seq === position.seq) return row;
        continue;
      }
      if (originalEpoch === position.epoch) {
        if (originalSeq === position.seq) return row;
        continue;
      }
      if (position.seq > position.through) continue;
      const score = position.timestamp && last?.timestamp === position.timestamp ? 2 : (last?.seq ?? originalSeq) === position.seq ? 1 : 0;
      if (score > bestScore) { best = row; bestScore = score; }
    }
    return best;
  }

  private publishedFile(input: CommitInput): Row | undefined {
    const body = input.content.trim();
    const rows = this.db.prepare(`SELECT v.artifact,v.version,v.content,a.deleted FROM artifact_listing a JOIN versions v ON v.artifact=a.id
      WHERE a.session=? AND v.format=? AND json_extract(v.origin,'$.kind')='publish'`)
      .iterate(input.sessionId, input.format);
    let first: Row | undefined, ambiguous = false, deleted: Row | undefined;
    for (const row of rows) {
      if (String(row.content).trim() !== body) continue;
      if (!first || (row.artifact === first.artifact && Number(row.version) > first.version)) first = row;
      else if (row.artifact !== first.artifact) ambiguous = true;
      if (row.deleted) deleted = row;
    }
    // Never recreate a deleted result through an ambiguous match.
    return ambiguous ? (deleted && { ...deleted, ambiguous: true }) : first;
  }

  commit(input: CommitInput, locale = this.hostLocale): MutationResult {
    this.db.exec("BEGIN IMMEDIATE");
    try {
      const requestHash = hash(input.request);
      const previous = input.replay ? this.replayRequest(input, requestHash) : this.row("SELECT * FROM requests WHERE id=?", input.idemKey);
      const requestOrigin = input.replay ? { ...input.origin, replay: input.replay } :
        input.origin.kind === "extract" && input.origin.blockIndex !== undefined ? { ...input.origin, providerMessageId: true } : input.origin;
      if (previous) {
        if (input.replay) {
          const origin = JSON.parse(previous.origin);
          const observed = JSON.stringify({ ...origin, replay: input.replay, observedLegacyId: input.origin.legacyId });
          if (previous.origin !== observed) this.db.prepare("UPDATE requests SET origin=? WHERE id=?").run(observed, previous.id);
        }
        this.db.exec("COMMIT");
        return previous.hash === requestHash ? { status: "ok", artifactId: previous.artifact, version: previous.version, alias: !!previous.alias } : { status: "conflict", artifactId: previous.artifact, version: previous.version, reason: "idempotency" };
      }
      const publisher = input.inferredKey && input.origin.kind === "extract" ? this.publishedFile(input) : undefined;
      if (publisher) {
        if (publisher.ambiguous) {
          this.db.exec("COMMIT"); return { status: "conflict", artifactId: publisher.artifact, version: publisher.version, reason: "deleted" };
        }
        this.db.prepare("INSERT INTO requests VALUES(?,?,?,?,?,1)").run(input.idemKey, requestHash, publisher.artifact, publisher.version, JSON.stringify(requestOrigin));
        this.db.exec("COMMIT"); return { status: "ok", artifactId: publisher.artifact, version: publisher.version, alias: true };
      }
      const artifact = input.artifactId ? this.row("SELECT * FROM artifacts WHERE id=? AND session=?", input.artifactId, input.sessionId) : input.key ? this.row("SELECT * FROM artifacts WHERE session=? AND key=?", input.sessionId, input.key) : undefined;
      if (artifact && this.row("SELECT artifact FROM artifact_settings WHERE artifact=? AND deleted=1", artifact.id)) {
        this.db.exec("COMMIT"); return { status: "conflict", artifactId: artifact.id, version: artifact.head, reason: "deleted" };
      }
      if (input.artifactId && !artifact) throw new Error(localized(locale, "Artifact not found in this conversation.", "이 대화에서 아티팩트를 찾을 수 없습니다"));
      if (artifact && input.key && artifact.key !== input.key) throw new Error(localized(locale, "artifactId and key refer to different artifacts.", "artifactId와 key가 서로 다른 결과물을 가리킵니다"));
      if (input.baseVersion !== undefined && artifact?.head !== input.baseVersion) {
        this.db.exec("COMMIT"); return { status: "conflict", artifactId: artifact?.id ?? null, version: artifact?.head ?? 0, reason: "baseVersion" };
      }
      // Hash is only a bounded candidate lookup. Format and exact content must
      // also agree, and ambiguity never causes two independent artifacts to merge.
      const contentHash = hashContent(input.content), turn = input.origin.turnId;
      const candidates = input.origin.kind === "extract" && !input.inferredKey && turn ? this.rows(`SELECT v.*, a.key, a.session FROM versions v JOIN artifacts a ON a.id=v.artifact
        WHERE a.session=? AND v.hash=? AND v.format=? AND json_extract(v.origin,'$.kind')='publish' AND json_extract(v.origin,'$.turnId')=?`, input.sessionId, contentHash, input.format, turn).filter(row => row.content === input.content && (!input.key || input.inferredKey || row.key === input.key)) : [];
      const candidate = input.key && !input.inferredKey ? candidates.sort((a, b) => b.version - a.version)[0] : candidates.length === 1 ? candidates[0] : undefined;
      if (candidate) {
        this.db.prepare("INSERT INTO requests(id,hash,artifact,version,origin,alias) VALUES(?,?,?,?,?,1)").run(input.idemKey, requestHash, candidate.artifact, candidate.version, JSON.stringify(requestOrigin));
        this.db.exec("COMMIT"); return { status: "ok", artifactId: candidate.artifact, version: candidate.version, alias: true };
      }
      // A first-seen historical reply can arrive after a current revision was saved.
      // Compare source times for extractions, not when a historical scan happened to save them.
      const sourceTime = input.origin.kind === "extract" && input.sourceTimestamp ? Date.parse(input.sourceTimestamp) : NaN;
      if (artifact && Number.isFinite(sourceTime)) {
        const head = this.row("SELECT origin,created FROM versions WHERE artifact=? AND version=?", artifact.id, artifact.head);
        if (head) {
          const origin = JSON.parse(head.origin);
          const sameTurn = input.origin.turnId && origin.turnId === input.origin.turnId;
          const headTime = Date.parse(origin.kind === "extract" ? origin.sourceTimestamp : head.created);
          if (!sameTurn && sourceTime < headTime) {
            this.db.exec("COMMIT");
            return { status: "conflict", artifactId: artifact.id, version: artifact.head, reason: "staleSource" };
          }
        }
      }
      const id = artifact?.id ?? ulid(), version = (artifact?.head ?? 0) + 1, timestamp = new Date().toISOString();
      const key = artifact?.key ?? input.key ?? `artifact-${id.toLowerCase()}`;
      if (!artifact) this.db.prepare("INSERT INTO artifacts VALUES(?,?,?,?,?,?,?)").run(id, input.sessionId, key, input.title, input.format, version, timestamp);
      else this.db.prepare("UPDATE artifacts SET title=?,format=?,head=?,updated=? WHERE id=?").run(input.title, input.format, version, timestamp, id);
      this.db.prepare("INSERT INTO versions VALUES(?,?,?,?,?,?,?,?,?)").run(id, version, version - 1, input.title, input.format, input.content, contentHash, JSON.stringify(Number.isFinite(sourceTime) ? { ...input.origin, sourceTimestamp: input.sourceTimestamp } : input.origin), timestamp);
      this.db.prepare("INSERT INTO requests VALUES(?,?,?,?,?,0)").run(input.idemKey, requestHash, id, version, JSON.stringify(requestOrigin));
      const settings = this.row("SELECT display_title,pinned FROM artifact_settings WHERE artifact=?", id);
      const payload: OutboxEntry["payload"] = { ...(input.historyOnly ? {} : { liveDelivery: this.deliveryWindow(input.sessionId) }), artifactId: id, artifactVersion: version, title: settings?.display_title ?? input.title, format: input.format, originKind: input.origin.kind, ...(settings?.pinned ? { pinned: true } : {}) };
      this.db.prepare("INSERT INTO outbox(id,session,payload,state) VALUES(?,?,?,?)").run(noticeId(id, version), input.sessionId, JSON.stringify(payload), input.historyOnly ? "history" : "pending");
      this.db.exec("COMMIT"); return { status: "ok", artifactId: id, version, alias: false };
    } catch (error) { this.db.exec("ROLLBACK"); throw error; }
  }
  readySessions(now = Date.now()): string[] {
    return this.rows("SELECT DISTINCT session FROM outbox WHERE state='pending' AND next<=?", now).map(row => row.session);
  }
  pending(now = Date.now(), limit = 50, held: readonly string[] = [], sessionId?: string): OutboxEntry[] {
    return this.rows(`SELECT * FROM outbox WHERE state='pending' AND next<=?
      AND id NOT IN (SELECT value FROM json_each(?))
      AND (? IS NULL OR session=?) ORDER BY rowid LIMIT ?`, now, JSON.stringify(held), sessionId ?? null, sessionId ?? null, limit)
      .map(row => ({ id: row.id, sessionId: row.session, payload: JSON.parse(row.payload), attempts: row.attempts }));
  }
  isFailed(id: string) { return !!this.row("SELECT 1 FROM outbox WHERE id=? AND state='failed'", id); }
  hasNotices(sessionId: string) { return !!this.row("SELECT 1 FROM outbox WHERE session=? LIMIT 1", sessionId); }
  isPending(item: OutboxEntry) {
    return !!this.row("SELECT 1 FROM outbox WHERE id=? AND state='pending' AND payload=?", item.id, JSON.stringify(item.payload));
  }
  noticeSessions(): string[] { return this.rows("SELECT DISTINCT session FROM outbox").map(row => row.session); }
  historical(item: OutboxEntry) {
    this.db.prepare("UPDATE outbox SET state='history' WHERE id=? AND state='pending' AND payload=?").run(item.id, JSON.stringify(item.payload));
  }
  placementSources(sessionId: string) {
    return this.rows(`SELECT o.id,o.payload,v.hash,v.origin,
      (SELECT min(r.origin) FROM requests r WHERE r.artifact=v.artifact AND r.version=v.version AND r.alias=1
         AND json_extract(r.origin,'$.kind')='extract' AND json_extract(r.origin,'$.blockIndex') IS NOT NULL
         AND json_extract(r.origin,'$.turnId')=json_extract(v.origin,'$.turnId')
       HAVING count(DISTINCT json_array(json_extract(r.origin,'$.messageId'),json_extract(r.origin,'$.blockIndex')))=1) AS fence
      FROM outbox o JOIN versions v
      ON v.artifact=json_extract(o.payload,'$.artifactId') AND v.version=json_extract(o.payload,'$.artifactVersion')
      WHERE o.session=? ORDER BY o.rowid`, sessionId).map(row => ({
      id: String(row.id), notice: JSON.parse(row.payload) as OutboxEntry["payload"],
      hash: String(row.hash), origin: JSON.parse(row.origin) as ArtifactOrigin,
      fence: row.fence ? JSON.parse(row.fence) as ArtifactOrigin : undefined,
    }));
  }
  publishRequests(sessionId: string) {
    const ids = new Map<string, string>();
    for (const row of this.rows(`SELECT r.id,r.artifact,r.version FROM requests r JOIN artifacts a ON a.id=r.artifact
      WHERE a.session=? AND json_extract(r.origin,'$.kind')='publish'`, sessionId)) {
      try {
        const key = JSON.parse(row.id);
        if (Array.isArray(key) && key[0] === "publish" && key[1] === sessionId && typeof key[2] === "string")
          ids.set(key[2], noticeId(row.artifact, row.version));
      } catch { /* Older or third-party request identifiers may be opaque. */ }
    }
    return ids;
  }
  notices(sessionId: string, deliveredOnly = false): OutboxEntry[] {
    return this.rows("SELECT * FROM outbox WHERE session=? AND (?=0 OR state='delivered') ORDER BY rowid", sessionId, Number(deliveredOnly))
      .map(row => ({ id: row.id, sessionId: row.session, payload: JSON.parse(row.payload), attempts: row.attempts }));
  }
  delivered(id: string, payload?: OutboxEntry["payload"]) {
    if (payload) this.db.prepare("UPDATE outbox SET state='delivered' WHERE id=? AND payload=?").run(id, JSON.stringify(payload));
    else this.db.prepare("UPDATE outbox SET state='delivered' WHERE id=?").run(id);
  }
  retry(item: OutboxEntry, now: number) {
    const attempts = item.attempts + 1, state = attempts >= MAX_NOTICE_ATTEMPTS ? "failed" : "pending";
    const next = state === "failed" ? 0 : now + 1000 * 2 ** Math.min(attempts, 8);
    const updated = this.db.prepare("UPDATE outbox SET state=?,attempts=?,next=? WHERE id=? AND state='pending' AND attempts=? AND payload=?")
      .run(state, attempts, next, item.id, item.attempts, JSON.stringify(item.payload));
    return updated.changes ? state : undefined;
  }
  requeueFailed(sessionId: string) {
    this.db.prepare("UPDATE outbox SET state='pending',attempts=0,next=0 WHERE session=? AND state='failed'").run(sessionId);
  }
  failedNotices(sessionId: string, cursor = "", limit = 40) {
    const rows = this.rows("SELECT id,attempts,json_extract(payload,'$.artifactId') AS artifactId,json_extract(payload,'$.artifactVersion') AS version FROM outbox WHERE state='failed' AND session=? AND id>? ORDER BY id LIMIT ?", sessionId, cursor, limit + 1);
    return { items: rows.slice(0, limit).map(row => ({ id: row.id, artifactId: row.artifactId, version: row.version, attempts: row.attempts })), cursor: rows.length > limit ? rows[limit - 1].id : null };
  }
}
