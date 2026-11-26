// KATANA live sheet: our trading icons only, hover to play each icon's motion.
import { render, WEIGHTS } from './kit.mjs';
import katana from './set/katana.mjs';
import { attach } from './motion.mjs';
const names = Object.keys(katana);
const GROUPS = [['画线工具', names.slice(0, 10)], ['订单与杠杆', names.slice(10, 17)], ['盘口与深度', names.slice(17)]];
const V = [['outline', '线性'], ['line-duo', '双色线性'], ['fill', '面性'], ['solid-tint', '面性填充']];
const state = { variant: 'outline', s: 2, color: '#E6E8EC', accent: '#3FB8AF', size: 40 };
let uid = 0;
const root = document.getElementById('app');
function draw() {
  root.querySelectorAll('.grid').forEach((g) => g.remove());
  for (const [title, list] of GROUPS) {
    const sec = document.createElement('section'); sec.className = 'grid';
    sec.innerHTML = `<h2>${title}</h2><div class="tiles"></div>`;
    const box = sec.querySelector('.tiles');
    for (const nm of list) {
      const icon = katana[nm];
      const el = document.createElement('button'); el.className = 'tile'; el.type = 'button';
      el.innerHTML = `<span class="g">${render(icon, { s: state.s, variant: state.variant, color: state.color, bg: '#16181D', tones: /duo|tint/.test(state.variant) ? { dark: state.color, light: state.accent } : {}, size: state.size, motion: true, id: `k${uid++}` })}</span><b>${icon.label}</b><i>${nm}</i>`;
      const m = attach(el.querySelector('svg'), icon.fx);
      el.addEventListener('pointerenter', () => m.hover(true));
      el.addEventListener('pointerleave', () => m.hover(false));
      el.addEventListener('focus', () => m.play());
      el.addEventListener('click', () => m.play());
      box.append(el);
    }
    root.append(sec);
  }
  setTimeout(() => root.querySelectorAll('.tile').forEach((t, i) => setTimeout(() => t.dispatchEvent(new Event('focus')), i * 60)), 200);
}
const bar = document.getElementById('bar');
bar.innerHTML = V.map(([v, z]) => `<button data-v="${v}">${z}</button>`).join('') +
  Object.entries(WEIGHTS).map(([k, s]) => `<button data-s="${s}">${k} ${s}</button>`).join('');
bar.addEventListener('click', (e) => {
  const b = e.target.closest('button'); if (!b) return;
  if (b.dataset.v) state.variant = b.dataset.v; if (b.dataset.s) state.s = +b.dataset.s;
  bar.querySelectorAll('button').forEach((x) => x.classList.toggle('on', x.dataset.v === state.variant || +x.dataset.s === state.s));
  draw();
});
bar.querySelector('[data-v=outline]').click();
bar.querySelector('[data-s="2"]').click();
