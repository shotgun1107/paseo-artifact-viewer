import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import { hostname, userInfo } from "node:os";
import { join, resolve } from "node:path";

export const copiedFiles = [
  "paseo-plugin.json", "LICENSE", "README.md", "OVERVIEW.md", "OVERVIEW.ko.md",
  "THIRD_PARTY_NOTICES.md", "media/gallery.png", "media/preview.png", "media/icon.png",
];
export const releaseFiles = [
  ...copiedFiles, "package.json", "index.client.ts", "index.server.ts", "THIRD_PARTY_LICENSES.txt",
].sort();

export function releaseDirectory(root, version) {
  if (process.env.PASEO_ARTIFACT_BUILD_DIR) return resolve(root, process.env.PASEO_ARTIFACT_BUILD_DIR);
  const workspace = resolve(root, "../../..");
  if (root === join(workspace, "projects", "artifact-viewer", "plugin") && existsSync(join(workspace, "docs", "STATUS.md"))) {
    return join(workspace, "artifacts", "artifact-viewer", version);
  }
  return join(root, "dist", version);
}

// Pinned upstream copyright notices. An address elsewhere in the package is an error.
const copyrightContacts = new Set([
  "marijn@haverbeke.berlin", "me@jongleberry.com", "doug@somethingdoug.com",
  "luke.edwards05@gmail.com", "justin@ridgewell.name", "jridgewell@google.com",
]);
const email = /[\w.!%+-]+@[\w.-]+\.[a-z]{2,}\b/gi;
const credentials = [
  /\b(?:github_pat_|gh[pousr]_|npm_|sk-(?:proj-|ant-)?|xox[baprs]-)[A-Za-z0-9_-]{16,}/i,
  /\b(?:AKIA|ASIA)[A-Z0-9]{16}\b/,
  /-----BEGIN (?:[A-Z0-9 ]+ )?PRIVATE KEY-----/,
  /(?:^|[/:;\s])_(?:authToken|auth)\s*=\s*[^\s$"']{6,}/im,
  /(?:_authToken|_auth|api[_-]?key|password|access[_-]?token)["']?\s*[:=]\s*["'][A-Za-z0-9_+./=-]{12,}["']/i,
  /\b(?:https?|git\+https):\/\/[^/\s@"']+:[^/\s@"']+@/i,
];

function verifyPng(file, data) {
  assert.ok(data.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10])), "Invalid PNG signature: " + file);
  // Screenshots and icon may contain color and raster data. Text, EXIF, arbitrary
  // private chunks and data appended after IEND can carry hidden local metadata.
  const allowed = new Set(["IHDR", "IDAT", "IEND", "PLTE", "tRNS", "gAMA", "cHRM", "sRGB", "pHYs", "sBIT", "bKGD"]);
  let imageData = false;
  for (let offset = 8; offset + 12 <= data.length;) {
    const size = data.readUInt32BE(offset);
    const type = data.toString("ascii", offset + 4, offset + 8);
    assert.ok(allowed.has(type), "Unexpected PNG metadata or chunk in " + file);
    if (offset === 8) assert.ok(type === "IHDR" && size === 13, "Missing PNG header: " + file);
    offset += 12 + size;
    assert.ok(offset <= data.length, "Truncated PNG: " + file);
    if (type === "IDAT" && size > 0) imageData = true;
    if (type === "IEND") {
      assert.ok(imageData && size === 0 && offset === data.length, "Incomplete PNG or trailing data: " + file);
      return;
    }
  }
  throw new Error("Missing PNG end: " + file);
}

export function verifyReleaseContent(file, data, root) {
  if (file.endsWith(".png")) return verifyPng(file, data);
  const text = data.toString("utf8");
  for (const pattern of credentials) assert.ok(!pattern.test(text), "Possible credential in " + file);
  for (const line of text.split(/\r?\n/)) {
    for (const address of line.match(email) ?? []) {
      assert.ok(file === "THIRD_PARTY_LICENSES.txt" && /^Copyright\b/i.test(line) && copyrightContacts.has(address),
        "Unexpected email address in " + file);
    }
  }
  assert.ok(!/\/\/[#@]\s*source(?:Mapping)?URL\s*=|\/\*[#@]\s*source(?:Mapping)?URL\s*=/.test(text), "Source map or source URL in " + file);
  // Check both literal Windows paths and JSON/JS-escaped paths. Match drive roots
  // at a word boundary so ordinary https:// references are not treated as drives.
  const normalized = text.replaceAll("\\", "/").toLowerCase();
  assert.ok(!/\b[a-z]:\/|\/(?:users|home|tmp|private\/(?:var|tmp)|var\/folders|mnt\/[a-z])\/[^/\s]/i.test(normalized), "Local path in " + file);
  const account = userInfo().username.toLowerCase();
  const privateMarkers = [hostname(), process.env.COMPUTERNAME];
  // Common OS accounts are also ordinary words in bundled DOM/runtime code.
  // Their home directories are still checked by the path rule above.
  if (account.length >= 3 && !/^(?:root|admin|administrator|runner|user|node|build|test|ubuntu|developer)$/i.test(account)) privateMarkers.push(account);
  const inspected = normalized.replaceAll("github.com/shotgun1107/paseo-artifact-viewer", "github.com/public-project");
  assert.ok(!inspected.includes(root.replaceAll("\\", "/").toLowerCase()), "Build directory in " + file);
  for (const marker of privateMarkers.filter(Boolean)) {
    if (marker.toLowerCase() === "localhost") continue;
    const value = marker.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const identifier = new RegExp("(?<![a-z0-9])" + value + "(?![a-z0-9])", "i");
    assert.ok(!identifier.test(inspected), "Local identity in " + file);
  }
}
