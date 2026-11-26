# 汉字自动拉直：从 Make Me a Hanzi 的笔画中心线（graphics.txt，Arphic Public License）出发，
# 按 KT 字体的规则改成直线骨架：每一笔先简化（RDP），再把每段的方向吸到横、竖、45° 三种，端点对齐到半格。
# 手画的字（glyphs.py 的 KAN）优先，这里只补没手画的。
#   python3 type/kan_auto.py <graphics.txt> <字表.txt 或 json> → type/kan_auto.json
import json, math, sys, pathlib

here = pathlib.Path(__file__).resolve().parent
GRID = 12          # 字框 12 格
SNAP = 0.25        # 端点对齐到四分之一格（24 网格的半格）
EPS = 0.45         # RDP 简化的容差（格）
MIN_SEG = 0.4      # 比这短的段并掉
SCALE = 1.12


def to_grid(p):
    # Make Me a Hanzi 的坐标：1024 见方，y 向上，字面大致在 y = 900（顶）到 -124（底）
    # 中心线本身就比字框小一圈（笔画有宽度），统一放大 1.12 倍，跟手画的字一样大；所有字同一个比例，大小关系不变
    x, y = p
    gx, gy = x * GRID / 1024, (900 - y) * GRID / 1024
    return [6 + (gx - 6) * SCALE, 6 + (gy - 6) * SCALE]


def rdp(pts, eps):
    if len(pts) < 3:
        return pts
    (ax, ay), (bx, by) = pts[0], pts[-1]
    L = math.hypot(bx - ax, by - ay) or 1e-9
    dmax, idx = 0, 0
    for i in range(1, len(pts) - 1):
        px, py = pts[i]
        d = abs((by - ay) * px - (bx - ax) * py + bx * ay - by * ax) / L
        if d > dmax:
            dmax, idx = d, i
    if dmax > eps:
        return rdp(pts[: idx + 1], eps)[:-1] + rdp(pts[idx:], eps)
    return [pts[0], pts[-1]]


def snap_dir(dx, dy):
    """一段方向吸到横、竖或 45°；长度取它在那个方向上的投影。"""
    ang = math.degrees(math.atan2(dy, dx)) % 180
    if ang < 22.5 or ang >= 157.5:
        return dx, 0.0
    if 67.5 <= ang < 112.5:
        return 0.0, dy
    m = (abs(dx) + abs(dy)) / 2
    return math.copysign(m, dx), math.copysign(m, dy)


def q(v):
    return round(v / SNAP) * SNAP


def straighten(median):
    pts = rdp([to_grid(p) for p in median], EPS)
    out = [[q(pts[0][0]), q(pts[0][1])]]
    for nx, ny in pts[1:]:
        px, py = out[-1]
        dx, dy = snap_dir(nx - px, ny - py)
        cand = [q(px + dx), q(py + dy)]
        if math.hypot(cand[0] - px, cand[1] - py) < MIN_SEG:
            continue
        # 和上一段同方向就并成一段
        if len(out) >= 2:
            ax, ay = out[-2]
            d1 = (px - ax, py - ay); d2 = (cand[0] - px, cand[1] - py)
            if abs(d1[0] * d2[1] - d1[1] * d2[0]) < 1e-6 and d1[0] * d2[0] + d1[1] * d2[1] > 0:
                out[-1] = cand
                continue
        out.append(cand)
    if len(out) == 1:   # 点：给它一小段，不然没东西可画
        x, y = out[0]
        out.append([x + 0.5, y + 0.5])
    return [[min(max(x, 0.3), 11.7), min(max(y, 0.3), 11.7)] for x, y in out]


def main(graphics, chars):
    want = set(chars)
    out = {}
    with open(graphics, encoding='utf-8') as f:
        for line in f:
            d = json.loads(line)
            c = d['character']
            if c in want:
                out[c] = [straighten(m) for m in d['medians']]
    missing = [c for c in chars if c not in out]
    (here / 'kan_auto.json').write_text(json.dumps(out, ensure_ascii=False, separators=(',', ':')))
    print(len(out), 'chars;', 'missing:', ''.join(missing))


if __name__ == '__main__':
    src = pathlib.Path(sys.argv[2]).read_text(encoding='utf-8')
    chars = [c for c, _ in json.loads(src)] if src.lstrip().startswith('[') else [c for c in src if '㐀' <= c <= '鿿']
    main(sys.argv[1], chars)
