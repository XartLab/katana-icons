// SPDX-License-Identifier: MIT
// katana-icons 的绘制工具：把图标定义渲染成 SVG 字符串。规则见 docs/rules.md。

export const GRID = 24
export const LIVE = [2, 22]
export const STROKE = { default: 1.5, min: 1, max: 2 }
export const LIGHT_SIZE = 2

export const MOTIONS = {
  'nudge-right': '右移 2',
  'nudge-left': '左移 2',
  'nudge-down': '下移 2',
  'nudge-up': '上移 2',
  'nudge-diag': '右上移 1.5',
  lift: '上抬 2（锁梁、盖子）',
  press: '下压 1 并缩到 0.94（按钮、执行）',
  pop: '放大到 1.12',
  spin: '顺时针转 90°',
  'spin-ccw': '逆时针转 90°',
  swing: '绕原点摆动一次（铃）',
  slide: '右滑 3（滑块、开关）',
}

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;')

export function renderPart(part) {
  const paint = part.fill ? ' fill="currentColor" stroke="none"' : ''
  const path = `<path d="${esc(part.d)}"${paint}/>`
  if (!part.motion) return path
  const [ox, oy] = part.origin ?? [12, 12]
  return `<g class="kti-part" data-motion="${part.motion}" style="transform-origin:${ox}px ${oy}px">${path}</g>`
}

export function renderLight(icon) {
  if (!icon.light) return ''
  const [x, y] = icon.light
  return `<rect class="kti-light" x="${x}" y="${y}" width="${LIGHT_SIZE}" height="${LIGHT_SIZE}" fill="var(--kti-light, currentColor)" stroke="none"/>`
}

export function renderInner(icon, { light = false } = {}) {
  return icon.parts.map(renderPart).join('') + (light ? renderLight(icon) : '')
}

export function renderSvg(icon, { size = 24, stroke = STROKE.default, light = false, animated = false, title } = {}) {
  const cls = `kti kti-${icon.name}${animated ? ' kti-anim' : ''}`
  const a11y = title ? `role="img" aria-label="${esc(title)}"` : 'aria-hidden="true"'
  return (
    `<svg xmlns="http://www.w3.org/2000/svg" class="${cls}" width="${size}" height="${size}" viewBox="0 0 ${GRID} ${GRID}" ` +
    `fill="none" stroke="currentColor" stroke-width="${stroke}" stroke-linecap="butt" stroke-linejoin="miter" stroke-miterlimit="10" ${a11y}>` +
    renderInner(icon, { light }) +
    `</svg>`
  )
}

export const MOTION_CSS = `/* SPDX-License-Identifier: MIT */
/* katana-icons 悬停动作：一个图标只做一个动作，做完回原位。触发：图标本身带 .kti-anim，或祖先带 data-kti-hover。 */
.kti .kti-part{transform-box:view-box;transition:transform 180ms cubic-bezier(.2,.8,.2,1)}
.kti-anim:hover .kti-part[data-motion="nudge-right"],[data-kti-hover]:hover .kti .kti-part[data-motion="nudge-right"]{transform:translateX(2px)}
.kti-anim:hover .kti-part[data-motion="nudge-left"],[data-kti-hover]:hover .kti .kti-part[data-motion="nudge-left"]{transform:translateX(-2px)}
.kti-anim:hover .kti-part[data-motion="nudge-down"],[data-kti-hover]:hover .kti .kti-part[data-motion="nudge-down"]{transform:translateY(2px)}
.kti-anim:hover .kti-part[data-motion="nudge-up"],[data-kti-hover]:hover .kti .kti-part[data-motion="nudge-up"]{transform:translateY(-2px)}
.kti-anim:hover .kti-part[data-motion="nudge-diag"],[data-kti-hover]:hover .kti .kti-part[data-motion="nudge-diag"]{transform:translate(1.5px,-1.5px)}
.kti-anim:hover .kti-part[data-motion="lift"],[data-kti-hover]:hover .kti .kti-part[data-motion="lift"]{transform:translateY(-2px)}
.kti-anim:hover .kti-part[data-motion="press"],[data-kti-hover]:hover .kti .kti-part[data-motion="press"]{transform:translateY(1px) scale(.94)}
.kti-anim:hover .kti-part[data-motion="pop"],[data-kti-hover]:hover .kti .kti-part[data-motion="pop"]{transform:scale(1.12)}
.kti-anim:hover .kti-part[data-motion="spin"],[data-kti-hover]:hover .kti .kti-part[data-motion="spin"]{transform:rotate(90deg);transition-duration:320ms}
.kti-anim:hover .kti-part[data-motion="spin-ccw"],[data-kti-hover]:hover .kti .kti-part[data-motion="spin-ccw"]{transform:rotate(-90deg);transition-duration:320ms}
.kti-anim:hover .kti-part[data-motion="slide"],[data-kti-hover]:hover .kti .kti-part[data-motion="slide"]{transform:translateX(3px)}
.kti-anim:hover .kti-part[data-motion="swing"],[data-kti-hover]:hover .kti .kti-part[data-motion="swing"]{animation:kti-swing 420ms cubic-bezier(.2,.8,.2,1)}
@keyframes kti-swing{0%{transform:rotate(0)}25%{transform:rotate(-12deg)}55%{transform:rotate(9deg)}80%{transform:rotate(-4deg)}100%{transform:rotate(0)}}
`
