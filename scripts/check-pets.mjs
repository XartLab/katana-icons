#!/usr/bin/env node
// SPDX-License-Identifier: MIT
// 宠物自检：数据之间能对上就行。纯 Node，不起浏览器，应在 1 秒内跑完（预算 60 秒，超了就是 bug）。
// 用法：node scripts/check-pets.mjs
import { PETS, MOODS, LINES, T10, T11, SHAPE, RIG, ARM_POSES, ACTS, REPERTOIRE, TRANSITIONS, moodFromPnl } from '../packages/pets/src/index.js'
import { SPRITES } from '../packages/pets/src/sprites.js'

const t0 = performance.now()
const errors = []
const err = (where, msg) => errors.push(`${where}: ${msg}`)
const moods = MOODS.map((m) => m[0])

for (const [name, T, w] of [['T10', T10, 10], ['T11', T11, 11]]) {
  for (const m of moods) {
    const rows = T[m]
    if (!rows) { err(name, `缺状态 ${m}`); continue }
    if (rows.length !== 7) err(`${name}.${m}`, `应为 7 行，实际 ${rows.length}`)
    rows.forEach((r, i) => { if (r.length !== w) err(`${name}.${m}[${i}]`, `应为 ${w} 列，实际 ${r.length}`) })
  }
}
for (const p of PETS) {
  if (!SPRITES[p.id]?.startsWith('data:image/png;base64,')) err(p.id, '没有精灵（跑 python3 scripts/build-pets.py）')
  if (!SHAPE[p.tpl]) err(p.id, `没有脸模板 ${p.tpl}`)
  for (const k of ['k', 'T', 'W', 'I', 'D', 'B', 'M', 'R', 'G', 'S']) if (!p.pal[k]) err(p.id, `调色板缺 ${k}`)
  if (p.orig && !moods.includes(p.orig)) err(p.id, `原图脸状态不存在：${p.orig}`)
  const r = RIG[p.id]
  if (!r) { err(p.id, '没有骨架 RIG'); continue }
  if (!(r.split < r.legY)) err(p.id, '头身分界应在腿上面')
  if (r.def !== 'orig' && !ARM_POSES[r.def]) err(p.id, `默认手势不存在：${r.def}`)
  for (const m of moods) {
    const line = LINES[p.id]?.[m]
    if (!line || line.length !== 2 || !line[0] || !line[1]) err(`${p.id}.${m}`, '缺状态词或台词')
    const rep = REPERTOIRE[p.id]?.[m]
    if (!rep?.length) { err(`${p.id}.${m}`, '动作池是空的'); continue }
    for (const [act, weight, par = {}] of rep) {
      const A = ACTS[act]
      if (!A) { err(`${p.id}.${m}`, `动作不存在：${act}`); continue }
      if (A.tr) err(`${p.id}.${m}`, `过渡动作不该进动作池：${act}`)
      if (!(weight > 0)) err(`${p.id}.${m}.${act}`, '权重要大于 0')
      if (par.arms && !ARM_POSES[par.arms]) err(`${p.id}.${m}.${act}`, `手势不存在：${par.arms}`)
      for (const t of [0, 5, 13, A.d[1] - 1]) {
        const pose = A.f(t, par, A.d[1])
        for (const side of ['L', 'R']) {
          const n = pose[side]
          if (n && n !== 'keep' && n !== 'orig' && !ARM_POSES[n]) err(`${act}@${t}`, `手势不存在：${n}`)
        }
      }
    }
  }
}
for (const [k, A] of Object.entries(ACTS)) if (!(A.n && A.d?.length === 2 && A.d[0] <= A.d[1])) err(`ACTS.${k}`, '缺名字或时长不对')
for (const t of ['notice', 'tocheek', 'escalate', 'buckle', 'standup', 'yawn', 'wake', 'relief', 'hopin']) if (!ACTS[t]?.tr) err('过渡', `缺过渡动作 ${t}`)
if (!TRANSITIONS.length) err('过渡', '说明表是空的')
const cases = [[5, 'happy'], [3, 'smug'], [0, 'calm'], [-2, 'loss'], [-4, 'scream'], [-8, 'despair']]
for (const [v, want] of cases) if (moodFromPnl(v) !== want) err('moodFromPnl', `${v}% 应为 ${want}，实际 ${moodFromPnl(v)}`)
if (moodFromPnl(0, { agent: true }) !== 'focus') err('moodFromPnl', 'Agent 盯盘时平静应为 focus')
if (moodFromPnl(5, { closed: true }) !== 'sleep') err('moodFromPnl', '休市应为 sleep')

const ms = (performance.now() - t0).toFixed(0)
if (errors.length) { console.error(errors.join('\n')); console.error(`\n${errors.length} 个错误（${ms} ms）`); process.exit(1) }
console.log(`宠物自检通过：${PETS.length} 个角色 × ${moods.length} 种状态，${Object.keys(ACTS).length} 个动作（${ms} ms）`)
