import test from "node:test";
import assert from "node:assert/strict";
import { createRequire } from "node:module";
import { dirname, join } from "node:path";
import { pathToFileURL } from "node:url";
import { DatabaseSync } from "node:sqlite";
import { SqliteArtifactRepository } from "../server/repository";
import { ArtifactService } from "../server/service";
import { registerServer } from "../server/register";
import { getArtifactGuide, ARTIFACT_GUIDE_MARKER } from "../shared/agent-guide";

test("Paseo SDK lifecycle adapter registers working create, session and turn hooks", async () => {
  const require = createRequire(import.meta.url);
  const sdkServer = dirname(require.resolve("@getpaseo/plugin/server"));
  const { createLifecycleRegistration } = await import(pathToFileURL(join(sdkServer, "lifecycle.js")).href);
  const registered = new Map<string, Function>();
  const lifecycle = createLifecycleRegistration((name: string, handler: Function) => {
    registered.set(name, handler);
    return () => registered.delete(name);
  });
  const repo = new SqliteArtifactRepository(new DatabaseSync(":memory:"));
  const service = new ArtifactService(repo, () => {});
  const cleanup = registerServer({ ...lifecycle, handle() {} } as any, service);
  const agent = { id: "sdk-agent", provider: "codex", cwd: "C:/fixture" };
  const notices: unknown[] = [];
  let entries: unknown[] = [];
  const paseo: any = { agents: { ref: () => ({ timeline: {
    append: async (item: unknown) => { notices.push(item); return { seq: notices.length, epoch: "test" }; },
    refetch: async () => ({ entries, epoch: "test", hasOlder: false, staleCursor: false }),
  } }) } };
  try {
    assert.deepEqual([...registered.keys()].sort(), ["agent.create.before", "agent.open.before", "agent.turn.after", "agent.turn.before"]);
    const create = registered.get("agent.create.before")!;
    for (const provider of ["codex", "claude"]) {
      const request = { config: { provider, cwd: agent.cwd, systemPrompt: "Original instructions\n[paseo-plugin-genui]" }, env: { EXAMPLE: "kept" }, metadata: { keep: true } };
      const first = create({ request }, { paseo });
      assert.deepEqual(first, { ...request, metadata: { ...request.metadata, "paseo-artifact-viewer.guideLocale": "en" },
        config: { ...request.config, systemPrompt: request.config.systemPrompt + "\n\n" + getArtifactGuide() } });
      const again = create({ request: first }, { paseo });
      assert.equal(again, undefined);
    }
    for (const [firstLocale, secondLocale] of [["ko-KR", "en-US"], ["en-US", "ko-KR"]]) {
      repo.setHostLocale(firstLocale);
      const request = { config: { provider: "codex", cwd: agent.cwd, systemPrompt: "User instructions" } };
      const first = create({ request }, { paseo });
      assert.equal(first.config.systemPrompt, request.config.systemPrompt + "\n\n" + getArtifactGuide(firstLocale));
      assert.equal(first.config.systemPrompt.split("\n").filter((line: string) => line === ARTIFACT_GUIDE_MARKER).length, 1);
      assert.equal(create({ request: first }, { paseo }), undefined);
      repo.setHostLocale(secondLocale);
      assert.equal(create({ request: first }, { paseo }), undefined);
      const copied = { ...request, config: { ...first.config, systemPrompt: first.config.systemPrompt.replaceAll("\n", "\r\n") } };
      const preserved = create({ request: copied }, { paseo });
      assert.equal(preserved.config.systemPrompt, copied.config.systemPrompt);
      assert.deepEqual(preserved.metadata, first.metadata);
    }
    const open = registered.get("agent.open.before")!({ request: { agentId: agent.id, provider: "codex", purpose: "interactive", tools: [], mcpServers: {} } }, { paseo });
    assert.equal(open.tools.length, 4);
    await registered.get("agent.turn.before")!({ agent, turnId: null }, { paseo });
    const published = await open.tools[0].execute({ requestId: "sdk-test", kind: "html", title: "테스트", content: "<div>ok</div>" }, { agent, paseo, signal: new AbortController().signal });
    assert.equal(published.structuredContent.status, "ok");
    assert.equal(repo.get(agent.id, published.structuredContent.artifactId)!.version.content, "<div>ok</div>");
    assert.equal(notices.length, 0, "publish saves the body before the final answer and holds the card");
    entries = [{ seqStart: 1, seqEnd: 1, timestamp: new Date().toISOString(), item: { type: "assistant_message", messageId: "sdk-message", text: '```html artifact="extracted" title="추출"\n<div>extracted</div>\n```' } }];
    await registered.get("agent.turn.after")!({ agent, turnId: "resolved-at-end", outcome: { kind: "completed" } }, { paseo });
    const extracted = repo.list(agent.id, undefined, 40).items.find((item: any) => item.key === "extracted");
    assert.ok(extracted);
    assert.equal(repo.get(agent.id, extracted.artifactId)!.version.content, "<div>extracted</div>");
    assert.equal(notices.length, 1);
    assert.deepEqual((await service.placements.read(agent.id,paseo)).items.map(r=>[r.messageId,r.blockIndex]), [["sdk-message",0]]);
  } finally {
    await cleanup();
  }
  assert.equal(registered.size, 0);
});
