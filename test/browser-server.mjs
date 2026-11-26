// The fixture supplies host I/O. Both source and package modes register the real
// plugin entry, use its schemas and write to a fresh SQLite database.
import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";
import { copyFileSync, readFileSync } from "node:fs";
import { temporaryDirectory } from "./temp-directory.mjs";
import { basename, dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { build } from "esbuild";
import { assertPluginCompatibility } from "@getpaseo/protocol/plugin-requirements";
import { createLifecycleRegistration } from "@getpaseo/plugin/internal/lifecycle";
import { releaseDirectory, releaseFiles, verifyReleaseContent } from "../scripts/release-package.mjs";

export const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
export const metadata = JSON.parse(readFileSync(join(root, "package.json"), "utf8"));
export const output = releaseDirectory(root, metadata.version);

export function readRelease() {
  const report = JSON.parse(readFileSync(join(output, "build-verification.json"), "utf8"));
  const archive = join(output, metadata.name + "-" + metadata.version + ".tgz");
  const sha256 = createHash("sha256").update(readFileSync(archive)).digest("hex");
  assert.equal(report.archiveSha256, sha256, "archive digest must match the build report");
  const tar = (...args) => execFileSync("tar", args, { cwd: output, encoding: "utf8", maxBuffer: 32 * 1024 * 1024, windowsHide: true });
  const entries = tar("-tf", basename(archive)).trim().split(/\r?\n/).sort();
  assert.deepEqual(entries, releaseFiles.map(name => "package/" + name));
  const contents = new Map();
  for (const name of releaseFiles) {
    const bytes = execFileSync("tar", ["-xOf", basename(archive), "package/" + name],
      { cwd: output, maxBuffer: 32 * 1024 * 1024, windowsHide: true });
    verifyReleaseContent(name, bytes, root);
    contents.set(name, bytes);
  }
  const read = name => contents.get(name).toString("utf8");
  const packedMetadata = JSON.parse(read("package.json"));
  assert.equal(packedMetadata.version, metadata.version);
  assert.equal(packedMetadata.license, "MIT");
  assert.equal(packedMetadata.private, undefined);
  assert.equal(packedMetadata.dependencies, undefined);
  assert.deepEqual(packedMetadata.files, releaseFiles);
  const manifest = JSON.parse(read("paseo-plugin.json"));
  assert.deepEqual(manifest, JSON.parse(readFileSync(join(root, "paseo-plugin.json"), "utf8")));
  // Check the archive with the same version gate the daemon applies before loading it.
  const sdk = JSON.parse(readFileSync(join(root, "node_modules/@getpaseo/plugin/package.json"), "utf8"));
  assertPluginCompatibility({ id: manifest.id, requirements: manifest.requirements, version: sdk.version, runtime: "daemon" });
  const licenseText = read("THIRD_PARTY_LICENSES.txt");
  const licenses = JSON.parse(readFileSync(join(output, "dependency-licenses.json"), "utf8"));
  assert.deepEqual(licenses.map(({ texts, ...dep }) => dep), report.bundledDependencies);
  for (const { name, version, texts } of licenses) {
    assert.ok(licenseText.includes(name + "@" + version) && texts.length);
    for (const { text } of texts) assert.ok(licenseText.includes(text.replaceAll("\r\n", "\n")), "Missing license text for " + name);
  }
  return { sha256, entries, client: read("index.client.ts"), server: read("index.server.ts") };
}

export async function startServerFixture(release, initialDatabase) {
  const compiled = await build({
    ...(release ? { stdin: { contents: release.server, resolveDir: root, sourcefile: "package/index.server.ts", loader: "ts" } } : { entryPoints: [join(root, "index.server.ts")] }),
    bundle: true, write: false, platform: "node", format: "esm", mainFields: ["module", "main"], target: "node22",
    external: ["node:*"],
    plugins: [{ name: "fixture-host-modules", setup(build) {
      build.onResolve({ filter: /^(@getpaseo\/plugin(\/server)?|zod)$/ }, ({ path }) =>
        ({ path: import.meta.resolve(path), external: true }));
    } }]
  });
  const plugin = await import("data:text/javascript;base64," + Buffer.from(compiled.outputFiles[0].text).toString("base64"));
  const handlers = new Map(), hooks = new Map(), timelines = new Map(), notices = new Map();
  const lifecycle = createLifecycleRegistration((name, handler) => {
    hooks.set(name, handler);
    return () => hooks.delete(name);
  });
  // Two agent directories on one isolated host; the plugin resolves names using the SDK list APIs.
  const workspaces = [{ id: "test-workspace", name: "기획 작업공간" }, { id: "gallery-workspace", name: "디자인 작업공간" }];
  const agents = [
    { id: "gallery-a", title: "기획 대화", workspaceId: workspaces[0].id },
    { id: "gallery-b", title: "디자인 대화", workspaceId: workspaces[1].id },
  ];
  const directoryResult = entries => ({ entries, pageInfo: { nextCursor: null, prevCursor: null, hasMore: false } });
  const paseo = {
    workspaces: { list: async () => directoryResult(workspaces) },
    agents: { list: async () => directoryResult(agents.map(agent => ({ agent }))), ref: id => ({ id, timeline: {
    refetch: async ({ cursor, direction, limit = 200 } = {}) => {
      const all = timelines.get(id) ?? [];
      const end = direction === "before" ? Number(cursor) : all.length;
      const start = Math.max(0, end - limit);
      return { entries: all.slice(start, end), epoch: "qa", hasOlder: start > 0, startCursor: String(start), staleCursor: false };
    },
    append: async item => {
      if (!notices.has(id)) notices.set(id, new Map());
      const session = notices.get(id);
      session.set(item.id, item);
      return { seq: session.size, epoch: "qa" };
    }
  } }) } };
  const { directory, discard } = temporaryDirectory();
  function open() {
    const previous = process.env.PASEO_ARTIFACT_DATA_DIR;
    process.env.PASEO_ARTIFACT_DATA_DIR = directory;
    try {
      return plugin.default({ ...lifecycle, handle(contract, handler) {
        assert.ok(!handlers.has(contract.name));
        handlers.set(contract.name, { contract, handler });
      } });
    } finally {
      if (previous === undefined) delete process.env.PASEO_ARTIFACT_DATA_DIR;
      else process.env.PASEO_ARTIFACT_DATA_DIR = previous;
    }
  }
  let cleanup;
  try { if (initialDatabase) copyFileSync(initialDatabase, join(directory, "artifacts.sqlite")); cleanup = open(); } catch (error) { discard(); throw error; }
  return {
    handlers, hooks, timelines, notices, paseo, directory,
    async rpc(name, value) {
      const found = handlers.get(name);
      assert.ok(found, "Unknown test RPC: " + name);
      return found.contract.output.parse(await found.handler(found.contract.input.parse(value), { paseo }));
    },
    async restart() { await cleanup(); handlers.clear(); cleanup = open(); },
    async close() { try { await cleanup(); } finally { discard(); } },
  };
}
