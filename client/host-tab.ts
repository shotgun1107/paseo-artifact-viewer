import { ui } from "./ui-locale";
/**
 * Close this plugin's own right-sidebar (explorer) tab. SDK 0.16.1 has no public tab.close, so this
 * drives the host's own close control, read from Paseo 0.16.1 app sources:
 * - screens/workspace/explorer-sidebar.tsx: the dock is `data-testid="workspace-explorer-sidebar"`.
 * - workspace-tabs/identity.ts: plugin agent tab id
 *   `plugin_agent_${pluginId.length}_${pluginId}_${panelId.length}_${panelId}_${agentId.length}_${agentId}`.
 * - workspace-desktop-tabs-row.tsx: chip `data-testid="workspace-tab-${id}"` with `aria-selected`, inside
 *   a hover frame whose `auxclick` (button 1) handler calls onCloseTab(tab.tabId).
 * - workspace-tab-menu.ts: close button `workspace-plugin-close-${base64url(id)}` in the same frame.
 *
 * Runs only from a click, only inside the sidebar that contains `root`, only for the one selected chip
 * with exactly this id. No global search, keyboard shortcut, label match or store trick; anything
 * ambiguous returns a reason and touches nothing.
 */
export const PLUGIN_ID = "paseo-artifact-viewer";
export const EXPLORER_PANEL_ID = "artifacts";

export type CloseTabResult = "closed" | "no_sidebar" | "no_tab" | "ambiguous" | "not_selected" | "busy" | "unsupported";

export function pluginAgentTabId(pluginId: string, panelId: string, agentId: string) {
  return `plugin_agent_${pluginId.length}_${pluginId}_${panelId.length}_${panelId}_${agentId.length}_${agentId}`;
}

/** Host `encodeFilePathForPathSegment`: base64url of the UTF-8 bytes, no padding. */
export function encodePathSegment(value: string) {
  const text = value.trim();
  if (!text) return "";
  let binary = "";
  for (const byte of new TextEncoder().encode(text)) binary += String.fromCharCode(byte);
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}

const attr = (value: string) => typeof CSS !== "undefined" && typeof CSS.escape === "function" ? CSS.escape(value) : value.replace(/["\\]/g, "\\$&");

export function closeExplorerTab(root: Element | null, agentId: string, pluginId = PLUGIN_ID, panelId = EXPLORER_PANEL_ID): CloseTabResult {
  if (typeof document === "undefined" || !root?.isConnected) return "unsupported";
  const sidebar = root.closest('[data-testid="workspace-explorer-sidebar"]');
  if (!sidebar) return "no_sidebar";
  const id = pluginAgentTabId(pluginId, panelId, agentId);
  const chips = sidebar.querySelectorAll(`[data-testid="workspace-tab-${attr(id)}"]`);
  if (chips.length === 0) return "no_tab";
  if (chips.length > 1) return "ambiguous";
  const chip = chips[0]!;
  if (chip.getAttribute("aria-selected") !== "true") return "not_selected";
  // The chip's own hover frame: the nearest ancestor that holds this chip and no other tab chip.
  const others = (node: Element) => [...node.querySelectorAll('[data-testid^="workspace-tab-"]')]
    .some(other => other !== chip && /^workspace-tab-(?!tooltip-|modified-)/.test(other.getAttribute("data-testid") ?? ""));
  let frame: Element | null = null;
  for (let node = chip.parentElement, depth = 0; node && node !== sidebar && depth < 6; node = node.parentElement, depth++) {
    if (others(node)) break;
    frame = node;
  }
  if (!frame) return "ambiguous";
  const buttons = sidebar.querySelectorAll(`[data-testid="workspace-plugin-close-${attr(encodePathSegment(id))}"]`);
  if (buttons.length > 1) return "ambiguous";
  const button = buttons[0];
  if (button) {
    if (!frame.contains(button)) return "ambiguous";
    if (button.getAttribute("aria-disabled") === "true" || (button as HTMLButtonElement).disabled) return "busy";
    (button as HTMLElement).click();
    return "closed";
  }
  // No close button rendered: the host's middle-click handler on the chip's frame (bubbles from the chip).
  if (typeof MouseEvent === "undefined") return "unsupported";
  // That handler calls preventDefault(); an event nobody cancelled means no host handler ran.
  const handled = !chip.dispatchEvent(new MouseEvent("auxclick", { button: 1, buttons: 0, bubbles: true, cancelable: true }));
  return handled ? "closed" : "unsupported";
}

export function closeTabMessage(result: Exclude<CloseTabResult, "closed">) {
  return result === "busy" ? ui("The tab is already closing.", "탭을 닫는 중이에요.") : ui("Could not find this artifact tab, so it was not closed. Use the X on the tab.", "이 아티팩트 탭을 찾지 못해 닫지 않았어요. 탭 위의 X로 닫아 주세요.");
}
