import type { PaseoAgentHandle } from "@getpaseo/client";
import { extractArtifacts } from "../shared/artifacts";
import { hash, requestKey } from "./artifact-identity";
import { LinkedFiles } from "./linked-files";
import { timelinePages, type TimelineEntry } from "./timeline-pages";
import type { CommitInput, SqliteArtifactRepository } from "./repository";

type ImportRepository = Pick<SqliteArtifactRepository, "commit" | "replayThrough" | "hostLocale">;
export interface EndingTurn { token: string | null; providerId: string | null }

export async function importHistory(repository: ImportRepository, sessionId: string, handle: PaseoAgentHandle,
    ending: EndingTurn | undefined, currentTurn: () => { token: string } | undefined,
    stopped: () => boolean, log: (message: string) => void) {
  const turnToken = ending?.token ?? null;
  const providerTurnId = ending?.providerId ?? null;
  // The turn-end hook has the token needed to deduplicate published content.
  // A tab opening mid-turn must not commit that same reply without the token.
  const waitingForTurnEnd = () => !ending && !!currentTurn();
  if (stopped() || waitingForTurnEnd()) return { committed: 0, conflicts: 0, truncated: false };
  const entries: TimelineEntry[] = [];
  let epoch = "", truncated = false;
  for await (const page of timelinePages(handle.timeline, 5, repository.hostLocale)) {
    epoch = page.epoch;
    truncated = !!page.hasOlder;
    entries.push(...page.entries);
  }
  entries.sort((a, b) => a.seqStart - b.seqStart);
  const start = ending ? entries.findLastIndex(entry => entry.item.type === "user_message") + 1 : 0;
  let committed = 0, conflicts = 0;
  let cwd = handle.cwd;
  if (!cwd && entries.some(({ item }) => item.type === "tool_call" && (item.detail.type === "edit" || item.detail.type === "write"))) {
    cwd = (await handle.refresh?.().catch(() => null))?.agent.cwd ?? null;
  }
  if (stopped() || waitingForTurnEnd()) return { committed: 0, conflicts: 0, truncated };
  const active = currentTurn();
  const overlapsNewTurn = ending !== undefined && active !== undefined && active.token !== turnToken;
  const linked = new LinkedFiles(cwd);
  const last = entries.at(-1);
  const through = last ? repository.replayThrough(sessionId, epoch, last.seqStart) : 0;
  function commit(input: CommitInput) {
    const result = repository.commit(input);
    if (result.status === "ok") {
      committed++;
    } else if (result.reason !== "staleSource") {
      conflicts++;
      const label = input.inferredKey ? "File delivery" : "Artifact extraction";
      const block = input.origin.blockIndex === undefined ? "" : `, block=${input.origin.blockIndex}`;
      log(`${label} conflict(${result.reason}): session=${sessionId}, message=${input.origin.messageId}${block}`);
    }
  }
  for (const [entryIndex, entry] of entries.entries()) {
    const item = entry.item;
    linked.observe(item);
    if (item.type !== "assistant_message") continue;
    // An older turn hook can run after a new prompt. Only ingest replies
    // known to belong to the ending turn while the newer one is active.
    if (overlapsNewTurn && (!providerTurnId || entry.turnId !== providerTurnId)) continue;
    const messageId = item.messageId ?? `seq:${epoch}:${entry.seqStart}`;
    const source = item.messageId ? `msg:${item.messageId}` : `seq:${entry.seqStart}`;
    const blocks = extractArtifacts(item.text, source, repository.hostLocale);
    const replay = item.messageId == null && blocks.length ? {
      epoch, seq: entry.seqStart, textHash: hash(item.text), timestamp: entry.timestamp,
      through,
    } : undefined;
    const fallbackTurn = ending !== undefined && entryIndex >= start && active?.token === turnToken ? turnToken : null;
    const safeTurn = entry.turnId ? (entry.turnId === providerTurnId ? turnToken : entry.turnId) : fallbackTurn;
    for (const [blockIndex, artifact] of blocks.entries()) {
      if (!artifact.complete) continue;
      const format = artifact.kind === "react" ? "react" : /^\s*(?:<\?xml[^>]*>\s*)?<svg\b/i.test(artifact.code) ? "svg" : "html";
      const key = artifact.explicit ? artifact.id : undefined;
      const request = { content: artifact.code, format, title: artifact.legacyDefaultTitle ?? artifact.title, key: key ?? null, artifactId: null };
      const idemKey = replay
        ? requestKey("anonymous-extract", sessionId, messageId, blockIndex, replay.textHash)
        : requestKey("extract", sessionId, messageId, blockIndex);
      commit({
        sessionId, key, historyOnly: true, title: artifact.title, format, content: artifact.code,
        sourceTimestamp: entry.timestamp, idemKey, replay, request,
        origin: { kind: "extract", turnId: safeTurn, messageId, blockIndex, legacyId: artifact.id },
      });
    }
    for (const file of linked.deliveries(item.text)) {
      if (blocks.some(block => block.complete && block.code.trim() === file.content.trim())) continue;
      const key = "file-" + hash(file.path).slice(0, 32);
      commit({
        sessionId, key, historyOnly: !fallbackTurn, inferredKey: true, title: file.title,
        format: file.format, content: file.content, sourceTimestamp: entry.timestamp,
        idemKey: requestKey("file-delivery", sessionId, file.callId, file.path),
        request: { path: file.path, content: file.content }, origin: { kind: "extract", turnId: safeTurn, messageId },
      });
    }
  }
  return { committed, conflicts, truncated };
}
