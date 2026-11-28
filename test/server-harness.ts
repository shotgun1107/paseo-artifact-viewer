import type { SqliteArtifactRepository } from "../src/server/repository";
import { ArtifactService } from "../src/server/service";
import { registerServer } from "../src/server/register";

/** Isolated protocol fixture, never connects to the user's daemon or providers. */
export function serverHarness(repository: SqliteArtifactRepository) {
  const handlers = new Map<string, { contract: any; handler: any }>(), hooks = new Map<string, any>(), timelines = new Map<string, any[]>(), appended = new Map<string, any>();
  const paseo: any = { agents: { ref: (id: string) => ({ id, timeline: {
    refetch: async (options: any = {}) => {
      const all = timelines.get(id) ?? [], end = options.direction === "before" ? Number(options.cursor) : all.length, start = Math.max(0, end - (options.limit ?? 200));
      return { entries: all.slice(start, end), epoch: "browser-fixture", hasOlder: start > 0, startCursor: start ? String(start) : undefined, staleCursor: false };
    },
    append: async (item: any) => { appended.set(`${id}:${item.id}`, item); return { seq: appended.size, epoch: "browser-fixture" }; },
  } }) } };
  const service = new ArtifactService(repository, () => {});
  const cleanup = registerServer({ handle: (contract: any, handler: any) => handlers.set(contract.name, { contract, handler }), on: (name: string, fn: any) => { hooks.set(name, fn); return () => hooks.delete(name); }, before: () => () => {} } as any, service);
  return { paseo, service, timelines, appended, cleanup, async rpc(name: string, value: unknown) {
    const found = handlers.get(name); if (!found) throw new Error("Unknown test RPC");
    const result = await found.handler(found.contract.input.parse(value), { paseo });
    await service.flush(paseo);
    return found.contract.output.parse(result);
  } };
}
