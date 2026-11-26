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
  },
  // ---------- 图表类型 ----------
  candles: {
    anchor: 'base',
    label: 'K 线', key: 'square',
    plan: '主体：两根蜡烛，左边阳线空心、右边阴线实心，各带上下影线（中国习惯红涨绿跌靠颜色，不靠形状）',
    weights: { [P]: 1 },
    draw(g) {
      return [
        line(g.span(7, 3, 7, 8) + g.span(7, 17, 7, 21), { n: 'wk0', role: P, part: 'c0' }),
        shell(g.box(3, 8, 8, 9, 1.5), { n: 'bd0', role: P, part: 'c0' }),
        line(g.span(17, 3, 17, 6) + g.span(17, 15, 17, 19), { n: 'wk1', role: P, part: 'c1' }),
        solid(g.area(13, 6, 8, 9, 1.5), { n: 'bd1', role: P, part: 'c1' })
      ];
    },
    light: ['wk0', 'bd0'],
    // 跳一下: the falling candle drops and comes back
    fx: { t: 'keys', on: ['wk1', 'bd1'], y: [1.5] }
  },
  'ohlc-bars': {
    label: '美国线', key: 'square',
    plan: '主体：两根竖线（最高到最低）；辅助：左边短横是开盘价，右边短横是收盘价',
    weights: { [P]: 0.6, [S]: 0.4 },
    draw(g) {
      return [
        line(g.span(7, 3, 7, 17), { n: 'b0', role: P }), line(g.span(17, 7, 17, 21), { n: 'b1', role: P }),
        line(g.span(3, 13, 7, 13) + g.span(7, 6, 11, 6), { n: 't0', role: S, part: 'b0' }),
        line(g.span(13, 16, 17, 16) + g.span(17, 10, 21, 10), { n: 't1', role: S, part: 'b1' })
      ];
    },
    light: ['t0', 't1'],
    fx: { t: 'keys', on: ['b1', 't1'], y: [-1.5] }
  },
  'heikin-ashi': {
    anchor: 'base',
    label: '平均 K 线', key: 'square',
    allow: { clear: 'the wicks grow out of the bodies' },
    plan: '主体：三根实心 K 线一级级抬高，每根从上一根的中间开盘、连成平滑的台阶（没有缺口）；辅助：上影线',
    weights: { [P]: 0.84, [S]: 0.16 },
    draw(g) {
      return [
        solid(g.area(3, 14, 4, 7, 1) + g.area(10, 10, 4, 7, 1) + g.area(17, 6, 4, 7, 1), { n: 'bodies', role: P }),
        line(g.span(5, 11, 5, 14) + g.span(12, 7, 12, 10) + g.span(19, 3, 19, 6), { n: 'wicks', role: S, part: 'bodies' })
      ];
    },
    fx: { t: 'keys', on: ['bodies', 'wicks'], y: [-1.5] }
  },
  renko: {
    label: '砖形图', key: 'square',
    plan: '主体：三块等大的方砖沿对角线一级级上去，角挨着角（砖形图只看价格走够一格，不看时间）',
    weights: { [P]: 1 },
    draw(g) {
      return [shell(g.box(3, 15, 6, 6, 1) + g.box(9, 9, 6, 6, 1) + g.box(15, 3, 6, 6, 1), { n: 'bricks', role: P })];
    },
    allow: { optical: 'the bricks climb on a diagonal' },
    fx: { t: 'keys', on: ['bricks'], y: [-1.5] }
  },
  oscillator: {
    label: '震荡指标', key: 'square',
    plan: '主体：一条在两条界线之间来回摆的曲线（RSI、KDJ 这一类）；辅助：上下两条超买、超卖线',
    weights: { [P]: 0.64, [S]: 0.36 },
    draw(g) {
      const pts = Array.from({ length: 25 }, (_, i) => { const x = 3 + g.h + i * (18 - g.s) / 24; return [x, 12 - (9 - g.h) * Math.sin((i / 24) * Math.PI * 3 + 0.5)]; });
      return [
        line(g.span(3, 8, 21, 8) + g.span(3, 16, 21, 16), { n: 'bands', role: S }),
        line(g.pl(pts), { n: 'wave', role: P, part: 'bands' })
      ];
    },
    light: ['bands'],
    fx: { t: 'draw', on: ['wave'] }
  },
  // ---------- 订单流 ----------
  footprint: {
    label: '足迹图', key: 'square',
    allow: { sliver: 'in the bold fill the rows of the ladder leave thin rungs between them' },
    plan: '主体：一根 K 线的外框；细节：中线两边每个价位各一条短横，左边是主动卖、右边是主动买，长短表示成交量',
    weights: { [P]: 0.72, [D]: 0.28 },
    draw(g) {
      const L = 3 + g.s + g.clear;
      return [
        shell(g.box(3, 3, 18, 18, 3.5), { n: 'box', role: P }),
        line(g.span(8.5, 8, 10.5, 8) + g.span(L, 12, 10.5, 12) + g.span(7.5, 16, 10.5, 16), { n: 'bid', role: D, on: 'box' }),
        line(g.span(13.5, 8, 15.5, 8) + g.span(13.5, 12, 24 - L, 12) + g.span(13.5, 16, 16.5, 16), { n: 'ask', role: D, on: 'box' })
      ];
    },
    light: ['bid'],
    fx: { t: 'draw', on: ['bid', 'ask'], stagger: 90 }
  },
  'volume-profile': {
    label: '成交量分布', key: 'square',
    plan: '主体：最长的那一档（成交最多的价位 POC）；辅助：其余各价位的横条，从左边对齐，长短表示成交量',
    allow: { optical: 'the levels are aligned to the price axis on the left' },
    weights: { [P]: 0.38, [S]: 0.62 },
    draw(g) {
      return [
        line(g.span(3, 4, 9, 4) + g.span(3, 8, 14, 8) + g.span(3, 16, 12, 16) + g.span(3, 20, 7, 20), { n: 'bars', role: S }),
        line(g.span(3, 12, 21, 12), { n: 'poc', role: P })
      ];
    },
    light: ['bars'],
    fx: { t: 'draw', on: ['poc'] }
  },
  // ---------- 合约 ----------
  'funding-rate': {
    label: '资金费率', key: 'circle',
    plan: '主体：一圈带箭头的循环（每 8 小时结算一次）；细节：圈里的百分号',
    weights: { [P]: 0.77, [D]: 0.23 },
    draw(g) {
      const r = 10 - g.h, a = (330 * Math.PI) / 180, T = [12 + r * Math.cos(a), 12 + r * Math.sin(a)], d = [-Math.sin(a), Math.cos(a)], m = [Math.cos(a), Math.sin(a)], w = 2.6;
      return [
        line(g.arc(12, 12, r, 30, 330) + g.pl([[T[0] - w * d[0] + w * m[0], T[1] - w * d[1] + w * m[1]], T, [T[0] - w * d[0] - w * m[0], T[1] - w * d[1] - w * m[1]]]), { n: 'cycle', role: P }),
        line(g.seg(14, 10, 10, 14), { n: 'slash', role: D }),
        solid(g.dot(9, 9, 0.8) + g.dot(15, 15, 0.8), { n: 'dots', role: D })
      ];
    },
    light: ['slash', 'dots'],
    fx: { t: 'keys', on: ['cycle'], o: [12, 12], r: [20] }
  },
  'open-interest': {
    label: '持仓量', key: 'circle',
    allow: { sliver: 'in the bold fill the strip between the two arrows is the line between longs and shorts' },
    plan: '主体：外圈；细节：圈里一上一下两支箭头（多空双方没平的仓）',
    weights: { [P]: 0.72, [D]: 0.28 },
    draw(g) {
      return [
        shell(g.ring(12, 12, 10), { n: 'ring', role: P }),
        line(vArrow(g, 9, 15, 9, 1.5), { n: 'long', role: D, on: 'ring' }),
        line(vArrow(g, 15, 9, 15, 1.5), { n: 'short', role: D, on: 'ring' })
      ];
    },
    light: ['short'],
    fx: [{ t: 'keys', on: ['long'], y: [-1.5] }, { t: 'keys', on: ['short'], y: [1.5], delay: 80 }]
  },
  perpetual: {
    label: '永续合约', key: 'landscape',
    plan: '主体：一条伯努利双纽线（∞），没有交割日',
    weights: { [P]: 1 },
    draw(g) {
      const A = 10 - g.h, pts = Array.from({ length: 73 }, (_, i) => { const t = (i / 72) * Math.PI * 2, d = 1 + Math.sin(t) ** 2; return [12 + (A * Math.cos(t)) / d, 12 + (A * Math.sin(t) * Math.cos(t)) / d * ((8 - g.h) / 3.18)]; });
      return [line(g.pl(pts, true), { n: 'inf', role: P })];
    },
    fx: { t: 'draw', on: ['inf'] }
  },
  liquidation: {
    label: '强平', key: 'square',
    allow: { optical: 'the price falls onto the level at the bottom' },
    plan: '主体：一路下跌的价格线；辅助：强平价那条线；细节：价格碰到线的地方炸开三道',
    weights: { [P]: 0.37, [S]: 0.38, [D]: 0.25 },
    draw(g) {
      return [
        line(g.span(3, 20, 21, 20), { n: 'level', role: S }),
        line(g.pl([[3 + g.h, 4], [8, 9], [11, 7], [14, 15]]), { n: 'price', role: P }),
        line([-100, -40, 10].map((d) => { const c = Math.cos(d * Math.PI / 180), q = Math.sin(d * Math.PI / 180); return g.seg(14 + 3.4 * c, 15 + 3.4 * q, 14 + 6 * c, 15 + 6 * q); }).join(''), { n: 'burst', role: D })
      ];
    },
    light: ['level'],
    fx: { t: 'keys', on: ['burst'], o: [14, 15], s: [1.25] }
  },
  'price-tag': {
    label: '标记价格', key: 'landscape',
    allow: { optical: 'the tag sits on the price axis at the right' },
    plan: '主体：价格轴上的价签（尖头朝左指着价位）；辅助：伸向左边的价位线',
    weights: { [P]: 0.88, [S]: 0.12 },
    draw(g) {
      const t = 4 + g.h, b = 20 - g.h, r = 22 - g.h, tip = 9.5;
      return [
        line(g.span(2, 12, tip - g.h - g.clear, 12), { n: 'level', role: S }),
        shell(g.polygon([[tip, 12], [14, t], [r, t], [r, b], [14, b]], 1.5), { n: 'tag', role: P })
      ];
    },
    light: ['level'],
    fx: { t: 'keys', on: ['tag'], x: [-1.5] }
  },
  'trailing-stop': {
    label: '跟踪止损', key: 'square',
    plan: '主体：上涨的价格线；辅助：下面一级级跟着抬高的止损线（只升不降）',
    weights: { [P]: 0.45, [S]: 0.55 },
    draw(g) {
      return [
        line(g.pl([[3 + g.h, 12], [8, 7], [11, 8.5], [21 - g.h, 3 + g.h]]), { n: 'price', role: P }),
        line(g.pl([[3 + g.h, 21 - g.h], [9, 21 - g.h], [9, 16], [15, 16], [15, 11], [21 - g.h, 11]]), { n: 'stop', role: S })
      ];
    },
    light: ['stop'],
    fx: { t: 'draw', on: ['stop'] }
  },
  iceberg: {
    label: '冰山单', key: 'square',
    plan: '主体：水面上露出的小尖；辅助：水面线；细节：水下大得多的冰体（挂出来的只是一小部分）',
    weights: { [P]: 0.28, [S]: 0.3, [D]: 0.42 },
    draw(g) {
      const w = 12;
      return [
        line(g.span(3, w, 21, w), { n: 'water', role: S }),
        shell(g.polygon([[7.5, w - g.s - g.clear - 0.5], [12, 3 + g.h * 0.6], [16.5, w - g.s - g.clear - 0.5]], 1), { n: 'tip', role: P }),
        line(g.pl([[6.5, w + 2 * g.s + g.clear], [4 + g.h, 17], [9, 21 - g.h], [15, 21 - g.h], [20 - g.h, 16.5], [17.5, w + 2 * g.s + g.clear]]), { n: 'body', role: D })
      ];
    },
    light: ['body'],
    fx: { t: 'keys', on: ['tip'], y: [-1.2] }
  }
};
