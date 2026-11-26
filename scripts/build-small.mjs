// SPDX-License-Identifier: MIT
// KATANA 小图标：line/small/defs.mjs → 静态 SVG、React 组件（lucide 同名导出）、预览页。
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const { default: DEFS } = await import(pathToFileURL(path.join(root, 'line/small/defs.mjs')));
const SHU = '#A8322D';
const rects = (a = [], fill) => a.map((r) => `<rect x="${r.x}" y="${r.y}" width="${r.w}" height="${r.h}" fill="${fill}" stroke="none"/>`).join('');
const inner = (def, lit = true) =>
  (def.d ? `<path d="${def.d}"/>` : '') + rects(def.fill, 'currentColor') + rects(def.lit, lit ? 'var(--katana-shu,' + SHU + ')' : 'currentColor');
const svg = (def, size = 24, lit = true) =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="${size}" height="${size}" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="square" stroke-linejoin="miter">${inner(def, lit)}</svg>`;

const names = Object.keys(DEFS).sort();
const sdir = path.join(root, 'packages/static/svg/small');
fs.rmSync(sdir, { recursive: true, force: true });
fs.mkdirSync(sdir, { recursive: true });
for (const n of names) fs.writeFileSync(path.join(sdir, `${n}.svg`), svg(DEFS[n]) + '\n');

const pascal = (n) => n.split('-').map((p) => p[0].toUpperCase() + p.slice(1)).join('');
const data = Object.fromEntries(names.map((n) => [n, { d: DEFS[n].d, fill: DEFS[n].fill ?? [], lit: DEFS[n].lit ?? [] }]));
const rdir = path.join(root, 'packages/react/src/small');
fs.mkdirSync(rdir, { recursive: true });
fs.writeFileSync(path.join(rdir, 'index.js'), `// SPDX-License-Identifier: MIT
// 生成文件：scripts/build-small.mjs，别手改。
import { createElement as h, forwardRef } from 'react'
const DATA = ${JSON.stringify(data)}
const rect = (r, fill, i) => h('rect', { key: i, x: r.x, y: r.y, width: r.w, height: r.h, fill, stroke: 'none' })
export function createSmallIcon(name) {
  const def = DATA[name]
  const C = forwardRef(function KatanaSmallIcon({ size = 16, strokeWidth = 1.5, lit = true, title, color = 'currentColor', ...rest }, ref) {
    return h('svg', { ref, xmlns: 'http://www.w3.org/2000/svg', viewBox: '0 0 24 24', width: size, height: size, fill: 'none', stroke: color,
      strokeWidth, strokeLinecap: 'square', strokeLinejoin: 'miter', 'aria-hidden': title ? undefined : true, role: title ? 'img' : undefined, 'data-kti': name, ...rest },
      title ? h('title', null, title) : null,
      def.d ? h('path', { d: def.d }) : null,
      ...def.fill.map((r, i) => rect(r, color, 'f' + i)),
      ...def.lit.map((r, i) => rect(r, lit ? 'var(--katana-shu, ${SHU})' : color, 'l' + i)))
  })
  C.displayName = 'Small(' + name + ')'
  return C
}
export const smallIconNames = ${JSON.stringify(names)}
${names.map((n) => `export const ${pascal(n)} = createSmallIcon('${n}')\nexport const ${pascal(n)}Icon = ${pascal(n)}`).join('\n')}
`);
fs.writeFileSync(path.join(rdir, 'index.d.ts'), `// 生成文件：scripts/build-small.mjs
import type { ForwardRefExoticComponent, RefAttributes, SVGProps } from 'react'
export interface SmallIconProps extends Omit<SVGProps<SVGSVGElement>, 'ref'> { size?: number | string; strokeWidth?: number | string; lit?: boolean; title?: string; color?: string }
export type SmallIcon = ForwardRefExoticComponent<SmallIconProps & RefAttributes<SVGSVGElement>>
export declare function createSmallIcon(name: string): SmallIcon
export declare const smallIconNames: string[]
${names.map((n) => `export declare const ${pascal(n)}: SmallIcon\nexport declare const ${pascal(n)}Icon: SmallIcon`).join('\n')}
`);

// 预览：对照 Kubai 原样，16/24，亮底暗底
const kub = (n) => { const p = path.join(root, 'packages/static/svg/general/outline', `${n}.svg`); return fs.existsSync(p) ? fs.readFileSync(p, 'utf8').replace('<svg ', '<svg width="24" height="24" ') : '<i></i>'; };
const cell = (n) => `<div class=c><div class=g>${kub(n)}${svg(DEFS[n], 24)}${svg(DEFS[n], 16)}</div><div class=n>${n}<br><b>${DEFS[n].zh}</b></div></div>`;
fs.mkdirSync(path.join(root, 'preview'), { recursive: true });
fs.writeFileSync(path.join(root, 'preview/small.html'), `<!doctype html><meta charset=utf-8><title>KATANA small icons</title><style>
body{margin:0;padding:24px;background:#F1EEE6;color:#2A2A28;font:11px system-ui}.w{display:grid;grid-template-columns:repeat(8,1fr);gap:10px 6px}
.c{padding:6px}.g{display:flex;gap:12px;align-items:center}.g i{width:24px;display:inline-block}.g svg:first-child{opacity:.35}.n{margin-top:4px;color:#6b6a64}.n b{font-weight:500;color:#2A2A28}
.dk{background:#16181D;color:#E6E8EC;margin-top:20px;padding:16px;display:flex;flex-wrap:wrap;gap:14px}</style>
<p>灰：Kubai 原样 ｜ 墨：KATANA 24px ｜ 16px</p><div class=w>${names.map(cell).join('')}</div>
<div class=dk>${names.map((n) => svg(DEFS[n], 16)).join('')}</div>`);
console.log(`small: ${names.length} icons`);
