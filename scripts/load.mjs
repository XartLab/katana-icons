// SPDX-License-Identifier: MIT
// 读 icons/ 下的所有分组文件，按名字排序。
import { readdirSync } from 'node:fs'
import { fileURLToPath, pathToFileURL } from 'node:url'
import { join } from 'node:path'

const dir = fileURLToPath(new URL('../icons/', import.meta.url))

export async function loadIcons() {
  const out = []
  for (const f of readdirSync(dir).filter((f) => f.endsWith('.mjs')).sort()) {
    const mod = await import(pathToFileURL(join(dir, f)).href)
    for (const icon of mod.default) out.push({ ...icon, group: f.replace(/\.mjs$/, '') })
  }
  return out.sort((a, b) => a.name.localeCompare(b.name))
}
