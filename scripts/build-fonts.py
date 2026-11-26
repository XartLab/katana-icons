# SPDX-License-Identifier: MIT
# 把 KATANA 用到的字体打成可以长期缓存的 WOFF2 分片，放进 packages/fonts/。
#   python3 scripts/build-fonts.py <源字体目录>
# 源字体：KT Stencil 来自 type/dist/；其余是 SIL OFL 1.1 的开源字体，从 github.com/google/fonts 取（取用日期见 NOTICE）。
# 中日文字体按 unicode-range 切片（Google Fonts 的做法）：浏览器只下载页面上真用到的字所在的那几片。
# 文件名带内容哈希，内容不变名字不变，可以设一年的强缓存（Cache-Control: immutable）。
import hashlib, json, pathlib, shutil, sys
from fontTools.ttLib import TTFont
from fontTools import subset

root = pathlib.Path(__file__).resolve().parent.parent
src = pathlib.Path(sys.argv[1] if len(sys.argv) > 1 else root.parent / 'fonts/src')
out = root / 'packages/fonts'
files = out / 'files'

# family, css 字重, 源文件, 是否切片, 用在哪
FONTS = [
    # 正常字体：界面正文先用系统自带的界面字（苹方、微软雅黑、SF、Segoe UI），这几款是自托管的兜底和固定角色
    ('Noto Sans SC', '100 900', src / 'NotoSansSC[wght].ttf', True, '界面正文兜底（系统没有苹方、雅黑时），简体中文'),
    ('Barlow Condensed', 600, src / 'BarlowCondensed-SemiBold.ttf', False, '窄体大标题、面板标题'),
    ('Barlow Condensed', 700, src / 'BarlowCondensed-Bold.ttf', False, ''),
    ('DM Mono', 400, src / 'DMMono-Regular.ttf', False, 'LCD 读数'),
    ('DM Mono', 500, src / 'DMMono-Medium.ttf', False, ''),
    ('Maple Mono NF CN', 500, src / 'MapleMonoNFCN-Medium-latin.woff2', False, '等宽（代码、日志），目前只有拉丁子集'),
    ('Ark Pixel 12px Proportional zh_cn', 400, src / 'ArkPixel12-zh-subset.woff2', False, '中文像素字（12 点阵，常用字子集）'),
    ('KT Stencil', 400, root / 'type/dist/KTStencil-Stencil.ttf', True, '标题、加载页、驾驶舱面板（断缝）'),
    ('KT Stencil Solid', 400, root / 'type/dist/KTStencil-Solid.ttf', True, '小字、数字读数（不断缝）'),
    ('Michroma', 400, src / 'Michroma-Regular.ttf', False, '拉丁字母和编号，超椭圆字形'),
    ('Dela Gothic One', 400, src / 'DelaGothicOne-Regular.ttf', True, '汉字代号、粗标题'),
    ('Shippori Mincho', 400, src / 'ShipporiMincho-Regular.ttf', True, '原研哉风格的标题（明朝体）'),
    ('Shippori Mincho', 600, src / 'ShipporiMincho-SemiBold.ttf', True, ''),
    ('Zen Kaku Gothic New', 400, src / 'ZenKakuGothicNew-Regular.ttf', True, '正文黑体'),
    ('Zen Kaku Gothic New', 700, src / 'ZenKakuGothicNew-Bold.ttf', True, ''),
    ('Zen Kaku Gothic New', 900, src / 'ZenKakuGothicNew-Black.ttf', True, ''),
    # EVA 的字：日文标题卡用的 Matisse EB 是 Fontworks 的商用字，授权不能放进产品；用开源的特粗明朝顶替
    ('Shippori Mincho B1', 800, src / 'ShipporiMinchoB1-ExtraBold.ttf', True, 'EVA 式标题卡（顶替 Matisse EB，配 eva.css 的机械压扁）'),
    # EVA 的英文标题卡和 HUD 用全大写 Helvetica（Rebuild 里还有窄体）；Helvetica 不开源，用带宽度轴的 Archivo 顶替，压窄就是窄体
    ('Archivo', '100 900', src / 'Archivo[wdth,wght].ttf', False, 'EVA 式英文大写标题和 HUD（顶替 Helvetica / Helvetica Condensed），宽度 62%–125%'),
    # 像素与点阵：我们自己的两款从 KT Stencil 同一份骨架落格子得到；其余是开源的
    ('KT Pixel', 400, root / 'type/dist/KTPixel-Regular.ttf', True, '像素风标题、加载页（自绘，骨架同 KT Stencil）'),
    ('KT Dot', 400, root / 'type/dist/KTDot-Regular.ttf', True, '点阵屏读数（自绘，骨架同 KT Stencil）'),
    ('KT Arcade', 400, root / 'type/dist/KTArcade-Regular.ttf', False, '游戏感时刻（特效、成就、倒计时）的粗像素字，只有拉丁；16/32/48px 最清楚（自绘，OFL）'),
    ('KT Arcade', 300, root / 'type/dist/KTArcade-Light.ttf', False, '原研哉的那一版：一像素细线、字距放开，像素风的标签、读数、说明；只有拉丁（自绘，OFL）'),
    ('DotGothic16', 400, src / 'DotGothic16-Regular.ttf', True, '中日文点阵正文（16 点阵）'),
    ('Doto', '100 900', src / 'Doto[ROND,wght].ttf', False, '拉丁点阵大字（可调圆点 ROND 轴）'),
    ('Silkscreen', 400, src / 'Silkscreen-Regular.ttf', False, '拉丁小号像素字'),
    ('Silkscreen', 700, src / 'Silkscreen-Bold.ttf', False, ''),
    ('Pixelify Sans', '400 700', src / 'PixelifySans[wght].ttf', False, '拉丁像素正文（有小写）'),
    ('VT323', 400, src / 'VT323-Regular.ttf', False, '终端 / 命令行风格等宽'),
]


def common_cjk():
    """常用字：GB2312 一级字（3755）和 JIS 第一水准（2965）的并集。先切常用字，生僻字放在后面的片里。"""
    s = set()
    for hi in range(0xB0, 0xD8):            # GB2312 一级：区 16–55
        for lo in range(0xA1, 0xFF):
            try: s.add(ord(bytes([hi, lo]).decode('gb2312')))
            except UnicodeDecodeError: pass
    for hi in range(0xB0, 0xD0):            # JIS X 0208 第一水准：区 16–47
        for lo in range(0xA1, 0xFF):
            try: s.add(ord(bytes([hi, lo]).decode('euc_jp')))
            except UnicodeDecodeError: pass
    return s


COMMON = common_cjk()
LATIN = lambda c: c < 0x0250 or 0x2000 <= c <= 0x206F or 0x20A0 <= c <= 0x20CF or 0x2100 <= c <= 0x22FF
KANA = lambda c: 0x3000 <= c <= 0x30FF or 0x31F0 <= c <= 0x31FF or 0xFF00 <= c <= 0xFFEF
CJK = lambda c: 0x3400 <= c <= 0x9FFF or 0xF900 <= c <= 0xFAFF or 0x20000 <= c <= 0x2FFFF


def slices(cps):
    """片：拉丁一片、假名和全角标点一片、常用汉字每 500 字一片、其余每 1500 字一片。"""
    cps = sorted(cps)
    lat = [c for c in cps if LATIN(c)]
    kana = [c for c in cps if KANA(c)]
    cjk = [c for c in cps if CJK(c)]
    common = [c for c in cjk if c in COMMON]
    rare = [c for c in cjk if c not in COMMON]
    other = [c for c in cps if not (LATIN(c) or KANA(c) or CJK(c))]
    out = []
    if lat: out.append(('latin', lat))
    if kana: out.append(('kana', kana))
    for i in range(0, len(common), 500): out.append((f'c{i // 500:02d}', common[i:i + 500]))
    for i in range(0, len(rare), 1500): out.append((f'r{i // 1500:02d}', rare[i:i + 1500]))
    if other: out.append(('misc', other))
    return out


def urange(cps):
    """连续的码位合成区间：U+4E00-4E05。"""
    parts, start, prev = [], None, None
    for c in sorted(cps):
        if start is None: start = prev = c; continue
        if c == prev + 1: prev = c; continue
        parts.append((start, prev)); start = prev = c
    if start is not None: parts.append((start, prev))
    return ','.join(f'U+{a:X}' if a == b else f'U+{a:X}-{b:X}' for a, b in parts)


def woff2(path, cps, dest_stem):
    opts = subset.Options(); opts.flavor = 'woff2'; opts.layout_features = ['*']; opts.name_IDs = ['*']; opts.notdef_outline = True
    font = TTFont(path, recalcTimestamp=False)
    if 'head' in font: font['head'].modified = font['head'].created   # 不写当前时间：同样的输入每次出同样的文件，哈希不变，git 里不白白翻新几十 MB
    sub = subset.Subsetter(opts); sub.populate(unicodes=cps); sub.subset(font)
    tmp = files / f'{dest_stem}.tmp.woff2'
    font.flavor = 'woff2'; font.save(tmp)
    h = hashlib.sha256(tmp.read_bytes()).hexdigest()[:8]
    final = files / f'{dest_stem}.{h}.woff2'
    tmp.rename(final)
    return final


def main():
    if files.exists(): shutil.rmtree(files)
    files.mkdir(parents=True)
    css, manifest = ['/* SPDX-License-Identifier: MIT（CSS）；字体文件各按其许可，见 licenses/ */',
                     '/* 生成文件，勿手改：python3 scripts/build-fonts.py */'], []
    for family, weight, path, sliced, use in FONTS:
        cps = set(TTFont(path).getBestCmap().keys())
        stem = family.replace(' ', '') + '-' + str(weight).replace(' ', '-')
        parts = slices(cps) if sliced else [('all', sorted(cps))]
        total = 0
        for name, chunk in parts:
            f = woff2(path, chunk, f'{stem}.{name}')
            total += f.stat().st_size
            stretch = 'font-stretch:62% 125%;' if family == 'Archivo' else ''
            css.append(f"@font-face{{font-family:'{family}';font-style:normal;font-weight:{weight};{stretch}font-display:swap;"
                       f"src:url(./files/{f.name}) format('woff2');unicode-range:{urange(chunk)}}}")
            # 自有字体另给一个只含拉丁片的别名：正文、标签里用它，汉字自动落回正常字体（KT 的汉字太个性，只在标题里主动用）
            if family.startswith('KT ') and name == 'latin':
                css.append(f"@font-face{{font-family:'{family} Latin';font-style:normal;font-weight:{weight};font-display:swap;"
                           f"src:url(./files/{f.name}) format('woff2');unicode-range:{urange(chunk)}}}")
        manifest.append({'family': family, 'weight': weight, 'slices': len(parts), 'bytes': total, 'use': use})
        print(f'{family} {weight}: {len(parts)} 片, {total // 1024} KB')
    (out / 'fonts.css').write_text('\n'.join(css) + '\n')
    (out / 'manifest.json').write_text(json.dumps(manifest, ensure_ascii=False, indent=1))
    lic = out / 'licenses'; lic.mkdir(exist_ok=True)
    for t in src.glob('OFL-*.txt'): shutil.copy(t, lic / t.name)
    apl = root / 'type/APL.txt'
    if apl.exists(): shutil.copy(apl, lic / 'APL-kt-fonts.txt')   # KT 四款字体的汉字来自 Make Me a Hanzi，按 Arphic Public License


if __name__ == '__main__':
    main()
