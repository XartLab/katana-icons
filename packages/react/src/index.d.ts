// SPDX-License-Identifier: MIT
// 生成文件，勿手改：node scripts/build.mjs
import type { ForwardRefExoticComponent, RefAttributes, SVGProps } from 'react'

export interface KatanaIconProps extends Omit<SVGProps<SVGSVGElement>, 'ref'> {
  /** 像素尺寸，默认 24 */
  size?: number | string
  /** 线宽 1–2，默认 1.5；跟旁边文字的字重走 */
  strokeWidth?: number
  /** 点亮座舱灯（颜色读 --kti-light，没设就跟文字色） */
  light?: boolean
  /** 自己悬停时播放动作；或在祖先上写 data-kti-hover */
  animated?: boolean
  /** 有文字含义时给读屏用；不给就是装饰（aria-hidden） */
  title?: string
}
export type KatanaIcon = ForwardRefExoticComponent<KatanaIconProps & RefAttributes<SVGSVGElement>>
export type KatanaIconName = 'arrow-down' | 'arrow-left' | 'arrow-right' | 'arrow-up' | 'bar-chart' | 'bell' | 'calendar' | 'camera' | 'check' | 'chevron-down' | 'chevron-left' | 'chevron-right' | 'chevron-up' | 'clock' | 'copy' | 'download' | 'ellipsis' | 'expand' | 'external-link' | 'eye' | 'file' | 'filter' | 'git-branch' | 'home' | 'info' | 'kt-components' | 'kt-executor' | 'kt-lab' | 'kt-ledger' | 'kt-plugin' | 'kt-source' | 'kt-watch' | 'kt-workbench' | 'layout-grid' | 'link' | 'lock' | 'maximize' | 'menu' | 'minus' | 'moon' | 'newspaper' | 'octagon-alert' | 'paperclip' | 'pause' | 'pencil' | 'pin' | 'play' | 'plus' | 'power' | 'redo' | 'repeat' | 'rotate-ccw' | 'rotate-cw' | 'search' | 'settings' | 'sliders' | 'sparkles' | 'square' | 'star' | 'sun' | 'table' | 'trash' | 'trending-down' | 'trending-up' | 'triangle-alert' | 'undo' | 'upload' | 'user' | 'wallet' | 'x' | 'zap'
export declare function createIcon(name: KatanaIconName): KatanaIcon
export declare const iconNames: KatanaIconName[]
/** 下箭头 */
export declare const ArrowDown: KatanaIcon
/** 左箭头 */
export declare const ArrowLeft: KatanaIcon
/** 右箭头 */
export declare const ArrowRight: KatanaIcon
/** 上箭头 */
export declare const ArrowUp: KatanaIcon
/** 柱状图 */
export declare const BarChart: KatanaIcon
/** 提醒 */
export declare const Bell: KatanaIcon
/** 日历 */
export declare const Calendar: KatanaIcon
/** 截图 */
export declare const Camera: KatanaIcon
/** 确认 */
export declare const Check: KatanaIcon
/** 向下 */
export declare const ChevronDown: KatanaIcon
/** 向左 */
export declare const ChevronLeft: KatanaIcon
/** 向右 */
export declare const ChevronRight: KatanaIcon
/** 向上 */
export declare const ChevronUp: KatanaIcon
/** 时间 */
export declare const Clock: KatanaIcon
/** 复制 */
export declare const Copy: KatanaIcon
/** 下载 */
export declare const Download: KatanaIcon
/** 更多 */
export declare const Ellipsis: KatanaIcon
/** 展开 */
export declare const Expand: KatanaIcon
/** 外部链接 */
export declare const ExternalLink: KatanaIcon
/** 显示 */
export declare const Eye: KatanaIcon
/** 文件 */
export declare const File: KatanaIcon
/** 筛选 */
export declare const Filter: KatanaIcon
/** 分支 */
export declare const GitBranch: KatanaIcon
/** 首页 */
export declare const Home: KatanaIcon
/** 说明 */
export declare const Info: KatanaIcon
/** 组件库 */
export declare const KtComponents: KatanaIcon
/** 执行 */
export declare const KtExecutor: KatanaIcon
/** 研究 */
export declare const KtLab: KatanaIcon
/** 台账 */
export declare const KtLedger: KatanaIcon
/** 插件 */
export declare const KtPlugin: KatanaIcon
/** 数据源 */
export declare const KtSource: KatanaIcon
/** 盯盘 */
export declare const KtWatch: KatanaIcon
/** 工作台 */
export declare const KtWorkbench: KatanaIcon
/** 网格布局 */
export declare const LayoutGrid: KatanaIcon
/** 链接 */
export declare const Link: KatanaIcon
/** 锁定 */
export declare const Lock: KatanaIcon
/** 最大化 */
export declare const Maximize: KatanaIcon
/** 菜单 */
export declare const Menu: KatanaIcon
/** 减少 */
export declare const Minus: KatanaIcon
/** 深色 */
export declare const Moon: KatanaIcon
/** 新闻 */
export declare const Newspaper: KatanaIcon
/** 停止 */
export declare const OctagonAlert: KatanaIcon
/** 附件 */
export declare const Paperclip: KatanaIcon
/** 暂停 */
export declare const Pause: KatanaIcon
/** 编辑 */
export declare const Pencil: KatanaIcon
/** 固定 */
export declare const Pin: KatanaIcon
/** 播放 */
export declare const Play: KatanaIcon
/** 添加 */
export declare const Plus: KatanaIcon
/** 电源 */
export declare const Power: KatanaIcon
/** 重做 */
export declare const Redo: KatanaIcon
/** 循环 */
export declare const Repeat: KatanaIcon
/** 逆时针 */
export declare const RotateCcw: KatanaIcon
/** 刷新 */
export declare const RotateCw: KatanaIcon
/** 搜索 */
export declare const Search: KatanaIcon
/** 设置 */
export declare const Settings: KatanaIcon
/** 参数 */
export declare const Sliders: KatanaIcon
/** AI */
export declare const Sparkles: KatanaIcon
/** 方块 */
export declare const Square: KatanaIcon
/** 收藏 */
export declare const Star: KatanaIcon
/** 浅色 */
export declare const Sun: KatanaIcon
/** 表格 */
export declare const Table: KatanaIcon
/** 删除 */
export declare const Trash: KatanaIcon
/** 下跌 */
export declare const TrendingDown: KatanaIcon
/** 上涨 */
export declare const TrendingUp: KatanaIcon
/** 警告 */
export declare const TriangleAlert: KatanaIcon
/** 撤销 */
export declare const Undo: KatanaIcon
/** 上传 */
export declare const Upload: KatanaIcon
/** 用户 */
export declare const User: KatanaIcon
/** 钱包 */
export declare const Wallet: KatanaIcon
/** 关闭 */
export declare const X: KatanaIcon
/** 闪电 */
export declare const Zap: KatanaIcon
