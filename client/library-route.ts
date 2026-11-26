import type { PluginScreenParams } from "@getpaseo/plugin/client";
import type { LibraryItem } from "../shared/library";
import type { SidebarRequest } from "./sidebar";
import { ui } from "./ui-locale";

/**
 * Where the library screen is: which detail the URL names, which gallery sheet is pushed, and how the browser's
 * own history is read and written for them. No rendering and no host state in here.
 */
export const LIBRARY_SCREEN_ID = "artifacts";

/** "Open the gallery" presses from the left menu, so a screen already showing a detail goes back to the list. */
export function createLibraryNav() {
  const listeners = new Set<() => void>();
  let revision = 0;
  const menu = () => { revision++; for (const listener of listeners) listener(); };
  return {
    menu,
    /** The three ways in (left menu, command center, `/artifact`): reset a mounted screen, then show it. */
    open(openScreen: (target: { screenId: string }) => void) { menu(); openScreen({ screenId: LIBRARY_SCREEN_ID }); },
    subscribe(listener: () => void) { listeners.add(listener); return () => { listeners.delete(listener); }; },
    snapshot: () => revision,
  };
}
export type LibraryNav = ReturnType<typeof createLibraryNav>;

/** Params a chat card / explicit open puts in the screen URL (strings only). */
export function chatDetailParams(input: { sessionId: string; artifactId: string; version?: number; title?: string; requestId?: string; returnServerId?: string }): PluginScreenParams {
  const params: PluginScreenParams = { view: "detail", from: "chat", sessionId: input.sessionId, returnAgent: input.sessionId, artifactId: input.artifactId, nonce: `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 8)}` };
  // The host the user left from, captured at entry: X never derives it from the screen's current host.
  if (input.returnServerId) params.returnServerId = input.returnServerId;
  if (input.version) params.version = String(input.version);
  if (input.title) params.title = input.title.slice(0, 100);
  if (input.requestId) params.requestId = input.requestId;
  return params;
}
export const requestDetailParams = (request: SidebarRequest, returnServerId?: string) => chatDetailParams({ sessionId: request.sessionId, artifactId: request.artifactId, version: request.version, requestId: request.requestId, returnServerId });
export const libraryScreenTitle = (params: PluginScreenParams) => params.view === "detail" && params.title ? params.title : ui("Artifacts", "아티팩트");

/** One full-surface detail: from a chat card / explicit open (`from: "chat"`) or from the gallery's focus sheet. */
export interface Detail {
  key: string; artifactId: string; version?: number; sessionId: string | null; title?: string;
  from: "gallery" | "chat"; returnAgent?: string; returnServerId?: string; nonce?: string; requestId?: string;
}
export function detailFromParams(params: PluginScreenParams): Detail | null {
  if (params.view !== "detail" || !params.artifactId) return null;
  const version = Number(params.version);
  return {
    key: `chat:${params.nonce ?? ""}:${params.artifactId}:${params.version ?? ""}`, artifactId: params.artifactId,
    version: Number.isInteger(version) && version > 0 ? version : undefined, sessionId: params.sessionId || null, title: params.title,
    from: "chat", returnAgent: params.returnAgent || undefined, returnServerId: params.returnServerId || undefined, nonce: params.nonce || undefined, requestId: params.requestId || undefined,
  };
}

/** The open full-surface detail over the gallery. `artifactId` follows a duplicate made inside it. */
export type Sheet = { detail: Detail; artifactId: string; item: LibraryItem };
export const makeSheet = (item: LibraryItem): Sheet => ({ detail: { key: `gallery:${item.artifactId}:${Date.now()}`, artifactId: item.artifactId, sessionId: item.sessionId, title: item.title, from: "gallery" }, artifactId: item.artifactId, item });

type NavEntries = { currentEntry?: { index: number }; entries?: () => { url?: string | null }[] };
/** The entry right below this sheet is this screen's list (same path, no `param.view`): going back lands on it. */
export function listBelow(pushedHere: boolean) {
  const api = (window as { navigation?: NavEntries }).navigation;
  try {
    const at = api?.currentEntry?.index, below = typeof at === "number" && at > 0 ? api?.entries?.()[at - 1]?.url : undefined;
    if (below) { const url = new URL(below, location.href); return url.origin === location.origin && url.pathname === location.pathname && !url.searchParams.has("param.view"); }
  } catch { /* fall through to what this window pushed */ }
  return pushedHere;
}
/** URL / reload entry with no list below it: a real same-origin replace navigation to this host's list, so X leaves the sheet without a new step. */
export function replaceWithList() {
  const url = new URL(location.href);
  for (const key of [...url.searchParams.keys()]) if (key.startsWith("param.")) url.searchParams.delete(key);
  location.replace(url.href);
}
/** A duplicate was selected inside the sheet: this entry now names the copy (the entries below stay), for reload, back and forward. */
export function renameSheetEntry(artifactId: string) {
  const url = new URL(location.href);
  url.searchParams.set("param.artifactId", artifactId);
  history.replaceState(history.state, "", url);
}
