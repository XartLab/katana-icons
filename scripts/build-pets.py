#!/usr/bin/env python3
# SPDX-License-Identifier: MIT
# KATANA 宠物：从原图（pets/source/*.png，1200×1200，黑底 + 白色空心 K 线 + 居中像素角色）还原原生像素精灵。
# 做法：在角色所在区域按梯度找像素格子（约 12.7 px 一格），每格取中位色；从边缘把黑底和灰白 K 线泛洪掉，留下最大的连通块。
# 输出：packages/static/pets/<id>.png（原生尺寸透明 PNG）、packages/pets/src/sprites.js、preview/pets.html。
# 用法：python3 scripts/build-pets.py            加新角色：原图放进 pets/source/<id>.png，再在 packages/pets/src/index.js 的 PETS / RIG / REP / LINES 里补一份。
import base64, io, json, sys
from collections import deque
from pathlib import Path
import numpy as np
from PIL import Image

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / 'pets' / 'source'
IDS = ['kurumi', 'mebuki', 'yasuko', 'mochiko']
BOX = (430, 370, 770, 880)  # 角色所在区域（原图坐标）


def fit(prof):
    best = None
    for s in np.arange(12.3, 13.2, 0.01):
        for o in np.arange(0, s, 0.25):
            idx = np.round(np.arange(o, len(prof) - 1, s)).astype(int)
            idx = idx[idx < len(prof)]
            sc = prof[idx].sum() / len(idx)
            if best is None or sc > best[0]:
                best = (sc, s, o)
    return best[1], best[2]


def extract(path):
    a = np.asarray(Image.open(path).convert('RGB')).astype(int)
    x0, y0, x1, y1 = BOX
    c = a[y0:y1, x0:x1]
    gx = np.roll(np.append(np.abs(np.diff(c, axis=1)).sum(2).sum(0), 0), 1)
    gy = np.roll(np.append(np.abs(np.diff(c, axis=0)).sum(2).sum(1), 0), 1)
    sx, ox = fit(gx)
    sy, oy = fit(gy)
    nx, ny = int((c.shape[1] - ox) // sx), int((c.shape[0] - oy) // sy)
    cells = np.zeros((ny, nx, 3), int)
    for j in range(ny):
        for i in range(nx):
            ya, yb = int(round(oy + j * sy)) + 3, int(round(oy + (j + 1) * sy)) - 3
            xa, xb = int(round(ox + i * sx)) + 3, int(round(ox + (i + 1) * sx)) - 3
            cells[j, i] = np.median(c[ya:yb, xa:xb].reshape(-1, 3), axis=0)
    mx, mn = cells.max(2), cells.min(2)
    bg = (mx <= 7) | ((mx - mn <= 10) & (mx >= 20) & (mx <= 235))  # 黑底 + 灰白 K 线残留
    seen = np.zeros(bg.shape, bool)
    q = deque((j, i) for j in range(ny) for i in range(nx) if j in (0, ny - 1) or i in (0, nx - 1))
    while q:
        j, i = q.popleft()
        if seen[j, i] or not bg[j, i]:
            continue
        seen[j, i] = True
        for dj, di in ((1, 0), (-1, 0), (0, 1), (0, -1)):
            if 0 <= j + dj < ny and 0 <= i + di < nx:
                q.append((j + dj, i + di))
    lab = -np.ones(bg.shape, int); comps = []
    for j in range(ny):
        for i in range(nx):
            if seen[j, i] or lab[j, i] >= 0:
                continue
            comp = []; q = deque([(j, i)])
            while q:
                a1, b1 = q.popleft()
                if not (0 <= a1 < ny and 0 <= b1 < nx) or seen[a1, b1] or lab[a1, b1] >= 0:
                    continue
                lab[a1, b1] = len(comps); comp.append((a1, b1))
                q.extend([(a1 + 1, b1), (a1 - 1, b1), (a1, b1 + 1), (a1, b1 - 1)])
            comps.append(comp)
    rgba = np.zeros((ny, nx, 4), np.uint8)
    for j, i in max(comps, key=len):
        rgba[j, i, :3] = cells[j, i]; rgba[j, i, 3] = 255
    img = Image.fromarray(rgba)
    return img.crop(img.getbbox()), (sx, sy)


def main():
    out_png = ROOT / 'packages' / 'static' / 'pets'; out_png.mkdir(parents=True, exist_ok=True)
    uris = {}
    for pid in IDS:
        img, (sx, sy) = extract(SRC / f'{pid}.png')
        img.save(out_png / f'{pid}.png')
        buf = io.BytesIO(); img.save(buf, 'PNG')
        uris[pid] = 'data:image/png;base64,' + base64.b64encode(buf.getvalue()).decode()
        print(f'{pid}: 格子 {sx:.2f}×{sy:.2f} px → {img.size[0]}×{img.size[1]}')
    (ROOT / 'packages' / 'pets' / 'src' / 'sprites.js').write_text(
        '// SPDX-License-Identifier: MIT\n// 由 scripts/build-pets.py 生成，别手改。四个角色的原生像素精灵（透明 PNG，data URI）。\nexport const SPRITES = '
        + json.dumps(uris, indent=1) + ';\n', encoding='utf-8')
    # 预览页：把运行时去掉 import/export 内联进去，file:// 直接能开
    def classic(js):
        lines = [l for l in js.split('\n') if not l.startswith('import ')]
        js = '\n'.join(lines)
        js = js.replace('export function', 'function').replace('export async function', 'async function').replace('export const', 'const')
        return '\n'.join(l for l in js.split('\n') if not l.startswith('export {'))
    rt = classic((ROOT / 'packages' / 'pets' / 'src' / 'sprites.js').read_text(encoding='utf-8')) + '\n' + classic((ROOT / 'packages' / 'pets' / 'src' / 'index.js').read_text(encoding='utf-8'))
    rt += '\nconst LINES = L, REPERTOIRE = REP, TRANSITIONS = TRDOC;\n'
    shell = (ROOT / 'pets' / 'preview-shell.html').read_text(encoding='utf-8')
    ui = (ROOT / 'pets' / 'preview-ui.js').read_text(encoding='utf-8')
    (ROOT / 'preview' / 'pets.html').write_text(shell + '<script>\n{\n' + rt + '\n' + ui + '\n}\n</script>\n</body>\n</html>\n', encoding='utf-8')
    print('写出 packages/static/pets/、packages/pets/src/sprites.js、preview/pets.html')


if __name__ == '__main__':
    sys.exit(main())
