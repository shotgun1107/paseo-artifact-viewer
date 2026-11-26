import { existsSync, readFileSync, readdirSync } from "node:fs";
import { dirname, join, resolve } from "node:path";

/** Collect attribution from the actual esbuild inputs, including nested dependencies. */
export function bundledLicenses(root, bundles) {
  const licenses = new Map();
  const owners = new Map();
  function ownerOf(input, packageName) {
    let directory = dirname(resolve(root, input));
    const visited = [];
    while (!owners.has(directory)) {
      visited.push(directory);
      const manifest = join(directory, "package.json");
      if (existsSync(manifest)) {
        const pkg = JSON.parse(readFileSync(manifest, "utf8"));
        if (pkg.name === packageName) {
          owners.set(directory, { dir: directory, pkg });
          break;
        }
      }
      if (directory === root || dirname(directory) === directory) throw new Error("Cannot identify bundled package " + input);
      directory = dirname(directory);
    }
    const owner = owners.get(directory);
    for (const visitedDirectory of visited) owners.set(visitedDirectory, owner);
    return owner;
  }

  for (const [side, metafile] of Object.entries(bundles)) {
    for (const input of Object.keys(metafile.inputs)) {
      const parts = input.replaceAll("\\", "/").split("/");
      const at = parts.lastIndexOf("node_modules");
      if (at < 0) continue;
      const name = parts[at+1].startsWith("@") ? parts.slice(at+1,at+3).join("/") : parts[at+1];
      const { dir, pkg } = ownerOf(input, name);
      const key = pkg.name + "@" + pkg.version;
      let entry = licenses.get(key);
      if (!entry) {
        const texts = readdirSync(dir).filter(file => /^(LICENSE|LICENCE|NOTICE)([-.]|$)/i.test(file)).sort().map(file => ({ file, text: readFileSync(join(dir, file), "utf8") }));
        // The upstream 6.0.0 tag includes both ISC notices; the npm tarball omits the license file.
        if (!texts.length && key === "saxes@6.0.0") {
          texts.push({ file: "LICENSE", text: readFileSync(join(root, "licenses/saxes-6.0.0.txt"), "utf8") });
        }
        if (!texts.length) throw new Error("No license text for " + key);
        entry = { name: pkg.name, version: pkg.version, license: pkg.license, bundledIn: [], texts };
        licenses.set(key, entry);
      }
      if (!entry.bundledIn.includes(side)) entry.bundledIn.push(side);
    }
  }
  return [...licenses.values()];
}
