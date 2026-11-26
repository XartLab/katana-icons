# Changelog

## [0.9.0] - 2026-11-26

### Added

- **Pixel effects.** `@katana-icons/fx` plays short pixel animations for trading moments such as an order filled, an alert, a breakout, the market-open countdown or a lost connection, built on pixelfx and recolored in KATANA colors. Sprite sheets of the same effects ship in `@katana-icons/static`.

## [0.8.0] - 2026-11-26

### Added

- **Small icons in the KATANA style.** The 86 interface icons the product uses most, redrawn for 16 and 24 px with square ends, a cut top-left corner, octagons for circles and a vermilion light where it means something. Import them from `@katana-icons/react/small`; the lucide-named import picks them up automatically.

## [0.7.0] - 2026-11-26

### Added

- **General icons.** 129 everyday interface icons in the line style, covering every lucide icon KATANAview and KatanaUI use, with hover motion. Import them by lucide's names from `@katana-icons/react/general/lucide` to switch with one path change.

## [0.6.0] - 2026-11-26

### Added

- **Normal fonts and font roles.** `roles.css` gives every use a role (`--kt-font-sans`, `--kt-font-code`, `--kt-font-display` and more). Body text uses each platform's own UI font with self-hosted Noto Sans SC as the fallback; Barlow Condensed, DM Mono, Maple Mono and Ark Pixel are now in the package too.
- **Kanji in KT fonts.** All 1,192 Chinese characters used in the KATANA interface. In the roles our fonts contribute Latin only, so Chinese text stays in the normal font.

## [0.5.0] - 2026-11-26

### Added

- **Pixel and dot-matrix type.** Two more fonts of ours, KT Pixel and KT Dot, made from the same skeleton as KT Stencil, plus self-hosted DotGothic16, Doto, Silkscreen, Pixelify Sans and VT323.
- **One skill for every asset.** `SKILL.md` now covers icons, kanji codes, our fonts, font packaging and HUD parts, so any of them can be made again on demand.

## [0.4.0] - 2026-11-26

### Added

- **EVA-style type.** Two more self-hosted fonts, Shippori Mincho B1 ExtraBold and Archivo (with a width axis), plus `eva.css` for Evangelion-style title cards: squeezed extra-bold Mincho, stretched Mincho, and narrow all-caps labels.

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
