import assert from "node:assert/strict";
import test from "node:test";
import { DatabaseSync } from "node:sqlite";
import { SqliteArtifactRepository } from "../server/repository";

class ObservedDatabase extends DatabaseSync {
  reads: string[][] = [];
  prepare(sql: string) {
    const statement = super.prepare(sql);
    if (/^\s*SELECT/i.test(sql)) this.reads.push(statement.columns().map(column => column.name));
    return statement;
  }
}

function seed(repo: SqliteArtifactRepository, key: string) {
  const result = repo.commit({
    sessionId: "session", key, title: key, format: "html", content: "<p>" + key + "</p>",
    idemKey: key, request: { key }, origin: { kind: "extract", legacyId: "old-" + key },
  });
  assert.equal(result.status, "ok");
  return result.artifactId!;
}

test("one library page reads summaries and hidden aliases without a separate SQL request per artifact", () => {
  const db = new ObservedDatabase(":memory:");
  const repo = new SqliteArtifactRepository(db);
  try {
    for (let i = 0; i < 10; i++) {
      const id = seed(repo, "item-" + i);
      if (i >= 6) repo.manage("session", id, {type:"delete"});
    }
    db.exec("PRAGMA query_only=ON");
    db.reads.length = 0;
    const page = repo.list("session");
    assert.equal(page.items.length, 6);
    for (const item of page.items) assert.deepEqual(item.legacyIds, ["old-" + item.key]);
    for (let i = 6; i < 10; i++) assert.ok(page.hidden?.includes("old-item-" + i));
    assert.equal(db.reads.length, 2, "SQL reads for six visible and four hidden artifacts");
  } finally { repo.close(); }
});

test("history reads only metadata even when a revision has a large body", () => {
  const db = new ObservedDatabase(":memory:");
  const repo = new SqliteArtifactRepository(db);
  try {
    const id = seed(repo, "large");
    db.reads.length = 0;
    const page = repo.history("session", id);
    assert.equal(page.items[0].title, "large");
    assert.ok(!("content" in page.items[0]));
    assert.ok(db.reads.every(columns => !columns.includes("content")), "body materialized by SQLite");
  } finally { repo.close(); }
});
