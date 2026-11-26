import { createContext, useContext } from "react";
if (location.pathname === "/") sessionStorage.setItem("qa-launch-options", location.search);
export const launchOptions = new URLSearchParams(sessionStorage.getItem("qa-launch-options") ?? location.search);
export const workspaceId = launchOptions.has("encoded-path") ? "C:/작업/산출물" : "test-workspace";
export const sessionId = launchOptions.get("session") || "test-agent";
export const harnessState: any = { handle: null, entries: [], sends: [], listeners: new Set(), modified: false, fileText: '<!doctype html><button id="file-counter" onclick="this.textContent=Number(this.textContent)+1">0</button>', fileWatchers: new Set() };
const handle: any = {
  id: sessionId, workspaceId, status: "idle",
  timeline: {
    refetch: async () => ({ entries: [...harnessState.entries], epoch: "test-epoch", hasOlder: false, hasNewer: false, staleCursor: false }),
    subscribe: (listener: any) => { harnessState.listeners.add(listener); const unsubscribe = () => harnessState.listeners.delete(listener); return Object.assign(unsubscribe, { ready: Promise.resolve({}) }); },
  },
  send: async (text: string) => { harnessState.sends.push(text); },
};
harnessState.handle = handle;
const handles = new Map([[sessionId, handle]]);
export function agentHandle(id: string) {
  if (!handles.has(id)) handles.set(id, { id, timeline: {
    refetch: async () => ({ entries: [], epoch: "qa", hasOlder: false }),
    subscribe: () => Object.assign(() => {}, { ready: Promise.resolve({}) }),
  } });
  return handles.get(id);
}
const paseo = { agents: { ref: agentHandle } };
export const SidebarItemTitle = createContext("");
export function SidebarRow({ label, active, onPress }: any) {
  const registeredTitle = useContext(SidebarItemTitle);
  return <button aria-current={active ? "page" : undefined} onClick={onPress}>{label ?? registeredTitle}</button>;
}
export const usePaseo = () => paseo;
export const useAgent = (id: string, selector: any) => selector({ id, workspaceId, status: launchOptions.has("running") ? "running" : "idle" });
export const Markdown = ({ children }: any) => <p data-testid="native-markdown">{children}</p>;
export const copyText = async (text: string) => { harnessState.copied = text; };
export const Platform = { OS: "web" };
export const View = ({ children, style, ref }: any) => <div ref={ref} style={{ display: "flex", flexDirection: "column", ...style }}>{children}</div>;
export const Text = ({ children, style }: any) => <span style={style}>{children}</span>;
export const Pressable = ({ children, onPress, accessibilityLabel, disabled, style }: any) => <button aria-label={accessibilityLabel} disabled={disabled} onClick={onPress} style={{ ...(typeof style === "function" ? style({ pressed: false }) : style), display: "flex", color: "inherit", cursor: "pointer", font: "inherit", textAlign: "left" }}>{children}</button>;
export function fileHandle() { return { path: "C:/fixture/counter.html", name: "counter.html", extension: "html", size: 150, modifiedAt: "2026-11-03", mimeType: "text/html", readText: async () => harnessState.fileText, writeText: async (text: string) => { harnessState.fileText = text; }, watch: (listener: any) => { harnessState.fileWatchers.add(listener); return () => harnessState.fileWatchers.delete(listener); } }; }
export function entry(id: string, language: string, code: string, artifactId = "counter") {
  const seq = harnessState.entries.length;
  return { seqStart: seq, seqEnd: seq, timestamp: new Date().toISOString(), provider: "fixture", item: { type: "assistant_message", messageId: id, text: `테스트 결과 [문서](C:/file%20name.md)\n\`\`\`${language} artifact="${artifactId}" title="${artifactId === "react-counter" ? "React 카운터" : "테스트 결과"}"\n${code}\n\`\`\`` } };
}

export const ExternalLink = ({ children, href, accessibilityLabel }: any) =>
  <a href={href} aria-label={accessibilityLabel} target="_blank" rel="noopener noreferrer">{children}</a>;

// ── Localization fixture bridge (SDK `client.i18n` / defineTranslations / useTranslation) ──
// `?locale=<tag>` pins the app language of a scenario; without it the fixture is Korean, which the existing
// Korean-text regressions rely on. `harnessState.setLocale("en")` simulates a host language change at runtime.
import { useSyncExternalStore } from "react";
const localeListeners = new Set<() => void>();
let fixtureLocale = launchOptions.get("locale") ?? "ko";
const subscribeLocale = (listener: () => void) => { localeListeners.add(listener); return () => { localeListeners.delete(listener); }; };
export const i18n = { get locale() { return fixtureLocale; }, subscribe: subscribeLocale };
harnessState.setLocale = (next: string) => { fixtureLocale = next; for (const listener of [...localeListeners]) listener(); };
harnessState.locale = () => fixtureLocale;
const lookup = (resources: any, locale: string, key: string): string | undefined => {
  for (const tag of [locale, locale.split("-")[0], "en"]) {
    let value = resources[tag]; for (const part of key.split(".")) value = value?.[part];
    if (typeof value === "string") return value;
  }
};
export function defineTranslations(definition: any) {
  return { resources: definition.resources, message: (key: string, options?: any) => ({ __message: true, resources: definition.resources, key, options }) };
}
export function resolveText(text: any, locale = fixtureLocale): string {
  if (typeof text === "string" || text == null) return text;
  const raw = lookup(text.resources, locale, text.key) ?? text.key;
  return raw.replace(/{{\s*([^},\s]+)[^}]*}}/g, (_: string, name: string) => String(text.options?.[name] ?? ""));
}
export function useTranslation(messages: any) {
  const locale = useSyncExternalStore(subscribeLocale, () => fixtureLocale, () => fixtureLocale);
  return { locale, t: (key: string, options?: any) => resolveText(messages.message(key, options), locale) };
}

// Composer item fixture: the composer of the conversation on screen, as the host hands it to a composer item.
export const fixtureComposer: any = { context: "agent", prompt: "", attachments: [], agent: {} };
export const useComposer = () => fixtureComposer;
