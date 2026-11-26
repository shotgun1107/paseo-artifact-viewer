import test from "node:test";
import assert from "node:assert/strict";
import { autoOpenPublishedArtifacts } from "../client/auto-open";
import { createStoreRegistry } from "../client/store";

const flush = () => new Promise<void>(resolve => setImmediate(resolve));
test("live artifact publication reopens a dismissed panel for its own agent", async () => {
  let observer: any, release = 0;
  const listeners = new Map<string, (event: any) => void>(), opens: any[] = [], removed: string[] = [];
  const registry = createStoreRegistry(), store = registry.forAgent("agent-a"); store.dismiss();
  const client: any = { openPanel: (id: string, options: any) => opens.push({ id, ...options }), paseo: { agents: {
    list: async () => ({ subscription: { subscribe: (value: any) => { observer = value; }, release: async () => { release++; } } }),
    ref: (id: string) => ({ timeline: { subscribe: (fn: any) => { listeners.set(id, fn); return Object.assign(() => { removed.push(id); listeners.delete(id); }, { ready: Promise.resolve() }); } } }),
  } } };
  const cleanup = autoOpenPublishedArtifacts(client, registry); await flush();
  const agent = (id: string, status: string, extra: any = {}) => ({ id, status, workspaceId: "workspace-a", ...extra });
  observer.snapshot({ entries: [{ agent: agent("agent-a", "running") }, { agent: agent("idle", "idle") }, { agent: agent("archive", "running", { archivedAt: "date" }) }] });
  assert.deepEqual([...listeners.keys()], ["agent-a"]);
  const notice = (id: string, originKind = "publish", pluginId = "paseo-artifact-viewer") => ({ event: { type: "timeline", item: { type: "plugin", pluginId, kind: "artifact", id, data: { artifactId: "artifact-a", artifactVersion: 1, title: "테스트", format: "html", originKind } } } });
  listeners.get("agent-a")!(notice("artifact:a:1"));
  assert.deepEqual(opens, [{ id: "artifacts", workspaceId: "workspace-a", agentId: "agent-a", location: "explorer" }]);
  assert.equal(store.focused, "artifact-a"); assert.equal(store.visible, true);
  store.dismiss(); listeners.get("agent-a")!(notice("artifact:a:1"));
  listeners.get("agent-a")!(notice("artifact:a:2", "edit"));
  listeners.get("agent-a")!(notice("foreign", "publish", "another-plugin"));
  assert.equal(opens.length, 1); assert.equal(store.visible, false);
  listeners.get("agent-a")!(notice("artifact:b:1", "extract")); assert.equal(opens.length, 2);
  observer.update({ type: "agent_update", payload: { kind: "upsert", agent: agent("agent-a", "idle", { archivedAt: "date" }) } });
  assert.equal(listeners.size, 0); assert.deepEqual(removed, ["agent-a"]);
  cleanup(); assert.equal(release, 0); registry.dispose();
});

test("closing the plugin while the agent list is loading releases its subscription", async () => {
  let complete!: (value: any) => void, released = 0;
  const registry = createStoreRegistry();
  const client: any = { openPanel() {}, paseo: { agents: { list: () => new Promise(resolve => { complete = resolve; }) } } };
  const cleanup = autoOpenPublishedArtifacts(client, registry); cleanup();
  complete({ subscription: { release: async () => { released++; } } }); await flush();
  assert.equal(released, 1); registry.dispose();
});
