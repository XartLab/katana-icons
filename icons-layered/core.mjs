// SPDX-License-Identifier: MIT
// 分层图标：48 网格，活动区 4–44，坐标取 0.5 的整数倍。back 在最后、content 在中、front 在最前。
// 每层 { d 闭合轮廓, lines? 开放细线, dots? 实心小件, motion?, origin? }。规则见 docs/layered.md。

const RING = (cx, cy, r) => `M${cx + r} ${cy} A${r} ${r} 0 1 1 ${cx - r} ${cy} A${r} ${r} 0 1 1 ${cx + r} ${cy} Z`

export default [
  {
    name: 'folder', zh: '文件夹', keywords: ['files', 'directory'],
    back: { d: 'M6 12 L10 8 H20 L23 11 H42 V38 H6 Z' },
    content: { d: 'M10 14 H38 V34 H10 Z', lines: 'M14 19 H30 M14 23.5 H26', motion: 'lift' },
    front: { d: 'M6 23 L9 20 H42 V40 H6 Z', motion: 'open', origin: [24, 40] },
  },
  {
    name: 'mail', zh: '邮件', keywords: ['message', 'inbox'],
    back: { d: 'M6 16 H42 V40 H6 Z' },
    content: { d: 'M11 7 H37 V32 H11 Z', lines: 'M15 13 H31 M15 17.5 H27 M15 22 H29', motion: 'lift' },
    front: { d: 'M6 22 L24 32 L42 22 V40 H6 Z' },
    light: [34, 34],
  },
  {
    name: 'download', zh: '下载', keywords: ['save', 'export'],
    back: { d: 'M6 24 H42 V41 H6 Z' },
    content: { d: 'M20 5 H28 V17 H34 L24 28 L14 17 H20 Z', motion: 'sink' },
    front: { d: 'M6 29 H16 L19 33 H29 L32 29 H42 V41 H6 Z' },
  },
  {
    name: 'calendar', zh: '日历', keywords: ['date', 'schedule'],
    back: { d: 'M6 9 H42 V21 H6 Z' },
    content: { d: 'M13 4 H17 V14 H13 Z M31 4 H35 V14 H31 Z', motion: 'lift' },
    front: { d: 'M6 17 H42 V39 L39 42 H6 Z', dots: 'M11 22 H15 V26 H11 Z M19 22 H23 V26 H19 Z M27 22 H31 V26 H27 Z M11 30 H15 V34 H11 Z M19 30 H23 V34 H19 Z' },
    light: [27, 30],
  },
  {
    name: 'lock', zh: '锁定', keywords: ['secure', 'trading lock'],
    back: { d: 'M14 23 V14 L19 8 H29 L34 14 V23 H29.5 V15.5 L27 12.5 H21 L18.5 15.5 V23 Z', motion: 'lift' },
    front: { d: 'M9 25 L12 22 H39 V43 H9 Z', dots: 'M22 28 H26 V36 H22 Z' },
    light: [22, 28],
  },
  {
    name: 'document', zh: '文档', keywords: ['file', 'page', 'report'],
    back: { d: 'M14 5 H33 L39 11 V37 H14 Z', motion: 'diag' },
    front: { d: 'M8 10 H27 L33 16 V43 H8 Z', lines: 'M27 10 V16 H33 M12 23 H28 M12 28 H28 M12 33 H22' },
  },
  {
    name: 'bell', zh: '提醒', keywords: ['alert', 'notification'],
    back: { d: 'M12 33 V22 A12 12 0 0 1 36 22 V33 Z', motion: 'swing', origin: [24, 8] },
    content: { d: 'M20 37 H28 V43 H20 Z' },
    front: { d: 'M7 31 H41 V37 H7 Z' },
    light: [30, 14],
  },
  {
    name: 'chart', zh: '图表', keywords: ['stats', 'analytics', 'volume'],
    back: { d: 'M6 9 L9 6 H42 V42 H6 Z' },
    content: { d: 'M12 26 H18 V36 H12 Z M21 18 H27 V36 H21 Z M30 12 H36 V36 H30 Z', motion: 'grow', origin: [24, 36] },
    front: { d: 'M4 35 H44 V42 H4 Z' },
  },
  {
    name: 'wallet', zh: '钱包', keywords: ['account', 'balance', 'funds'],
    back: { d: 'M8 13 L12 7 H34 V16 H8 Z' },
    content: { d: 'M12 6 H36 V20 H12 Z', lines: 'M16 11 H28', motion: 'lift' },
    front: { d: 'M6 17 H42 V41 H6 Z', dots: 'M32 25 H42 V33 H32 Z' },
    light: [35, 27],
  },
  {
    name: 'search', zh: '搜索', keywords: ['find', 'lookup'],
    back: { d: 'M30 27 L43 40 L39 44 L26 31 Z' },
    content: { d: RING(20, 20, 10), motion: 'pop', origin: [20, 20] },
    front: { d: `${RING(20, 20, 15)} ${RING(20, 20, 10)}`, motion: 'pop', origin: [20, 20] },
  },
  {
    name: 'trash', zh: '删除', keywords: ['delete', 'remove', 'bin'],
    back: { d: 'M8 11 H40 V16 H8 Z M19 7 H29 V11 H19 Z', motion: 'lift' },
    content: { d: 'M17 13 H31 V21 H17 Z' },
    front: { d: 'M10 18 H38 L36 43 H12 Z', lines: 'M19 24 V37 M24 24 V37 M29 24 V37' },
  },
  {
    name: 'camera', zh: '截图', keywords: ['snapshot', 'photo'],
    back: { d: 'M16 8 H32 L35 14 H13 Z' },
    front: { d: `M6 16 L9 13 H42 V39 H6 Z ${RING(24, 26, 8.5)}` },
    content: { d: RING(24, 26, 8.5), lines: 'M20 26 A4 4 0 0 1 24 22', motion: 'pop', origin: [24, 26] },
    light: [35, 17],
  },
  {
    name: 'chat', zh: '对话', keywords: ['message', 'comment', 'agent'],
    back: { d: 'M15 5 H43 V25 H37 V30 L32 25 H15 Z', motion: 'diag' },
    front: { d: 'M5 16 L8 13 H34 V34 H17 L11 40 V34 H5 Z', dots: 'M11 22 H15 V26 H11 Z M18 22 H22 V26 H18 Z M25 22 H29 V26 H25 Z' },
  },
  {
    name: 'settings', zh: '设置', keywords: ['gear', 'preferences', 'nut'],
    back: { d: 'M24 4 L41.5 14 V34 L24 44 L6.5 34 V14 Z' },
    content: { d: RING(24, 24, 6) },
    front: { d: `M24 9 L37 16.5 V31.5 L24 39 L11 31.5 V16.5 Z ${RING(24, 24, 6)}`, motion: 'spin', origin: [24, 24] },
  },
  {
    name: 'kt-workbench', zh: '工作台', keywords: ['KATANAview', 'console', 'cockpit'],
    back: { d: 'M18 36 H30 L33 43 H15 Z' },
    front: { d: `M5 11 L10 6 H43 V37 H5 Z M11 15 H37 L35 25 H13 Z` },
    content: { d: 'M11 15 H37 L35 25 H13 Z', motion: 'slide-right' },
    light: [29, 18],
  },
  {
    name: 'kt-ledger', zh: '台账', keywords: ['k-atana-book', 'journal'],
    back: { d: 'M10 5 H42 V43 H10 Z' },
    content: { d: 'M14 8 H39 V40 H14 Z', lines: 'M27 15 H35 M27 20 H35 M27 25 H35 M27 30 H32' },
    front: { d: 'M6 9 L9 6 H24 V43 H6 Z', motion: 'open', origin: [6, 24] },
  },
  {
    name: 'kt-lab', zh: '研究', keywords: ['katana-lab', 'hypothesis', 'experiment'],
    back: { d: 'M43 13 V43 H13 Z' },
    content: { d: 'M21 21 H27 V27 H21 Z' },
    front: { d: 'M5 9 L9 5 H35 L5 35 Z', motion: 'diag' },
    light: [22, 22],
  },
  {
    name: 'kt-plugin', zh: '插件', keywords: ['widget-sdk', 'extension', 'pack'],
    back: { d: 'M5 9 L9 5 H22 V16 H15 V32 H22 V43 H5 Z' },
    content: { d: 'M9 20 H15 V22.5 H9 Z M9 25.5 H15 V28 H9 Z' },
    front: { d: 'M27 5 H43 V43 H27 V31 H19 V17 H27 Z', motion: 'slide-left' },
    light: [36, 9],
  },
]
