// SPDX-License-Identifier: MIT
// 悬停层：给 .ktv 根元素挂上就行。
// - 带 data-tip="标题|内容" 的记号：指针在上面就出提示。
// - 带 data-ktv-line 的折线图：十字线跟着指针吸附到最近的一个点，提示里列出所有序列在这一刻的值。
// 返回一个函数，调用即卸载。
export function attachHover(root) {
  const tip = document.createElement('div');
  tip.className = 'ktv-tip';
  tip.hidden = true;
  root.appendChild(tip);
  const place = (e) => {
    const pad = 14, r = tip.getBoundingClientRect();
    let x = e.clientX + pad, y = e.clientY + pad;
    if (x + r.width > innerWidth) x = e.clientX - r.width - pad;
    if (y + r.height > innerHeight) y = e.clientY - r.height - pad;
    tip.style.left = x + 'px';
    tip.style.top = y + 'px';
  };
  const show = (html, e) => { tip.innerHTML = html; tip.hidden = false; place(e); };
  const hide = () => { tip.hidden = true; };
  const text = (s) => String(s).replace(/[&<>]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' })[c]);

  const lines = [...root.querySelectorAll('svg[data-ktv-line]')].map((svg) => {
    const data = JSON.parse(svg.getAttribute('data-ktv-line'));
    const ns = 'http://www.w3.org/2000/svg';
    const cross = document.createElementNS(ns, 'line');
    cross.setAttribute('class', 'ktv-cross');
    cross.setAttribute('y1', data.y0);
    cross.setAttribute('y2', data.y1);
    cross.style.display = 'none';
    svg.appendChild(cross);
    return { svg, data, cross };
  });

  function move(e) {
    for (const { svg, data, cross } of lines) {
      const r = svg.getBoundingClientRect(), vb = svg.viewBox.baseVal;
      const sx = ((e.clientX - r.left) * vb.width) / r.width;
      const inside = e.clientX >= r.left && e.clientX <= r.right && e.clientY >= r.top && e.clientY <= r.bottom && sx >= data.x0 - 4 && sx <= data.x1 + 4;
      if (!inside) { cross.style.display = 'none'; continue; }
      const n = data.labels.length, i = Math.max(0, Math.min(n - 1, Math.round(((sx - data.x0) / (data.x1 - data.x0)) * (n - 1))));
      const cx = data.x0 + (i * (data.x1 - data.x0)) / Math.max(1, n - 1);
      cross.setAttribute('x1', cx);
      cross.setAttribute('x2', cx);
      cross.style.display = '';
      show(`<div class="ktv-tip-head">${text(data.labels[i])}</div>` +
        data.series.map((s) => `<div><i style="background:${s.color}"></i>${text(s.name)} <b>${text(s.values[i])}</b></div>`).join(''), e);
      return;
    }
    const t = e.target.closest?.('[data-tip]');
    if (t && root.contains(t)) {
      const [head, body = ''] = t.getAttribute('data-tip').split('|');
      show(`<div class="ktv-tip-head">${text(head)}</div><b>${text(body)}</b>`, e);
    } else hide();
  }
  root.addEventListener('pointermove', move);
  root.addEventListener('pointerleave', () => { hide(); for (const l of lines) l.cross.style.display = 'none'; });
  return () => { root.removeEventListener('pointermove', move); tip.remove(); for (const l of lines) l.cross.remove(); };
}
