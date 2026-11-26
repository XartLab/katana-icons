#!/usr/bin/env node
// SPDX-License-Identifier: MIT
// 从 icons/ 生成发布物：packages/static/svg/*.svg、packages/react/（组件 + 类型 + 动效 CSS）、icons.json。
// 生成文件不手改；改图标改 icons/，再跑 node scripts/build.mjs。
import { mkdirSync, writeFileSync, rmSync } from 'node:fs'
import { loadIcons } from './load.mjs'
import { renderSvg, renderInner, MOTION_CSS, STROKE } from '../src/kit.mjs'

const icons = await loadIcons()
const pascal = (n) => n.split('-').map((s) => s[0].toUpperCase() + s.slice(1)).join('')
const HEAD = '// SPDX-License-Identifier: MIT\n// 生成文件，勿手改：node scripts/build.mjs\n'

rmSync('packages/static/svg', { recursive: true, force: true })
mkdirSync('packages/static/svg', { recursive: true })
for (const i of icons) writeFileSync(`packages/static/svg/${i.name}.svg`, renderSvg(i) + '\n')

mkdirSync('packages/react/src', { recursive: true })
const data = Object.fromEntries(icons.map((i) => [i.name, { inner: renderInner(i), lit: renderInner(i, { light: true }) }]))
writeFileSync(
  'packages/react/src/index.js',
  `${HEAD}import { createElement, forwardRef } from 'react'

const DATA = ${JSON.stringify(data)}

export function createIcon(name) {
  const d = DATA[name]
  const Icon = forwardRef(function Icon({ size = 24, strokeWidth = ${STROKE.default}, light = false, animated = false, title, className, ...rest }, ref) {
    const cls = 'kti kti-' + name + (animated ? ' kti-anim' : '') + (className ? ' ' + className : '')
    const a11y = title ? { role: 'img', 'aria-label': title } : { 'aria-hidden': true }
    return createElement('svg', {
      ref, xmlns: 'http://www.w3.org/2000/svg', width: size, height: size, viewBox: '0 0 24 24', fill: 'none',
      stroke: 'currentColor', strokeWidth, strokeLinecap: 'butt', strokeLinejoin: 'miter', strokeMiterlimit: 10,
      className: cls, ...a11y, ...rest, dangerouslySetInnerHTML: { __html: light ? d.lit : d.inner },
    })
  })
  Icon.displayName = ${'`Kt${name.split(\'-\').map((s) => s[0].toUpperCase() + s.slice(1)).join(\'\')}`'}
  return Icon
}

export const iconNames = ${JSON.stringify(icons.map((i) => i.name))}
${icons.map((i) => `export const ${pascal(i.name)} = createIcon('${i.name}')`).join('\n')}
`,
)
writeFileSync(
  'packages/react/src/index.d.ts',
  `${HEAD}import type { ForwardRefExoticComponent, RefAttributes, SVGProps } from 'react'

export interface KatanaIconProps extends Omit<SVGProps<SVGSVGElement>, 'ref'> {
  /** 像素尺寸，默认 24 */
  size?: number | string
  /** 线宽 ${STROKE.min}–${STROKE.max}，默认 ${STROKE.default}；跟旁边文字的字重走 */
  strokeWidth?: number
  /** 点亮座舱灯（颜色读 --kti-light，没设就跟文字色） */
  light?: boolean
  /** 自己悬停时播放动作；或在祖先上写 data-kti-hover */
  animated?: boolean
  /** 有文字含义时给读屏用；不给就是装饰（aria-hidden） */
  title?: string
}
export type KatanaIcon = ForwardRefExoticComponent<KatanaIconProps & RefAttributes<SVGSVGElement>>
export type KatanaIconName = ${icons.map((i) => `'${i.name}'`).join(' | ')}
export declare function createIcon(name: KatanaIconName): KatanaIcon
export declare const iconNames: KatanaIconName[]
${icons.map((i) => `/** ${i.zh} */\nexport declare const ${pascal(i.name)}: KatanaIcon`).join('\n')}
`,
)
writeFileSync('packages/react/styles.css', MOTION_CSS)
writeFileSync('icons.json', JSON.stringify(icons.map(({ name, zh, keywords, group, light, parts }) => ({ name, zh, keywords, group, light: !!light, motion: parts.find((p) => p.motion)?.motion ?? null })), null, 2) + '\n')
console.log(`生成 ${icons.length} 个图标：packages/static/svg、packages/react、icons.json`)
