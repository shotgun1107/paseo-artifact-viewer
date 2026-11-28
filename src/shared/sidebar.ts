import { defineRpc, defineSubscription } from "@getpaseo/plugin";
import { agentToolInputs } from "./contracts";
import { z } from "zod";
const id = z.string().min(1).max(256);
const version = z.number().int().positive();
const target = z.object({ requestId: id, sessionId: id, artifactId: id, version });
const foregroundIssue = z.enum(["not_foreground", "foreground_unknown"]);
export type ForegroundIssue = z.infer<typeof foregroundIssue>;
const receipt = target.extend({
  claimToken: id.optional(),
  outcome: z.union([foregroundIssue, z.enum(["waiting_not_foreground", "waiting_foreground_unknown", "release_not_foreground", "release_foreground_unknown", "opening", "refreshed", "unchanged", "closed"])]).optional(),
});
const event = target.extend({
  workspaceId: id, expiresAt: z.number().int(), foregroundRetry: z.literal(true).optional(),
  deferAfterReply: z.literal(true).optional(), dismissed: z.literal(true).optional(), recoverableClaim: z.literal(true).optional(),
});
export type SidebarRequest = z.infer<typeof event>;
export type SidebarReceipt = z.infer<typeof receipt>;
export const sidebarRequests = defineSubscription({ name: "artifact.sidebar_requests", input: z.object({}), event });
export const sidebarPending = defineRpc({ name: "artifact.sidebar_pending", input: z.object({}), output: z.object({ items: z.array(event) }) });
// Older clients treat every event on sidebarRequests as an explicit open.
export const sidebarRefreshRequests = defineSubscription({ name: "artifact.sidebar_refresh_requests", input: z.object({}), event });
export const sidebarAck = defineRpc({ name: "artifact.sidebar_ack", input: receipt, output: z.object({ accepted: z.boolean() }) });
export const openInput = agentToolInputs.en.open;
export const openResult = z.object({
  status: z.union([foregroundIssue, z.enum(["opened", "deferred", "no_client", "unconfirmed", "cancelled"])]),
  reason: foregroundIssue.optional(), expiresAt: z.number().int().optional(),
  artifactId: id, version,
});
export const sidebarOpen = defineRpc({ name: "artifact.open", input: openInput.extend({ sessionId: id }), output: openResult });
