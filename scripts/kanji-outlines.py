# SPDX-License-Identifier: MIT
# 把 Dela Gothic One 里的汉字代号转成 24 网格的轮廓路径，写 line/kanji.json 和 packages/static/svg/kanji/。
#   python3 scripts/kanji-outlines.py <DelaGothicOne-Regular.ttf>
import json, sys, pathlib
from fontTools.ttLib import TTFont
from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.pens.transformPen import TransformPen
from fontTools.pens.boundsPen import BoundsPen
root = pathlib.Path(__file__).resolve().parent.parent
MAP = json.loads((root / 'line/kanji-map.json').read_text(encoding='utf-8'))
f = TTFont(sys.argv[1]); gs = f.getGlyphSet(); cmap = f.getBestCmap()
xs, ys = [], []
for c in MAP.values():
    bp = BoundsPen(gs); gs[cmap[ord(c)]].draw(bp); x0, y0, x1, y1 = bp.bounds; xs += [x0, x1]; ys += [y0, y1]
# 所有字共用一个框：并集外框缩进 2..22，字和字一样大、基线一致
side = max(max(xs) - min(xs), max(ys) - min(ys)); k = 20 / side; cx = (min(xs) + max(xs)) / 2; cy = (min(ys) + max(ys)) / 2
out = {}
(root / 'packages/static/svg/kanji').mkdir(parents=True, exist_ok=True)
for name, c in MAP.items():
    sp = SVGPathPen(gs, ntos=lambda v: ('%.2f' % v).rstrip('0').rstrip('.'))
    gs[cmap[ord(c)]].draw(TransformPen(sp, (k, 0, 0, -k, 12 - cx * k, 12 + cy * k)))
    out[name] = {'char': c, 'd': sp.getCommands()}
    (root / f'packages/static/svg/kanji/{name}.svg').write_text(f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="currentColor"><path d="{out[name]["d"]}"/></svg>')
(root / 'line/kanji.json').write_text(json.dumps(out, ensure_ascii=False))
print(len(out))
