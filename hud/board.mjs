// 画板：HUD 资产样张 + 一个交易驾驶舱屏幕
import fs from 'node:fs';
import * as H from './hud.mjs';
const { THEME: T } = H;
const W = 1440, o = [];
const zh = (s, x, y, size = 13, op = 0.65, weight = 400, c = T.ink) => `<text x="${x}" y="${y}" font-family="Zen Kaku Gothic New" font-weight="${weight}" font-size="${size}" fill="${c}" fill-opacity="${op}">${s}</text>`;
const rule = (y) => `<path d="M56 ${y}H${W - 56}" stroke="${T.ink}" stroke-opacity=".22"/>`;
const cap = (s, x, y) => H.stencil(s, { x, y, size: 9, color: T.dim });

// 头
o.push(H.stencil('KT HUD', { x: 56, y: 56, size: 56 }));
o.push(H.kanji('機', { x: 1240, y: 36, size: 140, color: T.key }));
o.push(zh('驾驶舱 HUD：一套可复用的资产', 56, 160, 22, 1, 900));
o.push(zh('每样都是参数化函数（hud/hud.mjs），返回 SVG 片段，KatanaUI 里直接拼。只有一种浅灰，锁定、越线、警告才用关键色。', 56, 188));
o.push(rule(214));

// 七段管
let y = 248;
o.push(cap('SEVENSEG · SOLID / OUTLINE / GHOST', 56, y));
o.push(H.sevenSeg('0123456789', { x: 56, y: y + 22, h: 56 }));
o.push(H.sevenSeg('-68420.5', { x: 600, y: y + 22, h: 56, color: T.key }));
o.push(H.sevenSeg('0123456789', { x: 56, y: y + 100, h: 56, mode: 'outline', ghost: 0.12 }));
o.push(H.sevenSeg('12:45:08', { x: 600, y: y + 100, h: 56, mode: 'outline', ghost: 0.12 }));
o.push(H.sevenSeg('BUY HOLD', { x: 1000, y: y + 22, h: 56, ghost: 0.1 }));
o.push(H.sevenSeg('SELL', { x: 1000, y: y + 100, h: 56, ghost: 0.1, color: T.key }));
o.push(rule(y + 182));

// 部件
y += 214;
o.push(cap('TAPE · VERTICAL', 56, y));
o.push(H.tape({ x: 56, y: y + 20, w: 110, h: 260, value: 68420, step: 10, major: 5, label: '' }));
o.push(cap('TAPE · HORIZONTAL', 196, y));
o.push(H.tape({ x: 196, y: y + 20, w: 300, h: 44, value: 1245, step: 5, major: 4, vertical: false, pxPerStep: 14 }));
o.push(cap('BRACKETS · HAZARD', 196, y + 90));
o.push(H.brackets({ x: 196, y: y + 110, w: 300, h: 80 }));
o.push(H.hazard({ x: 196, y: y + 210, w: 300, h: 18, color: T.key }));
o.push(H.hazard({ x: 196, y: y + 240, w: 300, h: 18, color: T.ink, step: 8 }));
o.push(cap('RETICLE', 540, y));
o.push(H.reticle({ cx: 620, cy: y + 120, r: 62 }));
o.push(cap('RETICLE · LOCK', 720, y));
o.push(H.reticle({ cx: 800, cy: y + 120, r: 62, lock: true }));
o.push(cap('ARCGAUGE', 900, y));
o.push(H.arcGauge({ cx: 990, cy: y + 130, r: 80, value: 0.86, readout: '86', label: 'RISK' }));
o.push(cap('READOUT', 1110, y));
o.push(H.readout({ x: 1110, y: y + 20, w: 274, label: 'PNL', code: 'KT-01', value: '1284.50', unit: 'USDT' }));
o.push(H.readout({ x: 1110, y: y + 110, w: 274, label: 'MARGIN RATIO', code: 'KT-02', value: '82.4', unit: '%', key: T.key }));
o.push(cap('LOCKBOX', 540, y + 220));
o.push(H.lockBox({ x: 570, y: y + 272, w: 70, h: 40, label: 'TGT 01' }));
o.push(cap('ALERTPLATE', 720, y + 220));
o.push(H.alertPlate({ x: 720, y: y + 238, w: 360, h: 110, kanjiChar: '止', title: 'STOP', sub: 'TRIGGERED 66900.0' }));
o.push(rule(y + 370));

// 驾驶舱屏幕
y += 400;
o.push(zh('拼起来：交易驾驶舱', 56, y + 6, 20, 1, 900));
o.push(zh('左边价格刻度带，上面时间刻度带，中间 K 线，最后一根被锁定；底下一排读数，右边风险仪表和止损警告。', 56, y + 32));
const fy = y + 56, fx = 56, fw = W - 112, fh = 620;
o.push(`<rect x="${fx}" y="${fy}" width="${fw}" height="${fh}" fill="#0E1111"/>`);
o.push(H.brackets({ x: fx + 8, y: fy + 8, w: fw - 16, h: fh - 16, len: 24, color: T.ink, sw: 1.5 }));
o.push(H.stencil('KATANA · UNIT 01 · BTC-PERP', { x: fx + 30, y: fy + 26, size: 10, color: T.dim }));
o.push(H.sevenSeg('12:45:08', { x: fx + fw - 160, y: fy + 22, h: 18, ghost: 0 }));
o.push(H.tape({ x: fx + 300, y: fy + 52, w: 620, h: 40, value: 1245, step: 5, major: 4, vertical: false, pxPerStep: 16 }));
o.push(H.tape({ x: fx + 30, y: fy + 110, w: 120, h: 340, value: 68420, step: 10, major: 5, pxPerStep: 11 }));
// K 线
let px = fx + 190, last = 68200, seed = 7;
const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
const yOf = (v) => fy + 280 - (v - 68420) * 0.55;
for (let i = 0; i < 34; i++) {
  const open = last, close = open + (rnd() - 0.42) * 90, hi = Math.max(open, close) + rnd() * 40, lo = Math.min(open, close) - rnd() * 40;
  const isLast = i === 33, c = isLast ? T.key : T.ink, up = close > open;
  o.push(`<path d="M${px + 5} ${yOf(hi).toFixed(1)}V${yOf(lo).toFixed(1)}" stroke="${c}" stroke-opacity="${isLast ? 1 : 0.7}"/>`);
  const top = yOf(Math.max(open, close)), bh = Math.max(2, Math.abs(yOf(open) - yOf(close)));
  o.push(up ? `<rect x="${px + 1.5}" y="${top.toFixed(1)}" width="7" height="${bh.toFixed(1)}" fill="none" stroke="${c}" stroke-opacity="${isLast ? 1 : 0.7}"/>` : `<rect x="${px + 1}" y="${top.toFixed(1)}" width="8" height="${bh.toFixed(1)}" fill="${c}" fill-opacity="${isLast ? 1 : 0.7}"/>`);
  if (isLast) { o.push(H.lockBox({ x: px - 14, y: yOf(hi) - 12, w: 38, h: yOf(lo) - yOf(hi) + 24, label: 'LOCK 68420' })); }
  last = close; px += 21;
}
o.push(`<path d="M${fx + 190} ${yOf(66900).toFixed(1)}H${fx + 900}" stroke="${T.key}" stroke-dasharray="6 5"/>`);
o.push(H.stencil('SL 66900.0', { x: fx + 800, y: yOf(66900) + 6, size: 9, color: T.key }));
o.push(H.reticle({ cx: fx + 560, cy: fy + 280, r: 110 }));
// 右侧
o.push(H.arcGauge({ cx: fx + 1150, cy: fy + 200, r: 96, value: 0.82, readout: '82', label: 'MARGIN RISK' }));
o.push(H.alertPlate({ x: fx + 990, y: fy + 330, w: 330, h: 104, kanjiChar: '止', title: 'NEAR SL', sub: 'DIST 1520.0 · 2.2 PCT' }));
// 底部读数
const rs = [['PRICE', '68420.5', 'KT-01', 'USDT'], ['PNL', '1284.50', 'KT-02', 'USDT'], ['QTY', '0.250', 'KT-03', 'BTC'], ['LEV', '10', 'KT-04', 'X'], ['FUNDING', '0.0100', 'KT-05', '%']];
rs.forEach(([l, v, c, u], i) => o.push(H.readout({ x: fx + 30 + i * 266, y: fy + 480, w: 250, label: l, value: v, code: c, unit: u, key: l === 'PNL' ? T.key : undefined })));
const Ht = fy + fh + 40;
const svg = `<svg viewBox="0 0 ${W} ${Ht}" width="${W}" height="${Ht}" xmlns="http://www.w3.org/2000/svg" style="display:block"><rect width="${W}" height="${Ht}" fill="${T.bg}"/>${o.join('')}</svg>`;
const html = `<!doctype html>
<html lang="zh">
<head>
<meta charset="utf-8">
<title>KATANA 驾驶舱 HUD</title>
<script src="./support.js"></script>
</head>
<body>
<x-dc>
<helmet>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Zen+Kaku+Gothic+New:wght@400;900&display=swap" rel="stylesheet">
<style>body{margin:0}</style>
</helmet>
<div style="width:${W}px;height:${Ht}px">${svg}</div>
</x-dc>
</body>
</html>`;
fs.writeFileSync('/home/claude/katana-logo/project/Cockpit.dc.html', html);
fs.writeFileSync('/tmp/cockpit.html', html.replace('<script src="./support.js"></script>', ''));
console.log(Ht);
