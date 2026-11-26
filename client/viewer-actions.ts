import { copyText } from "@getpaseo/plugin/client/ui";
import type { ArtifactVersion } from "./store";

export function copyArtifact(code: string): Promise<void> { return copyText(code); }

export function exportArtifact(version: ArtifactVersion, title: string): void {
  const format = version.format ?? (version.kind === "react" ? "react" : "html");
  const extension = format === "react" ? "tsx" : format;
  const clean = title.replace(/[<>:"/\\|?*\u0000-\u001f]/g, "_").trim().replace(/[. ]+$/, "").slice(0, 100) || "artifact";
  const name = /^(?:con|prn|aux|nul|com[1-9]|lpt[1-9])(?:\.|$)/i.test(clean) ? "_" + clean : clean;
  const type = format === "svg" ? "image/svg+xml" : format === "react" ? "text/plain" : "text/html";
  const url = URL.createObjectURL(new Blob([version.code], { type: type + ";charset=utf-8" }));
  const link = document.createElement("a");
  try {
    link.href = url;
    link.download = name + "." + extension;
    document.body.appendChild(link);
    link.click();
  } finally {
    link.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
}

export async function toggleArtifactFullscreen(element: HTMLElement): Promise<boolean> {
  const doc = element.ownerDocument;
  if (doc.fullscreenElement === element) { await doc.exitFullscreen(); return false; }
  if (!doc.fullscreenEnabled || !element.requestFullscreen) return false;
  try { await element.requestFullscreen(); return doc.fullscreenElement === element; }
  catch { return false; }
}
export async function exitArtifactFullscreen(): Promise<void> {
  if (document.fullscreenElement) await document.exitFullscreen();
}
