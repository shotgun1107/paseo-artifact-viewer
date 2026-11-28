import { build } from "esbuild";
import assert from "node:assert/strict";
import { readFileSync, writeFileSync, mkdirSync, readdirSync, lstatSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { resolve, dirname, join } from "node:path";
import { createHash } from "node:crypto";
import { checkClientRegistration } from "./check-client-registration.mjs";
import { bundledLicenses } from "./bundled-licenses.mjs";
import { spawnSync } from "node:child_process";
import { copiedFiles, releaseDirectory, releaseFiles, verifyReleaseContent } from "./release-package.mjs";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
function sourceSnapshot() {
  const inputs = [...Object.values(copiedFiles), "index.client.tsx", "index.server.ts", "package.json", "package-lock.json",
    "scripts/build.mjs", "scripts/bundled-licenses.mjs", "scripts/check-client-registration.mjs", "scripts/release-package.mjs", "tsconfig.json", "licenses/saxes-6.0.0.txt"];
  for (const name of readdirSync(join(root, "src"), { recursive: true })) {
    if (/\.(ts|tsx)$/.test(name)) inputs.push("src/" + name.replaceAll("\\", "/"));
  }
  return Object.fromEntries(inputs.sort().map(file => [file, createHash("sha256").update(readFileSync(join(root, file))).digest("hex")]));
}
const sourceFiles = sourceSnapshot();
const sourcePackage = JSON.parse(readFileSync(join(root, "package.json"), "utf8"));
assert.equal(sourcePackage.private, true, "The source checkout must remain private");
const output = releaseDirectory(root, sourcePackage.version);
mkdirSync(output, { recursive: true });
const external = ["@getpaseo/plugin", "@getpaseo/plugin/client", "@getpaseo/plugin/client/ui", "@getpaseo/client", "@getpaseo/protocol", "@tanstack/react-query", "react", "react/jsx-runtime", "react-native", "zod"];
// SDK types are used by the source, but the client host does not expose these
// two packages as runtime modules. Keep them external and reject value imports.
const unavailableClientModules = new Set(["@getpaseo/client", "@getpaseo/protocol"]);
const buildOptions = { entryPoints: [join(root, "index.client.tsx")], absWorkingDir: root, bundle: true, write: false, jsx: "automatic", platform: "neutral", target: "es2020", mainFields: ["module", "main"], supported: { "async-await": false }, external, metafile: true, treeShaking: true };
const result = await build({ ...buildOptions, format: "cjs" });
const browserModule = await build({ ...buildOptions, format: "esm" });
const body = result.outputFiles[0].text, bundle = `(function(require){const module={exports:{}};const exports=module.exports;${body}\nreturn module.exports;})`;
const imports = Object.values(browserModule.metafile.outputs)[0].imports.filter(value => value.external).map(value => value.path);
for (const specifier of imports) if (!external.includes(specifier) || unavailableClientModules.has(specifier)) throw new Error("Unprovided host import: " + specifier);
writeFileSync(join(output, "client.bundle.js"), bundle);
writeFileSync(join(output, "bundle-metafile.json"), JSON.stringify(result.metafile, null, 2));
const backend = await build({ entryPoints: [join(root, "index.server.ts")], absWorkingDir: root, bundle: true, write: false, format: "esm", platform: "node", mainFields: ["module", "main"], target: "node22", external: ["@getpaseo/plugin", "@getpaseo/plugin/server", "@getpaseo/client", "zod", "node:*"], metafile: true });
const licenses = bundledLicenses(root, { client: browserModule.metafile, server: backend.metafile });
writeFileSync(join(output, "dependency-licenses.json"), JSON.stringify(licenses, null, 2));
writeFileSync(join(output, "THIRD_PARTY_LICENSES.txt"), licenses.map(pkg => `${pkg.name}@${pkg.version} (${pkg.license})\n${pkg.texts.map(item => item.text).join("\n")}`).join("\n\n"));
const counts = await checkClientRegistration(bundle);
// Paseo traverses declaration imports as well as runtime imports. Sandpack's
// declarations include Nodebox/Node types, although its browser runtime does not.
// Distribute the browser implementation already bundled, retaining host imports;
// no Nodebox declaration tree or dependency installation is needed on the daemon.
const distribution = join(output, "package");
mkdirSync(distribution, { recursive: true });
assert.ok(lstatSync(distribution).isDirectory(), "Expected a regular package directory");
for (const existing of readdirSync(distribution, { recursive: true })) {
  const file = existing.replaceAll("\\", "/");
  const stat = lstatSync(join(distribution, file));
  assert.ok((file === "media" && stat.isDirectory()) || (releaseFiles.includes(file) && stat.isFile()),
    "Unexpected entry in package directory: " + file);
}
const serverBody = backend.outputFiles[0].text;
writeFileSync(join(output, "server.bundle.mjs"), serverBody);
writeFileSync(join(output, "server-metafile.json"), JSON.stringify(backend.metafile, null, 2));
writeFileSync(join(output, "server-build-verification.json"), JSON.stringify({ title: "아티팩트 서버 빌드 검증", version: sourcePackage.version, bytes: Buffer.byteLength(serverBody), sha256: createHash("sha256").update(serverBody).digest("hex"), database: "node:sqlite; actual plugin-process availability must be verified before deployment", scope: "Isolated Node build; not installed or run inside Paseo" }, null, 2));
const { name, version, type, description, license, repository, homepage, keywords } = sourcePackage;
const packageMetadata = { name, version, type, description, license, repository, homepage, keywords, files: releaseFiles };
const payload = new Map(Object.entries(copiedFiles).map(([file, source]) => [file, readFileSync(join(root, source))]));
payload.set("package.json", Buffer.from(JSON.stringify(packageMetadata, null, 2) + "\n"));
payload.set("index.client.ts", browserModule.outputFiles[0].contents);
payload.set("index.server.ts", Buffer.from(serverBody));
payload.set("THIRD_PARTY_LICENSES.txt", readFileSync(join(output, "THIRD_PARTY_LICENSES.txt")));
assert.deepEqual([...payload.keys()].sort(), releaseFiles);
for (const [file, bytes] of payload) {
  // A Windows checkout may use CRLF. Preserve PNG bytes, and ship LF text everywhere.
  const data = file.endsWith(".png") ? Buffer.from(bytes) : Buffer.from(Buffer.from(bytes).toString("utf8").replaceAll("\r\n", "\n"));
  verifyReleaseContent(file, data, root);
  payload.set(file, data);
}
for (const [file, data] of payload) {
  mkdirSync(dirname(join(distribution, file)), { recursive: true });
  writeFileSync(join(distribution, file), data);
}
function pack(...options) {
  const proc = spawnSync(process.execPath, [process.env.npm_execpath, "pack", "--ignore-scripts", "--json", ...options],
    { cwd: distribution, encoding: "utf8", windowsHide: true });
  if (proc.error) throw proc.error;
  if (proc.status !== 0) throw new Error(proc.stderr || proc.stdout);
  const [result] = JSON.parse(proc.stdout);
  assert.deepEqual(result.files.map(file => file.path).sort(), releaseFiles, "npm pack file allowlist");
  assert.deepEqual(result.bundled, []);
  return result;
}
const dryRun = pack("--dry-run");
writeFileSync(join(output, "npm-pack-dry-run.json"), JSON.stringify([dryRun], null, 2) + "\n");
const tarball = pack("--pack-destination", output);
assert.equal(tarball.integrity, dryRun.integrity, "The archive must match the reviewed dry run");
const archive = readFileSync(join(output, tarball.filename));
assert.equal("sha512-" + createHash("sha512").update(archive).digest("base64"), tarball.integrity);
if (JSON.stringify(sourceFiles) !== JSON.stringify(sourceSnapshot())) throw new Error("Plugin inputs changed during packaging; rerun npm run build.");
const report = { sourceFiles, title: "아티팩트 플러그인 빌드 검증", version: sourcePackage.version, clientBytes: Buffer.byteLength(bundle), clientSha256: createHash("sha256").update(bundle).digest("hex"), registeredContributions: counts, registrationCleanupCount: Object.values(counts).reduce((sum, count) => sum + count, 0), externalHostImports: imports, bundledDependencies: licenses.map(({ texts, ...entry }) => entry), archive: tarball.filename, archiveSha256: createHash("sha256").update(archive).digest("hex"), targetSdk: sourcePackage.devDependencies["@getpaseo/plugin"], scope: "esbuild and isolated contribution registration. Browser and SQLite checks run separately on the archive." };
writeFileSync(join(output, "build-verification.json"), JSON.stringify(report, null, 2));
console.log(JSON.stringify(report, null, 2));
