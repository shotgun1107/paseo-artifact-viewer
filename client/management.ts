import { useCallback, useMemo, useState } from "react";
import type { ArtifactRecord, ArtifactViewStore } from "./store";
import type { ArtifactManagement } from "./artifact-menu";
import { ui } from "./ui-locale";

export const recordTitle = (record: ArtifactRecord) => record.title ?? (record.draft ?? record.versions.at(-1))?.title ?? ui("Artifact", "아티팩트");

/** Pinned first, then most recent last-seen order. */
export function orderRecords(records: readonly ArtifactRecord[], isDeleted?: (id: string) => boolean) {
  const live = records.filter(record => !isDeleted?.(record.id) && !(record.artifactId && isDeleted?.(record.artifactId)));
  return [...live.filter(record => record.pinned), ...live.filter(record => !record.pinned)];
}

/** Store-backed management actions shared by the host panel and the inline viewer. */
export type UndoState = { artifactId: string; title: string; phase: "deleting" | "deleted" | "restoring"; error?: string };

export function useArtifactManagement({ store, record, onSelect, onDeleting, onDeleted, onDeleteFailed, onWebUrl }: {
  store: ArtifactViewStore; record: ArtifactRecord | undefined;
  onSelect: (id: string) => void;
  onDeleting: (artifactId: string, title: string) => void;
  onDeleted: (artifactId: string) => void;
  onDeleteFailed: (artifactId: string, error: string) => void;
  onWebUrl: (url: string) => void;
}) {
  const artifactId = record?.artifactId, title = record ? recordTitle(record) : "";
  return useMemo<ArtifactManagement | undefined>(() => {
    if (!record || !store.manage) return undefined;
    const manage = async (action: Parameters<NonNullable<ArtifactViewStore["manage"]>>[1]) => {
      if (!artifactId) throw new Error(ui("This artifact is not saved yet. Try again once it is saved.", "아직 저장되지 않은 아티팩트예요. 저장된 뒤 다시 시도해 주세요."));
      return store.manage!(artifactId, action);
    };
    return {
      pinned: !!record.pinned, available: !!artifactId,
      pin: async pinned => { await manage({ type: "pin", pinned }); },
      rename: async next => { await manage({ type: "rename", title: next }); },
      duplicate: async version => { const result = await manage({ type: "duplicate", version, requestId: crypto.randomUUID() }); onSelect(result.artifactId); },
      // Undo state is claimed before the RPC so "deleted elsewhere" handling never closes the view first.
      remove: async () => {
        if (!artifactId) throw new Error(ui("This artifact is not saved yet. Try again once it is saved.", "아직 저장되지 않은 아티팩트예요. 저장된 뒤 다시 시도해 주세요."));
        onDeleting(artifactId, title);
        try { await manage({ type: "delete" }); onDeleted(artifactId); }
        catch (error) { onDeleteFailed(artifactId, error instanceof Error ? error.message : String(error)); throw error; }
      },
      openWeb: async version => { const { url } = await manage({ type: "web", version }); if (!url) throw new Error(ui("Did not receive a web address.", "웹 주소를 받지 못했어요.")); onWebUrl(url); },
    };
  }, [record, artifactId, title, store, onSelect, onDeleting, onDeleted, onDeleteFailed, onWebUrl]);
}

/** Shared undo lifecycle: claim → deleted → (restoring → cleared only after success). */
export function useUndo(store: ArtifactViewStore, onRestored: (id: string) => void) {
  const [undo, setUndo] = useState<UndoState | null>(null), [failure, setFailure] = useState<string | null>(null);
  const onDeleting = useCallback((artifactId: string, title: string) => { setFailure(null); setUndo({ artifactId, title, phase: "deleting" }); }, []);
  const onDeleted = useCallback((artifactId: string) => setUndo(value => value?.artifactId === artifactId ? { ...value, phase: "deleted", error: undefined } : value), []);
  const onDeleteFailed = useCallback((artifactId: string, error: string) => { setFailure(`${ui("Could not delete.", "삭제하지 못했어요.")} ${error}`); setUndo(value => value?.artifactId === artifactId ? null : value); }, []);
  const restore = useCallback(async () => {
    if (!undo || undo.phase !== "deleted" || !store.manage) return;
    const target = undo;
    setUndo({ ...target, phase: "restoring", error: undefined });
    try { const result = await store.manage(target.artifactId, { type: "restore" }); onRestored(result.artifactId); setUndo(null); }
    catch (error) { setUndo({ ...target, phase: "deleted", error: error instanceof Error ? error.message : String(error) }); }
  }, [undo, store, onRestored]);
  return { undo, setUndo, failure, setFailure, onDeleting, onDeleted, onDeleteFailed, restore };
}
