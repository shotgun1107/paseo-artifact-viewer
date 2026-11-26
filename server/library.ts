import { localized } from "../shared/language";
import type { PaseoApi } from "@getpaseo/client";
import { SaxesParser } from "saxes";
import type { LibraryItem } from "../shared/library";

export const maxThumbnailBytes = 8192;
const staticElements = new Set("svg g path rect circle ellipse line polyline polygon title desc text tspan".split(" "));
const attributes = new Set(("xmlns viewBox width height x y x1 y1 x2 y2 cx cy r rx ry points d " +
  "fill stroke stroke-width fill-rule clip-rule stroke-linecap stroke-linejoin opacity fill-opacity " +
  "stroke-opacity transform text-anchor font-size font-weight preserveAspectRatio").split(" "));

/** Only small, self-contained SVG images can travel in the summary response. */
export function staticThumbnail(source: string | null): string | null {
  if (!source || Buffer.byteLength(source) > maxThumbnailBytes) return null;
  // SVG copied from HTML can omit its namespace. Add it only to an unqualified root, then parse it as XML.
  const image = source.replace(/^(\s*(?:<\?xml\s[^?]*\?>\s*)?<svg)(?=[\s/>])([^>]*>)/, (root, name: string, attrs: string) =>
    /\sxmlns\s*=/.test(attrs) ? root : name + ' xmlns="http://www.w3.org/2000/svg"' + attrs);
  let safe = true, rootSeen = false;
  const parser = new SaxesParser({ xmlns: true });
  parser.on("opentag", tag => {
    if (!rootSeen) { safe = safe && tag.name === "svg"; rootSeen = true; }
    if (tag.uri !== "http://www.w3.org/2000/svg" || !staticElements.has(tag.name)) safe = false;
    for (const attribute of Object.values(tag.attributes)) {
      if (!attributes.has(attribute.name)) safe = false;
      if (attribute.name === "fill" || attribute.name === "stroke") {
        if (!/^(?:#[\da-f]{3,8}|[a-z]+|(?:rgb|hsl)a?\([\d\s.,%/+\-]+\))$/i.test(attribute.value.trim())) safe = false;
      }
    }
  });
  parser.on("doctype", () => { safe = false; });
  parser.on("processinginstruction", () => { safe = false; });
  try { parser.write(image).close(); } catch { return null; }
  return rootSeen && safe ? "data:image/svg+xml;base64," + Buffer.from(image).toString("base64") : null;
}

export type LibraryRow = Omit<LibraryItem, "sessionTitle" | "workspaceName" | "sessionTitleStatus">;
type DirectoryEntry<T> = { id: string; value: T };
type DirectoryPage<T> = { entries: DirectoryEntry<T>[]; next: string | null };

async function findInDirectory<T>(ids: Set<string>, page: (cursor?: string) => Promise<DirectoryPage<T>>) {
  const values = new Map<string, T>();
  const visited = new Set<string>();
  let cursor: string | undefined;
  try {
    while (values.size < ids.size) {
      const result = await page(cursor);
      for (const { id, value } of result.entries) if (ids.has(id)) values.set(id, value);
      if (!result.next) break;
      if (visited.has(result.next)) return { values, complete: false };
      cursor = result.next;
      visited.add(cursor);
    }
    return { values, complete: true };
  } catch { return { values, complete: false }; }
}

function displayName(value: string | null | undefined, id: string) {
  const name = value?.trim();
  if (!name || name === id || /^[0-9a-f]{8}(?:-[0-9a-f]{4}){3}-[0-9a-f]{12}$/i.test(name)) return null;
  return name;
}

/** Resolve the distinct sources in directory pages. Never issue a per-card RPC. */
export async function withSourceNames(items: LibraryRow[], paseo: PaseoApi, locale?: string): Promise<LibraryItem[]> {
  const ids = new Set(items.flatMap(item => item.sessionId ? [item.sessionId] : []));
  const agents = await findInDirectory(ids, async cursor => {
    const result = await paseo.agents.list({ filter: { includeArchived: true }, includeBackground: true, page: { limit: 200, cursor } });
    return { entries: result.entries.map(({ agent }) => ({ id: agent.id, value: { title: displayName(agent.title, agent.id), workspaceId: agent.workspaceId } })), next: result.pageInfo.nextCursor };
  });
  const workspaceIds = new Set([...agents.values.values()].flatMap(a => a.workspaceId ? [a.workspaceId] : []));
  const workspaces = await findInDirectory(workspaceIds, async cursor => {
    const result = await paseo.workspaces.list({ includeBackground: true, page: { limit: 200, cursor } });
    return { entries: result.entries.map(w => ({ id: w.id, value: displayName(w.name, w.id) })), next: result.pageInfo.nextCursor };
  });
  const fallbackTitles = {
    untitled: localized(locale, "Untitled conversation", "이름 없는 대화"),
    deleted: localized(locale, "Deleted conversation", "삭제된 대화"),
    unavailable: localized(locale, "Source unavailable", "출처 확인 불가"),
  };
  return items.map(item => {
    const agent = item.sessionId ? agents.values.get(item.sessionId) : undefined;
    const status = agent ? "untitled" : !item.sessionId || agents.complete ? "deleted" : "unavailable";
    return {
      ...item,
      ...(agent?.title ? { sessionTitle: agent.title } : { sessionTitle: fallbackTitles[status], sessionTitleStatus: status }),
      workspaceName: agent?.workspaceId ? workspaces.values.get(agent.workspaceId) ?? null : null,
    };
  });
}
