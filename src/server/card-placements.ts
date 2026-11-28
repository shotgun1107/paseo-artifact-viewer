import { contentHash, noticeId } from "./artifact-identity";
import { checkTimelinePage, timelinePages, type TimelineEntry, type TimelinePage, type TimelineReader } from "./timeline-pages";
import { extractArtifacts, fingerprint } from "../shared/artifacts";
import type { CardPlacement } from "../shared/contracts";
import type { SqliteArtifactRepository } from "./repository";

export type PlacementReader = Pick<SqliteArtifactRepository, "placementSources" | "publishRequests">;

type Reply = { id?: string; textHash: string; blocks: string[] };
type Event = { type: "user" } | { type: "publish"; card: string; turn?: string } |
  { type: "reply"; reply: Reply; turn?: string };
type Source = ReturnType<PlacementReader["placementSources"]>[number];
type ReplyIndex = Map<string, Reply | null>;
const publishNames = new Set(["paseo.artifact_publish", "mcp__paseo__artifact_publish", "artifact_publish"]);

function object(value: unknown) {
  return value !== null && typeof value === "object" ? value as Record<string, unknown> : undefined;
}

// Retain identities and block hashes only. A long conversation can span many pages.
function collect(entry: TimelineEntry, requests: Map<string, string>, live: Set<string>): Event | undefined {
  const { item } = entry;
  const turn = entry.turnId ?? undefined;
  if (item.type === "user_message") return { type: "user" };
  if (item.type === "plugin" && item.pluginId === "paseo-artifact-viewer" && item.kind === "artifact" &&
      item.version === 1 && object(item.data)?.placement === "live") {
    live.add(item.id);
  }
  if (item.type === "assistant_message") {
    const blocks = extractArtifacts(item.text, item.messageId ?? "").map(block => block.complete ? contentHash(block.code) : "");
    return { type: "reply", turn, reply: { id: item.messageId, textHash: fingerprint(item.text), blocks } };
  }
  if (item.type !== "tool_call" || item.status !== "completed" || item.detail.type !== "unknown" ||
      !publishNames.has(item.name)) return;
  const id = object(item.detail.input)?.requestId;
  const card = typeof id === "string" && requests.get(id);
  if (!card) return;
  const output = object(item.detail.output);
  const result = object(output?.structuredContent);
  if (output?.isError === true || result?.status === "conflict") return;
  if (result?.artifactId && (typeof result.artifactId !== "string" || typeof result.version !== "number" ||
      card !== noticeId(result.artifactId, result.version))) return;
  return { type: "publish", card, turn };
}

// A null entry records conflicting evidence. It must not fall back to a weaker match.
function remember(index: ReplyIndex, key: string, candidate: Reply | null) {
  if (!index.has(key)) index.set(key, candidate);
  else if (index.get(key) !== candidate) index.set(key, null);
}

function indexReplies(events: Event[], currentTurnRunning: boolean) {
  const byId: ReplyIndex = new Map(), byTurn: ReplyIndex = new Map(), byCall: ReplyIndex = new Map();
  // Scanning backward associates each publish with the replies that follow it up to the next prompt.
  let completed = !currentTurnRunning;
  let next: Reply | null = null;
  let nextTurn: string | undefined;
  let answers = 0;
  for (let i = events.length - 1; i >= 0; i--) {
    const event = events[i];
    if (event.type === "user") {
      completed = true;
      answers = 0;
      next = null;
      nextTurn = undefined;
    } else if (event.type === "reply") {
      if (event.reply.id) remember(byId, event.reply.id, event.reply);
      if (!completed) continue;
      answers++;
      next = event.reply;
      nextTurn = event.turn;
      if (event.turn) remember(byTurn, event.turn, next);
    } else if (completed) {
      const sameTurn = !event.turn || !nextTurn || event.turn === nextTurn;
      remember(byCall, event.card, answers === 1 && sameTurn ? next : null);
    }
  }
  return { byId, byTurn, byCall };
}

function locate(source: Source, index: ReturnType<typeof indexReplies>) {
  const { id, origin, hash, fence } = source;
  if (origin.kind === "edit") return;
  const fencedReply = fence?.messageId ? index.byId.get(fence.messageId) : undefined;
  if (fencedReply && fence?.blockIndex !== undefined && fencedReply.blocks[fence.blockIndex] === hash) {
    return { reply: fencedReply, blockIndex: fence.blockIndex };
  }

  let reply: Reply | null | undefined;
  if (origin.kind === "extract") reply = index.byId.get(origin.messageId ?? "");
  else if (index.byCall.has(id)) reply = index.byCall.get(id);
  else reply = index.byTurn.get(origin.turnId ?? "");
  if (!reply?.id || index.byId.get(reply.id) !== reply) return;
  if (origin.blockIndex !== undefined) {
    if (reply.blocks[origin.blockIndex] === hash) return { reply, blockIndex: origin.blockIndex };
    return;
  }
  const match = reply.blocks.indexOf(hash);
  const uniqueBlock = match >= 0 && reply.blocks.lastIndexOf(hash) === match;
  return { reply, blockIndex: uniqueBlock ? match : undefined };
}

function resolve(sources: Source[], events: Event[], live: Set<string>, sessionId: string, running: boolean) {
  const index = indexReplies(events, running);
  const items: CardPlacement[] = [];
  for (const source of sources) {
    const location = locate(source, index);
    if (!location?.reply.id || (live.has(source.id) && location.blockIndex === undefined)) continue;
    const { reply, blockIndex } = location;
    items.push({ sessionId, messageId: location.reply.id, textHash: reply.textHash, notice: source.notice, blockIndex });
  }
  return items;
}

export async function readCardPlacements(repo: PlacementReader, sessionId: string, timeline: TimelineReader) {
  const sources = repo.placementSources(sessionId);
  if (!sources.length) return [];
  const requests = repo.publishRequests(sessionId);
  const live = new Set<string>();
  const pages: Event[][] = [];
  let epoch = "";
  let end: TimelinePage["endCursor"] | undefined;
  let running = false;
  for await (const page of timelinePages(timeline)) {
    if (pages.length === 0) {
      if (page.agent?.status === "initializing" || (page.agent && !page.entries.length && !page.hasOlder)) {
        throw new Error("Conversation history is not ready to locate saved cards");
      }
      epoch = page.epoch;
      end = page.endCursor;
      running = page.agent?.status === "running";
    }
    pages.push(page.entries.flatMap(entry => collect(entry, requests, live) ?? []));
  }
  if (pages.length > 1) {
    const tail = await timeline.refetch({ direction: "tail", limit: 1 });
    checkTimelinePage(tail, epoch);
    if (JSON.stringify(tail.endCursor) !== JSON.stringify(end)) {
      throw new Error("Conversation changed while locating artifact cards");
    }
  }
  return resolve(sources, pages.reverse().flat(), live, sessionId, running);
}
