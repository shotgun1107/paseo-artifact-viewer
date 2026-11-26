// Synthetic example artifacts for the public screenshots. Nothing here comes from a real conversation.
export type Sample = { key: string; title: string; language: "html" | "svg" | "tsx"; content: string };

const svg = (inner: string, view = "0 0 320 200") => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${view}">${inner}</svg>`;

export const gallerySamples: Sample[] = [
  { key: "sunrise-poster", title: "Sunrise poster", language: "svg", content: svg(
    `<rect width="320" height="200" fill="#ffd9b0"/><rect width="320" height="90" fill="#ffb98a"/><circle cx="160" cy="128" r="50" fill="#ff6b4a"/><circle cx="160" cy="128" r="36" fill="#ff8a63"/>
<path d="M0 150 Q60 120 120 148 T240 140 T320 150 V200 H0Z" fill="#2f4858"/><path d="M0 172 Q80 150 160 172 T320 168 V200 H0Z" fill="#1d2f3a"/>`) },
  { key: "quarterly-chart", title: "Quarterly sales chart", language: "svg", content: svg(
    `<rect width="320" height="200" fill="#f6f8fb"/><g fill="#4f7cff"><rect x="40" y="110" width="40" height="60" rx="4"/><rect x="100" y="80" width="40" height="90" rx="4" fill="#6d94ff"/><rect x="160" y="55" width="40" height="115" rx="4"/><rect x="220" y="30" width="40" height="140" rx="4" fill="#2f5fe0"/></g>
<path d="M30 170 H290" stroke="#9aa5b8" stroke-width="2"/><path d="M60 100 L120 70 L180 45 L240 22" stroke="#ff7a59" stroke-width="3" fill="none" stroke-linecap="round"/><g fill="#ff7a59"><circle cx="60" cy="100" r="5"/><circle cx="120" cy="70" r="5"/><circle cx="180" cy="45" r="5"/><circle cx="240" cy="22" r="5"/></g>`) },
  { key: "geometric-pattern", title: "Geometric pattern", language: "svg", content: svg(
    `<rect width="320" height="200" fill="#1f2a44"/><g fill="none" stroke-width="6"><circle cx="90" cy="100" r="60" stroke="#ffcf5c"/><circle cx="160" cy="100" r="60" stroke="#5cd6c0"/><circle cx="230" cy="100" r="60" stroke="#ff7a8a"/></g><g fill="#fff" opacity="0.9"><circle cx="125" cy="100" r="6"/><circle cx="195" cy="100" r="6"/></g>`) },
  { key: "forest-badge", title: "Trail badge", language: "svg", content: svg(
    `<rect width="320" height="200" fill="#e8f3ea"/><circle cx="160" cy="100" r="76" fill="#2f7d4f"/><circle cx="160" cy="100" r="64" fill="none" stroke="#bfe5c9" stroke-width="3"/>
<path d="M160 50 L192 100 H174 L200 138 H120 L146 100 H128Z" fill="#e8f3ea"/><rect x="154" y="138" width="12" height="18" fill="#e8f3ea"/>`) },
  { key: "bloom-pattern", title: "Bloom pattern", language: "svg", content: svg(
    `<rect width="320" height="200" fill="#fbeef0"/><g fill="#f4799a"><circle cx="160" cy="62" r="30"/><circle cx="160" cy="138" r="30"/><circle cx="122" cy="100" r="30"/><circle cx="198" cy="100" r="30"/></g><circle cx="160" cy="100" r="20" fill="#ffd166"/><g fill="#9ad7b5"><circle cx="40" cy="40" r="12"/><circle cx="280" cy="160" r="16"/><circle cx="270" cy="38" r="9"/><circle cx="46" cy="162" r="10"/></g>`) },
  { key: "habit-tracker", title: "Habit tracker", language: "html", content: `<!doctype html><meta charset="utf-8"><style>
*{box-sizing:border-box}body{margin:0;font:15px system-ui,sans-serif;background:#f4f1ec;color:#23211f;padding:28px}
h1{margin:0 0 4px;font-size:22px}p.sub{margin:0 0 20px;color:#6d675f}
.row{display:flex;align-items:center;gap:14px;background:#fff;border-radius:14px;padding:14px 16px;margin-bottom:10px;box-shadow:0 1px 3px #0001}
.name{flex:1;font-weight:600}.days{display:flex;gap:6px}
.d{width:26px;height:26px;border-radius:8px;background:#e7e2da;border:0;cursor:pointer}.d.on{background:#3d8f6b}
.streak{font-variant-numeric:tabular-nums;color:#3d8f6b;font-weight:700;min-width:64px;text-align:right}
</style><h1>Weekly habits</h1><p class="sub">Tap a day to mark it done.</p><div id="list"></div>
<script>
const habits=[["Morning walk",[1,1,0,1,1,1,0]],["Read 20 pages",[1,0,1,1,0,1,1]],["Water plants",[0,1,0,0,1,0,0]],["Practice guitar",[1,1,1,0,1,1,1]]];
const list=document.getElementById("list");
function draw(){list.innerHTML="";habits.forEach(([n,d])=>{const r=document.createElement("div");r.className="row";
r.innerHTML='<span class="name">'+n+'</span>';const w=document.createElement("div");w.className="days";
d.forEach((v,i)=>{const b=document.createElement("button");b.className="d"+(v?" on":"");b.onclick=()=>{d[i]=v?0:1;draw()};w.appendChild(b)});
r.appendChild(w);const s=document.createElement("span");s.className="streak";s.textContent=d.filter(Boolean).length+" / 7";r.appendChild(s);list.appendChild(r)})}
draw();</script>` },
  { key: "budget-planner", title: "Trip budget planner", language: "html", content: `<!doctype html><meta charset="utf-8"><style>
body{margin:0;font:15px system-ui,sans-serif;background:#eef3fb;color:#1c2433;padding:28px}
.card{background:#fff;border-radius:16px;padding:20px;max-width:420px;box-shadow:0 2px 8px #0002}
h1{margin:0 0 14px;font-size:20px}label{display:flex;justify-content:space-between;margin:10px 0 4px}
input{width:100%}.total{margin-top:16px;font-size:28px;font-weight:700;color:#2f5fe0}
</style><div class="card"><h1>Trip budget</h1>
<label>Flights <b id="a">400</b></label><input type="range" min="0" max="1000" value="400" oninput="a.textContent=this.value;t()">
<label>Hotel <b id="b">600</b></label><input type="range" min="0" max="1500" value="600" oninput="b.textContent=this.value;t()">
<label>Food <b id="c">250</b></label><input type="range" min="0" max="800" value="250" oninput="c.textContent=this.value;t()">
<div class="total">$<span id="x">1250</span></div></div><script>function t(){x.textContent=+a.textContent+ +b.textContent+ +c.textContent}</script>` },
  { key: "flashcard-deck", title: "Flashcard deck", language: "tsx", content: `import { useState } from "react";
const cards = [["Bonjour", "Hello"], ["Merci", "Thank you"], ["Au revoir", "Goodbye"]];
export default function App() {
  const [i, setI] = useState(0);
  const [flip, setFlip] = useState(false);
  return <div style={{ fontFamily: "system-ui", padding: 32, background: "#fdf6ff", minHeight: "100vh" }}>
    <h1 style={{ margin: 0 }}>French basics</h1>
    <div onClick={() => setFlip(!flip)} style={{ marginTop: 20, width: 320, height: 180, borderRadius: 18, background: flip ? "#7c4dff" : "#fff", color: flip ? "#fff" : "#2a1f4a", display: "grid", placeItems: "center", fontSize: 32, boxShadow: "0 4px 14px #0003", cursor: "pointer" }}>{cards[i][flip ? 1 : 0]}</div>
    <button onClick={() => { setI((i + 1) % cards.length); setFlip(false); }} style={{ marginTop: 16 }}>Next card</button>
  </div>;
}` },
  { key: "pomodoro-timer", title: "Focus timer", language: "html", content: `<!doctype html><meta charset="utf-8"><style>body{margin:0;display:grid;place-items:center;height:100vh;background:#1b1f2a;color:#fff;font-family:system-ui}
.t{font-size:64px;font-variant-numeric:tabular-nums}button{margin-top:14px;padding:10px 22px;border:0;border-radius:999px;background:#ff7a59;color:#fff;font-size:16px}</style>
<div style="text-align:center"><div class="t" id="t">25:00</div><button onclick="go()">Start</button></div><script>let s=1500,h;function go(){clearInterval(h);h=setInterval(()=>{s--;t.textContent=String(Math.floor(s/60)).padStart(2,"0")+":"+String(s%60).padStart(2,"0")},1000)}</script>` },
];
