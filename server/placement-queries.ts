import type { PaseoApi } from "@getpaseo/client";
import type { CardPlacement } from "../shared/contracts";
import { readCardPlacements, type PlacementReader } from "./card-placements";
import type { TimelineReader } from "./timeline-pages";

type Listener = (event: { sessionId: string }) => void;
type PlacementCatalog = PlacementReader & {
  noticeSessions(): string[];
  hasNotices(sessionId: string): boolean;
};

/** A session request verifies its timeline. A host-wide request only reads the last verified results. */
export class PlacementQueries {
  private readonly verified = new Map<string, CardPlacement[]>();
  private readonly pending = new Map<string, Promise<CardPlacement[]>>();
  private readonly invalidated = new Set<string>();
  private readonly listeners = new Set<Listener>();
  private closed = false;

  constructor(private readonly catalog: PlacementCatalog) {}

  subscribe(push: Listener, signal: AbortSignal) {
    if (signal.aborted || this.closed) return;
    this.listeners.add(push);
    signal.addEventListener("abort", () => this.listeners.delete(push), { once: true });
  }

  invalidate(sessionId: string) {
    if (this.closed) return;
    this.verified.delete(sessionId);
    if (this.pending.has(sessionId)) this.invalidated.add(sessionId);
    if (this.catalog.hasNotices(sessionId)) {
      for (const push of this.listeners) {
        void Promise.resolve().then(() => push({ sessionId })).catch(() => {});
      }
    }
  }

  async read(sessionId: string | undefined, paseo: PaseoApi) {
    if (this.closed) throw new Error("Artifact placement queries have stopped");
    if (!sessionId) return { items: [...this.verified.values()].flat(), sessions: this.catalog.noticeSessions() };
    let read = this.pending.get(sessionId);
    if (!read) {
      read = this.verify(sessionId, paseo.agents.ref(sessionId).timeline);
      this.pending.set(sessionId, read);
    }
    return { items: await read };
  }

  private async verify(sessionId: string, timeline: TimelineReader) {
    try {
      do {
        this.invalidated.delete(sessionId);
        try {
          const items = await readCardPlacements(this.catalog, sessionId, timeline);
          if (!this.invalidated.has(sessionId)) {
            if (!this.closed) this.verified.set(sessionId, items);
            return items;
          }
        } catch (error) {
          if (!this.invalidated.has(sessionId)) throw error;
        }
        // All readers wait for the same retry, including callers of the invalidated scan.
      } while (!this.closed);
      throw new Error("Artifact placement queries have stopped");
    } finally {
      this.pending.delete(sessionId);
      this.invalidated.delete(sessionId);
    }
  }

  async stop() {
    this.closed = true;
    this.listeners.clear();
    await Promise.allSettled(this.pending.values());
    this.verified.clear();
  }
}
