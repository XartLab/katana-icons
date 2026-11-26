# katana-icons

Functional icons for the Katana ecosystem, drawn in one style: a 24 grid, 1.5 strokes with butt caps and mitred corners, one 45° chamfer on framed shapes, an optional "cockpit light", and a hover motion that does what the object itself would do. Comes with the agent skill that draws new icons to the same rules, a self-check that runs in milliseconds, and React and static SVG packages.

| Part | What you get |
| --- | --- |
| Agent skill | `SKILL.md` + `docs/rules.md` (Chinese). Drop the repo into your agent's skills folder and ask for icons. |
| Icons | 71 to start (63 interface + 8 `kt-` product icons), each in 4 styles: line, two-tone line, filled line and solid. |
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

## Develop

```bash
node scripts/check.mjs --sheet out/sheet.html   # rules check + overview page
node scripts/build.mjs                          # regenerate packages and icons.json
```

## Licence

MIT, for the icons, the packages, the skill and the tools.
