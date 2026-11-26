import { defineAgentTool, type PluginServerContext, type PluginHookContext } from "@getpaseo/plugin/server";
import { z } from "zod";
import { artifactCardPlacements, artifactCardPlacementsChanged, artifactList, artifactGet, artifactHistory, artifactSaveEdit, artifactRestoreVersion, artifactBackfill, failedNotices, agentToolInputs, artifactManage } from "../shared/contracts";
import { ArtifactService } from "./service";
import { LocalWebPreview } from "./web-preview";
import { openInput, sidebarAck, sidebarOpen, sidebarPending, sidebarRequests, sidebarRefreshRequests } from "../shared/sidebar";
import { SidebarBroker } from "./sidebar";
import { artifactLibraryGet, artifactLibraryList } from "../shared/library";
import { withSourceNames } from "./library";
import { getArtifactGuide, ARTIFACT_GUIDE_MARKER } from "../shared/agent-guide";
import { artifactSetLocale } from "../shared/locale";
import { localized, type ArtifactLocale } from "../shared/language";

const guideLocaleKey = "paseo-artifact-viewer.guideLocale";

export function registerServer(server: PluginServerContext, service: ArtifactService) {
  let fallback: PluginHookContext["paseo"] | undefined;
  const bind = (sessionId: string, paseo: PluginHookContext["paseo"]) => { fallback = paseo; service.bind(sessionId, paseo); };
  server.handle(artifactSetLocale, ({ locale }) => ({ locale: service.repository.setHostLocale(locale) }));
  server.handle(artifactLibraryList, async ({ query, offset, limit, pinnedOnly, pinnedFirst }, { paseo }) => {
    const page = service.repository.libraryList(query, offset, limit, pinnedOnly, pinnedFirst);
    return { items: await withSourceNames(page.items, paseo, service.repository.hostLocale), nextOffset: page.nextOffset };
  });
  server.handle(artifactLibraryGet, ({ artifactId, version }) => service.repository.libraryGet(artifactId, version));
  server.handle(artifactList, (input, { paseo }) => { bind(input.sessionId, paseo); return service.repository.list(input.sessionId, input.cursor, input.limit); });
  server.handle(artifactGet, (input, { paseo }) => { bind(input.sessionId, paseo); return service.repository.get(input.sessionId, input.artifactId, input.version); });
  server.handle(failedNotices, input => service.repository.failedNotices(input.sessionId, input.cursor, input.limit));
  server.handle(artifactHistory, (input, { paseo }) => { bind(input.sessionId, paseo); return service.repository.history(input.sessionId, input.artifactId, input.cursor, input.limit); });
  server.handle(artifactRestoreVersion, (input, { paseo }) => service.restoreVersion(input, paseo));
  server.handle(artifactSaveEdit, (input, { paseo }) => service.saveEdit(input, paseo));
  server.handle(artifactCardPlacementsChanged, (_, {push,signal}) => service.placements.subscribe(push,signal));
  server.handle(artifactCardPlacements, ({ sessionId }, { paseo }) => service.placements.read(sessionId, paseo));
  server.handle(artifactBackfill, (input, { paseo }) => service.backfill(input.sessionId, paseo));
  const web = new LocalWebPreview(service.repository);
  const sidebar = SidebarBroker.forOpen();
  const refresh = SidebarBroker.forRefresh();
  server.handle(artifactManage, async ({ sessionId, artifactId, action }, { paseo }) => {
    bind(sessionId, paseo);
    if (action.type === "web") return { artifactId, url: await web.open(sessionId, artifactId, action.version, service.repository.hostLocale) };
    const result = service.repository.manage(sessionId, artifactId, action);
    if (action.type === "delete") {
      sidebar.cancelArtifact(sessionId, artifactId);
      refresh.cancelArtifact(sessionId, artifactId);
    }
    await service.flush(paseo, Date.now(), sessionId);
    service.placements.invalidate(sessionId);
    return result;
  });
  const open = async (sessionId: string, workspaceId: string | null, input: z.infer<typeof openInput>, locale = service.repository.hostLocale, signal?: AbortSignal) => {
    const id = input.artifactId ?? service.repository.latestId(sessionId);
    const stored = id && service.repository.get(sessionId, id, input.version);
    if (!stored) throw new Error(localized(locale, "No matching artifact or version to open in this conversation.", "이 대화에 열 수 있는 아티팩트 또는 버전이 없습니다."));
    return sidebar.request(sessionId, workspaceId, stored.artifact.artifactId, stored.version.version, signal);
  };
  server.handle(sidebarRequests, (_, { push, signal }) => { sidebar.subscribe(push, signal); });
  server.handle(sidebarPending, () => ({ items: sidebar.outstanding() }));
  server.handle(sidebarRefreshRequests, (_, { push, signal }) => { refresh.subscribe(push, signal); });
  server.handle(sidebarAck, receipt => ({ accepted: sidebar.ack(receipt) || refresh.ack(receipt) }));
  server.handle(sidebarOpen, async (input, { paseo }) => {
    const agent = paseo.agents.ref(input.sessionId);
    const workspaceId = agent.workspaceId ?? (await agent.refresh())?.agent.workspaceId ?? null;
    return open(input.sessionId, workspaceId, input);
  });
  const toolsFor = (locale: ArtifactLocale) => [
    defineAgentTool({
      name: "artifact_publish", title: localized(locale, "Publish artifact", "아티팩트 발행"), input: agentToolInputs[locale].publish,
      description: localized(locale, "Publish the complete HTML, SVG, or React content when asked to create an artifact. If you also created a file, publish the same content. This adds a conversation card and saves a library entry. Publishing updates the displayed latest version. Use artifact_open for open requests. Retry with the same requestId and input.", "사용자가 아티팩트를 만들어 달라고 하면 완성한 HTML/SVG/React 본문을 이 도구로 발행하세요. 파일도 만들었다면 같은 본문으로 발행하세요. 대화에 클릭 가능한 아티팩트 카드가 생기고 보관함에 저장됩니다. 보고 있는 최신 버전은 갱신됩니다. 열기 요청에는 artifact_open을 사용하고, 발행 재시도에는 동일 requestId와 입력을 유지하세요."),
      async execute(input, { agent, paseo, signal }) {
        signal.throwIfAborted();
        const result = await service.publish(agent.id, input, paseo, locale);
        if (result.status === "conflict") {
          const message = result.reason === "deleted" ? localized(locale, "This artifact was deleted. Restore it or publish a new artifact with a different key.", "삭제된 아티팩트입니다. 삭제를 되돌리거나 다른 key로 새 아티팩트를 발행하세요.") : undefined;
          return { structuredContent: { ...result, ...(message ? { message } : {}) }, isError: true };
        }
        // An idempotent replay can return a revision that another publish has already replaced.
        if (result.version !== service.repository.headVersion(agent.id, result.artifactId)) {
          return { structuredContent: { ...result, sidebar: "unchanged" }, isError: false };
        }
        const carry = sidebar.queuedOpen(agent.id, result.artifactId);
        if (!carry && result.version === 1) {
          return { structuredContent: { ...result, sidebar: "closed" }, isError: false };
        }
        // Only an earlier explicit open may navigate. Publish otherwise refreshes an already-visible artifact.
        const broker = carry ? sidebar : refresh;
        const { status, ...display } = await broker.request(agent.id, agent.workspaceId, result.artifactId, result.version, signal, carry);
        return { structuredContent: { ...result, ...display, sidebar: status }, isError: false };
      },
    }),
    defineAgentTool({ name: "artifact_read", title: localized(locale, "Read artifact", "아티팩트 읽기"), description: localized(locale, "Read the latest content or a specific version of an artifact saved in this conversation.", "현재 대화에 속한 저장된 아티팩트의 특정 버전 또는 최신 본문을 읽습니다."), input: agentToolInputs[locale].read, async execute(input, { agent, signal }) { signal.throwIfAborted(); return { structuredContent: service.repository.get(agent.id, input.artifactId, input.version) }; } }),
    defineAgentTool({ name: "artifact_list", title: localized(locale, "List artifacts", "아티팩트 목록"), description: localized(locale, "List the artifacts saved in this conversation, one page at a time.", "현재 대화에 저장된 아티팩트 목록을 페이지로 읽습니다."), input: agentToolInputs[locale].list, async execute(input, { agent, signal }) { signal.throwIfAborted(); return { structuredContent: service.repository.list(agent.id, input.cursor, input.limit) }; } }),
    defineAgentTool({
      name: "artifact_open", title: localized(locale, "Open artifact beside conversation", "대화 옆에서 아티팩트 열기"), input: agentToolInputs[locale].open,
      description: localized(locale, "Open a saved artifact in the right panel of this conversation. Omit the ID to open the latest result. The opened status confirms display. The deferred status means it is waiting until expiresAt, up to five minutes, for the user to return to the conversation. The artifact can open without republishing.", "현재 대화의 기존 아티팩트를 대화의 오른쪽 패널에서 엽니다. 대화를 보면서 아티팩트를 사용할 수 있습니다. ID를 생략하면 최신 결과물을 엽니다. opened는 표시 확인입니다. deferred는 아직 열리지 않았으며 expiresAt까지 대기한다는 뜻입니다. 사용자가 해당 대화로 돌아오면 최대 5분 이내에 표시하며, 재발행할 필요가 없습니다."),
      async execute(input, { agent, signal }) {
        signal.throwIfAborted();
        const result = await open(agent.id, agent.workspaceId, input, locale, signal);
        return { structuredContent: result, isError: result.status !== "opened" && result.status !== "deferred" };
      },
    }),
  ];
  const removers = [
    server.before("agent.create", ({ request }) => {
      const existing = request.config.systemPrompt ?? "";
      const lines = existing.split(/\r?\n/);
      const marker = lines.indexOf(ARTIFACT_GUIDE_MARKER);
      if (marker >= 0) {
        // A copied or pre-upgrade guide retains its original language.
        const locale = (["en", "ko"] as const).find(tag => lines[marker + 1] === getArtifactGuide(tag).split("\n")[1]);
        if (locale && request.metadata?.[guideLocaleKey] !== locale) {
          return { ...request, metadata: { ...request.metadata, [guideLocaleKey]: locale } };
        }
        return;
      }
      const locale = service.repository.hostLocale ?? "en";
      return {
        ...request,
        metadata: { ...request.metadata, [guideLocaleKey]: locale },
        config: { ...request.config, systemPrompt: [existing, getArtifactGuide(locale)].filter(Boolean).join("\n\n") },
      };
    }),
    server.before("agent.session_open", ({ request }, { paseo }) => {
      service.placements.invalidate(request.agentId);
      if (request.purpose === "history") return;
      bind(request.agentId, paseo);
      service.repository.requeueFailed(request.agentId);
      // Only providers whose tool path this implementation targets get tools.
      // Others keep server extraction. No provider session is reloaded here.
      if (!["codex", "claude", "claude-code"].includes(request.provider.split("/")[0])) return;
      const saved = request.metadata?.[guideLocaleKey];
      const locale = service.repository.hostLocale ?? (saved === "ko" ? "ko" : "en");
      return { ...request, tools: [...request.tools, ...toolsFor(locale)] };
    }),
    server.on("agent.turn_started", (event, { paseo }) => { bind(event.agent.id, paseo); service.beginTurn(event.agent.id, event.turnId ?? null); }),
    server.on("agent.turn_ended", async (event, { paseo }) => {
      bind(event.agent.id, paseo);
      const token = service.endingToken(event.agent.id, event.turnId ?? null);
      try { await service.backfill(event.agent.id, paseo, token, true, event.turnId ?? null); }
      finally { if (token) await service.endTurn(event.agent.id, token); service.placements.invalidate(event.agent.id); }
    }),
  ];
  const timer = setInterval(() => { void service.flush(fallback); }, 1000); timer.unref?.();
  // PluginHandlerContext is supplied by Paseo on the first invocation; the first
  // bind lets the persisted outbox use the authenticated connection after restart.
  return async () => { clearInterval(timer); sidebar.close(); refresh.close(); removers.forEach(remove => remove()); await web.close(); await service.stop(); };
}
