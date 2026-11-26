import { useEffect, useRef } from "react";
import type { PluginTheme } from "@getpaseo/plugin";
import { EditorState, Compartment } from "@codemirror/state";
import { EditorView, keymap, lineNumbers, highlightActiveLine, drawSelection, highlightActiveLineGutter } from "@codemirror/view";
import { defaultKeymap, history, historyKeymap, indentWithTab } from "@codemirror/commands";
import { syntaxHighlighting, defaultHighlightStyle, bracketMatching, indentOnInput, foldGutter } from "@codemirror/language";
import { searchKeymap, highlightSelectionMatches } from "@codemirror/search";
import { html } from "@codemirror/lang-html";
import { javascript } from "@codemirror/lang-javascript";
import type { ArtifactKind } from "../shared/artifacts";
import { ui, useUiLocale } from "./ui-locale";

function editorTheme(theme?: PluginTheme) {
  const colors = theme?.colors;
  return EditorView.theme({
    "&": { height: "100%", color: colors?.foreground ?? "#242424", backgroundColor: colors?.surface0 ?? "#fff", fontSize: "13px" },
    ".cm-scroller": { fontFamily: '"Cascadia Code", "SFMono-Regular", Consolas, monospace', lineHeight: "1.75", overflow: "auto" },
    ".cm-content": { padding: "16px 0", caretColor: colors?.foreground ?? "#222" },
    ".cm-line": { padding: "0 16px" },
    ".cm-gutters": { color: colors?.foregroundMuted ?? "#888", backgroundColor: colors?.surface0 ?? "#fff", borderRight: "none", padding: "16px 4px 0 8px" },
    ".cm-activeLine,.cm-activeLineGutter": { backgroundColor: colors?.surface1 ?? "#f5f5f5" },
    "&.cm-focused": { outline: "none" },
    "&.cm-focused .cm-selectionBackground,.cm-selectionBackground,::selection": { backgroundColor: "#b4c9e980" },
    ".cm-cursor": { borderLeftColor: colors?.foreground ?? "#222" },
    ".cm-panels": { color: colors?.foreground ?? "#222", backgroundColor: colors?.surface1 ?? "#f5f5f5" },
  });
}

/** Real editor, with undo/history, syntax highlighting, search and external updates. */
export function CodeEditor({ value, onChange, kind, theme }: { value: string; onChange: (code: string) => void; kind: ArtifactKind; theme?: PluginTheme }) {
  const locale = useUiLocale(), labels = useRef(new Compartment());
  const container = useRef<HTMLDivElement>(null), editor = useRef<EditorView | null>(null);
  const callback = useRef(onChange), initial = useRef(value), external = useRef(false);
  const appearance = useRef(new Compartment()), language = useRef(new Compartment());
  callback.current = onChange;
  useEffect(() => {
    if (!container.current) return;
    const current = new EditorView({ parent: container.current, state: EditorState.create({ doc: initial.current, extensions: [
      lineNumbers(), highlightActiveLineGutter(), history(), foldGutter(), drawSelection(), indentOnInput(), bracketMatching(), highlightActiveLine(), highlightSelectionMatches(),
      keymap.of([indentWithTab, ...defaultKeymap, ...historyKeymap, ...searchKeymap]),
      syntaxHighlighting(defaultHighlightStyle, { fallback: true }),
      language.current.of(kind === "react" ? javascript({ jsx: true, typescript: true }) : html()),
      appearance.current.of(editorTheme(theme)), labels.current.of(EditorView.contentAttributes.of({ "aria-label": ui("Artifact code", "아티팩트 코드"), "data-testid": "artifact-code-editor", spellcheck: "false" })),
      EditorView.updateListener.of(update => { if (update.docChanged && !external.current) callback.current(update.state.doc.toString()); }),
    ] }) });
    editor.current = current;
    return () => { editor.current = null; current.destroy(); };
  }, []);
  useEffect(() => {
    const current = editor.current;
    if (!current || current.state.doc.toString() === value) return;
    external.current = true;
    try { current.dispatch({ changes: { from: 0, to: current.state.doc.length, insert: value } }); }
    finally { external.current = false; }
  }, [value]);
  useEffect(() => { editor.current?.dispatch({ effects: appearance.current.reconfigure(editorTheme(theme)) }); }, [theme]);
  useEffect(() => { editor.current?.dispatch({ effects: labels.current.reconfigure(EditorView.contentAttributes.of({ "aria-label": ui("Artifact code", "아티팩트 코드"), "data-testid": "artifact-code-editor", spellcheck: "false" })) }); }, [locale]);
  useEffect(() => { editor.current?.dispatch({ effects: language.current.reconfigure(kind === "react" ? javascript({ jsx: true, typescript: true }) : html()) }); }, [kind]);
  return <div ref={container} className="av-code-editor" style={{ height: "100%", minHeight: 0, overflow: "hidden" }} />;
}
