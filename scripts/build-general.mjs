// SPDX-License-Identifier: MIT
// 通用图标：KATANAview、KatanaUI 用到的 lucide 图标（line/general/names.txt）换成线性风格。
// 来源：Kubai Icons 的线性图标库 icons-line/（MIT，见 NOTICE），名字对不上的照 map.json 对，
// 库里没有的 6 个是我们自己画的（line/general/own.mjs）。渲染器 line.js / line-motion.js 也来自 Kubai Icons 的
// MIT 包（packages/core），原样放进 vendor/，不改。
//   KUBAI_ICONS=<kubai-icons 仓库路径> node scripts/build-general.mjs
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const kubai = path.resolve(process.env.KUBAI_ICONS ?? path.join(root, '../vendor/kubai-icons'));
const gdir = path.join(root, 'line/general');
const out = path.join(root, 'packages/react/src/general');
const vendor = path.join(out, 'vendor');
fs.mkdirSync(vendor, { recursive: true });

// 1. 渲染器（MIT）原样复制，文件头加出处
const head = '// From Kubai Icons (packages/core/src), MIT License, Copyright (c) 2026 Kubai087 and the Kubai Icons contributors.\n// Copied unchanged into katana-icons; see NOTICE.\n';
for (const f of ['line.js', 'line-motion.js']) fs.writeFileSync(path.join(vendor, f), head + fs.readFileSync(path.join(kubai, 'packages/core/src', f), 'utf8'));
const { lineStill } = await import(pathToFileURL(path.join(vendor, 'line.js')));

// 2. 选图标
const names = fs.readFileSync(path.join(gdir, 'names.txt'), 'utf8').split('\n').map((s) => s.trim()).filter(Boolean);
const map = JSON.parse(fs.readFileSync(path.join(gdir, 'map.json'), 'utf8'));
const { default: OWN } = await import(pathToFileURL(path.join(gdir, 'own.mjs')));
const defs = {}, alias = {}, source = {};
for (const lucide of names) {
  const ours = OWN[lucide] ? lucide : map[lucide] ?? lucide;
  alias[lucide] = ours;
  if (defs[ours]) continue;
  if (OWN[ours]) { defs[ours] = OWN[ours]; source[ours] = 'katana'; continue; }
  const file = path.join(kubai, 'icons-line', `${ours}.json`);
  if (!fs.existsSync(file)) throw new Error(`没有这个图标：${lucide} → ${ours}`);
  const d = JSON.parse(fs.readFileSync(file, 'utf8'));
  defs[ours] = { name: d.name, zh: d.zh, key: d.key, fx: d.fx, ...(d.enter ? { enter: d.enter } : {}), w: d.w };
  source[ours] = 'kubai-icons (MIT)';
}
const ourNames = Object.keys(defs).sort();
const pascal = (n) => n.replace(/(^|-)([a-z0-9])/g, (_, __, c) => c.toUpperCase());

// 3. 组件
fs.writeFileSync(path.join(out, 'defs.js'), `// 生成文件，勿手改：node scripts/build-general.mjs。图标定义来自 Kubai Icons icons-line（MIT）和 KATANA 自绘（MIT）。\nexport default ${JSON.stringify(Object.fromEntries(ourNames.map((n) => [n, defs[n]])))}\n`);
fs.writeFileSync(path.join(out, 'index.js'), `// SPDX-License-Identifier: MIT
// 生成文件，勿手改：node scripts/build-general.mjs
import { createElement, forwardRef, useEffect, useId, useRef } from 'react'
import { lineMarkup, animateLine } from './vendor/line.js'
import DEFS from './defs.js'

const WEIGHT = { light: 1.5, regular: 2, medium: 2.25, bold: 2.5 }
export const generalIconNames = Object.keys(DEFS)

export function createGeneralIcon(name) {
  const def = DEFS[name]
  const C = forwardRef(function GeneralIcon({ size = 24, weight = 'light', strokeWidth, variant = 'outline', animated = false, title, className, ...rest }, ref) {
    const uid = useId().replace(/[^a-zA-Z0-9_-]/g, '')
    const own = useRef(null)
    const s = strokeWidth ?? WEIGHT[weight] ?? 1.5
    const body = lineMarkup(def, { s, variant }).replaceAll('__K__', 'kg' + uid)
    useEffect(() => {
      const svg = own.current
      if (!svg || !animated || !def.fx) return
      const m = animateLine(svg, { line: def }, { variant })
      const host = svg.closest('[data-kti-hover]') ?? svg
      const on = () => m.hover(true), off = () => m.hover(false)
      host.addEventListener('pointerenter', on); host.addEventListener('pointerleave', off)
      return () => { host.removeEventListener('pointerenter', on); host.removeEventListener('pointerleave', off); m.destroy() }
    }, [animated, variant, body])
    return createElement('svg', {
      ref: (el) => { own.current = el; if (typeof ref === 'function') ref(el); else if (ref) ref.current = el },
      xmlns: 'http://www.w3.org/2000/svg', viewBox: '0 0 24 24', width: size, height: size, fill: 'none',
      className: ['kti', 'kti-g', className].filter(Boolean).join(' '),
      role: title ? 'img' : undefined, 'aria-label': title, 'aria-hidden': title ? undefined : true,
      dangerouslySetInnerHTML: { __html: (title ? '<title>' + title.replace(/</g, '&lt;') + '</title>' : '') + body },
      ...rest
    })
  })
  C.displayName = 'General(' + name + ')'
  return C
}
${ourNames.map((n) => `/** ${defs[n].zh ?? n} */\nexport const ${pascal(n)} = createGeneralIcon('${n}')`).join('\n')}
`);
fs.writeFileSync(path.join(out, 'index.d.ts'), `// 生成文件，勿手改：node scripts/build-general.mjs
import type { ForwardRefExoticComponent, RefAttributes, SVGProps } from 'react'
export interface GeneralIconProps extends Omit<SVGProps<SVGSVGElement>, 'ref'> {
  /** 像素尺寸，默认 24 */
  size?: number | string
  /** 字重档：1.5 / 2 / 2.25 / 2.5；默认 light（原研哉：细线） */
  weight?: 'light' | 'regular' | 'medium' | 'bold'
  /** 直接给线宽，优先于 weight */
  strokeWidth?: number
  /** 线性、双色线性、面性、面性填充；默认 outline */
  variant?: 'outline' | 'line-duo' | 'fill' | 'solid-tint'
  /** 悬停自己或带 data-kti-hover 的祖先时播放动效 */
  animated?: boolean
  title?: string
}
export type GeneralIcon = ForwardRefExoticComponent<GeneralIconProps & RefAttributes<SVGSVGElement>>
export type GeneralIconName = ${ourNames.map((n) => `'${n}'`).join(' | ')}
export declare function createGeneralIcon(name: GeneralIconName): GeneralIcon
export declare const generalIconNames: GeneralIconName[]
${ourNames.map((n) => `/** ${defs[n].zh ?? n} */\nexport declare const ${pascal(n)}: GeneralIcon`).join('\n')}
`);
// lucide 同名出口：换掉 lucide 时只改 import 路径
const lucideNames = names.map((l) => [pascal(l), alias[l]]);
fs.writeFileSync(path.join(out, 'lucide.js'), `// 生成文件，勿手改：node scripts/build-general.mjs。lucide 的图标名 → 我们的通用图标，换掉 lucide 时只改 import 路径。
import { createGeneralIcon } from './index.js'
${lucideNames.map(([p, o]) => `export const ${p} = createGeneralIcon('${o}')\nexport const ${p}Icon = ${p}`).join('\n')}
`);
fs.writeFileSync(path.join(out, 'lucide.d.ts'), `// 生成文件，勿手改：node scripts/build-general.mjs
import type { GeneralIcon } from './index'
${lucideNames.map(([p]) => `export declare const ${p}: GeneralIcon\nexport declare const ${p}Icon: GeneralIcon`).join('\n')}
`);

// 4. 静态 SVG：每种变体 light 一档，currentColor
for (const v of ['outline', 'line-duo', 'fill', 'solid-tint']) {
  const dir = path.join(root, 'packages/static/svg/general', v);
  fs.mkdirSync(dir, { recursive: true });
  for (const n of ourNames) fs.writeFileSync(path.join(dir, `${n}.svg`), lineStill(defs[n], { s: 1.5, variant: v, id: `kg-${n}` }));
}
fs.writeFileSync(path.join(gdir, 'sources.json'), JSON.stringify({ alias, source }, null, 1));
console.log(`general: ${names.length} lucide names → ${ourNames.length} icons (${Object.values(source).filter((s) => s === 'katana').length} ours)`);
