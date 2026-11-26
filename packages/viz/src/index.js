// SPDX-License-Identifier: MIT
// KATANA 数据可视化：纯函数，输入数据，输出 SVG / HTML 字符串，不依赖任何库，Node 和浏览器都能跑。
// 颜色只写角色（var(--ktv-*)），真正的值来自 viz.css，也就是 KatanaUI 的图表 token。
// 规矩（方法取自 Anthropic dataviz 技能，记号按 KATANA 改）：
// - 细线 1.5px、尖角方头；柱子方头、相邻 2px 底色缝；标记点是方块（跟图标的座舱灯一个语言）。
// - 分类色按固定顺序取 --series-1..7，第 8 个起并进「其他」，不生成新色。
// - 涨跌用 --pnl-up / --pnl-down，并且一定带 ▲▼ 或正负号，不只靠颜色。
// - 朱红只用在「现在」这一个点上：最新价、当前时刻。
// - 一张图一条 y 轴，放在右边（行情软件的习惯）；网格和轴退到后面。
// - 每个记号都带 data-tip，配合 hover.js 出悬停提示；折线图带十字线。

const SERIES = 7;
const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
const r2 = (n) => Math.round(n * 100) / 100;
export const seriesColor = (i) => (i < SERIES ? `var(--ktv-s${i + 1})` : 'var(--ktv-other)');
export const defaultFormat = (v) => {
  const a = Math.abs(v);
  if (a >= 1e8) return r2(v / 1e8) + '亿';
  if (a >= 1e4) return r2(v / 1e4) + '万';
  return a >= 1 || a === 0 ? v.toFixed(2) : v.toPrecision(3); // 价格保留两位，不四舍五入成整数
};
const signed = (v, fmt) => (v > 0 ? '+' : v < 0 ? '−' : '') + fmt(Math.abs(v));
const arrow = (v) => (v > 0 ? '▲' : v < 0 ? '▼' : '■');
const tone = (v) => (v > 0 ? 'up' : v < 0 ? 'down' : 'flat');

// 漂亮的刻度：1、2、2.5、5 × 10^n
export function niceTicks(min, max, count = 4) {
  if (min === max) { min -= 1; max += 1; }
  const raw = (max - min) / count, mag = 10 ** Math.floor(Math.log10(raw));
  const step = [1, 2, 2.5, 5, 10].map((k) => k * mag).find((s) => s >= raw);
  const lo = Math.floor(min / step) * step, hi = Math.ceil(max / step) * step, out = [];
  for (let v = lo; v <= hi + step / 2; v += step) out.push(r2(v));
  return out;
}
const extent = (arr) => [Math.min(...arr), Math.max(...arr)];
const svgOpen = (w, h, label, extra = '') =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}" role="img" aria-label="${esc(label)}"${extra}>`;

// 迷你走势：一条线、一条起点参考虚线、最新点朱红。颜色按最后值相对 base 定涨跌。
export function sparkline({ values, w = 120, h = 32, base = values[0], label = '走势', fmt = defaultFormat } = {}) {
  const [lo0, hi0] = extent([...values, base]), pad = 3;
  const lo = lo0, hi = hi0 === lo0 ? lo0 + 1 : hi0;
  const x = (i) => r2(pad + (i * (w - pad * 2 - 4)) / Math.max(1, values.length - 1));
  const y = (v) => r2(h - pad - ((v - lo) * (h - pad * 2)) / (hi - lo));
  const last = values.at(-1), d = values.map((v, i) => `${i ? 'L' : 'M'}${x(i)} ${y(v)}`).join('');
  const col = last >= base ? 'var(--ktv-up)' : 'var(--ktv-down)';
  const lx = x(values.length - 1), ly = y(last);
  return svgOpen(w, h, `${label} ${fmt(last)}`) +
    `<line class="ktv-ref" x1="0" x2="${w}" y1="${y(base)}" y2="${y(base)}"/>` +
    `<path class="ktv-line" d="${d}" stroke="${col}"/>` +
    `<rect class="ktv-now" x="${r2(lx - 2)}" y="${r2(ly - 2)}" width="4" height="4" data-tip="${esc(label)}|${esc(fmt(last))}"/></svg>`;
}

// 折线：多条序列共用一条 y 轴（右边）。≥2 条有图例；≤4 条在线尾直接标名字。单序列的最新点用朱红。
export function line({ series, labels, w = 560, h = 220, fmt = defaultFormat, title = '折线图', legend = true } = {}) {
  const named = series.length > 1 && series.length <= 4; // 线尾标名字，右边多留一栏
  const padL = 8, padR = named ? 112 : 52, padT = 10, padB = 22, iw = w - padL - padR, ih = h - padT - padB;
  const all = series.flatMap((s) => s.values), ticks = niceTicks(...extent(all));
  const lo = ticks[0], hi = ticks.at(-1), n = labels.length;
  const x = (i) => r2(padL + (i * iw) / Math.max(1, n - 1)), y = (v) => r2(padT + ih - ((v - lo) * ih) / (hi - lo));
  let s = '';
  for (const t of ticks) s += `<line class="ktv-grid" x1="${padL}" x2="${padL + iw}" y1="${y(t)}" y2="${y(t)}"/><text class="ktv-tick" x="${padL + iw + 6}" y="${y(t) + 3.5}">${esc(fmt(t))}</text>`;
  s += `<line class="ktv-base" x1="${padL}" x2="${padL + iw}" y1="${padT + ih}" y2="${padT + ih}"/>`;
  const every = Math.ceil(n / 6);
  labels.forEach((l, i) => { if (i % every === 0 || i === n - 1) s += `<text class="ktv-tick" x="${x(i)}" y="${h - 6}" text-anchor="${i === 0 ? 'start' : i === n - 1 ? 'end' : 'middle'}">${esc(l)}</text>`; });
  series.forEach((se, k) => {
    s += `<path class="ktv-line" d="${se.values.map((v, i) => `${i ? 'L' : 'M'}${x(i)} ${y(v)}`).join('')}" stroke="${seriesColor(k)}"/>`;
  });
  if (series.length === 1) { const v = series[0].values.at(-1); s += `<rect class="ktv-now" x="${x(n - 1) - 2}" y="${y(v) - 2}" width="4" height="4"/>`; }
  else if (series.length <= 4) {
    // 线尾标名字，按 y 排开避免重叠
    const ends = series.map((se, k) => ({ k, y: y(se.values.at(-1)) })).sort((a, b) => a.y - b.y);
    for (let i = 1; i < ends.length; i++) ends[i].y = Math.max(ends[i].y, ends[i - 1].y + 11);
    for (const e of ends) {
      const ly = y(series[e.k].values.at(-1));
      s += `<rect x="${x(n - 1) - 2}" y="${ly - 2}" width="4" height="4" fill="${seriesColor(e.k)}"/>` +
        `<path d="M${padL + iw + 48} ${r2(ly)}L${padL + iw + 54} ${r2(e.y)}" stroke="var(--ktv-axis)" stroke-width="1" fill="none"/>` +
        `<text class="ktv-label" x="${padL + iw + 58}" y="${r2(e.y + 3.5)}">${esc(series[e.k].name)}</text>`;
    }
  }
  const data = { labels, series: series.map((se, k) => ({ name: se.name, color: seriesColor(k), values: se.values.map((v) => fmt(v)) })), x0: padL, x1: padL + iw, y0: padT, y1: padT + ih };
  const leg = legend && series.length > 1
    ? `<div class="ktv-legend">${series.map((se, k) => `<span><i style="background:${seriesColor(k)}"></i>${esc(se.name)}</span>`).join('')}</div>` : '';
  return `${leg}${svgOpen(w, h, title, ` data-ktv-line='${esc(JSON.stringify(data))}'`)}${s}</svg>`;
}

// 柱状：有负值就按涨跌着色并画零线，否则用分类色 1。只标最大和最小的数，不在每根柱子上写数。
export function bars({ items, w = 560, h = 200, fmt = defaultFormat, title = '柱状图', gap = 2 } = {}) {
  const padL = 8, padR = 52, padT = 14, padB = 22, iw = w - padL - padR, ih = h - padT - padB;
  const vals = items.map((d) => d.value), neg = vals.some((v) => v < 0);
  const ticks = niceTicks(Math.min(0, ...vals), Math.max(0, ...vals)), lo = ticks[0], hi = ticks.at(-1);
  const y = (v) => r2(padT + ih - ((v - lo) * ih) / (hi - lo)), bw = iw / items.length;
  const iMax = vals.indexOf(Math.max(...vals)), iMin = vals.indexOf(Math.min(...vals));
  let s = '';
  for (const t of ticks) s += `<line class="ktv-grid" x1="${padL}" x2="${padL + iw}" y1="${y(t)}" y2="${y(t)}"/><text class="ktv-tick" x="${padL + iw + 6}" y="${y(t) + 3.5}">${esc(fmt(t))}</text>`;
  items.forEach((d, i) => {
    const x0 = r2(padL + i * bw + gap / 2), wd = r2(Math.max(1, bw - gap)), top = y(Math.max(0, d.value)), bot = y(Math.min(0, d.value));
    const col = neg ? (d.value >= 0 ? 'var(--ktv-up)' : 'var(--ktv-down)') : 'var(--ktv-s1)';
    const tip = `${esc(d.label)}|${esc(neg ? signed(d.value, fmt) : fmt(d.value))}`;
    s += `<rect x="${x0}" y="${top}" width="${wd}" height="${r2(Math.max(1, bot - top))}" fill="${col}"/>`;
    s += `<rect x="${r2(padL + i * bw)}" y="${padT}" width="${r2(bw)}" height="${ih}" fill="transparent" data-tip="${tip}"/>`; // 命中区比柱子大
    if (i === iMax || (neg && i === iMin)) {
      const above = d.value >= 0;
      // 负值的数写在柱子下面；挨着底边放不下就写进柱子里（用底色字）
      const inside = !above && bot + 11 > padT + ih - 2;
      s += `<text class="ktv-label" x="${r2(x0 + wd / 2)}" y="${above ? top - 4 : inside ? bot - 4 : bot + 11}" text-anchor="middle"${inside ? ' fill="var(--ktv-surface)" style="fill:var(--ktv-surface)"' : ''}>${esc(neg ? signed(d.value, fmt) : fmt(d.value))}</text>`;
    }
    if (items.length <= 16) s += `<text class="ktv-tick" x="${r2(x0 + wd / 2)}" y="${h - 6}" text-anchor="middle">${esc(d.label)}</text>`;
  });
  s += `<line class="ktv-base" x1="${padL}" x2="${padL + iw}" y1="${y(0)}" y2="${y(0)}"/>`;
  return svgOpen(w, h, title) + s + '</svg>';
}

// 热力格：板块涨跌这类有正负的用涨跌两色按幅度调深浅（发散，零是底色）；全是正数的用墨色一色深浅（顺序）。
export function heatmap({ cells, cols = 6, cw = 84, ch = 44, gap = 2, fmt = (v) => v.toFixed(2) + '%', max, title = '热力图' } = {}) {
  const vals = cells.map((c) => c.value), neg = vals.some((v) => v < 0);
  const m = max ?? Math.max(...vals.map(Math.abs)), rows = Math.ceil(cells.length / cols);
  const w = cols * cw, h = rows * ch;
  let s = '';
  cells.forEach((c, i) => {
    const x0 = (i % cols) * cw, y0 = Math.floor(i / cols) * ch, k = Math.min(1, Math.abs(c.value) / m);
    const level = Math.round(k * 5); // 6 档，档位比连续深浅好读
    const pct = [6, 18, 34, 52, 72, 90][level];
    const base = neg ? (c.value >= 0 ? 'var(--ktv-up)' : 'var(--ktv-down)') : 'var(--ktv-ink)';
    const fg = level >= 3 ? 'var(--ktv-surface)' : 'var(--ktv-ink)';
    const v = neg ? signed(c.value, fmt) : fmt(c.value);
    s += `<g data-tip="${esc(c.label)}|${esc(v)}"><rect x="${x0 + gap / 2}" y="${y0 + gap / 2}" width="${cw - gap}" height="${ch - gap}" fill="color-mix(in srgb, ${base} ${pct}%, var(--ktv-surface))"/>` +
      `<text x="${x0 + 8}" y="${y0 + 17}" fill="${fg}">${esc(c.label)}</text><text x="${x0 + 8}" y="${y0 + ch - 9}" fill="${fg}" font-weight="500">${esc(v)}</text></g>`;
  });
  return svgOpen(w, h, title) + s + '</svg>';
}

// K 线：实体 + 影线，涨实心涨色、跌实心跌色，蜡烛之间 2px 缝；右轴；最后一根收盘价画一条朱红短标。
export function candles({ ohlc, labels = [], w = 560, h = 220, fmt = defaultFormat, title = 'K 线' } = {}) {
  const padL = 8, padR = 52, padT = 10, padB = 22, iw = w - padL - padR, ih = h - padT - padB;
  const ticks = niceTicks(Math.min(...ohlc.map((c) => c[2])), Math.max(...ohlc.map((c) => c[1]))), lo = ticks[0], hi = ticks.at(-1);
  const y = (v) => r2(padT + ih - ((v - lo) * ih) / (hi - lo)), bw = iw / ohlc.length;
  let s = '';
  for (const t of ticks) s += `<line class="ktv-grid" x1="${padL}" x2="${padL + iw}" y1="${y(t)}" y2="${y(t)}"/><text class="ktv-tick" x="${padL + iw + 6}" y="${y(t) + 3.5}">${esc(fmt(t))}</text>`;
  ohlc.forEach(([o, hh, l, c], i) => {
    const cx = r2(padL + i * bw + bw / 2), col = c >= o ? 'var(--ktv-up)' : 'var(--ktv-down)', wd = r2(Math.max(1, bw - 2));
    const tip = `${esc(labels[i] ?? i + 1)}|开 ${fmt(o)} 高 ${fmt(hh)} 低 ${fmt(l)} 收 ${fmt(c)}`;
    s += `<g data-tip="${esc(tip)}"><line x1="${cx}" x2="${cx}" y1="${y(hh)}" y2="${y(l)}" stroke="${col}" stroke-width="1" shape-rendering="crispEdges"/>` +
      `<rect x="${r2(cx - wd / 2)}" y="${y(Math.max(o, c))}" width="${wd}" height="${r2(Math.max(1, Math.abs(y(o) - y(c))))}" fill="${col}"/>` +
      `<rect x="${r2(padL + i * bw)}" y="${padT}" width="${r2(bw)}" height="${ih}" fill="transparent"/></g>`;
  });
  const last = ohlc.at(-1)[3];
  s += `<line x1="${padL}" x2="${padL + iw}" y1="${y(last)}" y2="${y(last)}" stroke="var(--ktv-now)" stroke-width="1" stroke-dasharray="1 3"/>` +
    `<rect x="${padL + iw + 2}" y="${y(last) - 7}" width="48" height="14" fill="var(--ktv-now)"/><text x="${padL + iw + 6}" y="${y(last) + 3.5}" fill="#fff">${esc(fmt(last))}</text>`;
  return svgOpen(w, h, title) + s + '</svg>';
}

// 深度图：买卖两边累计量的台阶面积，中间价一条朱红竖线。
export function depth({ bids, asks, w = 560, h = 180, fmt = defaultFormat, title = '深度' } = {}) {
  const padL = 8, padR = 52, padT = 10, padB = 22, iw = w - padL - padR, ih = h - padT - padB;
  const cum = (arr) => { let t = 0; return arr.map(([p, q]) => [p, (t += q)]); };
  const B = cum([...bids].sort((a, b) => b[0] - a[0])), A = cum([...asks].sort((a, b) => a[0] - b[0]));
  const pLo = B.at(-1)[0], pHi = A.at(-1)[0], qHi = Math.max(B.at(-1)[1], A.at(-1)[1]);
  const ticks = niceTicks(0, qHi), x = (p) => r2(padL + ((p - pLo) * iw) / (pHi - pLo)), y = (q) => r2(padT + ih - (q * ih) / ticks.at(-1));
  const step = (pts, dir) => {
    let d = `M${x(pts[0][0])} ${y(0)}`;
    pts.forEach(([p, q], i) => { d += `V${y(q)}`; const nx = pts[i + 1]?.[0] ?? p; d += `H${x(nx)}`; });
    return d + `V${y(0)}Z`;
  };
  let s = '';
  for (const t of ticks) s += `<line class="ktv-grid" x1="${padL}" x2="${padL + iw}" y1="${y(t)}" y2="${y(t)}"/><text class="ktv-tick" x="${padL + iw + 6}" y="${y(t) + 3.5}">${esc(fmt(t))}</text>`;
  for (const [pts, col, side] of [[B, 'var(--ktv-up)', '买'], [A, 'var(--ktv-down)', '卖']]) {
    s += `<path d="${step(pts)}" fill="color-mix(in srgb, ${col} 16%, transparent)" stroke="${col}" stroke-width="1.5" stroke-linejoin="miter"/>`;
    pts.forEach(([p, q]) => { s += `<rect x="${x(p) - 3}" y="${padT}" width="6" height="${ih}" fill="transparent" data-tip="${side} ${esc(fmt(p))}|累计 ${esc(fmt(q))}"/>`; });
  }
  const mid = (B[0][0] + A[0][0]) / 2;
  s += `<line x1="${x(mid)}" x2="${x(mid)}" y1="${padT}" y2="${padT + ih}" stroke="var(--ktv-now)" stroke-width="1"/>` +
    `<text class="ktv-tick" x="${padL}" y="${h - 6}">${esc(fmt(pLo))}</text><text class="ktv-label" x="${x(mid)}" y="${h - 6}" text-anchor="middle">${esc(fmt(mid))}</text>` +
    `<text class="ktv-tick" x="${padL + iw}" y="${h - 6}" text-anchor="end">${esc(fmt(pHi))}</text><line class="ktv-base" x1="${padL}" x2="${padL + iw}" y1="${y(0)}" y2="${y(0)}"/>`;
  return svgOpen(w, h, title) + s + '</svg>';
}

// 数字卡：一个标题数字，不画图也行。涨跌带 ▲▼ 和正负号。
export function statTile({ label, value, delta, deltaPct, spark, fmt = defaultFormat } = {}) {
  const dv = deltaPct ?? delta;
  const d = dv == null ? '' :
    `<div class="ktv-stat-delta" data-tone="${tone(dv)}"><b>${arrow(dv)} ${esc(delta != null ? signed(delta, fmt) : '')}${deltaPct != null ? ` ${esc(signed(deltaPct, (v) => v.toFixed(2)))}%` : ''}</b></div>`;
  return `<div class="ktv-stat"><div class="ktv-stat-label">${esc(label)}</div><div class="ktv-stat-value">${esc(typeof value === 'number' ? fmt(value) : value)}</div>${d}${spark ? sparkline({ values: spark, w: 140, h: 28, label }) : ''}</div>`;
}

// 表格视图：每张图都该有一份，色盲、打印、读屏用。
export function table({ columns, rows, caption } = {}) {
  return `<table class="ktv-table">${caption ? `<caption>${esc(caption)}</caption>` : ''}<thead><tr>${columns.map((c) => `<th>${esc(c)}</th>`).join('')}</tr></thead><tbody>${rows.map((r) => `<tr>${r.map((v) => `<td>${esc(v)}</td>`).join('')}</tr>`).join('')}</tbody></table>`;
}
