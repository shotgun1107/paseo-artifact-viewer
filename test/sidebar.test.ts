import test from "node:test";
import assert from "node:assert/strict";
import { SidebarBroker } from "../server/sidebar";
import type { SidebarRequest } from "../shared/sidebar";

test("only a receipt for the exact live request, conversation, artifact and revision reports opened", async () => {
  const broker = SidebarBroker.forOpen(800);
  let sent!: SidebarRequest;
  const listener = new AbortController();
  broker.subscribe(async event => { sent = event; },listener.signal);
  const waiting = broker.request("agent","space","timer",3);
  await Promise.resolve();
  for (const wrong of [{sessionId:"other"},{artifactId:"other"},{version:2},{requestId:"expired"}])
    assert.equal(broker.ack({...sent,...wrong}),false);
  assert.equal(broker.ack(sent),true);
  assert.equal((await waiting).status,"opened");
  assert.equal(broker.ack(sent),false);
  listener.abort();
  assert.equal((await broker.request("agent","space","timer",3)).status,"no_client");
});

test("undelivered, unacknowledged, superseded and aborted requests cannot be mistaken for a displayed sidebar", async () => {
  const b = SidebarBroker.forOpen(25), listener = new AbortController(), events: SidebarRequest[] = [];
  b.subscribe(async e => { events.push(e); },listener.signal);
  const first=b.request("agent","space","timer",1), second=b.request("agent","space","timer",2);
  assert.equal((await first).status,"cancelled"); assert.equal((await second).status,"unconfirmed");
  for(const event of events) assert.equal(b.ack(event),false);
  const turn=new AbortController(), cancelled=b.request("agent","space","timer",1,turn.signal);
  turn.abort(); assert.equal((await cancelled).status,"cancelled"); b.close();
});

test("refresh requires a typed receipt for the exact revision and prefers a display over a negative response from another window", async () => {
  const broker = SidebarBroker.forRefresh(1000), listener = new AbortController();
  broker.subscribe(async event => {
    assert.equal(broker.ack(event), false);
    assert.equal(broker.ack({ ...event, version: event.version + 1, outcome: "refreshed" }), false);
    assert.equal(broker.ack({ ...event, outcome: "closed" }), true);
  }, listener.signal);
  broker.subscribe(async event => { broker.ack({ ...event, outcome: "refreshed" }); }, listener.signal);
  assert.equal((await broker.request("agent","space","clock",2)).status, "refreshed");
  listener.abort();
  assert.equal((await broker.request("agent","space","clock",3)).status, "no_client");
});

test("an open can wait for a foreground return; only one window gets the claim and showing the version still needs a receipt", async () => {
  const broker = SidebarBroker.forOpen(40, 800);
  let request!: SidebarRequest;
  broker.subscribe(async event => {
    request = event;
    assert.equal(event.foregroundRetry, true);
    broker.ack({ ...event, outcome: "not_foreground" });
  }, new AbortController().signal);
  const result = broker.request("agent", "space", "dice", 1);
  await new Promise(done => setTimeout(done, 60));
  assert.equal(broker.ack({ ...request, outcome: "opening", artifactId: "other" }), false);
  assert.equal(broker.ack({ ...request, outcome: "opening" }), true);
  assert.equal(broker.ack({ ...request, outcome: "opening" }), false);
  assert.equal(broker.ack(request), true);
  assert.equal((await result).status, "opened");
  assert.equal(broker.ack({ ...request, outcome: "opening" }), false);
});

test("negative receipts distinguish inactive or unknown foreground from a missing display confirmation", async () => {
  for (const outcome of ["not_foreground", "foreground_unknown"] as const) {
    const broker = SidebarBroker.forOpen(15, 40);
    let sent!: SidebarRequest;
    broker.subscribe(async event => { sent = event; broker.ack({ ...event, outcome }); }, new AbortController().signal);
    assert.equal((await broker.request("agent","space","dice",1)).status,outcome);
    assert.equal(broker.ack({ ...sent, outcome: "opening" }), false);
  }
  const broker = SidebarBroker.forOpen(25, 50);
  broker.subscribe(async event => {
    broker.ack({ ...event, outcome: "opening" });
    broker.ack({ ...event, outcome: "not_foreground" });
  }, new AbortController().signal);
  assert.equal((await broker.request("agent","space","dice",1)).status,"unconfirmed");
});

test("refresh reports foreground issues without acquiring or delaying an open", async () => {
  const broker = SidebarBroker.forRefresh(500);
  broker.subscribe(async event => {
    assert.equal(event.foregroundRetry, undefined);
    assert.equal(broker.ack({ ...event, outcome: "opening" }), false);
    broker.ack({ ...event, outcome: "foreground_unknown" });
  }, new AbortController().signal);
  assert.equal((await broker.request("agent","space","dice",2)).status,"foreground_unknown");
});

test("an acknowledged wait survives the tool response and reconnect, but only its latest revision can open", async () => {
  const broker = SidebarBroker.forOpen(80, 200, 5000);
  const events: SidebarRequest[] = [], window = new AbortController(), turn = new AbortController();
  broker.subscribe(async event => {
    if (!event.dismissed) {
      events.push(event);
      broker.ack({ ...event, outcome:"waiting_not_foreground" });
    }
  }, window.signal);
  const v1 = await broker.request("agent","space","color",1,turn.signal);
  assert.equal(v1.status,"deferred");
  if (v1.status !== "deferred") throw Error("missing deferred receipt");
  assert.equal(v1.reason,"not_foreground");
  window.abort(); turn.abort();
  const carry = broker.queuedOpen("agent","color");
  assert.equal(carry?.expiresAt,v1.expiresAt);
  const v2 = await broker.request("agent","space","color",2,undefined,carry);
  assert.equal(v2.status,"deferred");
  assert.equal(broker.ack({ ...events[0], outcome:"opening" }),false);
  let replay!: SidebarRequest;
  broker.subscribe(async event => { if (!event.dismissed) replay=event; },new AbortController().signal);
  await Promise.resolve();
  assert.equal(replay.version,2); assert.equal(replay.expiresAt,v1.expiresAt);
  assert.equal(broker.ack({ ...replay, outcome:"opening" }),true);
  assert.equal(broker.ack(replay),true);
  assert.equal(broker.queuedOpen("agent","color"),undefined);
  broker.close();
});

test("expired deferred requests cannot open after returning and do not replay", async () => {
  const broker = SidebarBroker.forOpen(20, 25, 35);
  let request!: SidebarRequest;
  const dismissed: string[] = [];
  broker.subscribe(async event => {
    if (event.dismissed) { dismissed.push(event.requestId); return; }
    request=event; broker.ack({ ...event,outcome:"waiting_foreground_unknown" });
  },new AbortController().signal);
  assert.equal((await broker.request("agent","space","color",2)).status,"deferred");
  await new Promise(done=>setTimeout(done,65));
  assert.equal(broker.queuedOpen("agent","color"),undefined);
  assert.equal(broker.ack({ ...request,outcome:"opening" }),false);
  assert.deepEqual(dismissed,[request.requestId]);
  broker.close();
});

test("deleting a queued artifact invalidates its outstanding claim only in that conversation", async () => {
  const broker = SidebarBroker.forOpen(80,200,1000);
  let request!: SidebarRequest;
  broker.subscribe(async event => {
    if (event.dismissed) return;
    request=event;
    broker.ack({...event,outcome:"waiting_not_foreground"});
  },new AbortController().signal);
  assert.equal((await broker.request("agent","space","color",1)).status,"deferred");
  broker.cancelArtifact("other-agent","color");
  assert.ok(broker.queuedOpen("agent","color"));
  broker.cancelArtifact("agent","color");
  assert.equal(broker.ack({...request,outcome:"opening"}),false);
  broker.close();
});

test("a window that loses eligibility releases its own claim and the same selection can be read and opened on return", async () => {
  const broker = SidebarBroker.forOpen(100,100,1000);
  let first!: SidebarRequest;
  broker.subscribe(async event => { if (!first) first = event; }, new AbortController().signal);
  const result = broker.request("agent","space","counter",1);
  await Promise.resolve();
  assert.deepEqual(broker.outstanding(),[first]);
  assert.ok(broker.ack({...first,outcome:"opening",claimToken:"window-A"}));
  assert.ok(broker.ack({...first,outcome:"opening",claimToken:"window-A"}));
  assert.deepEqual(broker.outstanding(),[]);
  assert.equal(broker.ack({...first,outcome:"release_not_foreground",claimToken:"window-B"}),false);
  assert.equal(broker.ack(first),false);
  assert.ok(broker.ack({...first,outcome:"release_not_foreground",claimToken:"window-A"}));
  const deferred = await result;
  assert.equal(deferred.status,"deferred");
  const [next] = broker.outstanding();
  assert.notEqual(next.requestId,first.requestId);
  assert.equal(next.artifactId,first.artifactId);
  assert.equal(next.expiresAt,first.expiresAt);
  assert.equal(broker.ack({...first,claimToken:"window-A"}),false);
  assert.ok(broker.ack({...next,outcome:"opening",claimToken:"window-B"}));
  assert.equal(broker.ack({...next,claimToken:"window-A"}),false);
  assert.ok(broker.ack({...next,claimToken:"window-B"}));
  assert.deepEqual(broker.outstanding(),[]);
  broker.close();
});
