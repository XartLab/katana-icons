// SPDX-License-Identifier: MIT
// Katana 生态自有图标：每个产品一枚，和界面图标同一套线条规则。品牌标志只有一个（brand/katana.svg），这里不是标志。

const FRAME = 'M4 7 L7 4 H20 V20 H4 Z'

export default [
  {
    name: 'kt-workbench', zh: '工作台', keywords: ['KATANAview', 'console', 'cockpit'],
    parts: [{ id: 'frame', d: FRAME }, { id: 'visor', d: 'M7 10 H17 L16 13.5 H8 Z', motion: 'nudge-up' }],
    light: [13.5, 10.5],
  },
  {
    name: 'kt-components', zh: '组件库', keywords: ['KatanaUI', 'design system', 'modules'],
    parts: [{ id: 'grid', d: 'M4 7 L7 4 H10.5 V10.5 H4 Z M13.5 4 H20 V10.5 H13.5 Z M4 13.5 H10.5 V20 H4 Z' }, { id: 'tile', d: 'M13.5 13.5 H20 V17 L17 20 H13.5 Z', motion: 'nudge-diag' }],
    light: [11, 11],
  },
  {
    name: 'kt-lab', zh: '研究', keywords: ['katana-lab', 'hypothesis', 'experiment'],
    parts: [{ id: 'hypothesis', d: 'M4 7 L7 4 H17 L4 17 Z', motion: 'nudge-diag', origin: [8, 8] }, { id: 'test', d: 'M20 7 V20 H7 Z' }],
    light: [11, 11],
  },
  {
    name: 'kt-ledger', zh: '台账', keywords: ['k-atana-book', 'journal', 'positions'],
    parts: [{ id: 'book', d: `${FRAME} M8 4 V20` }, { id: 'rows', d: 'M11 9 H17 M11 12.5 H17 M11 16 H15', motion: 'nudge-right' }],
  },
  {
    name: 'kt-source', zh: '数据源', keywords: ['tdxcli-rs', 'ingest', 'feed'],
    parts: [{ id: 'body', d: 'M4 4 H8 L12 9 L16 4 H20 V20 H13 V12 H11 V20 H4 Z' }, { id: 'channel', d: 'M12 9 V12', motion: 'nudge-down' }],
    light: [11, 17],
  },
  {
    name: 'kt-executor', zh: '执行', keywords: ['qmtcli', 'order', 'gateway'],
    parts: [{ id: 'body', d: 'M4 7 L7 4 H14 V20 H4 Z' }, { id: 'rod', d: 'M16.5 10 H20 V14 H16.5 Z', motion: 'press', origin: [18, 12] }],
    light: [8, 11],
  },
  {
    name: 'kt-plugin', zh: '插件', keywords: ['widget-sdk', 'extension', 'pack'],
    parts: [{ id: 'socket', d: 'M13 4 H7 L4 7 V20 H13 V14.5 H9 V9.5 H13 Z' }, { id: 'plug', d: 'M15.5 4 H20 V20 H15.5 V14 H11.5 V10 H15.5 Z', motion: 'nudge-right' }],
  },
  {
    name: 'kt-watch', zh: '盯盘', keywords: ['always-on', 'agent', 'monitor'],
    parts: [{ id: 'scope', d: 'M4 7 L7 4 H20 V20 H4 Z M4 16 H20' }, { id: 'trace', d: 'M6.5 12.5 L9.5 9.5 L12 12 L15 8 L17.5 10.5', motion: 'nudge-right' }],
    light: [16.5, 17],
  },
]
