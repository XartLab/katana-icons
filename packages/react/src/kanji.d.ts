// SPDX-License-Identifier: MIT
// 生成文件，勿手改：node scripts/build-kanji.mjs
import type { ForwardRefExoticComponent, RefAttributes, SVGProps } from 'react'
import type { TradingIconName } from './trading'
export declare const KANJI: Record<TradingIconName, string>
export interface KanjiCodeProps extends Omit<SVGProps<SVGSVGElement>, 'ref'> {
  /** 跟交易图标同名 */
  name: TradingIconName
  /** 像素尺寸，默认 24；小于 20 会糊 */
  size?: number | string
  title?: string
}
export declare const KanjiCode: ForwardRefExoticComponent<KanjiCodeProps & RefAttributes<SVGSVGElement>>
