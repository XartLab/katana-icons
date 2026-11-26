# Changelog

## [0.3.0] - 2026-11-26

### Added

- **Self-hosted fonts.** Every font KATANA uses ships in `@katana-icons/fonts` as cache-friendly WOFF2 files: KT Stencil, Michroma, Dela Gothic One, Shippori Mincho and Zen Kaku Gothic New. Chinese and Japanese fonts are split so a page only downloads the characters it shows.
- **KT Stencil type and stencil icons.** Our own straight-line stencil typeface (stencil and solid cuts) and 33 trading icons drawn to the same rules.
- **Kanji codes.** 33 kanji marks, one per trading icon.

### Changed

- **Hara style by default.** The everyday logo is an ink K with one red dot; trading icons default to the light weight.

## [0.2.0] - 2026-11-26

### Added

- **14 more trading icons.** Chart types (candles, OHLC bars, Heikin-Ashi, Renko, oscillator), order flow (footprint, volume profile), derivatives (perpetual, funding rate, open interest, liquidation, mark price) and order types (trailing stop, iceberg), each with its own hover motion. The trading set now has 33 icons.

## [0.1.0] - 2026-11-26

### Added

- **71 OKB-style icons.** Interface and product icons in four styles (line, two-tone line, filled line, solid), with an optional cockpit light and a hover motion, as React components and static SVG.
- **19 trading icons.** Drawing tools, order types, leverage and margin, order book and depth chart, in four variants and four stroke weights, each with its own hover motion. Import them from `@katana-icons/react/trading`.
- **The KATANA mark** in `brand/katana.svg`.
