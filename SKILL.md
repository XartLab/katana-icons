---
name: katana-icons
description: 做 KATANA 的视觉资产（含桌面宠物玩具）：功能图标（ОКБ 机加工风格、线性交易图标、模板字图标）、汉字代号、自有字体（KT Stencil / Solid / Pixel / Dot）、字体打包自托管、驾驶舱 HUD 部件、标志。要给 KATANAview、KatanaUI 或其他 Katana 项目加图标、加字、换掉 lucide、出新的字体文件或品牌图时使用。
license: MIT
---

# katana-icons

这个仓库是 KATANA 的资产工厂：规则、生成器、自检和发布物都在这里。你的工作是照规则加新东西、重跑生成器，不是改工具。

## 先选风格

| 场合 | 风格 | 用哪个轮子 |
| --- | --- | --- |
| 日常标志、小尺寸、产品里的图标 | 原研哉：纸、墨、细线、一点红 | 线性交易图标（默认 light）、`brand/` |
| 界面通用图标 | ОКБ 机加工：方头、尖角、一道 45° 切角 | `icons/*.mjs` + `scripts/build.mjs` |
| 标题、加载页、驾驶舱面板 | 弐瓶勉：模板字、断缝、暗底斜纹 | `type/`（KT Stencil）、`hud/` |
| 像素风、点阵屏读数 | 像素 / 点阵 | KT Pixel、KT Dot，开源像素字 |
| 游戏感时刻（特效、成就、倒计时） | 粗像素 | KT Arcade 400（只有拉丁，字号 16 的倍数） |
| 安静的像素标签、读数、说明 | 细像素（原研哉） | KT Arcade 300 |
| 价格、数量、百分比 | 数字 | KT Numeral（--kt-font-num） |
| 研报、长文 | 阅读 | 系统黑体 + reading.css（.kt-read） |
| 水印、空状态、背景大字 | 空押 | emboss.css（.kt-emboss），只装饰 |
| EVA 式标题卡 | 特粗明朝压扁 + 窄体大写 | `packages/fonts/eva.css` |

## 轮子

### 1. ОКБ 界面图标（71 个）

规则在 `docs/rules.md`，定义在 `icons/ui.mjs`、`icons/katana.mjs`（`kt-` 前缀）。

1. 读 `docs/rules.md`，每个新图标写一句"物体 + 悬停动作"。
2. 在 `icons/*.mjs` 里找结构最近的照着写（有框看 `info`，有箭头看 `download`，会转看 `settings`）。
3. `node scripts/check.mjs --only 新A,新B --sheet out/sheet.html`，错误修到 0，截图逐条核对。
4. `node scripts/build.mjs` 生成 `packages/static/svg/`、`packages/react/`、`icons.json`。

### 2. 线性交易图标（33 个）

定义在 `line/set/katana.mjs`，用 Kubai Line 技能的规则画（24 网格、关键形状、角色权重、超椭圆圆角 `sbox`/`sarea`）。

- 需要本机有 Kubai Line 引擎（`kubai-icons/styles/line`），**引擎不进本仓库**（Kubai Icons License §3）；画出来的图标归我们（§2）。
- 自检：把 `line/set/katana.mjs` 复制到引擎的 `set/` 下，`CHROME=… node check.mjs --only 名字 --out 目录`，Findings 清零；真要豁免就在图标上写 `allow: { 规则: '理由' }`。
- 发布：`KUBAI_LINE=<引擎路径> node scripts/build-trading.mjs`，出 `@katana-icons/react/trading`、`trading.css`（悬停动效）和 `packages/static/svg/trading/`。

### 2b. 通用图标（129 个）

范围是产品里用到的 lucide 图标（`line/general/names.txt`）。Kubai 线性库（`icons-line/`，MIT）有的直接取，名字不同的写进 `map.json`，库里没有的照 icons-line 的格式在 `own.mjs` 里自己画。`KUBAI_ICONS=<路径> node scripts/build-general.mjs` 出 `@katana-icons/react/general`（我们的名字）和 `general/lucide`（lucide 同名，换库只改 import）。

### 2c. 小图标（86 个，16/24px）

只画产品里常用的：KATANAview、KatanaUI 用了 2 次以上的 lucide 名字（只用 1 次的大多是图表绘图工具栏 `drawings.ts` 里的，那些归画图工具，不在这里）。规矩：24 网格、线宽 1.5、方头尖角；带框的左上切 45°，另三角超椭圆圆角（`frame()`）；圆改八边形（`oct()` / `octArc()`）；座舱灯是朱红方点，只放在有意义的地方（`lit`）。改 `line/small/defs.mjs`，跑 `node scripts/build-small.mjs` 出 `@katana-icons/react/small`、静态 SVG 和 `preview/small.html`；再跑 `build-general.mjs`，`general/lucide` 里同名的就换成小图标。加新的先看它在产品里用了几次，用得少的留给通用线性图标。

### 3. 汉字代号（33 个）

`line/kanji-map.json` 是"图标名 → 汉字"。改完跑 `python3 scripts/kanji-outlines.py <DelaGothicOne-Regular.ttf>` 再 `node scripts/build-kanji.mjs`。最小用 20px。

### 4. 自有字体：KT Stencil / Solid / Pixel / Dot

四款字共用 `type/glyphs.py` 里的一份直线骨架：拉丁 6×8 网格、汉字 12×12 网格，每个字是几条折线，只用横、竖、45°。

- 加字：在 `LAT` 或 `KAN` 里加折线；笔画多的汉字在 `WEIGHT_K` 里调细。
- `python3 type/build_font.py` 一次出四个 TTF：Stencil（断缝）、Solid（不断缝）、Pixel（落格成方块）、Dot（落格成圆点）。
- 断缝规则在 `type/stencil.py` 的 `cuts`：端点碰到别的笔就断，交叉断后画的那笔，闭合的框断两处。
- 同规则的模板字图标：`python3 type/icons_stencil.py`，出 `packages/static/svg/stencil/`。
- 看效果：`type/dist/specimen.html`。

### 4b. KT Arcade（像素字，两个字重）

**300 Light** 是原研哉的那一版，点阵在 `type/arcade_light.py`：一像素的线，大写 9 格高、5 格宽，字怀 3 格，字距 3 格；圆字母四角各切一格，方字母保持干脆；减到不能再减，不加粗，也不做夸张的切角。

**400 Regular** 是粗体游戏字，点阵在 `type/arcade.py`：笔画 2 格，大写 10 格高，小写 x 高 8 格，降部 3 格；横竖笔相交的左上角切 45° 两格，其余圆角切一格。只做拉丁、数字、常用符号。两个字重共用同一条基线和同样的行高，改完跑 `python3 type/build_arcade.py`（两个都会出），再跑 `scripts/build-fonts.py`。一格是 1/16 em，所以字号用 16 的倍数，像素才对得齐。

### 4c. KT Numeral（价格数字）

点阵不用，画的是中心线：`type/build_numeral.py` 里每个数字由直线和圆弧组成，按线宽描边，一套骨架出 300、400、500 三个字重。
- **宽度：** 数字等宽 600；小数点、逗号、冒号窄，宽 300。
- **小数点：** 是个方块，边长约两倍线宽。
- **0 和 8：** 0 是跑道形，8 是上小下大的两个圆。
- **收录范围：** 只收数字和价格里会出现的符号，别的字落回 `--kt-font-num` 里的后备字体。

改完跑 `python3 type/build_numeral.py`，再跑 `scripts/build-fonts.py`。

### 4d. 空押与阅读版式

- `emboss.css`：没有墨的字，字色等于底色，只靠一暗一亮两道边看出来，只用来装饰。
- `reading.css`：长文版式，用系统黑体，不用宋体。数值都是起始值，标了待核对，拿真实研报实测后再改。

预览：`preview/hara.html`。

### 5. 字体打包（自托管）

`python3 scripts/build-fonts.py <源字体目录>` 把 `FONTS` 表里的每一款打成 WOFF2：中日文按 unicode-range 切片（常用字在前），文件名带内容哈希，可强缓存。新加开源字体：源文件从 github.com/google/fonts 取，许可文本放进 `packages/fonts/licenses/`，来源写进 `NOTICE`。商用授权的字（Matisse、Helvetica、东亚重工这类）不进包，用开源替身。

### 6. 驾驶舱 HUD

`hud/hud.mjs`：七段管、模板字、刻度带、准星、弧形仪表、读数框、锁定框、警示带、警告牌，每个函数返回 SVG 片段。`node hud/board.mjs` 出样张。

### 7. 像素特效 @katana-icons/fx

底层是 pixelfx（MIT，已复制进 `packages/fx/src/vendor/pixelfx/`），只放界面用得上、不需要角色的特效。挂受击、状态这类效果的角色特效不收。
- **加一个时刻：** 先在 pixelfx 检出里跑 `node tools/list.mjs <词>` 找候选，再用 `render.mjs --opts` 套上 `PALETTES` 看接触表。选定后，把它的文件和同目录的 `_lib.js` 复制进来，在 `MOMENTS` 里写 `source`、`zh` 和 `opts`。
- **重新导出：** `PIXELFX=<检出> node scripts/build-fx.mjs` 出 `packages/static/fx/` 的精灵图。
- **要新特效：** 照 pixelfx 的 `docs/AUTHORING.md` 写，以它的特效为参照（细节、光、节奏要跟它的一样足）。同样的输入每次画出一样的结果，不用 `Math.random`。
- **不要复制：** 它的 Patch Pixel 字体文件不能拿。

### 8. 宠物（玩具）@katana-icons/pets

四个像素角色（くるみ、芽吹、やす子、萌智子）住在工作台角落，跟着盈亏换表情、动作和台词。是玩具，不承载信息，别拿它报警。
- **原图：** `pets/source/<id>.png`，团队用 GPT 生成的 1200×1200 图（黑底、白色空心 K 线、居中角色）。`python3 scripts/build-pets.py` 还原原生像素（约 22×34），出 `packages/static/pets/`、`packages/pets/src/sprites.js` 和 `preview/pets.html`。
- **脸：** 每格重画，不换画风。`T10`（眼 3 宽）/`T11`（眼 4 宽，萌智子）是 7 行的脸模板，`PETS[].mask` 圈出能改的格子（刘海、发丝不动），`pal` 用角色自己的颜色。原图那张脸留在 `PETS[].orig` 那个状态里。
- **身体：** `RIG` 定头身分界、腿、肩点和要擦掉的原手。手是代码画的（`ARM_POSES`，左手坐标，右手镜像），袖子、手、袖口用角色自己的颜色。角色招牌手势（くるみ捂脸）用原图的手（`{ orig: 1 }`），别用画的手代替，会飘。
- **状态机：** 盈亏 → 状态（`moodFromPnl`），进状态先播过渡（`transitions()`：愣住、越想越慌、腿软坐下、爬起来、打哈欠、伸懒腰），再在 `REPERTOIRE[角色][状态]` 里按权重循环动作。坐下和原图手会被记住，离开时先播对应过渡。惊呆（`pet.shock()`）随时打断。
- **加动作：** 在 `ACTS` 里写 `f(t, 参数, 时长)` 返回姿势（`dyAll/dyBody/dyHead/tilt/sit/lift/dx/L/R`），挂进角色的动作池。不 OOC：先想这个角色在这个状态下会不会这么做。
- **加角色：** 原图放进 `pets/source/`，`build-pets.py` 的 `IDS` 加上，再在 `index.js` 补 `PETS`、`RIG`、`REP`、`L`（9 个状态各一句）。
- **自检：** `node scripts/check-pets.mjs`（模板尺寸、动作和手势都存在、台词齐、盈亏分档），然后开 `preview/pets.html` 每个状态看一眼。

## 用

```tsx
import { Bell } from '@katana-icons/react'                 // ОКБ 图标
import '@katana-icons/react/styles.css'
import { TrendLine, DepthChart } from '@katana-icons/react/trading'
import '@katana-icons/react/trading.css'
import { KanjiCode } from '@katana-icons/react/kanji'
import '@katana-icons/fonts/fonts.css'                      // 全部自托管字体
import '@katana-icons/fonts/eva.css'                        // 可选：EVA 式排字

<TrendLine />                                   // 默认 light 1.5，单色
<DepthChart variant="line-duo" animated />
<KanjiCode name="trend-line" size={24} />
<h1 style={{ fontFamily: 'KT Stencil' }}>KATANA</h1>
```

强调色 `--kti-accent`，填充底色 `--kti-tint`，标志红点 `--katana-shu`。

## 交付前

- 自检清零（ОКБ：`scripts/check.mjs`；线性：Kubai `check.mjs`；宠物：`scripts/check-pets.mjs`）。
- 在浏览器里真看一眼：图标截图、字体用 `type/dist/specimen.html` 或打包后的 `fonts.css` 排一页。
- 改了生成物就重跑对应生成器，生成文件不手改；`CHANGELOG.md` 写一条，按批打 `vX.Y.Z` 标签。
