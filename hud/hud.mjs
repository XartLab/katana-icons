// SPDX-License-Identifier: MIT
// KATANA 驾驶舱 HUD 资产：每个函数返回一段 SVG 片段（字符串），放进任何 <svg> 里用，不依赖框架。
// 做法照机甲驾驶舱屏幕的通用语言自己画：细线框、七段管数字、刻度带、准星、分段仪表；
// 整体一种浅灰，只有要人马上看见的东西上关键色。没有复制任何作品的字形或画面。
import G from './glyphs.json' with { type: 'json' };

export const THEME = { ink: '#DCD8CC', dim: '#6C706B', key: '#E8572A', bg: '#0B0D0D' };
const f = (v) => (Math.round(v * 100) / 100).toString();
let uid = 0;
const id = (p) => `${p}${++uid}`;

// ---------- 七段管 ----------
// 段：a 上 b 右上 c 右下 d 下 e 左下 f 左上 g 中；p 小数点
const SEG = {
  0: 'abcdef', 1: 'bc', 2: 'abged', 3: 'abgcd', 4: 'fgbc', 5: 'afgcd', 6: 'afgedc', 7: 'abc', 8: 'abcdefg', 9: 'abcfgd',
  A: 'abcefg', B: 'fgcde', C: 'afed', D: 'bcdeg', E: 'afged', F: 'afge', H: 'fbgec', L: 'fed', O: 'abcdef', P: 'abfge',
  R: 'eg', T: 'fged', U: 'fbcde', Y: 'fbgcd', S: 'afgcd', N: 'ceg', I: 'bc', '-': 'g', ' ': ''
};
function bar(x0, y0, x1, y1, t) {
  // 两头尖的段（经典七段管的六边形）
  const h = t / 2;
  if (y0 === y1) return [[x0, y0], [x0 + h, y0 - h], [x1 - h, y0 - h], [x1, y0], [x1 - h, y0 + h], [x0 + h, y0 + h]];
  return [[x0, y0], [x0 + h, y0 + h], [x0 + h, y1 - h], [x0, y1], [x0 - h, y1 - h], [x0 - h, y0 + h]];
}
function segPolys(w, h, t, g) {
  const m = h / 2;
  return {
    a: bar(g, 0, w - g, 0, t), d: bar(g, h, w - g, h, t), g: bar(g, m, w - g, m, t),
    f: bar(0, g, 0, m - g, t), b: bar(w, g, w, m - g, t), e: bar(0, m + g, 0, h - g, t), c: bar(w, m + g, w, h - g, t)
  };
}
/**
 * 七段管文字。mode：'solid' 实心 | 'outline' 空心描边。ghost：灭掉的段淡淡显示（0 关）。
 * skew：向右倾斜的度数，仪表数字常用 8°。
 */
export function sevenSeg(text, { x = 0, y = 0, h = 40, color = THEME.ink, ghost = 0.08, mode = 'solid', skew = 8, track = 0.32 } = {}) {
  const w = h * 0.52, t = h * 0.16, g = t * 0.42, P = segPolys(w, h, t, g);
  const k = Math.tan((skew * Math.PI) / 180);
  let cx = x + t / 2, out = '';
  const poly = (pts, ox, on) => {
    const d = pts.map(([px, py]) => `${f(ox + px + (h - py) * k)},${f(y + py)}`).join(' ');
    const paint = mode === 'outline' ? `fill="none" stroke="${color}" stroke-width="${f(Math.max(1, t * 0.14))}"` : `fill="${color}"`;
    return `<polygon points="${d}" ${paint} opacity="${on ? 1 : ghost}"/>`;
  };
  for (const ch of String(text).toUpperCase()) {
    if (ch === '.' || ch === ':') {
      const r = t * 0.55;
      out += ch === '.' ? `<rect x="${f(cx - r * 0.2 + 0 * k)}" y="${f(y + h - r)}" width="${f(r * 1.6)}" height="${f(r * 1.6)}" fill="${color}"/>`
        : `<rect x="${f(cx + h * 0.32 * k)}" y="${f(y + h * 0.28)}" width="${f(r * 1.4)}" height="${f(r * 1.4)}" fill="${color}"/><rect x="${f(cx + h * 0.12 * k)}" y="${f(y + h * 0.66)}" width="${f(r * 1.4)}" height="${f(r * 1.4)}" fill="${color}"/>`;
      cx += t * 2.2;
      continue;
    }
    const on = SEG[ch] ?? '';
    if (ghost > 0 || on) for (const s of 'abcdefg') if (on.includes(s) || ghost > 0) out += poly(P[s], cx, on.includes(s));
    cx += w + h * track * 0.5 + t;
  }
  return out;
}
export const sevenSegWidth = (text, h = 40, track = 0.32) => {
  const w = h * 0.52, t = h * 0.16;
  return [...String(text)].reduce((a, ch) => a + (ch === '.' || ch === ':' ? t * 2.2 : w + h * track * 0.5 + t), t / 2);
};

// ---------- 模板字（直线 + 漏字板断桥，字形见 type/glyphs.py）----------
function nearSeg([px, py], [ax, ay], [bx, by]) {
  const dx = bx - ax, dy = by - ay, L2 = dx * dx + dy * dy || 1e-9, t = Math.max(0, Math.min(1, ((px - ax) * dx + (py - ay) * dy) / L2));
  return Math.hypot(ax + t * dx - px, ay + t * dy - py);
}
function cross([x1, y1], [x2, y2], [x3, y3], [x4, y4]) {
  const den = (x1 - x2) * (y3 - y4) - (y1 - y2) * (x3 - x4);
  if (Math.abs(den) < 1e-9) return null;
  const t = ((x1 - x3) * (y3 - y4) - (y1 - y3) * (x3 - x4)) / den, u = -((x1 - x2) * (y1 - y3) - (y1 - y2) * (x1 - x3)) / den;
  return t > 0.02 && t < 0.98 && u > 0.02 && u < 0.98 ? [x1 + t * (x2 - x1), y1 + t * (y2 - y1)] : null;
}
function bridges(strokes) {
  const S = strokes.flatMap((pl, si) => pl.slice(1).map((p, i) => [si, pl[i], p])), res = [];
  strokes.forEach((pl, si) => {
    for (const end of [pl[0], pl[pl.length - 1]]) if (S.some(([sj, a, b]) => sj !== si && nearSeg(end, a, b) < 0.05)) res.push([si, end]);
    if (pl.length > 2 && pl[0][0] === pl.at(-1)[0] && pl[0][1] === pl.at(-1)[1]) {
      const mids = pl.slice(1).map((p, i) => [(pl[i][0] + p[0]) / 2, (pl[i][1] + p[1]) / 2]);
      const a = mids.reduce((m, q) => (q[1] < m[1] || (q[1] === m[1] && q[0] < m[0]) ? q : m));
      const b = mids.reduce((m, q) => (Math.hypot(q[0] - a[0], q[1] - a[1]) > Math.hypot(m[0] - a[0], m[1] - a[1]) ? q : m));
      res.push([si, a], [si, b]);
    }
  });
  S.forEach(([si, a, b], i) => S.slice(i + 1).forEach(([sj, c, d]) => { if (sj !== si) { const p = cross(a, b, c, d); if (p) res.push([Math.max(si, sj), p]); } }));
  return res;
}
function glyph(strokes, sc, w, color, ox, oy, cut) {
  const B = cut ? bridges(strokes) : [];
  return strokes.map((pl, si) => {
    if (!pl.length) return '';
    const d = 'M' + pl.map(([x, y]) => `${f(ox + x * sc)} ${f(oy + y * sc)}`).join('L');
    const holes = B.filter(([sj]) => sj === si);
    const base = `d="${d}" fill="none" stroke="${color}" stroke-width="${f(w)}" stroke-linecap="square" stroke-linejoin="miter"`;
    if (!holes.length) return `<path ${base}/>`;
    const m = id('kt-m'), r = w / 2 + w * 0.45;
    return `<mask id="${m}" maskUnits="userSpaceOnUse"><rect x="-1e4" y="-1e4" width="2e4" height="2e4" fill="#fff"/>${holes.map(([, [px, py]]) => `<rect x="${f(ox + px * sc - r)}" y="${f(oy + py * sc - r)}" width="${f(2 * r)}" height="${f(2 * r)}" fill="#000"/>`).join('')}</mask><path ${base} mask="url(#${m})"/>`;
  }).join('');
}
/** 拉丁、数字一行（cap 高 = size）。小于 20 不断桥，可读性优先。 */
export function stencil(text, { x = 0, y = 0, size = 24, color = THEME.ink, track = 0.35, weight = 0.16 } = {}) {
  const sc = size / 8, cut = size >= 20; let cx = x, out = '';
  for (const ch of String(text).toUpperCase()) { out += glyph(G.lat[ch] ?? [], sc, size * weight, color, cx, y, cut); cx += ((G.width[ch] ?? 6) + 6 * track) * sc; }
  return out;
}
export const stencilWidth = (text, size = 24, track = 0.35) => [...String(text).toUpperCase()].reduce((a, ch) => a + ((G.width[ch] ?? 6) + 6 * track) * (size / 8), 0);
/** 单个汉字（12 网格，字框 = size）。 */
export function kanji(ch, { x = 0, y = 0, size = 64, color = THEME.ink } = {}) {
  return glyph(G.kan[ch] ?? [], size / 12, size * (G.weightK[ch] ?? 0.115), color, x, y, true);
}

// ---------- 部件 ----------
/** 四角括号框（锁定框、面板框都用它）。len：角的边长。 */
export function brackets({ x, y, w, h, len = 12, color = THEME.ink, sw = 1.5 }) {
  const p = (d) => `<path d="${d}" fill="none" stroke="${color}" stroke-width="${sw}" stroke-linecap="square"/>`;
  return p(`M${x} ${y + len}V${y}H${x + len}`) + p(`M${x + w - len} ${y}H${x + w}V${y + len}`) + p(`M${x + w} ${y + h - len}V${y + h}H${x + w - len}`) + p(`M${x + len} ${y + h}H${x}V${y + h - len}`);
}
/** 斜纹警示带。 */
export function hazard({ x, y, w, h, color = THEME.key, step = 10, sw }) {
  const c = id('kt-c'); sw ??= step * 0.45;
  let l = ''; for (let i = -h; i < w + h; i += step) l += `<path d="M${f(x + i)} ${f(y + h)}L${f(x + i + h)} ${f(y)}"/>`;
  return `<clipPath id="${c}"><rect x="${x}" y="${y}" width="${w}" height="${h}"/></clipPath><g clip-path="url(#${c})" stroke="${color}" stroke-width="${f(sw)}">${l}</g>`;
}
/**
 * 刻度带（像高度表、速度表）：value 在中间，上下（vertical）或左右滚动。
 * step：每格的值；major：几格一个大刻度并标数字；pointer：中间的指针用关键色。
 */
export function tape({ x, y, w, h, value, step = 10, major = 5, pxPerStep = 12, vertical = true, color = THEME.ink, key = THEME.key, digits = 0, label }) {
  const c = id('kt-c'), span = (vertical ? h : w) / 2 / pxPerStep, first = Math.ceil((value - span * step) / step);
  let ticks = '';
  for (let i = first; i * step <= value + span * step; i++) {
    const v = i * step, off = ((v - value) / step) * pxPerStep, big = i % major === 0, L = big ? 14 : 7;
    if (vertical) {
      const ty = y + h / 2 - off;
      ticks += `<rect x="${x + w - L}" y="${f(ty - 0.5)}" width="${L}" height="1" fill="${color}" fill-opacity="${big ? 0.9 : 0.5}"/>`;
      if (big && Math.abs(off) > 18) ticks += sevenSeg(v.toFixed(digits), { x: x + 6, y: ty - 6, h: 12, color, ghost: 0, skew: 6 });
    } else {
      const tx = x + w / 2 + off;
      ticks += `<rect x="${f(tx - 0.5)}" y="${y + h - L}" width="1" height="${L}" fill="${color}" fill-opacity="${big ? 0.9 : 0.5}"/>`;
      if (big && Math.abs(off) > 24) { const s = v.toFixed(digits); ticks += sevenSeg(s, { x: tx - sevenSegWidth(s, 11) / 2, y: y + 6, h: 11, color, ghost: 0, skew: 6 }); }
    }
  }
  const ptr = vertical
    ? `<path d="M${x + w} ${y + h / 2}l-10 -6v12z" fill="${key}"/><rect x="${x}" y="${f(y + h / 2 - 13)}" width="${w - 12}" height="26" fill="${THEME.bg}" stroke="${key}"/>` + sevenSeg(value.toFixed(digits), { x: x + 5, y: y + h / 2 - 8, h: 16, color: key, ghost: 0 })
    : `<path d="M${x + w / 2} ${y + h}l-6 -10h12z" fill="${key}"/>`;
  const lab = label ? stencil(label, { x: vertical ? x : x, y: vertical ? y - 16 : y - 16, size: 9, color: THEME.dim }) : '';
  return `<clipPath id="${c}"><rect x="${x}" y="${y}" width="${w}" height="${h}"/></clipPath><rect x="${x + .5}" y="${y + .5}" width="${w - 1}" height="${h - 1}" fill="none" stroke="${color}" stroke-opacity=".25"/><g clip-path="url(#${c})">${ticks}</g>${ptr}${lab}`;
}
/** 准星：断开的外圈 + 刻度环 + 十字，中间留空。lock=true 时外圈和中心点用关键色。 */
export function reticle({ cx, cy, r = 60, color = THEME.ink, key = THEME.key, lock = false, ticks = 36 }) {
  const c = lock ? key : color, gapDeg = 14;
  let arcs = '';
  for (let q = 0; q < 4; q++) {
    const a0 = ((q * 90 + gapDeg / 2) * Math.PI) / 180, a1 = (((q + 1) * 90 - gapDeg / 2) * Math.PI) / 180;
    arcs += `<path d="M${f(cx + r * Math.cos(a0))} ${f(cy + r * Math.sin(a0))}A${r} ${r} 0 0 1 ${f(cx + r * Math.cos(a1))} ${f(cy + r * Math.sin(a1))}" fill="none" stroke="${c}" stroke-width="2"/>`;
  }
  let tk = '';
  for (let i = 0; i < ticks; i++) { const a = (i / ticks) * 2 * Math.PI, L = i % 9 === 0 ? 8 : 4; tk += `<path d="M${f(cx + (r - 6) * Math.cos(a))} ${f(cy + (r - 6) * Math.sin(a))}L${f(cx + (r - 6 - L) * Math.cos(a))} ${f(cy + (r - 6 - L) * Math.sin(a))}" stroke="${color}" stroke-opacity=".5"/>`; }
  const g = r * 0.28, line = (d) => `<path d="${d}" stroke="${color}" stroke-width="1.25"/>`;
  return arcs + tk + line(`M${cx - r - 14} ${cy}H${cx - g}M${cx + g} ${cy}H${cx + r + 14}M${cx} ${cy - r - 14}V${cy - g}M${cx} ${cy + g}V${cy + r + 14}`) + `<rect x="${cx - 2}" y="${cy - 2}" width="4" height="4" fill="${c}"/>`;
}
/** 分段弧形仪表：from/to 是角度（0 朝右，顺时针），value 0–1，超过 warn 的段用关键色。 */
export function arcGauge({ cx, cy, r = 70, from = 150, to = 390, value = 0.6, segments = 24, width = 12, warn = 0.8, color = THEME.ink, key = THEME.key, label, readout }) {
  let s = '';
  const step = (to - from) / segments, gap = step * 0.22;
  for (let i = 0; i < segments; i++) {
    const a0 = ((from + i * step + gap / 2) * Math.PI) / 180, a1 = ((from + (i + 1) * step - gap / 2) * Math.PI) / 180, ri = r - width;
    const pt = (rr, a) => `${f(cx + rr * Math.cos(a))} ${f(cy + rr * Math.sin(a))}`;
    const on = (i + 0.5) / segments <= value, hot = (i + 0.5) / segments > warn;
    s += `<path d="M${pt(r, a0)}A${r} ${r} 0 0 1 ${pt(r, a1)}L${pt(ri, a1)}A${ri} ${ri} 0 0 0 ${pt(ri, a0)}Z" fill="${hot ? key : color}" fill-opacity="${on ? 1 : 0.1}"/>`;
  }
  if (readout != null) s += sevenSeg(readout, { x: cx - sevenSegWidth(readout, r * 0.4) / 2, y: cy - r * 0.2, h: r * 0.4, color, ghost: 0.06 });
  if (label) s += stencil(label, { x: cx - stencilWidth(label, 10) / 2, y: cy + r * 0.38, size: 10, color: THEME.dim });
  return s;
}
/** 读数框：上面一行小号标签，下面七段管数值，右上角代号。 */
export function readout({ x, y, w = 200, label, value, code, unit, color = THEME.ink, key, h = 34 }) {
  const c = key ?? color;
  return `<rect x="${x + .5}" y="${y + .5}" width="${w - 1}" height="${h + 34}" fill="none" stroke="${color}" stroke-opacity=".22"/>` +
    stencil(label, { x: x + 10, y: y + 10, size: 9, color: THEME.dim }) +
    (code ? stencil(code, { x: x + w - 10 - stencilWidth(code, 8), y: y + 10, size: 8, color: THEME.dim }) : '') +
    sevenSeg(value, { x: x + 10, y: y + 26, h: h * 0.9, color: c }) +
    (unit ? stencil(unit, { x: x + w - 10 - stencilWidth(unit, 9), y: y + 26 + h * 0.9 - 9, size: 9, color: THEME.dim }) : '');
}
/** 锁定框：括号框 + 四个方向的短刻度 + 标签。 */
export function lockBox({ x, y, w, h, label, color = THEME.key }) {
  const t = (d) => `<path d="${d}" stroke="${color}" stroke-width="1.5"/>`;
  return brackets({ x, y, w, h, len: Math.min(w, h) * 0.25, color, sw: 2 }) + t(`M${x + w / 2} ${y - 8}V${y - 2}M${x + w / 2} ${y + h + 2}V${y + h + 8}M${x - 8} ${y + h / 2}H${x - 2}M${x + w + 2} ${y + h / 2}H${x + w + 8}`) +
    (label ? `<rect x="${x}" y="${y - 24}" width="${stencilWidth(label, 9) + 10}" height="15" fill="${color}"/>` + stencil(label, { x: x + 5, y: y - 21, size: 9, color: THEME.bg }) : '');
}
/** 整块警告：斜纹边 + 大汉字 + 拉丁副标题。 */
export function alertPlate({ x, y, w, h, kanjiChar, title, sub, color = THEME.key }) {
  return `<rect x="${x + .5}" y="${y + .5}" width="${w - 1}" height="${h - 1}" fill="none" stroke="${color}"/>` + hazard({ x: x + 1, y: y + 1, w: w - 2, h: 14, color }) + hazard({ x: x + 1, y: y + h - 15, w: w - 2, h: 14, color }) +
    kanji(kanjiChar, { x: x + 18, y: y + 28, size: h - 56, color }) + stencil(title, { x: x + h - 20, y: y + 34, size: 26, color }) + (sub ? stencil(sub, { x: x + h - 20, y: y + 72, size: 11, color: THEME.ink }) : '');
}
