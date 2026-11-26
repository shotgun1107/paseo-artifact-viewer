import test from "node:test";
import assert from "node:assert/strict";
import type { PluginFile, PluginFileEvent } from "@getpaseo/plugin/client";
import { createFileEditor } from "../client/file-editor";

const flush = () => new Promise<void>(resolve => setImmediate(resolve));
function fakeFile() {
  let content = "initial", listener: ((event: PluginFileEvent) => void) | undefined;
  const writes: string[] = [];
  const file = { readText: async () => content, writeText: async (value: string) => { writes.push(value); content = value; }, watch: (cb: typeof listener) => { listener = cb; return () => { listener = undefined; }; } } as unknown as PluginFile;
  return { file, writes, external(value: string) { content = value; listener?.({ type: "changed" }); }, deleted() { listener?.({ type: "deleted" }); } };
}
test("external changes never overwrite unsaved edits and saving a conflict never writes", async () => {
  const f = fakeFile(), editor = createFileEditor(f.file, () => {}, () => {}); await flush();
  editor.edit("my edits"); f.external("other person's edits"); await flush();
  assert.equal(editor.get().code, "my edits"); assert.equal(editor.get().conflict, true);
  assert.equal(await editor.save(), false); assert.deepEqual(f.writes, []);
  await editor.reload(); assert.equal(editor.get().code, "other person's edits"); assert.equal(editor.get().dirty, false);
  editor.edit("saved"); assert.equal(await editor.save(), true); assert.deepEqual(f.writes, ["saved"]); editor.dispose();
});
test("a save completing behind a newer edit keeps the unsaved marker", async () => {
  const f = fakeFile(); let finish!: () => void;
  f.file.writeText = async () => new Promise<void>(resolve => { finish = resolve; });
  const editor = createFileEditor(f.file, () => {}, () => {}); await flush();
  editor.edit("first"); const pending = editor.save(); editor.edit("newer"); finish(); await pending;
  assert.equal(editor.get().dirty, true); assert.equal(editor.get().code, "newer"); editor.dispose();
});
test("a file deleted while the first read is pending stops loading and discards the late body", async () => {
  const f = fakeFile(); let finish!: (value: string) => void;
  f.file.readText = () => new Promise(resolve => { finish = resolve; });
  const editor = createFileEditor(f.file, () => {}, () => {});
  f.deleted(); finish("late body"); await flush();
  assert.equal(editor.get().deleted, true); assert.equal(editor.get().loading, false); assert.equal(editor.get().code, "");
  assert.equal(await editor.save(), false); assert.deepEqual(f.writes, []);
  // The file coming back clears the deleted state through a normal read.
  f.file.readText = async () => "restored"; f.external("restored"); await flush();
  assert.equal(editor.get().deleted, false); assert.equal(editor.get().loading, false); assert.equal(editor.get().code, "restored"); assert.equal(editor.get().error, null);
  editor.dispose();
});
test("an external change during the first read with unsaved edits ends loading and flags a conflict", async () => {
  const f = fakeFile(); let finish!: (value: string) => void;
  f.file.readText = () => new Promise(resolve => { finish = resolve; });
  const editor = createFileEditor(f.file, () => {}, () => {});
  editor.edit("typed"); f.external("other"); finish("stale"); await flush();
  assert.equal(editor.get().loading, false); assert.equal(editor.get().conflict, true); assert.equal(editor.get().code, "typed");
  editor.dispose();
});
test("late reloads do not clobber typing; deleted files cannot be written; cancellation restores clean state", async () => {
  const f = fakeFile(), editor = createFileEditor(f.file, () => {}, () => {}); await flush();
  editor.edit("draft"); editor.edit("initial"); assert.equal(editor.get().dirty, false);
  let finish!: (value: string) => void; f.file.readText = () => new Promise(resolve => { finish = resolve; });
  const pending = editor.reload(); editor.edit("typed meanwhile"); finish("disk"); await pending;
  assert.equal(editor.get().code, "typed meanwhile"); assert.equal(editor.get().loading, false); assert.equal(editor.get().conflict, true);
  f.deleted(); assert.equal(await editor.save(), false); assert.deepEqual(f.writes, []); editor.dispose();
});
