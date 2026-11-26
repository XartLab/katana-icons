// SPDX-License-Identifier: MIT
// 汉字代号：每个交易图标配一个汉字，字形取自 Dela Gothic One（SIL OFL 1.1，google/fonts，2026-11-26 取），
// 转成轮廓路径放进 24 网格，用的时候不依赖字体。字形来源与许可见 NOTICE。
//   node scripts/build-kanji.mjs   （line/kanji.json 由 scripts/kanji-outlines.py 生成）
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const K = JSON.parse(fs.readFileSync(path.join(root, 'line/kanji.json'), 'utf8'));
const names = Object.keys(K);
const js = `// SPDX-License-Identifier: MIT
// 生成文件，勿手改：node scripts/build-kanji.mjs。字形取自 Dela Gothic One（SIL OFL 1.1）
import { createElement, forwardRef } from 'react'

export const KANJI = ${JSON.stringify(Object.fromEntries(names.map((n) => [n, K[n].char])))}
const D = ${JSON.stringify(Object.fromEntries(names.map((n) => [n, K[n].d])))}

/** 交易图标的汉字代号，name 跟交易图标同名；小于 20px 会糊，最小用 20 */
export const KanjiCode = forwardRef(function KanjiCode({ name, size = 24, title, ...rest }, ref) {
  return createElement('svg', { ref, xmlns: 'http://www.w3.org/2000/svg', viewBox: '0 0 24 24', width: size, height: size, fill: 'currentColor',
    role: title ? 'img' : undefined, 'aria-label': title, 'aria-hidden': title ? undefined : true, ...rest },
    title ? createElement('title', null, title) : null, createElement('path', { d: D[name] }))
})
`;
const dts = `// SPDX-License-Identifier: MIT
// 生成文件，勿手改：node scripts/build-kanji.mjs
import type { ForwardRefExoticComponent, RefAttributes, SVGProps } from 'react'
import type { TradingIconName } from './trading'
export declare const KANJI: Record<TradingIconName, string>
export interface KanjiCodeProps extends Omit<SVGProps<SVGSVGElement>, 'ref'> {
  /** 跟交易图标同名 */
  name: TradingIconName
  /** 像素尺寸，默认 24；小于 20 会糊 */
  size?: number | string
  title?: string
}
export declare const KanjiCode: ForwardRefExoticComponent<KanjiCodeProps & RefAttributes<SVGSVGElement>>
`;
fs.writeFileSync(path.join(root, 'packages/react/src/kanji.js'), js);
fs.writeFileSync(path.join(root, 'packages/react/src/kanji.d.ts'), dts);
console.log(`kanji: ${names.length}`);
