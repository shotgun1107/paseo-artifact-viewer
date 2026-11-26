import assert from "node:assert/strict";
import { createRequire } from "node:module";
import vm from "node:vm";
import * as sdkClient from "@getpaseo/plugin/client";
import { PluginTranslationRuntime } from "@getpaseo/plugin/client/host";

export async function checkClientRegistration(bundle) {
  const require = createRequire(import.meta.url);
  const entry = new vm.Script(bundle).runInThisContext()(specifier => {
    if (specifier === "@getpaseo/plugin/client") return sdkClient;
    if (specifier === "@getpaseo/plugin/client/ui" || specifier === "react-native") return {};
    return require(specifier);
  });
  let locale = "en";
  const localeListeners = new Set();
  const i18n = new PluginTranslationRuntime({
    getLocale: () => locale,
    subscribe(listener) {
      localeListeners.add(listener);
      return () => localeListeners.delete(listener);
    },
  });
  const counts = {};
  const registrations = new Map();
  const subscriptions = new Set();
  const reportedLocales = [];
  const context = {
    i18n,
    async rpc(contract, input) {
      const args = contract.input.parse(input);
      if (contract.name === "artifact.card_placements") return contract.output.parse({ items: [], sessions: [] });
      if (contract.name === "artifact.sidebar_pending") return contract.output.parse({ items: [] });
      assert.equal(contract.name, "artifact.set_locale");
      reportedLocales.push(args.locale);
      return contract.output.parse({ locale: args.locale });
    },
    subscribe(contract, input) {
      contract.input.parse(input);
      subscriptions.add(contract.name);
      const release = () => { subscriptions.delete(contract.name); };
      return Object.assign(release, { ready: Promise.resolve(), release: async () => release() });
    },
  };
  const methods = ["addComposerItem", "addScreen", "addSidebarHeaderItem", "addAgentPanel", "addFilePanel",
    "addCommandCenterItem", "addSlashCommand", "addTimelineTransformer", "addTimelineRenderer"];
  for (const method of methods) {
    context[method] = contribution => {
      counts[method] = (counts[method] ?? 0) + 1;
      registrations.set(contribution, method);
      return () => assert.ok(registrations.delete(contribution), "Duplicate cleanup: " + method);
    };
  }
  try {
    const stop = await entry.default(context);
    try {
      for (const method of methods) assert.ok(counts[method], "Missing registration: " + method);
      const contributions = [...registrations.keys()];
      const transformer = contributions.find(item => item.transform);
      const result = transformer.transform({
        phase: "complete", item: { type: "assistant_message", text: "<sample>", messageId: "x" },
      });
      assert.equal(result, undefined);
      const sample = '```html artifact="sample"\n<div/>\n```';
      assert.ok(transformer.transform({ phase: "complete", item: { type: "assistant_message", text: sample, messageId: "x" } })?.items.length);
      const library = contributions.find(item => item.id === "artifact-library");
      assert.equal(i18n.resolve(library.title), "Artifacts");
      locale = "ko-KR";
      for (const listener of localeListeners) listener();
      assert.equal(i18n.resolve(library.title), "아티팩트");
      assert.deepEqual(reportedLocales, ["en", "ko"]);
    } finally {
      await stop();
    }
    assert.equal(registrations.size, 0);
    assert.equal(subscriptions.size, 0);
    locale = "en";
    for (const listener of localeListeners) listener();
    assert.deepEqual(reportedLocales, ["en", "ko"], "Locale reports must stop on cleanup");
  } finally {
    i18n.dispose();
  }
  assert.equal(localeListeners.size, 0);
  return counts;
}
