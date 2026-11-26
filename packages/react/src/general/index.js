// SPDX-License-Identifier: MIT
// 生成文件，勿手改：node scripts/build-general.mjs
import { createElement, forwardRef, useEffect, useId, useRef } from 'react'
import { lineMarkup, animateLine } from './vendor/line.js'
import DEFS from './defs.js'

const WEIGHT = { light: 1.5, regular: 2, medium: 2.25, bold: 2.5 }
export const generalIconNames = Object.keys(DEFS)

export function createGeneralIcon(name) {
  const def = DEFS[name]
  const C = forwardRef(function GeneralIcon({ size = 24, weight = 'light', strokeWidth, variant = 'outline', animated = false, title, className, ...rest }, ref) {
    const uid = useId().replace(/[^a-zA-Z0-9_-]/g, '')
    const own = useRef(null)
    const s = strokeWidth ?? WEIGHT[weight] ?? 1.5
    const body = lineMarkup(def, { s, variant }).replaceAll('__K__', 'kg' + uid)
    useEffect(() => {
      const svg = own.current
      if (!svg || !animated || !def.fx) return
      const m = animateLine(svg, { line: def }, { variant })
      const host = svg.closest('[data-kti-hover]') ?? svg
      const on = () => m.hover(true), off = () => m.hover(false)
      host.addEventListener('pointerenter', on); host.addEventListener('pointerleave', off)
      return () => { host.removeEventListener('pointerenter', on); host.removeEventListener('pointerleave', off); m.destroy() }
    }, [animated, variant, body])
    return createElement('svg', {
      ref: (el) => { own.current = el; if (typeof ref === 'function') ref(el); else if (ref) ref.current = el },
      xmlns: 'http://www.w3.org/2000/svg', viewBox: '0 0 24 24', width: size, height: size, fill: 'none',
      className: ['kti', 'kti-g', className].filter(Boolean).join(' '),
      role: title ? 'img' : undefined, 'aria-label': title, 'aria-hidden': title ? undefined : true,
      dangerouslySetInnerHTML: { __html: (title ? '<title>' + title.replace(/</g, '&lt;') + '</title>' : '') + body },
      ...rest
    })
  })
  C.displayName = 'General(' + name + ')'
  return C
}
/** 动态 */
export const Activity = createGeneralIcon('activity')
/** 居中对齐 */
export const AlignCenter = createGeneralIcon('align-center')
/** 锚 */
export const Anchor = createGeneralIcon('anchor')
/** 向下箭头 */
export const ArrowDown = createGeneralIcon('arrow-down')
/** 向左箭头 */
export const ArrowLeft = createGeneralIcon('arrow-left')
/** 左右互换 */
export const ArrowLeftRight = createGeneralIcon('arrow-left-right')
/** 向右箭头 */
export const ArrowRight = createGeneralIcon('arrow-right')
/** 移到最右 */
export const ArrowRightToLine = createGeneralIcon('arrow-right-to-line')
/** 向上箭头 */
export const ArrowUp = createGeneralIcon('arrow-up')
/** 移到顶部 */
export const ArrowUpToLine = createGeneralIcon('arrow-up-to-line')
/** 通知 */
export const Bell = createGeneralIcon('bell')
/** 添加提醒 */
export const BellPlus = createGeneralIcon('bell-plus')
/** 响铃提醒 */
export const BellRing = createGeneralIcon('bell-ring')
/** 积木 */
export const Blocks = createGeneralIcon('blocks')
/** 加粗 */
export const Bold = createGeneralIcon('bold')
/** 书签 */
export const Bookmark = createGeneralIcon('bookmark')
/** 机器人 */
export const Bot = createGeneralIcon('bot')
/** 楼房 */
export const Building = createGeneralIcon('building')
/** 连接线 */
export const Cable = createGeneralIcon('cable')
/** 计算器 */
export const Calculator = createGeneralIcon('calculator')
/** 月历 */
export const CalendarDays = createGeneralIcon('calendar-days')
/** 相机 */
export const Camera = createGeneralIcon('camera')
/** 统计 */
export const ChartBar = createGeneralIcon('chart-bar')
/** K 线图 */
export const ChartCandlestick = createGeneralIcon('chart-candlestick')
/** 曲线图 */
export const ChartSpline = createGeneralIcon('chart-spline')
/** 对勾 */
export const Check = createGeneralIcon('check')
/** 向下折角 */
export const ChevronDown = createGeneralIcon('chevron-down')
/** 向左折角 */
export const ChevronLeft = createGeneralIcon('chevron-left')
/** 向右折角 */
export const ChevronRight = createGeneralIcon('chevron-right')
/** 向上折角 */
export const ChevronUp = createGeneralIcon('chevron-up')
/** 双下折角 */
export const ChevronsDown = createGeneralIcon('chevrons-down')
/** 双右折角 */
export const ChevronsRight = createGeneralIcon('chevrons-right')
/** 双上折角 */
export const ChevronsUp = createGeneralIcon('chevrons-up')
/** 上下折角 */
export const ChevronsUpDown = createGeneralIcon('chevrons-up-down')
/** 提醒 */
export const CircleAlert = createGeneralIcon('circle-alert')
/** 完成 */
export const CircleCheck = createGeneralIcon('circle-check')
/** 虚线圆 */
export const CircleDashed = createGeneralIcon('circle-dashed')
/** 帮助 */
export const CircleHelp = createGeneralIcon('circle-help')
/** 剪贴板 */
export const ClipboardCheck = createGeneralIcon('clipboard-check')
/** 硬币堆 */
export const Coins = createGeneralIcon('coins')
/** 分栏 */
export const Columns = createGeneralIcon('columns')
/** 对比度 */
export const Contrast = createGeneralIcon('contrast')
/** 复制 */
export const Copy = createGeneralIcon('copy')
/** 复制一份 */
export const CopyPlus = createGeneralIcon('copy-plus')
/** 皇冠 */
export const Crown = createGeneralIcon('crown')
/** 骰子 */
export const Dice = createGeneralIcon('dice')
/** 下载 */
export const Download = createGeneralIcon('download')
/** 等于 */
export const Equal = createGeneralIcon('equal')
/** 橡皮擦 */
export const Eraser = createGeneralIcon('eraser')
/** 展开 */
export const Expand = createGeneralIcon('expand')
/** 外部链接 */
export const ExternalLink = createGeneralIcon('external-link')
/** 查看 */
export const Eye = createGeneralIcon('eye')
/** 隐藏 */
export const EyeOff = createGeneralIcon('eye-off')
/** 快进 */
export const FastForward = createGeneralIcon('fast-forward')
/** 文档 */
export const File = createGeneralIcon('file')
/** 代码文件 */
export const FileCode = createGeneralIcon('file-code')
/** 标记 */
export const Flag = createGeneralIcon('flag')
/** 火焰 */
export const Flame = createGeneralIcon('flame')
/** 烧瓶 */
export const Flask = createGeneralIcon('flask')
/** 文件夹 */
export const Folder = createGeneralIcon('folder')
/** 打开的文件夹 */
export const FolderOpen = createGeneralIcon('folder-open')
/** 函数 */
export const Function = createGeneralIcon('function')
/** 分支 */
export const GitBranch = createGeneralIcon('git-branch')
/** 地球 */
export const Globe = createGeneralIcon('globe')
/** 横向拖动手柄 */
export const GripHorizontal = createGeneralIcon('grip-horizontal')
/** 竖向拖动手柄 */
export const GripVertical = createGeneralIcon('grip-vertical')
/** 历史记录 */
export const History = createGeneralIcon('history')
/** 沙漏 */
export const Hourglass = createGeneralIcon('hourglass')
/** 信息 */
export const Info = createGeneralIcon('info')
/** 斜体 */
export const Italic = createGeneralIcon('italic')
/** 银行 */
export const Landmark = createGeneralIcon('landmark')
/** 图层 */
export const Layers = createGeneralIcon('layers')
/** 宫格布局 */
export const LayoutGrid = createGeneralIcon('layout-grid')
/** 版式模板 */
export const LayoutTemplate = createGeneralIcon('layout-template')
/** 列表 */
export const List = createGeneralIcon('list')
/** 加载中 */
export const LoaderCircle = createGeneralIcon('loader-circle')
/** 锁定 */
export const Lock = createGeneralIcon('lock')
/** 解锁 */
export const LockOpen = createGeneralIcon('lock-open')
/** 全屏 */
export const Maximize = createGeneralIcon('maximize')
/** 消息 */
export const MessageCircle = createGeneralIcon('message-circle')
/** 对话 */
export const MessagesSquare = createGeneralIcon('messages-square')
/** 退出全屏 */
export const Minimize = createGeneralIcon('minimize')
/** 减号 */
export const Minus = createGeneralIcon('minus')
/** 夜间 */
export const Moon = createGeneralIcon('moon')
/** 更多 */
export const MoreHorizontal = createGeneralIcon('more-horizontal')
/** 报纸 */
export const Newspaper = createGeneralIcon('newspaper')
/** 笔记本 */
export const Notebook = createGeneralIcon('notebook')
/** 错误 */
export const OctagonAlert = createGeneralIcon('octagon-alert')
/** 附件 */
export const Paperclip = createGeneralIcon('paperclip')
/** 暂停 */
export const Pause = createGeneralIcon('pause')
/** 编辑 */
export const Pencil = createGeneralIcon('pencil')
/** 书写 */
export const PencilLine = createGeneralIcon('pencil-line')
/** 固定 */
export const Pin = createGeneralIcon('pin')
/** 播放 */
export const Play = createGeneralIcon('play')
/** 加号 */
export const Plus = createGeneralIcon('plus')
/** 电源 */
export const Power = createGeneralIcon('power')
/** 前进 */
export const Redo2 = createGeneralIcon('redo-2')
/** 刷新 */
export const RefreshCw = createGeneralIcon('refresh-cw')
/** 循环播放 */
export const Repeat = createGeneralIcon('repeat')
/** 快退 */
export const Rewind = createGeneralIcon('rewind')
/** 逆时针旋转 */
export const RotateCcw = createGeneralIcon('rotate-ccw')
/** 刷新 */
export const RotateCw = createGeneralIcon('rotate-cw')
/** 剪刀 */
export const Scissors = createGeneralIcon('scissors')
/** 搜索 */
export const Search = createGeneralIcon('search')
/** 设置 */
export const Settings = createGeneralIcon('settings')
/** 安全说明 */
export const ShieldQuestion = createGeneralIcon('shield-question')
/** 下一首 */
export const SkipForward = createGeneralIcon('skip-forward')
/** 调节 */
export const Sliders = createGeneralIcon('sliders')
/** 雪花 */
export const Snowflake = createGeneralIcon('snowflake')
/** 智能生成 */
export const Sparkles = createGeneralIcon('sparkles')
/** 正方形 */
export const Square = createGeneralIcon('square')
/** 编写 */
export const SquarePen = createGeneralIcon('square-pen')
/** 收藏 */
export const Star = createGeneralIcon('star')
/** 便签 */
export const StickyNote = createGeneralIcon('sticky-note')
/** 晴 */
export const Sun = createGeneralIcon('sun')
/** 表格 */
export const Table = createGeneralIcon('table')
/** 点踩 */
export const ThumbsDown = createGeneralIcon('thumbs-down')
/** 点赞 */
export const ThumbsUp = createGeneralIcon('thumbs-up')
/** 删除 */
export const Trash = createGeneralIcon('trash')
/** 下跌 */
export const TrendingDown = createGeneralIcon('trending-down')
/** 上涨 */
export const TrendingUp = createGeneralIcon('trending-up')
/** 警告 */
export const TriangleAlert = createGeneralIcon('triangle-alert')
/** 返回 */
export const Undo2 = createGeneralIcon('undo-2')
/** 上传 */
export const Upload = createGeneralIcon('upload')
/** 音量中 */
export const Volume2 = createGeneralIcon('volume-2')
/** 静音 */
export const VolumeX = createGeneralIcon('volume-x')
/** 钱包 */
export const Wallet = createGeneralIcon('wallet')
/** 叉号 */
export const X = createGeneralIcon('x')
/** 闪电 */
export const Zap = createGeneralIcon('zap')
