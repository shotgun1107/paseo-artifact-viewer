import { useId, useState, type ReactNode } from "react";
import type { LibraryItem } from "../shared/library";

/**
 * Gallery covers, drawn in the art direction of the user's reference gallery: quiet paper plates, hairlines,
 * one ink and one accent, and night scenes for the sky/sea/alley subjects. A stored static thumbnail (inert
 * raster/SVG data URL) is shown as is. Without one the title picks the plate: one fixed picture per named subject,
 * so a cover never changes with search, paging or order. Other subjects vary by artifact ID only in tone and layout.
 * A plate identifies the subject; it is not a screenshot, and no artifact code runs or is read.
 */

type Tone = { bg: string; card: string; ink: string; accent: string; soft: string; line: string; muted: string };
type Palette = { light: Tone; dark: Tone };
const paper = (bg: string, accent: string, accentDark: string): Palette => ({
  light: { bg, card: "#FFFFFF", ink: "#1C1917", accent, soft: "#EFEDE9", line: "#E1DED9", muted: "#A8A29E" },
  dark: { bg: "#232220", card: "#2C2A28", ink: "#EDEAE6", accent: accentDark, soft: "#35322F", line: "#45413D", muted: "#8F8983" },
});
const palettes: Palette[] = [
  paper("#FAF9F6", "#B87932", "#D79D5A"), paper("#FAF9F7", "#C86D51", "#E39278"), paper("#F6F6F4", "#D97706", "#F0A040"),
  paper("#F4F3F0", "#4A5866", "#93A5B8"), paper("#FAFAFA", "#52796F", "#84A98C"), paper("#F6F6F5", "#7A8B7B", "#A9BBA9"),
];
/** Paper tone of one named plate. */
const plate = (p: Tone, light: string) => p.card === "#FFFFFF" ? light : "#232220";
const matte = ["#C86D51", "#7A8B7B", "#4A5866", "#DDD4C6"];
const moonlight = "#F2E7CF";
const monoFont = { fontFamily: '"Paseo Artifact Mono","JetBrains Mono",ui-monospace,SFMono-Regular,Menlo,monospace' };
/** The reference draws its diagrams on a padded 280px sheet inside the 331px plate. */
const inset = "translate(24.7 15.4) scale(.8457)";
const clip = (value: string, max: number) => { const chars = Array.from(value); return chars.length > max ? chars.slice(0, max - 1).join("") + "…" : value; };

function hash(value: string) {
  let h = 0x811c9dc5;
  for (let i = 0; i < value.length; i++) { h ^= value.charCodeAt(i); h = Math.imul(h, 0x01000193); }
  return h >>> 0;
}
function random(seed: number) {
  let a = seed || 1;
  return () => { a = (a + 0x6d2b79f5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
}

/** Stable workspace colour for the source dot, from the reference sidebar's own set. */
const workspaceColors = ["#6E8547", "#B87932", "#4E73B5", "#2F7D5B", "#6B63B5", "#536D82", "#A66321"];
export function workspaceColor(name: string | null) { return name ? workspaceColors[hash(name) % workspaceColors.length] : null; }

export type Motif = "calendar" | "timer" | "clock" | "weather" | "constellation" | "lighthouse" | "night" | "graph" | "diagram" | "chart" | "map" | "dice" | "palette" | "counter" | "schema" | "music" | "form" | "memo" | "document" | "city" | "landscape"
  | "window" | "monogram" | "rings" | "waves" | "blocks" | "component" | "geometry";

// Single-syllable Korean words only count at a word start, so "계산기" is not a mountain.
const start = (words: string) => `(?:^|[\\s·,()_/\\-\\[])(?:${words})`;
// First match wins: concrete subjects (a lighthouse, an alley, the sea) come before the generic moon/star sky,
// so "달빛 아래 등대" is a lighthouse and "달이 뜨는 골목" an alley, not two copies of the same night plate.
const rules: [Motif, RegExp][] = [
  ["calendar", /달력|캘린더|calendar|일정|스케줄|schedule|플래너|planner/i],
  ["timer", /타이머|timer|포모도로|pomodoro|집중|카운트다운|countdown|스톱워치|stopwatch/i],
  ["clock", /시계|clock|알람|alarm|\bwatch\b/i],
  ["weather", /날씨|weather|기온|일기예보|forecast/i],
  ["constellation", /별자리|constellation/i],
  ["lighthouse", /등대|lighthouse|항구|harbou?r|부두|\bpier\b/i],
  ["city", new RegExp(`골목|도시|${start("거리")}|\\bcity\\b|street|\\balley|town`, "i")],
  ["landscape", new RegExp(`풍경|노을|해변|바다|${start("산|숲")}|landscape|mountain|ocean|forest|sunset|beach`, "i")],
  ["night", new RegExp(`달빛|별빛|밤하늘|보름달|초승달|우주|은하|행성|${start("달|별|밤")}|moon|\\bstars?\\b|night|galaxy|planet|\\bsky\\b`, "i")],
  ["graph", /의존성|dependenc|\bAST\b|트리|\btree\b|노드|\bnodes?\b|호출 ?그래프|call ?graph/i],
  ["diagram", /다이어그램|diagram|아키텍처|architecture|구조도|플로우|flow|파이프라인|pipeline|구현 지도|로드맵|roadmap|마인드맵|mind ?map|조직도/i],
  ["chart", /차트|chart|그래프|graph|통계|대시보드|dashboard|지표|매출|\bplot|시각화|visuali[sz]/i],
  ["map", /지도|\bmaps?\b|위치|여행|travel|경로|route|길찾기/i],
  ["dice", /주사위|dice|게임|\bgame|퍼즐|puzzle|룰렛|roulette|빙고|bingo|가위바위보|틱택토|tic.?tac|보드게임/i],
  ["palette", new RegExp(`색상|색깔|컬러|colou?r|palette|팔레트|그라데이션|gradient|${start("색")}`, "i")],
  ["counter", /카운터|counter|계산기|calculator|숫자|\bcount\b|점수|score|스텝퍼|stepper/i],
  ["schema", /스키마|schema|\bsql\b|테이블|\btable|데이터베이스|database|\bdb\b|json|\bapi\b|쿼리|query|코드|\bcode|정규식|regex/i],
  ["music", /음악|music|소리|sound|audio|오디오|피아노|piano|비트|\bbeat|리듬|rhythm|드럼|drum|노래|\bsong|플레이어|player/i],
  ["form", /로그인|login|회원가입|sign.?up|설정|settings|입력|설문|survey|신청|\bforms?\b|양식/i],
  ["memo", /메모|memo|노트|\bnotes?\b|할 ?일|todo|to-do|체크리스트|checklist|목록|리스트|\blist|일기|journal|다이어리|습관|habit/i],
  ["document", /문서|보고서|report|글쓰기|article|소개|readme|안내|가이드|guide|발표|slide|슬라이드|프레젠테이션|presentation|이력서|resume|레터|letter|뉴스|news|블로그|blog|랜딩|landing|포트폴리오|portfolio/i],
];
const fallbacks: Record<LibraryItem["format"], Motif[]> = {
  html: ["window", "monogram", "rings", "waves", "blocks"],
  react: ["component", "window", "monogram"],
  svg: ["geometry", "rings", "blocks"],
};

export function coverMotif(title: string, format: LibraryItem["format"], seed: number): Motif {
  for (const [motif, rule] of rules) if (rule.test(title)) return motif;
  const list = fallbacks[format] ?? fallbacks.html;
  return list[seed % list.length];
}

/** Only inert raster/SVG data URLs reach an <img>; anything else falls back to the drawn cover. */
export const safeThumb = (value: string | null) => value && /^data:image\/(?:png|jpeg|webp|gif|svg\+xml)[;,]/i.test(value) ? value : null;

export function Cover({ item, dark, size = "card" }: { item: Pick<LibraryItem, "artifactId" | "title" | "format" | "thumbnail" | "headVersion">; dark: boolean; size?: "card" | "mini" }) {
  const [broken, setBroken] = useState(false);
  const rawId = useId();
  const seed = hash(item.artifactId);
  const palette = palettes[seed % palettes.length];
  const p = dark ? palette.dark : palette.light;
  const thumb = broken ? null : safeThumb(item.thumbnail);
  if (thumb) return <span className="avl-cover" data-kind="thumbnail" data-format={item.format} style={{ background: item.format === "svg" ? p.bg : "#fff" }}>
    <img src={thumb} alt="" loading="lazy" decoding="async" draggable={false} referrerPolicy="no-referrer" onError={() => setBroken(true)} />
  </span>;
  const motif = coverMotif(item.title, item.format, hash(item.title + item.artifactId));
  const id = `avc${rawId.replace(/[^a-zA-Z0-9]/g, "")}`;
  return <span className="avl-cover" data-kind="emblem" data-motif={motif} data-format={item.format}>
    <svg viewBox="0 0 320 200" preserveAspectRatio="xMidYMid slice" aria-hidden="true" focusable="false">
      {draw(motif, p, random(seed), id, item, size === "mini")}
    </svg>
  </span>;
}

/* ───────────────────────────── motifs ───────────────────────────── */

const between = (r: () => number, min: number, max: number) => min + r() * (max - min);
const Bg = ({ fill }: { fill: string }) => <rect width="320" height="200" fill={fill} />;

function pips(value: number): [number, number][] {
  const c = 0, l = -1, h = 1;
  const map: Record<number, [number, number][]> = {
    1: [[c, c]], 2: [[l, l], [h, h]], 3: [[l, l], [c, c], [h, h]], 4: [[l, l], [h, l], [l, h], [h, h]],
    5: [[l, l], [h, l], [c, c], [l, h], [h, h]], 6: [[l, l], [h, l], [l, c], [h, c], [l, h], [h, h]],
  };
  return map[value] ?? map[1];
}

function draw(motif: Motif, p: Tone, r: () => number, id: string, { title, headVersion }: Pick<LibraryItem, "title" | "headVersion">, mini: boolean): ReactNode {
  switch (motif) {
    case "timer": {
      const size = mini ? 50 : 45.5, c = 2 * Math.PI * size, width = mini ? 13 : 3.25;
      return <>
        <Bg fill={plate(p, "#FAF9F7")} />
        <circle cx="160" cy="100" r={size} fill="none" stroke={p.card === "#FFFFFF" ? "#E7E5E4" : p.line} strokeWidth={width} />
        <circle cx="160" cy="100" r={size} fill="none" stroke={p.ink} strokeWidth={width} strokeLinecap="round" strokeDasharray={`${c * 0.818} ${c}`} transform="rotate(-90 160 100)" />
        {!mini && <text x="160" y="106.6" textAnchor="middle" fontSize="18.4" fontWeight="500" letterSpacing="-.46" fill={p.ink} style={monoFont}>24:58</text>}
      </>;
    }
    case "clock": {
      const ink = p.card === "#FFFFFF" ? "#171717" : p.ink;
      return <>
        <Bg fill={plate(p, "#F6F6F4")} />
        <g transform={mini ? "translate(90 30) scale(1.4)" : "translate(105.8 45.8) scale(1.083)"} strokeLinecap="round">
          <circle cx="50" cy="50" r="42" fill={p.card} stroke={ink} strokeWidth={mini ? 5 : 2.2} />
          {[[50, 14, 50, 19], [50, 81, 50, 86], [14, 50, 19, 50], [81, 50, 86, 50]].map(([x1, y1, x2, y2], i) => <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke={ink} strokeWidth="2" />)}
          <line x1="50" y1="50" x2="36" y2="35" stroke={ink} strokeWidth="2.6" /><line x1="50" y1="50" x2="72" y2="40" stroke={ink} strokeWidth="1.8" />
          <line x1="50" y1="56" x2="50" y2="20" stroke="#D97706" strokeWidth="1.2" /><circle cx="50" cy="50" r="2.3" fill="#D97706" />
        </g>
      </>;
    }
    case "calendar": {
      const today = Math.floor(between(r, 3, 25));
      return <>
        <Bg fill={p.bg} />
        <rect x="74" y="30" width="172" height="148" rx="12" fill={p.card} stroke={p.line} />
        <path d="M74 42a12 12 0 0 1 12-12h148a12 12 0 0 1 12 12v18H74z" fill={p.accent} />
        <rect x="112" y="22" width="6" height="18" rx="3" fill={p.ink} /><rect x="202" y="22" width="6" height="18" rx="3" fill={p.ink} />
        {Array.from({ length: 28 }, (_, i) => {
          const x = 88 + (i % 7) * 21, y = 72 + Math.floor(i / 7) * 25;
          return i === today ? <circle key={i} cx={x + 7} cy={y + 7} r="9" fill={p.ink} /> : <rect key={i} x={x + 2} y={y + 3} width="10" height="8" rx="2.5" fill={i % 7 > 4 ? p.line : p.soft} />;
        })}
      </>;
    }
    case "weather": {
      const sunX = between(r, 108, 140);
      return <>
        <Bg fill={p.bg} />
        <g stroke={p.accent} strokeWidth="3" strokeLinecap="round">{Array.from({ length: 8 }, (_, i) => <line key={i} x1={sunX} y1="34" x2={sunX} y2="44" transform={`rotate(${i * 45} ${sunX} 84)`} />)}</g>
        <circle cx={sunX} cy="84" r="28" fill={p.accent} />
        <path d="M150 150h96a26 26 0 0 0 0-52 36 36 0 0 0-68-8 30 30 0 0 0-28 60z" fill={p.card} stroke={p.line} strokeWidth="1.5" />
        {!mini && <g stroke={p.muted} strokeWidth="2" strokeLinecap="round"><line x1="176" y1="164" x2="170" y2="176" /><line x1="200" y1="164" x2="194" y2="176" /><line x1="224" y1="164" x2="218" y2="176" /></g>}
      </>;
    }
    case "constellation":
      return <>
        <Bg fill="#131521" />
        <polyline points="54,126 116,74 176,94 236,56 272,110 212,146 176,94" fill="none" stroke="#94A3B8" strokeWidth={mini ? 2.4 : 0.9} strokeOpacity=".55" />
        <g fill="#F1F5F9">{[[54, 126, 2.2], [116, 74, 2.6], [176, 94, 2.2], [236, 56, 3], [272, 110, 2], [212, 146, 2.2]].map(([x, y, size], i) => <circle key={i} cx={x} cy={y} r={mini ? size * 2 : size} />)}</g>
        {!mini && <text x="20" y="180" fill="#64748B" fontSize="7.5" style={monoFont}>LYRA · +38° 47′</text>}
      </>;
    case "night": {
      const x = between(r, 214, 258);
      return <>
        <defs><linearGradient id={`${id}s`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#0E1522" /><stop offset="1" stopColor="#1A263B" /></linearGradient>
          <mask id={`${id}m`}><rect width="320" height="200" fill="#fff" /><circle cx={x - 6} cy="44" r="13.5" fill="#000" /></mask></defs>
        <rect width="320" height="200" fill={`url(#${id}s)`} />
        {!mini && Array.from({ length: 14 }, (_, i) => <circle key={i} cx={between(r, 8, 312)} cy={between(r, 8, 120)} r={between(r, 0.5, 1.1)} fill="#F1F5F9" opacity={between(r, 0.25, 0.65)} />)}
        <circle cx={x} cy="48" r="15" fill={moonlight} mask={`url(#${id}m)`} />
        <rect y="148" width="320" height="52" fill="#0C1421" />
        <g stroke={moonlight} strokeWidth="1.5" strokeLinecap="round"><line x1={x - 18} y1="160" x2={x + 18} y2="160" strokeOpacity=".3" /><line x1={x - 10} y1="169" x2={x + 10} y2="169" strokeOpacity=".18" /></g>
      </>;
    }
    case "lighthouse":
      return <>
        <defs>
          <linearGradient id={`${id}k`} x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#0E1522" /><stop offset="100%" stopColor="#1A263B" /></linearGradient>
          <linearGradient id={`${id}b`} x1="0" y1=".5" x2="1" y2=".5"><stop offset="0%" stopColor="#F2E7CF" stopOpacity=".48" /><stop offset="100%" stopColor="#F2E7CF" stopOpacity="0" /></linearGradient>
        </defs>
        <rect width="320" height="200" fill={`url(#${id}k)`} />
        <circle cx="256" cy="48" r="15" fill={moonlight} /><circle cx="250" cy="44" r="13.5" fill="#121B2B" />
        <polygon points="116,78 320,42 320,108" fill={`url(#${id}b)`} />
        <rect x="0" y="148" width="320" height="52" fill="#0C1421" />
        <line x1="238" y1="160" x2="274" y2="160" stroke={moonlight} strokeOpacity=".3" strokeWidth="1.5" strokeLinecap="round" />
        <line x1="246" y1="169" x2="266" y2="169" stroke={moonlight} strokeOpacity=".18" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M0 156 L84 140 L142 142 L168 158 L168 200 L0 200 Z" fill="#0A101B" />
        <polygon points="104,142 109,84 121,84 126,142" fill="#E7E5E4" />
        <rect x="109" y="73" width="12" height="11" fill={moonlight} />
        <polygon points="106,73 115,63 124,73" fill="#27272A" />
      </>;
    case "graph": {
      const nodes = [[16, 83, 62, "#1F1F23", "#3F3F46", "#D4D4D8"], [126, 45, 72, "#231E1A", "#D4A373", "#F3E2CE"], [126, 121, 72, "#1F1F23", "#3F3F46", "#A1A1AA"], [238, 83, 66, "#1F1F23", "#71717A", "#F4F4F5"]] as const;
      return <>
        <Bg fill="#161618" />
        <g transform={inset}>
          <g fill="none" strokeWidth={mini ? 4 : 1.3}>
            <path d="M78 100 C102 100 102 62 126 62" stroke="#D4A373" /><path d="M78 100 C102 100 102 138 126 138" stroke="#3F3F46" />
            <path d="M198 62 C218 62 218 100 238 100" stroke="#D4A373" /><path d="M198 138 C218 138 218 100 238 100" stroke="#52525B" />
          </g>
          {nodes.map(([x, y, w, fill, stroke, ink], i) => <g key={i}><rect x={x} y={y} width={w} height="34" rx="5" fill={fill} stroke={stroke} strokeWidth={mini ? 4 : i === 1 ? 1.2 : 1} />
            {!mini && <rect x={x + w / 2 - 13} y={y + 14.5} width="26" height="5" rx="2.5" fill={ink} opacity=".82" />}</g>)}
        </g>
      </>;
    }
    case "diagram": {
      const light = p.card === "#FFFFFF", line = light ? "#E7E5E4" : p.line, ink = light ? "#44403C" : p.ink;
      const nodes = [[20, 48, 76], [124, 48, 72], [224, 48, 76], [20, 116, 76], [124, 116, 72], [224, 116, 76]];
      return <>
        <defs><pattern id={`${id}g`} width="15.5" height="15.5" patternUnits="userSpaceOnUse"><circle cx="7.75" cy="7.75" r="1" fill={light ? "rgb(20 20 20 / .08)" : "rgb(255 255 255 / .08)"} /></pattern></defs>
        <Bg fill={plate(p, "#FAF9F6")} /><rect width="320" height="200" fill={`url(#${id}g)`} />
        <g transform={inset}>
          <path d="M96 68 H124 M196 68 H224 M160 88 V116 M96 136 H124 M196 136 H224" stroke={light ? "#D6D3D1" : p.line} strokeWidth={mini ? 4 : 1.4} fill="none" />
          <path d="M160 88 V116" stroke="#B87932" strokeWidth={mini ? 4 : 1.5} strokeDasharray={mini ? undefined : "3 3"} />
          {!mini && <text x="20" y="26" fontSize="8" fill={p.muted} style={monoFont}>{`${clip(title.toUpperCase(), 34)} · v${headVersion}`}</text>}
          {nodes.map(([x, y, w], i) => <g key={i}>
            <rect x={x} y={y} width={w} height="40" rx="6" fill={i === 5 ? (light ? "#F5F5F4" : p.soft) : p.card} stroke={i === 1 ? "#B87932" : line} strokeWidth={i === 1 ? (mini ? 4 : 1.3) : 1} />
            {!mini && (i === 1 ? <><circle cx="135" cy="68" r="2.5" fill="#B87932" /><rect x="143" y="65.5" width="26" height="5" rx="2.5" fill={p.ink} /></>
              : <><text x={x + 12} y={y + 23} fontSize="8.5" fontWeight="500" fill={ink} style={monoFont}>{`0${i + 1}`}</text><rect x={x + 27} y={y + 17.5} width={w - 45} height="5" rx="2.5" fill={light ? "#D6D3D1" : p.line} /></>)}
          </g>)}
          <g strokeWidth="2" strokeLinecap="round"><line x1="20" y1="178" x2="300" y2="178" stroke={line} /><line x1="20" y1="178" x2="210" y2="178" stroke={p.ink} /></g>
        </g>
      </>;
    }
    case "chart": {
      const values = Array.from({ length: 8 }, () => between(r, 0.25, 1));
      const top = values.indexOf(Math.max(...values));
      const line = r() > 0.5;
      return <>
        <Bg fill={p.bg} />
        <rect x="34" y="26" width="252" height="150" rx="12" fill={p.card} stroke={p.line} />
        {!mini && <><rect x="52" y="42" width="58" height="7" rx="3.5" fill={p.ink} /><rect x="52" y="55" width="34" height="5" rx="2.5" fill={p.soft} /></>}
        <line x1="52" y1="158" x2="268" y2="158" stroke={p.line} />
        {line ? <>
          <polyline points={values.map((v, i) => `${58 + i * 29},${154 - v * 80}`).join(" ")} fill="none" stroke={p.ink} strokeWidth={mini ? 6 : 2} strokeLinejoin="round" strokeLinecap="round" />
          <circle cx={58 + top * 29} cy={154 - values[top] * 80} r={mini ? 8 : 4} fill={p.accent} />
        </> : values.map((v, i) => <rect key={i} x={54 + i * 27} y={156 - v * 84} width="17" height={v * 84} rx="3" fill={i === top ? p.accent : i % 2 ? p.soft : p.line} />)}
      </>;
    }
    case "map": {
      const pinX = between(r, 190, 250), pinY = between(r, 60, 100);
      return <>
        <Bg fill={p.soft} />
        <path d={`M-10 ${between(r, 120, 150)} C 80 ${between(r, 100, 140)}, 120 200, 200 210 L-10 210Z`} fill={p.accent} opacity=".16" />
        <g stroke={p.card} strokeWidth={mini ? 12 : 7} fill="none" strokeLinecap="round">
          <path d={`M-10 ${between(r, 50, 80)} L330 ${between(r, 40, 90)}`} /><path d={`M${between(r, 90, 140)} -10 L${between(r, 100, 160)} 210`} />
          <path d={`M${between(r, 200, 260)} -10 L${between(r, 220, 300)} 210`} />
        </g>
        <path d={`M70 160 C 110 130, 150 ${pinY + 70}, ${pinX} ${pinY + 18}`} fill="none" stroke={p.ink} strokeWidth={mini ? 5 : 2} strokeDasharray={mini ? undefined : "5 5"} strokeLinecap="round" />
        <circle cx="70" cy="160" r={mini ? 8 : 5} fill={p.card} stroke={p.ink} strokeWidth="2" />
        <path d={`M${pinX} ${pinY + 22} c-12-14-18-22-18-30a18 18 0 0 1 36 0c0 8-6 16-18 30z`} fill={p.accent} />
        <circle cx={pinX} cy={pinY - 8} r="6" fill={p.card} />
      </>;
    }
    case "dice": {
      const light = p.card === "#FFFFFF", faces = [5, 2];
      const scale = mini ? 1.5 : 1;
      return <>
        <Bg fill={plate(p, "#F4F3F0")} />
        {faces.map((face, i) => {
          const cx = 160 + (i ? 34.75 : -34.75) * scale, half = 27 * scale;
          return <g key={i}>
            <rect x={cx - half} y={100 - half} width={half * 2} height={half * 2} rx={11.6 * scale} fill={p.card} stroke={light ? "rgb(0 0 0 / .06)" : p.line} />
            {pips(face).map(([dx, dy], j) => <circle key={j} cx={cx + dx * 10.3 * scale} cy={100 + dy * 10.3 * scale} r={mini ? 6 : 2.9} fill={light ? "#262626" : p.ink} />)}
          </g>;
        })}
      </>;
    }
    case "palette": {
      const pad = mini ? 22 : 15.5, gap = mini ? 14 : 7.7, w = (320 - pad * 2 - gap * 3) / 4;
      return <>
        <Bg fill={plate(p, "#FAF9F7")} />
        {matte.map((color, i) => <rect key={color} x={pad + i * (w + gap)} y={pad} width={w} height={200 - pad * 2} rx={mini ? 20 : 4.9} fill={color} />)}
      </>;
    }
    case "counter":
      return <>
        <Bg fill={plate(p, "#F6F6F5")} />
        <text x="160" y={mini ? 130 : 109.6} textAnchor="middle" fontSize={mini ? 84 : 27} fontWeight="500" letterSpacing="-.7" fill={p.card === "#FFFFFF" ? "#262626" : p.ink} style={monoFont}>42</text>
        {!mini && <g fill="none" stroke="#A3A3A3" strokeWidth="1.2" strokeLinecap="round"><path d="M117.5 100h7M195.5 100h7M199 96.5v7" /></g>}
      </>;
    case "schema": {
      const light = p.card === "#FFFFFF", faint = light ? "#A3A3A3" : p.muted, ink = light ? "#171717" : p.ink, rows = [[0, 62, 46], [1, 12, 78], [1, 56, 62], [1, 26, 62], [1, 62, 24], [0, 8, 0]];
      return <>
        <Bg fill={plate(p, "#FAFAFA")} />
        {!mini && <text x="20" y="59" fontSize="8.2" fill={faint} style={monoFont}>{`-- ${clip(title, 30)}`}</text>}
        {rows.map(([indent, a, b], i) => { const y = (mini ? 34 : 70) + i * (mini ? 24 : 14.6), k = mini ? 1.7 : 1, x = 20 + indent * 12; return <g key={i}>
          <rect x={x} y={y} width={a * k} height={mini ? 10 : 4.4} rx="2.2" fill={indent ? (light ? "#525252" : p.ink) : ink} opacity={indent ? 0.75 : 1} />
          {b > 0 && <rect x={x + a * k + 6} y={y} width={b * k} height={mini ? 10 : 4.4} rx="2.2" fill={faint} opacity=".55" />}
        </g>; })}
      </>;
    }
    case "music": {
      const phase = r() * Math.PI, played = between(r, 0.3, 0.7);
      return <>
        <Bg fill={p.bg} />
        <circle cx="54" cy="100" r="24" fill={p.ink} /><path d="M48 88v24l18-12z" fill={p.card} />
        {Array.from({ length: 28 }, (_, i) => {
          const h = 10 + Math.abs(Math.sin(i * 0.55 + phase) * Math.cos(i * 0.21)) * 70;
          return <rect key={i} x={94 + i * 7.6} y={100 - h / 2} width="4" height={h} rx="2" fill={i / 28 < played ? p.accent : p.line} />;
        })}
      </>;
    }
    case "form":
      return <>
        <Bg fill={p.bg} />
        <rect x="74" y="20" width="172" height="180" rx="12" fill={p.card} stroke={p.line} />
        <rect x="94" y="38" width="64" height="8" rx="4" fill={p.ink} />
        {[60, 100].map(y => <g key={y}><rect x="94" y={y} width="40" height="5" rx="2.5" fill={p.muted} opacity=".6" /><rect x="94" y={y + 11} width="132" height="22" rx="6" fill="none" stroke={p.line} strokeWidth="1.5" /></g>)}
        <rect x="94" y="146" width="24" height="14" rx="7" fill={p.accent} /><circle cx="111" cy="153" r="5" fill={p.card} />
        <rect x="124" y="151" width={between(r, 40, 70)} height="5" rx="2.5" fill={p.soft} />
        <rect x="94" y="172" width="132" height="22" rx="6" fill={p.ink} />
      </>;
    case "memo": {
      const light = p.card === "#FFFFFF", soft = light ? "#D4D4D4" : p.line;
      return <>
        <Bg fill={plate(p, "#FAF9F6")} />
        <g transform={mini ? "translate(160 100) scale(1.5) translate(-160 -100)" : undefined}>
          {[[72, 108], [100, 77], [128, 124]].map(([y, w], i) => <g key={y}>
            {i < 2 ? <circle cx="68.3" cy={y} r="4.8" fill={soft} /> : <circle cx="68.3" cy={y} r="4.4" fill="none" stroke={light ? "#A3A3A3" : p.muted} />}
            <rect x="82.8" y={y - 2.9} width={w} height="5.8" rx="2.9" fill={i < 2 ? soft : light ? "#404040" : p.ink} />
            {i < 2 && <line x1="63.5" x2="256.5" y1={y + 13} y2={y + 13} stroke={light ? "#E5E5E5" : p.line} strokeOpacity=".8" />}
          </g>)}
        </g>
      </>;
    }
    case "document":
      return <>
        <Bg fill={p.bg} />
        <rect x="88" y="24" width="144" height="190" rx="8" fill={p.card} stroke={p.line} />
        <rect x="106" y="44" width="30" height="5" rx="2.5" fill={p.accent} />
        <rect x="106" y="56" width={between(r, 80, 106)} height="9" rx="4.5" fill={p.ink} />
        <rect x="106" y="70" width={between(r, 50, 80)} height="9" rx="4.5" fill={p.ink} />
        <rect x="106" y="92" width="108" height={between(r, 34, 50)} rx="5" fill={p.soft} />
        {Array.from({ length: 4 }, (_, i) => <rect key={i} x="106" y={152 + i * 11} width={i === 3 ? 60 : between(r, 92, 108)} height="5" rx="2.5" fill={p.line} />)}
      </>;
    case "city":
      return <>
        <defs><linearGradient id={`${id}d`} x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#191624" /><stop offset="65%" stopColor="#352842" /><stop offset="100%" stopColor="#6B443E" /></linearGradient></defs>
        <rect width="320" height="200" fill={`url(#${id}d)`} />
        <circle cx="214" cy="56" r="19" fill={moonlight} />
        <polygon points="0,44 98,78 98,200 0,200" fill="#14111D" /><polygon points="320,34 224,76 224,200 320,200" fill="#110E19" />
        <rect x="34" y="102" width="14" height="20" rx="1" fill="#E8C27A" fillOpacity=".65" /><rect x="258" y="106" width="16" height="22" rx="1" fill="#E8C27A" fillOpacity=".45" />
        <polygon points="98,200 146,136 176,136 224,200" fill="#231D30" />
      </>;
    case "landscape": {
      const sun = [between(r, 80, 240), between(r, 50, 80)];
      return <>
        <defs><linearGradient id={`${id}l`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor={p.bg} /><stop offset="1" stopColor={p.soft} /></linearGradient></defs>
        <rect width="320" height="200" fill={`url(#${id}l)`} />
        <circle cx={sun[0]} cy={sun[1]} r="22" fill={p.accent} opacity=".85" />
        {[0, 1, 2].map(layer => {
          const base = 112 + layer * 28, a = between(r, -20, 20), b = between(r, -24, 24);
          return <path key={layer} d={`M0 ${base + a} C 80 ${base - 30 + b}, 140 ${base + 20}, 200 ${base - 10 + a} S 300 ${base - 24}, 320 ${base + b} V200 H0Z`} fill={[p.line, p.muted, p.ink][layer]} opacity={[0.8, 0.75, 0.92][layer]} />;
        })}
      </>;
    }
    case "component":
      return <>
        <Bg fill={p.bg} />
        <rect x="104" y="20" width="148" height="104" rx="12" fill={p.soft} />
        <rect x="86" y="38" width="148" height="104" rx="12" fill={p.line} opacity=".7" />
        <rect x="66" y="58" width="168" height="120" rx="12" fill={p.card} stroke={p.line} />
        <circle cx="94" cy="88" r="13" fill={p.accent} />
        <rect x="116" y="80" width={between(r, 60, 90)} height="7" rx="3.5" fill={p.ink} /><rect x="116" y="92" width={between(r, 36, 60)} height="5" rx="2.5" fill={p.muted} opacity=".55" />
        <rect x="82" y="116" width="136" height="5" rx="2.5" fill={p.soft} /><rect x="82" y="127" width="110" height="5" rx="2.5" fill={p.soft} />
        <rect x="82" y="146" width="52" height="18" rx="9" fill={p.ink} /><rect x="140" y="146" width="40" height="18" rx="9" fill="none" stroke={p.line} />
      </>;
    case "geometry": {
      const turn = between(r, -20, 20);
      return <>
        <Bg fill={p.bg} />
        <circle cx={between(r, 100, 130)} cy={between(r, 90, 110)} r="46" fill={p.accent} opacity=".9" />
        <rect x="150" y="56" width="74" height="74" rx="8" fill={p.soft} stroke={p.line} transform={`rotate(${turn} 187 93)`} />
        <path d={`M${between(r, 170, 200)} 168 l34 -58 l34 58z`} fill={p.ink} />
        <line x1="40" y1="172" x2="280" y2="172" stroke={p.line} strokeWidth="1.5" />
      </>;
    }
    case "rings": {
      const cx = between(r, 110, 210), cy = between(r, 80, 120);
      return <>
        <Bg fill={p.bg} />
        {[96, 74, 52, 30].map((radius, i) => <circle key={i} cx={cx} cy={cy} r={radius} fill="none" stroke={i === 2 ? p.accent : p.line} strokeWidth={i === 2 ? (mini ? 8 : 3) : 1.4} />)}
        <circle cx={cx} cy={cy} r="10" fill={p.ink} />
        <circle cx={cx + 74 * Math.cos(r() * 6.28)} cy={cy + 74 * Math.sin(r() * 6.28)} r="6" fill={p.accent} />
      </>;
    }
    case "waves": {
      const amp = between(r, 10, 22), phase = r() * 100;
      return <>
        <Bg fill={p.bg} />
        {Array.from({ length: 7 }, (_, i) => {
          const y = 40 + i * 20;
          const d = `M-10 ${y} ${Array.from({ length: 9 }, (_, k) => `Q ${k * 40 + 10} ${y + (k % 2 ? amp : -amp) * Math.sin((i * 13 + phase) / 20)} ${k * 40 + 30} ${y}`).join(" ")}`;
          return <path key={i} d={d} fill="none" stroke={i === 3 ? p.accent : i % 2 ? p.line : p.muted} strokeWidth={i === 3 ? (mini ? 8 : 3) : 1.4} opacity={i === 3 ? 1 : 0.7} strokeLinecap="round" />;
        })}
      </>;
    }
    case "blocks": {
      const split = [between(r, 100, 150), between(r, 70, 120), between(r, 200, 240)];
      const hot = Math.floor(r() * 4);
      const cells = [[16, 16, split[0] - 22, split[1] - 22], [split[0] + 2, 16, 302 - split[0], split[1] - 22], [16, split[1] + 2, split[2] - 22, 182 - split[1]], [split[2] + 2, split[1] + 2, 302 - split[2], 182 - split[1]]];
      return <>
        <Bg fill={p.bg} />
        {cells.map(([x, y, w, h], i) => <rect key={i} x={x} y={y} width={w} height={h} rx="8" fill={i === hot ? p.accent : i % 2 ? p.soft : p.card} stroke={i === hot ? "none" : p.line} />)}
      </>;
    }
    case "monogram": {
      const glyph = (Array.from(title.trim())[0] ?? "·").toUpperCase();
      return <>
        <Bg fill={p.bg} />
        <circle cx={between(r, 230, 270)} cy={between(r, 50, 80)} r="70" fill={p.soft} />
        <text x="34" y="158" fontSize="124" fontWeight="650" fill={p.ink} style={{ fontFamily: "inherit", letterSpacing: "-0.04em" }}>{glyph}</text>
        <rect x="38" y="174" width="44" height="4" rx="2" fill={p.accent} />
      </>;
    }
    case "window":
    default: {
      const sidebar = r() > 0.4;
      return <>
        <Bg fill={p.bg} />
        <rect x="34" y="26" width="252" height="174" rx="12" fill={p.card} stroke={p.line} />
        <line x1="34" y1="50" x2="286" y2="50" stroke={p.line} />
        {[0, 1, 2].map(i => <circle key={i} cx={50 + i * 12} cy="38" r="3.5" fill={i === 0 ? p.accent : p.soft} />)}
        {sidebar && <><rect x="34" y="50" width="64" height="150" fill={p.bg} opacity=".7" />{[0, 1, 2, 3].map(i => <rect key={i} x="46" y={66 + i * 16} width={between(r, 26, 40)} height="5" rx="2.5" fill={i === 1 ? p.accent : p.line} />)}</>}
        <rect x={sidebar ? 114 : 54} y="68" width={between(r, 70, 110)} height="9" rx="4.5" fill={p.ink} />
        <rect x={sidebar ? 114 : 54} y="86" width={between(r, 90, 150)} height="5" rx="2.5" fill={p.line} />
        <rect x={sidebar ? 114 : 54} y="104" width={sidebar ? 156 : 216} height={between(r, 44, 60)} rx="7" fill={p.soft} />
        <rect x={sidebar ? 114 : 54} y="176" width="46" height="14" rx="7" fill={p.accent} />
      </>;
    }
  }
}

