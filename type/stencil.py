# KT 模板字：直线骨架 + 漏字板断桥。原则照动画《希德尼娅的骑士》屏幕字（3flab）公开的要求：
# 汉字世界观、军用 stencil、可读性优先。字形是我们自己画的。
import math
from glyphs import LAT, KAN, WIDTH, WEIGHT_K

def segs(strokes):
    out = []
    for si, pl in enumerate(strokes):
        for i in range(len(pl) - 1):
            out.append((si, pl[i], pl[i + 1]))
    return out

def near_seg(p, a, b):
    ax, ay = a; bx, by = b; px, py = p
    dx, dy = bx - ax, by - ay; L2 = dx * dx + dy * dy or 1e-9
    t = max(0, min(1, ((px - ax) * dx + (py - ay) * dy) / L2))
    return math.hypot(ax + t * dx - px, ay + t * dy - py), t

def inter(a, b, c, d):
    (x1, y1), (x2, y2), (x3, y3), (x4, y4) = a, b, c, d
    den = (x1 - x2) * (y3 - y4) - (y1 - y2) * (x3 - x4)
    if abs(den) < 1e-9: return None
    t = ((x1 - x3) * (y3 - y4) - (y1 - y3) * (x3 - x4)) / den
    u = -((x1 - x2) * (y1 - y3) - (y1 - y2) * (x1 - x3)) / den
    if 0.02 < t < 0.98 and 0.02 < u < 0.98: return (x1 + t * (x2 - x1), y1 + t * (y2 - y1))
    return None

def cuts(strokes, eps=0.05):
    """断桥位置：(stroke index, point)。一笔的端点碰到另一笔 → 断这一笔；两笔交叉 → 断后一笔；闭合的框断两处。"""
    S = segs(strokes); res = []
    for si, pl in enumerate(strokes):
        for end in (pl[0], pl[-1]):
            for sj, a, b in S:
                if sj == si: continue
                d, _ = near_seg(end, a, b)
                if d < eps: res.append((si, tuple(end))); break
        if len(pl) > 2 and pl[0] == pl[-1]:
            # 闭合：在第一条边和对边的中点各断一处，内腔不再是封闭的岛
            mids = [((pl[i][0] + pl[i + 1][0]) / 2, (pl[i][1] + pl[i + 1][1]) / 2) for i in range(len(pl) - 1)]
            a = min(mids, key=lambda m: (m[1], m[0]))          # 最上面那条边
            b = max(mids, key=lambda m: math.hypot(m[0] - a[0], m[1] - a[1]))  # 离它最远的边
            res += [(si, a), (si, b)]
    for i, (si, a, b) in enumerate(S):
        for sj, c, d in S[i + 1:]:
            if sj == si: continue
            p = inter(a, b, c, d)
            if p: res.append((max(si, sj), p))
    return res

def glyph_svg(strokes, scale, w, gap, color, ox=0, oy=0, gid='g', cut=True):
    """一个字：每笔单独描边，断桥用 mask 在这一笔上挖掉一个方块。"""
    C = cuts(strokes) if cut else []
    out = []
    for si, pl in enumerate(strokes):
        if not pl: continue
        d = 'M' + 'L'.join(f'{ox + x * scale:.2f} {oy + y * scale:.2f}' for x, y in pl)
        holes = [p for (sj, p) in C if sj == si]
        if holes:
            mid = f'{gid}s{si}'
            r = (w / 2 + gap) 
            rects = ''.join(f'<rect x="{ox + px * scale - r:.2f}" y="{oy + py * scale - r:.2f}" width="{2 * r:.2f}" height="{2 * r:.2f}" fill="#000"/>' for px, py in holes)
            out.append(f'<mask id="{mid}" maskUnits="userSpaceOnUse"><rect x="-9999" y="-9999" width="99999" height="99999" fill="#fff"/>{rects}</mask>'
                       f'<path d="{d}" fill="none" stroke="{color}" stroke-width="{w:.2f}" stroke-linecap="square" stroke-linejoin="miter" mask="url(#{mid})"/>')
        else:
            out.append(f'<path d="{d}" fill="none" stroke="{color}" stroke-width="{w:.2f}" stroke-linecap="square" stroke-linejoin="miter"/>')
    return ''.join(out)

def text_svg(s, size, color, x=0, y=0, track=0.35, w_ratio=0.16, gid='t', stencil=True):
    """拉丁/数字一行：cap 高 = size。"""
    # 小于 20px 不断桥：缝太细会把字读错（O 看成括号），可读性优先
    stencil = stencil and size >= 20
    sc = size / 8; w = size * w_ratio; cx = x; parts = []
    for i, ch in enumerate(s):
        st = LAT.get(ch.upper(), [])
        parts.append(glyph_svg(st, sc, w, w * 0.45, color, cx, y, f'{gid}{i}', cut=stencil))
        cx += (WIDTH.get(ch.upper(), 6) + 6 * track) * sc
    return ''.join(parts), cx - x

def kan_svg(ch, size, color, x=0, y=0, gid='k', w_ratio=0.115):
    sc = size / 12; w = size * WEIGHT_K.get(ch, w_ratio)
    return glyph_svg(KAN[ch], sc, w, w * 0.45, color, x, y, gid)
