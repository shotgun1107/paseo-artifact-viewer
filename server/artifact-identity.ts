import { createHash } from "node:crypto";

export function noticeId(artifactId: string, version: number) {
  return `artifact:${artifactId}:${version}`;
}

/** These encodings are persisted in the version and request tables. */
export function contentHash(content: string) {
  return createHash("sha256").update(content, "utf8").digest("hex");
}

export function hash(value: unknown) {
  return contentHash(JSON.stringify(value));
}

export function requestKey(...parts: (string | number)[]) {
  return JSON.stringify(parts);
}
