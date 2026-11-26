// SPDX-License-Identifier: MIT
// KATANA 像素特效：交易里的关键时刻配一个像素动画。底层是 pixelfx（MIT，patch-gg/pixelfx，见 vendor/pixelfx/NOTICE.md），
// 我们只挑了界面用得上、不需要角色的 10 个，换成 KATANA 的颜色。
// 用法：
//   import { play } from '@katana-icons/fx'
//   play(canvasEl, 'filled')                    // 成交：画布按特效原尺寸 × scale，像素放大不糊
//   const stop = play(canvas, 'locked', { loop: true }); stop()
// 不用运行时也行：packages/static/fx/<id>.png + .json 是同一批特效导出的精灵图（Aseprite 格式）。
import { createFrame, clearFrame, createFx, composite } from './vendor/pixelfx/core/index.js';
import * as collectBurst from './vendor/pixelfx/fx/pickups/collect-burst.js';
import * as exclamation from './vendor/pixelfx/fx/ui/exclamation.js';
import * as questComplete from './vendor/pixelfx/fx/ui/quest-complete.js';
import * as countdown from './vendor/pixelfx/fx/ui/countdown.js';
import * as zapHit from './vendor/pixelfx/fx/lightning/zap-hit.js';
import * as chargeUp from './vendor/pixelfx/fx/lightning/charge-up.js';
import * as forceField from './vendor/pixelfx/fx/scifi/force-field.js';
import * as energyCore from './vendor/pixelfx/fx/scifi/energy-core.js';
import * as crtOff from './vendor/pixelfx/fx/transitions/crt-off.js';
import * as glitchWipe from './vendor/pixelfx/fx/transitions/glitch-wipe.js';

// 调色板：暗到亮 8 档。主色取自 KatanaUI Graphite（土黄、铬绿、玫瑰茜红）和品牌朱红。
export const PALETTES = {
  shu: ['#1a0806', '#3d110c', '#6b1d16', '#a8322d', '#cf4a3c', '#f07a5e', '#ffc2a8', '#fff4ec'],
  ink: ['#050505', '#141414', '#2a2a28', '#4a4842', '#7d7a72', '#b3afa5', '#e0ddd4', '#ffffff'],
  gold: ['#1a1206', '#3d2a0c', '#6e4d16', '#a87a2a', '#d6a548', '#ebc77a', '#f7e6b8', '#fffbef'],
  up: ['#06140e', '#0e2e20', '#1b4f38', '#2f7a58', '#5fae8c', '#8fd0b0', '#c8ecd9', '#f2fffa'],
  down: ['#1a060b', '#3d0f1b', '#6e1a30', '#a82a4a', '#f2607c', '#f78fa3', '#fcc8d3', '#fff2f5'],
};
const P = PALETTES;

// 时刻 → 特效。只用在真的值得看一眼的时刻；同一时刻全站只用这一个。
export const MOMENTS = {
  filled: { source: 'pickups/collect-burst', zh: '成交', fx: collectBurst, opts: { palette: P.up } },
  alert: { source: 'ui/exclamation', zh: '告警触发', fx: exclamation, opts: { palette: P.shu } },
  target: { source: 'ui/quest-complete', zh: '止盈 / 目标达成', fx: questComplete, opts: { palette: P.gold, ribbon: P.shu.slice(0, 7), text: 'TARGET HIT' } },
  open: { source: 'ui/countdown', zh: '开盘倒计时', fx: countdown, opts: { palette: P.ink, go: P.up, word: 'OPEN' } },
  breakout: { source: 'lightning/zap-hit', zh: '突破', fx: zapHit, opts: { palette: P.gold } },
  arming: { source: 'lightning/charge-up', zh: '委托排队 / 蓄力', fx: chargeUp, opts: { palette: P.shu, sparks: ['#ffffff', P.shu[6], P.shu[5], P.shu[3]] } },
  locked: { source: 'scifi/force-field', zh: '交易锁生效', fx: forceField, opts: { palette: P.ink, sparks: [P.shu[6], P.shu[5], P.shu[4], P.shu[3]] } },
  engine: { source: 'scifi/energy-core', zh: '引擎运行（加载中）', fx: energyCore, opts: { palette: P.shu, metal: P.ink.slice(0, 6) } },
  offline: { source: 'transitions/crt-off', zh: '断线', fx: crtOff, opts: { palette: P.ink, color: '#050505' } },
  reconnect: { source: 'transitions/glitch-wipe', zh: '重连', fx: glitchWipe, opts: { palette: P.ink, color: '#050505', split: P.shu[4] } },
};

export const momentMeta = (id) => {
  const m = MOMENTS[id];
  if (!m) throw new Error(`没有这个时刻：${id}（可用：${Object.keys(MOMENTS).join('、')}）`);
  return { ...m.fx.meta, zh: m.zh };
};

// 在 canvas 上播一次（循环特效会一直播，直到调用返回的 stop）。
// scale：像素放大倍数，默认 2；opts 会合并到这个时刻的默认参数上（比如换 text、seed）。
export function play(canvas, id, { scale = 2, opts = {}, onDone } = {}) {
  const m = MOMENTS[id];
  if (!m) throw new Error(`没有这个时刻：${id}`);
  const { size: [w, h], origin: [ox, oy], loop } = m.fx.meta;
  canvas.width = w;
  canvas.height = h;
  canvas.style.width = w * scale + 'px';
  canvas.style.height = h * scale + 'px';
  canvas.style.imageRendering = 'pixelated';
  const ctx = canvas.getContext('2d'), frame = createFrame(w, h), img = new ImageData(w, h);
  const fx = createFx(m.fx, { ...m.opts, ...opts, x: ox, y: oy });
  let last = performance.now(), raf = 0, stopped = false;
  const tick = (now) => {
    if (stopped) return;
    // rAF 的时间戳是这一帧开始的时刻，可能早于 play() 被调用的那一刻：步长夹在 0..0.1 秒
    const dt = Math.max(0, Math.min(0.1, (now - last) / 1000));
    last = Math.max(last, now);
    try {
      fx.update(dt);
      clearFrame(frame);
      fx.draw(frame, 'back');
      fx.draw(frame, 'front');
      img.data.fill(0);
      composite(frame, img.data, null);
      ctx.putImageData(img, 0, 0);
    } catch (err) {
      // 特效出错只停这一个，不拖垮页面
      stopped = true;
      console.error(`[katana-fx] ${id}`, err);
      return;
    }
    if (!loop && fx.done()) { stopped = true; onDone?.(); return; }
    raf = requestAnimationFrame(tick);
  };
  raf = requestAnimationFrame(tick);
  return () => { stopped = true; cancelAnimationFrame(raf); ctx.clearRect(0, 0, w, h); };
}
