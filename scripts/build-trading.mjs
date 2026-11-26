// SPDX-License-Identifier: MIT
// 交易图标（line/set/katana.mjs，用 Kubai Line 技能画）→ React 组件、CSS 动效、静态 SVG。
// 只在构建时调用本机的 Kubai Line 引擎渲染；引擎不进本仓库（Kubai Icons License §3），产出的图标归我们（§2）。
//   KUBAI_LINE=<kubai-icons/styles/line 的路径> node scripts/build-trading.mjs
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const engine = path.resolve(process.env.KUBAI_LINE ?? path.join(root, '../vendor/kubai-icons/styles/line'));
const { render } = await import(pathToFileURL(path.join(engine, 'kit.mjs')));
// 用本仓库里的图标定义，不用引擎目录里那份
fs.copyFileSync(path.join(root, 'line/set/katana.mjs'), path.join(engine, 'set/katana.mjs'));
const { default: SET } = await import(pathToFileURL(path.join(engine, 'set/katana.mjs')));

const VARIANTS = ['outline', 'line-duo', 'fill', 'solid-tint'];
const WEIGHTS = { light: 1.5, regular: 2, medium: 2.25, bold: 2.5 };
const tones = { dark: 'currentColor', light: 'var(--kti-accent, currentColor)', fill: 'var(--kti-tint, color-mix(in srgb, currentColor 22%, transparent))' };
const names = Object.keys(SET);
const pascal = (n) => n.replace(/(^|-)(\w)/g, (_, __, c) => c.toUpperCase());

// 一张图标的一个变体一档线宽：去掉外层 <svg>，mask id 换成占位符，运行时用 useId 换掉
const inner = (icon, variant, s) => {
  const svg = render(icon, { variant, s, color: 'currentColor', tones, motion: true, id: '__ID__' });
  return svg.replace(/^<svg[^>]*>/, '').replace(/<\/svg>$/, '');
};
const DATA = {};
for (const n of names) {
  DATA[n] = {};
  for (const v of VARIANTS) for (const [w, s] of Object.entries(WEIGHTS)) DATA[n][`${v}:${w}`] = inner(SET[n], v, s);
}

// ---- CSS 动效：照各图标的 fx 写成悬停时播一次的关键帧 ----
const ON = '.kti-anim:hover, [data-kti-hover]:hover .kti';
const sel = (n, layers) => [].concat(layers === 'all' ? ['all'] : layers).map((l) => `.kti-t-${n} [data-l="${l}"]`);
const hov = (n, layers, extra = '') => sel(n, layers).map((s) => ON.split(', ').map((h) => `${h}.kti-t-${n} ${s.slice(s.indexOf(' ') + 1)}${extra}`).join(',')).join(',');
let css = `/* SPDX-License-Identifier: MIT */
/* 生成文件，勿手改：node scripts/build-trading.mjs */
.kti-t [data-l]{transform-box:view-box}
`;
const frames = [];
for (const n of names) {
  for (const fx of [].concat(SET[n].fx || [])) {
    const o = fx.o ?? [12, 12], origin = `transform-origin:${o[0]}px ${o[1]}px`;
    const id = `kti-${n}-${fx.on === 'all' ? 'all' : [].concat(fx.on).join('-')}`;
    if (fx.t === 'draw') {
      [].concat(fx.on).forEach((l, i) => {
        css += `${hov(n, [l], ' path[pathLength]')}{stroke-dasharray:1;animation:kti-draw 420ms cubic-bezier(.3,.7,.2,1) ${i * (fx.stagger ?? 0)}ms both}\n`;
      });
      continue;
    }
    let mid;
    if (fx.t === 'keys') {
      const t = [];
      if (fx.x || fx.y) t.push(`translate(${fx.x?.[0] ?? 0}px,${fx.y?.[0] ?? 0}px)`);
      if (fx.r) t.push(`rotate(${fx.r[0]}deg)`);
      if (fx.sx || fx.sy || fx.s) t.push(`scale(${fx.sx?.[0] ?? fx.s?.[0] ?? 1},${fx.sy?.[0] ?? fx.s?.[0] ?? 1})`);
      mid = `0%,100%{transform:none}45%{transform:${t.join(' ')}}`;
    } else if (fx.t === 'beat') {
      mid = `0%,60%,100%{transform:none}20%{transform:scale(1.14)}40%{transform:scale(.96)}`;
    } else if (fx.t === 'bounce') {
      const a = (fx.amp ?? 1) * 3;
      mid = `0%,100%{transform:none}30%{transform:translateY(-${a}px)}55%{transform:translateY(0) scale(1.08,.9)}75%{transform:translateY(-${a / 3}px)}`;
    } else throw new Error(`${n}: 不认识的动效 ${fx.t}`);
    frames.push(`@keyframes ${id}{${mid}}`);
    css += `${sel(n, fx.on).join(',')}{${origin}}\n`;
    css += `${hov(n, fx.on)}{animation:${id} 560ms cubic-bezier(.2,.8,.2,1) ${fx.delay ?? 0}ms both}\n`;
  }
}
css += `@keyframes kti-draw{from{stroke-dashoffset:1}to{stroke-dashoffset:0}}\n${frames.join('\n')}\n`;
css += `@media (prefers-reduced-motion: reduce){.kti-t [data-l],.kti-t path{animation:none!important}}\n`;

// ---- React ----
const js = `// SPDX-License-Identifier: MIT
// 生成文件，勿手改：node scripts/build-trading.mjs
import { createElement, forwardRef, useId } from 'react'

const DATA = ${JSON.stringify(DATA)}
const WEIGHT = { light: 1.5, regular: 2, medium: 2.25, bold: 2.5 }
const nearest = (s) => Object.entries(WEIGHT).reduce((a, b) => (Math.abs(b[1] - s) < Math.abs(a[1] - s) ? b : a))[0]

export const tradingIconNames = ${JSON.stringify(names)}

export function createTradingIcon(name) {
  const C = forwardRef(function TradingIcon({ size = 24, weight, strokeWidth, variant = 'outline', animated = false, title, className, ...rest }, ref) {
    const uid = useId().replace(/[^a-zA-Z0-9_-]/g, '')
    const w = weight ?? (strokeWidth != null ? nearest(strokeWidth) : 'regular')
    const body = DATA[name][variant + ':' + w].replaceAll('__ID__', 'kt' + uid)
    return createElement('svg', {
      ref, xmlns: 'http://www.w3.org/2000/svg', viewBox: '0 0 24 24', width: size, height: size,
      className: ['kti', 'kti-t', 'kti-t-' + name, animated && 'kti-anim', className].filter(Boolean).join(' '),
      role: title ? 'img' : undefined, 'aria-label': title, 'aria-hidden': title ? undefined : true,
      dangerouslySetInnerHTML: { __html: (title ? '<title>' + title.replace(/</g, '&lt;') + '</title>' : '') + body },
      ...rest
    })
  })
  C.displayName = ${'`Trading(${name})`'.replace('${name}', "' + name + '")}
  return C
}
${names.map((n) => `/** ${SET[n].label} */\nexport const ${pascal(n)} = createTradingIcon('${n}')`).join('\n')}
`.replace("C.displayName = `Trading(' + name + ')`", "C.displayName = 'Trading(' + name + ')'");
const dts = `// SPDX-License-Identifier: MIT
// 生成文件，勿手改：node scripts/build-trading.mjs
import type { ForwardRefExoticComponent, RefAttributes, SVGProps } from 'react'

export interface TradingIconProps extends Omit<SVGProps<SVGSVGElement>, 'ref'> {
  /** 像素尺寸，默认 24 */
  size?: number | string
  /** 字重档：线宽 1.5 / 2 / 2.25 / 2.5，跟旁边文字的字重走；默认 regular */
  weight?: 'light' | 'regular' | 'medium' | 'bold'
  /** 直接给线宽，取最近的一档 */
  strokeWidth?: number
  /** 线性、双色线性（强调色读 --kti-accent）、面性、面性填充（底色读 --kti-tint）；默认 outline */
  variant?: 'outline' | 'line-duo' | 'fill' | 'solid-tint'
  /** 自己悬停时播放动效；或在祖先上写 data-kti-hover */
  animated?: boolean
  /** 有文字含义时给读屏用；不给就是装饰（aria-hidden） */
  title?: string
}
export type TradingIcon = ForwardRefExoticComponent<TradingIconProps & RefAttributes<SVGSVGElement>>
export type TradingIconName = ${names.map((n) => `'${n}'`).join(' | ')}
export declare function createTradingIcon(name: TradingIconName): TradingIcon
export declare const tradingIconNames: TradingIconName[]
${names.map((n) => `/** ${SET[n].label} */\nexport declare const ${pascal(n)}: TradingIcon`).join('\n')}
`;
const rd = path.join(root, 'packages/react');
fs.writeFileSync(path.join(rd, 'src/trading.js'), js);
fs.writeFileSync(path.join(rd, 'src/trading.d.ts'), dts);
fs.writeFileSync(path.join(rd, 'trading.css'), css);

// ---- 静态 SVG：每种变体 regular 一档，currentColor ----
for (const v of VARIANTS) {
  const dir = path.join(root, 'packages/static/svg/trading', v);
  fs.mkdirSync(dir, { recursive: true });
  for (const n of names) {
    const body = render(SET[n], { variant: v, s: 2, color: 'currentColor', tones, id: `kt-${n}` });
    fs.writeFileSync(path.join(dir, `${n}.svg`), body);
  }
}
console.log(`trading: ${names.length} icons × ${VARIANTS.length} variants × ${Object.keys(WEIGHTS).length} weights; js ${(js.length / 1024).toFixed(0)} KB, css ${(css.length / 1024).toFixed(1)} KB`);
