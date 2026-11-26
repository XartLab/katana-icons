// SPDX-License-Identifier: MIT
// 生成文件，勿手改：node scripts/build-trading.mjs
import type { ForwardRefExoticComponent, RefAttributes, SVGProps } from 'react'

export interface TradingIconProps extends Omit<SVGProps<SVGSVGElement>, 'ref'> {
  /** 像素尺寸，默认 24 */
  size?: number | string
  /** 字重档：线宽 1.5 / 2 / 2.25 / 2.5，跟旁边文字的字重走；默认 regular */
  weight?: 'light' | 'regular' | 'medium' | 'bold'
  /** 直接给线宽，取最近的一档 */
  strokeWidth?: number
  /** 线性、双色线性（强调色读 --kti-accent）、面性、面性填充（底色读 --kti-tint）；默认 outline */
  variant?: 'outline' | 'line-duo' | 'fill' | 'solid-tint'
  /** 自己悬停时播放动效；或在祖先上写 data-kti-hover */
  animated?: boolean
  /** 有文字含义时给读屏用；不给就是装饰（aria-hidden） */
  title?: string
}
export type TradingIcon = ForwardRefExoticComponent<TradingIconProps & RefAttributes<SVGSVGElement>>
export type TradingIconName = 'trend-line' | 'ray' | 'horizontal-line' | 'vertical-line' | 'parallel-channel' | 'fib-retracement' | 'price-range' | 'date-range' | 'long-position' | 'short-position' | 'order-limit' | 'order-market' | 'order-stop' | 'order-bracket' | 'leverage' | 'margin-cross' | 'margin-isolated' | 'order-book' | 'depth-chart' | 'candles' | 'ohlc-bars' | 'heikin-ashi' | 'renko' | 'oscillator' | 'footprint' | 'volume-profile' | 'funding-rate' | 'open-interest' | 'perpetual' | 'liquidation' | 'price-tag' | 'trailing-stop' | 'iceberg'
export declare function createTradingIcon(name: TradingIconName): TradingIcon
export declare const tradingIconNames: TradingIconName[]
/** 趋势线 */
export declare const TrendLine: TradingIcon
/** 射线 */
export declare const Ray: TradingIcon
/** 水平线 */
export declare const HorizontalLine: TradingIcon
/** 垂直线 */
export declare const VerticalLine: TradingIcon
/** 平行通道 */
export declare const ParallelChannel: TradingIcon
/** 斐波那契回撤 */
export declare const FibRetracement: TradingIcon
/** 价格区间 */
export declare const PriceRange: TradingIcon
/** 时间区间 */
export declare const DateRange: TradingIcon
/** 多头仓位 */
export declare const LongPosition: TradingIcon
/** 空头仓位 */
export declare const ShortPosition: TradingIcon
/** 限价单 */
export declare const OrderLimit: TradingIcon
/** 市价单 */
export declare const OrderMarket: TradingIcon
/** 止损单 */
export declare const OrderStop: TradingIcon
/** 止盈止损 */
export declare const OrderBracket: TradingIcon
/** 杠杆 */
export declare const Leverage: TradingIcon
/** 全仓 */
export declare const MarginCross: TradingIcon
/** 逐仓 */
export declare const MarginIsolated: TradingIcon
/** 盘口 */
export declare const OrderBook: TradingIcon
/** 深度图 */
export declare const DepthChart: TradingIcon
/** K 线 */
export declare const Candles: TradingIcon
/** 美国线 */
export declare const OhlcBars: TradingIcon
/** 平均 K 线 */
export declare const HeikinAshi: TradingIcon
/** 砖形图 */
export declare const Renko: TradingIcon
/** 震荡指标 */
export declare const Oscillator: TradingIcon
/** 足迹图 */
export declare const Footprint: TradingIcon
/** 成交量分布 */
export declare const VolumeProfile: TradingIcon
/** 资金费率 */
export declare const FundingRate: TradingIcon
/** 持仓量 */
export declare const OpenInterest: TradingIcon
/** 永续合约 */
export declare const Perpetual: TradingIcon
/** 强平 */
export declare const Liquidation: TradingIcon
/** 标记价格 */
export declare const PriceTag: TradingIcon
/** 跟踪止损 */
export declare const TrailingStop: TradingIcon
/** 冰山单 */
export declare const Iceberg: TradingIcon
