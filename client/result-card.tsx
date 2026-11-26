import { useSyncExternalStore } from "react";
import { Pressable, Text, View } from "react-native";
import type { PluginTheme } from "@getpaseo/plugin";
import type { ArtifactRecord, ArtifactViewStore } from "./store";
import { ui, useUiLocale } from "./ui-locale";

export type CardFormat = "html" | "svg" | "react";
const formatLabel = (format: CardFormat) => format === "react" ? "React" : format === "svg" ? "SVG" : "HTML";
const glyph = (format: CardFormat) => format === "react" ? "JSX" : format === "svg" ? "SVG" : "</>";

export function findRecord(records: readonly ArtifactRecord[], id: string) {
  return records.find(record => record.id === id || record.artifactId === id || record.key === id || record.legacyIds?.includes(id));
}

/** Live open/pinned/title state for a card from the conversation's artifact store. */
export function useCardState(store: ArtifactViewStore, id: string) {
  const records = useSyncExternalStore(store.subscribe, store.snapshot, store.snapshot);
  const record = findRecord(records, id);
  return { record, open: !!record && store.visible && store.focused === record.id };
}

/** Result card: thumbnail tile, title, format · version, open state. */
export function ResultCard({ theme, title, format, meta, open, pinned, deleted, disabled, accessibilityLabel, onPress }: {
  theme: PluginTheme; title: string; format: CardFormat; meta: string; open: boolean; pinned?: boolean; deleted?: boolean; disabled?: boolean; accessibilityLabel: string; onPress: () => void;
}) {
  const c = theme.colors, off = disabled || deleted; useUiLocale();
  const details = [formatLabel(format), meta, pinned && !deleted ? ui("Pinned", "고정됨") : "", deleted ? ui("Deleted", "삭제됨") : ""].filter(Boolean).join(" · ");
  return <Pressable accessibilityRole="button" accessibilityLabel={accessibilityLabel} accessibilityState={{ selected: open, disabled: !!off }} disabled={off} onPress={onPress}
    style={({ pressed }) => ({ flexDirection: "row", alignItems: "stretch", width: "100%", maxWidth: 360, minHeight: 60, borderWidth: 1, borderRadius: 12, overflow: "hidden", borderColor: open ? c.accent : c.border, backgroundColor: pressed ? c.surface1 : c.surface0, opacity: deleted ? .55 : 1 })}>
    <View style={{ width: 56, alignItems: "center", justifyContent: "center", backgroundColor: c.surface1, borderRightWidth: 1, borderRightColor: c.border }}>
      <Text style={{ color: open ? c.accent : c.foregroundMuted, fontSize: 12, fontWeight: "600", fontFamily: "ui-monospace, Consolas, monospace" }}>{glyph(format)}</Text>
    </View>
    <View style={{ flex: 1, minWidth: 0, justifyContent: "center", gap: 2, paddingVertical: 10, paddingHorizontal: 12 }}>
      <Text numberOfLines={1} style={{ color: c.foreground, fontSize: 14, fontWeight: "600", textDecorationLine: deleted ? "line-through" : "none" }}>{title}</Text>
      <Text numberOfLines={1} style={{ color: c.foregroundMuted, fontSize: 12 }}>{details}</Text>
    </View>
    {!deleted && <View style={{ justifyContent: "center", paddingRight: 14, paddingLeft: 4 }}>
      <Text style={{ color: open ? c.accent : c.foregroundMuted, fontSize: 12, fontWeight: open ? "600" : "400" }}>{open ? ui("Opened", "열림") : ui("Open", "열기")}</Text>
    </View>}
  </Pressable>;
}
