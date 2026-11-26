// SPDX-License-Identifier: MIT
// KATANA 像素特效：用 pixelfx 的渲染工具把 MOMENTS 里每个时刻导出成精灵图（PNG + Aseprite JSON）和一张接触表。
// 需要一份 pixelfx 检出：PIXELFX=<路径> node scripts/build-fx.mjs（只用它的 tools/，特效代码用我们 vendor 的同一版）。
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { MOMENTS } from '../packages/fx/src/index.js';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const PIXELFX = process.env.PIXELFX;
if (!PIXELFX || !fs.existsSync(path.join(PIXELFX, 'tools/render.mjs'))) throw new Error('设 PIXELFX=<pixelfx 检出路径>');
const out = path.join(root, 'packages/static/fx'), prev = path.join(root, 'preview/fx'), tmp = fs.mkdtempSync('/tmp/ktfx-');
fs.rmSync(out, { recursive: true, force: true });
fs.mkdirSync(out, { recursive: true });
fs.mkdirSync(prev, { recursive: true });
const index = {};
for (const [id, m] of Object.entries(MOMENTS)) {
  const fx = m.source;
  execFileSync('node', ['tools/render.mjs', fx, '--sheet', '--no-actor', '--bg', 'none', '--opts', JSON.stringify(m.opts), '--out', tmp], { cwd: PIXELFX, stdio: 'pipe' });
  const base = path.join(tmp, fx), name = fx.split('/')[1];
  fs.copyFileSync(path.join(base, `${name}.png`), path.join(out, `${id}.png`));
  const json = JSON.parse(fs.readFileSync(path.join(base, `${name}.json`), 'utf8'));
  if (json.meta) json.meta.image = `${id}.png`;
  fs.writeFileSync(path.join(out, `${id}.json`), JSON.stringify(json));
  execFileSync('node', ['tools/render.mjs', fx, '--no-actor', '--bg', 'black', '--max', '12', '--opts', JSON.stringify(m.opts), '--out', tmp], { cwd: PIXELFX, stdio: 'pipe' });
  fs.copyFileSync(path.join(base, 'contact.png'), path.join(prev, `${id}.png`));
  index[id] = { zh: m.zh, source: fx, size: m.fx.meta.size, duration: m.fx.meta.duration, loop: !!m.fx.meta.loop };
  console.log(id, '←', fx);
}
fs.writeFileSync(path.join(out, 'index.json'), JSON.stringify(index, null, 2) + '\n');
fs.copyFileSync(path.join(root, 'packages/fx/src/vendor/pixelfx/LICENSE'), path.join(out, 'LICENSE.pixelfx'));
fs.rmSync(tmp, { recursive: true, force: true });
// 运行时预览：preview/fx.html 读 fx-demo.js（esbuild 打包 preview/fx-demo.entry.js；没有 esbuild 就跳过）
try {
  execFileSync('npx', ['--no-install', 'esbuild', path.join(root, 'preview/fx-demo.entry.js'), '--bundle', '--format=iife', `--outfile=${path.join(root, 'preview/fx-demo.js')}`, '--log-level=warning'], { stdio: 'inherit' });
} catch { console.warn('没有 esbuild，preview/fx-demo.js 没更新'); }
