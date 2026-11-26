import type { PaseoAgentHandle } from "@getpaseo/client";
import { extractArtifacts } from "../shared/artifacts";
import type { ArtifactViewStore } from "./store";
import { ui } from "./ui-locale";

export function observeArtifacts(agent: PaseoAgentHandle, store: ArtifactViewStore, report: (error: string | null) => void) {
  let disposed = false, generation = 0;
  let buffered: (() => void)[] | null = [];
  const apply = (task: () => void) => { if (buffered) buffered.push(task); else task(); };
  async function refresh() {
    const ticket = ++generation;
    buffered = [];
    try {
      const tail = await agent.timeline.refetch({ limit: 200 });
      let page = tail, entries = [...tail.entries], pages = 1;
      while (page.hasOlder && page.startCursor && pages++ < 5) {
        if (disposed || ticket !== generation) return;
        page = await agent.timeline.refetch({ direction: "before", cursor: page.startCursor, limit: 200 });
        if (page.epoch !== tail.epoch || page.staleCursor) throw new Error(ui("The conversation history changed. Please reload it.", "대화 기록이 바뀌었습니다. 다시 불러와 주세요."));
        entries.unshift(...page.entries);
      }
      if (disposed || ticket !== generation) return;
      const extracted = entries.sort((a, b) => a.seqStart - b.seqStart).flatMap(entry => {
        if (entry.item.type !== "assistant_message") return [];
        const source = entry.item.messageId ? `msg:${entry.item.messageId}` : `seq:${entry.seqStart}`;
        return [{ source, timestamp: entry.timestamp, values: extractArtifacts(entry.item.text, source) }];
      });
      if (store.refreshPersistent) {
        for (const entry of extracted) store.ingest(entry.values, entry.source, entry.timestamp);
        await store.refreshPersistent();
      } else store.replace(extracted);
      const waiting = buffered; buffered = null;
      waiting?.forEach(task => task());
      report(null);
    } catch (error) {
      if (!disposed && ticket === generation) { const waiting = buffered; buffered = null; waiting?.forEach(task => task()); report(String(error instanceof Error ? error.message : error)); }
    }
  }
  const unsubscribe = agent.timeline.subscribe(({ event }) => {
    if (disposed) return;
    if (event.type === "replacement") { ++generation; buffered = []; if (!store.refreshPersistent) store.clear(); void refresh(); }
    else if (event.type === "subscription_restored") void refresh();
    else if (event.type === "error") report(event.error);
    else if (event.type === "turn_completed" || event.type === "turn_canceled") void refresh();
    else if (event.type === "timeline" && event.item.type === "plugin" && event.item.kind === "artifact" && store.refreshPersistent) {
      void store.refreshPersistent().catch(error => report(String(error)));
    }
    else if (event.type === "timeline" && event.item.type === "assistant_message" && event.item.messageId) {
      const item = event.item, source = `msg:${item.messageId}`;
      apply(() => store.ingest(extractArtifacts(item.text, source), source, new Date().toISOString(), !!store.refreshPersistent));
    }
  });
  // A mount or reconnect only observes history. An explicit reload may import
  // legacy results before reading the committed rows.
  void unsubscribe.ready.then(() => { if (!disposed) return refresh(); })
    .catch(error => { if (!disposed) report(String(error)); });
  async function reloadHistory() {
    if (disposed) return;
    try {
      await store.backfillPersistent?.();
      if (!disposed) await refresh();
    } catch (error) {
      if (!disposed) report(String(error));
    }
  }
  return { refresh: reloadHistory, dispose() { disposed = true; ++generation; buffered = null; unsubscribe(); } };
}
