// SPDX-License-Identifier: MIT
// 界面图标。坐标都在 24 网格上、取 0.5 的整数倍，活动区 2–22。规则见 docs/rules.md。

const C = (cx, cy, r) => `M${cx + r} ${cy} A${r} ${r} 0 1 1 ${cx - r} ${cy} A${r} ${r} 0 1 1 ${cx + r} ${cy} Z`
const FRAME = 'M4 7 L7 4 H20 V20 H4 Z'

export default [
  { name: 'chevron-right', zh: '向右', keywords: ['next', 'expand'], parts: [{ id: 'mark', d: 'M9 6 L15 12 L9 18', motion: 'nudge-right' }] },
  { name: 'chevron-left', zh: '向左', keywords: ['back', 'previous'], parts: [{ id: 'mark', d: 'M15 6 L9 12 L15 18', motion: 'nudge-left' }] },
  { name: 'chevron-down', zh: '向下', keywords: ['open', 'dropdown'], parts: [{ id: 'mark', d: 'M6 9 L12 15 L18 9', motion: 'nudge-down' }] },
  { name: 'chevron-up', zh: '向上', keywords: ['collapse'], parts: [{ id: 'mark', d: 'M6 15 L12 9 L18 15', motion: 'nudge-up' }] },
  { name: 'arrow-right', zh: '右箭头', keywords: ['go'], parts: [{ id: 'arrow', d: 'M4.5 12 H19 M13 6 L19 12 L13 18', motion: 'nudge-right' }] },
  { name: 'arrow-left', zh: '左箭头', keywords: ['back'], parts: [{ id: 'arrow', d: 'M19.5 12 H5 M11 6 L5 12 L11 18', motion: 'nudge-left' }] },
  { name: 'arrow-up', zh: '上箭头', keywords: ['rise', 'sort ascending'], parts: [{ id: 'arrow', d: 'M12 19.5 V5 M6 11 L12 5 L18 11', motion: 'nudge-up' }] },
  { name: 'arrow-down', zh: '下箭头', keywords: ['fall', 'sort descending'], parts: [{ id: 'arrow', d: 'M12 4.5 V19 M6 13 L12 19 L18 13', motion: 'nudge-down' }] },
  { name: 'x', zh: '关闭', keywords: ['close', 'cancel', 'remove'], parts: [{ id: 'mark', d: 'M6 6 L18 18 M18 6 L6 18', motion: 'spin' }] },
  { name: 'check', zh: '确认', keywords: ['done', 'ok'], parts: [{ id: 'mark', d: 'M5 12.5 L10 17.5 L19 6.5', motion: 'pop' }] },
  { name: 'plus', zh: '添加', keywords: ['add', 'new'], parts: [{ id: 'mark', d: 'M12 5 V19 M5 12 H19', motion: 'spin' }] },
  { name: 'minus', zh: '减少', keywords: ['remove', 'collapse'], parts: [{ id: 'mark', d: 'M5 12 H19', motion: 'pop' }] },
  { name: 'ellipsis', zh: '更多', keywords: ['more', 'menu'], parts: [{ id: 'dots', d: 'M5 11 H7 V13 H5 Z M11 11 H13 V13 H11 Z M17 11 H19 V13 H17 Z', fill: true, motion: 'pop' }] },
  { name: 'menu', zh: '菜单', keywords: ['hamburger', 'list'], parts: [{ id: 'bars', d: 'M4 7 H20 M4 12 H20 M4 17 H20' }, { id: 'top', d: 'M4 7 H14', motion: 'slide' }] },
  {
    name: 'search', zh: '搜索', keywords: ['find', 'lookup'],
    parts: [{ id: 'lens', d: `${C(10.5, 10.5, 5.5)} M14.5 14.5 L20 20`, motion: 'pop', origin: [10.5, 10.5] }],
  },
  {
    name: 'external-link', zh: '外部链接', keywords: ['open', 'new window'],
    parts: [{ id: 'box', d: 'M10 5 H7 L4 8 V20 H19 V14' }, { id: 'arrow', d: 'M13 4.5 H19.5 V11 M19.5 4.5 L11 13', motion: 'nudge-diag' }],
  },
  {
    name: 'bell', zh: '提醒', keywords: ['alert', 'notification'],
    parts: [{ id: 'body', d: 'M6 17 V11 A6 6 0 0 1 18 11 V17 M4 17 H20 M10 20 H14', motion: 'swing', origin: [12, 5] }],
    light: [16, 7],
  },
  {
    name: 'info', zh: '说明', keywords: ['about', 'help'],
    parts: [{ id: 'frame', d: FRAME }, { id: 'mark', d: 'M12 11 V16.5 M12 7.5 V9', motion: 'nudge-up' }],
  },
  {
    name: 'triangle-alert', zh: '警告', keywords: ['warning', 'caution'],
    parts: [{ id: 'frame', d: 'M12 4 L21 19.5 H3 Z' }, { id: 'mark', d: 'M12 9.5 V14 M12 15.5 V17', motion: 'pop', origin: [12, 13] }],
  },
  {
    name: 'octagon-alert', zh: '停止', keywords: ['error', 'stop', 'danger'],
    parts: [{ id: 'frame', d: 'M8.5 3.5 H15.5 L20.5 8.5 V15.5 L15.5 20.5 H8.5 L3.5 15.5 V8.5 Z' }, { id: 'mark', d: 'M12 7.5 V13 M12 14.5 V16.5', motion: 'pop' }],
  },
  {
    name: 'copy', zh: '复制', keywords: ['duplicate', 'clipboard'],
    parts: [{ id: 'back', d: 'M15 9 V4 H7 L4 7 V15 H9' }, { id: 'front', d: 'M9 9 H20 V20 H9 Z', motion: 'nudge-diag' }],
  },
  {
    name: 'download', zh: '下载', keywords: ['save', 'export'],
    parts: [{ id: 'tray', d: 'M4 15 V20 H20 V15' }, { id: 'arrow', d: 'M12 4 V14.5 M7.5 10 L12 14.5 L16.5 10', motion: 'nudge-down' }],
  },
  {
    name: 'upload', zh: '上传', keywords: ['import'],
    parts: [{ id: 'tray', d: 'M4 15 V20 H20 V15' }, { id: 'arrow', d: 'M12 15 V4.5 M7.5 9 L12 4.5 L16.5 9', motion: 'nudge-up' }],
  },
  { name: 'table', zh: '表格', keywords: ['grid', 'sheet'], parts: [{ id: 'grid', d: 'M4 4 H20 V20 H4 Z M4 9 H20 M4 14.5 H20 M10 9 V20' }] },
  { name: 'square', zh: '方块', keywords: ['stop', 'shape'], parts: [{ id: 'box', d: 'M5 5 H19 V19 H5 Z', motion: 'press' }] },
  { name: 'play', zh: '播放', keywords: ['start', 'run'], parts: [{ id: 'mark', d: 'M7 5 L19 12 L7 19 Z', motion: 'nudge-right' }] },
  { name: 'pause', zh: '暂停', keywords: ['hold'], parts: [{ id: 'bars', d: 'M7 5 H10 V19 H7 Z M14 5 H17 V19 H14 Z', motion: 'press' }] },
  {
    name: 'maximize', zh: '最大化', keywords: ['fullscreen', 'expand'],
    parts: [{ id: 'corners', d: 'M4 9 V4 H9 M15 4 H20 V9 M20 15 V20 H15 M9 20 H4 V15', motion: 'pop' }],
  },
  {
    name: 'expand', zh: '展开', keywords: ['enlarge', 'fullscreen'],
    parts: [{ id: 'out', d: 'M14 4 H20 V10 M20 4 L13 11', motion: 'nudge-diag' }, { id: 'in', d: 'M10 20 H4 V14 M4 20 L11 13' }],
  },
  {
    name: 'calendar', zh: '日历', keywords: ['date', 'schedule'],
    parts: [{ id: 'body', d: 'M4 6 H20 V20 H4 Z M4 10 H20' }, { id: 'rings', d: 'M8 3.5 V8 M16 3.5 V8', motion: 'lift' }],
    light: [14.5, 14],
  },
  { name: 'zap', zh: '闪电', keywords: ['fast', 'trigger', 'power'], parts: [{ id: 'bolt', d: 'M13 3 L5 13.5 H11.5 L10.5 21 L19 10.5 H12.5 Z', motion: 'pop' }] },
  {
    name: 'undo', zh: '撤销', keywords: ['back', 'revert'],
    parts: [{ id: 'arrow', d: 'M9 6 L5 10 L9 14 M5 10 H15 A4.5 4.5 0 0 1 15 19 H11', motion: 'nudge-left' }],
  },
  {
    name: 'redo', zh: '重做', keywords: ['forward'],
    parts: [{ id: 'arrow', d: 'M15 6 L19 10 L15 14 M19 10 H9 A4.5 4.5 0 0 0 9 19 H13', motion: 'nudge-right' }],
  },
  {
    name: 'rotate-ccw', zh: '逆时针', keywords: ['reset', 'undo'],
    parts: [{ id: 'ring', d: 'M5 12 A7 7 0 1 0 12 5 M14.5 2.5 L12 5 L14.5 7.5', motion: 'spin-ccw' }],
  },
  {
    name: 'rotate-cw', zh: '刷新', keywords: ['refresh', 'reload', 'redo'],
    parts: [{ id: 'ring', d: 'M19 12 A7 7 0 1 1 12 5 M9.5 2.5 L12 5 L9.5 7.5', motion: 'spin' }],
  },
  {
    name: 'repeat', zh: '循环', keywords: ['loop', 'cycle'],
    parts: [{ id: 'top', d: 'M4 11 V8 H18 M15 5 L18 8 L15 11', motion: 'nudge-right' }, { id: 'bottom', d: 'M20 13 V16 H6 M9 19 L6 16 L9 13' }],
  },
  {
    name: 'power', zh: '电源', keywords: ['on', 'off', 'shutdown'],
    parts: [{ id: 'ring', d: 'M7.5 7 A7.5 7.5 0 1 0 16.5 7' }, { id: 'bar', d: 'M12 3 V11', motion: 'press', origin: [12, 7] }],
    light: [11, 15.5],
  },
  {
    name: 'layout-grid', zh: '网格布局', keywords: ['dashboard', 'tiles'],
    parts: [{ id: 'grid', d: 'M4 4 H10.5 V10.5 H4 Z M13.5 13.5 H20 V20 H13.5 Z M4 13.5 H10.5 V20 H4 Z' }, { id: 'tile', d: 'M13.5 4 H20 V10.5 H13.5 Z', motion: 'nudge-diag' }],
  },
  {
    name: 'git-branch', zh: '分支', keywords: ['version', 'fork'],
    parts: [{ id: 'trunk', d: 'M7 4 V20' }, { id: 'branch', d: 'M15 5 H19 V9 H15 Z M17 9 V12 L13 16 H7', motion: 'nudge-right', origin: [17, 12] }],
  },
  { name: 'file', zh: '文件', keywords: ['document', 'page'], parts: [{ id: 'sheet', d: 'M6 3.5 H14 L18.5 8 V20.5 H6 Z M14 3.5 V8 H18.5', motion: 'lift' }] },
  {
    name: 'camera', zh: '截图', keywords: ['snapshot', 'photo', 'screenshot'],
    parts: [{ id: 'body', d: 'M3.5 8 H7.5 L9.5 5.5 H14.5 L16.5 8 H20.5 V19 H3.5 Z' }, { id: 'lens', d: C(12, 13, 3.5), motion: 'pop', origin: [12, 13] }],
    light: [17, 10],
  },
  {
    name: 'bar-chart', zh: '柱状图', keywords: ['chart', 'stats', 'volume'],
    parts: [{ id: 'axis', d: 'M4 4 V20 H20' }, { id: 'bars', d: 'M7.5 11 H9.5 V17 H7.5 Z M11.5 7 H13.5 V17 H11.5 Z M15.5 9.5 H17.5 V17 H15.5 Z', fill: true, motion: 'lift', origin: [12, 17] }],
  },
  {
    name: 'trending-up', zh: '上涨', keywords: ['rise', 'growth', 'chart'],
    parts: [{ id: 'line', d: 'M3.5 17 L9.5 11 L13 14.5 L20 7.5 M15.5 7.5 H20 V12', motion: 'nudge-diag' }],
  },
  {
    name: 'trending-down', zh: '下跌', keywords: ['fall', 'drop', 'chart'],
    parts: [{ id: 'line', d: 'M3.5 7 L9.5 13 L13 9.5 L20 16.5 M15.5 16.5 H20 V12', motion: 'nudge-down' }],
  },
  {
    name: 'wallet', zh: '钱包', keywords: ['account', 'balance', 'funds'],
    parts: [{ id: 'body', d: 'M4 7 L7 4 H18 V7 M4 7 H20 V20 H4 Z' }, { id: 'clasp', d: 'M15 12 H20 V15.5 H15 Z', motion: 'nudge-right' }],
  },
  {
    name: 'sun', zh: '浅色', keywords: ['light mode', 'theme'],
    parts: [{ id: 'core', d: C(12, 12, 4) }, { id: 'rays', d: 'M12 2.5 V5 M12 19 V21.5 M2.5 12 H5 M19 12 H21.5 M5.5 5.5 L7 7 M17 17 L18.5 18.5 M18.5 5.5 L17 7 M7 17 L5.5 18.5', motion: 'spin' }],
  },
  {
    name: 'moon', zh: '深色', keywords: ['dark mode', 'theme'],
    parts: [{ id: 'moon', d: 'M15 4 A8.5 8.5 0 1 0 20 15.5 A6.5 6.5 0 0 1 15 4 Z', motion: 'spin-ccw' }],
  },
  { name: 'star', zh: '收藏', keywords: ['favorite', 'watchlist'], parts: [{ id: 'star', d: 'M12 3.5 L14.5 9 H20.5 L15.5 13 L17.5 19.5 L12 15.5 L6.5 19.5 L8.5 13 L3.5 9 H9.5 Z', motion: 'pop', origin: [12, 12.5] }] },
  {
    name: 'sparkles', zh: 'AI', keywords: ['ai', 'magic', 'assistant'],
    parts: [{ id: 'big', d: 'M10 4 L11.5 9 L16.5 10.5 L11.5 12 L10 17 L8.5 12 L3.5 10.5 L8.5 9 Z', motion: 'pop', origin: [10, 10.5] }, { id: 'small', d: 'M17.5 14 L18.5 16.5 L21 17.5 L18.5 18.5 L17.5 21 L16.5 18.5 L14 17.5 L16.5 16.5 Z' }],
  },
  {
    name: 'sliders', zh: '参数', keywords: ['settings', 'adjust', 'filter'],
    parts: [{ id: 'rails', d: 'M4 7 H8 M11 7 H20 M4 17 H13 M16 17 H20' }, { id: 'knob-a', d: 'M8 5 H11 V9 H8 Z', motion: 'slide' }, { id: 'knob-b', d: 'M13 15 H16 V19 H13 Z' }],
  },
  {
    name: 'settings', zh: '设置', keywords: ['gear', 'preferences', 'nut'],
    parts: [{ id: 'nut', d: `M12 3 L19.5 7.5 V16.5 L12 21 L4.5 16.5 V7.5 Z ${C(12, 12, 3)}`, motion: 'spin' }],
  },
  { name: 'pin', zh: '固定', keywords: ['pin', 'attach'], parts: [{ id: 'pin', d: 'M9.5 4 H14.5 M10.5 4 V10 L7.5 14 H16.5 L13.5 10 V4 M12 14 V20.5', motion: 'press', origin: [12, 14] }] },
  { name: 'pencil', zh: '编辑', keywords: ['edit', 'draw'], parts: [{ id: 'pencil', d: 'M15 4.5 L19.5 9 L9 19.5 H4.5 V15 Z M13 6.5 L17.5 11', motion: 'nudge-diag' }] },
  {
    name: 'paperclip', zh: '附件', keywords: ['attach', 'file'],
    parts: [{ id: 'clip', d: 'M15.5 7 V15.5 A3.5 3.5 0 0 1 8.5 15.5 V6.5 A2.5 2.5 0 0 1 13.5 6.5 V15 A1 1 0 0 1 11.5 15 V8', motion: 'lift' }],
  },
  {
    name: 'newspaper', zh: '新闻', keywords: ['news', 'feed'],
    parts: [{ id: 'paper', d: 'M4 5 H17 V20 H4 Z M17 9 H20 V20 H17' }, { id: 'lines', d: 'M7 9 H14 M7 12.5 H14 M7 16 H11', motion: 'nudge-right' }],
  },
  {
    name: 'trash', zh: '删除', keywords: ['delete', 'remove', 'bin'],
    parts: [{ id: 'lid', d: 'M5 7 H19 M9.5 7 V4.5 H14.5 V7', motion: 'lift' }, { id: 'can', d: 'M6.5 7 L7.5 20 H16.5 L17.5 7 M10.5 10.5 V16.5 M13.5 10.5 V16.5' }],
  },
  {
    name: 'eye', zh: '显示', keywords: ['show', 'visible', 'watch'],
    parts: [{ id: 'eye', d: 'M2.5 12 L7 7 H17 L21.5 12 L17 17 H7 Z' }, { id: 'pupil', d: 'M10.5 10.5 H13.5 V13.5 H10.5 Z', fill: true, motion: 'nudge-right' }],
  },
  {
    name: 'lock', zh: '锁定', keywords: ['secure', 'locked', 'trading lock'],
    parts: [{ id: 'body', d: 'M5.5 11 H18.5 V20.5 H5.5 Z M12 14.5 V17' }, { id: 'shackle', d: 'M8.5 11 V7.5 L10.5 5.5 H13.5 L15.5 7.5 V11', motion: 'lift' }],
    light: [11, 14.5],
  },
  {
    name: 'link', zh: '链接', keywords: ['url', 'connect'],
    parts: [{ id: 'left', d: 'M10 8 H7 L4 11 V13 L7 16 H10', motion: 'nudge-left' }, { id: 'right', d: 'M14 8 H17 L20 11 V13 L17 16 H14' }, { id: 'bar', d: 'M8.5 12 H15.5' }],
  },
  { name: 'filter', zh: '筛选', keywords: ['funnel', 'screen'], parts: [{ id: 'funnel', d: 'M4 5 H20 L14 12.5 V18.5 L10 20.5 V12.5 Z', motion: 'press', origin: [12, 5] }] },
  {
    name: 'home', zh: '首页', keywords: ['start', 'house'],
    parts: [{ id: 'house', d: 'M4 11 L12 4 L20 11 V20 H4 Z' }, { id: 'door', d: 'M10 20 V14.5 H14 V20', motion: 'press', origin: [12, 20] }],
  },
  {
    name: 'user', zh: '用户', keywords: ['account', 'profile', 'person'],
    parts: [{ id: 'head', d: C(12, 8.5, 3.5), motion: 'nudge-up' }, { id: 'body', d: 'M5 20.5 V18 L8 15 H16 L19 18 V20.5' }],
  },
  {
    name: 'clock', zh: '时间', keywords: ['time', 'schedule', 'session'],
    parts: [{ id: 'face', d: C(12, 12, 8) }, { id: 'hands', d: 'M12 7.5 V12 H15.5', motion: 'spin' }],
  },
]
