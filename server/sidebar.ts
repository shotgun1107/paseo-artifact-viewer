import { randomUUID } from "node:crypto";
import type { ForegroundIssue, SidebarRequest, SidebarReceipt } from "../shared/sidebar";
type DeliveryFailure = "no_client" | "unconfirmed" | "cancelled";
type RefreshOutcome = "refreshed" | "unchanged" | "closed";
type Subscriber = (event: SidebarRequest) => Promise<void>;
interface QueuedOpen { reason: ForegroundIssue; expiresAt: number; }
interface Pending<Outcome> {
  event: SidebarRequest;
  queued?: QueuedOpen;
  owner?: string | true;
  acknowledge(outcome: Outcome): void;
  reportForeground(issue: ForegroundIssue, keep?: boolean): boolean;
  claim(token?: string): boolean;
  release(token: string, reason: ForegroundIssue): boolean;
  finish(status: Outcome | ForegroundIssue | DeliveryFailure): void;
}

/** A short-lived display request. There is no durable queue to navigate a user later. */
export class SidebarBroker<Outcome extends "opened" | RefreshOutcome> {
  private subscribers = new Set<Subscriber>();
  private pending = new Map<string, Pending<Outcome>>();
  private constructor(private readOutcome: (receipt: SidebarReceipt) => Outcome | undefined, private timeoutMs: number, private foregroundWaitMs: number, private queueMs: number) {}
  static forOpen(timeoutMs = 5000, foregroundWaitMs = 20000, queueMs = 300000) {
    return new SidebarBroker<"opened">(receipt => receipt.outcome === undefined ? "opened" : undefined, timeoutMs, foregroundWaitMs, queueMs);
  }
  static forRefresh(timeoutMs = 5000) {
    return new SidebarBroker<RefreshOutcome>(({ outcome }) =>
      outcome === "refreshed" || outcome === "unchanged" || outcome === "closed" ? outcome : undefined, timeoutMs, 0, 0);
  }
  subscribe(push: Subscriber, signal: AbortSignal) {
    if (signal.aborted) return;
    this.subscribers.add(push);
    signal.addEventListener("abort", () => this.subscribers.delete(push), { once: true });
    for (const { event, queued, owner } of this.pending.values()) {
      if (queued && !owner && event.expiresAt > Date.now()) void Promise.resolve().then(() => push(event)).catch(() => {});
    }
  }
  queuedOpen(sessionId: string, artifactId: string) {
    for (const req of this.pending.values()) {
      if (req.event.sessionId === sessionId && req.event.artifactId === artifactId && req.queued && req.queued.expiresAt > Date.now()) return req.queued;
    }
  }
  outstanding() {
    const now = Date.now();
    return Array.from(this.pending.values())
      .filter(req => req.event.recoverableClaim && !req.owner && req.event.expiresAt > now)
      .map(req => req.event);
  }
  cancelArtifact(sessionId: string, artifactId: string) {
    for (const req of this.pending.values()) {
      if (req.event.sessionId === sessionId && req.event.artifactId === artifactId) req.finish("cancelled");
    }
  }
  ack(receipt: SidebarReceipt) {
    const req = this.pending.get(receipt.requestId);
    if (!req || req.event.expiresAt <= Date.now() || req.event.sessionId !== receipt.sessionId ||
        req.event.artifactId !== receipt.artifactId || req.event.version !== receipt.version) return false;
    if (receipt.outcome === "opening") return req.claim(receipt.claimToken);
    if (receipt.outcome === "release_not_foreground" || receipt.outcome === "release_foreground_unknown") {
      return !!receipt.claimToken && req.release(receipt.claimToken, receipt.outcome === "release_not_foreground" ? "not_foreground" : "foreground_unknown");
    }
    if (receipt.outcome === "waiting_not_foreground" || receipt.outcome === "waiting_foreground_unknown") {
      if (!req.event.deferAfterReply) return false;
      return req.reportForeground(receipt.outcome === "waiting_not_foreground" ? "not_foreground" : "foreground_unknown", true);
    }
    if (receipt.outcome === "not_foreground" || receipt.outcome === "foreground_unknown") {
      req.reportForeground(receipt.outcome);
      return true;
    }
    const outcome = this.readOutcome(receipt);
    if (!outcome) return false;
    if (outcome === "opened" && (typeof req.owner === "string" || receipt.claimToken) && req.owner !== receipt.claimToken) return false;
    req.acknowledge(outcome);
    return true;
  }
  async request(sessionId: string, workspaceId: string | null, artifactId: string, version: number, signal?: AbortSignal, carry?: QueuedOpen) {
    const target = { artifactId, version };
    if (signal?.aborted) return { ...target, status: "cancelled" as const };
    if (!workspaceId) return { ...target, status: "no_client" as const };
    const allowDeferredOpen = this.foregroundWaitMs > 0;
    for (const req of this.pending.values()) {
      if (req.event.sessionId === sessionId && (allowDeferredOpen || req.event.artifactId === artifactId)) req.finish("cancelled");
    }
    if (!this.subscribers.size && !carry) return { ...target, status: "no_client" as const };
    const event: SidebarRequest = {
      sessionId, workspaceId, artifactId, version, requestId: randomUUID(),
      expiresAt: carry?.expiresAt ?? Date.now() + Math.max(this.timeoutMs, this.queueMs),
    };
    if (allowDeferredOpen) { event.foregroundRetry = true; event.deferAfterReply = true; event.recoverableClaim = true; }
    const subscribers = [...this.subscribers];
    type Reply = {status: Outcome | ForegroundIssue | DeliveryFailure} | ({status: "deferred"} & QueuedOpen);
    const reply = await new Promise<Reply>(resolve => {
      const cancel = () => finish("cancelled");
      const finish = (value: Outcome | ForegroundIssue | DeliveryFailure) => {
        if (!this.pending.delete(event.requestId)) return;
        clearTimeout(timer); signal?.removeEventListener("abort",cancel); resolve({status:value});
        if (wasQueued) {
          const dismissed = { ...event, expiresAt: 0, dismissed: true as const };
          for (const push of this.subscribers) void Promise.resolve().then(() => push(dismissed)).catch(() => {});
        }
      };
      // An idle window can report closed before another window displays the update.
      let observed: Outcome | undefined;
      let foregroundIssue: ForegroundIssue | undefined;
      let wasQueued = false;
      const legacyDeadline = Date.now() + this.foregroundWaitMs;
      const timeout = () => finish(observed ?? foregroundIssue ?? "unconfirmed");
      let timer = setTimeout(timeout, this.timeoutMs);
      const reportForeground = (issue: ForegroundIssue, keep = false) => {
        if (pending.owner) return false;
        foregroundIssue = issue;
        if (!allowDeferredOpen) {
          if (subscribers.length === 1) finish(issue);
          return true;
        }
        if (keep) {
          wasQueued = true;
          pending.queued = {reason:issue, expiresAt:event.expiresAt};
          signal?.removeEventListener("abort",cancel);
          resolve({status:"deferred", ...pending.queued});
        }
        clearTimeout(timer);
        const remaining = Math.max(0, event.expiresAt - Date.now());
        timer = setTimeout(timeout, wasQueued ? remaining : Math.max(0, Math.min(remaining, legacyDeadline - Date.now())));
        return true;
      };
      const claim = (token?: string) => {
        if (!allowDeferredOpen) return false;
        if (pending.owner) return token !== undefined && pending.owner === token;
        pending.owner = token ?? true;
        // A newer publish can still replace a deferred revision until its owner confirms display.
        if (!token) pending.queued = undefined;
        foregroundIssue = undefined;
        clearTimeout(timer);
        timer = setTimeout(timeout, Math.min(this.timeoutMs, Math.max(0, event.expiresAt - Date.now())));
        return true;
      };
      const release = (token: string, reason: ForegroundIssue) => {
        if (pending.owner !== token) return false;
        // Retire this attempt. Late replies from this or another window must not consume the next attempt.
        const carry = { reason, expiresAt:event.expiresAt };
        wasQueued = true;
        resolve({status:"deferred", ...carry});
        finish("cancelled");
        void this.request(sessionId, workspaceId, artifactId, version, undefined, carry);
        return true;
      };
      const acknowledge = (outcome: Outcome) => {
        if (subscribers.length === 1 || outcome === "refreshed" || outcome === "opened") finish(outcome);
        else if (!observed || outcome === "unchanged") observed = outcome;
      };
      const pending: Pending<Outcome> = { event, acknowledge, reportForeground, claim, release, finish };
      this.pending.set(event.requestId, pending);
      signal?.addEventListener("abort",cancel,{ once:true });
      // An updated revision inherits the original intent even while clients are reconnecting.
      if (carry) reportForeground(carry.reason, true);
      void Promise.allSettled(subscribers.map(push => Promise.resolve().then(() => push(event)))).then(results => {
        if (results.length && results.every(result => result.status === "rejected")) {
          if (carry) reportForeground(carry.reason, true);
          else finish("no_client");
        }
      });
    });
    return { ...target, ...reply };
  }
  close() {
    this.subscribers.clear();
    for (const req of this.pending.values()) req.finish("cancelled");
  }
}
