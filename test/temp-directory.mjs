import assert from "node:assert/strict";
import { mkdtempSync, realpathSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { basename, dirname, join } from "node:path";

/** Only removes the single directory allocated by this call. */
export function temporaryDirectory() {
  const temp = realpathSync(tmpdir());
  const directory = mkdtempSync(join(temp, "paseo-artifact-qa-"));
  const discard = () => {
    const target = realpathSync(directory);
    assert.equal(dirname(target), temp);
    assert.ok(basename(target).startsWith("paseo-artifact-qa-"));
    rmSync(target, { recursive: true, force: true });
  };
  return { directory, discard };
}
