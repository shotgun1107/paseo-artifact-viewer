import { defineRpc } from "@getpaseo/plugin";
import { z } from "zod";
import { summarySchema, versionSchema } from "./contracts";

const artifact = summarySchema.omit({ legacyIds: true }).extend({ sessionId: z.string().nullable() });
const libraryItem = artifact.omit({ key: true }).extend({
  sessionTitle: z.string(),
  sessionTitleStatus: z.enum(["untitled", "deleted", "unavailable"]).optional(),
  workspaceName: z.string().nullable(),
  thumbnail: z.string().nullable(),
});
export type LibraryItem = z.infer<typeof libraryItem>;

export const artifactLibraryList = defineRpc({
  name: "artifact.library_list",
  input: z.object({
    query: z.string().trim().max(256).default(""),
    pinnedOnly: z.boolean().optional(),
    pinnedFirst: z.boolean().optional(),
    offset: z.number().int().nonnegative().default(0),
    limit: z.number().int().min(1).max(100).default(40),
  }),
  output: z.object({ items: z.array(libraryItem), nextOffset: z.number().int().nullable() }),
});
export const artifactLibraryGet = defineRpc({
  name: "artifact.library_get",
  input: z.object({ artifactId: z.string().min(1), version: z.number().int().positive().optional() }),
  output: z.object({ artifact, version: versionSchema }).nullable(),
});
