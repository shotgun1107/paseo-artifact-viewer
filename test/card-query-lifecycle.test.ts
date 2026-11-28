import assert from "node:assert/strict";
import test from "node:test";
import { DatabaseSync } from "node:sqlite";
import type { PaseoApi } from "@getpaseo/client";
import { SqliteArtifactRepository } from "../src/server/repository";
import { ArtifactService } from "../src/server/service";

function setup() {
  const db = new DatabaseSync(":memory:");
  const repo = new SqliteArtifactRepository(db);
  repo.commit({ sessionId:"s", key:"demo", title:"Demo", format:"html", content:"<p>demo</p>",
    idemKey:"demo", request:{}, origin:{kind:"publish",turnId:"turn"} });
  db.exec("PRAGMA query_only=ON");
  const service = new ArtifactService(repo);
  const pending: ((messageId: string) => void)[] = [];
  const client = {agents:{ref:() => ({timeline:{
    append:() => assert.fail("A display query must never append to the conversation"),
    refetch:() => new Promise(resolve => pending.push(messageId => resolve({epoch:"e",entries:[{
      turnId:"turn",item:{type:"assistant_message",text:"Answer",messageId}
    }]})))
  }})}} as unknown as PaseoApi;
  return {service,pending,read:() => service.placements.read("s",client)};
}

test("concurrent readers share a scan and all receive the fresh reply after the scan is invalidated", async () => {
  const {service,pending,read} = setup();
  try {
    const old = read();
    const joined = read();
    service.placements.invalidate("s");
    pending[0]("old-reply");
    await new Promise(resolve => setImmediate(resolve));
    const reopened = read();
    assert.equal(pending.length,2);
    pending[1]("new-reply");
    const results = await Promise.all([old,joined,reopened]);
    assert.deepEqual(results.map(r=>r.items[0]?.messageId), ["new-reply","new-reply","new-reply"]);
  } finally { await service.stop(); }
});

test("shutdown drains an invalidated read before closing the database", async () => {
  const {service,pending,read} = setup();
  const first = read().catch(() => null);
  service.placements.invalidate("s");
  let stopped = false;
  const closing = service.stop().then(() => { stopped = true; });
  await new Promise(resolve => setImmediate(resolve));
  const closedEarly = stopped;
  pending[0]("old-reply");
  await first;
  await closing;
  assert.equal(closedEarly,false);
});

test("an unavailable timeline handle can be retried for the same session", async () => {
  const { service, pending, read } = setup();
  const unavailable = { agents: { ref() { throw new Error("host disconnected"); } } } as unknown as PaseoApi;
  try {
    await assert.rejects(service.placements.read("s", unavailable), /host disconnected/);
    const retry = read();
    assert.equal(pending.length, 1);
    pending[0]("after-reconnect");
    assert.equal((await retry).items[0]?.messageId, "after-reconnect");
  } finally { await service.stop(); }
});
