import { useEffect, useRef, useState } from "react";
import type { PaseoAgentHandle } from "@getpaseo/client";
import type { ArtifactViewStore } from "./store";
import { observeArtifacts } from "./timeline";

/**
 * Keeps a conversation's artifact store following its timeline (new stored versions, turn ends, reconnects) while
 * the surface is mounted, including when the chat itself is unmounted behind a full-screen detail.
 * `notice` is the observer's last error; `observer.current` lets the surface ask for a history read.
 */
export function useArtifactObserver(agent: PaseoAgentHandle, store: ArtifactViewStore) {
  const [notice, setNotice] = useState<string | null>(null);
  const observer = useRef<ReturnType<typeof observeArtifacts> | null>(null);
  useEffect(() => { const current = observeArtifacts(agent, store, setNotice); observer.current = current; return () => { observer.current = null; current.dispose(); }; }, [agent, store]);
  return { notice, observer };
}
