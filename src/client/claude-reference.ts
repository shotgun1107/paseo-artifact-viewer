/** Static source contract. These are observed shipped classes/tokens, not claims of pixel equality. */
export const claudeReference = {
  branch: "Claude Desktop 4.4212.0 classic ArtifactDetail / CDS PanelHeader, provider-default comfortable density",
  sources: {
    detail: { file: "cbaae0d6d-DJw3eVGB.js", sha256: "588397b1cff3cc822612b5e56f8013c236e4b180826dc6062f852fef9b57260c", lines: "2817–4091" },
    headerAdapter: { file: "cab779feb-BgzM4_Sb.js", sha256: "6637eccacb61d8e18944fc55e466b4f04798e7736ab3656ca02d831b365c4162", lines: "70–249" },
    panelHeader: { file: "shared-9--cRmmHEE.js", sha256: "91efa2ddf7c66ccef1225f07a559712963aa95b505a3e10484b0d663a9d0842e", lines: "18700–18865" },
    provider: { file: "shared-frame-Cetv9ixB.js", sha256: "e33f7aa51c64da4aa67b0a7ab83e2af8a17248d370cb6e526e3666f3dfe3c383", lines: "1357; 1576–1607", note: "density context defaults comfortable; panels flag selects comfortable without explicit override" },
    tokens: { file: "c6a992d55-DOxJvg9D.css", sha256: "a1f7db07ca9378a58e64c03d00f008cf687eca1ff554344f6021673dcf90f4c2", note: "CDS comfortable density; surface-3, neutral, control, radius tokens" },
  },
  hierarchy: ["PanelHeader/Toolbar", "lead(artifact switcher, Eye/Code segmented control, version menu)", "actions(refresh, Copy split button or narrow overflow, close)", "DisplayContent(preview or source; same preview instance retained)"],
  classes: { lead: "flex min-h-control min-w-0 flex-1 items-center gap-1", actions: "flex gap-2 items-center", content: "relative flex min-h-0 w-full flex-1 flex-col rounded-b", root: "bg-surface-3 flex h-full flex-col relative outline-none" },
  measurements: { control: 32, icon: 20, radius: 8, body: 14, versionControl: 28, versionIcon: 16, gap: 4, actionGap: 8, paddingStart: 4, paddingEnd: 4, paddingBlock: 4, headerHeight: 40, collapseBelow: 504 },
  light: { surface3: "#ffffff", surface1: "#fcfcfb", foreground: "#0b0b0b", secondary: "#52514e", muted: "#898781", control: "#0b0b0b1a", hover: "#0b0b0b0d" },
  dark: { surface3: "#20201f", surface1: "#151515", foreground: "#f0efec", secondary: "#c3c2b7", muted: "#898781", control: "#ffffff1a", hover: "#ffffff0d" },
  differences: ["Original proprietary font/icon assets are not bundled; system fonts and equivalent SVG paths are used.", "Paseo owns the panel bounds/navigation; no Claude account, sharing, publishing or connector authority is simulated.", "CodeMirror editing, optional conversation request popover, React consent and workspace action are Paseo adapters; the original classic renderer is source-only.", "The hosted frame shell layout is not mixed into this classic panel contract."],
} as const;
