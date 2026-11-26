---
name: katana-icons
description: 做 KATANA 的视觉资产：功能图标（ОКБ 机加工风格、线性交易图标、模板字图标）、汉字代号、自有字体（KT Stencil / Solid / Pixel / Dot）、字体打包自托管、驾驶舱 HUD 部件、标志。要给 KATANAview、KatanaUI 或其他 Katana 项目加图标、加字、换掉 lucide、出新的字体文件或品牌图时使用。
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

### 3. 汉字代号（33 个）

`line/kanji-map.json` 是"图标名 → 汉字"。改完跑 `python3 scripts/kanji-outlines.py <DelaGothicOne-Regular.ttf>` 再 `node scripts/build-kanji.mjs`。最小用 20px。

### 4. 自有字体：KT Stencil / Solid / Pixel / Dot

四款字共用 `type/glyphs.py` 里的一份直线骨架：拉丁 6×8 网格、汉字 12×12 网格，每个字是几条折线，只用横、竖、45°。

- 加字：在 `LAT` 或 `KAN` 里加折线；笔画多的汉字在 `WEIGHT_K` 里调细。
- `python3 type/build_font.py` 一次出四个 TTF：Stencil（断缝）、Solid（不断缝）、Pixel（落格成方块）、Dot（落格成圆点）。
- 断缝规则在 `type/stencil.py` 的 `cuts`：端点碰到别的笔就断，交叉断后画的那笔，闭合的框断两处。
- 同规则的模板字图标：`python3 type/icons_stencil.py`，出 `packages/static/svg/stencil/`。
- 看效果：`type/dist/specimen.html`。

### 5. 字体打包（自托管）

`python3 scripts/build-fonts.py <源字体目录>` 把 `FONTS` 表里的每一款打成 WOFF2：中日文按 unicode-range 切片（常用字在前），文件名带内容哈希，可强缓存。新加开源字体：源文件从 github.com/google/fonts 取，许可文本放进 `packages/fonts/licenses/`，来源写进 `NOTICE`。商用授权的字（Matisse、Helvetica、东亚重工这类）不进包，用开源替身。

### 6. 驾驶舱 HUD

`hud/hud.mjs`：七段管、模板字、刻度带、准星、弧形仪表、读数框、锁定框、警示带、警告牌，每个函数返回 SVG 片段。`node hud/board.mjs` 出样张。

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

- 自检清零（ОКБ：`scripts/check.mjs`；线性：Kubai `check.mjs`）。
- 在浏览器里真看一眼：图标截图、字体用 `type/dist/specimen.html` 或打包后的 `fonts.css` 排一页。
- 改了生成物就重跑对应生成器，生成文件不手改；`CHANGELOG.md` 写一条，按批打 `vX.Y.Z` 标签。
