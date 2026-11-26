// 生成文件，勿手改：node scripts/build-general.mjs
import type { ForwardRefExoticComponent, RefAttributes, SVGProps } from 'react'
export interface GeneralIconProps extends Omit<SVGProps<SVGSVGElement>, 'ref'> {
  /** 像素尺寸，默认 24 */
  size?: number | string
  /** 字重档：1.5 / 2 / 2.25 / 2.5；默认 light（原研哉：细线） */
  weight?: 'light' | 'regular' | 'medium' | 'bold'
  /** 直接给线宽，优先于 weight */
  strokeWidth?: number
  /** 线性、双色线性、面性、面性填充；默认 outline */
  variant?: 'outline' | 'line-duo' | 'fill' | 'solid-tint'
  /** 悬停自己或带 data-kti-hover 的祖先时播放动效 */
  animated?: boolean
  title?: string
}
export type GeneralIcon = ForwardRefExoticComponent<GeneralIconProps & RefAttributes<SVGSVGElement>>
export type GeneralIconName = 'activity' | 'align-center' | 'anchor' | 'arrow-down' | 'arrow-left' | 'arrow-left-right' | 'arrow-right' | 'arrow-right-to-line' | 'arrow-up' | 'arrow-up-to-line' | 'bell' | 'bell-plus' | 'bell-ring' | 'blocks' | 'bold' | 'bookmark' | 'bot' | 'building' | 'cable' | 'calculator' | 'calendar-days' | 'camera' | 'chart-bar' | 'chart-candlestick' | 'chart-spline' | 'check' | 'chevron-down' | 'chevron-left' | 'chevron-right' | 'chevron-up' | 'chevrons-down' | 'chevrons-right' | 'chevrons-up' | 'chevrons-up-down' | 'circle-alert' | 'circle-check' | 'circle-dashed' | 'circle-help' | 'clipboard-check' | 'coins' | 'columns' | 'contrast' | 'copy' | 'copy-plus' | 'crown' | 'dice' | 'download' | 'equal' | 'eraser' | 'expand' | 'external-link' | 'eye' | 'eye-off' | 'fast-forward' | 'file' | 'file-code' | 'flag' | 'flame' | 'flask' | 'folder' | 'folder-open' | 'function' | 'git-branch' | 'globe' | 'grip-horizontal' | 'grip-vertical' | 'history' | 'hourglass' | 'info' | 'italic' | 'landmark' | 'layers' | 'layout-grid' | 'layout-template' | 'list' | 'loader-circle' | 'lock' | 'lock-open' | 'maximize' | 'message-circle' | 'messages-square' | 'minimize' | 'minus' | 'moon' | 'more-horizontal' | 'newspaper' | 'notebook' | 'octagon-alert' | 'paperclip' | 'pause' | 'pencil' | 'pencil-line' | 'pin' | 'play' | 'plus' | 'power' | 'redo-2' | 'refresh-cw' | 'repeat' | 'rewind' | 'rotate-ccw' | 'rotate-cw' | 'scissors' | 'search' | 'settings' | 'shield-question' | 'skip-forward' | 'sliders' | 'snowflake' | 'sparkles' | 'square' | 'square-pen' | 'star' | 'sticky-note' | 'sun' | 'table' | 'thumbs-down' | 'thumbs-up' | 'trash' | 'trending-down' | 'trending-up' | 'triangle-alert' | 'undo-2' | 'upload' | 'volume-2' | 'volume-x' | 'wallet' | 'x' | 'zap'
export declare function createGeneralIcon(name: GeneralIconName): GeneralIcon
export declare const generalIconNames: GeneralIconName[]
/** 动态 */
export declare const Activity: GeneralIcon
/** 居中对齐 */
export declare const AlignCenter: GeneralIcon
/** 锚 */
export declare const Anchor: GeneralIcon
/** 向下箭头 */
export declare const ArrowDown: GeneralIcon
/** 向左箭头 */
export declare const ArrowLeft: GeneralIcon
/** 左右互换 */
export declare const ArrowLeftRight: GeneralIcon
/** 向右箭头 */
export declare const ArrowRight: GeneralIcon
/** 移到最右 */
export declare const ArrowRightToLine: GeneralIcon
/** 向上箭头 */
export declare const ArrowUp: GeneralIcon
/** 移到顶部 */
export declare const ArrowUpToLine: GeneralIcon
/** 通知 */
export declare const Bell: GeneralIcon
/** 添加提醒 */
export declare const BellPlus: GeneralIcon
/** 响铃提醒 */
export declare const BellRing: GeneralIcon
/** 积木 */
export declare const Blocks: GeneralIcon
/** 加粗 */
export declare const Bold: GeneralIcon
/** 书签 */
export declare const Bookmark: GeneralIcon
/** 机器人 */
export declare const Bot: GeneralIcon
/** 楼房 */
export declare const Building: GeneralIcon
/** 连接线 */
export declare const Cable: GeneralIcon
/** 计算器 */
export declare const Calculator: GeneralIcon
/** 月历 */
export declare const CalendarDays: GeneralIcon
/** 相机 */
export declare const Camera: GeneralIcon
/** 统计 */
export declare const ChartBar: GeneralIcon
/** K 线图 */
export declare const ChartCandlestick: GeneralIcon
/** 曲线图 */
export declare const ChartSpline: GeneralIcon
/** 对勾 */
export declare const Check: GeneralIcon
/** 向下折角 */
export declare const ChevronDown: GeneralIcon
/** 向左折角 */
export declare const ChevronLeft: GeneralIcon
/** 向右折角 */
export declare const ChevronRight: GeneralIcon
/** 向上折角 */
export declare const ChevronUp: GeneralIcon
/** 双下折角 */
export declare const ChevronsDown: GeneralIcon
/** 双右折角 */
export declare const ChevronsRight: GeneralIcon
/** 双上折角 */
export declare const ChevronsUp: GeneralIcon
/** 上下折角 */
export declare const ChevronsUpDown: GeneralIcon
/** 提醒 */
export declare const CircleAlert: GeneralIcon
/** 完成 */
export declare const CircleCheck: GeneralIcon
/** 虚线圆 */
export declare const CircleDashed: GeneralIcon
/** 帮助 */
export declare const CircleHelp: GeneralIcon
/** 剪贴板 */
export declare const ClipboardCheck: GeneralIcon
/** 硬币堆 */
export declare const Coins: GeneralIcon
/** 分栏 */
export declare const Columns: GeneralIcon
/** 对比度 */
export declare const Contrast: GeneralIcon
/** 复制 */
export declare const Copy: GeneralIcon
/** 复制一份 */
export declare const CopyPlus: GeneralIcon
/** 皇冠 */
export declare const Crown: GeneralIcon
/** 骰子 */
export declare const Dice: GeneralIcon
/** 下载 */
export declare const Download: GeneralIcon
/** 等于 */
export declare const Equal: GeneralIcon
/** 橡皮擦 */
export declare const Eraser: GeneralIcon
/** 展开 */
export declare const Expand: GeneralIcon
/** 外部链接 */
export declare const ExternalLink: GeneralIcon
/** 查看 */
export declare const Eye: GeneralIcon
/** 隐藏 */
export declare const EyeOff: GeneralIcon
/** 快进 */
export declare const FastForward: GeneralIcon
/** 文档 */
export declare const File: GeneralIcon
/** 代码文件 */
export declare const FileCode: GeneralIcon
/** 标记 */
export declare const Flag: GeneralIcon
/** 火焰 */
export declare const Flame: GeneralIcon
/** 烧瓶 */
export declare const Flask: GeneralIcon
/** 文件夹 */
export declare const Folder: GeneralIcon
/** 打开的文件夹 */
export declare const FolderOpen: GeneralIcon
/** 函数 */
export declare const Function: GeneralIcon
/** 分支 */
export declare const GitBranch: GeneralIcon
/** 地球 */
export declare const Globe: GeneralIcon
/** 横向拖动手柄 */
export declare const GripHorizontal: GeneralIcon
/** 竖向拖动手柄 */
export declare const GripVertical: GeneralIcon
/** 历史记录 */
export declare const History: GeneralIcon
/** 沙漏 */
export declare const Hourglass: GeneralIcon
/** 信息 */
export declare const Info: GeneralIcon
/** 斜体 */
export declare const Italic: GeneralIcon
/** 银行 */
export declare const Landmark: GeneralIcon
/** 图层 */
export declare const Layers: GeneralIcon
/** 宫格布局 */
export declare const LayoutGrid: GeneralIcon
/** 版式模板 */
export declare const LayoutTemplate: GeneralIcon
/** 列表 */
export declare const List: GeneralIcon
/** 加载中 */
export declare const LoaderCircle: GeneralIcon
/** 锁定 */
export declare const Lock: GeneralIcon
/** 解锁 */
export declare const LockOpen: GeneralIcon
/** 全屏 */
export declare const Maximize: GeneralIcon
/** 消息 */
export declare const MessageCircle: GeneralIcon
/** 对话 */
export declare const MessagesSquare: GeneralIcon
/** 退出全屏 */
export declare const Minimize: GeneralIcon
/** 减号 */
export declare const Minus: GeneralIcon
/** 夜间 */
export declare const Moon: GeneralIcon
/** 更多 */
export declare const MoreHorizontal: GeneralIcon
/** 报纸 */
export declare const Newspaper: GeneralIcon
/** 笔记本 */
export declare const Notebook: GeneralIcon
/** 错误 */
export declare const OctagonAlert: GeneralIcon
/** 附件 */
export declare const Paperclip: GeneralIcon
/** 暂停 */
export declare const Pause: GeneralIcon
/** 编辑 */
export declare const Pencil: GeneralIcon
/** 书写 */
export declare const PencilLine: GeneralIcon
/** 固定 */
export declare const Pin: GeneralIcon
/** 播放 */
export declare const Play: GeneralIcon
/** 加号 */
export declare const Plus: GeneralIcon
/** 电源 */
export declare const Power: GeneralIcon
/** 前进 */
export declare const Redo2: GeneralIcon
/** 刷新 */
export declare const RefreshCw: GeneralIcon
/** 循环播放 */
export declare const Repeat: GeneralIcon
/** 快退 */
export declare const Rewind: GeneralIcon
/** 逆时针旋转 */
export declare const RotateCcw: GeneralIcon
/** 刷新 */
export declare const RotateCw: GeneralIcon
/** 剪刀 */
export declare const Scissors: GeneralIcon
/** 搜索 */
export declare const Search: GeneralIcon
/** 设置 */
export declare const Settings: GeneralIcon
/** 安全说明 */
export declare const ShieldQuestion: GeneralIcon
/** 下一首 */
export declare const SkipForward: GeneralIcon
/** 调节 */
export declare const Sliders: GeneralIcon
/** 雪花 */
export declare const Snowflake: GeneralIcon
/** 智能生成 */
export declare const Sparkles: GeneralIcon
/** 正方形 */
export declare const Square: GeneralIcon
/** 编写 */
export declare const SquarePen: GeneralIcon
/** 收藏 */
export declare const Star: GeneralIcon
/** 便签 */
export declare const StickyNote: GeneralIcon
/** 晴 */
export declare const Sun: GeneralIcon
/** 表格 */
export declare const Table: GeneralIcon
/** 点踩 */
export declare const ThumbsDown: GeneralIcon
/** 点赞 */
export declare const ThumbsUp: GeneralIcon
/** 删除 */
export declare const Trash: GeneralIcon
/** 下跌 */
export declare const TrendingDown: GeneralIcon
/** 上涨 */
export declare const TrendingUp: GeneralIcon
/** 警告 */
export declare const TriangleAlert: GeneralIcon
/** 返回 */
export declare const Undo2: GeneralIcon
/** 上传 */
export declare const Upload: GeneralIcon
/** 音量中 */
export declare const Volume2: GeneralIcon
/** 静音 */
export declare const VolumeX: GeneralIcon
/** 钱包 */
export declare const Wallet: GeneralIcon
/** 叉号 */
export declare const X: GeneralIcon
/** 闪电 */
export declare const Zap: GeneralIcon
