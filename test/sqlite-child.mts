import { openRepository } from "../server/repository";
const repo = await openRepository(process.argv[2]);
const result = repo.commit({ sessionId: "child-agent", key: "crash", title: "재시작 검증", format: "html", content: "<div>committed-before-exit</div>", idemKey: "child-write", request: { content: "committed-before-exit" }, origin: { kind: "publish" } });
console.log(JSON.stringify(result));
// Intentionally skip close/checkpoint: the parent must recover a committed WAL.
process.exit(0);
