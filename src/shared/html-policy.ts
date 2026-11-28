// Outer documents may host the isolated srcdoc; artifact documents cannot embed further frames.
export function htmlPolicy(allowExternal: boolean, hostFrame = false) {
  const https = allowExternal ? " https:" : "";
  return ["default-src 'none'", "script-src 'unsafe-inline'" + https, "style-src 'unsafe-inline'" + https,
    "img-src data: blob:" + https, "font-src data:" + https, "connect-src 'none'",
    hostFrame ? "frame-src 'self' about:" : "frame-src 'none'", "worker-src 'none'",
    "form-action 'none'", "base-uri 'none'", "object-src 'none'"].join("; ");
}

// Runs inside the preview host before markup enters a browsing context. Template contents are inert.
// Keep readable offline content, and leave enforcement for every document to CSP and iframe sandboxing.
export const offlineMarkupScript = String.raw`(function offlineMarkup(source) {
  if (!/https:\/\/|(?:src|href)\s*=\s*["']\/\//i.test(source)) return source;
  const template = document.createElement("template");
  template.innerHTML = source;
  const passiveHtml = new Set("a address article aside b blockquote br caption cite code dd del details div dl dt em figcaption figure footer h1 h2 h3 h4 h5 h6 header hr i kbd li main mark nav ol p pre s samp section small span strong sub summary sup table tbody td tfoot th thead time tr u ul var".split(" "));
  const passiveSvg = new Set("svg g a path circle ellipse rect line polygon polyline text tspan title desc".split(" "));
  const svgAttrs = new Set("viewBox preserveAspectRatio width height x y dx dy cx cy rx ry r x1 y1 x2 y2 d points transform opacity stroke-width text-anchor font-size".split(" "));
  const htmlAttrs = new Set("id class lang dir role aria-label colspan rowspan open".split(" "));
  const output = document.createElement("template");
  const doc = output.content.ownerDocument;
  function copy(node, parent) {
    if (node.nodeType === 3) { parent.appendChild(doc.createTextNode(node.data)); return; }
    if (node.nodeType !== 1) return;
    const tag = node.localName;
    if (["script","style","link","meta","iframe","object","embed","template","noscript","base","title"].includes(tag)) return;
    const svg = node.namespaceURI === "http://www.w3.org/2000/svg";
    const keep = svg ? passiveSvg.has(tag) : passiveHtml.has(tag);
    let target = parent;
    if (keep) {
      target = svg ? doc.createElementNS(node.namespaceURI, tag) : doc.createElement(tag);
      for (const {name,value} of node.attributes) {
        if (htmlAttrs.has(name) || (tag === "a" && (name === "href" || (svg && name === "xlink:href")) && value[0] === "#") || (svg && (svgAttrs.has(name) ||
            ((name === "fill" || name === "stroke") && /^(?:#[0-9a-f]{3,8}|[a-z]+)$/i.test(value))))) target.setAttribute(name, value);
      }
      parent.appendChild(target);
    } else if (tag === "img" && node.alt) {
      parent.appendChild(doc.createTextNode(node.alt));
    }
    for (const child of node.childNodes) copy(child, target);
  }
  for (const node of template.content.childNodes) copy(node, output.content);
  return output.innerHTML;
})`;

// Runs inside every artifact document. A srcdoc document resolves "#x" against the page that hosts it, so a plain
// in-document link would navigate the frame away from the artifact. Complete clicked fragment links inside the document
// instead. Script-driven location.hash and scrollIntoView already work natively and are left alone.
export const hashLinkScript = String.raw`(function artifactHashLinks() {
  const decode = text => { try { return decodeURIComponent(text); } catch (_) { return text; } };
  function jump(hash) {
    const raw = hash.slice(1), id = decode(raw);
    const find = name => name ? document.getElementById(name) || document.getElementsByName(name)[0] : null;
    const target = find(raw) || find(id);
    try { location.hash = hash; } catch (_) { /* the scroll below still runs */ }
    if (target) target.scrollIntoView();
    else if (!id || id.toLowerCase() === "top") scrollTo(0, 0);
  }
  addEventListener("click", event => {
    if (event.defaultPrevented || event.button !== 0 || !(event.target instanceof Element)) return;
    const link = event.target.closest("a, area");
    const href = link && (link.getAttribute("href") ?? link.getAttribute("xlink:href"));
    if (typeof href !== "string" || href[0] !== "#") return;
    event.preventDefault();
    jump(href);
  });
})`;

// Runs inside the content frame. Reports resources the policy refused that consent could actually allow.
export const blockedResourceScript = String.raw`(function artifactBlockedResources(report) {
  const directives = /^(?:script-src|style-src|img-src|font-src)(?:-elem|-attr)?$/;
  addEventListener("securitypolicyviolation", event => {
    if (directives.test(event.effectiveDirective || "") && /^https:/i.test(event.blockedURI || "")) report();
  });
})`;
