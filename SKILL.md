---
name: katana-icons
description: 按 KATANA 的统一风格画功能图标（24 网格、1.5 线宽、方头斜切、一颗座舱灯、悬停时做物体本身的动作），并导出 React 组件与静态 SVG。要给 KATANAview、KatanaUI 或其他 Katana 生态项目加图标、换掉 lucide 图标、或画产品自有图标时使用。
license: MIT
---

# katana-icons

这个仓库自带规则、绘制工具、范例、自检和导出。你的工作是照规则写新图标，不是改工具。

## 文件

- `docs/rules.md`：全部绘制规则，动手前读完。
- `src/kit.mjs`：渲染、动作表 `MOTIONS` 与动作 CSS。只在缺动作时加一条。
- `icons/ui.mjs`（界面图标）、`icons/katana.mjs`（生态自有，`kt-` 前缀）：图标定义，一个对象一个图标。
- `scripts/check.mjs`：自检，纯 Node，整套 1 秒内；`--sheet out/sheet.html` 顺带出总览页。
- `scripts/build.mjs`：生成 `packages/static/svg/`、`packages/react/`、`icons.json`。生成物不手改。

## 流程

1. 读 `docs/rules.md`。
2. 列出要画的东西：每个写一句"物体 + 悬停动作"，名字照规则 5。
3. 每画一个，先在 `icons/*.mjs` 里找结构最近的一两个照着写（有框的看 `info`、`file`；有箭头的看 `download`；会转的看 `settings`）。
4. 跑 `node scripts/check.mjs --only 新图标A,新图标B --sheet out/sheet.html`，把错误修到 0。
5. 截图看：`google-chrome --headless=new --screenshot=out/sheet.png --window-size=1300,1500 file://$PWD/out/sheet.html`，按规则 6 逐条核对；悬停动作在真浏览器里点一次。
6. `node scripts/build.mjs` 生成发布物，和图标定义一起提交。

## 用

```tsx
import { Bell, Lock } from '@katana-icons/react'
import '@katana-icons/react/styles.css'

<Bell />                              // 24px，跟文字色
<Lock size={16} strokeWidth={1.25} /> // 跟小号文字
<Bell light animated title="提醒" />   // 点灯、悬停摆动、读屏可读
<button data-kti-hover><Bell /> 提醒</button>  // 悬停整个按钮时图标动
```

静态文件在 `packages/static/svg/<名字>.svg`。灯的颜色用 CSS 变量 `--kti-light` 设。
