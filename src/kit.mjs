// SPDX-License-Identifier: MIT
// katana-icons 的绘制工具：把图标定义渲染成 SVG 字符串。规则见 docs/rules.md。

export const GRID = 24
export const LIVE = [2, 22]
export const STROKE = { default: 1.5, min: 1, max: 2, solidBoost: 1.3 }
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

export const VARIANTS = {
  line: '单色线性',
  'line-duo': '双色线性：会动的主部件用强调色 --kti-accent',
  'line-fill': '线性填充：闭合的外框铺一层淡色',
  solid: '单色面性：闭合的外框填实，框里的细节挖空',
}

// 部件的外接框（圆弧按端点加半径估，够判断"在不在框里"）
export function bbox(d) {
  const tk = d.match(/[MLHVAZ]|-?\d*\.?\d+/g) ?? []
  let i = 0, x = 0, y = 0, cmd = '', b = [Infinity, Infinity, -Infinity, -Infinity]
  const add = (px, py, r = 0) => { b = [Math.min(b[0], px - r), Math.min(b[1], py - r), Math.max(b[2], px + r), Math.max(b[3], py + r)] }
  while (i < tk.length) {
    if (/[A-Z]/.test(tk[i])) cmd = tk[i++]
    if (cmd === 'Z') continue
    if (cmd === 'M' || cmd === 'L') { x = +tk[i++]; y = +tk[i++]; add(x, y) }
    else if (cmd === 'H') { x = +tk[i++]; add(x, y) }
    else if (cmd === 'V') { y = +tk[i++]; add(x, y) }
    else if (cmd === 'A') { const r = +tk[i]; i += 5; const x0 = x, y0 = y; x = +tk[i++]; y = +tk[i++]; add(x0, y0, r); add(x, y, r) }
    else i++
  }
  return b
}
const closed = (d) => /Z\s*$/.test(d.trim())
const inside = (a, b) => a[0] >= b[0] - 0.01 && a[1] >= b[1] - 0.01 && a[2] <= b[2] + 0.01 && a[3] <= b[3] + 0.01
const area = (b) => (b[2] - b[0]) * (b[3] - b[1])
const subpaths = (d) => d.trim().split(/(?=M)/).map((x) => x.trim()).filter(Boolean).map((sd) => ({ d: sd, closed: closed(sd), box: bbox(sd) }))

// 给每个部件定角色：body 有闭合子路径的外框；detail 落在主外框里的细节；fill 实心小件；line 其余
export function roles(icon) {
  const info = icon.parts.map((p) => ({ p, subs: subpaths(p.d) }))
  let main = null, mainBox = null
  for (const x of info) { if (x.p.fill) continue; for (const s of x.subs) if (s.closed && (!mainBox || area(s.box) > area(mainBox))) { main = x.p; mainBox = s.box } }
  return info.map(({ p, subs }) => {
    const box = bbox(p.d)
    if (p.fill) return mainBox && inside(box, mainBox) ? 'fill-detail' : 'fill'
    if (p === main) return 'body'
    if (mainBox && inside(box, mainBox)) return 'detail'
    if (subs.some((s) => s.closed)) return 'body'
    return 'line'
  })
}

const wrapMotion = (part, inner) => {
  if (!part.motion) return inner
  const [ox, oy] = part.origin ?? [12, 12]
  return `<g class="kti-part" data-motion="${part.motion}" style="transform-origin:${ox}px ${oy}px">${inner}</g>`
}

export function renderLight(icon, variant = 'line') {
  if (!icon.light) return ''
  const [x, y] = icon.light
  const fill = variant === 'solid' ? 'var(--kti-light, var(--kti-bg, #fff))' : 'var(--kti-light, currentColor)'
  return `<rect class="kti-light" x="${x}" y="${y}" width="${LIGHT_SIZE}" height="${LIGHT_SIZE}" fill="${fill}" stroke="none"/>`
}

export function renderInner(icon, { light = false, variant = 'line', uid } = {}) {
  const rs = roles(icon), id = uid ?? `kti-m-${icon.name}`
  const holes = [], out = []
  icon.parts.forEach((p, i) => {
    const role = rs[i], acc = variant === 'line-duo' && p.motion
    const stroke = acc ? ' stroke="var(--kti-accent, currentColor)"' : ''
    if (role === 'fill' || role === 'fill-detail') {
      if (variant === 'solid' && role === 'fill-detail') { holes.push(wrapMotion(p, `<path d="${esc(p.d)}" fill="#000" stroke="none"/>`)); return }
      out.push(wrapMotion(p, `<path d="${esc(p.d)}" fill="${acc ? 'var(--kti-accent, currentColor)' : 'currentColor'}" stroke="none"/>`)); return
    }
    if (variant === 'solid' && role === 'detail') { holes.push(wrapMotion(p, `<path d="${esc(p.d)}" stroke="#000"${closed(p.d) ? ' fill="#000"' : ''}/>`)); return }
    if (role === 'body' && (variant === 'solid' || variant === 'line-fill')) {
      const subs = subpaths(p.d), shut = subs.filter((s) => s.closed), open = subs.filter((s) => !s.closed)
      const shutD = esc(shut.map((s) => s.d).join(' '))
      const shutBox = shut.reduce((b, s) => [Math.min(b[0], s.box[0]), Math.min(b[1], s.box[1]), Math.max(b[2], s.box[2]), Math.max(b[3], s.box[3])], [Infinity, Infinity, -Infinity, -Infinity])
      let inner = variant === 'solid'
        ? `<path d="${shutD}" fill="currentColor" fill-rule="evenodd" mask="url(#${id})"/>`
        : `<path d="${shutD}" fill="currentColor" fill-opacity=".2" fill-rule="evenodd"/>`
      for (const o of open) {
        if (variant === 'solid' && inside(o.box, shutBox)) holes.push(wrapMotion(p, `<path d="${esc(o.d)}" stroke="#000"/>`))
        else inner += `<path d="${esc(o.d)}"${stroke}/>`
      }
      out.push(wrapMotion(p, inner)); return
    }
    out.push(wrapMotion(p, `<path d="${esc(p.d)}"${stroke}/>`))
  })
  const defs = variant === 'solid' ? `<defs><mask id="${id}" maskUnits="userSpaceOnUse" x="0" y="0" width="24" height="24"><rect width="24" height="24" fill="#fff"/>${holes.join('')}</mask></defs>` : ''
  return defs + out.join('') + (light ? renderLight(icon, variant) : '')
}

export function renderSvg(icon, { size = 24, stroke = STROKE.default, light = false, animated = false, title, variant = 'line', uid } = {}) {
  const cls = `kti kti-${icon.name} kti-${variant}${animated ? ' kti-anim' : ''}`
  const a11y = title ? `role="img" aria-label="${esc(title)}"` : 'aria-hidden="true"'
  return (
    `<svg xmlns="http://www.w3.org/2000/svg" class="${cls}" width="${size}" height="${size}" viewBox="0 0 ${GRID} ${GRID}" ` +
    `fill="none" stroke="currentColor" stroke-width="${variant === 'solid' ? +(stroke * STROKE.solidBoost).toFixed(2) : stroke}" stroke-linecap="butt" stroke-linejoin="miter" stroke-miterlimit="10" ${a11y}>` +
    renderInner(icon, { light, variant, uid }) +
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
