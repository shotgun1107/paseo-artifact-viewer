import { webDocument } from "./web-document";
import { createServer, type Server } from "node:http";
import { randomBytes } from "node:crypto";
import { transform } from "sucrase";
import type { ArtifactReadRepository, StoredVersion } from "../shared/contracts";

interface Ticket { session: string; artifact: string; revision: number; locale: string; expires: number; }
const ttl = 10 * 60_000;
const policy = "sandbox allow-scripts; default-src 'none'; script-src 'unsafe-inline' blob: https:; style-src 'unsafe-inline' https:; img-src https: data: blob:; font-src https: data:; connect-src 'none'; worker-src 'none'; frame-src 'self' about:; frame-ancestors 'none'; base-uri 'none'; form-action 'none'";
const imports = {
  react: "https://esm.sh/react@18.3.1",
  "react/jsx-runtime": "https://esm.sh/react@18.3.1/jsx-runtime",
  "react-dom": "https://esm.sh/react-dom@18.3.1?external=react",
  "react-dom/client": "https://esm.sh/react-dom@18.3.1/client?external=react",
  "lucide-react": "https://esm.sh/lucide-react@0.468.0?external=react",
  recharts: "https://esm.sh/recharts@2.15.4?external=react,react-dom",
};
const scriptString = (s: string) => JSON.stringify(s).replace(/</g, "\\u003c");
function page(version: StoredVersion, locale: string) {
  if (version.format !== "react") return webDocument(version.content, version.format, locale);
  let source = version.content;
  if (!/\bexport\s+default\b/.test(source) && /\b(?:function|class|const|let)\s+App\b/.test(source)) source += "\nexport default App;";
  const { code } = transform(source, { transforms: ["typescript","jsx"], jsxPragma: "__avReact.createElement", jsxFragmentPragma: "__avReact.Fragment" });
  const moduleSource = 'import __avReact from "react";\n' + code;
  const document = `<!doctype html><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><div id="root"></div><script type="importmap">${JSON.stringify({ imports })}</script>
    <script type="module">const root=document.getElementById("root");try {
      const moduleURL=URL.createObjectURL(new Blob([${scriptString(moduleSource)}],{type:"text/javascript"}));
      const [React,DOM,App]=await Promise.all([import("react"),import("react-dom/client"),import(moduleURL)]);
      DOM.createRoot(root).render(React.createElement(App.default));
    } catch (error) { root.textContent=${scriptString(locale === "ko" ? "React 미리보기 오류: " : "React preview error: ")}+error.message; }</script>`;
  return webDocument(document, "react", locale);
}

/** A URL grants read access to one revision on this daemon's loopback interface. */
export class LocalWebPreview {
  private server?: Server;
  private starting?: Promise<number>;
  private tickets = new Map<string, Ticket>();
  private stopped = false;
  constructor(private repo: ArtifactReadRepository) {}
  async open(session: string, artifact: string, revision: number, locale = "en") {
    if (this.stopped || !this.repo.get(session, artifact, revision)) throw new Error(locale === "ko" ? "이 버전을 열 수 없습니다." : "This version cannot be opened.");
    const port = await (this.starting ??= this.listen().catch(error => { this.starting = undefined; throw error; }));
    if (this.stopped) throw new Error(locale === "ko" ? "미리보기 서버가 종료되었습니다." : "The preview server has stopped.");
    const now = Date.now();
    for (const [key, item] of this.tickets) if (item.expires <= now) this.tickets.delete(key);
    if (this.tickets.size >= 128) this.tickets.delete(this.tickets.keys().next().value!);
    const key = randomBytes(24).toString("base64url");
    this.tickets.set(key, { session, artifact, revision, locale, expires: now + ttl });
    return `http://127.0.0.1:${port}/${key}`;
  }
  private listen(): Promise<number> {
    return new Promise((resolve, reject) => {
      const server = this.server = createServer((req, res) => {
        res.setHeader("Cache-Control", "no-store");
        res.setHeader("Referrer-Policy", "no-referrer");
        res.setHeader("X-Content-Type-Options", "nosniff");
        res.setHeader("Cross-Origin-Opener-Policy", "same-origin");
        res.setHeader("Content-Security-Policy", policy);
        const ticket = this.tickets.get(req.url?.slice(1) ?? "");
        const valid = req.method === "GET" && req.headers.host === `127.0.0.1:${req.socket.localPort}` && ticket && ticket.expires > Date.now();
        try {
          const stored = valid && this.repo.get(ticket.session, ticket.artifact, ticket.revision);
          if (!stored) { res.writeHead(404); res.end(); return; }
          const body = page(stored.version, ticket!.locale);
          res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" }); res.end(body);
        } catch {
          res.writeHead(422, { "Content-Type": "text/plain; charset=utf-8" }); res.end(ticket?.locale === "ko" ? "선택한 버전을 표시할 수 없습니다." : "The selected version could not be displayed.");
        }
      });
      server.once("error", reject);
      server.listen(0, "127.0.0.1", () => {
        const address = server.address();
        if (!address || typeof address === "string") { reject(new Error("Could not resolve the local preview address.")); return; }
        server.unref();
        resolve(address.port);
      });
    });
  }
  async close() {
    this.stopped = true;
    this.tickets.clear();
    await this.starting?.catch(() => {});
    const server = this.server;
    if (server?.listening) await new Promise<void>(done => {
      server.close(() => done());
      server.closeAllConnections();
    });
  }
}
