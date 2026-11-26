#!/usr/bin/env node
// SPDX-License-Identifier: MIT
// 自检：逐条量 docs/rules.md 里能量化的规则。纯 Node，不起浏览器，整套应在 1 秒内跑完（预算 60 秒，超了就是 bug）。
// 用法：node scripts/check.mjs [--only a,b] [--sheet out/sheet.html]

import { writeFileSync, mkdirSync } from 'node:fs'
import { dirname } from 'node:path'
import { loadIcons } from './load.mjs'
import { LIVE, MOTIONS, LIGHT_SIZE, renderSvg, MOTION_CSS } from '../src/kit.mjs'

const t0 = performance.now()
const args = process.argv.slice(2)
const opt = (k) => { const i = args.indexOf(k); return i >= 0 ? args[i + 1] : undefined }
const only = opt('--only')?.split(',')
const sheet = opt('--sheet')

const icons = (await loadIcons()).filter((i) => !only || only.includes(i.name))
const errors = []
const err = (icon, rule, msg) => errors.push(`${icon}: [${rule}] ${msg}`)

function tokenize(d) {
  return d.match(/[MLHVZAmlhvzaCcSsQqTt]|-?\d*\.?\d+/g) ?? []
}

// 把 SVG 圆弧（端点参数）换成圆心参数再取样，见 SVG 1.1 附录 F.6.5。
function sampleArc(x1, y1, rx, ry, phi, fa, fs, x2, y2) {
  const rad = (phi * Math.PI) / 180
  const cos = Math.cos(rad), sin = Math.sin(rad)
  const dx = (x1 - x2) / 2, dy = (y1 - y2) / 2
  const x1p = cos * dx + sin * dy, y1p = -sin * dx + cos * dy
  let lam = (x1p * x1p) / (rx * rx) + (y1p * y1p) / (ry * ry)
  if (lam > 1) { rx *= Math.sqrt(lam); ry *= Math.sqrt(lam) }
  const num = rx * rx * ry * ry - rx * rx * y1p * y1p - ry * ry * x1p * x1p
  const den = rx * rx * y1p * y1p + ry * ry * x1p * x1p
  let co = Math.sqrt(Math.max(0, num / den)) * (fa === fs ? -1 : 1)
  const cxp = (co * rx * y1p) / ry, cyp = (-co * ry * x1p) / rx
  const cx = cos * cxp - sin * cyp + (x1 + x2) / 2, cy = sin * cxp + cos * cyp + (y1 + y2) / 2
  const ang = (ux, uy, vx, vy) => Math.atan2(ux * vy - uy * vx, ux * vx + uy * vy)
  const th1 = ang(1, 0, (x1p - cxp) / rx, (y1p - cyp) / ry)
  let dth = ang((x1p - cxp) / rx, (y1p - cyp) / ry, (-x1p - cxp) / rx, (-y1p - cyp) / ry)
  if (!fs && dth > 0) dth -= 2 * Math.PI
  if (fs && dth < 0) dth += 2 * Math.PI
  const pts = []
  for (let k = 0; k <= 24; k++) {
    const t = th1 + (dth * k) / 24
    pts.push([cx + rx * Math.cos(t) * cos - ry * Math.sin(t) * sin, cy + rx * Math.cos(t) * sin + ry * Math.sin(t) * cos])
  }
  return pts
}

function walk(icon, part) {
  const tk = tokenize(part.d)
  const pts = []
  const segs = []
  let i = 0, x = 0, y = 0, sx = 0, sy = 0, cmd = null
  const num = () => {
    const v = Number(tk[i++])
    if (!Number.isFinite(v)) throw new Error(`坐标读不出：${tk[i - 1]}`)
    return v
  }
  const onGrid = (v, what) => { if (Math.abs(v * 2 - Math.round(v * 2)) > 1e-9) err(icon.name, 'grid', `${part.id} 的${what} ${v} 不在 0.5 网格上`) }
  const line = (nx, ny) => { segs.push(Math.hypot(nx - x, ny - y)); x = nx; y = ny; pts.push([x, y]) }
  while (i < tk.length) {
    if (/[A-Za-z]/.test(tk[i])) cmd = tk[i++]
    if (!'MLHVZA'.includes(cmd)) { err(icon.name, 'commands', `${part.id} 用了 ${cmd}；只许 M L H V A Z（绝对坐标）`); return { pts, segs } }
    if (cmd === 'Z') { segs.push(Math.hypot(sx - x, sy - y)); x = sx; y = sy; cmd = null; continue }
    if (cmd === 'M') { x = num(); y = num(); onGrid(x, 'x'); onGrid(y, 'y'); sx = x; sy = y; pts.push([x, y]); cmd = 'L'; continue }
    if (cmd === 'L') { const nx = num(), ny = num(); onGrid(nx, 'x'); onGrid(ny, 'y'); line(nx, ny); continue }
    if (cmd === 'H') { const nx = num(); onGrid(nx, 'x'); line(nx, y); continue }
    if (cmd === 'V') { const ny = num(); onGrid(ny, 'y'); line(x, ny); continue }
    if (cmd === 'A') {
      const rx = num(), ry = num(), rot = num(), fa = num(), fs = num(), nx = num(), ny = num()
      onGrid(rx, '半径'); onGrid(nx, 'x'); onGrid(ny, 'y')
      for (const p of sampleArc(x, y, rx, ry, rot, fa, fs, nx, ny)) pts.push(p)
      segs.push(Math.hypot(nx - x, ny - y) || rx)
      x = nx; y = ny
    }
  }
  return { pts, segs }
}

const names = new Set()
for (const icon of icons) {
  if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(icon.name)) err(icon.name, 'name', '名字只用短横线小写')
  if (names.has(icon.name)) err(icon.name, 'name', '重名')
  names.add(icon.name)
  if (!icon.zh) err(icon.name, 'meta', '缺中文名 zh')
  if (!icon.keywords?.length) err(icon.name, 'meta', '缺 keywords')
  if (!icon.parts?.length) { err(icon.name, 'parts', '没有部件'); continue }
  const ids = new Set()
  const motions = icon.parts.filter((p) => p.motion)
  if (motions.length > 1) err(icon.name, 'motion', `只许一个部件会动，现在有 ${motions.length} 个`)
  let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity
  for (const part of icon.parts) {
    if (!part.id) err(icon.name, 'parts', '部件缺 id')
    if (ids.has(part.id)) err(icon.name, 'parts', `部件 id 重复：${part.id}`)
    ids.add(part.id)
    if (part.motion && !MOTIONS[part.motion]) err(icon.name, 'motion', `${part.id} 的动作 ${part.motion} 不在 kit.MOTIONS 里`)
    let res
    try { res = walk(icon, part) } catch (e) { err(icon.name, 'parse', `${part.id}: ${e.message}`); continue }
    for (const s of res.segs) if (s > 0 && s < 1 && !part.fill) err(icon.name, 'detail', `${part.id} 有一段只长 ${s.toFixed(2)}（<1），缩到 16px 会糊`)
    for (const [px, py] of res.pts) { minX = Math.min(minX, px); minY = Math.min(minY, py); maxX = Math.max(maxX, px); maxY = Math.max(maxY, py) }
  }
  const eps = 0.01
  if (minX < LIVE[0] - eps || minY < LIVE[0] - eps || maxX > LIVE[1] + eps || maxY > LIVE[1] + eps)
    err(icon.name, 'live', `越出活动区 2–22：x ${minX.toFixed(2)}–${maxX.toFixed(2)}，y ${minY.toFixed(2)}–${maxY.toFixed(2)}`)
  const w = maxX - minX, h = maxY - minY
  if (Math.max(w, h) < 12) err(icon.name, 'size', `主体只有 ${Math.max(w, h).toFixed(1)}，至少 12（和同套图标一样大）`)
  if (icon.light) {
    const [lx, ly] = icon.light
    if (lx < minX || ly < minY || lx + LIGHT_SIZE > maxX || ly + LIGHT_SIZE > maxY) err(icon.name, 'light', `灯 (${lx},${ly}) 不在图标主体里`)
  }
}

if (sheet) {
  mkdirSync(dirname(sheet), { recursive: true })
  const cells = icons.map((i) => `<figure><div class="big">${renderSvg(i, { size: 48, light: true, animated: true })}</div><div class="small">${renderSvg(i, { size: 24 })}${renderSvg(i, { size: 16 })}</div><figcaption>${i.name}<br>${i.zh}</figcaption></figure>`).join('')
  writeFileSync(sheet, `<!doctype html><meta charset="utf-8"><title>katana-icons sheet</title><style>${MOTION_CSS}
body{margin:0;padding:32px;background:#121416;color:#e4e2dc;font:12px ui-monospace,monospace;--kti-light:#3fb8af}
main{display:grid;grid-template-columns:repeat(auto-fill,minmax(110px,1fr));gap:12px}
figure{margin:0;padding:12px;border:1px solid #2a2f34;display:flex;flex-direction:column;align-items:center;gap:8px}
.small{display:flex;gap:10px;align-items:center}figcaption{text-align:center;color:#8a9096}</style><main>${cells}</main>`)
}

const ms = performance.now() - t0
for (const e of errors) console.log('✗ ' + e)
console.log(`${icons.length} 个图标，${errors.length} 处问题，${ms.toFixed(0)} ms`)
if (ms > 60000) { console.log('超过 60 秒预算：这是 bug，去修最慢的一步'); process.exit(2) }
process.exit(errors.length ? 1 : 0)
