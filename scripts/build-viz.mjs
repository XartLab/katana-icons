// SPDX-License-Identifier: MIT
// 数据可视化预览：preview/viz.html（纸底 + 暗底），样本数据用固定种子生成，每次一样。
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import * as V from '../packages/viz/src/index.js';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
let seed = 7; const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
const walk = (n, v0, vol) => { let v = v0; return Array.from({ length: n }, () => (v = +(v * (1 + (rnd() - 0.48) * vol)).toFixed(2))); };
const days = Array.from({ length: 30 }, (_, i) => `11-${String(i + 1).padStart(2, '0')}`);
const ohlc = (() => { let c = 24.6; return days.map(() => { const o = c; c = +(o * (1 + (rnd() - 0.48) * 0.05)).toFixed(2); return [o, +(Math.max(o, c) * (1 + rnd() * 0.015)).toFixed(2), +(Math.min(o, c) * (1 - rnd() * 0.015)).toFixed(2), c]; }); })();
const sectors = ['半导体', '券商', '银行', '白酒', '光伏', '医药', '有色', '军工', '传媒', '地产', '煤炭', '汽车'];
const mid = 24.8, bids = Array.from({ length: 20 }, (_, i) => [+(mid - 0.01 - i * 0.01).toFixed(2), Math.round(200 + rnd() * 1800)]);
const asks = Array.from({ length: 20 }, (_, i) => [+(mid + 0.01 + i * 0.01).toFixed(2), Math.round(200 + rnd() * 1800)]);

const board = (dark) => `<section class="ktv${dark ? ' ktv-dark' : ''}" style="background:var(--ktv-surface);padding:24px;display:grid;grid-template-columns:repeat(2,max-content);gap:28px 40px">
  <div style="display:flex;gap:8px;grid-column:1/-1">
    ${V.statTile({ label: '上证指数', value: 3381.6, delta: 27.4, deltaPct: 0.82, spark: walk(40, 3350, 0.006) })}
    ${V.statTile({ label: '持仓市值', value: 1284300, delta: -18600, deltaPct: -1.43, spark: walk(40, 1300000, 0.01).reverse() })}
    ${V.statTile({ label: '当日成交', value: '37 笔' })}
    <div class="ktv-stat"><div class="ktv-stat-label">迷你走势</div>${V.sparkline({ values: walk(30, 10, 0.03) })}${V.sparkline({ values: walk(30, 10, 0.03).reverse() })}</div>
  </div>
  <div><div class="ktv-stat-label" style="margin-bottom:6px">K 线（日）</div>${V.candles({ ohlc, labels: days })}</div>
  <div><div class="ktv-stat-label" style="margin-bottom:6px">三只自选的收盘价</div>${V.line({ labels: days, series: [{ name: '中芯国际', values: walk(30, 82, 0.03) }, { name: '宁德时代', values: walk(30, 74, 0.025) }, { name: '贵州茅台', values: walk(30, 68, 0.015) }] })}</div>
  <div><div class="ktv-stat-label" style="margin-bottom:6px">近 12 个月盈亏</div>${V.bars({ items: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'].map((m) => ({ label: m + '月', value: Math.round((rnd() - 0.42) * 60000) })) })}</div>
  <div><div class="ktv-stat-label" style="margin-bottom:6px">盘口深度</div>${V.depth({ bids, asks })}</div>
  <div style="grid-column:1/-1"><div class="ktv-stat-label" style="margin-bottom:6px">板块涨跌</div>${V.heatmap({ cells: sectors.map((s) => ({ label: s, value: +((rnd() - 0.5) * 6).toFixed(2) })) })}</div>
</section>`;

const hover = fs.readFileSync(path.join(root, 'packages/viz/src/hover.js'), 'utf8').replace(/^export /m, '');
const html = `<!doctype html><meta charset=utf-8><title>KATANA viz</title>
<link rel=stylesheet href="../packages/viz/viz.css"><link rel=stylesheet href="../packages/fonts/fonts.css"><link rel=stylesheet href="../packages/fonts/roles.css">
<style>body{margin:0}</style>${board(false)}${board(true)}
<script>${hover}
for (const r of document.querySelectorAll('.ktv')) attachHover(r);
// 自检：?probe 时在第一张折线图中间合成一次指针移动，截图里能看到十字线和提示
if (location.search.includes('probe')) {
  const svg = document.querySelector('svg[data-ktv-line]'), b = svg.getBoundingClientRect();
  svg.dispatchEvent(new PointerEvent('pointermove', { bubbles: true, clientX: b.left + b.width * 0.45, clientY: b.top + b.height / 2 }));
}
</script>`;
fs.mkdirSync(path.join(root, 'preview'), { recursive: true });
fs.writeFileSync(path.join(root, 'preview/viz.html'), html);
console.log('preview/viz.html');
