// SPDX-License-Identifier: MIT
// KATANA (XartLab): trading icons for the KATANA workbench, drawn with the Kubai Line skill by
// the rules in GUIDE.md. These icons are ours (Kubai Icons License §2); this file is a private
// addition to a local copy of the skill.
import { n, P, S, D, shell, line, solid } from '../parts.mjs';

// A drawing-tool handle: a small ring whose outer edge has radius 2.25.
const HR = 2.25;
const handle = (g, x, y, o = {}) => line(g.ring(x, y, HR), { role: S, ...o });
// A straight line between two handle centres, stopping clear of both rings.
function between(g, [ax, ay], [bx, by], ka = true, kb = true) {
  const L = Math.hypot(bx - ax, by - ay), ux = (bx - ax) / L, uy = (by - ay) / L, k = HR + g.h + g.clear;
  const a = ka ? k : 0, b = kb ? k : 0;
  return g.seg(ax + ux * a, ay + uy * a, bx - ux * b, by - uy * b);
}
// An arrow on a vertical shaft at x from y0 to the tip at y1 (either direction), head half-width w.
function vArrow(g, x, y0, y1, w = 2.5) {
  const dir = Math.sign(y1 - y0), back = y1 - dir * w;
  return g.seg(x, y0, x, y1) + g.pl([[x - w, back], [x, y1], [x + w, back]]);
}
function hArrow(g, y, x0, x1, w = 2.5) {
  const dir = Math.sign(x1 - x0), back = x1 - dir * w;
  return g.seg(x0, y, x1, y) + g.pl([[back, y - w], [x1, y], [back, y + w]]);
}

// A two-headed arrow between edge lines at 4 and 20 (centre lines), clear of both at any weight.
function rangeArrow(g, across) {
  const t0 = 4 + 2 * g.h + g.clear + g.h, t1 = 24 - t0, w = 2;
  const P2 = (a, b) => (across ? [b, a] : [a, b]);
  return g.seg(...P2(12, t0), ...P2(12, t1)) + g.pl([P2(12 - w, t0 + w), P2(12, t0), P2(12 + w, t0 + w)]) + g.pl([P2(12 - w, t1 - w), P2(12, t1), P2(12 + w, t1 - w)]);
}
// Position tools: an arrow in the box above (dir -1) or below (dir 1) the entry line at e.
function posArrow(g, e, dir) {
  const inner = dir < 0 ? 3 + g.s : 21 - g.s, tip = inner - dir * (g.clear + g.h), base = e + dir * (g.h + g.clear + g.h);
  return { tip, base };
}

// The arrow of a position tool: a stroked arrow in the outline variants; in the fill variant a
// solid head and shaft knocked out of the box, so no slivers are left inside the V.
function posLayers(g, e, dir) {
  const { tip, base } = posArrow(g, e, dir), w = 2.5;
  const pts = [[12 - w - g.h, tip - dir * (w + g.h)], [12, tip - dir * g.h * 0.2], [12 + w + g.h, tip - dir * (w + g.h)]];
  // keep the same winding as the shaft whichever way the arrow points, so the overlap stays filled
  const head = g.polygon(dir > 0 ? pts.reverse() : pts, 0.5);
  const y0 = Math.min(e, tip - dir * w), y1 = Math.max(e, tip - dir * w);
  const shaft = g.area(12 - g.h, y0, g.s, y1 - y0, 0);
  return [
    line(vArrow(g, 12, base, tip), { n: 'arrow', role: D, on: 'box', only: 'outline' }),
    solid(head + shaft, { n: 'arrow', role: D, on: 'box', only: 'fill' })
  ];
}

export default {
  // ---------- 画线工具 ----------
  'trend-line': {
    label: '趋势线', key: 'live',
    plan: '主体：一条斜线（两个锚点之间）；辅助：两端的锚点小圆环',
    weights: { [P]: 0.5, [S]: 0.5 },
    draw(g) {
      const a = [4.25, 19.75], b = [19.75, 4.25];
      return [line(between(g, a, b), { n: 'line', role: P }), handle(g, ...a, { n: 'h0' }), handle(g, ...b, { n: 'h1' })];
    },
    light: ['h0', 'h1'],
    // 画线: the line is drawn from anchor to anchor
    fx: { t: 'draw', on: ['line'] }
  },
  ray: {
    label: '射线', key: 'landscape', fit: 'x',
    allow: { optical: 'the ray runs right from its anchor; the arrow end is meant to weigh more' },
    plan: '主体：一条水平线，从锚点出发伸向右边，末端一个开口箭头；辅助：起点的锚点',
    weights: { [P]: 0.66, [S]: 0.34 },
    draw(g) {
      const x0 = 4.25 + HR + g.h + g.clear;
      return [line(hArrow(g, 12, x0, 22 - g.h, 3), { n: 'line', role: P }), handle(g, 4.25, 12, { n: 'h0' })];
    },
    light: ['h0'],
    fx: { t: 'draw', on: ['line'] }
  },
  'horizontal-line': {
    label: '水平线', key: 'landscape', fit: 'x',
    plan: '主体：横贯的价位线，在中间的锚点处断开；辅助：中间的锚点',
    weights: { [P]: 0.66, [S]: 0.34 },
    draw(g) {
      const k = HR + g.h + g.clear;
      return [line(g.span(2, 12, 12 - k + g.h, 12) + g.span(12 + k - g.h, 12, 22, 12), { n: 'line', role: P }), handle(g, 12, 12, { n: 'h0' })];
    },
    light: ['h0'],
    // 拖动价位: the line is dragged up and springs back
    fx: { t: 'keys', on: 'all', y: [-2.5] }
  },
  'vertical-line': {
    label: '垂直线', key: 'portrait', fit: 'y',
    plan: '主体：竖贯的时间线，在中间的锚点处断开；辅助：中间的锚点',
    weights: { [P]: 0.66, [S]: 0.34 },
    draw(g) {
      const k = HR + g.h + g.clear;
      return [line(g.span(12, 2, 12, 12 - k + g.h) + g.span(12, 12 + k - g.h, 12, 22), { n: 'line', role: P }), handle(g, 12, 12, { n: 'h0' })];
    },
    light: ['h0'],
    fx: { t: 'keys', on: 'all', x: [2.5] }
  },
  'parallel-channel': {
    label: '平行通道', key: 'live',
    plan: '主体：两条平行的斜线；辅助：上线起点和下线终点的两个锚点',
    weights: { [P]: 0.62, [S]: 0.38 },
    draw(g) {
      const a = [4.25, 14], b = [15, 2 + g.h], c = [9, 22 - g.h], d = [19.75, 11 - (b[1] - 3)];
      return [
        line(between(g, a, b, true, false), { n: 'l0', role: P }),
        line(between(g, c, d, false, true), { n: 'l1', role: P }),
        handle(g, ...a, { n: 'h0' }), handle(g, ...d, { n: 'h1' })
      ];
    },
    light: ['h0', 'h1'],
    fx: { t: 'draw', on: ['l0', 'l1'], stagger: 120 }
  },
  'fib-retracement': {
    label: '斐波那契回撤', key: 'square',
    plan: '主体：四条水平档位线（1、0.618、0.382、0），按比例排开；辅助：左侧从低点到高点的竖线和两端锚点',
    weights: { [P]: 0.62, [S]: 0.38 },
    draw(g) {
      const lv = [4, 10, 14, 20];
      return [
        ...lv.map((y, i) => line(g.span(10, y, 21, y), { n: `f${i}`, role: P })),
        line(between(g, [5, 18.5], [5, 5.5]), { n: 'swing', role: S }),
        handle(g, 5, 18.5, { n: 'h0' }), handle(g, 5, 5.5, { n: 'h1' })
      ];
    },
    light: ['swing', 'h0', 'h1'],
    // 回撤: the levels are drawn from the top down
    fx: { t: 'draw', on: ['f0', 'f1', 'f2', 'f3'], stagger: 90 }
  },
  'price-range': {
    label: '价格区间', key: 'square',
    plan: '主体：竖直的双向箭头，量出高度；辅助：上下两条边界线',
    weights: { [P]: 0.36, [S]: 0.64 },
    draw(g) {
      return [
        line(g.span(3, 4, 21, 4) + g.span(3, 20, 21, 20), { n: 'edges', role: S }),
        line(rangeArrow(g, false), { n: 'arrow', role: P })
      ];
    },
    light: ['arrow'],
    // 量: the arrow stretches to the edges and springs back
    fx: { t: 'keys', on: ['arrow'], o: [12, 12], sy: [1.12] }
  },
  'date-range': {
    label: '时间区间', key: 'square',
    plan: '主体：水平的双向箭头，量出宽度；辅助：左右两条边界线',
    weights: { [P]: 0.36, [S]: 0.64 },
    draw(g) {
      return [
        line(g.span(4, 3, 4, 21) + g.span(20, 3, 20, 21), { n: 'edges', role: S }),
        line(rangeArrow(g, true), { n: 'arrow', role: P })
      ];
    },
    light: ['arrow'],
    fx: { t: 'keys', on: ['arrow'], o: [12, 12], sx: [1.12] }
  },
  'long-position': {
    label: '多头仓位', key: 'square',
    ends: 'out',
    plan: '主体：方框（止盈区在上、止损区在下）；细节：开仓价横线，止盈区里一个向上的箭头',
    weights: { [P]: 0.64, [D]: 0.36 },
    draw(g) {
      return [
        shell(g.box(3, 3, 18, 18, 4), { n: 'box', role: P }),
        line(g.span(3, 15, 21, 15), { n: 'entry', role: D, on: 'box' }),
        ...posLayers(g, 15, -1)
      ];
    },
    light: ['arrow'],
    // 做多: the arrow pushes up toward the target
    fx: { t: 'keys', on: ['arrow'], y: [-1.5] }
  },
  'short-position': {
    label: '空头仓位', key: 'square',
    ends: 'out',
    plan: '主体：方框（止损区在上、止盈区在下）；细节：开仓价横线，止盈区里一个向下的箭头',
    weights: { [P]: 0.64, [D]: 0.36 },
    draw(g) {
      return [
        shell(g.box(3, 3, 18, 18, 4), { n: 'box', role: P }),
        line(g.span(3, 9, 21, 9), { n: 'entry', role: D, on: 'box' }),
        ...posLayers(g, 9, 1)
      ];
    },
    light: ['arrow'],
    fx: { t: 'keys', on: ['arrow'], y: [1.5] }
  },

  // ---------- 订单类型 ----------
  'order-limit': {
    anchor: 'base',
    label: '限价单', key: 'square',
    plan: '主体：一条价位线；辅助：从上方指向价位线的箭头（挂在这个价位等成交）',
    weights: { [P]: 0.5, [S]: 0.5 },
    draw(g) {
      const lv = 21 - g.h;
      return [line(g.span(3, lv, 21, lv), { n: 'level', role: P }), line(vArrow(g, 12, 3 + g.h, lv - g.s - g.clear), { n: 'arrow', role: S })];
    },
    light: ['arrow'],
    // 挂单: the arrow presses down onto the level
    fx: { t: 'keys', on: ['arrow'], y: [1.5] }
  },
  'order-market': {
    label: '市价单', key: 'portrait',
    allow: { keyline: 'a slanted bolt cannot fill the portrait keyline corners' },
    plan: '主体：闪电（立刻按市价成交）',
    weights: { [P]: 1 },
    draw(g) {
      return [shell(g.polygon([[14, 2], [4.5, 14], [11, 14], [10, 22], [19.5, 10], [13, 10]], 0.75), { n: 'bolt', role: P })];
    },
    fx: { t: 'beat', on: 'all', o: [12, 12] }
  },
  'order-stop': {
    label: '止损单', key: 'circle',
    ends: 'in',
    plan: '主体：八角形（停）；细节：中间一道横杠',
    weights: { [P]: 0.84, [D]: 0.16 },
    draw(g) {
      const { h } = g, a = 2 + h, b = 7.6 + h * 0.4;
      return [
        shell(g.polygon([[b, a], [24 - b, a], [24 - a, b], [24 - a, 24 - b], [24 - b, 24 - a], [b, 24 - a], [a, 24 - b], [a, b]], 1), { n: 'oct', role: P }),
        line(g.seg(7, 12, 17, 12), { n: 'bar', role: D, on: 'oct' })
      ];
    },
    light: ['bar'],
    // 触发: the bar snaps tight
    fx: { t: 'keys', on: ['bar'], o: [12, 12], sx: [0.6] }
  },
  'order-bracket': {
    label: '止盈止损', key: 'square',
    plan: '主体：中间的开仓价线；辅助：左侧把三条线括起来的括号；细节：上面的止盈线和下面的止损线',
    weights: { [P]: 0.22, [S]: 0.36, [D]: 0.42 },
    draw(g) {
      return [
        line(g.pl([[6, 4], [4, 4], [4, 20], [6, 20]]), { n: 'bracket', role: S }),
        line(g.span(8.5, 4, 21, 4), { n: 'tp', role: D }),
        line(g.span(8.5, 12, 21, 12), { n: 'entry', role: P }),
        line(g.span(8.5, 20, 21, 20), { n: 'sl', role: D })
      ];
    },
    light: ['tp', 'sl'],
    fx: { t: 'draw', on: ['tp', 'sl'], stagger: 80 }
  },
  leverage: {
    anchor: 'base',
    label: '杠杆', key: 'landscape',
    allow: { clear: 'the fulcrum touches the beam it carries', optical: 'the load sits on the long arm by design' },
    plan: '主体：横梁（杠杆）；辅助：下面的三角支点，左端压着的一块重物',
    weights: { [P]: 0.3, [S]: 0.7 },
    draw(g) {
      return [
        line(g.span(2, 11, 22, 11), { n: 'beam', role: P }),
        solid(g.area(3, 4, 5, 7, 1), { n: 'weight', role: S }),
        shell(g.polygon([[12, 11], [16.5, 20 - g.h], [7.5, 20 - g.h]], 1), { n: 'pivot', role: S })
      ];
    },
    light: ['weight'],
    // 撬动: the beam tips about the pivot and settles
    fx: { t: 'keys', on: ['beam', 'weight'], o: [12, 11], r: [-9] }
  },
  'margin-cross': {
    label: '全仓', key: 'landscape',
    plan: '主体：一个账户框；细节：框里两枚硬币（共用同一个保证金池）',
    weights: { [P]: 0.68, [D]: 0.32 },
    draw(g) {
      return [
        shell(g.box(2, 4, 20, 16, 4), { n: 'box', role: P }),
        line(g.ring(9.5, 12, 3) + g.ring(14.5, 12, 3), { n: 'coins', role: D, on: 'box', only: 'outline' }),
        solid(g.area(6.5, 9, 6, 6, 3) + g.area(11.5, 9, 6, 6, 3), { n: 'coins', role: D, on: 'box', only: 'fill' })
      ];
    },
    light: ['coins'],
    fx: { t: 'bounce', on: ['coins'], o: [12, 15], amp: 0.8 }
  },
  'margin-isolated': {
    label: '逐仓', key: 'landscape',
    plan: '主体：两枚硬币；辅助：中间一道隔墙（每个仓位的保证金互不相通）',
    weights: { [P]: 0.72, [S]: 0.28 },
    draw(g) {
      return [
        line(g.ring(5.5, 12, 3.5), { n: 'c0', role: P }), line(g.ring(18.5, 12, 3.5), { n: 'c1', role: P }),
        line(g.span(12, 4, 12, 20), { n: 'wall', role: S })
      ];
    },
    light: ['wall'],
    fx: [{ t: 'bounce', on: ['c0'], o: [5.5, 15.5], amp: 0.8 }, { t: 'bounce', on: ['c1'], o: [18.5, 15.5], amp: 0.8, delay: 90 }]
  },
  'order-book': {
    label: '盘口', key: 'square',
    plan: '主体：卖盘两档（靠右）和买盘两档（靠左），长短表示挂单量；细节：中间的最新价短线',
    weights: { [P]: 0.8, [D]: 0.2 },
    draw(g) {
      return [
        line(g.span(13, 4, 21, 4), { n: 'a0', role: P }), line(g.span(8, 8, 21, 8), { n: 'a1', role: P }),
        line(g.span(9, 12, 15, 12), { n: 'mid', role: D }),
        line(g.span(3, 16, 16, 16), { n: 'b0', role: P }), line(g.span(3, 20, 11, 20), { n: 'b1', role: P })
      ];
    },
    light: ['mid'],
    // 刷新: the levels update one after another
    fx: { t: 'draw', on: ['a0', 'a1', 'b0', 'b1'], stagger: 70 }
  },
  'depth-chart': {
    anchor: 'base',
    label: '深度图', key: 'square',
    plan: '主体：左边的买盘阶梯和右边的卖盘阶梯，向中间的成交价收拢；辅助：横轴',
    weights: { [P]: 0.68, [S]: 0.32 },
    draw(g) {
      return [
        line(g.span(3, 21 - g.h, 21, 21 - g.h), { n: 'axis', role: S }),
        line(g.pl([[3 + g.h, 4], [6, 4], [6, 9], [8, 9], [8, 14], [10, 14]]), { n: 'bids', role: P }),
        line(g.pl([[14, 14], [16, 14], [16, 9], [18, 9], [18, 4], [21 - g.h, 4]]), { n: 'asks', role: P })
      ];
    },
    light: ['axis'],
    fx: { t: 'draw', on: ['bids', 'asks'], stagger: 100 }
  }
};
