import { useEffect, useSyncExternalStore } from "react";
import { defineTranslations, useTranslation, type PluginI18n } from "@getpaseo/plugin/client";

/**
 * UI language of this plugin: English by default, Korean when the host app language is Korean.
 * The single source is the SDK's `client.i18n` (the host app language); there is no selector of our own.
 */
export type UiLocale = "en" | "ko";

/** Any Korean tag (ko, ko-KR, …) is Korean; everything else, including an unknown or empty value, is English. */
export const toUiLocale = (value: unknown): UiLocale => typeof value === "string" && /^ko(?:[-_]|$)/i.test(value.trim()) ? "ko" : "en";

let current: UiLocale = "en";
const listeners = new Set<() => void>();

export const uiLocale = (): UiLocale => current;
/** Pick the string of the current language. Call at render/use time, never at module load. */
export const ui = (en: string, ko: string): string => current === "ko" ? ko : en;
/** Locale-aware date/time formatting (BCP 47 tag of the current UI language). */
export const uiDate = (value: Date | number | string, options?: Intl.DateTimeFormatOptions): string => {
  const date = value instanceof Date ? value : new Date(value);
  return Number.isNaN(date.getTime()) ? "" : date.toLocaleString(current === "ko" ? "ko-KR" : "en-US", options);
};

export function setUiLocale(value: unknown): boolean {
  const next = toUiLocale(value);
  if (next === current) return false;
  current = next;
  notify();
  return true;
}
const notify = () => { for (const listener of [...listeners]) listener(); };
export const subscribeUiLocale = (listener: () => void) => { listeners.add(listener); return () => { listeners.delete(listener); }; };

/**
 * Follow the real host language: read `client.i18n.locale` now and, when the SDK instance can be subscribed to
 * (the runtime does expose `subscribe`), on every host language change. `onChange` receives each settled locale,
 * including the first one. Returns the cleanup.
 */
export function configureUiLocale(i18n: Pick<PluginI18n, "locale"> | undefined, onChange?: (locale: UiLocale) => void): () => void {
  const read = () => { try { return i18n?.locale; } catch { return undefined; } };
  const apply = () => { setUiLocale(read()); onChange?.(current); };
  apply();
  const subscribe = (i18n as { subscribe?: (listener: () => void) => () => void } | undefined)?.subscribe;
  const unsubscribe = typeof subscribe === "function" ? subscribe.call(i18n, apply) : undefined;
  return () => { try { unsubscribe?.(); } catch { /* the runtime may already be stopped */ } };
}

const probe = defineTranslations({ resources: { en: { locale: "locale" } } });
function useHostLocale(): string | undefined {
  try { return useTranslation(probe).locale; } catch { return undefined; } // outside a contributed surface: own store only
}

/** Re-renders the calling component when the language changes. Every component with visible text calls it once. */
export function useUiLocale(): UiLocale {
  const host = useHostLocale();
  const stored = useSyncExternalStore(subscribeUiLocale, uiLocale, uiLocale);
  // The host language wins at render time so this very render already shows it; the effect tells everyone else.
  const changed = host !== undefined && toUiLocale(host) !== current;
  if (changed) current = toUiLocale(host);
  useEffect(() => { if (changed) notify(); }, [changed]);
  return host !== undefined ? toUiLocale(host) : stored;
}
