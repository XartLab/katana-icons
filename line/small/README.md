# 小图标的范围

2026-11-26 统计 KATANAview 与 KatanaUI 的 `lucide-react` 引用（含多行 import，去掉 `Icon` 后缀）：用到 218 个名字。

- 用 3 次以上 59 个、用 2 次 24 个：这 83 个加 circle-alert、rotate-cw、refresh-cw 三个常见件，共 86 个，在 `defs.mjs` 里按 KATANA 规矩重画。
- 只用 1 次的 135 个：大半是图表绘图工具栏（KATANAview `src/panels/chart/drawings.ts`）里的形状和画笔，归画图工具，不在这里；其余继续用通用线性图标或 lucide。

产品里某个图标用得多了，再加进来。
