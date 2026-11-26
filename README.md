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

## Develop

```bash
node scripts/check.mjs --sheet out/sheet.html   # rules check + overview page
node scripts/build.mjs                          # regenerate packages and icons.json
KUBAI_LINE=<path> node scripts/build-trading.mjs # regenerate the trading icons (needs a local Kubai Line engine)
```

## Licence

MIT, for the icons, the packages, the skill and the tools.
