import type { PaseoAgent, PaseoApi } from "@getpaseo/client";
import type { PluginClientContext } from "@getpaseo/plugin/client";
import { noticeSchema } from "../shared/contracts";
import type { StoreRegistry } from "./store";

/** Observe live work without opening inactive/archived agent sessions. */
export function autoOpenPublishedArtifacts(client: Pick<PluginClientContext, "paseo" | "openPanel">, registry: StoreRegistry) {
  const lifetime = new AbortController();
  const observers = new Map<string, { workspaceId: string; unsubscribe: () => void }>();
  const seen = new Map<string, Set<string>>();
  const remove = (id: string) => { observers.get(id)?.unsubscribe(); observers.delete(id); seen.delete(id); };
  const watch = (agent: PaseoAgent) => {
    if (lifetime.signal.aborted) return;
    if (agent.archivedAt || agent.internal || agent.status === "closed" || !agent.workspaceId) { remove(agent.id); return; }
    const current = observers.get(agent.id);
    if (current?.workspaceId === agent.workspaceId) return;
    if (current) remove(agent.id);
    // Starting a timeline subscription can load a provider session. Only
    // subscribe once Paseo reports an already running agent.
    if (agent.status !== "running") return;
    const workspaceId = agent.workspaceId;
    const subscription = client.paseo.agents.ref(agent.id).timeline.subscribe(({ event }) => {
      if (lifetime.signal.aborted || event.type !== "timeline") return;
      const item = event.item;
      if (item.type !== "plugin" || item.pluginId !== "paseo-artifact-viewer" || item.kind !== "artifact") return;
      const parsed = noticeSchema.safeParse(item.data);
      if (!parsed.success || parsed.data.originKind === "edit") return;
      let ids = seen.get(agent.id);
      if (!ids) { ids = new Set(); seen.set(agent.id, ids); }
      if (ids.has(item.id)) return;
      ids.add(item.id);
      if (ids.size > 512) ids.delete(ids.values().next().value!);
      registry.forAgent(agent.id).focus(parsed.data.artifactId);
      client.openPanel("artifacts", { workspaceId, agentId: agent.id, location: "explorer" });
    });
    observers.set(agent.id, { workspaceId, unsubscribe: subscription });
    void subscription.ready.catch(error => { if (!lifetime.signal.aborted && observers.get(agent.id)?.unsubscribe === subscription) { remove(agent.id); console.error("artifact publish observer failed", error); } });
  };
  void client.paseo.agents.list({ subscribe: {}, signal: lifetime.signal }).then(({ subscription }) => {
    if (lifetime.signal.aborted) { void subscription.release(); return; }
    subscription.subscribe({
      snapshot: ({ entries }) => {
        const active = new Set(entries.map(entry => entry.agent.id));
        for (const id of observers.keys()) if (!active.has(id)) remove(id);
        for (const { agent } of entries) watch(agent);
      },
      update: message => {
        if (message.type !== "agent_update") return;
        if (message.payload.kind === "upsert") watch(message.payload.agent);
        else remove(message.payload.agentId);
      },
      error: error => { if (!lifetime.signal.aborted) console.error("agent observer failed", error); },
    });
  }).catch(error => { if (!lifetime.signal.aborted) console.error("agent list observer failed", error); });
  return () => { lifetime.abort(); for (const id of observers.keys()) remove(id); };
}
