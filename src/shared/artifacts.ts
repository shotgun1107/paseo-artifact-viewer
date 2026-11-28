import { artifactLocale, localized } from "./language";

export type ArtifactKind = "html" | "react";
export const MAX_SOURCE_LENGTH = 512_000;
export interface ExtractedArtifact {
  id: string;
  title: string;
  /** The pre-0.9 spelling used in persisted extraction request hashes. */
  legacyDefaultTitle?: string;
  kind: ArtifactKind;
  code: string;
  complete: boolean;
  explicit: boolean;
  sourceRange?: readonly [number, number];
}
export function fingerprint(value: string): string {
  let hash = 2166136261;
  for (let i = 0; i < value.length; i++) hash = Math.imul(hash ^ value.charCodeAt(i), 16777619);
  return (hash >>> 0).toString(36);
}
function attribute(info: string, key: string): string | undefined {
  return new RegExp(`(?:^|\\s)${key}=(?:"([^"]+)"|'([^']+)'|([^\\s]+))`, "i").exec(info)?.slice(1).find(Boolean);
}
function extractedTitle(authored: string | undefined, en: string, ko: string, locale?: string) {
  return authored === undefined
    ? { title: localized(locale, en, ko), legacyDefaultTitle: ko }
    : { title: authored.slice(0, 100) };
}

export function extractArtifacts(text: string, sourceId: string, locale?: string): ExtractedArtifact[] {
  const found: ExtractedArtifact[] = [];
  const fencedRanges: (readonly [number, number])[] = [];
  // Prose and unsupported code stay native; known artifact envelopes are parsed below.
  const fence = /^([ \t]*)(`{3,}|~{3,})([^\r\n]*)\r?\n/gm;
  let match: RegExpExecArray | null;
  while ((match = fence.exec(text)) && found.length < 12) {
    const info = match[3].trim(), language = info.split(/\s+/)[0].toLowerCase();
    const close = new RegExp(`^[ \\t]*${match[2][0]}{${match[2].length},}[ \\t]*\\r?$`, "gm");
    close.lastIndex = fence.lastIndex;
    const end = close.exec(text), code = text.slice(fence.lastIndex, end?.index ?? text.length).trim();
    fence.lastIndex = end ? close.lastIndex : text.length;
    fencedRanges.push([match.index, fence.lastIndex]);
    const kind = ["html", "htm", "svg"].includes(language) ? "html" : ["jsx", "tsx", "react"].includes(language) ? "react" : null;
    if (!kind || !code || code.length > MAX_SOURCE_LENGTH) continue;
    if (kind === "html" && !/<(?:!doctype|html|body|main|div|svg|section|style|script|h[1-6]|canvas)\b/i.test(code)) continue;
    if (kind === "react" && !/\b(?:export|function|const|class|import)\b/.test(code)) continue;
    const marker = /(?:<!--|\/\/)\s*artifact:\s*([a-zA-Z0-9][\w.-]{0,79})/.exec(code)?.[1];
    const supplied = attribute(info, "artifact") ?? marker;
    const explicit = !!supplied && /^[a-zA-Z0-9][\w.-]{0,79}$/.test(supplied);
    const authored = attribute(info, "title") ?? (kind === "html" ? /<title[^>]*>([^<]+)<\/title>/i.exec(code)?.[1] : undefined);
    const label = kind === "html" ? "HTML" : "React", index = found.length + 1;
    const title = extractedTitle(authored, `${label} artifact ${index}`, `${label} 아티팩트 ${index}`, locale);
    found.push({ id: explicit ? supplied! : `${sourceId}:${found.length}`, ...title, kind, code, complete: !!end, explicit, sourceRange: [match.index, end ? close.lastIndex : text.length] });
  }
  // Claude-compatible envelopes are accepted too; only known renderable types.
  const xml = /<(antArtifact|artifact)\b([^>]*)>/gi;
  while ((match = xml.exec(text)) && found.length < 12) {
    if (fencedRanges.some(range => match!.index >= range[0] && match!.index < range[1])) continue;
    const info = match[2], mime = attribute(info, "type")?.toLowerCase();
    const kind = mime === "application/vnd.ant.react" || mime === "react" ? "react" : ["text/html", "image/svg+xml", "html", "svg"].includes(mime ?? "") ? "html" : null;
    if (!kind) continue;
    const close = new RegExp(`</${match[1]}\\s*>`, "gi"); close.lastIndex = xml.lastIndex;
    const end = close.exec(text), raw = text.slice(xml.lastIndex, end?.index ?? text.length).trim();
    const code = raw.replace(/^```(?:html|tsx|jsx|react|svg)?[^\n]*\n([\s\S]*?)\n```$/, "$1");
    const id = attribute(info, "identifier") ?? attribute(info, "id"), explicit = !!id && /^[a-zA-Z0-9][\w.-]{0,79}$/.test(id);
    if (code && code.length <= MAX_SOURCE_LENGTH) {
      const range: readonly [number, number] = [match.index, end ? close.lastIndex : text.length];
      for (let i = found.length - 1; i >= 0; i--) if (found[i].sourceRange && found[i].sourceRange![0] >= range[0] && found[i].sourceRange![1] <= range[1]) found.splice(i, 1);
      const title = extractedTitle(attribute(info, "title"), "Artifact", "아티팩트", locale);
      found.push({ id: explicit ? id! : `${sourceId}:xml:${found.length}`, ...title, kind, code, complete: !!end, explicit, sourceRange: range });
    }
    xml.lastIndex = end ? close.lastIndex : text.length;
  }
  return found.sort((a, b) => (a.sourceRange?.[0] ?? 0) - (b.sourceRange?.[0] ?? 0));
}
/** Render the prose and native links; move supported bodies into artifact cards. */
export function artifactMessageText(text: string, artifacts: readonly ExtractedArtifact[]) {
  let result = text;
  for (const item of [...artifacts].sort((a, b) => (b.sourceRange?.[0] ?? 0) - (a.sourceRange?.[0] ?? 0))) {
    if (item.sourceRange) result = result.slice(0, item.sourceRange[0]) + result.slice(item.sourceRange[1]);
  }
  return result.replace(/\n{3,}/g, "\n\n").trim();
}
export function kindFromFilename(name: string): ArtifactKind | null {
  return /\.(html?|svg)$/i.test(name) ? "html" : /\.(jsx|tsx)$/i.test(name) ? "react" : null;
}
export function artifactPrompt(id: string, request: string, current?: ExtractedArtifact & { artifactId?: string }, locale?: string): string {
  const title = current?.title.replace(/["\r\n]/g, " ") ?? localized(locale, "Artifact", "아티팩트");
  const fence = `\`\`\`${current?.kind === "react" ? "tsx" : "html"} artifact="${id}" title="${title}"`;
  if (artifactLocale(locale) === "en") return [
    request.trim(),
    "To create or edit an artifact, publish the complete single-file content using artifact_publish and check the result. Use artifact_open when asked to open a saved artifact.",
    current?.artifactId ? `Publish a new version using the existing artifactId ${current.artifactId}.`
      : `For an edit, find the target using artifact_list and artifact_read and keep its artifactId. For a new result, you may use the key ${id}.`,
    "If the tools are unavailable, send a code block with an opening line like this one.",
    fence,
    "For React, use tsx and a default export. Keep the same artifact ID for edits and return the entire file.",
    "Supported React packages are react, react-dom, lucide-react, and recharts. Keep all local code in the same file.",
    current ? `Current artifact (${current.kind}):\n${current.code}` : "",
  ].filter(Boolean).join("\n");
  return [request.trim(), "만들거나 수정할 때는 완성한 단일 파일 본문을 artifact_publish로 발행하고 결과를 확인해 주세요. 이미 저장된 결과를 열어 달라는 요청에는 artifact_open을 사용하세요.",
    current?.artifactId ? `기존 artifactId는 ${current.artifactId}입니다. 이 결과물의 새 버전으로 발행하세요.`
      : `기존 결과 수정이라면 artifact_list와 artifact_read로 대상을 확인해 같은 artifactId를 사용하세요. 새 결과를 만들 때 사용할 수 있는 key는 ${id}입니다.`,
    "도구가 없는 경우에만 코드 블록으로 전달하세요. 여는 줄의 예시는 다음과 같습니다.",
    fence,
    "React를 선택하면 언어를 tsx로 바꾸고 default export를 포함하세요. 같은 결과물을 수정할 때 artifact ID를 유지하고 전체 파일을 반환하세요.",
    "지원 React 패키지: react, react-dom, lucide-react, recharts. 다른 로컬 파일 import는 사용하지 마세요.",
    current ? `현재 결과물 (${current.kind}):\n${current.code}` : "",
  ].filter(Boolean).join("\n");
}
