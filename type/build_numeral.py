# SPDX-License-Identifier: MIT
# KT Numeral：只为价格画的数字字体（2026-11-26，原研哉的思路：交易软件里被看得最多的字是价格，就为它单独做一套）。
#   python3 type/build_numeral.py   → type/dist/KTNumeral-{Light,Regular,Medium}.{ttf,woff2}
# 做法：先画每个数字的中心线（直线 + 圆弧），再按线宽描出轮廓，一套骨架出三个字重。
# 规矩：
# - 单线、几何、像尺子和仪表上的刻度字；线头平切（butt），转角尖。
# - 数字等宽（600），一列价格竖着对齐；小数点、逗号、冒号是窄的（300），不在数字之间撑出大洞。
# - 0 是跑道形，8 是上小下大的两个圆，靠形状分开，不加斜线和点。
# - 小数点是一个有分量的方块（约两倍线宽），跟图标的座舱灯一个语言。
# - 只有数字和价格里会出现的符号；字母由 CSS 落回别的字体（unicode-range）。
import math, pathlib
import pathops
from fontTools.fontBuilder import FontBuilder
from fontTools.pens.ttGlyphPen import TTGlyphPen
from fontTools.ttLib import TTFont

UPM, H, ADV, NARROW, AXIS = 1000, 700, 600, 300, 330   # 字身、数字高、数字宽、窄符号宽、加减号的高度
WEIGHTS = {'Light': (300, 52), 'Regular': (400, 70), 'Medium': (500, 90)}


class Sk:
    """中心线：若干条开放或闭合的折线 / 圆弧。坐标是字体坐标（y 向上）。"""
    def __init__(self):
        self.p = pathops.Path(); self.cur = None

    def move(self, x, y):
        self.p.moveTo(x, y); self.cur = (x, y); return self

    def line(self, x, y):
        self.p.lineTo(x, y); self.cur = (x, y); return self

    def arc(self, cx, cy, r, a0, a1):
        """从 a0 度到 a1 度（可逆时针或顺时针），每段不超过 90° 用三次贝塞尔近似。起点若不在当前点就先连线。"""
        sx, sy = cx + r * math.cos(math.radians(a0)), cy + r * math.sin(math.radians(a0))
        if self.cur is None: self.move(sx, sy)
        elif math.hypot(self.cur[0] - sx, self.cur[1] - sy) > 0.5: self.line(sx, sy)
        n = max(1, math.ceil(abs(a1 - a0) / 90)); step = (a1 - a0) / n
        for i in range(n):
            t0, t1 = math.radians(a0 + i * step), math.radians(a0 + (i + 1) * step)
            k = 4 / 3 * math.tan((t1 - t0) / 4)
            p0 = (cx + r * math.cos(t0), cy + r * math.sin(t0)); p3 = (cx + r * math.cos(t1), cy + r * math.sin(t1))
            c1 = (p0[0] - k * r * math.sin(t0), p0[1] + k * r * math.cos(t0))
            c2 = (p3[0] + k * r * math.sin(t1), p3[1] - k * r * math.cos(t1))
            self.p.cubicTo(*c1, *c2, *p3); self.cur = p3
        return self

    def close(self):
        self.p.close(); self.cur = None; return self

    def end(self):
        self.cur = None; return self


def digits():
    D = {}
    s = Sk(); s.move(475, 175).line(475, 525).arc(300, 525, 175, 0, 180).line(125, 175).arc(300, 175, 175, 180, 360).close(); D['0'] = s
    s = Sk(); s.move(175, 575).line(330, 700).line(330, 0); D['1'] = s
    s = Sk(); s.arc(300, 515, 185, 160, -25).line(100, 0).line(500, 0); D['2'] = s
    s = Sk(); s.move(115, 700).line(480, 700).line(272, 430).arc(300, 215, 215, 97.5, -150); D['3'] = s
    s = Sk(); s.move(400, 0).line(400, 700).line(100, 230).line(505, 230); D['4'] = s
    s = Sk(); s.move(470, 700).line(150, 700).line(135, 395).arc(300, 220, 220, 133, -150); D['5'] = s
    s = Sk(); s.move(300, 200 + 200).arc(300, 200, 200, 90, 450).close(); s.move(445, 700).line(128, 300); D['6'] = s
    s = Sk(); s.move(300, 500 - 200).arc(300, 500, 200, 270, 630).close(); s.move(155, 0).line(472, 400); D['9'] = s
    s = Sk(); s.move(100, 700).line(500, 700).line(225, 0); D['7'] = s
    s = Sk(); s.arc(300, 530, 170, 270, 630).close(); s.arc(300, 182, 182, 90, 450).close(); D['8'] = s
    return D


def symbols():
    S = {}
    s = Sk(); s.move(300, AXIS - 200).line(300, AXIS + 200); s.end(); s.move(100, AXIS).line(500, AXIS); S['+'] = (s, ADV)
    s = Sk(); s.move(120, AXIS).line(480, AXIS); S['-'] = (s, ADV); S['−'] = (s, ADV)
    s = Sk(); s.arc(175, 565, 95, 0, 360).close(); s.arc(425, 135, 95, 0, 360).close(); s.move(130, 0).line(470, 700); S['%'] = (s, ADV)
    s = Sk(); s.move(130, 0).line(470, 700); S['/'] = (s, ADV)
    s = Sk(); s.arc(610, 350, 470, 140, 220); S['('] = (s, 380)
    s = Sk(); s.arc(-230, 350, 470, 40, -40); S[')'] = (s, 380)
    return S


def square(cx, y0, side):
    p = pathops.Path(); p.moveTo(cx - side / 2, y0); p.lineTo(cx + side / 2, y0); p.lineTo(cx + side / 2, y0 + side); p.lineTo(cx - side / 2, y0 + side); p.close()
    return p


def stroked(sk, w):
    q = pathops.Path(sk.p)
    q.stroke(w, pathops.LineCap.BUTT_CAP, pathops.LineJoin.MITER_JOIN, 4)
    return q


def union(paths):
    out = pathops.Path()
    for p in paths:
        out = pathops.op(out, p, pathops.PathOp.UNION) if len(out) else p
    out.simplify()
    return out


def tt(path):
    pen = TTGlyphPen(None); path.draw(pen); return pen.glyph()


def build(style):
    weight, w = WEIGHTS[style]
    dot = 2 * w + 16
    glyphs, hm, cmap, order = {}, {}, {}, ['.notdef', 'space', 'figurespace']
    glyphs['.notdef'] = TTGlyphPen(None).glyph(); hm['.notdef'] = (ADV, 0)
    glyphs['space'] = TTGlyphPen(None).glyph(); hm['space'] = (NARROW, 0); cmap[32] = 'space'; cmap[0xA0] = 'space'
    glyphs['figurespace'] = TTGlyphPen(None).glyph(); hm['figurespace'] = (ADV, 0); cmap[0x2007] = 'figurespace'

    def add(ch, path, adv):
        name = f'uni{ord(ch):04X}'; g = tt(path); glyphs[name] = g; order.append(name); cmap[ord(ch)] = name
        hm[name] = (adv, 0)

    for ch, sk in digits().items():
        add(ch, union([stroked(sk, w)]), ADV)
    for ch, (sk, adv) in symbols().items():
        add(ch, union([stroked(sk, w)]), adv)
    add('.', square(NARROW / 2, 0, dot), NARROW)
    tail = Sk(); tail.move(NARROW / 2 + dot / 2 - w / 2, dot * 0.2).line(NARROW / 2 - dot / 2, -170)
    add(',', union([square(NARROW / 2, 0, dot), stroked(tail, w)]), NARROW)
    add(':', union([square(NARROW / 2, 70, dot), square(NARROW / 2, 470, dot)]), NARROW)

    fb = FontBuilder(UPM, isTTF=True)
    fb.setupGlyphOrder(order); fb.setupCharacterMap(cmap); fb.setupGlyf(glyphs)
    glyf = fb.font['glyf']
    for n in order:   # 左边距 = 轮廓最左点
        g = glyf[n]; g.recalcBounds(glyf); hm[n] = (hm[n][0], getattr(g, 'xMin', 0) or 0)
    fb.setupHorizontalMetrics(hm)
    fb.setupHorizontalHeader(ascent=900, descent=-250)
    fb.setupNameTable({
        'familyName': 'KT Numeral', 'styleName': style, 'uniqueFontIdentifier': f'KATANA:KT Numeral {style}:0.1',
        'fullName': f'KT Numeral {style}', 'psName': f'KTNumeral-{style}', 'version': 'Version 0.100',
        'copyright': 'Copyright 2026 XartLab (KATANA)', 'designer': 'KATANA',
        'licenseDescription': 'This Font Software is licensed under the SIL Open Font License, Version 1.1.', 'licenseInfoURL': 'https://openfontlicense.org',
        'description': 'Numerals drawn for prices in the KATANA workbench: monoline, tabular, a decimal point with weight. Digits and price symbols only.',
    })
    fb.setupOS2(sTypoAscender=900, sTypoDescender=-250, sTypoLineGap=0, usWinAscent=950, usWinDescent=300, sxHeight=H, sCapHeight=H, fsType=0, usWeightClass=weight)
    fb.setupPost(isFixedPitch=0); fb.setupHead(unitsPerEm=UPM, created=0x0E4B3B1C0, modified=0x0E4B3B1C0)
    out = pathlib.Path(__file__).resolve().parent / 'dist'; out.mkdir(exist_ok=True)
    fb.save(out / f'KTNumeral-{style}.ttf')
    f = TTFont(out / f'KTNumeral-{style}.ttf'); f.flavor = 'woff2'; f.save(out / f'KTNumeral-{style}.woff2')
    return len(order)


if __name__ == '__main__':
    for st in WEIGHTS:
        print(f'KT Numeral {st}:', build(st), 'glyphs')
