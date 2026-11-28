import type { PluginFile } from "@getpaseo/plugin/client";
import { ui } from "./ui-locale";

export interface EditorState { code: string; dirty: boolean; conflict: boolean; deleted: boolean; loading: boolean; saving: boolean; error: string | null; }
export function createFileEditor(file: PluginFile, changed: (state: EditorState) => void, modified: (dirty: boolean) => void) {
  let state: EditorState = { code: "", dirty: false, conflict: false, deleted: false, loading: true, saving: false, error: null };
  let disposed = false, generation = 0, changeId = 0, baseline = "";
  const publish = (patch: Partial<EditorState>) => { if (!disposed) { state = { ...state, ...patch }; modified(state.dirty); changed(state); } };
  async function read() {
    const request = ++generation, edits = changeId;
    publish({ loading: true, error: null });
    try { const code = await file.readText(); if (!disposed && request === generation) { if (edits === changeId) { baseline = code; publish({ code, dirty: false, conflict: false, deleted: false, loading: false }); } else publish({ loading: false, conflict: true }); } }
    catch (error) { if (request === generation) publish({ loading: false, error: String(error instanceof Error ? error.message : error) }); }
  }
  const unwatch = file.watch(event => {
    ++generation;
    if (event.type === "deleted") { publish({ deleted: true, loading: false, error: ui("The file was deleted. You can copy or download your edits.", "파일이 삭제되었습니다. 편집 내용은 복사하거나 내려받을 수 있습니다.") }); return; }
    if (state.dirty || state.saving) publish({ conflict: true, deleted: false, loading: false });
    else void read();
  });
  void read();
  return {
    get: () => state,
    edit(code: string) { ++changeId; publish({ code, dirty: code !== baseline, error: null }); },
    reload: read,
    async save() {
      if (state.saving || state.deleted || state.conflict || !state.dirty) return false;
      const edits = changeId, diskGeneration = generation, value = state.code;
      publish({ saving: true, error: null });
      try {
        await file.writeText(value);
        baseline = value;
        publish({ saving: false, dirty: changeId !== edits || generation !== diskGeneration });
        return true;
      } catch (error) {
        const name = error instanceof Error ? error.name : "";
        publish({ saving: false, conflict: name === "PluginFileConflictError" || state.conflict, deleted: name === "PluginFileDeletedError" || state.deleted, error: String(error instanceof Error ? error.message : error) });
        return false;
      }
    },
    dispose() { disposed = true; ++generation; unwatch(); },
  };
}
