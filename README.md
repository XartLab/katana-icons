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
```

| Family | Weights | Use |
| --- | --- | --- |
| KT Stencil / KT Stencil Solid | 400 | Titles, loading screens, cockpit panels / small readouts (ours) |
| Michroma | 400 | Latin codes and numbers |
| Dela Gothic One | 400 | Kanji codes, heavy titles |
| Shippori Mincho | 400, 600 | Hara-style headings |
| Zen Kaku Gothic New | 400, 700, 900 | Body text |
| Shippori Mincho B1 | 800 | EVA-style title cards (stands in for Matisse EB, with `eva.css`) |
| Archivo | 100–900, width 62–125% | EVA-style all-caps titles and HUD labels (stands in for Helvetica / Helvetica Condensed) |

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
