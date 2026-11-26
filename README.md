# katana-icons

Functional icons for the Katana ecosystem, drawn in one style: a 24 grid, 1.5 strokes with butt caps and mitred corners, one 45° chamfer on framed shapes, an optional "cockpit light", and a hover motion that does what the object itself would do. Comes with the agent skill that draws new icons to the same rules, a self-check that runs in milliseconds, and React and static SVG packages.

| Part | What you get |
| --- | --- |
| Agent skill | `SKILL.md` + `docs/rules.md` (Chinese). Drop the repo into your agent's skills folder and ask for icons. |
| Icons | 71 OKB-style icons (63 interface + 8 `kt-` product icons), each in 4 styles: line, two-tone line, filled line and solid. |
| Trading icons | 33 trading icons (drawing tools, order types, leverage and derivatives, chart types, order book and order flow) in a rounded line style, 4 variants × 4 stroke weights, each with its own hover motion. |
| Packages | `@katana-icons/react` (components + `styles.css` for motion) and `packages/static/svg`. |

## Use

```tsx
import { Bell, Lock } from '@katana-icons/react'
import '@katana-icons/react/styles.css'

<Bell />
<Lock size={16} strokeWidth={1.25} />
<Bell light animated title="Alerts" />
<Lock variant="solid" />          // line | line-duo | line-fill | solid
<button data-kti-hover><Bell /> Alerts</button>
```

Set the light colour with `--kti-light` and the two-tone accent with `--kti-accent`. Static files are in `packages/static/svg/<style>/<name>.svg`.

### General icons

Every lucide icon KATANAview and KatanaUI use, in the line style (129 icons). To replace lucide, change only the import path:

```tsx
import { Trash2, ChevronRight, Settings } from '@katana-icons/react/general/lucide'   // lucide names
import { Trash, Settings, RefreshCw } from '@katana-icons/react/general'               // our names
<Settings animated />          // weight light (1.5) by default; variant outline | line-duo | fill | solid-tint
```

123 come from the Kubai Icons line library (MIT), 6 are ours (`line/general/own.mjs`). Regenerate with `KUBAI_ICONS=<path> node scripts/build-general.mjs`.

### Small icons

The 86 interface icons KATANAview and KatanaUI use most (lucide names used twice or more), redrawn in the KATANA style for 16 and 24 px: square ends and sharp joins, a 45° cut on the top-left corner of framed shapes with superellipse corners elsewhere, octagons instead of circles, and one vermilion cockpit light only where it means something (lock, alert, today, recording, the bot's antenna, the newest message). `general/lucide` already uses them for these names; the rest stay in the line style.

```tsx
import { Lock, Settings } from '@katana-icons/react/small'
<Lock size={16} />            // lit={false} turns the light off; the light reads --katana-shu
```

Sources in `line/small/defs.mjs`, regenerate with `node scripts/build-small.mjs`, preview in `preview/small.html`.

### Trading icons

```tsx
import { TrendLine, OrderBracket, DepthChart } from '@katana-icons/react/trading'
import '@katana-icons/react/trading.css'

<TrendLine />
<OrderBracket weight="light" />            // light 1.5 | regular 2 | medium 2.25 | bold 2.5
<DepthChart variant="line-duo" animated />  // outline | line-duo | fill | solid-tint
<button data-kti-hover><TrendLine /> Trend line</button>
```

The two-tone accent reads `--kti-accent`; the solid-tint fill reads `--kti-tint`. Static files are in `packages/static/svg/trading/<variant>/<name>.svg`. The trading icons were drawn with the Kubai Line skill (Kubai Icons License §2: the icons are ours); its engine is only used at build time and is not part of this repo.

## Fonts

Every font KATANA uses is self-hosted in `packages/fonts/` (`@katana-icons/fonts`): no Google Fonts at run time.

```ts
import '@katana-icons/fonts/fonts.css'
import '@katana-icons/fonts/roles.css'   // --kt-font-sans, --kt-font-code, --kt-font-display …
```

Components use roles, never font names. Body text is the **normal** stack: each platform's own UI font (SF, Segoe UI Variable, PingFang, Microsoft YaHei) with self-hosted Noto Sans SC as the fallback. Our own fonts (KT Stencil / Solid / Pixel / Dot) appear in the roles only through their Latin cut (`"KT … Latin"`), so Chinese in a label falls back to the normal font: the KT kanji are straightened automatically and are too characterful for running text. Use them on purpose, in titles, with `font-family: "KT Stencil"`.

| Role | Stack | Use |
| --- | --- | --- |
| `--kt-font-sans` | system UI → Noto Sans SC | Body text, forms, tables |
| `--kt-font-mono` | system mono → Maple Mono NF CN | Code, logs |
| `--kt-font-display` | Barlow Condensed → Noto Sans SC | Panel and page titles |
| `--kt-font-lcd` | DM Mono | LCD readouts |
| `--kt-font-code` | KT Stencil Solid (Latin) → Michroma → sans | IDs, readouts, Latin labels |
| `--kt-font-stencil` | KT Stencil (Latin) → display | Big titles, loading screens |
| `--kt-font-pixel` / `--kt-font-dot` | KT Pixel / KT Dot (Latin) → Ark Pixel / Doto → DotGothic16 | Pixel and dot-matrix screens |
| `--kt-font-mincho` / `--kt-font-eva` | Shippori Mincho / B1 | Hara-style and EVA-style titles |

| Family | Weights | Use |
| --- | --- | --- |
| KT Stencil / KT Stencil Solid | 400 | Titles, loading screens, cockpit panels / small readouts (ours) |
| Michroma | 400 | Latin codes and numbers |
| Dela Gothic One | 400 | Kanji codes, heavy titles |
| Shippori Mincho | 400, 600 | Hara-style headings |
| Zen Kaku Gothic New | 400, 700, 900 | Body text |
| Noto Sans SC | 100–900 | Normal body text fallback (Simplified Chinese) |
| Barlow Condensed | 600, 700 | Display titles |
| DM Mono | 400, 500 | LCD readouts |
| Maple Mono NF CN | 500 (Latin) | Monospace |
| Ark Pixel 12px | 400 (common CJK subset) | CJK pixel text |
| Shippori Mincho B1 | 800 | EVA-style title cards (stands in for Matisse EB, with `eva.css`) |
| Archivo | 100–900, width 62–125% | EVA-style all-caps titles and HUD labels (stands in for Helvetica / Helvetica Condensed) |
| KT Pixel / KT Dot | 400 | Pixel-style titles / dot-matrix readouts (ours, same skeleton as KT Stencil) |
| DotGothic16 | 400 | CJK dot-matrix text |
| Doto | 100–900 | Latin dot-matrix display |
| Silkscreen | 400, 700 | Small Latin pixel labels |
| Pixelify Sans | 400–700 | Latin pixel text with lowercase |
| VT323 | 400 | Terminal / command-line monospace |

`eva.css` adds the Evangelion way of setting type: `.kt-eva-title` squeezes an extra-bold Mincho to 62% width with tight tracking (TV series), `.kt-eva-wide` stretches it instead (1997 films), `.kt-eva-caps` sets narrow all-caps sans. Matisse EB itself is a commercial Fontworks font and is not included.

The CJK fonts are cut into `unicode-range` slices (common characters first, rare ones last), so a page only downloads the slices its text needs. File names carry a content hash: serve `files/` with `Cache-Control: public, max-age=31536000, immutable`. The repo is private, so the files ship inside the app bundle (KatanaUI depends on this repo by git tag) rather than from a public CDN. Rebuild with `python3 scripts/build-fonts.py <dir with the source TTFs>`; sources and licences are listed in `NOTICE` and `packages/fonts/licenses/`.

## Which style when

Default is the Kenya Hara way: paper, ink, thin lines, one point of colour. The Nihei (Knights of Sidonia) way is for special screens only.

| Use | Style | Files |
| --- | --- | --- |
| Logo, everyday | Ink K, one red dot as the cockpit light, lots of clear space | `brand/katana.svg`, `brand/katana-lockup.svg` |
| Logo, 24 px and below | Ink K only, no dot (a dot that small turns to mud) | `brand/katana-small.svg` |
| App icon | Paper squircle tile, ink K, red dot | `brand/katana-appicon.svg` |
| Icons in the product | Trading icons, outline, weight `light` (1.5), monochrome; at most one part in the accent colour | `@katana-icons/react/trading` (defaults to `light`) |
| Titles, loading screens, cockpit/HUD panels | KT Stencil type, stencil icons, dark ground, hazard bands | `type/dist/`, `packages/static/svg/stencil/`, `hud/` |

The red is `--katana-shu` (default `#A8322D`), a deeper red than the trading up/down colours, so it never reads as price movement.

## Develop

```bash
node scripts/check.mjs --sheet out/sheet.html   # rules check + overview page
node scripts/build.mjs                          # regenerate packages and icons.json
KUBAI_LINE=<path> node scripts/build-trading.mjs # regenerate the trading icons (needs a local Kubai Line engine)
```

## Licence

MIT, for the icons, the packages, the skill and the tools.
