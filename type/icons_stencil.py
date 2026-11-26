# SPDX-License-Identifier: MIT
# 模板字风格的交易图标：跟 KT Stencil 同一套骨架 + 断桥规则，24 网格，线宽 2。
#   python3 type/icons_stencil.py → packages/static/svg/stencil/<name>.svg
import pathlib, sys, json
here = pathlib.Path(__file__).resolve().parent
sys.path.insert(0, str(here))
from build_font import outline
from fontTools.pens.svgPathPen import SVGPathPen

def sq(cx, cy, r): return [[cx - r, cy - r], [cx + r, cy - r], [cx + r, cy + r], [cx - r, cy + r], [cx - r, cy - r]]
def box(x0, y0, x1, y1): return [[x0, y0], [x1, y0], [x1, y1], [x0, y1], [x0, y0]]
def oct_(cx, cy, r):
    k = r * 0.42
    return [[cx - k, cy - r], [cx + k, cy - r], [cx + r, cy - k], [cx + r, cy + k], [cx + k, cy + r], [cx - k, cy + r], [cx - r, cy + k], [cx - r, cy - k], [cx - k, cy - r]]
def flipv(strokes): return [[[x, 24 - y] for x, y in pl] for pl in strokes]
def rot(strokes): return [[[y, x] for x, y in pl] for pl in strokes]

price_range = [[[3, 3], [21, 3]], [[3, 21], [21, 21]], [[12, 7], [12, 17]], [[9, 10], [12, 7], [15, 10]], [[9, 14], [12, 17], [15, 14]]]
long_pos = [box(3, 3, 21, 21), [[3, 15], [21, 15]], [[12, 12], [12, 6]], [[9, 9], [12, 6], [15, 9]]]
ICONS = {
 'trend-line': [sq(5, 19, 2), sq(19, 5, 2), [[7, 17], [17, 7]]],
 'ray': [sq(5, 12, 2), [[7, 12], [20, 12]], [[16, 8], [20, 12], [16, 16]]],
 'horizontal-line': [[[2, 12], [22, 12]], sq(12, 12, 2.5)],
 'vertical-line': [[[12, 2], [12, 22]], sq(12, 12, 2.5)],
 'parallel-channel': [[[3, 15], [15, 3]], [[9, 21], [21, 9]], sq(4, 14, 1.5), sq(20, 10, 1.5)],
 'fib-retracement': [[[4, 3], [4, 21]], [[4, 4], [21, 4]], [[4, 10], [21, 10]], [[4, 14], [21, 14]], [[4, 20], [21, 20]]],
 'price-range': price_range,
 'date-range': rot(price_range),
 'long-position': long_pos,
 'short-position': flipv(long_pos),
 'order-limit': [[[3, 20], [21, 20]], [[12, 3], [12, 16]], [[8, 12], [12, 16], [16, 12]]],
 'order-market': [[[14, 2], [5, 13], [11, 13], [10, 22], [19, 10], [13, 10], [14, 2]]],
 'order-stop': [oct_(12, 12, 10), [[7, 12], [17, 12]]],
 'order-bracket': [[[7, 3], [3, 3], [3, 21], [7, 21]], [[9, 3], [21, 3]], [[9, 12], [21, 12]], [[9, 21], [21, 21]]],
 'trailing-stop': [[[3, 12], [8, 7], [11, 9], [21, 3]], [[3, 21], [9, 21], [9, 17], [15, 17], [15, 13], [21, 13]]],
 'iceberg': [[[2, 10], [22, 10]], [[8, 7.5], [12, 3], [16, 7.5], [8, 7.5]], [[6, 12.5], [3, 17], [7, 21], [17, 21], [21, 17], [18, 12.5]]],
 'leverage': [[[2, 11], [22, 11]], [[12, 11], [8, 19], [16, 19], [12, 11]], box(3, 4, 8, 9)],
 'margin-cross': [box(2, 5, 22, 19), oct_(9.5, 12, 3.5), oct_(14.5, 12, 3.5)],
 'margin-isolated': [oct_(5.5, 12, 3.5), oct_(18.5, 12, 3.5), [[12, 3], [12, 21]]],
 'perpetual': [[[12, 12], [8, 8], [5, 8], [2, 11], [2, 13], [5, 16], [8, 16], [16, 8], [19, 8], [22, 11], [22, 13], [19, 16], [16, 16], [12, 12]]],
 'funding-rate': [[[16, 3], [8, 3], [3, 8], [3, 16], [8, 21], [16, 21], [21, 16], [21, 10]], [[18.5, 12.5], [21, 10], [23.5, 12.5]], [[15, 9], [9, 15]], sq(9, 9, 1), sq(15, 15, 1)],
 'open-interest': [oct_(12, 12, 10), [[9, 16], [9, 8]], [[7, 10], [9, 8], [11, 10]], [[15, 8], [15, 16]], [[13, 14], [15, 16], [17, 14]]],
 'liquidation': [[[2, 21], [22, 21]], [[3, 4], [8, 9], [11, 7], [14, 15]], [[17, 16], [20, 16]], [[16.5, 12.5], [19, 10]], [[14, 11], [14, 8]]],
 'price-tag': [[[2, 12], [6, 12]], [[9, 12], [14, 6], [22, 6], [22, 18], [14, 18], [9, 12]]],
 'candles': [[[7, 3], [7, 7]], [[7, 17], [7, 21]], box(4, 7, 10, 17), [[17, 3], [17, 6]], [[17, 15], [17, 19]], box(14, 6, 20, 15), [[17, 8.5], [17, 12.5]]],
 'ohlc-bars': [[[7, 3], [7, 17]], [[3, 13], [7, 13]], [[7, 6], [11, 6]], [[17, 7], [17, 21]], [[13, 16], [17, 16]], [[17, 10], [21, 10]]],
 'heikin-ashi': [box(3, 14, 7, 21), box(10, 10, 14, 17), box(17, 6, 21, 13), [[5, 11], [5, 14]], [[12, 7], [12, 10]], [[19, 3], [19, 6]]],
 'renko': [box(3, 15, 9, 21), box(9, 9, 15, 15), box(15, 3, 21, 9)],
 'oscillator': [[[2, 8], [22, 8]], [[2, 16], [22, 16]], [[3, 12], [6, 5], [10, 19], [14, 5], [18, 19], [21, 12]]],
 'order-book': [[[13, 4], [21, 4]], [[8, 8], [21, 8]], [[9, 12], [15, 12]], [[3, 16], [16, 16]], [[3, 20], [11, 20]]],
 'depth-chart': [[[2, 21], [22, 21]], [[3, 4], [6, 4], [6, 9], [8, 9], [8, 14], [10, 14]], [[14, 14], [16, 14], [16, 9], [18, 9], [18, 4], [21, 4]]],
 'footprint': [box(3, 3, 21, 21), [[12, 6], [12, 18]], [[7, 8], [10, 8]], [[6, 12], [10, 12]], [[8, 16], [10, 16]], [[14, 8], [16, 8]], [[14, 12], [18, 12]], [[14, 16], [17, 16]]],
 'volume-profile': [[[3, 2], [3, 22]], [[3, 4], [9, 4]], [[3, 8], [14, 8]], [[3, 12], [21, 12]], [[3, 16], [12, 16]], [[3, 20], [7, 20]]],
}

def svg_d(strokes, w=2.0, stencil=True):
    p = outline(strokes, lambda x, y: (x, y), w, stencil, gap=0.35, closed_min=11)
    pen = SVGPathPen(None, ntos=lambda v: ('%.2f' % v).rstrip('0').rstrip('.'))
    p.draw(pen)
    return pen.getCommands()

if __name__ == '__main__':
    out = here.parent / 'packages/static/svg/stencil'; out.mkdir(parents=True, exist_ok=True)
    data = {}
    for n, st in ICONS.items():
        d = svg_d(st); data[n] = d
        (out / f'{n}.svg').write_text(f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="currentColor"><path d="{d}" fill-rule="nonzero"/></svg>')
    (here / 'dist').mkdir(exist_ok=True)
    (here / 'dist/stencil-icons.json').write_text(json.dumps(data))
    print(len(data))
