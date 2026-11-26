import { defineRpc, defineSubscription } from "@getpaseo/plugin";
import { z } from "zod";
import { localized, type ArtifactLocale } from "./language";
import { MAX_SOURCE_LENGTH } from "./artifacts";

export const sessionSchema = z.string().min(1).max(256);
export const formatSchema = z.enum(["html", "svg", "react"]);
export const contentSchema = z.string().min(1).max(MAX_SOURCE_LENGTH);
function artifactKeySchema(locale: ArtifactLocale = "en") {
  return z.string({ error: z.locales[locale]().localeError }).regex(/^[a-zA-Z0-9][\w.-]{0,79}$/, localized(locale,
    "Use a key of up to 80 characters starting with a letter or digit. Allowed characters are letters, digits, underscores, periods, and hyphens.",
    "key는 영문·숫자로 시작하는 80자 이하 식별자여야 합니다. 영문·숫자·밑줄·마침표·하이픈을 사용할 수 있습니다."));
}
export const keySchema = artifactKeySchema();
export const originSchema = z.object({ restoredFromVersion: z.number().int().positive().optional(), kind: z.enum(["publish", "extract", "edit"]), turnId: z.string().nullable().optional(), messageId: z.string().optional(), blockIndex: z.number().int().nonnegative().optional(), legacyId: z.string().optional() });
export const summarySchema = z.object({ artifactId: z.string(), sessionId: sessionSchema, key: keySchema, title: z.string(), format: formatSchema, headVersion: z.number().int().positive(), updatedAt: z.string(), legacyIds: z.array(z.string()), pinned: z.boolean().optional() });
export const versionSchema = z.object({ artifactId: z.string(), version: z.number().int().positive(), parentVersion: z.number().int().nonnegative(), title: z.string(), format: formatSchema, content: z.string(), contentHash: z.string(), origin: originSchema, createdAt: z.string() });
export const versionMetaSchema = versionSchema.omit({ content: true });
export const mutationSchema = z.discriminatedUnion("status", [z.object({ status: z.literal("ok"), artifactId: z.string(), version: z.number().int().positive(), alias: z.boolean() }), z.object({ status: z.literal("conflict"), artifactId: z.string().nullable(), version: z.number().int().nonnegative(), reason: z.enum(["idempotency", "baseVersion", "deleted", "staleSource"]) })]);
export const noticeSchema = z.object({ placement: z.enum(["live", "legacy"]).optional(), artifactId: z.string(), artifactVersion: z.number().int().positive(), title: z.string().default(""), format: formatSchema.catch("html"), originKind: originSchema.shape.kind.catch("extract"), deleted: z.boolean().optional(), pinned: z.boolean().optional(), managed: z.boolean().optional() });
const cardPlacementSchema = z.object({
  sessionId: sessionSchema, messageId: z.string(), textHash: z.string(),
  blockIndex: z.number().int().nonnegative().optional(), notice: noticeSchema,
});
export type CardPlacement = z.output<typeof cardPlacementSchema>;
export const artifactCardPlacements = defineRpc({
  name: "artifact.card_placements", input: z.object({ sessionId: sessionSchema.optional() }),
  output: z.object({ items: z.array(cardPlacementSchema), sessions: z.array(sessionSchema).optional() }),
});
export const artifactCardPlacementsChanged = defineSubscription({ name: "artifact.card_placements_changed", input: z.object({}), event: z.object({ sessionId: sessionSchema }) });
const revision = z.number().int().positive();
const requestId = z.string().min(1).max(128);
const target = { sessionId: sessionSchema, artifactId: z.string().min(1) };
export const actionSchema = z.discriminatedUnion("type", [
  z.object({ type: z.literal("pin"), pinned: z.boolean() }),
  z.object({ type: z.literal("rename"), title: z.string().trim().min(1).max(100) }),
  z.object({ type: z.literal("duplicate"), version: revision, requestId }),
  z.object({ type: z.literal("delete") }), z.object({ type: z.literal("restore") }),
  z.object({ type: z.literal("web"), version: revision }),
]);
const actionResultSchema = z.object({ artifactId: z.string(), url: z.string().url().optional() });
export type ArtifactAction = z.infer<typeof actionSchema>;
export type ArtifactActionResult = z.infer<typeof actionResultSchema>;
export const artifactManage = defineRpc({ name: "artifact.manage", input: z.object({ ...target, action: actionSchema }), output: actionResultSchema });
// The SDK can validate a tool before its execute callback runs. Attach the error
// map to the schema's checks so concurrent hosts never share Zod's global locale.
function toolInputs(locale: ArtifactLocale) {
  const errors = { error: z.locales[locale]().localeError };
  const requiredText = z.string(errors).min(1, errors);
  const version = z.number(errors).int(errors).positive(errors).optional();
  const format = z.enum(formatSchema.options, errors).optional();
  const publish = z.strictObject({
    requestId: requiredText.max(128, errors),
    content: requiredText.max(MAX_SOURCE_LENGTH, errors),
    format,
    kind: format.describe(localized(locale, "Compatibility alias for format", "format의 호환 별칭")),
    title: requiredText.max(100, errors),
    key: artifactKeySchema(locale).optional(),
    artifactId: requiredText.optional(),
  }, errors).refine(input => !!(input.format ?? input.kind), localized(locale, "Supply format or kind.", "format 또는 kind가 필요합니다"));
  return {
    publish,
    read: z.object({ artifactId: requiredText, version }, errors),
    list: z.object({ cursor: z.string(errors).optional(), limit: z.number(errors).int(errors).min(1, errors).max(100, errors).default(40) }, errors),
    open: z.object({ artifactId: requiredText.max(256, errors).optional(), version }, errors),
  };
}
export const agentToolInputs = { en: toolInputs("en"), ko: toolInputs("ko") };
export const publishSchema = agentToolInputs.en.publish;
const pageInput = { sessionId: sessionSchema, ...agentToolInputs.en.list.shape };
export const artifactList = defineRpc({ name: "artifact.list", input: z.object(pageInput), output: z.object({ items: z.array(summarySchema), cursor: z.string().nullable(), hidden: z.array(z.string()).optional() }) });
export const failedNotices = defineRpc({
  name: "artifact.failed_notices", input: z.object(pageInput),
  output: z.object({ items: z.array(z.object({ id: z.string(), artifactId: z.string(), version: revision, attempts: z.number().int().nonnegative() })), cursor: z.string().nullable() }),
});
export const artifactGet = defineRpc({ name: "artifact.get", input: agentToolInputs.en.read.extend({ sessionId: sessionSchema }), output: z.object({ artifact: summarySchema, version: versionSchema }).nullable() });
export const artifactHistory = defineRpc({ name: "artifact.history", input: z.object({ ...pageInput, artifactId: z.string() }), output: z.object({ items: z.array(versionMetaSchema), cursor: z.string().nullable() }) });
export const artifactRestoreVersion = defineRpc({
  name: "artifact.restore_version",
  input: z.object({ ...target, version: revision, baseVersion: revision, clientMutationId: requestId }),
  output: mutationSchema,
});
export const artifactSaveEdit = defineRpc({ name: "artifact.save_edit", input: z.object({ sessionId: sessionSchema, artifactId: z.string(), baseVersion: z.number().int().positive(), content: contentSchema, clientMutationId: z.string().min(1).max(128) }), output: mutationSchema });
export const artifactBackfill = defineRpc({ name: "artifact.backfill", input: z.object({ sessionId: sessionSchema }), output: z.object({ committed: z.number().int().nonnegative(), conflicts: z.number().int().nonnegative(), truncated: z.boolean() }) });
export type ArtifactSummary = z.infer<typeof summarySchema>;
export type StoredVersion = z.infer<typeof versionSchema>;
export type VersionMeta = z.infer<typeof versionMetaSchema>;
export type ArtifactOrigin = z.infer<typeof originSchema>;
export type ArtifactFormat = z.infer<typeof formatSchema>;
export type MutationResult = z.infer<typeof mutationSchema>;
export type PublishInput = z.infer<typeof publishSchema>;
export interface ArtifactReadRepository {
  list(sessionId: string, cursor?: string, limit?: number): { items: ArtifactSummary[]; cursor: string | null };
  get(sessionId: string, artifactId: string, version?: number): { artifact: ArtifactSummary; version: StoredVersion } | null;
  history(sessionId: string, artifactId: string, cursor?: string, limit?: number): { items: VersionMeta[]; cursor: string | null };
}
