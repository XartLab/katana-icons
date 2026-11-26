// SPDX-License-Identifier: MIT
// 通用图标里 Kubai 线性库没有的 6 个，KATANA 自己画，格式跟 icons-line 的定义一样（24 网格、线宽 1.5/2/2.5 共用一份几何）。
const L = (d, key, o = {}) => ({ d, k: 'line', key, part: key, ...o });
const S = (d, key, o = {}) => ({ d, k: 'shell', key, part: key, ...o });
const F = (d, key, o = {}) => ({ d, k: 'solid', key, part: key, ...o });
const same = (o, f = o) => ({ '1.5': { o, f, x: [], a: [] }, '2': { o, f, x: [], a: [] }, '2.5': { o, f, x: [], a: [] } });

export default {
  equal: { name: 'equal', zh: '等于', key: 'landscape', fx: { t: 'keys', on: ['bars'], sx: [1.15] },
    w: same([L('M5 9H19M5 15H19', 'bars')]) },
  contrast: { name: 'contrast', zh: '对比度', key: 'circle', fx: { t: 'rotate', on: ['half'] },
    w: same([L('M20.25 12A8.25 8.25 0 1 1 3.75 12A8.25 8.25 0 1 1 20.25 12Z', 'ring'), F('M12 5.5A6.5 6.5 0 0 1 12 18.5Z', 'half', { lit: true })]) },
  'refresh-cw': { name: 'refresh-cw', zh: '刷新', key: 'circle', fx: { t: 'rotate', on: 'all' },
    w: same([L('M4.5 12A7.5 7.5 0 0 1 17.6 7M18.5 3.5V7.5H14.5', 'top'), L('M19.5 12A7.5 7.5 0 0 1 6.4 17M5.5 20.5V16.5H9.5', 'bottom')]) },
  'shield-question': { name: 'shield-question', zh: '安全说明', key: 'portrait', fx: { t: 'wiggle', on: ['mark'] },
    w: same([S('M12 3L19.25 5.75V11.5C19.25 15.9 16.2 19.4 12 20.75C7.8 19.4 4.75 15.9 4.75 11.5V5.75Z', 'shield', { tint: true }),
      L('M9.9 9.6A2.15 2.15 0 1 1 12 11.75V12.9M12 16.1V16.15', 'mark', { on: 'shield', lit: true })]) },
  cable: { name: 'cable', zh: '连接线', key: 'square', fx: { t: 'keys', on: ['plug'], y: [-1.5] },
    w: same([L('M7.5 3V6M10.5 3V6', 'prongs'), S('M5.5 6H12.5V9A3.5 3.5 0 0 1 5.5 9Z', 'plug', { tint: true }), L('M9 12.5V15A4.5 4.5 0 0 0 13.5 19.5H15.5A3.5 3.5 0 0 0 19 16V4', 'cord', { lit: true })]) },
  'copy-plus': { name: 'copy-plus', zh: '复制一份', key: 'square', fx: { t: 'keys', on: ['front', 'plus'], x: [1], y: [1] },
    w: same([L('M15.5 5.25V5.5A1.75 1.75 0 0 0 13.75 3.75H6A2.25 2.25 0 0 0 3.75 6V13.75A1.75 1.75 0 0 0 5.5 15.5H5.75', 'back'),
      S('M10.75 8.25H17.75A2.5 2.5 0 0 1 20.25 10.75V17.75A2.5 2.5 0 0 1 17.75 20.25H10.75A2.5 2.5 0 0 1 8.25 17.75V10.75A2.5 2.5 0 0 1 10.75 8.25Z', 'front', { tint: true }),
      L('M14.25 11.5V17M11.5 14.25H17', 'plus', { on: 'front', lit: true })]) }
};
