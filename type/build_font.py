# SPDX-License-Identifier: MIT
# KT Stencil：把 glyphs.py 的直线骨架做成能装的字体。
#   python3 type/build_font.py      → type/dist/KTStencil-Stencil.{ttf,woff2}、KTStencil-Solid.{ttf,woff2}
# Stencil 版在笔画相接处断缝、封闭的腔断两处（大号标题用）；Solid 版不断缝（小字、正文用，可读性优先）。
import math, pathlib, sys
import pathops
from fontTools.fontBuilder import FontBuilder
from fontTools.pens.ttGlyphPen import TTGlyphPen
from fontTools.ttLib import TTFont

here = pathlib.Path(__file__).resolve().parent
sys.path.insert(0, str(here))
from glyphs import LAT, KAN, WIDTH, WEIGHT_K
from stencil import cuts

UPM = 1000
CAP = 700                  # 拉丁大写高
S_LAT = CAP / 8            # 6×8 网格一格
W_LAT = 0.16 * CAP         # 线宽
TRACK = 0.35 * 6           # 每个字左右留的格数（合计）
S_KAN = 920 / 12           # 汉字 12 网格放进 920 的字框
KAN_TOP = 820              # 汉字字框顶（基线以上）


def rect_path(ax, ay, bx, by, w):
    """一段线（两端各外伸半个线宽 = 方头）的矩形外形。"""
    dx, dy = bx - ax, by - ay
    L = math.hypot(dx, dy) or 1e-6
    ux, uy = dx / L, dy / L
    nx, ny = -uy * w / 2, ux * w / 2
    ax, ay, bx, by = ax - ux * w / 2, ay - uy * w / 2, bx + ux * w / 2, by + uy * w / 2
    p = pathops.Path()
    p.moveTo(ax + nx, ay + ny); p.lineTo(bx + nx, by + ny); p.lineTo(bx - nx, by - ny); p.lineTo(ax - nx, ay - ny); p.close()
    return p


def square(cx, cy, r):
    p = pathops.Path()
    p.moveTo(cx - r, cy - r); p.lineTo(cx + r, cy - r); p.lineTo(cx + r, cy + r); p.lineTo(cx - r, cy + r); p.close()
    return p


def miter_side(pts, w, side, closed):
    """折线一侧的偏移点，尖角用斜接（miter）；开口的两端外伸半个线宽（方头）。"""
    h = w / 2 * side
    n = len(pts)
    def seg(i):
        (ax, ay), (bx, by) = pts[i], pts[(i + 1) % n]
        L = math.hypot(bx - ax, by - ay) or 1e-6
        ux, uy = (bx - ax) / L, (by - ay) / L
        return ux, uy, -uy, ux
    m = n if closed else n - 1
    S = [seg(i) for i in range(m)]
    out = []
    for i in range(n if closed else n):
        if closed:
            a, b = S[i - 1], S[i % m]
        elif i == 0:
            a = b = S[0]
        elif i == n - 1:
            a = b = S[-1]
        else:
            a, b = S[i - 1], S[i]
        nx, ny = a[2] + b[2], a[3] + b[3]
        L = math.hypot(nx, ny)
        x, y = pts[i]
        if L < 1e-6:
            nx, ny, k = a[2], a[3], 1
        else:
            nx, ny = nx / L, ny / L
            cos = nx * b[2] + ny * b[3]
            if cos < 0.55:
                # 太尖的角斜接会戳出长刺：改成切角（bevel），跟 45° 切角的语言一致
                out.append((x + a[2] * h, y + a[3] * h)); out.append((x + b[2] * h, y + b[3] * h))
                continue
            k = 1 / cos
        px, py = x + nx * h * k, y + ny * h * k
        if not closed and i == 0:
            px, py = px - a[0] * w / 2, py - a[1] * w / 2
        if not closed and i == n - 1:
            px, py = px + b[0] * w / 2, py + b[1] * w / 2
        out.append((px, py))
    return out


def poly(points):
    p = pathops.Path()
    p.moveTo(*points[0])
    for q in points[1:]:
        p.lineTo(*q)
    p.close()
    return p


def stroke_shape(pts, w):
    closed = len(pts) > 2 and math.dist(pts[0], pts[-1]) < 1e-6
    if closed:
        pts = pts[:-1]
        outer, inner = miter_side(pts, w, 1, True), miter_side(pts, w, -1, True)
        p = poly(outer)
        q = poly(inner[::-1])
        return pathops.op(pathops.op(p, p, pathops.PathOp.UNION), q, pathops.PathOp.XOR)
    if len(pts) == 1:
        return square(*pts[0], w / 2)
    left, right = miter_side(pts, w, 1, False), miter_side(pts, w, -1, False)
    p = poly(left + right[::-1])
    return pathops.op(p, p, pathops.PathOp.UNION)


def drop_crumbs(path, min_area):
    """去掉断桥挖完以后剩下的碎渣（面积很小的轮廓，正负都算）；保留方向，洞还是洞。"""
    keep = pathops.Path()
    for c in path.contours:
        if abs(c.area) >= min_area:
            keep.addPath(c)
    keep.simplify()
    return keep


def outline(strokes, to_font, w, stencil, gap=0.45, closed_min=0):
    """骨架 → 字形外轮廓。每一笔先做成斜接的形，在它自己的断桥处挖方块，所有笔合并，再去掉碎渣。
    gap：断缝宽（线宽的倍数）；closed_min：小于这个尺寸（网格单位）的闭合小框不断缝，不然会被挖没。"""
    C = cuts(strokes) if stencil else []
    if closed_min:
        drop = set()
        for si, pl in enumerate(strokes):
            if len(pl) > 2 and pl[0] == pl[-1]:
                xs, ys = [p[0] for p in pl], [p[1] for p in pl]
                if max(max(xs) - min(xs), max(ys) - min(ys)) < closed_min:
                    for i in range(len(pl) - 1):
                        drop.add((si, ((pl[i][0] + pl[i + 1][0]) / 2, (pl[i][1] + pl[i + 1][1]) / 2)))
        C = [c for c in C if (c[0], tuple(c[1])) not in drop]
    out = pathops.Path()
    for si, pl in enumerate(strokes):
        if not pl:
            continue
        shape = stroke_shape([to_font(x, y) for x, y in pl], w)
        for sj, (px, py) in C:
            if sj == si:
                cx, cy = to_font(px, py)
                shape = pathops.op(shape, square(cx, cy, w / 2 + w * gap), pathops.PathOp.DIFFERENCE)
        out = pathops.op(out, shape, pathops.PathOp.UNION)
    return drop_crumbs(out, (w * w) * 0.2)


def seg_dist(px, py, ax, ay, bx, by):
    dx, dy = bx - ax, by - ay
    L2 = dx * dx + dy * dy or 1e-9
    t = max(0, min(1, ((px - ax) * dx + (py - ay) * dy) / L2))
    return math.hypot(ax + t * dx - px, ay + t * dy - py)


def raster_outline(strokes, cols, rows, step, half, to_font, cell, dot):
    """骨架落到格子上：格子中心离任何一笔不超过 half（网格单位）就点亮。
    Pixel 版每格一个方块（相邻的会连成一片），Dot 版每格一个圆点。"""
    segs = [(a, b) for pl in strokes for a, b in zip(pl, pl[1:])] + [(pl[0], pl[0]) for pl in strokes if len(pl) == 1]
    out = pathops.Path()
    for j in range(rows):
        for i in range(cols):
            gx, gy = i * step, j * step
            if any(seg_dist(gx, gy, *a, *b) <= half for a, b in segs):
                cx, cy = to_font(gx, gy)
                if dot:
                    r = cell * 0.42
                    pts = [(cx + r * math.cos(k * math.pi / 4 + math.pi / 8), cy + r * math.sin(k * math.pi / 4 + math.pi / 8)) for k in range(8)]
                    shape = poly(pts)
                else:
                    h = cell / 2
                    shape = poly([(cx - h, cy - h), (cx + h, cy - h), (cx + h, cy + h), (cx - h, cy + h)])
                out = pathops.op(out, shape, pathops.PathOp.UNION)
    return out


def tt_glyph(path):
    pen = TTGlyphPen(None)
    path.draw(pen)
    return pen.glyph()


def build(style: str):
    stencil = style == 'Stencil'
    raster = style in ('Pixel', 'Dot')
    order, glyphs, metrics, cmap = ['.notdef', 'space'], {}, {}, {}
    empty = TTGlyphPen(None); glyphs['.notdef'] = empty.glyph(); metrics['.notdef'] = (600, 0)
    glyphs['space'] = TTGlyphPen(None).glyph(); metrics['space'] = (int((3 + TRACK) * S_LAT), 0); cmap[32] = 'space'

    for ch, strokes in LAT.items():
        if ch == ' ':
            continue
        name = f'uni{ord(ch):04X}'
        cw = WIDTH.get(ch, 6)
        lsb_grid = TRACK / 2
        to_font = lambda x, y, l=lsb_grid: ((x + l) * S_LAT + W_LAT / 2, (8 - y) * S_LAT)
        if raster:   # 拉丁 6×8 网格按半格取样：13×17 个格子，线宽两格
            g = tt_glyph(raster_outline(strokes, int(cw * 2) + 1, 17, 0.5, 0.55, to_font, S_LAT / 2, style == 'Dot'))
        else:
            g = tt_glyph(outline(strokes, to_font, W_LAT, stencil))
        order.append(name); glyphs[name] = g
        metrics[name] = (int((cw + TRACK) * S_LAT + W_LAT), 0)
        cmap[ord(ch)] = name
        if ch.isalpha() and ch.isupper():
            cmap[ord(ch.lower())] = name   # 小写也给大写字形：屏幕字只有大写
    for ch, strokes in KAN.items():
        name = f'uni{ord(ch):04X}'
        w = WEIGHT_K.get(ch, 0.115) * 920
        to_font = lambda x, y: (40 + x * S_KAN, KAN_TOP - y * S_KAN)
        if raster:   # 汉字 12 网格按整格取样：13×13 个格子
            g = tt_glyph(raster_outline(strokes, 13, 13, 1, 0.62, to_font, S_KAN, style == 'Dot'))
        else:
            g = tt_glyph(outline(strokes, to_font, w, stencil))
        order.append(name); glyphs[name] = g
        metrics[name] = (UPM, 0); cmap[ord(ch)] = name

    # 左边距 = 外轮廓最左点
    fb = FontBuilder(UPM, isTTF=True)
    fb.setupGlyphOrder(order)
    fb.setupCharacterMap(cmap)
    fb.setupGlyf(glyphs)
    glyf = fb.font['glyf']
    hm = {}
    for n in order:
        g = glyf[n]; g.recalcBounds(glyf)
        hm[n] = (metrics[n][0], getattr(g, 'xMin', 0) or 0)
    fb.setupHorizontalMetrics(hm)
    fb.setupHorizontalHeader(ascent=900, descent=-200)
    family = {'Stencil': 'KT Stencil', 'Solid': 'KT Stencil Solid', 'Pixel': 'KT Pixel', 'Dot': 'KT Dot'}[style]
    fb.setupNameTable({
        'familyName': family, 'styleName': 'Regular',
        'uniqueFontIdentifier': f'KATANA:{family}:0.1', 'fullName': family, 'psName': family.replace(' ', '') + '-Regular',
        'version': 'Version 0.100', 'copyright': 'Copyright 2026 XartLab (KATANA)',
        'licenseDescription': 'SIL Open Font License 1.1', 'licenseInfoURL': 'https://openfontlicense.org',
        'designer': 'KATANA', 'description': 'Straight-line stencil type for the KATANA trading workbench. Glyphs drawn by KATANA.'
    })
    fb.setupOS2(sTypoAscender=900, sTypoDescender=-200, sTypoLineGap=100, usWinAscent=1000, usWinDescent=250, sxHeight=CAP, sCapHeight=CAP, fsType=0)
    fb.setupPost()
    fb.setupHead(unitsPerEm=UPM, created=0x0E4B3B1C0, modified=0x0E4B3B1C0)
    out = here / 'dist'; out.mkdir(exist_ok=True)
    stem = {'Stencil': 'KTStencil-Stencil', 'Solid': 'KTStencil-Solid', 'Pixel': 'KTPixel-Regular', 'Dot': 'KTDot-Regular'}[style]
    fb.save(out / f'{stem}.ttf')
    f = TTFont(out / f'{stem}.ttf'); f.flavor = 'woff2'; f.save(out / f'{stem}.woff2')
    return out / f'{stem}.ttf', len(order)


if __name__ == '__main__':
    for st in ('Stencil', 'Solid', 'Pixel', 'Dot'):
        p, n = build(st)
        print(p.name, n, 'glyphs', p.stat().st_size // 1024, 'KB')
