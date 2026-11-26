#!/usr/bin/env node
// SPDX-License-Identifier: MIT
// 分层图标的总览页：同一套图标在几个主色下并排，悬停能动。用法：node scripts/layered-sheet.mjs out/layered.html
import { writeFileSync, mkdirSync } from 'node:fs'
import { dirname } from 'node:path'
import icons from '../icons-layered/core.mjs'
import { renderLayered, LAYERED_CSS } from '../src/layered.mjs'

const out = process.argv[2] ?? 'out/layered.html'
const bases = ['#3fb8af', '#d6a548', '#f2607c', '#6f8296', '#8b7cf6', '#e8e6e1']
const rows = bases.map((b) => `<div class="row" style="--ktl-base:${b}"><span class="sw" style="background:${b}"></span>${icons.map((i) => renderLayered(i, { size: 56, light: true, animated: true, uid: `k-${i.name}` })).join('')}</div>`).join('')
const big = `<div class="big" style="--ktl-base:#3fb8af">${icons.map((i) => `<figure>${renderLayered(i, { size: 96, light: true, animated: true, uid: `k-${i.name}` })}<figcaption>${i.name}<br>${i.zh}</figcaption></figure>`).join('')}</div>`
const sizes = `<div class="row" style="--ktl-base:#3fb8af">${icons.map((i) => `<span class="sz">${[48, 32, 24, 16].map((s) => renderLayered(i, { size: s, uid: `k-${i.name}` })).join('')}</span>`).slice(0, 9).join('')}</div>`
mkdirSync(dirname(out), { recursive: true })
writeFileSync(out, `<!doctype html><meta charset="utf-8"><title>katana-icons layered</title><style>${LAYERED_CSS}
body{margin:0;padding:28px;background:#121416;color:#e4e2dc;font:12px ui-monospace,monospace}
.big{display:grid;grid-template-columns:repeat(9,1fr);gap:8px;margin-bottom:24px}
figure{margin:0;display:flex;flex-direction:column;align-items:center;gap:6px;padding:12px 0;border:1px solid #2a2f34}
figcaption{color:#8a9096;text-align:center}
.row{display:flex;align-items:center;gap:10px;margin:8px 0}.sw{width:14px;height:14px;border-radius:3px;margin-right:6px}
.sz{display:flex;align-items:flex-end;gap:6px;margin-right:14px}</style>${big}${rows}${sizes}`)
console.log(`${icons.length} 个分层图标 → ${out}`)
