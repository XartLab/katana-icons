import { play, MOMENTS } from '../packages/fx/src/index.js';
const wrap = document.getElementById('w');
for (const id of Object.keys(MOMENTS)) {
  const d = document.createElement('figure'), c = document.createElement('canvas'), cap = document.createElement('figcaption');
  cap.textContent = id + ' · ' + MOMENTS[id].zh; d.append(c, cap); wrap.append(d);
  play(c, id, { scale: 1, opts: {} });
}
