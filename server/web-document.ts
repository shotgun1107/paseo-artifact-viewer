import { hashLinkScript, htmlPolicy, offlineMarkupScript } from "../shared/html-policy";

type Format = "html" | "svg" | "react";

const TEXT = {
  en: {
    title: "Artifact document",
    region: "External resource consent",
    htmlOff: "Offline preview. External scripts, styles, images and fonts are blocked. Documents that reference external URLs first show static content.",
    htmlOn: "External HTTPS resources are allowed in this view.",
    htmlAllow: "Allow external resources",
    htmlBlock: "Block external resources",
    reactOff: "This React preview loads libraries from esm.sh. Nothing is loaded until you allow it.",
    reactOn: "Libraries are loaded from esm.sh in this view.",
    reactAllow: "Allow esm.sh and run",
    reactBlock: "Unload preview",
    idle: "Preview not loaded.",
  },
  ko: {
    title: "아티팩트 문서",
    region: "외부 리소스 동의",
    htmlOff: "오프라인 미리보기입니다. 외부 스크립트, 스타일, 이미지, 글꼴은 차단됩니다. 외부 URL을 참조하는 문서는 처음에 정적 내용만 표시됩니다.",
    htmlOn: "이 화면에서 외부 HTTPS 리소스를 허용했습니다.",
    htmlAllow: "외부 리소스 허용",
    htmlBlock: "외부 리소스 차단",
    reactOff: "이 React 미리보기는 esm.sh에서 라이브러리를 불러옵니다. 허용하기 전에는 아무것도 불러오지 않습니다.",
    reactOn: "이 화면에서 esm.sh 라이브러리를 불러왔습니다.",
    reactAllow: "esm.sh 허용 후 실행",
    reactBlock: "미리보기 내리기",
    idle: "미리보기가 로드되지 않았습니다.",
  },
} as const;

/** Safe inside an inline <script>: no "<", ">", "&" or line-separator characters survive. */
const js = (value: unknown) =>
  JSON.stringify(value).replace(/[<>&\u2028\u2029]/g, c => "\\u" + c.charCodeAt(0).toString(16).padStart(4, "0"));
const attr = (s: string) => s.replace(/[&"'<>]/g, c => `&#${c.charCodeAt(0)};`);

/** The CSP meta must precede user content, but a doctype must stay first to avoid quirks mode. */
function split(source: string) {
  const text = source.replace(/^﻿/, "");
  const doctype = /^\s*<!doctype[^>]*>/i.exec(text);
  return doctype ? { pre: doctype[0], post: text.slice(doctype[0].length) } : { pre: "", post: text };
}

const STYLE = `*{box-sizing:border-box}html,body{height:100%;margin:0}
body{display:flex;flex-direction:column;font:13px/1.4 system-ui,sans-serif;color-scheme:light dark;background:Canvas;color:CanvasText}
.bar{display:flex;gap:12px;align-items:center;justify-content:space-between;padding:6px 12px;border-bottom:1px solid color-mix(in srgb,CanvasText 20%,transparent)}
.bar p{margin:0}button{font:inherit;padding:4px 12px;cursor:pointer;flex:none}
.stage{position:relative;flex:1;min-height:0;background:#fff}
iframe{display:block;width:100%;height:100%;border:0;background:#fff}
.idle{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;color:#555}
[hidden]{display:none!important}`;

// Trusted chrome: consent is only granted by a user-activated click on this page's own button.
// No message listener and no URL option exists, so the sandboxed child cannot enable itself.
const SCRIPT = `(()=>{const offlineMarkup = ${offlineMarkupScript};
const c=window.__av,f=document.getElementById("f"),b=document.getElementById("b"),m=document.getElementById("m"),i=document.getElementById("i");
let on=false;
const doc=allow=>{const p=allow?c.on:c.off;return c.pre+'<meta http-equiv="Content-Security-Policy" content="'+p+'"><script>'+c.links+'<'+'/script>'+(allow||c.react?c.post:offlineMarkup(c.post))};
const render=()=>{m.textContent=on?c.t.on:c.t.off;b.textContent=on?c.t.block:c.t.allow;
 if(c.react&&!on){f.removeAttribute("srcdoc");f.hidden=true;i.hidden=false;return}
 i.hidden=true;f.hidden=false;f.srcdoc=doc(on)};
b.addEventListener("click",e=>{if(!e.isTrusted)return;on=!on;render()});
render()})();`;

export function webDocument(content: string, format: Format, locale: string): string {
  const t = /^ko\b/i.test(String(locale).replace(/_/g, "-")) ? TEXT.ko : TEXT.en;
  const react = format === "react";
  const body = format === "svg"
    ? { pre: "<!doctype html>", post: `<style>html,body{margin:0}svg{max-width:100%;height:auto}</style>${content.replace(/^﻿?\s*<\?xml[^>]*\?>/i, "")}` }
    : split(content);
  const consented = htmlPolicy(true).replace("script-src 'unsafe-inline'", react ? "script-src 'unsafe-inline' blob:" : "script-src 'unsafe-inline'");
  const config = {
    ...body, react, links: "(" + hashLinkScript + ")();",
    off: htmlPolicy(false), on: consented,
    t: react
      ? { off: t.reactOff, on: t.reactOn, allow: t.reactAllow, block: t.reactBlock }
      : { off: t.htmlOff, on: t.htmlOn, allow: t.htmlAllow, block: t.htmlBlock },
  };
  const lang = t === TEXT.ko ? "ko" : "en";
  return `<!doctype html><html lang="${lang}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">`
    + `<meta http-equiv="Content-Security-Policy" content="default-src 'none'; script-src 'unsafe-inline' blob: https:; style-src 'unsafe-inline' https:; img-src data: blob: https:; font-src data: https:; connect-src 'none'; frame-src about:; base-uri 'none'; form-action 'none'; object-src 'none'">`
    + `<title>${attr(t.title)}</title><style>${STYLE}</style></head><body>`
    + `<div class="bar" role="region" aria-label="${attr(t.region)}"><p id="m" aria-live="polite"></p><button id="b" type="button"></button></div>`
    + `<div class="stage"><iframe id="f" title="${attr(t.title)}" sandbox="allow-scripts" referrerpolicy="no-referrer"></iframe><div id="i" class="idle" hidden>${attr(t.idle)}</div></div>`
    + `<script>window.__av=${js(config)};${SCRIPT}</script></body></html>`;
}
