import { homedir } from "node:os";
import { join, resolve, isAbsolute } from "node:path";
import type { PluginServerContext } from "@getpaseo/plugin/server";
import { openRepositorySync } from "./server/repository";
import { ArtifactService } from "./server/service";
import { registerServer } from "./server/register";

export default function contribute(server: PluginServerContext) {
  const home = process.env.PASEO_HOME ? resolve(process.env.PASEO_HOME) : join(homedir(), ".paseo");
  const configured = process.env.PASEO_ARTIFACT_DATA_DIR;
  if (configured && !isAbsolute(configured)) throw new Error("PASEO_ARTIFACT_DATA_DIR must be an absolute path.");
  const data = configured ?? join(home, "plugin-data", "paseo-artifact-viewer");
  const repository = openRepositorySync(join(data, "artifacts.sqlite"));
  console.info(`Artifact server ready: SQLite, Node ${process.versions.node}, Electron ${process.versions.electron ?? "none"}`);
  try { return registerServer(server, new ArtifactService(repository)); }
  catch (error) { repository.close(); throw error; }
}
