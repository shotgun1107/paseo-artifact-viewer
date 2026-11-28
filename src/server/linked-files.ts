import { posix, win32 } from "node:path";
import { fileURLToPath } from "node:url";
import type { AgentTimelineItem } from "@getpaseo/protocol/agent-types";
import { MAX_SOURCE_LENGTH } from "../shared/artifacts";
import type { ArtifactFormat } from "../shared/contracts";

type Snapshot = { path: string; content: string; format: ArtifactFormat; callId: string };
const artifactWord = /아티팩트|아티펙트|\bartifacts?\b/i;

function fileKey(value: string, cwd: string | null) {
  const paths = /^[a-z]:[/\\]|^\\\\/i.test(cwd || value) ? win32 : posix;
  const path = paths.isAbsolute(value) || !cwd ? paths.normalize(value) : paths.resolve(cwd, value);
  return paths === win32 ? path.replaceAll("\\", "/").toLowerCase() : path;
}

function linkTarget(raw: string) {
  const name = raw.trim().replace(/^<|>$/g, "").replace(/#L\d+(?:-L?\d+)?$/i, "");
  try {
    if (/^file:\/\//i.test(name)) return fileURLToPath(name);
    if (/^[a-z][\w+.-]*:/i.test(name) && !/^[a-z]:[/\\]/i.test(name)) return null;
    return decodeURIComponent(name);
  } catch { return null; }
}

function formatOf(path: string): ArtifactFormat | undefined {
  if (/\.html?$/i.test(path)) return "html";
  if (/\.svg$/i.test(path)) return "svg";
  if (/\.[jt]sx$/i.test(path)) return "react";
}

/** Only completed writes/edits in this turn can supply content. A Markdown link never causes a disk read. */
export class LinkedFiles {
  private snapshots = new Map<string, Snapshot>();
  private askedForArtifact = false;
  constructor(private readonly cwd: string | null) {}

  observe(item: AgentTimelineItem) {
    if (item.type === "user_message") {
      this.snapshots.clear();
      this.askedForArtifact = artifactWord.test(item.text);
      return;
    }
    if (item.type !== "tool_call" || item.status !== "completed") return;
    const d = item.detail;
    if (d.type !== "edit" && d.type !== "write") return;
    const path = fileKey(d.filePath, this.cwd), format = formatOf(path);
    if (!format) return;
    const before = this.snapshots.get(path)?.content;
    this.snapshots.delete(path); // An incomplete later edit invalidates the earlier snapshot.
    let content = d.type === "write" ? d.content : d.newString;
    if (content === undefined || content.length > MAX_SOURCE_LENGTH || (!content && (d.type !== "edit" || !d.oldString))) return;
    if (d.type === "edit" && d.oldString) {
      if (!before || before.indexOf(d.oldString) < 0 || before.indexOf(d.oldString) !== before.lastIndexOf(d.oldString)) return;
      const replacement = content;
      content = before.replace(d.oldString, () => replacement);
    } else if (d.type === "edit") {
      // Codex exposes newly added files as edit.newString. Ignore isolated hunks.
      if (d.unifiedDiff || !(format === "html" ? /^\s*(?:<!doctype\s+html\b|<html\b)/i.test(content) && /<\/html>\s*$/i.test(content)
        : format === "svg" ? /^\s*(?:<\?xml[^>]*>\s*)?<svg\b/i.test(content) && /(?:<\/svg>|\/>)\s*$/i.test(content)
        : /\bexport\s+default\b/.test(content))) return;
    }
    if (content && content.length <= MAX_SOURCE_LENGTH) this.snapshots.set(path, { path, content, format, callId: item.callId });
  }

  deliveries(reply: string) {
    const files = new Map<string, Snapshot & { title: string }>();
    if (!this.snapshots.size) return [];
    for (const match of reply.matchAll(/\[([^\]\n]+)\]\((<[^>\n]+>|(?:[^()\n]|\([^()\n]*\))+)\)/g)) {
      const [, label, raw] = match;
      if (!this.askedForArtifact && !artifactWord.test(label)) continue;
      const name = linkTarget(raw);
      const file = name && this.snapshots.get(fileKey(name, this.cwd));
      if (!file) continue;
      const docTitle = file.format !== "react" && /<title\b[^>]*>([^<]+)<\/title>/i.exec(file.content)?.[1];
      const title = (docTitle || label).trim().slice(0, 100) || posix.basename(file.path).slice(0, 100);
      files.set(file.path, { ...file, title });
    }
    return [...files.values()];
  }
}
