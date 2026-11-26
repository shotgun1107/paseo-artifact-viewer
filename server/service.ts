import type { PaseoApi } from "@getpaseo/client";
import { PlacementQueries } from "./placement-queries";
import { z } from "zod";
import { importHistory } from "./import-history";
import { localized, type ArtifactLocale } from "../shared/language";
import { agentToolInputs, contentSchema, type PublishInput, type MutationResult } from "../shared/contracts";
import { SqliteArtifactRepository, ulid } from "./repository";
import { noticeId, requestKey } from "./artifact-identity";

export class ArtifactService {
  private clients = new Map<string, PaseoApi>();
  private pumps = new Map<string, Promise<void>>();
  private queues = new Map<string, Promise<unknown>>();
  private stopped = false;
  readonly placements: PlacementQueries;
  private activeTurns = new Map<string, { token: string; providerTurnId: string | null; cards: Set<string> }>();
  constructor(readonly repository: SqliteArtifactRepository, private log: (message: string) => void = console.warn) {
    this.placements = new PlacementQueries(repository);
  }
  bind(sessionId: string, paseo: PaseoApi) { this.clients.set(sessionId, paseo); }
  beginTurn(sessionId: string, providerTurnId: string | null) {
    const active = this.activeTurns.get(sessionId);
    if (providerTurnId && active?.providerTurnId === providerTurnId) return;
    this.repository.resetWindow(sessionId);
    const token = providerTurnId ?? ulid();
    this.repository.beginTurn(sessionId, token);
    this.activeTurns.set(sessionId, { token, providerTurnId, cards: new Set() });
  }
  endingToken(sessionId: string, providerTurnId: string | null) {
    const active = this.activeTurns.get(sessionId);
    // Some providers learn the turn ID only after starting the turn.
    if (active && (!providerTurnId || !active.providerTurnId)) return active.token;
    return providerTurnId ?? this.repository.currentTurn(sessionId);
  }
  async endTurn(sessionId: string, token: string) {
    this.repository.endTurn(sessionId, token);
    if (this.activeTurns.get(sessionId)?.token === token) this.activeTurns.delete(sessionId);
    // A flush already running may have queried with this turn's cards excluded.
    await this.pumps.get(sessionId);
    await this.flush(undefined, Date.now(), sessionId);
  }
  async publish(sessionId: string, value: PublishInput, paseo: PaseoApi, locale: ArtifactLocale = this.repository.hostLocale ?? "en"): Promise<MutationResult> {
    this.bind(sessionId, paseo);
    const input = agentToolInputs[locale].publish.parse(value), format = input.format ?? input.kind!;
    if (input.format && input.kind && input.format !== input.kind) throw new Error(localized(locale, "format and kind must match.", "format과 kind가 일치하지 않습니다"));
    const request = { content: input.content, format, title: input.title, key: input.key ?? null, artifactId: input.artifactId ?? null };
    const result = this.repository.commit({ sessionId, ...request, key: input.key, artifactId: input.artifactId, idemKey: requestKey("publish", sessionId, input.requestId), request, origin: { kind: "publish", turnId: this.repository.currentTurn(sessionId) } }, locale);
    if (result.status === "ok" && !result.alias) {
      this.activeTurns.get(sessionId)?.cards.add(noticeId(result.artifactId, result.version));
    }
    await this.flush(undefined, Date.now(), sessionId); return result;
  }
  async saveEdit(input: { sessionId: string; artifactId: string; baseVersion: number; content: string; clientMutationId: string }, paseo: PaseoApi): Promise<MutationResult> {
    this.bind(input.sessionId, paseo); contentSchema.parse(input.content, { error: z.locales[this.repository.hostLocale ?? "en"]().localeError });
    const found = this.repository.get(input.sessionId, input.artifactId, input.baseVersion);
    if (!found) throw new Error(localized(this.repository.hostLocale, "Base version not found in this conversation.", "이 대화에서 기준 버전을 찾을 수 없습니다"));
    const request = { artifactId: input.artifactId, baseVersion: input.baseVersion, content: input.content };
    const result = this.repository.commit({ sessionId: input.sessionId, artifactId: input.artifactId, title: found.version.title, format: found.version.format, content: input.content, baseVersion: input.baseVersion, idemKey: requestKey("edit", input.sessionId, input.clientMutationId), request, origin: { kind: "edit" } });
    await this.flush(undefined, Date.now(), input.sessionId); return result;
  }
  async restoreVersion(input: { sessionId: string; artifactId: string; version: number; baseVersion: number; clientMutationId: string }, paseo: PaseoApi): Promise<MutationResult> {
    this.bind(input.sessionId, paseo);
    const { sessionId, artifactId, version, baseVersion, clientMutationId } = input;
    const source = this.repository.get(sessionId, artifactId, version)?.version;
    if (!source) throw new Error(localized(this.repository.hostLocale, "The version to restore was not found in this conversation.", "이 대화에서 복원할 버전을 찾을 수 없습니다"));
    if (version >= baseVersion) throw new Error(localized(this.repository.hostLocale, "Select an earlier version.", "이전 버전을 선택해 주세요"));
    const result = this.repository.commit({
      sessionId, artifactId, baseVersion, title: source.title, format: source.format, content: source.content,
      idemKey: requestKey("restore-version", sessionId, clientMutationId),
      request: { artifactId, version, baseVersion }, origin: { kind: "edit", restoredFromVersion: version },
    });
    await this.flush(undefined, Date.now(), sessionId);
    return result;
  }
  async backfill(sessionId: string, paseo: PaseoApi, turnToken: string | null = null, currentTurnOnly = false, providerTurnId = turnToken) {
    this.bind(sessionId, paseo);
    const result = await this.serial(sessionId, async () => {
      const ending = currentTurnOnly ? { token: turnToken, providerId: providerTurnId } : undefined;
      return importHistory(this.repository, sessionId, paseo.agents.ref(sessionId), ending,
        () => this.activeTurns.get(sessionId), () => this.stopped, this.log);
    });
    await this.flush(undefined, Date.now(), sessionId);
    return result;
  }
  private async serial<T>(sessionId: string, task: () => Promise<T>): Promise<T> {
    const previous = this.queues.get(sessionId) ?? Promise.resolve();
    const current = previous.catch(() => {}).then(task); this.queues.set(sessionId, current);
    try { return await current; } finally { if (this.queues.get(sessionId) === current) this.queues.delete(sessionId); }
  }
  async flush(paseo?: PaseoApi, now = Date.now(), sessionId?: string): Promise<void> {
    if (this.stopped) return;
    const sessions = sessionId === undefined ? this.repository.readySessions(now) : [sessionId];
    await Promise.all(sessions.map(id => this.flushSession(id, this.clients.get(id) ?? paseo, now)));
  }
  private async flushSession(sessionId: string, client: PaseoApi | undefined, now: number): Promise<void> {
    const running = this.pumps.get(sessionId);
    if (running) return running;
    if (this.stopped || !client) return;
    const held = [...(this.activeTurns.get(sessionId)?.cards ?? [])];
    const pending = this.repository.pending(now, 50, held, sessionId);
    if (!pending.length) return;
    const delivery = (async () => {
      for (const item of pending) {
        if (this.stopped) break;
        await this.serial(sessionId, async () => {
          // Recheck after waiting for backfill, restoration or a management change.
          if (this.stopped || !this.repository.isPending(item) || this.activeTurns.get(sessionId)?.cards.has(item.id)) return;
          try {
            const {liveDelivery, ...payload} = item.payload;
            if (!liveDelivery || this.repository.deliveryWindow(sessionId) !== liveDelivery) {
              this.repository.historical(item);
              return;
            }
            await client.agents.ref(sessionId).timeline.append({ type: "plugin", id: item.id, kind: "artifact", version: 1,
              data: { ...payload, placement: "live" } });
            this.repository.delivered(item.id, item.payload);
          } catch (error) {
            const state = this.repository.retry(item, now);
            if (state) this.log("Artifact card " + (state === "failed" ? "delivery failed" : "scheduled for retry")
              + ": " + item.id + ", attempt=" + (item.attempts + 1) + ", " + (error instanceof Error ? error.message : error));
          }
        });
      }
    })().finally(() => { this.pumps.delete(sessionId); });
    this.pumps.set(sessionId, delivery);
    return delivery;
  }
  async stop() {
    this.stopped = true;
    await Promise.allSettled([this.placements.stop(), ...this.pumps.values(), ...this.queues.values()]);
    this.repository.close();
  }
}
