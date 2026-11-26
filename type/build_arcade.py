# SPDX-License-Identifier: MIT
# KT Arcade：两个字重，同一家族、同一套行高。
#   Regular（400）：type/arcade.py，粗笔画游戏字 → type/dist/KTArcade-Regular.{ttf,woff2}
#   Light（300）：type/arcade_light.py，原研哉的那一版，一像素细线 → type/dist/KTArcade-Light.{ttf,woff2}
# 一格 = 1/16 em（UPM 2048，一格 128），所以 16、32、48px 时一格正好 1、2、3 个像素，不糊；大写高 10 格。
#   python3 type/build_arcade.py
import pathlib, sys
import pathops
from fontTools.fontBuilder import FontBuilder
from fontTools.pens.ttGlyphPen import TTGlyphPen
from fontTools.ttLib import TTFont

here = pathlib.Path(__file__).resolve().parent
sys.path.insert(0, str(here))
import arcade, arcade_light

U, UPM = 128, 2048
BASE = 10   # 基线在第 10 行下（两个字重共用，行高一致）
# 字重 → (点阵模块, 字间格数, 空格宽, 小写写法)。粗体字间 2 格；细体放到 3 格，留白多一点。
WEIGHTS = {
    'Regular': (arcade, 2, 4, 'offset'),
    'Light': (arcade_light, 3, 5, 'desc'),
}


def place(rows, top, asc):
    """rows 从大写顶往下第 top 行开始（大写顶 = 基线以上 asc 行），返回所有墨格 (col, 从字身顶算的行)。"""
    shift = BASE - asc
    return [(c, shift + top + r) for r, line in enumerate(rows) for c, ch in enumerate(line) if ch == '#']


def glyph(cells):
    p = pathops.Path()
    for c, r in cells:   # 每格一个方块，合并后就是干净的外轮廓
        x0, y1 = (c + 1) * U, (BASE - r) * U
        q = pathops.Path(); q.moveTo(x0, y1 - U); q.lineTo(x0 + U, y1 - U); q.lineTo(x0 + U, y1); q.lineTo(x0, y1); q.close()
        p = pathops.op(p, q, pathops.PathOp.UNION) if len(p) else q
    p.simplify(); p = pathops.op(p, pathops.Path(), pathops.PathOp.UNION)
    pen = TTGlyphPen(None)
    p.draw(pen)
    return pen.glyph()


def build(style):
    M, gap, space, lower = WEIGHTS[style]
    A = M.ASC
    table = {}
    for ch, rows in {**M.CAPS, **M.DIGITS}.items():
        table[ch] = place(rows, 0, A)
    for ch, (k, rows) in M.LOWER.items():
        desc = (3 if k == -3 else 0) if lower == 'offset' else k
        table[ch] = place(rows, A - (len(rows) - desc), A)
    for ch, (top, rows) in M.PUNCT.items():
        table[ch] = place(rows, top, A)
    order, glyphs, hm, cmap = ['.notdef', 'space'], {}, {}, {32: 'space'}
    pen = TTGlyphPen(None); glyphs['.notdef'] = pen.glyph(); hm['.notdef'] = (6 * U, 0)
    pen = TTGlyphPen(None); glyphs['space'] = pen.glyph(); hm['space'] = (space * U, 0)
    cmap[0xA0] = 'space'
    for ch, cells in table.items():
        name = f'uni{ord(ch):04X}'
        w = max(c for c, _ in cells) + 1
        order.append(name); glyphs[name] = glyph(cells); hm[name] = ((w + gap) * U, U); cmap[ord(ch)] = name
    fb = FontBuilder(UPM, isTTF=True)
    fb.setupGlyphOrder(order); fb.setupCharacterMap(cmap); fb.setupGlyf(glyphs); fb.setupHorizontalMetrics(hm)
    fb.setupHorizontalHeader(ascent=12 * U, descent=-4 * U)
    fb.setupNameTable({
        'familyName': 'KT Arcade', 'styleName': style, 'uniqueFontIdentifier': f'KATANA:KT Arcade {style}:0.1',
        'fullName': f'KT Arcade {style}', 'psName': f'KTArcade-{style}', 'version': 'Version 0.100',
        'copyright': 'Copyright 2026 XartLab (KATANA)', 'designer': 'KATANA',
        'licenseDescription': 'This Font Software is licensed under the SIL Open Font License, Version 1.1.',
        'licenseInfoURL': 'https://openfontlicense.org',
        'description': 'Bold pixel display type for game-feel moments in the KATANA workbench. Latin, digits and common symbols, all drawn by KATANA.',
    })
    fb.setupOS2(sTypoAscender=12 * U, sTypoDescender=-4 * U, sTypoLineGap=0, usWinAscent=12 * U, usWinDescent=4 * U, sxHeight=(8 if style == 'Regular' else 6) * U, sCapHeight=A * U, fsType=0, usWeightClass=400 if style == 'Regular' else 300)
    fb.setupPost(); fb.setupHead(unitsPerEm=UPM, created=0x0E4B3B1C0, modified=0x0E4B3B1C0)
    out = here / 'dist'; out.mkdir(exist_ok=True)
    fb.save(out / f'KTArcade-{style}.ttf')
    f = TTFont(out / f'KTArcade-{style}.ttf'); f.flavor = 'woff2'; f.save(out / f'KTArcade-{style}.woff2')
    return len(order)


if __name__ == '__main__':
    for st in WEIGHTS:
        print(f'KT Arcade {st}:', build(st), 'glyphs')
