// SPDX-License-Identifier: MIT
// katana-icons 分层风格：后片 back、内容 content、前片 front 三层叠放，外圈一道描边；
// 所有颜色从一个主色 --ktl-base 推出（CSS 相对颜色 oklch(from …)），改一个变量整套换色。规则见 docs/layered.md。

export const L_GRID = 48
export const L_LIVE = [4, 44]
export const L_MOTIONS = {
  open: '前片向前翻开（以底边为轴压扁加斜切）',
  lift: '上抬 4',
  sink: '下沉 3',
  'slide-left': '左移 4',
  'slide-right': '右移 4',
  diag: '右上移 3',
  grow: '以底边为轴拉高 1.15 倍',
  pop: '放大 1.1 倍',
  spin: '转 60°',
  swing: '绕挂点摆一次',
}

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;')
const C = (base, l, c = 'c', h = 'h') => `oklch(from ${base} ${l} ${c} ${h})`
export const TONES = (base = 'var(--ktl-base, #3fb8af)') => ({
  outline: C(base, 'calc(l * 0.32)', 'calc(c * 0.6)'),
  back: C(base, 'calc(l * 0.72)'),
  front: base,
  content: C(base, '0.96', 'calc(c * 0.12)'),
  ink: C(base, 'calc(l * 0.45)', 'calc(c * 0.8)'),
  light: C(base, '0.86', '0.16', 'calc(h + 170)'),
})

const g = (part, layer, inner) => {
  const m = part?.motion ? ` data-m="${part.motion}"` : ''
  const [ox, oy] = part?.origin ?? [24, 44]
  return `<g class="ktl-${layer}"${m} style="transform-origin:${ox}px ${oy}px">${inner}</g>`
}

export function renderLayered(icon, { size = 48, base, light = false, animated = false, title, uid } = {}) {
  const t = TONES(base), id = uid ?? `ktl-${icon.name}`
  const all = [icon.back, ...(icon.content ? [icon.content] : []), icon.front].filter(Boolean)
  const outline = all.map((p) => `<path d="${esc(p.d)}" fill-rule="evenodd"/>`).join('')
  const lines = (p, color) => (p.lines ? `<path d="${esc(p.lines)}" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="butt"/>` : '') + (p.dots ? `<path d="${esc(p.dots)}" fill="${color}" stroke="none"/>` : '')
  const back = g(icon.back, 'back', `<path d="${esc(icon.back.d)}" fill-rule="evenodd" style="fill:${t.back}"/>${lines(icon.back, t.ink)}`)
  const content = icon.content ? g(icon.content, 'content', `<path d="${esc(icon.content.d)}" fill-rule="evenodd" style="fill:${t.content}"/>${lines(icon.content, t.ink)}`) : ''
  const f = icon.front
  const front = g(f, 'front',
    `<path d="${esc(f.d)}" fill-rule="evenodd" style="fill:${t.outline}" opacity=".35" transform="translate(0 -1.5)"/>` +
    `<path d="${esc(f.d)}" fill-rule="evenodd" style="fill:${t.front}"/>` +
    `<path d="${esc(f.d)}" fill-rule="evenodd" fill="url(#${id}-hi)"/>` +
    lines(f, t.content))
  const lit = light && icon.light ? `<rect class="ktl-light" x="${icon.light[0]}" y="${icon.light[1]}" width="4" height="4" style="fill:${t.light}"/>` : ''
  const a11y = title ? `role="img" aria-label="${esc(title)}"` : 'aria-hidden="true"'
  return `<svg xmlns="http://www.w3.org/2000/svg" class="ktl ktl-${icon.name}${animated ? ' ktl-anim' : ''}" width="${size}" height="${size}" viewBox="0 0 48 48" ${a11y}>` +
    `<defs><linearGradient id="${id}-hi" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".28"/><stop offset=".45" stop-color="#fff" stop-opacity="0"/></linearGradient></defs>` +
    `<g style="fill:${t.outline};stroke:${t.outline}" stroke-width="3.5" stroke-linejoin="miter">${outline}</g>` +
    back + content + front + lit + `</svg>`
}

export const LAYERED_CSS = `/* SPDX-License-Identifier: MIT */
/* katana-icons 分层风格的悬停动作。触发：图标带 .ktl-anim，或祖先带 data-kti-hover。 */
.ktl g[data-m]{transform-box:view-box;transition:transform 260ms cubic-bezier(.2,.9,.25,1.15)}
.ktl-anim:hover g[data-m="open"],[data-kti-hover]:hover .ktl g[data-m="open"]{transform:skewX(-7deg) scaleY(.84)}
.ktl-anim:hover g[data-m="lift"],[data-kti-hover]:hover .ktl g[data-m="lift"]{transform:translateY(-4px)}
.ktl-anim:hover g[data-m="sink"],[data-kti-hover]:hover .ktl g[data-m="sink"]{transform:translateY(3px)}
.ktl-anim:hover g[data-m="slide-left"],[data-kti-hover]:hover .ktl g[data-m="slide-left"]{transform:translateX(-4px)}
.ktl-anim:hover g[data-m="slide-right"],[data-kti-hover]:hover .ktl g[data-m="slide-right"]{transform:translateX(4px)}
.ktl-anim:hover g[data-m="diag"],[data-kti-hover]:hover .ktl g[data-m="diag"]{transform:translate(3px,-3px)}
.ktl-anim:hover g[data-m="grow"],[data-kti-hover]:hover .ktl g[data-m="grow"]{transform:scaleY(1.15)}
.ktl-anim:hover g[data-m="pop"],[data-kti-hover]:hover .ktl g[data-m="pop"]{transform:scale(1.1)}
.ktl-anim:hover g[data-m="spin"],[data-kti-hover]:hover .ktl g[data-m="spin"]{transform:rotate(60deg)}
.ktl-anim:hover g[data-m="swing"],[data-kti-hover]:hover .ktl g[data-m="swing"]{animation:ktl-swing 520ms cubic-bezier(.2,.8,.2,1)}
@keyframes ktl-swing{0%{transform:rotate(0)}25%{transform:rotate(-14deg)}55%{transform:rotate(10deg)}80%{transform:rotate(-4deg)}100%{transform:rotate(0)}}
`
