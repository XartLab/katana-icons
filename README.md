# katana-icons

Functional icons for the Katana ecosystem, drawn in one style: a 24 grid, 1.5 strokes with butt caps and mitred corners, one 45° chamfer on framed shapes, an optional "cockpit light", and a hover motion that does what the object itself would do. Comes with the agent skill that draws new icons to the same rules, a self-check that runs in milliseconds, and React and static SVG packages.

| Part | What you get |
| --- | --- |
| Agent skill | `SKILL.md` + `docs/rules.md` (Chinese). Drop the repo into your agent's skills folder and ask for icons. |
| Icons | 71 to start: 63 interface icons and 8 `kt-` icons for Katana products. |
| Packages | `@katana-icons/react` (components + `styles.css` for motion) and `packages/static/svg`. |

## Use

```tsx
import { Bell, Lock } from '@katana-icons/react'
import '@katana-icons/react/styles.css'

<Bell />
<Lock size={16} strokeWidth={1.25} />
<Bell light animated title="Alerts" />
<button data-kti-hover><Bell /> Alerts</button>
```

Set the light colour with the CSS variable `--kti-light`.

## Develop

```bash
node scripts/check.mjs --sheet out/sheet.html   # rules check + overview page
node scripts/build.mjs                          # regenerate packages and icons.json
```

## Licence

MIT, for the icons, the packages, the skill and the tools.
