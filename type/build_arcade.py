# SPDX-License-Identifier: MIT
# KT Arcade：type/arcade.py 的点阵 → type/dist/KTArcade-Regular.{ttf,woff2}。
# 一格 = 1/16 em（UPM 2048，一格 128），所以 16、32、48px 时一格正好 1、2、3 个像素，不糊；大写高 10 格。
#   python3 type/build_arcade.py
import pathlib, sys
import pathops
from fontTools.fontBuilder import FontBuilder
from fontTools.pens.ttGlyphPen import TTGlyphPen
from fontTools.ttLib import TTFont

here = pathlib.Path(__file__).resolve().parent
sys.path.insert(0, str(here))
from arcade import CAPS, LOWER, DIGITS, PUNCT, ASC

U, UPM, GAP = 128, 2048, 2          # 一格、字身、字间 2 格（粗笔画要宽一点的字距才不挤）


def place(rows, top):
    """rows 从大写顶往下第 top 行开始，返回所有墨格 (col, row)。"""
    return [(c, top + r) for r, line in enumerate(rows) for c, ch in enumerate(line) if ch == '#']


def glyph(cells):
    p = pathops.Path()
    for c, r in cells:   # 每格一个方块，合并后就是干净的外轮廓
        x0, y1 = (c + 1) * U, (ASC - r) * U
        q = pathops.Path(); q.moveTo(x0, y1 - U); q.lineTo(x0 + U, y1 - U); q.lineTo(x0 + U, y1); q.lineTo(x0, y1); q.close()
        p = pathops.op(p, q, pathops.PathOp.UNION) if len(p) else q
    p.simplify(); p = pathops.op(p, pathops.Path(), pathops.PathOp.UNION)
    pen = TTGlyphPen(None)
    p.draw(pen)
    return pen.glyph()


def build():
    table = {}
    for ch, rows in {**CAPS, **DIGITS}.items():
        table[ch] = place(rows, 0)
    for ch, (off, rows) in LOWER.items():
        desc = 3 if off == -3 else 0
        table[ch] = place(rows, ASC - (len(rows) - desc))
    for ch, (top, rows) in PUNCT.items():
        table[ch] = place(rows, top)
    order, glyphs, hm, cmap = ['.notdef', 'space'], {}, {}, {32: 'space'}
    pen = TTGlyphPen(None); glyphs['.notdef'] = pen.glyph(); hm['.notdef'] = (6 * U, 0)
    pen = TTGlyphPen(None); glyphs['space'] = pen.glyph(); hm['space'] = (4 * U, 0)
    cmap[0xA0] = 'space'
    for ch, cells in table.items():
        name = f'uni{ord(ch):04X}'
        w = max(c for c, _ in cells) + 1
        order.append(name); glyphs[name] = glyph(cells); hm[name] = ((w + GAP) * U, U); cmap[ord(ch)] = name
    fb = FontBuilder(UPM, isTTF=True)
    fb.setupGlyphOrder(order); fb.setupCharacterMap(cmap); fb.setupGlyf(glyphs); fb.setupHorizontalMetrics(hm)
    fb.setupHorizontalHeader(ascent=12 * U, descent=-4 * U)
    fb.setupNameTable({
        'familyName': 'KT Arcade', 'styleName': 'Regular', 'uniqueFontIdentifier': 'KATANA:KT Arcade:0.1',
        'fullName': 'KT Arcade', 'psName': 'KTArcade-Regular', 'version': 'Version 0.100',
        'copyright': 'Copyright 2026 XartLab (KATANA)', 'designer': 'KATANA',
        'licenseDescription': 'This Font Software is licensed under the SIL Open Font License, Version 1.1.',
        'licenseInfoURL': 'https://openfontlicense.org',
        'description': 'Bold pixel display type for game-feel moments in the KATANA workbench. Latin, digits and common symbols, all drawn by KATANA.',
    })
    fb.setupOS2(sTypoAscender=12 * U, sTypoDescender=-4 * U, sTypoLineGap=0, usWinAscent=12 * U, usWinDescent=4 * U, sxHeight=8 * U, sCapHeight=10 * U, fsType=0)
    fb.setupPost(); fb.setupHead(unitsPerEm=UPM, created=0x0E4B3B1C0, modified=0x0E4B3B1C0)
    out = here / 'dist'; out.mkdir(exist_ok=True)
    fb.save(out / 'KTArcade-Regular.ttf')
    f = TTFont(out / 'KTArcade-Regular.ttf'); f.flavor = 'woff2'; f.save(out / 'KTArcade-Regular.woff2')
    return len(order)


if __name__ == '__main__':
    print('KT Arcade:', build(), 'glyphs')
