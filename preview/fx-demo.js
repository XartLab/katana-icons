(() => {
  var __defProp = Object.defineProperty;
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };

  // packages/fx/src/vendor/pixelfx/core/math.js
  var TAU = Math.PI * 2;
  var clamp = (x, a = 0, b = 1) => x < a ? a : x > b ? b : x;
  var lerp = (a, b, t) => a + (b - a) * t;
  var wrap = (x, m) => (x % m + m) % m;
  var seg = (t, t0, t1) => clamp((t - t0) / (t1 - t0));
  var smooth = (e0, e1, x) => {
    const t = seg(x, e0, e1);
    return t * t * (3 - 2 * t);
  };
  var ease = {
    linear: (t) => t,
    inQuad: (t) => t * t,
    outQuad: (t) => 1 - (1 - t) * (1 - t),
    inOutQuad: (t) => t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2,
    inCubic: (t) => t * t * t,
    outCubic: (t) => 1 - Math.pow(1 - t, 3),
    inOutCubic: (t) => t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2,
    inQuart: (t) => t * t * t * t,
    outQuart: (t) => 1 - Math.pow(1 - t, 4),
    inExpo: (t) => t <= 0 ? 0 : Math.pow(2, 10 * t - 10),
    outExpo: (t) => t >= 1 ? 1 : 1 - Math.pow(2, -10 * t),
    inSine: (t) => 1 - Math.cos(t * Math.PI / 2),
    outSine: (t) => Math.sin(t * Math.PI / 2),
    inOutSine: (t) => -(Math.cos(Math.PI * t) - 1) / 2,
    inBack: (t, s = 1.70158) => t <= 0 ? 0 : t >= 1 ? 1 : (s + 1) * t * t * t - s * t * t,
    outBack: (t, s = 1.70158) => t <= 0 ? 0 : t >= 1 ? 1 : 1 + (s + 1) * Math.pow(t - 1, 3) + s * Math.pow(t - 1, 2),
    outElastic: (t) => t <= 0 ? 0 : t >= 1 ? 1 : Math.pow(2, -10 * t) * Math.sin((t * 10 - 0.75) * (2 * Math.PI / 3)) + 1,
    outBounce: (t) => {
      const n = 7.5625, d = 2.75;
      if (t < 1 / d) return n * t * t;
      if (t < 2 / d) return n * (t -= 1.5 / d) * t + 0.75;
      if (t < 2.5 / d) return n * (t -= 2.25 / d) * t + 0.9375;
      return n * (t -= 2.625 / d) * t + 0.984375;
    }
  };
  function hash(...ns) {
    let h = 2654435769;
    for (const n of ns) {
      h = Math.imul(h ^ (n | 0), 2246822507);
      h ^= h >>> 13;
      h = Math.imul(h, 3266489909);
      h ^= h >>> 16;
    }
    return h >>> 0;
  }
  var rand = (...ns) => hash(...ns) / 4294967296;
  var Rng = class {
    constructor(seed = 1) {
      this.s = seed >>> 0 || 1;
    }
    next() {
      let t = this.s = this.s + 1831565813 >>> 0;
      t = Math.imul(t ^ t >>> 15, t | 1);
      t ^= t + Math.imul(t ^ t >>> 7, t | 61);
      return ((t ^ t >>> 14) >>> 0) / 4294967296;
    }
    range(a, b) {
      return a + (b - a) * this.next();
    }
    int(a, b) {
      return Math.floor(this.range(a, b + 1));
    }
    chance(p) {
      return this.next() < p;
    }
    sign() {
      return this.next() < 0.5 ? -1 : 1;
    }
    pick(list) {
      return list[Math.floor(this.next() * list.length)];
    }
    /** Roughly normal, mean 0, sd 1. */
    gauss() {
      return (this.next() + this.next() + this.next() + this.next() - 2) * 1.732;
    }
  };
  var rng = (...ns) => new Rng(hash(...ns));
  function noise(x, seed = 0) {
    const i = Math.floor(x), f = x - i, u = f * f * (3 - 2 * f);
    return lerp(rand(i, seed), rand(i + 1, seed), u) * 2 - 1;
  }
  function tileNoise(x, y, px = 0, py = 0, seed = 0) {
    const ix = Math.floor(x), iy = Math.floor(y), fx = x - ix, fy = y - iy;
    const ux = fx * fx * (3 - 2 * fx), uy = fy * fy * (3 - 2 * fy);
    const x0 = px ? wrap(ix, px) : ix, x1 = px ? wrap(ix + 1, px) : ix + 1;
    const y0 = py ? wrap(iy, py) : iy, y1 = py ? wrap(iy + 1, py) : iy + 1;
    const a = rand(x0, y0, seed), b = rand(x1, y0, seed), c = rand(x0, y1, seed), d = rand(x1, y1, seed);
    return lerp(lerp(a, b, ux), lerp(c, d, ux), uy) * 2 - 1;
  }
  function tileFbm(x, y, px = 0, py = 0, seed = 0, octaves = 3) {
    let s = 0, a = 0.5, n = 0, k = 1;
    for (let o = 0; o < octaves; o++) {
      s += tileNoise(x * k, y * k, px * k, py * k, seed + o * 101) * a;
      n += a;
      a *= 0.5;
      k *= 2;
    }
    return s / n;
  }

  // packages/fx/src/vendor/pixelfx/core/color.js
  var rgb = (r, g, b) => 255 << 24 | (b & 255) << 16 | (g & 255) << 8 | r & 255;
  var red = (c) => c & 255;
  var green = (c) => c >>> 8 & 255;
  var blue = (c) => c >>> 16 & 255;
  function hex(h) {
    if (typeof h === "number") return h;
    let s = h.replace("#", "");
    if (s.length === 3) s = s[0] + s[0] + s[1] + s[1] + s[2] + s[2];
    const v = parseInt(s.slice(0, 6), 16);
    return rgb(v >> 16 & 255, v >> 8 & 255, v & 255);
  }
  var toHex = (c) => "#" + [red(c), green(c), blue(c)].map((v) => v.toString(16).padStart(2, "0")).join("");
  function mix(a, b, t) {
    t = clamp(t);
    return rgb(red(a) + (red(b) - red(a)) * t, green(a) + (green(b) - green(a)) * t, blue(a) + (blue(b) - blue(a)) * t);
  }
  var scale = (c, k) => rgb(Math.min(255, red(c) * k), Math.min(255, green(c) * k), Math.min(255, blue(c) * k));
  var ramp = (list) => list.map(hex);
  function fit(r, n) {
    r = r.map(hex);
    if (r.length === n) return r;
    return Array.from({ length: n }, (_, i) => r[Math.round(i * (r.length - 1) / Math.max(1, n - 1))]);
  }
  var PAL = {
    fire: ["#1f0b10", "#4a1118", "#8c1d1c", "#cc3a1a", "#f2701f", "#ffae35", "#ffe27a", "#fff8d6"],
    ember: ["#1a0a0e", "#3d1012", "#701a14", "#a8301a", "#e0561e", "#ff8a2a", "#ffc46a"],
    lava: ["#14060a", "#380a10", "#6e1210", "#ac2410", "#e8501a", "#ff8c2a", "#ffd25a"],
    smoke: ["#0e0c12", "#1d1a22", "#2e2a35", "#433e4b", "#5c5664", "#7b7484", "#a39cab"],
    dust: ["#1c1610", "#33281c", "#4f3f2c", "#6e5a40", "#927a58", "#b89f78", "#dcc8a2"],
    ice: ["#0c1430", "#162c5c", "#1f4f94", "#2f7fcc", "#58b4ec", "#9bdcff", "#d8f4ff", "#ffffff"],
    water: ["#081830", "#0e2e5a", "#14508c", "#1c76bc", "#36a2e0", "#78ccf4", "#c4ecff", "#ffffff"],
    electric: ["#0a0f2e", "#172a78", "#2550d0", "#3f8cff", "#7cc8ff", "#c8f0ff", "#ffffff"],
    volt: ["#24160a", "#5e3a0c", "#a8680f", "#e8a218", "#ffd23c", "#fff08a", "#ffffff"],
    poison: ["#0d1a0c", "#173a14", "#265e18", "#3f8a1e", "#6cb82a", "#a8e04a", "#e0ff8a"],
    holy: ["#2a1c08", "#5a3e10", "#9a6c18", "#d8a428", "#ffd84a", "#fff09a", "#fffbe6", "#ffffff"],
    heal: ["#08201a", "#0f3f2c", "#17663e", "#24924e", "#3ec466", "#7ee88a", "#c8ffc4", "#ffffff"],
    arcane: ["#140a26", "#2b1252", "#481c88", "#6b2cc0", "#9a48ec", "#c684ff", "#ecc8ff", "#ffffff"],
    shadow: ["#050308", "#0f0a18", "#1c1230", "#2c1a4a", "#432468", "#5e3290", "#8048b8", "#a970e0"],
    blood: ["#14040a", "#3a0a14", "#6a101c", "#a01824", "#d42a30", "#ff5a50", "#ff9a8a"],
    earth: ["#140e0a", "#2a1e14", "#47321e", "#69492a", "#8e6638", "#b88a52", "#dcb47c"],
    stone: ["#0e0e12", "#1c1c24", "#2c2c38", "#42424f", "#5c5c6b", "#7d7d8c", "#a4a4b2", "#d0d0da"],
    gold: ["#1e1206", "#4a2c08", "#86520c", "#c48412", "#f0b424", "#ffe066", "#fff6c4", "#ffffff"],
    leaf: ["#0c1a0e", "#163418", "#225224", "#357530", "#4f9a3a", "#7cc048", "#b4e070", "#e4ffb0"],
    wood: ["#160c06", "#2e1a0c", "#4a2c14", "#6a421e", "#8e5c2c", "#b47c40", "#d8a464"],
    metal: ["#0c0e14", "#1c2230", "#2e3648", "#4a5468", "#6e7a90", "#9aa6ba", "#d0d8e6", "#ffffff"],
    bone: ["#1a1814", "#3a352c", "#5e5648", "#8a806c", "#b8ad96", "#e4dcc8", "#fffaf0"],
    neon: ["#1a0516", "#3d0a33", "#701560", "#b0228f", "#f53cd1", "#ff86e6", "#ffd2f6", "#ffffff"],
    cyber: ["#041418", "#08303a", "#0c5260", "#108088", "#18b4b0", "#4ce8d8", "#b4fff0", "#ffffff"],
    matrix: ["#020a04", "#05200c", "#0a3c16", "#106624", "#1a9a34", "#3cd650", "#a4ffa8", "#e8ffe8"],
    candy: ["#ff4a5a", "#ff9a2a", "#ffe03c", "#5ad84a", "#3cc8ff", "#7a6cff", "#f53cd1"],
    night: ["#07060d", "#0c0a18", "#131026", "#1b1734", "#241f44", "#2f2956"]
  };
  var RAMP = Object.fromEntries(Object.entries(PAL).map(([k, v]) => [k, ramp(v)]));
  var WHITE = hex("#ffffff");
  var BLACK = hex("#000000");
  var INK = hex("#0b0a10");
  var PATCH = hex("#f53cd1");

  // packages/fx/src/vendor/pixelfx/core/shapes.js
  function bolt(r, x0, y0, x1, y1, { jag = 0.22, depth = 5 } = {}) {
    let pts = [[x0, y0], [x1, y1]];
    for (let d = 0; d < depth; d++) {
      const next = [pts[0]];
      for (let i = 1; i < pts.length; i++) {
        const [ax, ay] = pts[i - 1], [bx, by] = pts[i], dx = bx - ax, dy = by - ay, L2 = Math.hypot(dx, dy);
        const off = (r.next() * 2 - 1) * jag * L2;
        next.push([(ax + bx) / 2 + -dy / (L2 || 1) * off, (ay + by) / 2 + dx / (L2 || 1) * off], pts[i]);
      }
      pts = next;
    }
    return pts;
  }
  function forks(r, path, { count = 3, len: len2 = 20, jag = 0.3, spread = 0.9 } = {}) {
    const out = [];
    for (let k = 0; k < count; k++) {
      const i = 1 + Math.floor(r.next() * (path.length - 2)), [x, y] = path[i], [px, py] = path[i - 1];
      const a = Math.atan2(y - py, x - px) + (r.next() < 0.5 ? -1 : 1) * spread * (0.4 + 0.6 * r.next());
      const l = len2 * (0.4 + 0.6 * r.next());
      out.push(bolt(r, x, y, x + Math.cos(a) * l, y + Math.sin(a) * l, { jag, depth: 3 }));
    }
    return out;
  }

  // packages/fx/src/vendor/pixelfx/core/sim.js
  var GRAVITY = 950;
  var CROSS = [[1, 0], [-1, 0], [0, 1], [0, -1]];
  var DIAG = [[1, 1], [1, -1], [-1, 1], [-1, -1]];
  var HOT = ["#fff3a6", "#ffe26b", "#ff8a2a", "#f2561d"].map(hex);
  var FIRE_RAMP = ["#ffffff", "#fff3a6", "#ffe26b", "#ffc23d", "#ff8a2a", "#f2561d", "#c9281f", "#8a1f17", "#4a1712"].map(hex);
  var SMOKE_RAMP = ["#7b6f72", "#5d5660", "#433d48", "#2b2630", "#1a171e"].map(hex);
  var rampAt = (r, t) => r[Math.min(r.length - 1, Math.max(0, Math.floor(t * r.length)))];
  var P = { SPARK: 0, MOTE: 1, STREAK: 2, FLAKE: 3, VAPOUR: 4, DUST: 5, STAR: 6, EMBER: 7, SMOKE: 8, FIRE: 9, BRAND: 10, GRIT: 11 };
  var PF = { SMOKES: 1, BIG: 2, BACK: 4 };
  var SOFT = /* @__PURE__ */ new Set([P.VAPOUR, P.DUST, P.SMOKE]);
  var Particles = class {
    constructor(opts = {}) {
      this.R = opts.rng ?? new Rng(opts.seed ?? 1);
      this.list = [];
      this.t = 0;
      this.ground = opts.ground ?? (() => Infinity);
      this.sparks = (opts.sparks ?? HOT).map(hex);
      this.haze = opts.haze === void 0 ? null : hex(opts.haze);
      this.onLand = opts.onLand ?? null;
    }
    /** delay: seconds before it appears; flag: PF bits. col 0 lets FIRE and SMOKE use their own ramps. */
    spawn(k, x, y, vx, vy, life, col = WHITE, size = 1, delay = 0, flag = 0) {
      this.list.push({ k, x, y, vx, vy, life, max: life, col: col ? hex(col) : 0, size, seed: this.R.next() * 100, delay, flag });
    }
    get count() {
      return this.list.length;
    }
    update(dt) {
      this.t += dt;
      const R2 = this.R, t = this.t;
      for (let i = this.list.length - 1; i >= 0; i--) {
        const p = this.list[i];
        if (p.delay > 0) {
          p.delay -= dt;
          continue;
        }
        if ((p.life -= dt) <= 0) {
          if (p.k === P.FIRE && p.flag & PF.SMOKES) {
            const big = p.flag & PF.BIG;
            this.spawn(P.SMOKE, p.x, p.y, p.vx * 0.6, p.vy * 0.6 - 6, big ? R2.range(1.3, 2.3) : R2.range(0.8, 1.4), 0, p.size * (big ? 0.85 : 0.7), 0, big ? PF.BIG : 0);
          }
          this.list.splice(i, 1);
          continue;
        }
        switch (p.k) {
          case P.FIRE:
            p.vy -= 95 * dt;
            p.vx += Math.sin(t * 17 + p.seed) * 30 * dt;
            p.vx -= p.vx * 5 * dt;
            p.vy -= p.vy * 3.2 * dt;
            break;
          case P.GRIT: {
            p.vy += GRAVITY * dt;
            p.vx -= p.vx * 0.8 * dt;
            const g = this.ground(p.x), ny = p.y + p.vy * dt;
            p.x += p.vx * dt;
            if (p.vy > 0 && p.y <= g && ny >= g) {
              p.y = g - 0.25;
              if (p.vy > 130 && R2.chance(0.4)) p.vy = -p.vy * 0.25, p.vx = p.vx * 0.5 + R2.range(-10, 10);
              else p.vx = p.vy = 0, p.life = Math.min(p.life, 0.5);
            } else p.y = ny;
            continue;
          }
          case P.BRAND: {
            p.vy += GRAVITY * 0.8 * dt;
            p.vx -= p.vx * 0.9 * dt;
            if (R2.chance(0.9 * Math.min(1, dt * 60))) this.spawn(P.FIRE, p.x, p.y, p.vx * 0.1 + R2.range(-7, 7), p.vy * 0.1 - 10, R2.range(0.16, 0.32), 0, R2.range(0.9, 1.7) * (0.5 + p.life / p.max * 0.6), 0, R2.chance(0.4) ? PF.SMOKES : 0);
            const g = this.ground(p.x), ny = p.y + p.vy * dt;
            p.x += p.vx * dt;
            if (p.vy > 0 && p.y <= g && ny >= g) {
              this.onLand?.(p.x, g);
              this.list.splice(i, 1);
            } else p.y = ny;
            continue;
          }
          case P.SPARK: {
            p.vy += GRAVITY * 0.45 * dt;
            p.vx -= p.vx * 2.2 * dt;
            p.vy -= p.vy * 2.2 * dt;
            const g = this.ground(p.x), ny = p.y + p.vy * dt;
            p.x += p.vx * dt;
            if (p.vy > 0 && p.y <= g && ny >= g) p.vy = -p.vy * 0.45, p.vx *= 0.7, p.y = g - 0.25;
            else p.y = ny;
            continue;
          }
          case P.STREAK:
            p.vx += p.vx * 3 * dt, p.vy += p.vy * 3 * dt;
            break;
          case P.FLAKE:
            p.vx -= p.vx * 2.2 * dt;
            p.vy -= p.vy * 2.2 * dt - 35 * dt;
            p.x += Math.sin(this.t * 2.5 + p.seed) * 7 * dt;
            break;
          case P.EMBER:
            p.vy += (-30 + Math.sin(t * 3 + p.seed) * 20) * dt;
            p.vx += Math.cos(t * 2.3 + p.seed) * 45 * dt;
            p.vx -= p.vx * 1.6 * dt;
            p.vy -= p.vy * 1.6 * dt;
            break;
          case P.SMOKE: {
            const big = p.flag & PF.BIG;
            p.vy -= (big ? 23 : 16) * dt;
            p.vx += Math.sin(t * 1.3 + p.seed) * 8 * dt;
            p.vx -= p.vx * 1.6 * dt;
            p.vy -= p.vy * 1.2 * dt;
            break;
          }
          case P.MOTE:
            p.vx -= p.vx * 0.6 * dt;
            p.vy -= p.vy * 0.6 * dt;
            break;
          default: {
            const drag = SOFT.has(p.k) ? 4 : 1.6;
            p.vx -= p.vx * drag * dt;
            p.vy -= p.vy * drag * dt + 5 * dt;
          }
        }
        p.x += p.vx * dt;
        p.y += p.vy * dt;
      }
    }
    draw(p, layer) {
      for (const q of this.list) {
        if (q.delay > 0) continue;
        if (layer && (SOFT.has(q.k) || q.flag & PF.BACK ? "back" : "front") !== layer) continue;
        const k = q.life / q.max, x = q.x, y = q.y, sp = Math.hypot(q.vx, q.vy) || 1, ux = q.vx / sp, uy = q.vy / sp;
        switch (q.k) {
          case P.SPARK: {
            const S = this.sparks, head = k > 0.6 ? S[0] : k > 0.3 ? S[1] : S[2], len2 = Math.min(9, 1 + sp * 0.022);
            p.line(x - ux * len2, y - uy * len2, x - ux * len2 * 0.4, y - uy * len2 * 0.4, k > 0.5 ? head : S[S.length - 1]);
            p.line(x - ux * len2 * 0.45, y - uy * len2 * 0.45, x, y, head);
            p.glow(x, y, 3, head, 0.45 * k);
            break;
          }
          case P.MOTE: {
            const len2 = Math.min(16, 0.5 + sp * 0.026) * q.size, a = k < 0.35 ? k / 0.35 : 1;
            p.line(x - ux * len2, y - uy * len2, x - ux * len2 * 0.35, y - uy * len2 * 0.35, scale(q.col, 0.55), a);
            p.line(x - ux * len2 * 0.4, y - uy * len2 * 0.4, x, y, q.col, a);
            p.glow(x, y, 2.5 + q.size, q.col, 0.4 * k);
            break;
          }
          case P.STREAK: {
            const L2 = clamp(sp / 30, 1, 7);
            for (let d = L2; d >= 0; d -= 0.5) p.dot(x - ux * d, y - uy * d, d < 1 ? WHITE : d < L2 * 0.5 ? q.col : scale(q.col, 0.6), d < L2 * 0.5 ? 1 : 1.2 - d / L2);
            p.glow(x, y, 4, q.col, 0.4);
            break;
          }
          case P.FLAKE: {
            const a = Math.min(1, k * 3);
            p.dot(x, y, q.col, a);
            if (q.size > 1.3) for (const [dx, dy] of CROSS) p.dot(x + dx, y + dy, scale(q.col, 0.8), a * 0.8);
            break;
          }
          case P.VAPOUR: {
            const r = q.size * (0.6 + (1 - k) * 0.9);
            p.disc(x, y, r, q.col, Math.pow(k, 1.3) * 0.45);
            if (this.haze) p.glow(x, y, r * 1.8, this.haze, 0.16 * k);
            break;
          }
          case P.DUST:
            p.disc(x, y, q.size * (0.6 + (1 - k) * 0.9), q.col, Math.pow(k, 1.3) * 0.7);
            break;
          case P.SMOKE: {
            const age = 1 - k, big = q.flag & PF.BIG;
            const r = q.size * (0.65 + Math.min(1, age * 2.5) * 0.45 + age * (big ? 0.5 : 0.4));
            const a = Math.min(1, age * 12) * Math.min(1, k * 2.4) * (big ? 0.7 : 0.58);
            const c = q.col ? mix(q.col, rampAt(SMOKE_RAMP, age), age) : rampAt(SMOKE_RAMP, age * 1.05);
            p.disc(x, y, r, c, a * 0.45);
            p.disc(x + r * 0.05, y + r * 0.06, r * 0.74, c, a * 0.62);
            if (age < 0.5) p.disc(x - r * 0.22, y - r * 0.3, r * 0.5, mix(c, WHITE, 0.12), a * 0.4 * (1 - age * 2));
            break;
          }
          case P.FIRE: {
            const age = 1 - k, heat = Math.min(0.999, Math.pow(age, 0.62) + q.seed % 1 * 0.1), F = FIRE_RAMP, n = F.length;
            const idx = Math.min(n - 2, Math.floor(heat * (n - 1)));
            const r = q.size * (0.55 + 0.45 * Math.min(1, age * 7)) * (1 - age * 0.55), c = F[idx];
            if (idx >= n - 2) p.disc(x, y, r, c, Math.min(1, k * 3) * 0.85);
            else {
              p.circle(x, y, r, F[Math.min(n - 1, idx + 2)]);
              p.circle(x - r * 0.16, y - r * 0.22, r * 0.78, c);
              if (r > 1.6) p.circle(x, y - r * 0.9, r * 0.42, c);
              if (idx <= 3 && r > 1.8) p.circle(x - r * 0.28, y - r * 0.34, r * 0.36, F[Math.max(0, idx - 1)]);
              if (idx < 6) p.glow(x, y, r * 2.4 + 2, c, 0.18 * k);
            }
            break;
          }
          case P.BRAND:
            p.circle(x, y, 1.6, HOT[3]);
            p.px(x, y, Math.sin(this.t * 40 + q.seed) > 0 ? HOT[0] : HOT[1]);
            p.px(x + 1, y, HOT[1]);
            p.glow(x, y, 7, HOT[2], 0.45);
            break;
          case P.GRIT:
            if (k > 0.25 || k * 4 > 0.5) {
              p.px(x, y, q.col);
              if (q.size >= 2) p.px(x + 1, y, q.col), p.px(x, y + 1, scale(q.col, 0.8)), p.px(x + 1, y + 1, scale(q.col, 0.7));
            }
            break;
          case P.EMBER: {
            const c = k > 0.6 ? this.sparks[0] : k > 0.3 ? this.sparks[1] : this.sparks[2];
            if (k < 0.25 && Math.sin(this.t * 40 + q.seed) < 0) break;
            p.px(x, y, c);
            if (q.size > 1.5) p.px(x, y + 1, this.sparks[this.sparks.length - 1]);
            p.glow(x, y, 3 + q.size, c, 0.35 * k);
            break;
          }
          default: {
            const tw = 0.6 + 0.4 * Math.sin(this.t * (8 + q.seed % 5) + q.seed);
            if (q.size < 1) {
              if (tw * k > 0.25) p.px(x, y, tw > 0.8 ? WHITE : q.col);
              p.glow(x, y, 3, q.col, 0.4 * k * tw);
              break;
            }
            sparkle(p, x, y, q.size * tw * Math.min(1, k * 3), q.col, scale(q.col, 0.75), 0.5 * k * tw);
          }
        }
      }
    }
  };
  var Lights = class {
    constructor() {
      this.list = [];
    }
    add(x, y, r, color, k, life) {
      this.list.push({ x, y, r, color: hex(color), k, life, max: life });
    }
    update(dt) {
      for (let i = this.list.length - 1; i >= 0; i--) if ((this.list[i].life -= dt) <= 0) this.list.splice(i, 1);
    }
    draw(p) {
      for (const l of this.list) {
        const k = l.life / l.max;
        p.glow(l.x, l.y, l.r * (0.55 + 0.45 * k), l.color, l.k * k * k);
      }
    }
  };
  function sparkle(p, x, y, arm, c, tip = c, k = 0.6) {
    const n = Math.round(arm);
    if (n < 1) return;
    const X = Math.floor(x), Y = Math.floor(y);
    for (let d = 1; d <= n; d++) {
      const cc = d > n * 0.6 ? tip : c;
      for (const [dx, dy] of CROSS) p.px(X + dx * d, Y + dy * d, cc);
    }
    if (n >= 3) for (const [dx, dy] of DIAG) p.px(X + dx, Y + dy, c);
    if (n >= 6) for (const [dx, dy] of DIAG) p.px(X + dx * 2, Y + dy * 2, tip);
    p.px(X, Y, WHITE);
    p.glow(x, y, 4 + n * 2, c, k);
  }
  function flare(p, x, y, L2, k, ramp2) {
    if (L2 < 1) return;
    const R2 = ramp2.map(hex), n = R2.length;
    for (let i = 0; i < 8; i++) {
      const an = i * Math.PI / 4, len2 = i % 4 === 0 ? L2 : i % 2 === 0 ? L2 * 0.6 : L2 * 0.3, ca = Math.cos(an), sa = Math.sin(an);
      for (let d = 0; d <= len2; d += 0.5) {
        const u = d / len2;
        p.dot(x + ca * d, y + sa * d, u < 0.35 ? WHITE : u < 0.7 ? R2[n - 2] : R2[n - 3], u < 0.6 ? 1 : k * 1.5 * (1 - u) + 0.2);
      }
    }
  }
  function band(p, cx, cy, r, sy, th, k, ramp2, keep = () => true, hot = false) {
    if (r <= 0 || k <= 0) return;
    const R2 = ramp2.map(hex), n = R2.length;
    for (let j = 0, m = Math.ceil(r * TAU * 1.2); j < m; j++) {
      const ang = j / m * TAU, ca = Math.cos(ang), sa = Math.sin(ang);
      if (!keep(ang)) continue;
      for (let o = th; o >= 0; o -= 0.5) {
        const u = o / th, c = u < 0.15 ? hot ? WHITE : R2[n - 1] : u < 0.4 ? R2[n - 2] : u < 0.7 ? R2[n - 3] : R2[n - 4];
        p.dot(cx + ca * (r - o), cy + sa * (r - o) * sy, c, k * (u < 0.4 ? 1.2 : 1.15 - u));
      }
    }
  }

  // packages/fx/src/vendor/pixelfx/core/font.js
  var MINI = {
    A: ".#.|#.#|###|#.#|#.#",
    B: "##.|#.#|##.|#.#|##.",
    C: ".##|#..|#..|#..|.##",
    D: "##.|#.#|#.#|#.#|##.",
    E: "###|#..|##.|#..|###",
    F: "###|#..|##.|#..|#..",
    G: ".##|#..|#.#|#.#|.##",
    H: "#.#|#.#|###|#.#|#.#",
    I: "###|.#.|.#.|.#.|###",
    J: "..#|..#|..#|#.#|.#.",
    K: "#.#|#.#|##.|#.#|#.#",
    L: "#..|#..|#..|#..|###",
    M: "#.#|###|###|#.#|#.#",
    N: "##.|#.#|#.#|#.#|#.#",
    O: ".#.|#.#|#.#|#.#|.#.",
    P: "##.|#.#|##.|#..|#..",
    Q: ".#.|#.#|#.#|##.|.##",
    R: "##.|#.#|##.|#.#|#.#",
    S: ".##|#..|.#.|..#|##.",
    T: "###|.#.|.#.|.#.|.#.",
    U: "#.#|#.#|#.#|#.#|###",
    V: "#.#|#.#|#.#|#.#|.#.",
    W: "#.#|#.#|###|###|#.#",
    X: "#.#|#.#|.#.|#.#|#.#",
    Y: "#.#|#.#|.#.|.#.|.#.",
    Z: "###|..#|.#.|#..|###",
    0: "###|#.#|#.#|#.#|###",
    1: ".#.|##.|.#.|.#.|###",
    2: "##.|..#|.#.|#..|###",
    3: "##.|..#|.#.|..#|##.",
    4: "#.#|#.#|###|..#|..#",
    5: "###|#..|##.|..#|##.",
    6: ".##|#..|###|#.#|###",
    7: "###|..#|.#.|.#.|.#.",
    8: "###|#.#|###|#.#|###",
    9: "###|#.#|###|..#|##.",
    "+": "...|.#.|###|.#.|...",
    "-": "...|...|###|...|...",
    "!": "#|#|#|.|#",
    "?": "##.|..#|.#.|...|.#.",
    ".": ".|.|.|.|#",
    ",": "..|..|..|.#|#.",
    ":": ".|#|.|#|.",
    "/": "..#|..#|.#.|#..|#..",
    "%": "#.#|..#|.#.|#..|#.#",
    x: "...|#.#|.#.|#.#|...",
    "*": "#.#|.#.|#.#|...|...",
    "'": "#|#|.|.|.",
    "(": ".#|#.|#.|#.|.#",
    ")": "#.|.#|.#|.#|#.",
    "<": "..#|.#.|#..|.#.|..#",
    ">": "#..|.#.|..#|.#.|#..",
    "=": "...|###|...|###|...",
    _: "...|...|...|...|###",
    "#": "#.#|###|#.#|###|#.#"
  };
  var BIG = {
    A: ".###.|#...#|#...#|#####|#...#|#...#|#...#",
    B: "####.|#...#|#...#|####.|#...#|#...#|####.",
    C: ".###.|#...#|#....|#....|#....|#...#|.###.",
    D: "####.|#...#|#...#|#...#|#...#|#...#|####.",
    E: "#####|#....|#....|####.|#....|#....|#####",
    F: "#####|#....|#....|####.|#....|#....|#....",
    G: ".###.|#...#|#....|#.###|#...#|#...#|.####",
    H: "#...#|#...#|#...#|#####|#...#|#...#|#...#",
    I: "###|.#.|.#.|.#.|.#.|.#.|###",
    J: "..###|...#.|...#.|...#.|...#.|#..#.|.##..",
    K: "#...#|#..#.|#.#..|##...|#.#..|#..#.|#...#",
    L: "#....|#....|#....|#....|#....|#....|#####",
    M: "#...#|##.##|#.#.#|#.#.#|#...#|#...#|#...#",
    N: "#...#|#...#|##..#|#.#.#|#..##|#...#|#...#",
    O: ".###.|#...#|#...#|#...#|#...#|#...#|.###.",
    P: "####.|#...#|#...#|####.|#....|#....|#....",
    Q: ".###.|#...#|#...#|#...#|#.#.#|#..#.|.##.#",
    R: "####.|#...#|#...#|####.|#.#..|#..#.|#...#",
    S: ".####|#....|#....|.###.|....#|....#|####.",
    T: "#####|..#..|..#..|..#..|..#..|..#..|..#..",
    U: "#...#|#...#|#...#|#...#|#...#|#...#|.###.",
    V: "#...#|#...#|#...#|#...#|#...#|.#.#.|..#..",
    W: "#...#|#...#|#...#|#.#.#|#.#.#|#.#.#|.#.#.",
    X: "#...#|#...#|.#.#.|..#..|.#.#.|#...#|#...#",
    Y: "#...#|#...#|.#.#.|..#..|..#..|..#..|..#..",
    Z: "#####|....#|...#.|..#..|.#...|#....|#####",
    0: ".###.|#...#|#..##|#.#.#|##..#|#...#|.###.",
    1: ".#.|##.|.#.|.#.|.#.|.#.|###",
    2: ".###.|#...#|....#|...#.|..#..|.#...|#####",
    3: "#####|...#.|..#..|...#.|....#|#...#|.###.",
    4: "...#.|..##.|.#.#.|#..#.|#####|...#.|...#.",
    5: "#####|#....|####.|....#|....#|#...#|.###.",
    6: "..##.|.#...|#....|####.|#...#|#...#|.###.",
    7: "#####|....#|...#.|..#..|.#...|.#...|.#...",
    8: ".###.|#...#|#...#|.###.|#...#|#...#|.###.",
    9: ".###.|#...#|#...#|.####|....#|...#.|.##..",
    "!": "#|#|#|#|#|.|#",
    "?": ".###.|#...#|....#|...#.|..#..|.....|..#..",
    "+": ".....|..#..|..#..|#####|..#..|..#..|.....",
    "-": "....|....|....|####|....|....|....",
    ".": ".|.|.|.|.|.|#",
    ",": "..|..|..|..|..|.#|#.",
    ":": ".|.|#|.|.|#|.",
    "/": "....#|....#|...#.|..#..|.#...|#....|#....",
    "%": "##...|##..#|...#.|..#..|.#...|#..##|...##",
    x: ".....|.....|#...#|.#.#.|..#..|.#.#.|#...#",
    "*": ".....|..#..|#.#.#|.###.|#.#.#|..#..|.....",
    "'": "#|#|.|.|.|.|.",
    "<": "...#|..#.|.#..|#...|.#..|..#.|...#",
    ">": "#...|.#..|..#.|...#|..#.|.#..|#...",
    "=": "....|....|####|....|####|....|....",
    "(": "..#|.#.|#..|#..|#..|.#.|..#",
    ")": "#..|.#.|..#|..#|..#|.#.|#..",
    "#": ".#.#.|.#.#.|#####|.#.#.|#####|.#.#.|.#.#."
  };
  function build(table, h) {
    const out = {};
    for (const [ch, src] of Object.entries(table)) {
      const rows = src.split("|");
      out[ch] = { w: rows[0].length, rows: rows.map((r) => [...r].map((c) => c === "#")) };
      if (rows.length !== h) throw new Error(`glyph ${ch} has ${rows.length} rows, expected ${h}`);
    }
    return out;
  }
  var FONTS = {
    mini: { h: 5, space: 2, gap: 1, glyphs: build(MINI, 5) },
    big: { h: 7, space: 3, gap: 1, glyphs: build(BIG, 7) }
  };
  function textWidth(str, font = "mini") {
    const F = FONTS[font];
    let w = 0;
    for (const ch of String(str)) {
      const g = F.glyphs[ch] ?? F.glyphs[ch.toUpperCase()];
      w += (g ? g.w : F.space) + F.gap;
    }
    return Math.max(0, w - F.gap);
  }
  function rasterText(str, font, plot2) {
    const F = FONTS[font];
    let x = 0;
    for (const ch of String(str)) {
      const g = F.glyphs[ch] ?? F.glyphs[ch.toUpperCase()];
      if (!g) {
        x += F.space + F.gap;
        continue;
      }
      for (let r = 0; r < F.h; r++) for (let c = 0; c < g.w; c++) if (g.rows[r][c]) plot2(x + c, r);
      x += g.w + F.gap;
    }
  }

  // packages/fx/src/vendor/pixelfx/core/painter.js
  var BAYER = [0, 8, 2, 10, 12, 4, 14, 6, 3, 11, 1, 9, 15, 7, 13, 5].map((v) => (v + 0.5) / 16);
  var OUT = { c: 0, a: 1, l: 0, k: 0 };
  var sprites = /* @__PURE__ */ new WeakMap();
  var call = (v, ...args) => typeof v === "function" ? v(...args) : v;
  var Painter = class {
    constructor(frame2) {
      this.frame = frame2;
      this.reset();
    }
    /** Re-read the frame and clear placement, fade and light strength. */
    reset() {
      const f = this.frame;
      this.w = f.w;
      this.h = f.h;
      this.ox = f.ox | 0;
      this.oy = f.oy | 0;
      this.C = f.color;
      this.L = f.light;
      this.tx = 0;
      this.ty = 0;
      this.fx = 1;
      this.cs = 1;
      this.sn = 0;
      this.fade = 1;
      this.lightK = 1;
      this.layer = "front";
      return this;
    }
    /** Put the effect's origin at (x, y) in frame space, mirrored if flip, rotated by angle (radians). */
    place(x, y, flip = false, angle = 0) {
      this.tx = x;
      this.ty = y;
      this.fx = flip ? -1 : 1;
      this.cs = Math.cos(angle);
      this.sn = Math.sin(angle);
      return this;
    }
    // ---- transforms: local (effect) space <-> screen (frame) space
    toX(x, y) {
      return this.tx + x * this.fx * this.cs - y * this.sn;
    }
    toY(x, y) {
      return this.ty + x * this.fx * this.sn + y * this.cs;
    }
    fromX(sx, sy) {
      const dx = sx - this.tx, dy = sy - this.ty;
      return (dx * this.cs + dy * this.sn) * this.fx;
    }
    fromY(sx, sy) {
      const dx = sx - this.tx, dy = sy - this.ty;
      return -dx * this.sn + dy * this.cs;
    }
    // the screen pixel of the local pixel cell holding (x, y): mirrors and rotations land on whole cells
    cellX(x, y) {
      return Math.floor(this.toX(Math.floor(x) + 0.5, Math.floor(y) + 0.5));
    }
    cellY(x, y) {
      return Math.floor(this.toY(Math.floor(x) + 0.5, Math.floor(y) + 0.5));
    }
    // ---- raw writes, screen space, whole pixels. Color 0 means "nothing": it never erases what's there.
    put(sx, sy, c, a = 1) {
      if (!c) return;
      a *= this.fade;
      if (a < 1 && a <= BAYER[(sy & 3) << 2 | sx & 3]) return;
      const x = sx - this.ox, y = sy - this.oy;
      if (x < 0 || y < 0 || x >= this.w || y >= this.h) return;
      this.C[y * this.w + x] = c;
    }
    add(sx, sy, c, k = 1) {
      k *= this.fade * this.lightK;
      if (k <= 4e-3) return;
      const x = sx - this.ox, y = sy - this.oy;
      if (x < 0 || y < 0 || x >= this.w || y >= this.h) return;
      const i = y * this.w + x, d = this.L[i];
      const r = Math.min(255, (d & 255) + (c & 255) * k) | 0;
      const g = Math.min(255, (d >>> 8 & 255) + (c >>> 8 & 255) * k) | 0;
      const b = Math.min(255, (d >>> 16 & 255) + (c >>> 16 & 255) * k) | 0;
      this.L[i] = 255 << 24 | b << 16 | g << 8 | r;
    }
    /**
     * Blend a color over what's there at alpha a (0..1), keeping the result's own alpha: soft smoke, vapour and
     * mist. Use dithered dot() for hard pixel fades and blend() for translucent volumes.
     */
    blendPx(sx, sy, c, a) {
      a *= this.fade;
      if (!c || a <= 4e-3) return;
      const x = sx - this.ox, y = sy - this.oy;
      if (x < 0 || y < 0 || x >= this.w || y >= this.h) return;
      const i = y * this.w + x, d = this.C[i], da = (d >>> 24) / 255, oa = a + da * (1 - a), k = a / oa;
      const ch = (s) => (c >>> s & 255) * k + (d >>> s & 255) * (1 - k) & 255;
      this.C[i] = (oa * 255 & 255) << 24 | ch(16) << 16 | ch(8) << 8 | ch(0);
    }
    /** Translucent pixel at a local point. */
    blend(x, y, c, a) {
      this.blendPx(this.cellX(x, y), this.cellY(x, y), c, a);
    }
    /** A translucent disc: puffs of smoke, vapour, dust. c and a may be functions of (d: 0 center..1 rim, angle). */
    disc(cx, cy, r, c, a) {
      if (r < 0.5) return this.blend(cx, cy, call(c, 0, 0), call(a, 0, 0));
      this.each(cx - r, cy - r, cx + r, cy + r, (x, y, sx, sy) => {
        const dx = x - cx, dy = y - cy, d2 = dx * dx + dy * dy;
        if (d2 > r * r) return;
        const d = Math.sqrt(d2) / r, ang = Math.atan2(dy, dx);
        this.blendPx(sx, sy, call(c, d, ang), call(a, d, ang));
      });
    }
    /** Read back the color under a local point (0 if empty). */
    get(x, y) {
      const sx = this.cellX(x, y) - this.ox, sy = this.cellY(x, y) - this.oy;
      return sx < 0 || sy < 0 || sx >= this.w || sy >= this.h ? 0 : this.C[sy * this.w + sx];
    }
    // ---- pixels
    /** One opaque pixel. */
    px(x, y, c) {
      this.put(this.cellX(x, y), this.cellY(x, y), c, 1);
    }
    /** One pixel at alpha a (0..1), faded by ordered dither. */
    dot(x, y, c, a = 1) {
      if (a > 0) this.put(this.cellX(x, y), this.cellY(x, y), c, a);
    }
    /** Add light to one pixel. */
    light(x, y, c, k = 1) {
      this.add(this.cellX(x, y), this.cellY(x, y), c, k);
    }
    /**
     * Visit every screen pixel whose center falls in the local box [x0, x1] x [y0, y1], with that center in
     * local space: fn(lx, ly, sx, sy). The basis of every filled shape, so shapes mirror and rotate exactly.
     */
    each(x0, y0, x1, y1, fn) {
      let ax = Infinity, bx = -Infinity, ay = Infinity, by = -Infinity;
      for (let k = 0; k < 4; k++) {
        const x = k & 1 ? x1 : x0, y = k & 2 ? y1 : y0, sx = this.toX(x, y), sy = this.toY(x, y);
        if (sx < ax) ax = sx;
        if (sx > bx) bx = sx;
        if (sy < ay) ay = sy;
        if (sy > by) by = sy;
      }
      const sx0 = Math.max(Math.floor(ax), this.ox), sx1 = Math.min(Math.ceil(bx), this.ox + this.w - 1);
      const sy0 = Math.max(Math.floor(ay), this.oy), sy1 = Math.min(Math.ceil(by), this.oy + this.h - 1);
      for (let sy = sy0; sy <= sy1; sy++)
        for (let sx = sx0; sx <= sx1; sx++) {
          const cx = sx + 0.5, cy = sy + 0.5;
          fn(this.fromX(cx, cy), this.fromY(cx, cy), sx, sy);
        }
    }
    /**
     * A pixel shader over a local box. fn(x, y, out) returns a color, or sets out.c (color), out.a (alpha),
     * out.l (light color, defaults to out.c) and out.k (light amount). Return nothing to leave the pixel alone.
     */
    shade(x0, y0, x1, y1, fn) {
      const o = OUT;
      this.each(x0, y0, x1, y1, (lx, ly, sx, sy) => {
        o.c = 0;
        o.a = 1;
        o.l = 0;
        o.k = 0;
        const c = fn(lx, ly, o) || o.c;
        if (c) this.put(sx, sy, c, o.a);
        if (o.k > 0) this.add(sx, sy, o.l || c, o.k);
      });
    }
    // ---- shapes. Colors (c) and alphas (a) can be numbers or functions of the shape's own coordinates.
    /** 1 px line. c and a may be functions of u (0 at the start, 1 at the end). */
    line(x0, y0, x1, y1, c, a = 1) {
      let sx = this.cellX(x0, y0), sy = this.cellY(x0, y0);
      const ex = this.cellX(x1, y1), ey = this.cellY(x1, y1);
      const dx = Math.abs(ex - sx), dy = -Math.abs(ey - sy), stepx = sx < ex ? 1 : -1, stepy = sy < ey ? 1 : -1;
      const n = Math.max(dx, -dy) || 1, fc = typeof c === "function", fa = typeof a === "function";
      let err = dx + dy, i = 0;
      for (; ; ) {
        const u = i++ / n;
        this.put(sx, sy, fc ? c(u) : c, fa ? a(u) : a);
        if (sx === ex && sy === ey) break;
        const e2 = 2 * err;
        if (e2 >= dy) {
          err += dy;
          sx += stepx;
        }
        if (e2 <= dx) {
          err += dx;
          sy += stepy;
        }
      }
    }
    /** Lines through a list of points [[x, y], ...]. */
    polyline(pts, c, a = 1) {
      for (let i = 1; i < pts.length; i++) this.line(pts[i - 1][0], pts[i - 1][1], pts[i][0], pts[i][1], c, a);
    }
    /** Thick segment with round ends. c and a may be functions of (u along, v across: 0 center, 1 edge). */
    beam(x0, y0, x1, y1, width, c, a = 1) {
      const r = width / 2, dx = x1 - x0, dy = y1 - y0, L2 = dx * dx + dy * dy || 1e-9;
      this.shade(Math.min(x0, x1) - r, Math.min(y0, y1) - r, Math.max(x0, x1) + r, Math.max(y0, y1) + r, (x, y, o) => {
        const u = clamp(((x - x0) * dx + (y - y0) * dy) / L2), px = x0 + dx * u - x, py = y0 + dy * u - y;
        const d2 = px * px + py * py;
        if (d2 > r * r) return;
        const v = Math.sqrt(d2) / r;
        o.c = call(c, u, v);
        o.a = call(a, u, v);
      });
    }
    /** Filled disc. c and a may be functions of (d: 0 center to 1 rim, angle). */
    circle(cx, cy, r, c, a = 1) {
      if (r < 0.6) return this.dot(cx, cy, call(c, 0, 0), call(a, 0, 0));
      this.shade(cx - r, cy - r, cx + r, cy + r, (x, y, o) => {
        const dx = x - cx, dy = y - cy, d2 = dx * dx + dy * dy;
        if (d2 > r * r) return;
        const d = Math.sqrt(d2) / r, ang = Math.atan2(dy, dx);
        o.c = call(c, d, ang);
        o.a = call(a, d, ang);
      });
    }
    /** Ellipse. c and a may be functions of (d: 0 center to 1 rim, angle). */
    ellipse(cx, cy, rx, ry, c, a = 1) {
      if (rx <= 0 || ry <= 0) return;
      this.shade(cx - rx, cy - ry, cx + rx, cy + ry, (x, y, o) => {
        const dx = (x - cx) / rx, dy = (y - cy) / ry, d2 = dx * dx + dy * dy;
        if (d2 > 1) return;
        const d = Math.sqrt(d2), ang = Math.atan2(dy, dx);
        o.c = call(c, d, ang);
        o.a = call(a, d, ang);
      });
    }
    /** Ring from radius r - w to r. c and a may be functions of (v: 0 inner to 1 outer, angle). */
    ring(cx, cy, r, w, c, a = 1) {
      const r0 = Math.max(0, r - w);
      this.shade(cx - r, cy - r, cx + r, cy + r, (x, y, o) => {
        const dx = x - cx, dy = y - cy, d2 = dx * dx + dy * dy;
        if (d2 > r * r || d2 < r0 * r0) return;
        const v = w > 0 ? (Math.sqrt(d2) - r0) / (r - r0 || 1) : 1, ang = Math.atan2(dy, dx);
        o.c = call(c, v, ang);
        o.a = call(a, v, ang);
      });
    }
    /**
     * Band of a ring from angle a0 to a1 (radians, a1 > a0), radius r - w to r: the slash and smear shape.
     * c and a may be functions of (u: 0 at a0 to 1 at a1, v: 0 inner to 1 outer). w can be a function of u
     * for a crescent that tapers at both ends.
     */
    arc(cx, cy, r, w, a0, a1, c, a = 1) {
      const span = a1 - a0, wf = typeof w === "function";
      this.shade(cx - r, cy - r, cx + r, cy + r, (x, y, o) => {
        const dx = x - cx, dy = y - cy, d = Math.sqrt(dx * dx + dy * dy);
        if (d > r) return;
        let ang = Math.atan2(dy, dx) - a0;
        ang -= Math.floor(ang / (Math.PI * 2)) * Math.PI * 2;
        if (ang > span) return;
        const u = ang / span, ww = wf ? w(u) : w;
        if (ww <= 0 || d < r - ww) return;
        const v = (d - (r - ww)) / ww;
        o.c = call(c, u, v);
        o.a = call(a, u, v);
      });
    }
    /** Filled rectangle. */
    rect(x, y, w, h, c, a = 1) {
      if (this.sn === 0) {
        const X0 = Math.round(x), Y0 = Math.round(y), X1 = Math.round(x + w), Y1 = Math.round(y + h);
        for (let yy = Y0; yy < Y1; yy++) for (let xx = X0; xx < X1; xx++) this.put(this.cellX(xx, yy), this.cellY(xx, yy), c, a);
        return;
      }
      this.shade(x, y, x + w, y + h, (lx, ly, o) => {
        if (lx < x || ly < y || lx >= x + w || ly >= y + h) return;
        o.c = c;
        o.a = a;
      });
    }
    /** Filled polygon from points [[x, y], ...] (even-odd rule). */
    poly(pts, c, a = 1) {
      let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity;
      for (const [x, y] of pts) {
        if (x < x0) x0 = x;
        if (x > x1) x1 = x;
        if (y < y0) y0 = y;
        if (y > y1) y1 = y;
      }
      const n = pts.length;
      this.shade(x0, y0, x1, y1, (x, y, o) => {
        let inside = false;
        for (let i = 0, j = n - 1; i < n; j = i++) {
          const [xi, yi] = pts[i], [xj, yj] = pts[j];
          if (yi > y !== yj > y && x < (xj - xi) * (y - yi) / (yj - yi) + xi) inside = !inside;
        }
        if (!inside) return;
        o.c = call(c, x, y);
        o.a = call(a, x, y);
      });
    }
    tri(x0, y0, x1, y1, x2, y2, c, a = 1) {
      this.poly([[x0, y0], [x1, y1], [x2, y2]], c, a);
    }
    // ---- light
    /** Radial glow into the light buffer: k at the center, falling to 0 at radius r. */
    glow(x, y, r, c, k = 0.5) {
      if (r < 1 || k <= 4e-3) return;
      const cx = this.toX(x, y), cy = this.toY(x, y);
      const x0 = Math.floor(cx - r), x1 = Math.ceil(cx + r), y0 = Math.floor(cy - r), y1 = Math.ceil(cy + r);
      for (let sy = y0; sy <= y1; sy++) {
        const dy = (sy + 0.5 - cy) / r;
        for (let sx = x0; sx <= x1; sx++) {
          const dx = (sx + 0.5 - cx) / r, d = dx * dx + dy * dy;
          if (d >= 1) continue;
          const f = 1 - Math.sqrt(d);
          this.add(sx, sy, c, f * f * k);
        }
      }
    }
    /** Glow around a segment (a soft beam of light). */
    glowLine(x0, y0, x1, y1, r, c, k = 0.5) {
      if (r < 1 || k <= 4e-3) return;
      const ax = this.toX(x0, y0), ay = this.toY(x0, y0), bx = this.toX(x1, y1), by = this.toY(x1, y1);
      const dx = bx - ax, dy = by - ay, L2 = dx * dx + dy * dy || 1e-9;
      const X0 = Math.floor(Math.min(ax, bx) - r), X1 = Math.ceil(Math.max(ax, bx) + r);
      const Y0 = Math.floor(Math.min(ay, by) - r), Y1 = Math.ceil(Math.max(ay, by) + r);
      for (let sy = Y0; sy <= Y1; sy++)
        for (let sx = X0; sx <= X1; sx++) {
          const px = sx + 0.5, py = sy + 0.5, u = clamp(((px - ax) * dx + (py - ay) * dy) / L2);
          const ex = ax + dx * u - px, ey = ay + dy * u - py, d = Math.sqrt(ex * ex + ey * ey) / r;
          if (d >= 1) continue;
          const f = 1 - d;
          this.add(sx, sy, c, f * f * k);
        }
    }
    /** Glow hugging a circle of radius R (a shockwave's light), falling off over width r. */
    glowRing(x, y, R2, r, c, k = 0.5) {
      if (r < 1 || k <= 4e-3) return;
      const cx = this.toX(x, y), cy = this.toY(x, y), E = R2 + r;
      for (let sy = Math.floor(cy - E); sy <= Math.ceil(cy + E); sy++)
        for (let sx = Math.floor(cx - E); sx <= Math.ceil(cx + E); sx++) {
          const d = Math.abs(Math.hypot(sx + 0.5 - cx, sy + 0.5 - cy) - R2) / r;
          if (d >= 1) continue;
          const f = 1 - d;
          this.add(sx, sy, c, f * f * k);
        }
    }
    // ---- sprites, text, masks
    /**
     * A little sprite from strings: rows like ["..##..", ".#oo#."], pal maps characters to colors
     * ({ "#": "#222034", o: 0xff... }); "." and " " are empty. Top-left at (x, y).
     * opts: { scale, a, flip (mirror left-right), flipY (upside down), tint (draw every pixel in one color) }.
     */
    sprite(rows, pal, x, y, opts = {}) {
      let s = sprites.get(rows);
      if (!s) sprites.set(rows, s = rows.map((r) => [...r]));
      const k = opts.scale ?? 1, a = opts.a ?? 1, W2 = s[0]?.length ?? 0, cache3 = {};
      for (let r = 0; r < s.length; r++)
        for (let q = 0; q < s[r].length; q++) {
          const ch = s[r][q];
          if (ch === "." || ch === " ") continue;
          let c = opts.tint;
          if (c === void 0) {
            c = cache3[ch];
            if (c === void 0) c = cache3[ch] = pal[ch] === void 0 ? 0 : hex(pal[ch]);
          }
          if (!c) continue;
          const col = opts.flip ? W2 - 1 - q : q, row = opts.flipY ? s.length - 1 - r : r;
          if (k === 1) this.dot(x + col, y + row, c, a);
          else this.rect(x + col * k, y + row * k, k, k, c, a);
        }
    }
    /**
     * Pixel text. opts: { font: "mini" (3x5) | "big" (5x7), scale, align: "left" | "center" | "right",
     * outline: color, shadow: color, a }. (x, y) is the top of the text, at the left, center or right.
     */
    text(str, x, y, c, opts = {}) {
      const font = opts.font ?? "mini", k = opts.scale ?? 1, a = opts.a ?? 1, w = textWidth(str, font) * k;
      const left = Math.round(opts.align === "center" ? x - w / 2 : opts.align === "right" ? x - w : x), top = Math.round(y);
      const ol = opts.outline, sh = opts.shadow;
      if (ol !== void 0) rasterText(str, font, (gx, gy) => this.rect(left + gx * k - 1, top + gy * k - 1, k + 2, k + 2, ol, a));
      if (sh !== void 0) rasterText(str, font, (gx, gy) => this.rect(left + gx * k + 1, top + gy * k + 1, k, k, sh, a));
      rasterText(str, font, (gx, gy) => this.rect(left + gx * k, top + gy * k, k, k, call(c, gx, gy), a));
    }
    /** Size of text in pixels: [w, h]. */
    measure(str, opts = {}) {
      const k = opts.scale ?? 1;
      return [textWidth(str, opts.font ?? "mini") * k, FONTS[opts.font ?? "mini"].h * k];
    }
    /** Fill a mask ({ w, h, data }) with its top-left at (x, y). c may be a function of (mx, my). */
    mask(m, x, y, c, a = 1) {
      for (let my = 0; my < m.h; my++)
        for (let mx = 0; mx < m.w; mx++) if (m.data[my * m.w + mx]) this.dot(x + mx, y + my, call(c, mx, my), call(a, mx, my));
    }
    /** The 1 px outline just outside a mask. */
    outline(m, x, y, c, a = 1) {
      const at = (mx, my) => mx >= 0 && my >= 0 && mx < m.w && my < m.h && m.data[my * m.w + mx];
      for (let my = -1; my <= m.h; my++)
        for (let mx = -1; mx <= m.w; mx++)
          if (!at(mx, my) && (at(mx - 1, my) || at(mx + 1, my) || at(mx, my - 1) || at(mx, my + 1)))
            this.dot(x + mx, y + my, call(c, mx, my), call(a, mx, my));
    }
  };

  // packages/fx/src/vendor/pixelfx/core/actor.js
  var HERO = [
    "....kkkkk...",
    "..kkhhhhhk..",
    ".khhhhhhhhk.",
    ".khhhhhhhhhk",
    ".khhssssshhk",
    ".khsessesshk",
    ".khsessesshk",
    "..ksssssssk.",
    "...kkSSSkk..",
    "..kttttttk..",
    ".kttTttTttk.",
    ".ksttTTttsk.",
    ".kstttttttk.",
    "..kbbbbbbk..",
    "..kppkkppk..",
    "..kppk.kppk.",
    "..kppk.kppk.",
    "..koook.kook",
    "..kkkkk.kkkk"
  ];
  var HERO_PAL = {
    k: "#17121f",
    h: "#7a4128",
    s: "#f3c49d",
    S: "#c98b6c",
    e: "#17121f",
    t: "#5f6f94",
    T: "#46536f",
    b: "#8a5a32",
    p: "#38334a",
    o: "#6a4030",
    // the 2x character's extra detail
    H: "#a35d34",
    w: "#ffffff",
    m: "#a3564a",
    g: "#e8c060",
    L: "#7f90b6",
    O: "#8f5a3f",
    P: "#4b4560",
    // the scarf
    c: "#f53cd1",
    C: "#ff8fe6",
    D: "#a31f8a"
  };
  var DUMMY_PAL = {
    k: "#0e0c14",
    A: "#e4e6ec",
    B: "#b6b9c3",
    C: "#868995",
    D: "#5c5e6a",
    E: "#6e707c",
    F: "#4b4d58",
    G: "#34353f",
    J: "#2a2b33",
    m: "#f53cd1"
  };
  var HERO2 = [
    "...........kkk..........",
    "..........kAABk.........",
    ".........kAAABJk........",
    ".........kABBJJk........",
    ".........kBBBJCDk.......",
    ".........kBCJDDDk.......",
    ".........kkJJJDk........",
    ".......kkkkABBJCkk......",
    "......kAABCJBCCCkDk.....",
    "......kABBCJCCCmDkDk....",
    "......kBBCDDJCDDDkDk....",
    "......kABCDJDDDDDkk.....",
    ".....kAABDkDDDDJkk......",
    ".....kABCDkDDJJGkk......",
    ".....kABCkJJJGGGkk......",
    "....kJJCDkFFFGGGk.......",
    "....kAJJDkJJJGGGk.......",
    "....kJCJJkABBJGGk.......",
    ".....kJCCkBBCDJJJk......",
    ".....kCCCJBBCDJJDk......",
    ".....kCCCDJCCDkJDDk.....",
    "......kCDDJBCDkDDDk.....",
    ".......kDJJJCDkDDDkk....",
    ".......kJBCJCDkDDDkk....",
    ".......kBDJBCDkCDDkk....",
    "........kJJBCDkCDDk.....",
    "........kBBBCDkCCDDk....",
    "........kBBBCDkCCDDk....",
    ".........kBBCDkJDDDk....",
    "........kBJJJJkCJJJk....",
    "........kBBCCDkCCDDk....",
    "........kBBCDDkCDDk.....",
    "........kBBCDkCCDDk.....",
    "........kBCCDkCCDDk.....",
    "........kBCDDkCDDDk.....",
    ".......kJBCJkkkDJkkkk...",
    ".......kAJJAAAAkCCCCCk..",
    "........kkkkkkkkkkkkk..."
  ];
  function maskOf(rows, k = 1) {
    const h = rows.length * k, w = rows[0].length * k, data = new Uint8Array(w * h);
    rows.forEach((r, y) => [...r].forEach((ch, x) => {
      if (ch === ".") return;
      for (let j = 0; j < k * k; j++) data[(y * k + (j / k | 0)) * w + x * k + j % k] = 1;
    }));
    return { w, h, data };
  }
  var MASKS = { 1: maskOf(HERO, 1), 2: maskOf(HERO2, 1) };
  function pixelsOf(rows, pal) {
    const w = rows[0].length, data = new Uint32Array(w * rows.length);
    rows.forEach((r, y) => [...r].forEach((ch, x) => data[y * w + x] = ch === "." ? 0 : hex(pal[ch])));
    return data;
  }
  var PIXELS = { 1: pixelsOf(HERO, HERO_PAL), 2: pixelsOf(HERO2, DUMMY_PAL) };
  function stockActor(k = 1) {
    k = k === 2 ? 2 : 1;
    const m = MASKS[k], x = -Math.floor(m.w / 2), y = -m.h;
    return { mask: m, pixels: PIXELS[k], x, y, w: m.w, h: m.h, k, head: [0, y], chest: [0, k === 2 ? -26 : y + 11], ...k === 2 ? { eyes: [[13, 3], [15, 3]] } : {} };
  }

  // packages/fx/src/vendor/pixelfx/core/fx.js
  function createFrame(w, h, ox = 0, oy = 0) {
    return { w, h, ox, oy, color: new Uint32Array(w * h), light: new Uint32Array(w * h) };
  }
  function clearFrame(f) {
    f.color.fill(0);
    f.light.fill(0);
    return f;
  }
  var painters = /* @__PURE__ */ new WeakMap();
  function painterFor(frame2) {
    let p = painters.get(frame2);
    if (!p) painters.set(frame2, p = new Painter(frame2));
    return p.reset();
  }
  var FADE = 0.3;
  var isRamp = (v) => Array.isArray(v) && v.length > 0 && v.every((c) => typeof c === "number" || /^#[0-9a-f]{3,8}$/i.test(c));
  function resolveOptions(meta11, o = {}) {
    const opts = { ...meta11.options ?? {}, ...o };
    for (const [k, def] of Object.entries(meta11.options ?? {}))
      if (isRamp(def) && isRamp(o[k]) && o[k].length !== def.length) opts[k] = fit(o[k], def.length).map(toHex);
    if (meta11.actor && !opts.actor) opts.actor = stockActor(meta11.actor === 2 ? 2 : 1);
    return opts;
  }
  function createFx(mod, o = {}) {
    const meta11 = mod.meta ?? {};
    const opts = resolveOptions(meta11, o);
    const impl = mod.create ? mod.create(opts) : mod;
    const D2 = meta11.duration ?? 1;
    let t = 0, stopAt = Infinity;
    return {
      meta: meta11,
      options: opts,
      get t() {
        return t;
      },
      update(dt) {
        t += dt;
        if (!impl.update) return;
        const n = Math.max(1, Math.ceil(dt * 120 - 1e-9));
        for (let i = 0; i < n; i++) impl.update(dt / n, opts);
      },
      draw(frame2, layer) {
        const p = painterFor(frame2);
        p.place(opts.x ?? 0, opts.y ?? 0, !!opts.flip, opts.angle ?? 0);
        p.fade = stopAt === Infinity ? 1 : clamp(1 - (t - stopAt) / FADE);
        p.lightK = opts.light ?? 1;
        const tt = meta11.loop ? t % D2 : Math.min(t, D2);
        if (layer !== "front" && impl.drawBack) {
          p.layer = "back";
          impl.drawBack(p, tt, opts);
        }
        if (layer !== "back") {
          p.layer = "front";
          impl.draw(p, tt, opts);
        }
      },
      /** Let it end: loops fade out, one-shots cut short. */
      stop() {
        if (stopAt === Infinity) stopAt = t;
      },
      done() {
        return t - stopAt >= FADE || !meta11.loop && t >= D2;
      }
    };
  }
  function composite(f, out, bg = null, lightK = 1) {
    const n = f.w * f.h, C = f.color, L2 = f.light, flat = typeof bg === "number";
    for (let i = 0; i < n; i++) {
      const c = C[i], l = L2[i] & 16777215;
      let r, g, b, a;
      const ca = c >>> 24;
      if (ca === 255) {
        r = c & 255;
        g = c >>> 8 & 255;
        b = c >>> 16 & 255;
        a = 255;
      } else if (bg === null) {
        r = c & 255;
        g = c >>> 8 & 255;
        b = c >>> 16 & 255;
        a = ca;
      } else {
        const k = flat ? bg : bg[i], f2 = ca / 255;
        r = (c & 255) * f2 + (k & 255) * (1 - f2);
        g = (c >>> 8 & 255) * f2 + (k >>> 8 & 255) * (1 - f2);
        b = (c >>> 16 & 255) * f2 + (k >>> 16 & 255) * (1 - f2);
        a = 255;
      }
      if (l) {
        const lr = (l & 255) * lightK, lg = (l >>> 8 & 255) * lightK, lb = (l >>> 16 & 255) * lightK;
        if (a < 255) {
          const pa = a / 255, pr = r * pa + lr, pg = g * pa + lg, pb = b * pa + lb;
          const na = Math.min(1, Math.max(pa, Math.max(lr, lg, lb) / 255));
          if (na > 0) {
            r = Math.min(255, pr / na);
            g = Math.min(255, pg / na);
            b = Math.min(255, pb / na);
            a = na * 255;
          }
        } else {
          r = Math.min(255, r + lr);
          g = Math.min(255, g + lg);
          b = Math.min(255, b + lb);
        }
      }
      const j = i * 4;
      out[j] = r;
      out[j + 1] = g;
      out[j + 2] = b;
      out[j + 3] = a;
    }
    return out;
  }

  // packages/fx/src/vendor/pixelfx/core/scene.js
  var SKY = hex("#15131d");
  var SKY_TOP = hex("#0d0b14");
  var SKY_LOW = hex("#221d33");
  var FLOOR_EDGE = hex("#4a4263");
  var FLOOR = hex("#2b2639");
  var FLOOR_DARK = hex("#211d2d");
  var MORTAR = hex("#1a1724");

  // packages/fx/src/vendor/pixelfx/core/rig.js
  var PAL2 = Object.fromEntries(Object.entries(DUMMY_PAL).map(([k, v]) => [k, hex(v) >>> 0]));
  var INK2 = PAL2.k;
  var SEAM = PAL2.J;
  var MARK = PAL2.m;
  var SHELL = [PAL2.A, PAL2.B, PAL2.C, PAL2.D];
  var CORE = [PAL2.E, PAL2.F, PAL2.G, PAL2.G];
  var DEG = Math.PI / 180;
  var add = (a, b) => [a[0] + b[0], a[1] + b[1], a[2] + b[2]];
  var sub = (a, b) => [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
  var mul = (a, s) => [a[0] * s, a[1] * s, a[2] * s];
  var dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
  var cross = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
  var len = (a) => Math.hypot(a[0], a[1], a[2]);
  var unit = (a) => mul(a, 1 / (len(a) || 1e-6));
  var rotY = (t) => {
    const c = Math.cos(t), s = Math.sin(t);
    return [c, 0, s, 0, 1, 0, -s, 0, c];
  };
  var rotZ = (t) => {
    const c = Math.cos(t), s = Math.sin(t);
    return [c, -s, 0, s, c, 0, 0, 0, 1];
  };
  var mm = (A, B2) => {
    const o = new Array(9);
    for (let r = 0; r < 3; r++) for (let c = 0; c < 3; c++) o[r * 3 + c] = A[r * 3] * B2[c] + A[r * 3 + 1] * B2[3 + c] + A[r * 3 + 2] * B2[6 + c];
    return o;
  };
  var mv = (M2, v) => [M2[0] * v[0] + M2[1] * v[1] + M2[2] * v[2], M2[3] * v[0] + M2[4] * v[1] + M2[5] * v[2], M2[6] * v[0] + M2[7] * v[1] + M2[8] * v[2]];
  var clamp01 = (v) => Math.max(0, Math.min(1, v));
  var M = {
    pelvis: 19.7,
    spine1: 2.8,
    spine2: 4.6,
    shoulderUp: 2.5,
    shoulderOut: 5.9,
    neckUp: 4,
    headUp: 3.1,
    hipDown: 1.1,
    hipOut: 2.8,
    thigh: 8.6,
    shin: 8.3,
    upper: 7.6,
    fore: 7.4,
    turn: 36 * DEG
  };
  var STAND = { lean: 0, crouch: 0, yaw: 0, fx: -3, fy: -15, bx: 5, by: -15, ffx: -2, ffy: -4, fbx: 3, fby: -4 };
  function ik(a, target, L1, L2, pole) {
    let to = sub(target, a), d = len(to);
    const reach = L1 + L2 - 0.02;
    if (d > reach) {
      to = mul(to, reach / d);
      d = reach;
    }
    const u = unit(to), along = (L1 * L1 - L2 * L2 + d * d) / (2 * d), h = Math.sqrt(Math.max(0, L1 * L1 - along * along));
    let v = sub(pole, mul(u, dot(pole, u)));
    v = len(v) < 1e-4 ? unit(cross(u, [0, 0, 1])) : unit(v);
    return { joint: add(a, add(mul(u, along), mul(v, h))), end: add(a, to), u, v };
  }
  function frame(t, R2) {
    return { t, R: R2 };
  }
  function boneFrame(a, b, pole) {
    const x = unit(sub(b, a));
    let y = sub(pole, mul(x, dot(pole, x)));
    y = len(y) < 1e-4 ? unit(cross(x, [0, 0, 1])) : unit(y);
    const z = cross(x, y);
    return frame(a, [x[0], y[0], z[0], x[1], y[1], z[1], x[2], y[2], z[2]]);
  }
  var weaponOf = (name) => WEAPONS[name];
  function solve(pose) {
    const q = { ...STAND, ...pose }, lean = q.lean, W2 = q.weapon && weaponOf(q.weapon), OW = q.offWeapon && weaponOf(q.offWeapon);
    const sa = q.sa ?? 0, wl = q.wl ?? 1, axisZ = Math.sqrt(Math.max(0, 1 - wl * wl)) * (q.wz ?? 1);
    const axis = [Math.cos(sa) * wl, -Math.sin(sa) * wl, axisZ], side = [-Math.sin(sa), -Math.cos(sa), 0];
    const two = !!(q.two && W2), nearZ = q.fz ?? (two ? 3 : 4.5);
    const fwd = (q.fx - STAND.fx) / 24, farFwd = two ? 0 : (q.bx - STAND.bx) / 22;
    let turn = M.turn + (fwd >= 0 ? -44 * DEG * Math.min(1, fwd) : 28 * DEG * Math.min(1, -fwd * 1.8));
    turn += (farFwd > 0 ? 34 * DEG * Math.min(1, farFwd) : 0) + (q.twist ?? 0) * 4 * DEG;
    if (q.turn !== void 0) turn = q.turn;
    const hipTurn = M.turn + (turn - M.turn) * 0.45, tilt = Math.atan2(lean, 13);
    const Rp = mm(rotZ(-tilt * 0.25), rotY(-hipTurn)), Rc = mm(rotZ(-tilt), rotY(-turn));
    const ankleN = [q.ffx, -q.ffy - 1.8, q.fzz ?? 2.4], ankleF = [q.fbx, -q.fby - 1.8, q.bzz ?? -2.4];
    let pelvis = [lean * 0.2, M.pelvis - q.crouch, 0];
    const hipAt = (s) => add(pelvis, mv(Rp, [0, -M.hipDown, s * M.hipOut]));
    const maxLeg = (M.thigh + M.shin) * 0.995;
    for (const [s, a] of [[1, ankleN], [-1, ankleF]]) {
      const h = hipAt(s), dx = h[0] - a[0], dz = h[2] - a[2], flat = dx * dx + dz * dz;
      if (flat < maxLeg * maxLeg) {
        const top = a[1] + Math.sqrt(maxLeg * maxLeg - flat);
        if (h[1] > top) pelvis = [pelvis[0], pelvis[1] - (h[1] - top), pelvis[2]];
      }
    }
    const waist = add(pelvis, [Math.sin(tilt * 0.45) * M.spine1, Math.cos(tilt * 0.45) * M.spine1, 0]);
    const chest = add(waist, [Math.sin(tilt) * M.spine2, Math.cos(tilt) * M.spine2, 0]);
    const neck = add(chest, mv(Rc, [0, M.neckUp, 0]));
    const headTurn = M.turn * 0.9 + (turn - M.turn) * 0.35, nod = tilt * 0.35 + (q.hy ?? 0) * 7 * DEG, roll = (q.hx ?? 0) * 7 * DEG;
    const Rh = mm(rotZ(-nod - roll), rotY(-headTurn));
    const head = add(neck, mv(Rh, [0.15, M.headUp, 0]));
    const pick = (s, target) => {
      const base = add(chest, mv(Rc, [0, M.shoulderUp, s * M.shoulderOut])), to = sub(target, base), d = len(to);
      return add(base, mul(unit(to), Math.min(1.8, Math.max(0, d - 11) * 0.35)));
    };
    const nearT = [q.fx, -q.fy, nearZ];
    const farT = two ? [q.fx + axis[0] * W2.two, -q.fy + axis[1] * W2.two, nearZ + axis[2] * W2.two] : [q.bx, -q.by, q.bz ?? (q.armsFront ? 5.5 : -4.5)];
    const sN = pick(1, nearT), sF = pick(-1, farT);
    const pole = (s, T, shoulder, hold) => {
      const up = clamp01((T[1] - shoulder[1] + 2) / 10);
      const base = [-0.55 + up * 1.1, -1 + up * 0.9, s * (0.45 + up * 0.5)];
      if (!hold) return base;
      const u = unit(sub(T, shoulder));
      let best = base, score = Infinity;
      for (let i = 0; i < 16; i++) {
        const a = i / 16 * Math.PI * 2, x = unit(cross(u, [0.3, 1, 0.2])), y = cross(u, x), v = add(mul(x, Math.cos(a)), mul(y, Math.sin(a)));
        const A = ik(shoulder, T, M.upper, M.fore, v), f = unit(sub(A.end, A.joint));
        const cost = Math.abs(dot(f, hold)) * 0.7 + (1 - dot(unit(base), v)) * 0.55;
        if (cost < score) {
          score = cost;
          best = v;
        }
      }
      return best;
    };
    const holdN = W2 ? W2.across ? side : axis : null, holdF = two ? W2.across ? side : axis : OW ? [Math.cos(q.sb ?? Math.PI), -Math.sin(q.sb ?? Math.PI), 0] : null;
    const armN = ik(sN, nearT, M.upper, M.fore, pole(1, nearT, sN, holdN)), armF = ik(sF, farT, M.upper, M.fore, pole(-1, farT, sF, holdF));
    const kneePole = (s) => mv(Rp, [1, 0, s * 0.35]);
    const hipN = hipAt(1), hipF = hipAt(-1);
    const legN = ik(hipN, ankleN, M.thigh, M.shin, kneePole(1)), legF = ik(hipF, ankleF, M.thigh, M.shin, kneePole(-1));
    const footDir = (s) => {
      const t = hipTurn * 0.6 + s * 8 * DEG;
      return [Math.cos(t), 0, Math.sin(t)];
    };
    const B2 = {
      pelvis: frame(pelvis, Rp),
      waist: frame(waist, mm(rotZ(-tilt * 0.6), rotY(-(turn + hipTurn) / 2))),
      chest: frame(chest, Rc),
      head: frame(head, Rh),
      neck: frame(neck, Rh),
      upperN: boneFrame(sN, armN.joint, armN.v),
      foreN: boneFrame(armN.joint, armN.end, armN.v),
      upperF: boneFrame(sF, armF.joint, armF.v),
      foreF: boneFrame(armF.joint, armF.end, armF.v),
      thighN: boneFrame(hipN, legN.joint, legN.v),
      shinN: boneFrame(legN.joint, legN.end, legN.v),
      thighF: boneFrame(hipF, legF.joint, legF.v),
      shinF: boneFrame(legF.joint, legF.end, legF.v)
    };
    B2.footN = frame(legN.end, mm(rotY(-Math.atan2(footDir(1)[2], footDir(1)[0])), rotZ(q.toeF ? -55 * DEG : 0)));
    B2.footF = frame(legF.end, mm(rotY(-Math.atan2(footDir(-1)[2], footDir(-1)[0])), rotZ(q.toeB ? -55 * DEG : 0)));
    return { B: B2, W: W2, OW, q, axis, side, armN, armF, legN, legF, sN, sF, hipN, hipF, turn };
  }
  var BW = 300;
  var BH = 240;
  var OX = 150;
  var OY = 180;
  var Zb = new Float32Array(BW * BH);
  var Tone = new Float32Array(BW * BH);
  var Part = new Int8Array(BW * BH);
  var Mat = new Int8Array(BW * BH);
  var Fr = new Int8Array(BW * BH);
  var LX = new Float32Array(BW * BH);
  var LY = new Float32Array(BW * BH);
  var Col = new Uint32Array(BW * BH);
  var touched = [];
  var LIGHT = unit([-0.55, 0.72, 0.5]);
  var curFrameIndex = 0;
  var onlyPart = 0;
  function plot(i, z, tone, part, mat, wx, wy, color) {
    if (onlyPart && part !== onlyPart) return;
    if (Part[i] === 0) touched.push(i);
    else if (z <= Zb[i]) return;
    Zb[i] = z;
    Tone[i] = tone;
    Part[i] = part;
    Mat[i] = mat;
    Fr[i] = curFrameIndex;
    LX[i] = wx;
    LY[i] = wy;
    Col[i] = color;
  }
  var PART = { pelvis: 1, waist: 2, chest: 3, neck: 4, head: 5, face: 6, upperN: 7, elbowN: 8, foreN: 9, handN: 10, upperF: 11, elbowF: 12, foreF: 13, handF: 14, thighN: 15, kneeN: 16, shinN: 17, footN: 18, thighF: 19, kneeF: 20, shinF: 21, footF: 22, weapon: 23, offWeapon: 24 };
  var STEEL = Object.fromEntries(Object.entries({ hi: "#ffffff", a: "#e8edf6", b: "#a4afc6", d: "#68748f", gold: "#ffd84a", goldD: "#b8862a", grip: "#7a3a2a", gripD: "#4a2018", wood: "#8a5a32", woodD: "#5a3820", dark: "#3a3448", darkD: "#262033", olive: "#58663f", oliveA: "#7d8c58", oliveD: "#3a4529" }).map(([k, v]) => [k, hex(v) >>> 0]));
  function blade(T, from, length, w) {
    for (let i = from; i <= from + length + 0.01; i += 0.4) {
      const r = i - from, wd = r > length - 5 ? Math.max(0, (length - r) / 5 * w) : w;
      for (let k = -wd; k <= wd + 0.01; k += 0.4) T(i, k, k < -w * 0.4 ? STEEL.hi : k > w * 0.4 ? STEEL.d : STEEL.a);
    }
  }
  var haft = (T, from, to, a, d, r = 0.8) => {
    for (let i = from; i <= to; i += 0.4) for (let k = -r; k <= r + 0.01; k += 0.4) T(i, k, k > 0.1 ? d : a);
  };
  var WEAPONS = {
    // the fist is at i = 0; `two` is where the other hand goes; `across`: the handle lies across the weapon's length
    sword: { two: -4.4, draw(T, q) {
      const end = q.two ? -6.5 : -2.6;
      haft(T, end, 2.2, STEEL.grip, STEEL.gripD);
      for (let k = -1.4; k <= 1.4; k += 0.4) T(end - 0.4, k, STEEL.gold);
      for (let k = -4.6; k <= 4.6; k += 0.4) T(2.6, k, Math.abs(k) > 3.8 ? STEEL.goldD : STEEL.gold), T(3, k, STEEL.goldD);
      blade(T, 3.2, 25, 2.2);
    } },
    greatsword: { two: -4.8, draw(T) {
      haft(T, -7.2, 2.2, STEEL.grip, STEEL.gripD);
      for (let k = -1.8; k <= 1.8; k += 0.4) T(-7.6, k, STEEL.gold);
      for (let k = -6.6; k <= 6.6; k += 0.4) T(2.6, k, Math.abs(k) > 5.6 ? STEEL.goldD : STEEL.gold), T(3, k, STEEL.goldD);
      blade(T, 3.2, 31, 3);
      for (let i = 4; i <= 28; i += 0.4) T(i, 0, STEEL.b);
    } },
    dagger: { draw(T) {
      haft(T, -2.4, 1.8, STEEL.grip, STEEL.gripD);
      for (let k = -2.6; k <= 2.6; k += 0.4) T(2.2, k, STEEL.goldD);
      blade(T, 2.6, 10, 1.3);
    } },
    spear: { two: -12, draw(T) {
      haft(T, -18, 36, STEEL.wood, STEEL.woodD, 0.5);
      blade(T, 36, 11, 2);
      for (let k = -2.4; k <= 2.4; k += 0.4) T(36, k, STEEL.goldD);
    } },
    hammer: { two: -7, draw(T) {
      for (const lift of [-0.8, 0, 0.8]) for (let i = -10; i <= 18; i += 0.4) for (let k = -0.8; k <= 0.81; k += 0.4) T(i, k, k > 0.1 ? STEEL.woodD : STEEL.wood, lift);
      for (let i = 18; i <= 28; i += 0.4) for (let k = -9; k <= 9; k += 0.4) {
        const face = Math.abs(k) > 7.4 ? k < 0 ? STEEL.a : STEEL.d : i < 20 ? STEEL.hi : i > 26.4 ? STEEL.d : Math.abs(k) < 2 ? STEEL.gold : STEEL.b;
        T(i, k, face, 4.5);
        T(i, k, face, -4.5);
        if (i < 18.4 || i > 27.6 || Math.abs(k) > 8.6) for (let l = -4; l <= 4; l += 0.4) T(i, k, k < 0 ? STEEL.a : i > 27.6 ? STEEL.d : STEEL.b, l);
      }
    } },
    scythe: { two: -11, draw(T) {
      haft(T, -16, 31, STEEL.dark, STEEL.darkD, 0.5);
      for (let j = 0; j <= 28; j += 0.4) {
        const u = j / 28, w = 3.2 * (1 - u) + 0.3, b = 31.5 - u * u * 12;
        for (let k = -w; k <= w; k += 0.4) T(b + k, j + 0.8, k > w * 0.3 ? STEEL.hi : k < -w * 0.4 ? STEEL.d : STEEL.b);
      }
    } },
    claw: { draw(T) {
      for (const q0 of [-2.4, 0, 2.4])
        for (let i = 2; i <= 9.5; i += 0.4) {
          const u = (i - 2) / 7.5, k = q0 + u * u * 1.8;
          T(i, k, u > 0.55 ? STEEL.hi : STEEL.a);
          if (u < 0.6) T(i, k + 0.8, STEEL.d);
        }
    } },
    bow: { across: true, draw(T, q, off) {
      for (let u = -1; u <= 1.001; u += 0.025) {
        const k = u * 17, i = 6 * (1 - u * u) - 1;
        T(i, k, Math.abs(u) > 0.85 ? STEEL.goldD : STEEL.wood);
        T(i + 0.8, k, STEEL.woodD);
      }
      const tipA = T.at(-1, -17), tipB = T.at(-1, 17), mid = q.pull ? off : T.at(-1, 0);
      const line = (A, B2, c) => {
        const n = Math.max(2, Math.ceil(len(sub(B2, A)) / 0.4)), Z = STEEL.a;
        for (let k = 0; k <= n; k++) {
          const P3 = add(A, mul(sub(B2, A), k / n)), wx = Math.round(P3[0]), wy = Math.round(P3[1]), idx = (OY - wy) * BW + (OX + wx);
          curFrameIndex = -1;
          plot(idx, P3[2] + 0.05, 2, PART.weapon, 2, wx, wy, c ?? Z);
        }
      };
      line(tipA, mid);
      line(tipB, mid);
      if (q.nocked) {
        const nock = mid, tip = T.at(13, 0);
        line(nock, tip, STEEL.wood);
        for (let i = 9; i <= 13; i += 0.4) for (let k = -(13 - i) * 0.45; k <= (13 - i) * 0.45; k += 0.4) T(i, k, STEEL.hi);
      }
    } },
    pistol: { across: true, draw(T) {
      for (let i = -1; i <= 9.5; i += 0.4) for (let k = -4.2; k <= -2.4; k += 0.4) T(i, k, k < -3.6 ? STEEL.a : k > -2.9 ? STEEL.d : STEEL.b);
      for (let i = -1.2; i <= 1.2; i += 0.4) for (let k = -2.4; k <= 2.4; k += 0.4) T(i, k, STEEL.gripD);
      T(9, -4.6, STEEL.hi);
    } },
    launcher: { two: -9, draw(T) {
      for (let i = -14; i <= 22; i += 0.4) for (let k = -6; k <= -1; k += 0.4) T(i, k, k < -4.8 ? STEEL.oliveA : k > -2.2 ? STEEL.oliveD : Math.abs(i - 3) < 1.4 ? STEEL.gold : STEEL.olive);
      for (let k = -6.8; k <= -0.2; k += 0.4) T(22.4, k, STEEL.b), T(-14.4, k, STEEL.d);
    } },
    handle: { draw(T) {
      haft(T, -2.6, 6, STEEL.grip, STEEL.gripD);
      for (let k = -1.6; k <= 1.6; k += 0.4) T(-3, k, STEEL.gold), T(6.4, k, STEEL.gold);
    } }
  };
  var REST_FRAMES = null;
  REST_FRAMES = solve({}).B;

  // packages/fx/src/vendor/pixelfx/core/act.js
  var TW = 38;
  var TH = 52;
  var TP = Object.fromEntries(Object.entries({ ink: "#0b0a1a", wood: "#724c2e", woodL: "#a0703a", woodD: "#4e331f", straw: "#d2aa55", strawL: "#f0d98a", burlapD: "#86643a", burlap: "#b38b57", burlapL: "#c9a26c", red: "#9a2f3c", redL: "#c4434f", white: "#ffffff" }).map(([k, v]) => [k, hex(v)]));
  var DUST = ["#efe7dc", "#c9bfb8", "#8f8693", "#5a5468"].map(hex);
  var DUMMY = new Uint32Array(TW * TH);
  (function buildDummy() {
    const px = (x, y, c) => {
      if (x >= 0 && y >= 0 && x < TW && y < TH) DUMMY[y * TW + x] = c;
    };
    const R2 = (x, y, w, h, c) => {
      for (let j = 0; j < h; j++) for (let i = 0; i < w; i++) px(x + i, y + j, c);
    };
    R2(15, 38, 8, 14, TP.ink);
    R2(16, 34, 6, 18, TP.wood);
    R2(16, 34, 2, 18, TP.woodL);
    R2(20, 34, 2, 18, TP.woodD);
    R2(1, 18, 36, 1, TP.ink);
    R2(1, 23, 36, 1, TP.ink);
    R2(1, 19, 36, 4, TP.wood);
    R2(1, 19, 36, 1, TP.woodL);
    R2(1, 22, 36, 1, TP.woodD);
    for (const [bx, s] of [[0, -1], [33, 1]]) {
      R2(bx, 17, 5, 8, TP.straw);
      for (const [dx, dy, c] of [[2, 16, TP.straw], [3, 15, TP.strawL], [1, 17, TP.strawL], [2, 25, TP.straw], [1, 26, TP.strawL], [3, 25, TP.burlapD], [2, 19, TP.strawL], [3, 21, TP.strawL], [1, 22, TP.burlapD], [2, 23, TP.strawL]]) px(bx + dx, dy, c);
      px(s < 0 ? bx - 1 : bx + 5, 19, TP.straw);
      px(s < 0 ? bx - 1 : bx + 5, 22, TP.strawL);
    }
    const sack = (x, y, w, h) => {
      R2(x + 1, y, w - 2, 1, TP.ink);
      R2(x + 1, y + h - 1, w - 2, 1, TP.ink);
      R2(x, y + 1, 1, h - 2, TP.ink);
      R2(x + w - 1, y + 1, 1, h - 2, TP.ink);
      R2(x + 1, y + 1, w - 2, h - 2, TP.burlap);
      R2(x + w - 4, y + 1, 3, h - 2, TP.burlapD);
      R2(x + 1, y + h - 3, w - 2, 2, TP.burlapD);
      R2(x + 1, y + 1, 1, h - 4, TP.burlapL);
      R2(x + 1, y + 1, w - 6, 1, TP.burlapL);
      for (let j = y + 2; j < y + h - 2; j += 3) for (let i = x + 3 + j % 2; i < x + w - 4; i += 4) px(i, j, TP.burlapD);
    };
    sack(9, 17, 20, 24);
    for (let y = 19; y < 36; y++) for (let x = 11; x < 27; x++) {
      const d = Math.hypot(x - 18.5, y - 27);
      if (d > 4 && d < 5.4 || d < 1.9) px(x, y, x + y < 45 ? TP.redL : TP.red);
    }
    for (let x = 10; x < 28; x++) {
      px(x, 36, x & 1 ? TP.woodL : TP.straw);
      px(x, 37, x & 1 ? TP.woodD : TP.wood);
    }
    for (const [x, y, c] of [[11, 41, TP.straw], [12, 42, TP.strawL], [14, 41, TP.strawL], [15, 42, TP.straw], [23, 41, TP.straw], [24, 42, TP.strawL], [26, 41, TP.straw], [13, 43, TP.straw], [25, 43, TP.straw]]) px(x, y, c);
    sack(10, 1, 18, 16);
    for (const ex of [14, 23]) for (let d = -2; d <= 2; d++) {
      px(ex + d, 7 + d, TP.ink);
      px(ex - d, 7 + d, TP.ink);
    }
    for (let x = 14; x < 24; x++) px(x, 12, x & 1 ? TP.ink : TP.burlapD);
    for (const x of [15, 18, 21]) {
      px(x, 11, TP.ink);
      px(x, 13, TP.ink);
    }
    for (let x = 12; x < 26; x++) {
      px(x, 16, x & 1 ? TP.woodL : TP.straw);
      px(x, 17, x & 1 ? TP.wood : TP.woodD);
    }
    for (const [x, y, c] of [[13, 0, TP.straw], [15, 0, TP.strawL], [18, 0, TP.straw], [21, 0, TP.strawL], [24, 0, TP.straw], [9, 4, TP.straw], [28, 6, TP.straw], [8, 7, TP.strawL], [29, 3, TP.strawL]]) px(x, y, c);
  })();
  var SKINS = { flash: [TP.white, 1], char: [hex("#1a0c0e"), 0.72], ice: [hex("#a8e8ff"), 0.72], shadow: [hex("#3a1a70"), 0.5], holy: [hex("#fff4c0"), 0.5], red: [hex("#ff2040"), 0.45], shock: [hex("#8fd6ff"), 0.6], poison: [hex("#58c43a"), 0.5] };
  var STRAW = [TP.strawL, TP.straw, TP.straw, TP.burlapD, TP.burlapD];
  var REST_MASK = new Uint8Array(24 * 38);
  var REST_PX = new Uint32Array(24 * 38);
  HERO2.forEach((row, r) => [...row].forEach((ch, c) => {
    if (ch !== ".") {
      REST_MASK[r * 24 + c] = 1;
      REST_PX[r * 24 + c] = hex(DUMMY_PAL[ch]);
    }
  }));
  var NEAREST = new Int16Array(24 * 38).fill(-1);
  for (let r = 0; r < 38; r++)
    for (let c = 0; c < 24; c++) {
      let best = -1, bd = 1e9;
      for (let y = Math.max(0, r - 7); y < Math.min(38, r + 8); y++)
        for (let x = Math.max(0, c - 7); x < Math.min(24, c + 8); x++) {
          const d = (x - c) * (x - c) + (y - r) * (y - r);
          if (REST_MASK[y * 24 + x] && d < bd) {
            bd = d;
            best = y * 24 + x;
          }
        }
      NEAREST[r * 24 + c] = best;
    }

  // packages/fx/src/vendor/pixelfx/core/poses.js
  var READY = { crouch: 3, fx: 11, fy: -21, bx: 9, by: -21, ffx: 7, fbx: -7 };

  // packages/fx/src/vendor/pixelfx/fx/pickups/collect-burst.js
  var collect_burst_exports = {};
  __export(collect_burst_exports, {
    create: () => create,
    meta: () => meta
  });

  // packages/fx/src/vendor/pixelfx/fx/pickups/_lib.js
  var SHADOW = hex("#100e17");
  var INK3 = hex("#0b0814");
  function glint(p, x, y, arm, c, k = 0.4, tip = scale(c, 0.8)) {
    const n = Math.round(arm), X = Math.floor(x), Y = Math.floor(y);
    if (n < 0) return;
    for (let d = 1; d <= n; d++) {
      const cc = d === n && n > 1 ? tip : c;
      p.px(X + d, Y, cc), p.px(X - d, Y, cc), p.px(X, Y + d, cc), p.px(X, Y - d, cc);
    }
    p.px(X, Y, n > 0 ? WHITE : c);
    p.glow(X + 0.5, Y + 0.5, 3 + n * 2.5, c, k);
  }

  // packages/fx/src/vendor/pixelfx/fx/pickups/collect-burst.js
  var meta = {
    name: "Collect burst",
    desc: "The moment of pickup: a white flash and a cross of light, a thin ring snapping out ahead of a softer one, twinkles thrown wide on curving paths that brake, hang and wink out.",
    tags: ["pickup", "collect", "burst", "sparkle", "reward", "one-shot"],
    size: [112, 108],
    origin: [56, 94],
    duration: 1.35,
    loop: false,
    fps: 30,
    bg: "ground",
    options: { palette: ["#1a0516", "#3d0a33", "#701560", "#b0228f", "#f53cd1", "#ff86e6", "#ffd2f6", "#ffffff"], seed: 3 }
  };
  var CY = -30;
  function create(o) {
    const C = fit(o.palette, 8), R2 = new Rng(o.seed), lights = new Lights();
    lights.add(0, CY, 36, C[5], 0.85, 0.32);
    lights.add(0, CY, 14, WHITE, 0.75, 0.08);
    const stars = Array.from({ length: 14 }, (_, i) => {
      const a = i / 14 * TAU + R2.range(-0.2, 0.2), sp = R2.range(145, 225) * (i % 3 === 0 ? 1.12 : 0.85);
      return { x: 0, y: CY, a, sp, turn: (i % 2 ? 1 : -1) * R2.range(2.5, 5), life: R2.range(0.75, 1.15), age: 0, size: i % 3 === 0 ? 2.6 : R2.range(1.2, 2), tr: [], c: i % 4 === 0 ? WHITE : i % 2 ? C[6] : C[5], ph: R2.range(0, TAU) };
    });
    const motes = Array.from({ length: 7 }, () => ({ x: R2.range(-8, 8), y: CY + R2.range(-4, 6), vy: -R2.range(12, 30), life: R2.range(0.5, 0.9), d: R2.range(0.05, 0.25), w: R2.range(0, TAU) }));
    let t = 0;
    return {
      update(dt) {
        t += dt;
        for (const s of stars) {
          if (s.age > s.life) continue;
          s.age += dt;
          s.tr.unshift([s.x, s.y]);
          if (s.tr.length > 4) s.tr.pop();
          s.a += s.turn * dt * Math.max(0, 1 - s.age * 1.5);
          s.sp -= s.sp * 4.3 * dt;
          s.x += Math.cos(s.a) * s.sp * dt;
          s.y += Math.sin(s.a) * s.sp * dt + 6 * s.age * dt;
          if (s.y > -2) s.y = -2, s.a = -Math.abs(s.a), s.sp *= 0.5;
        }
        lights.update(dt);
      },
      draw(p) {
        if (t < 0.07) p.circle(0, CY, 5.5 * (1 - t / 0.07) + 1, WHITE);
        if (t < 0.16) {
          const k = 1 - t / 0.16, L2 = 26 * ease.outCubic(Math.min(1, t / 0.03 + 0.4)) * k;
          for (const [dx, dy, l] of [[1, 0, 1], [-1, 0, 1], [0, 1, 0.6], [0, -1, 0.6]])
            p.line(0, CY, dx * L2 * l, CY + dy * L2 * l, (u) => u < 0.3 ? WHITE : u < 0.65 ? C[6] : C[5], (u) => (u < 0.5 ? 1 : (1 - u) * 2) * (0.5 + k));
          p.glow(0, CY, 20 * k + 4, C[5], 0.6 * k);
        }
        const u1 = t / 0.32;
        if (u1 < 1) {
          const r = 3 + 23 * ease.outExpo(u1);
          p.ring(0, CY, r, 1, u1 < 0.3 ? WHITE : C[6], 1.3 - u1 * 1.2);
          p.glowRing(0, CY, r, 4, C[5], 0.4 * (1 - u1));
        }
        const u2 = (t - 0.04) / 0.5;
        if (u2 > 0 && u2 < 1) {
          const r = 2 + 16 * ease.outCubic(u2);
          p.ring(0, CY, r, Math.max(1, 2.6 * (1 - u2)), C[5], 1 - u2);
        }
        for (const s of stars) {
          if (s.age > s.life) continue;
          const k = 1 - s.age / s.life, tw = 0.65 + 0.35 * Math.sin(s.age * 26 + s.ph);
          s.tr.forEach(([x, y], i) => i > 0 && p.dot(x, y, i < 2 ? C[5] : C[4], (1 - i / 4) * k * 1.4));
          if (k < 0.3 && Math.sin(s.age * 40 + s.ph) < 0) continue;
          glint(p, s.x, s.y, Math.round(s.size * tw * Math.min(1, k * 2.5)), s.c, 0.45 * k);
        }
        for (const m of motes) {
          const a = t - m.d;
          if (a < 0 || a > m.life) continue;
          const k = 1 - a / m.life, x = m.x + Math.sin(a * 6 + m.w) * 1.5, y = m.y + m.vy * a;
          p.dot(x, y, k > 0.5 ? C[6] : C[5], k * 1.5);
          p.glow(x + 0.5, y + 0.5, 3, C[5], 0.3 * k);
        }
        lights.draw(p);
      }
    };
  }

  // packages/fx/src/vendor/pixelfx/fx/ui/exclamation.js
  var exclamation_exports = {};
  __export(exclamation_exports, {
    act: () => act,
    create: () => create2,
    meta: () => meta2
  });
  var meta2 = {
    name: "Exclamation",
    desc: "A bold ! springs up off the hero's head, stretching as it shoots up and squashing as it lands; surprise ticks flick out, it wobbles, then pops away.",
    tags: ["ui", "alert", "surprise", "emote", "character", "one-shot"],
    size: [84, 104],
    origin: [42, 92],
    duration: 1.4,
    loop: false,
    fps: 30,
    bg: "ground",
    actor: 2,
    options: { palette: ["#2a1405", "#6a2e06", "#b85a0a", "#f08c14", "#ffc23a", "#ffe580", "#fff6c8", "#ffffff"], seed: 3 }
  };
  var STARTLED = { turn: 1, y: -5, crouch: -1, fx: -14, fy: -34, bx: 15, by: -34, ffx: -3, ffy: -6, fbx: 4, fby: -6 };
  var act = {
    poses: [
      [-0.08, READY],
      [0, STARTLED, "snap"],
      [0.14, { ...STARTLED, y: 0, crouch: 4, ffy: -4, fby: -4, fy: -26, by: -26 }, "in"],
      [0.3, { turn: 1, fx: -10, fy: -23, bx: 11, by: -23, ffx: -3, fbx: 4 }],
      [1.1, { turn: 1, fx: -10, fy: -23, bx: 11, by: -23, ffx: -3, fbx: 4 }],
      [1.4, READY]
    ],
    dust: [{ t: 0.14, x: 0, n: 4 }]
  };
  var HEAD = -40;
  var REST = -45;
  var POP = 1.1;
  function bang(p, C, x, y, sx, sy, a, white) {
    const ca = Math.cos(a), sa = Math.sin(a);
    const hw = (V) => 2.3 + (-V - 10) * 0.09;
    const inBar = (U, V) => V > -24 && V < -9.5 && Math.abs(U) < hw(V);
    const inDot = (U, V) => Math.hypot(U, V + 3.6) < 3.3;
    const inside = (U, V) => inBar(U, V) || inDot(U, V);
    p.shade(x - 16, y - 34, x + 16, y + 6, (px, py) => {
      const dx = px - x, dy = py - y, u = (dx * ca + dy * sa) / sx, v = (-dx * sa + dy * ca) / sy, ex = 1 / sx, ey = 1 / sy;
      if (!inside(u, v)) return inside(u - ex, v) || inside(u + ex, v) || inside(u, v - ey) || inside(u, v + ey) ? C[0] : void 0;
      if (white) return WHITE;
      if (inDot(u, v)) return Math.hypot(u + 1.2, v + 4.8) < 1.2 ? WHITE : u + v + 3.6 < -0.5 ? C[6] : u + v + 3.6 < 1.5 ? C[5] : C[4];
      const w = hw(v), q = (u + w) / (2 * w);
      if (q < 0.28) return v < -20 ? WHITE : C[7];
      if (q > 0.74) return C[4];
      return v < -18 ? C[6] : v < -13 ? C[5] : C[5];
    });
  }
  function create2(o) {
    const C = fit(o.palette, 8), R2 = new Rng(o.seed);
    const ps = new Particles({ rng: R2, sparks: [C[7], C[6], C[5], C[3]] }), lights = new Lights();
    const m = { y: HEAD, vy: -420, sq: 0, landed: false };
    let t = 0, popped = false, sprung = false;
    const end = meta2.duration - 0.05;
    return {
      update(dt) {
        t += dt;
        if (t < POP) {
          m.vy += (-(m.y - REST) * 900 - m.vy * 14) * dt;
          m.y += m.vy * dt;
          if (!m.landed && m.vy > 0) m.landed = true, m.sq = 1;
        }
        m.sq = Math.max(0, m.sq - dt / 0.12);
        if (!sprung && t >= 0.04) {
          sprung = true;
          lights.add(0, HEAD - 4, 26, C[5], 0.6, 0.25);
          for (let i = 0; i < 8; i++) {
            const an = -Math.PI / 2 + R2.range(-1.3, 1.3), sp = R2.range(40, 90);
            ps.spawn(P.STAR, R2.range(-4, 4), HEAD - 2, Math.cos(an) * sp, Math.sin(an) * sp, R2.range(0.2, 0.4), R2.pick([C[7], C[6], C[5]]), i % 3 ? 0.6 : 1.3);
          }
        }
        if (!popped && t >= POP + 0.05) {
          popped = true;
          lights.add(0, REST - 13, 28, C[5], 0.5, 0.2);
          for (let i = 0; i < 7; i++) {
            const an = i / 7 * TAU + R2.range(-0.2, 0.2), sp = R2.range(30, 60);
            ps.spawn(P.STAR, Math.cos(an) * 5, REST - 13 + Math.sin(an) * 9, Math.cos(an) * sp, Math.sin(an) * sp, Math.min(R2.range(0.2, 0.35), end - t), R2.pick([C[7], C[6], C[5]]), i % 3 ? 0.6 : 1.4);
          }
        }
        ps.update(dt);
        lights.update(dt);
      },
      draw(p) {
        const k = t;
        for (const [t0, len2] of [[0.04, 6], [0.48, 4.5]]) {
          const u = (k - t0) / 0.24;
          if (u <= 0 || u >= 1) continue;
          for (const s of [-1, 1])
            for (let i = 0; i < 3; i++) {
              const an = -Math.PI / 2 + s * (0.55 + i * 0.42), r0 = 14 + 7 * ease.outCubic(u), L2 = len2 * Math.sin(u * Math.PI) * (i === 1 ? 1 : 0.75);
              const cx = 0, cy = REST - 13, ca = Math.cos(an), sa = Math.sin(an);
              if (L2 < 0.8) continue;
              p.line(cx + ca * r0, cy + sa * r0, cx + ca * (r0 + L2), cy + sa * (r0 + L2), (q) => q < 0.5 ? WHITE : C[5]);
            }
        }
        const pu = (k - POP) / 0.06;
        if (pu < 1) {
          const speed = Math.min(1, Math.abs(m.vy) / 420), up = m.vy < 0 ? speed : 0;
          let sx = 1 - 0.3 * up + 0.3 * m.sq, sy = 1 + 0.45 * up - 0.28 * m.sq;
          if (k < 0.05) sx *= k / 0.05, sy *= k / 0.05;
          if (pu > 0) sx = sy = 1 + 0.3 * pu;
          const wob = 0.28 * Math.exp(-k * 4) * Math.sin(k * 26), white = k < 0.06 || pu > 0;
          if (sx > 0.1) bang(p, C, 0, m.y, sx, sy, wob, white);
          p.glow(0, m.y - 13, 20, C[5], 0.35 + (white ? 0.3 : 0));
          if (k > 0.6 && k < 0.85) sparkle(p, -3, m.y - 22, 3.5 * Math.sin((k - 0.6) / 0.25 * Math.PI), C[7], C[6], 0.4);
        }
        ps.draw(p);
        lights.draw(p);
      }
    };
  }

  // packages/fx/src/vendor/pixelfx/fx/ui/quest-complete.js
  var quest_complete_exports = {};
  __export(quest_complete_exports, {
    create: () => create3,
    meta: () => meta3
  });

  // packages/fx/src/vendor/pixelfx/fx/ui/_lib.js
  function spell(str, font = "big") {
    const F = FONTS[font], letters = [];
    let x = 0;
    for (const ch of String(str)) {
      const g = F.glyphs[ch] ?? F.glyphs[ch.toUpperCase()] ?? null;
      const w = g ? g.w : F.space;
      letters.push({ ch, g, x, w, h: F.h });
      x += w + F.gap;
    }
    return { letters, w: Math.max(0, x - F.gap), h: F.h };
  }
  var ids = new Int16Array(4096);
  var edges = new Uint8Array(4096);
  function drawWord(p, items, st) {
    if (!items.length) return;
    let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity;
    for (const it of items) {
      const h = it.g.rows.length * it.sy, w = it.g.w * it.sx, sl = Math.abs(it.slant ?? 0) * it.g.rows.length;
      x0 = Math.min(x0, it.x - sl);
      x1 = Math.max(x1, it.x + w + sl);
      y0 = Math.min(y0, it.y);
      y1 = Math.max(y1, it.y + h);
    }
    const ow = st.ow ?? 1;
    x0 = Math.floor(x0) - 1 - ow;
    y0 = Math.floor(y0) - 1 - ow;
    x1 = Math.ceil(x1) + 2 + ow;
    y1 = Math.ceil(y1) + 3 + ow;
    const W2 = x1 - x0, H2 = y1 - y0;
    if (W2 * H2 > ids.length) ids = new Int16Array(W2 * H2 * 2), edges = new Uint8Array(W2 * H2 * 2);
    ids.fill(0, 0, W2 * H2);
    items.forEach((it, k) => {
      const g = it.g, gh = g.rows.length, h = gh * it.sy, bot = it.y + h, sl = it.slant ?? 0;
      for (let py = Math.floor(it.y); py < Math.ceil(bot); py++) {
        const gy = Math.floor((py + 0.5 - it.y) / it.sy);
        if (gy < 0 || gy >= gh) continue;
        const shift = Math.round((bot - py - 0.5) / it.sy * sl);
        const ry = py + 0.5 - it.y - gy * it.sy, row = g.rows[gy];
        for (let px = Math.floor(it.x + shift) - 1; px <= Math.ceil(it.x + shift + g.w * it.sx); px++) {
          const fx = px + 0.5 - it.x - shift, gx = Math.floor(fx / it.sx);
          if (gx < 0 || gx >= g.w || !row[gx]) continue;
          const i = (py - y0) * W2 + (px - x0);
          if (i < 0 || i >= W2 * H2) continue;
          ids[i] = k + 1;
          const rx = fx - gx * it.sx, up = gy > 0 ? g.rows[gy - 1] : null, dn = gy < gh - 1 ? g.rows[gy + 1] : null;
          const open = (r) => !r || !r[gx] && !r[gx - 1] && !r[gx + 1];
          edges[i] = (ry < 1 && open(up) ? 1 : 0) | (ry >= it.sy - 1 && open(dn) ? 2 : 0) | (rx < 1 && !(gx > 0 && row[gx - 1]) ? 4 : 0);
        }
      }
    });
    const at = (x, y) => x < x0 || y < y0 || x >= x1 || y >= y1 ? 0 : ids[(y - y0) * W2 + (x - x0)];
    const F = st.fill, nF = F.length, shine = st.shine, glint3 = st.glint ?? WHITE, sy0 = st.shineY ?? y0;
    for (let y = y0; y < y1; y++)
      for (let x = x0; x < x1; x++) {
        const id = at(x, y);
        if (id) {
          const it = items[id - 1], v = (y + 0.5 - it.y) / (it.g.rows.length * it.sy);
          let i = Math.min(nF - 1, Math.max(0, Math.floor((1 - v) * nF)));
          let c = F[i];
          const e = edges[(y - y0) * W2 + (x - x0)];
          if (e & 1) c = st.edge ?? F[nF - 1];
          else if (e & 2) c = st.under ?? F[0];
          else if (e & 4 && i < nF - 1) c = F[i + 1];
          if (shine !== void 0 && shine !== null) {
            const d = Math.abs(x + 0.5 - (y + 0.5 - sy0) * 0.6 - shine);
            if (d < 1.1) c = WHITE;
            else if (d < 2.4) c = glint3;
          }
          if (it.flash > 0.6 || it.flash > 0.25 && v < 0.5) c = WHITE;
          p.dot(x, y, c, it.a ?? 1);
          continue;
        }
        let n = 0;
        for (let dy = -ow; dy <= ow && !n; dy++) for (let dx = -ow; dx <= ow && !n; dx++) if (ow < 2 || Math.abs(dx) + Math.abs(dy) < 4) n = at(x + dx, y + dy);
        if (n) {
          p.dot(x, y, st.outline, items[n - 1].a ?? 1);
          continue;
        }
        const s = at(x - ow, y - 1 - ow) || at(x + 1 - ow, y - 1 - ow) || at(x - ow, y - ow);
        if (s && st.shadow) p.dot(x, y, st.shadow, (items[s - 1].a ?? 1) * 0.9);
      }
  }
  function shake(t, amp, t0 = 0, len2 = 0.3, seed = 1, hz = 32) {
    if (t < t0 || t > t0 + len2) return [0, 0];
    const k = 1 - (t - t0) / len2;
    return [Math.round(noise(t * hz, seed) * amp * k * 1.7), Math.round(noise(t * hz, seed + 7) * amp * k * 1.3)];
  }

  // packages/fx/src/vendor/pixelfx/fx/ui/quest-complete.js
  var meta3 = {
    name: "Quest complete",
    desc: "A stitched ribbon unrolls from the middle, QUEST COMPLETE types on letter by letter, a gold seal stamps down and ticks, stars pop; then it all rolls away.",
    tags: ["ui", "quest", "banner", "reward", "text", "one-shot"],
    size: [204, 92],
    origin: [102, 46],
    duration: 2.6,
    loop: false,
    fps: 30,
    bg: "dark",
    options: {
      palette: ["#2a1405", "#5c3008", "#9a5a0e", "#d48e18", "#f5b92c", "#ffde5e", "#fff4bc", "#ffffff"],
      ribbon: ["#1e0608", "#45101a", "#7a1a26", "#ad2632", "#d8433f", "#f27a5e", "#ffb79a"],
      text: "QUEST COMPLETE",
      seed: 8
    }
  };
  var L = 66;
  var BH2 = 8;
  var OPEN = 0.32;
  var TYPE = 0.2;
  var STEP = 0.036;
  var STAMP = 0.95;
  var SX = 64;
  var SY = 4;
  var POPSEAL = 2;
  var ROLL = 2.08;
  function ribbon(p, Rb, G2, l, tails, t) {
    if (l < 1) return;
    if (tails > 0.02)
      for (const s of [-1, 1]) {
        const drop = 6 * tails, x0 = s * (l - 8), x1 = s * (l + 16 * tails);
        p.shade(Math.min(x0, x1) - 1, -BH2 + drop - 1, Math.max(x0, x1) + 1, BH2 + drop + 1, (x, y) => {
          const u = (x - x0) / (x1 - x0), v = y - drop;
          if (u < 0 || u > 1 || Math.abs(v) > BH2) return;
          if (u > 1 - 0.3 * (BH2 - Math.abs(v)) / BH2) return;
          const e = Math.min(BH2 - Math.abs(v), (1 - u) * (x1 - x0) * s);
          if (e < 1 || u < 0.02) return Rb[0];
          return v < -BH2 + 2 ? Rb[3] : v < 0 ? Rb[2] : Rb[1];
        });
        p.tri(s * (l - 8), BH2, s * (l - 1), BH2, s * (l - 8), BH2 + drop, Rb[0]);
      }
    p.shade(-l - 1, -BH2 - 1, l + 1, BH2 + 1, (x, y) => {
      const ax = Math.abs(x), v = y;
      if (ax > l || Math.abs(v) > BH2) return;
      const e = Math.min(l - ax, BH2 - Math.abs(v));
      if (e < 1) return Rb[0];
      if (v < -BH2 + 2) return Rb[5];
      if (v > BH2 - 2) return Rb[1];
      if ((Math.abs(v + BH2 - 2.5) < 0.5 || Math.abs(v - BH2 + 3.5) < 0.5) && Math.floor(x + 0.5) % 3 !== 0 && ax < l - 3) return G2[3];
      return v < -1 ? Rb[4] : Rb[3];
    });
    if (tails < 0.02)
      for (const s of [-1, 1]) {
        const x = s * l;
        p.rect(Math.round(x) - 2, -BH2 - 2, 4, BH2 * 2 + 4, Rb[0]);
        p.rect(Math.round(x) - 1, -BH2 - 1, 1, BH2 * 2 + 2, Rb[4]);
        p.rect(Math.round(x), -BH2 - 1, 1, BH2 * 2 + 2, Rb[2]);
        p.px(Math.round(x) - 1, -BH2 - 1, Rb[6]);
      }
  }
  function seal(p, G2, x, y, r, sx, sy, white, k) {
    const M2 = r * 1.25 + 2;
    p.shade(x - M2 * sx, y - M2 * sy, x + M2 * sx, y + M2 * sy, (px, py) => {
      const dx = (px - x) / sx, dy = (py - y) / sy, d = Math.hypot(dx, dy), an = Math.atan2(dy, dx), edge = r * (1 + 0.09 * Math.cos(an * 14));
      if (d > edge) return;
      if (white) return edge - d < 1 ? G2[5] : WHITE;
      if (edge - d < 1) return G2[0];
      const l = -(dx * 0.6 + dy * 0.8) / r;
      if (edge - d < 3) return l > 0.3 ? G2[6] : l > -0.3 ? G2[5] : G2[3];
      if (Math.abs(d - r * 0.66) < 0.5) return l > 0 ? G2[3] : G2[2];
      return l > 0.45 ? G2[7] : l > 0.1 ? G2[6] : l > -0.35 ? G2[5] : G2[4];
    });
    if (white || k <= 0) return;
    const pts = [[-5, 0], [-1.5, 3.5], [5.5, -4.5]].map(([a, b]) => [x + a * sx, y + b * sy]);
    const len1 = Math.hypot(pts[1][0] - pts[0][0], pts[1][1] - pts[0][1]), len2 = Math.hypot(pts[2][0] - pts[1][0], pts[2][1] - pts[1][1]);
    const done = k * (len1 + len2), segs = [[pts[0], pts[1], Math.min(1, done / len1)], [pts[1], pts[2], clamp((done - len1) / len2)]];
    for (const [w, c] of [[4.2, G2[0]], [2.4, WHITE]])
      for (const [a, b, u] of segs) if (u > 0) p.beam(a[0], a[1], a[0] + (b[0] - a[0]) * u, a[1] + (b[1] - a[1]) * u, w, c);
  }
  function create3(o) {
    const G2 = fit(o.palette, 8), Rb = fit(o.ribbon, 7), R2 = new Rng(o.seed);
    const ps = new Particles({ rng: R2, sparks: [G2[7], G2[6], G2[5], G2[3]] }), lights = new Lights();
    const word = spell(o.text, "mini"), TS = 2, TW2 = word.w * TS, TX = -TW2 / 2 - 4, TY = -5;
    const glyphs = word.letters.filter((Lt) => Lt.g);
    const sats = Array.from({ length: 7 }, (_, i) => ({ x: (i / 6 - 0.5) * 140 + R2.range(-6, 6), y: (i % 2 ? 1 : -1) * R2.range(15, 22), t0: STAMP + 0.12 + i * 0.12 + R2.range(0, 0.04), dur: R2.range(0.3, 0.45), L: R2.range(3, 6) }));
    let t = 0, stamped = false, popped = false;
    const end = meta3.duration - 0.05;
    return {
      update(dt) {
        t += dt;
        if (!stamped && t >= STAMP) {
          stamped = true;
          lights.add(SX, SY, 40, G2[5], 0.7, 0.35);
          lights.add(SX, SY, 18, WHITE, 0.7, 0.1);
          for (let i = 0; i < 12; i++) {
            const an = i / 12 * TAU + R2.range(-0.2, 0.2), sp = R2.range(40, 80) * (Math.cos(an) > 0 ? 0.6 : 1);
            ps.spawn(P.STAR, SX + Math.cos(an) * 11, SY + Math.sin(an) * 11, Math.cos(an) * sp, Math.sin(an) * sp * 0.7, R2.range(0.25, 0.45), R2.pick([G2[7], G2[6], G2[5]]), i % 3 ? 0.6 : R2.range(1.2, 1.8));
          }
        }
        if (t > STAMP && t < POPSEAL && R2.chance(0.08)) ps.spawn(P.STAR, R2.range(-L, L), R2.range(-BH2, BH2), R2.range(-5, 5), -R2.range(8, 20), Math.min(R2.range(0.4, 0.8), end - t), R2.pick([G2[6], G2[5]]), 0.6);
        if (!popped && t >= POPSEAL + 0.05) {
          popped = true;
          lights.add(SX, SY, 30, G2[6], 0.6, 0.2);
          for (let i = 0; i < 8; i++) {
            const an = R2.range(0, TAU), sp = R2.range(40, 90);
            ps.spawn(P.STAR, SX + Math.cos(an) * 6, SY + Math.sin(an) * 6, Math.cos(an) * sp, Math.sin(an) * sp, Math.min(R2.range(0.25, 0.4), end - t), R2.pick([G2[7], G2[6]]), i % 2 ? 0.6 : 1.5);
          }
        }
        ps.update(dt);
        lights.update(dt);
      },
      draw(p) {
        const [jx, jy] = shake(t, 2, STAMP, 0.18, o.seed);
        const l = L * (t < ROLL ? ease.outCubic(seg(t, 0, OPEN)) : 1 - ease.inCubic(seg(t, ROLL, ROLL + 0.26)));
        const tails = seg(t, OPEN - 0.02, OPEN + 0.12) * (t < ROLL ? 1 : 0);
        const sh = seg(t, 1.2, 1.5), shine = sh > 0 && sh < 1 ? -L - 10 + (2 * L + 20) * sh : null;
        ribbon(p, Rb, G2, l, ease.outBack(tails, 2), t);
        if (shine !== null)
          for (let y = -BH2 + 1; y < BH2; y++) {
            const x = shine + (y + BH2) * 0.6;
            if (Math.abs(x) < l - 2) p.px(x, y, Rb[6]), p.px(x + 1, y, Rb[5]);
          }
        const items = [];
        glyphs.forEach((Lt, i) => {
          const u = t - (TYPE + i * STEP), x = TX + Lt.x * TS + jx;
          if (u < 0 || Math.abs(x + Lt.w) > l - 3) return;
          const s = u < 0.035 ? 2.6 : TS;
          items.push({ g: Lt.g, x: x - (s - TS) * Lt.w / 2, y: TY + jy - (s - TS) * 5 / 2, sx: s, sy: s, flash: u < 0.07 ? 1 : 0 });
        });
        drawWord(p, items, { fill: [G2[4], G2[5], G2[6], G2[7]], edge: WHITE, under: G2[3], outline: Rb[0], shadow: Rb[1] });
        const dk = seg(t, STAMP - 0.12, STAMP), pk = t - POPSEAL;
        if (dk > 0 && pk < 0.08) {
          const fall = 1 - ease.inQuad(dk), sq = Math.exp(-(t - STAMP) * 30) * (t >= STAMP ? 1 : 0);
          let s = 1 + 0.8 * fall, sx = s * (1 + 0.2 * sq), sy = s * (1 - 0.2 * sq);
          if (pk > 0) sx = sy = 1 + 0.3 * (pk / 0.08);
          const white = t >= STAMP && t < STAMP + 0.05 || pk > 0;
          if (dk < 1) p.ellipse(SX, SY + 12, 10 * (1 - 0.3 * fall), 2, Rb[0], 0.5 * dk);
          seal(p, G2, SX + jx, SY - 14 * fall + jy, 11, sx, sy, white, seg(t, STAMP + 0.08, STAMP + 0.24));
          p.glow(SX, SY, 22, G2[5], 0.3 + (white ? 0.4 : 0));
        }
        const rk = (t - STAMP) / 0.3;
        const rr = 12 + 13 * ease.outCubic(rk);
        if (rk > 0 && rk < 1) p.ellipse(SX, SY, rr * 1.15, rr, rk < 0.3 ? WHITE : G2[5], (d) => d > 1 - 1.4 / rr ? 1.2 - rk : 0);
        for (const s of sats) {
          const u = (t - s.t0) / s.dur;
          if (u > 0 && u < 1) sparkle(p, s.x, s.y, s.L * Math.pow(Math.sin(u * Math.PI), 0.7), G2[6], G2[5], 0.5);
        }
        ps.draw(p);
        p.glow(0, 0, 76, G2[4], 0.2 * seg(t, 0.2, 0.5) * (1 - seg(t, ROLL, ROLL + 0.2)));
        lights.draw(p);
      }
    };
  }

  // packages/fx/src/vendor/pixelfx/fx/ui/countdown.js
  var countdown_exports = {};
  __export(countdown_exports, {
    create: () => create4,
    meta: () => meta4
  });
  var meta4 = {
    name: "Countdown",
    desc: "3, 2, 1 slam into a timer ring that drains like a burning fuse, throwing sparks; then GO! bursts out as the ring blows into a shockwave with rays.",
    tags: ["ui", "countdown", "start", "timer", "text", "one-shot"],
    size: [152, 136],
    origin: [76, 68],
    duration: 3.1,
    loop: false,
    fps: 30,
    bg: "dark",
    options: {
      palette: ["#0a1030", "#142a66", "#1f4fae", "#2f86e6", "#5cc4ff", "#a8e8ff", "#e6fbff", "#ffffff"],
      go: ["#0b2410", "#16501c", "#22882a", "#3cc23a", "#7ee84c", "#c4ff8a", "#f0ffd6", "#ffffff"],
      from: 3,
      word: "GO!",
      seed: 5
    }
  };
  var STEP2 = 0.62;
  var R = 30;
  var TOP = -Math.PI / 2;
  function timer(p, C, x, y, f, flash2, t) {
    p.ring(x, y, R + 4, 8, (v) => v < 0.13 || v > 0.87 ? C[0] : C[1]);
    for (let j = 0; j < 40; j++) {
      const an = j / 40 * TAU + t * 0.6;
      p.dot(x + Math.cos(an) * (R - 6), y + Math.sin(an) * (R - 6), j % 5 ? C[2] : C[4], 1);
    }
    const head = TOP + TAU * (1 - f);
    for (let i = 0; i < 12; i++) {
      const an = TOP + i * TAU / 12, lit = an >= head - 1e-6 || f >= 0.999, near = Math.abs(an - head) < 0.2 && f < 0.999;
      const ca = Math.cos(an), sa = Math.sin(an);
      p.line(x + ca * (R + 6), y + sa * (R + 6), x + ca * (R + 8), y + sa * (R + 8), flash2 || near ? WHITE : lit ? C[5] : C[2]);
    }
    if (f <= 2e-3) return head;
    p.arc(x, y, R + 2, 5, head, TOP + TAU, (u, v) => {
      const d = u * TAU * f;
      if (flash2 || d < 0.1) return WHITE;
      if (d < 0.32) return v > 0.5 ? WHITE : C[6];
      return v > 0.75 ? C[6] : v > 0.4 ? C[5] : v > 0.15 ? C[4] : C[3];
    });
    for (let an = head + 0.25; an < TOP + TAU; an += 0.55) p.glow(x + Math.cos(an) * (R - 0.5), y + Math.sin(an) * (R - 0.5), 9, C[4], 0.12);
    const hx = x + Math.cos(head) * (R - 0.5), hy = y + Math.sin(head) * (R - 0.5);
    p.glow(hx, hy, 14, C[5], 0.5);
    if (!flash2) sparkle(p, hx, hy, 2 + 1.5 * (0.5 + 0.5 * Math.sin(t * 40)), C[6], C[5], 0.4);
    return head;
  }
  function create4(o) {
    const C = fit(o.palette, 8), G2 = fit(o.go, 8), Rg = new Rng(o.seed), n = clamp(Math.round(o.from), 1, 3);
    const ps = new Particles({ rng: Rg, sparks: [C[7], C[6], C[5], C[3]] }), gs = new Particles({ rng: Rg, sparks: [G2[7], G2[6], G2[5], G2[3]] });
    const lights = new Lights(), GO = n * STEP2, OUT2 = GO + 0.78, end = meta4.duration - 0.05;
    const digits = Array.from({ length: n }, (_, i) => spell(String(n - i))), word = spell(o.word);
    const rays = Array.from({ length: 18 }, (_, i) => ({ a: i / 18 * TAU + Rg.range(-0.06, 0.06), L: i % 2 ? Rg.range(10, 16) : Rg.range(22, 30) }));
    const sizeAt = (u, base, big) => base + big * Math.exp(-u * 26) * Math.cos(u * 38);
    const reach = (v, d) => v <= d * 2.2 ? 9 : -Math.log(1 - d * 2.2 / v) / 2.2;
    let t = 0, beat = -1, went = false, popped = false;
    return {
      update(dt) {
        t += dt;
        const i = Math.floor(t / STEP2);
        if (t < GO && i !== beat) {
          beat = i;
          lights.add(0, 0, 54, C[5], 0.6, 0.35);
          for (let j = 0; j < 14; j++) {
            const an = j / 14 * TAU + Rg.range(-0.1, 0.1), sp = Rg.range(90, 200);
            ps.spawn(P.SPARK, Math.cos(an) * (R + 2), Math.sin(an) * (R + 2), Math.cos(an) * sp, Math.sin(an) * sp, Math.min(Rg.range(0.12, 0.3), reach(sp, 26)));
          }
        }
        if (t < GO) {
          const k = t % STEP2 / STEP2, f = 1 - seg(k, 0.06, 0.97), head = TOP + TAU * (1 - f);
          if (f > 0.01 && f < 0.99 && Rg.chance(0.7)) {
            const hx = Math.cos(head) * R, hy = Math.sin(head) * R, tx = -Math.sin(head), ty = Math.cos(head), out = Rg.range(-0.4, 1), sp = Rg.range(60, 150);
            ps.spawn(P.SPARK, hx, hy, (-tx * 0.8 + Math.cos(head) * out) * sp, (-ty * 0.8 + Math.sin(head) * out) * sp - 20, Rg.range(0.12, 0.28));
            if (Rg.chance(0.15)) ps.spawn(P.EMBER, hx, hy, Math.cos(head) * Rg.range(5, 20), Math.sin(head) * Rg.range(5, 20), Rg.range(0.4, 0.8), C[5], 1);
          }
        }
        if (!went && t >= GO) {
          went = true;
          lights.add(0, 0, 70, WHITE, 0.9, 0.18);
          lights.add(0, 0, 64, G2[5], 0.7, 0.8);
          for (let j = 0; j < 36; j++) {
            const an = Rg.range(0, TAU), sp = Rg.range(120, 300);
            gs.spawn(P.SPARK, Math.cos(an) * R, Math.sin(an) * R, Math.cos(an) * sp, Math.sin(an) * sp - 40, Math.min(Rg.range(0.18, 0.36), reach(sp, 24)));
          }
          for (let j = 0; j < 18; j++) {
            const an = Rg.range(0, TAU), sp = Rg.range(30, 80), r = Rg.range(10, 28);
            gs.spawn(P.STAR, Math.cos(an) * r, Math.sin(an) * r, Math.cos(an) * sp, Math.sin(an) * sp - 10, Rg.range(0.5, 1), Rg.pick([G2[7], G2[6], G2[5]]), Rg.chance(0.4) ? Rg.range(1.5, 2.5) : 0.6);
          }
        }
        if (t > GO + 0.2 && t < OUT2 - 0.1 && Rg.chance(0.12)) {
          const an = Rg.range(0, TAU), r = Rg.range(30, 46);
          gs.spawn(P.STAR, Math.cos(an) * r, Math.sin(an) * r * 0.8, 0, -Rg.range(4, 12), Rg.range(0.3, 0.6), Rg.pick([G2[7], G2[6]]), Rg.chance(0.3) ? 1.6 : 0.6);
        }
        if (!popped && t >= OUT2 + 0.05) {
          popped = true;
          lights.add(0, 0, 40, G2[6], 0.6, 0.25);
          for (let j = 0; j < 14; j++) {
            const an = j / 14 * TAU + Rg.range(-0.15, 0.15), sp = Rg.range(60, 130);
            gs.spawn(P.STAR, Math.cos(an) * 12, Math.sin(an) * 8, Math.cos(an) * sp, Math.sin(an) * sp * 0.8 - 10, Math.min(Rg.range(0.3, 0.45), end - t), Rg.pick([G2[7], G2[6], G2[5]]), j % 3 ? 0.6 : Rg.range(1.3, 2));
          }
        }
        ps.update(dt);
        gs.update(dt);
        lights.update(dt);
      },
      draw(p) {
        if (t < GO) {
          const i = Math.floor(t / STEP2), u = t - i * STEP2, k = u / STEP2;
          const [sx, sy] = shake(t, 3, i * STEP2, 0.22, o.seed + i);
          const f = 1 - seg(k, 0.06, 0.97), flash2 = u < 0.07;
          const rk = u / 0.3;
          if (rk < 1) p.ring(sx, sy, R + 6 + 22 * ease.outCubic(rk), 1.5 * (1 - rk) + 1, rk < 0.3 ? WHITE : C[5], 1.3 * (1 - rk));
          timer(p, C, sx, sy, f, flash2, t);
          if (u < 0.035) p.circle(sx, sy, R - 3, WHITE);
          else if (u < 0.07) p.ring(sx, sy, R - 3, 3, C[6]);
          const s = sizeAt(u, 5, 2), d = digits[i], W2 = d.w * s, H2 = 7 * s, x0 = sx - W2 / 2, y0 = sy - H2 / 2;
          const items = d.letters.filter((L2) => L2.g).map((L2) => ({ g: L2.g, x: x0 + L2.x * s, y: y0, sx: s, sy: s, flash: u < 0.035 ? 1 : u < 0.07 ? 0.4 : 0 }));
          drawWord(p, items, { fill: [C[4], C[5], C[6], C[7]], edge: WHITE, under: C[3], outline: C[0], ow: 2, shadow: scale(C[0], 0.5) });
          p.glow(sx, sy, 30, C[4], 0.22 + (u < 0.12 ? 0.6 * (1 - u / 0.12) : 0));
          p.glow(sx, sy, R + 8, C[3], 0.2 * (1 - k) + 0.08);
        } else {
          const u = t - GO, [sx, sy] = shake(t, 4, GO, 0.3, o.seed + 9);
          const bk = u / 0.4;
          if (bk < 1) {
            const r = R + 4 + 30 * ease.outCubic(bk), w = Math.max(1, 7 * (1 - bk));
            p.ring(0, 0, r, w, (v) => bk < 0.2 || v > 0.6 ? WHITE : G2[6], 1.4 * (1 - bk));
            p.glowRing(0, 0, r - w / 2, 8, G2[5], 0.5 * (1 - bk));
          }
          const ik2 = (u - 0.05) / 0.3;
          if (ik2 > 0 && ik2 < 1) p.ring(0, 0, R + 22 * ease.outCubic(ik2), 1, G2[5], 1.2 * (1 - ik2));
          const rk = ease.outExpo(clamp(u / 0.18)) * (1 - ease.inQuad(seg(t, OUT2 - 0.25, OUT2 + 0.05)));
          for (const ry of rays) {
            if (rk <= 0.02) break;
            const an = ry.a + u * 0.35, ca = Math.cos(an), sa = Math.sin(an), r0 = 1 / Math.sqrt((ca / 40) ** 2 + (sa / 23) ** 2) + 3 * rk, r1 = r0 + ry.L * 0.7 * rk;
            p.line(ca * r0, sa * r0, ca * r1, sa * r1, (q) => q < 0.3 ? WHITE : q < 0.65 ? G2[6] : G2[5], (q) => q < 0.6 ? 1.3 : 1.3 * (1 - q) / 0.4);
          }
          const pu = (t - OUT2) / 0.06;
          if (pu < 1) {
            let s = sizeAt(u, 5, 3.5), flash2 = u < 0.035 ? 1 : u < 0.07 ? 0.4 : 0;
            const throb = Math.max(0, Math.sin((u - 0.25) * 9)) * smooth(0.25, 0.35, u);
            if (pu > 0) s = 5 * (1 + 0.25 * pu), flash2 = 1;
            const W2 = word.w * s, H2 = 7 * s, x0 = sx - W2 / 2, y0 = sy - H2 / 2;
            const items = word.letters.filter((L2) => L2.g).map((L2) => ({ g: L2.g, x: x0 + L2.x * s, y: y0, sx: s, sy: s, slant: 1, flash: flash2 }));
            const sh = seg(u, 0.32, 0.56), shine = sh > 0 && sh < 1 ? x0 - 8 + (W2 + 22) * ease.inOutSine(sh) : null;
            drawWord(p, items, { fill: [G2[4], G2[5], G2[6], G2[7]], edge: WHITE, under: G2[3], outline: G2[0], ow: 2, shadow: scale(G2[0], 0.5), shine, shineY: y0, glint: G2[6] });
            p.glow(sx, sy, 46, G2[5], 0.25 + 0.15 * throb + (u < 0.12 ? 0.7 * (1 - u / 0.12) : 0));
          } else {
            const k = (t - OUT2 - 0.06) / 0.22;
            if (k > 0 && k < 1) p.ring(0, 0, 8 + 26 * ease.outCubic(k), 1, k < 0.4 ? WHITE : G2[6], 1.3 * (1 - k));
          }
        }
        ps.draw(p);
        gs.draw(p);
        lights.draw(p);
      }
    };
  }

  // packages/fx/src/vendor/pixelfx/fx/lightning/zap-hit.js
  var zap_hit_exports = {};
  __export(zap_hit_exports, {
    create: () => create5,
    meta: () => meta5
  });

  // packages/fx/src/vendor/pixelfx/fx/lightning/_lib.js
  var VOLT = ["#120a33", "#2a1b78", "#4630c0", "#5a62f0", "#58a6ff", "#9ed8ff", "#e4f6ff", "#ffffff"];
  var PLASMA = ["#ffffff", "#c8f8ff", "#7ff3ff", "#1ab8e6"];
  var SOOT = hex("#110c16");
  var SOOT2 = hex("#1c1522");
  function zigzag(R2, x0, y0, x1, y1, jag = 0.32, forks2 = 0.35, w = 1, depth = 0) {
    const out = { paths: [] }, L2 = Math.hypot(x1 - x0, y1 - y0);
    let pts = [[x0, y0], [x1, y1]], off = L2 * jag;
    while (pts.length < 2 + L2 / 3) {
      const nxt = [pts[0]];
      for (let i = 0; i < pts.length - 1; i++) {
        const [ax, ay] = pts[i], [bx, by] = pts[i + 1], l = Math.hypot(bx - ax, by - ay) || 1, o = R2.range(-off, off);
        nxt.push([(ax + bx) / 2 + -(by - ay) / l * o, (ay + by) / 2 + (bx - ax) / l * o], [bx, by]);
      }
      pts = nxt;
      off *= 0.52;
    }
    out.paths.push({ pts, w });
    if (depth < 2) {
      for (let i = 2; i < pts.length - 3; i++)
        if (R2.chance(forks2 / (1 + depth) / Math.max(4, pts.length / 6))) {
          const [ax, ay] = pts[i], [bx, by] = pts[Math.min(pts.length - 1, i + 3)];
          const a = Math.atan2(by - ay, bx - ax) + R2.sign() * R2.range(0.35, 0.9), l = (L2 - i / pts.length * L2) * R2.range(0.25, 0.55);
          out.paths.push(...zigzag(R2, ax, ay, ax + Math.cos(a) * l, ay + Math.sin(a) * l, jag * 1.1, forks2, w * 0.55, depth + 1).paths);
        }
    }
    return out;
  }
  var N = 1024;
  var HALF = 512;
  var GRID = new Uint8Array(N * N);
  var HIT = [];
  function mark(x, y, lvl) {
    const X = Math.floor(x) + HALF, Y = Math.floor(y) + HALF;
    if (X < 0 || Y < 0 || X >= N || Y >= N) return;
    const i = Y * N + X, v = GRID[i];
    if (!v) HIT.push(i);
    if (lvl > v) GRID[i] = lvl;
  }
  function stamp(x, y, r, lvl) {
    if (r <= 0.5) return mark(Math.round(x), Math.round(y), lvl);
    const r2 = r * r;
    for (let py = Math.floor(y - r); py <= Math.ceil(y + r); py++) {
      const dy = py + 0.5 - y;
      for (let px = Math.floor(x - r); px <= Math.ceil(x + r); px++) {
        const dx = px + 0.5 - x;
        if (dx * dx + dy * dy <= r2) mark(px, py, lvl);
      }
    }
  }
  function flush(p, cols, alphas) {
    for (const i of HIT) {
      const v = GRID[i];
      GRID[i] = 0;
      const x = i % N - HALF, y = (i / N | 0) - HALF, a = alphas ? alphas[v - 1] : 1;
      if (a >= 1) p.px(x, y, cols[v - 1]);
      else if (a > 0) p.dot(x, y, cols[v - 1], a);
    }
    HIT.length = 0;
  }
  var walk = (pts, fn) => {
    for (let i = 0; i < pts.length - 1; i++) {
      const [ax, ay] = pts[i], [bx, by] = pts[i + 1], l = Math.max(1, Math.hypot(bx - ax, by - ay));
      for (let d = 0; d <= l; d += 0.5) fn(ax + (bx - ax) * d / l, ay + (by - ay) * d / l, i);
    }
  };
  function stroke(p, b, k, C, s = 1, o = {}) {
    if (k <= 0.02) return;
    const lk = o.light ?? 0.5;
    for (const q of b.paths) {
      const trunk = q.w >= 1;
      if (!trunk && k < 0.5) continue;
      const rh = (trunk ? k > 0.6 ? 2.1 : 1.6 : 1.1) * s, rb = (trunk ? k > 0.6 ? 1.3 : 0.8 : 0.5) * s;
      const pts = o.upTo !== void 0 && trunk ? q.pts.slice(0, Math.max(2, Math.ceil(q.pts.length * o.upTo))) : q.pts;
      walk(pts, (x, y) => {
        stamp(x, y, rh, 1);
        stamp(x, y, rb, trunk ? 3 : 2);
        if (trunk && k > 0.3) o.core ? stamp(x, y, o.core, 4) : mark(x, y, 4);
      });
      for (let i = 0; i < pts.length - 1; i += 3) if (o.minY === void 0 || pts[i][1] > o.minY) p.glow(pts[i][0], pts[i][1], (trunk ? 14 : 7) * s, C[4], lk * k * q.w);
    }
    const a = o.a ?? 1;
    flush(p, o.hero ? [C[3], C[6], C[7], C[7]] : [C[2], C[4], C[5], C[7]], [a, a, a, a]);
  }
  function crackle(p, b, k, C, glowK = 0.5, a = 1) {
    if (k <= 0.02) return;
    for (const q of b.paths) {
      const thick = q.w >= 1;
      walk(q.pts, (x, y) => {
        if (k > 0.45 && thick) for (const [dx, dy] of CROSS2) mark(x + dx * 1.5, y + dy * 1.5, 1);
        if (k > 0.25 && (thick || q.w > 0.4)) mark(x + 1, y, 2), mark(x, y + 1, 2);
        mark(x, y, thick && k > 0.3 ? 4 : 3);
      });
      for (let i = 0; i < q.pts.length - 1; i += 3) p.glow(q.pts[i][0], q.pts[i][1], (thick ? 9 : 5) * (0.5 + k * 0.5), C[4], glowK * k * q.w);
    }
    flush(p, [C[3], C[5], C[5], C[7]], [Math.min(1, (k - 0.45) * 1.6) * a, a, a, a]);
  }
  var CROSS2 = [[1, 0], [-1, 0], [0, 1], [0, -1]];

  // packages/fx/src/vendor/pixelfx/fx/lightning/zap-hit.js
  var meta5 = {
    name: "Zap hit",
    desc: "A contact zap: an arc snaps in from the left, the hit point overloads into a knot of tiny crackling zigzags, a fern of burn marks glows outward, sparks jink away, ozone puffs.",
    tags: ["lightning", "electric", "hit", "impact", "combat", "directional", "one-shot"],
    size: [144, 112],
    origin: [76, 56],
    duration: 0.9,
    loop: false,
    fps: 30,
    bg: "dark",
    options: { palette: VOLT, seed: 3 }
  };
  var SNAP = 0.05;
  var ASH = hex("#6a6680");
  function fern(R2) {
    const out = [];
    const grow = (x, y, a, len2, w, d, depth) => {
      const pts = [[x, y, d]];
      let side = R2.sign();
      for (let s = 0; s < len2; s += 1.4) {
        a += R2.range(-0.3, 0.3);
        x += Math.cos(a) * 1.4;
        y += Math.sin(a) * 1.4;
        d += 1.4;
        pts.push([x, y, d]);
        if (depth < 2 && s > 2 && R2.chance(0.24)) {
          side = -side;
          grow(x, y, a + side * R2.range(0.55, 1.05), (len2 - s) * R2.range(0.3, 0.55), w * 0.6, d, depth + 1);
        }
      }
      out.push({ pts, w });
    };
    for (let i = 0; i < 6; i++) grow(0, 0, i / 6 * TAU + R2.range(-0.35, 0.35), R2.range(18, 32), 1, 0, 0);
    return out;
  }
  function create5(o) {
    const C = fit(o.palette, 8), R2 = new Rng(o.seed), ps = new Particles({ rng: R2 }), lights = new Lights();
    const tree = fern(R2), Y0 = R2.range(-14, 6);
    const kinked = Array.from({ length: 16 }, () => {
      const a = R2.range(-1.2, 1.2) + (R2.chance(0.7) ? 0 : Math.PI), sp = R2.range(130, 250);
      return { x: 0, y: 0, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp - 40, life: R2.range(0.2, 0.36), age: -SNAP, next: R2.range(0.02, 0.05), trail: [] };
    });
    let t = 0, hit = false;
    return {
      update(dt) {
        t += dt;
        if (!hit && t >= SNAP) {
          hit = true;
          lights.add(0, 0, 60, C[4], 0.7, 0.3);
          lights.add(0, 0, 14, WHITE, 0.5, 0.07);
          for (let i = 0; i < 3; i++) ps.spawn(P.SMOKE, R2.range(-3, 5), R2.range(-4, 2), R2.range(-5, 8), -R2.range(8, 16), R2.range(0.55, 0.75), mix(ASH, C[4], 0.3), R2.range(2.5, 3.8), R2.range(0.08, 0.16));
        }
        for (const s of kinked) {
          if ((s.age += dt) < 0 || s.age >= s.life) continue;
          if ((s.next -= dt) <= 0) {
            s.next = R2.range(0.025, 0.055);
            const sp = Math.hypot(s.vx, s.vy), a = Math.atan2(s.vy, s.vx) + R2.sign() * R2.range(0.6, 1.3);
            s.vx = Math.cos(a) * sp;
            s.vy = Math.sin(a) * sp;
            s.trail.push([s.x, s.y]);
            if (s.trail.length > 4) s.trail.shift();
          }
          s.vx -= s.vx * 3 * dt;
          s.vy -= s.vy * 3 * dt - 140 * dt;
          s.x += s.vx * dt;
          s.y += s.vy * dt;
        }
        ps.update(dt);
        lights.update(dt);
      },
      drawBack(p) {
        if (t < SNAP) return;
        const cool = smooth(0.45, 0.85, t), fade = 1 - smooth(0.78, 0.88, t);
        for (const br of tree)
          for (let i = 1; i < br.pts.length; i++) {
            const [x0, y0] = br.pts[i - 1], [x, y, d] = br.pts[i], age = t - SNAP - d / 260;
            if (age < 0) break;
            const k = Math.exp(-age / 0.22) - cool * 0.3, c = k > 0.75 ? WHITE : k > 0.45 ? C[6] : k > 0.25 ? C[5] : k > 0.1 ? C[4] : k > -0.05 ? C[2] : C[1];
            p.line(x0, y0, x, y, c, fade);
            if (br.w >= 1 && d < 9) p.line(x0 + 1, y0, x + 1, y, k > 0.45 ? C[5] : C[2], fade);
            if ((i & 3) === 0 && k > 0) p.glow(x, y, 5, C[5], 0.35 * k * fade);
          }
        ps.draw(p, "back");
      },
      draw(p) {
        const f = Math.floor(t * 30 + 1e-4);
        if (t < 0.32) {
          const r = rng(o.seed, 2, f), b = zigzag(r, -66, Y0, 0, 0, 0.22, 0.35), u = clamp(t / SNAP);
          const k = t < SNAP ? 1 : t < 0.2 ? f % 2 ? 0.7 : 1 : 0.55 * (1 - (t - 0.2) / 0.12);
          stroke(p, u < 1 ? { paths: [b.paths[0]] } : b, k, C, t < SNAP + 0.034 ? 0.95 : 0.7, { upTo: u, hero: t >= SNAP && t < SNAP + 0.034 });
          if (u < 1) {
            const tp = b.paths[0].pts, [hx, hy] = tp[Math.floor(u * (tp.length - 1))];
            p.circle(hx, hy, 2, WHITE);
            p.glow(hx, hy, 14, C[5], 0.6);
          }
        }
        if (t >= SNAP && t < 0.45) {
          const a = (t - SNAP) / 0.4, r = rng(o.seed, 5, f), R02 = 8 * (1 - a * 0.6), m = Math.round(11 * (1 - a * 0.5));
          for (let i = 0; i < m; i++) {
            const ang = r.range(0, TAU), d0 = r.range(0.5, R02 * 0.5), ang2 = ang + r.range(-1.2, 1.2), d1 = r.range(R02 * 0.55, R02);
            crackle(p, zigzag(r, Math.cos(ang) * d0, Math.sin(ang) * d0, Math.cos(ang2) * d1, Math.sin(ang2) * d1, 0.5, 0), 0.75 * (1 - a) + 0.25, C, 0.25);
          }
          p.circle(0, 0, 3 * (1 - a) + 1, C[5]);
          p.circle(0, 0, 2 * (1 - a) + 0.5, WHITE);
          p.glow(0, 0, 20, C[4], 0.55 * (1 - a));
          if (t < SNAP + 0.07) p.glow(0, 0, 9, WHITE, 0.4);
        }
        for (const s of kinked) {
          if (s.age < 0 || s.age >= s.life) continue;
          const k = 1 - s.age / s.life, path = [...s.trail, [s.x, s.y]];
          for (let i = 0; i < path.length - 1; i++) p.line(path[i][0], path[i][1], path[i + 1][0], path[i + 1][1], i === path.length - 2 ? k > 0.5 ? WHITE : C[6] : k > 0.5 ? C[5] : C[4], 0.6 + 0.4 * (i / path.length));
          p.px(s.x, s.y, k > 0.4 ? WHITE : C[5]);
          p.glow(s.x, s.y, 4, C[5], 0.4 * k);
        }
        if (t >= SNAP) p.glow(0, 0, 40 * Math.max(0, 1 - t / 0.85), C[3], 0.45 * Math.exp(-(t - SNAP) * 5) * (f % 2 ? 0.7 : 1));
        ps.draw(p, "front");
        lights.draw(p);
      }
    };
  }

  // packages/fx/src/vendor/pixelfx/fx/lightning/charge-up.js
  var charge_up_exports = {};
  __export(charge_up_exports, {
    act: () => act2,
    create: () => create6,
    meta: () => meta6
  });
  var meta6 = {
    name: "Charge up",
    desc: "Sparks streak and arcs whip in to a crackling core at the caster's hand that swells and pulses faster, then it flashes and bursts: bolts every way, a ring, a spray of sparks.",
    tags: ["lightning", "electric", "charge", "spell", "power-up", "actor", "one-shot"],
    size: [272, 184],
    origin: [124, 148],
    duration: 2.7,
    loop: false,
    fps: 30,
    bg: "ground",
    actor: 2,
    options: { palette: VOLT, sparks: PLASMA, charge: 1.6, seed: 4 }
  };
  var HOLD = { ...READY, crouch: 3, lean: -2, fx: 15, fy: -21, bx: 9, by: -17, ffx: 9, fbx: -7 };
  var BURST = { turn: 1.15, y: -2, crouch: 0, lean: -2, fx: -13, fy: -37, bx: 14, by: -36, ffx: -2, ffy: -6, fbx: 3, fby: -6 };
  var act2 = {
    onBody: true,
    follow: 0,
    poses: [
      [-0.36, READY],
      [0, HOLD],
      [0.8, { ...HOLD, crouch: 4 }],
      [1.4, { ...HOLD, crouch: 6, lean: 0 }],
      [1.59, { ...HOLD, crouch: 7, lean: 0 }],
      [1.6, BURST, "snap"],
      [1.95, { ...BURST, y: 0, crouch: 2, fy: -30, by: -30, ffy: -4, fby: -4 }],
      [2.7, READY]
    ],
    hits: [{ t: 1.6, stop: 0.14, shake: 0.3, amp: 3 }],
    dust: [{ t: 1.6, x: 10, n: 6, dir: 1 }, { t: 1.6, x: -10, n: 6, dir: -1 }]
  };
  var CX = 15;
  var CY2 = -21;
  var BK = [1, 0.7, 0.95, 0.5, 0.8, 0.35];
  var ASH2 = hex("#5b5566");
  var edges2 = /* @__PURE__ */ new WeakMap();
  function edgeOf(A) {
    let e = edges2.get(A.mask);
    if (e) return e;
    const m = A.mask, on = (x, y) => x >= 0 && y >= 0 && x < m.w && y < m.h && m.data[y * m.w + x];
    e = [];
    for (let y = 0; y < m.h; y++) for (let x = 0; x < m.w; x++) if (on(x, y) && (!on(x - 1, y) || !on(x + 1, y) || !on(x, y - 1) || !on(x, y + 1))) e.push([A.x + x, A.y + y]);
    edges2.set(A.mask, e);
    return e;
  }
  function create6(o) {
    const C = fit(o.palette, 8), R2 = new Rng(o.seed), REL = o.charge, floor = () => 0;
    const ps = new Particles({ rng: R2, ground: floor, sparks: o.sparks }), lights = new Lights();
    const bolts = Array.from({ length: 8 }, (_, i) => {
      const a = i / 8 * TAU + R2.range(-0.25, 0.25), L2 = R2.range(44, 72), x1 = CX + Math.cos(a) * L2, y1 = Math.min(0, CY2 + Math.sin(a) * L2);
      return { x1, y1, t0: REL + R2.range(0, 0.05) };
    });
    const arcs = [];
    let t = 0, released = false, phase = 0, beats = [];
    const level = () => clamp(t / REL);
    return {
      update(dt) {
        t += dt;
        const k = level(), e = k * k;
        if (t < REL) {
          for (let acc = (60 + 360 * e) * dt; acc > 0; acc--) {
            if (acc < 1 && !R2.chance(acc)) break;
            const a = R2.range(0, TAU), d = R2.range(30, 72) * (1 - 0.35 * k), life = R2.range(0.16, 0.26), sp = d / life * 0.95;
            ps.spawn(P.MOTE, CX + Math.cos(a) * d, Math.min(-2, CY2 + Math.sin(a) * d), -Math.cos(a) * sp - Math.sin(a) * sp * 0.4, -Math.sin(a) * sp + Math.cos(a) * sp * 0.4, life, R2.pick([C[7], C[6], C[5]]), 1);
          }
          if (k > 0.2 && R2.chance((2 + 16 * e) * dt)) {
            const a = R2.range(0, TAU), d = R2.range(20, 40);
            arcs.push({ x: CX + Math.cos(a) * d, y: Math.min(-3, CY2 + Math.sin(a) * d), t, seed: R2.int(0, 1e6) });
          }
          phase += (1.5 + 11 * e) * dt;
          if (phase >= 1) phase -= 1, beats.push(t);
          if (R2.chance(4 * e * dt)) ps.spawn(P.STAR, CX + R2.range(-14, 14), CY2 + R2.range(-14, 10), 0, -4, R2.range(0.2, 0.35), C[6], R2.range(1, 2));
        } else if (!released) {
          released = true;
          lights.add(CX, CY2, 110, C[4], 0.8, 0.5);
          lights.add(CX, CY2, 28, WHITE, 0.6, 0.08);
          for (let i = 0; i < 70; i++) {
            const a = R2.range(0, TAU), sp = R2.range(140, 330) * (Math.sin(a) > 0.4 ? 0.55 : 1);
            ps.spawn(Math.sin(a) < -0.2 && R2.chance(0.35) ? P.MOTE : P.SPARK, CX, CY2, Math.cos(a) * sp, Math.sin(a) * sp, R2.range(0.25, 0.55), R2.pick([C[7], C[6], C[5]]), R2.range(0.8, 1.4));
          }
          for (let i = 0; i < 10; i++) {
            const a = R2.range(0, TAU), sp = R2.range(60, 160);
            ps.spawn(P.STAR, CX, CY2, Math.cos(a) * sp, Math.sin(a) * sp, R2.range(0.4, 0.8), R2.chance(0.5) ? C[6] : C[5], R2.range(1.2, 2.4));
          }
          for (let i = 0; i < 4; i++) ps.spawn(P.SMOKE, CX + R2.range(-5, 5), CY2 + R2.range(-4, 4), R2.range(-12, 12), -R2.range(8, 18), R2.range(0.6, 0.85), mix(ASH2, C[4], 0.3), R2.range(3, 5), R2.range(0.05, 0.15));
        }
        beats = beats.filter((b) => t - b < 0.22);
        for (let i = arcs.length - 1; i >= 0; i--) if (t - arcs[i].t > 0.07) arcs.splice(i, 1);
        ps.update(dt);
        lights.update(dt);
      },
      drawBack(p) {
        const k = level();
        if (t < REL) p.glow(CX * 0.5, -3, 40, C[3], 0.3 * k * k);
        ps.draw(p, "back");
      },
      draw(p) {
        const k = level(), e = k * k, f = Math.floor(t * 30 + 1e-4), A = o.actor;
        if (t < REL) {
          const jit = k > 0.85 ? (f % 2 ? 1 : -1) * ((k - 0.85) / 0.15) : 0, x = CX + jit, y = CY2, pr = 0.5 + 0.5 * Math.sin(phase * TAU);
          for (const [ex, ey] of edgeOf(A)) {
            const d = Math.hypot(ex + 0.5 - x, ey + 0.5 - y);
            if (d < 6 + 10 * k && e > 0.08) p.px(ex, ey, d < 4 + 6 * k && e > 0.4 ? C[6] : C[4]);
          }
          for (const b of beats) {
            const q = (t - b) / 0.22;
            p.ring(x, y, 4 + 20 * (1 - ease.inQuad(q)) * (0.5 + k), 1, q > 0.6 ? C[6] : C[4], 0.4 + 0.6 * q);
          }
          for (const a of arcs) crackle(p, zigzag(rng(a.seed, f), a.x, a.y, x, y, 0.35, 0.4), 0.85, C, 0.4);
          const r = 1.2 + 6.5 * e + pr * (0.5 + 1.2 * k);
          p.circle(x, y, r + 1.3, C[2]);
          p.circle(x, y, r, C[4]);
          p.circle(x - r * 0.12, y - r * 0.12, r * 0.7, C[5]);
          p.circle(x, y, r * 0.38, WHITE);
          if (r > 3)
            for (const s of [0, Math.PI])
              for (let a = 0; a < 1.3; a += 0.12) {
                const ang = t * 10 + s + a, rr = r * (0.62 + 0.1 * Math.sin(a * 3));
                p.dot(x + Math.cos(ang) * rr, y + Math.sin(ang) * rr, a < 0.5 ? WHITE : C[6]);
              }
          if (k > 0.35) {
            const q = rng(o.seed, 5, f), a = q.range(0, TAU), l = q.range(3, 6) * (0.5 + k);
            crackle(p, zigzag(q, x + Math.cos(a) * r, y + Math.sin(a) * r, x + Math.cos(a) * (r + l), y + Math.sin(a) * (r + l), 0.4, 0.3), 0.7, C, 0.3);
          }
          p.glow(x, y, 12 + 30 * k, C[4], 0.35 + 0.45 * k);
          p.glow(x, y, 6 + 6 * k, C[6], 0.25 + 0.3 * k);
        } else {
          const a = t - REL;
          if (a < 0.07) p.mask(A.mask, A.x, A.y, a < 0.035 ? WHITE : C[6]);
          if (a < 0.22) {
            const q2 = a / 0.22;
            flare(p, CX, CY2, 46 * Math.pow(1 - q2, 1.4), 1 - q2, C);
            if (q2 < 0.3) p.circle(CX, CY2, 12 * (1 - q2 * 2.5) + 1.5, WHITE);
          }
          for (const [i, b] of bolts.entries()) {
            const ba = Math.floor((t - b.t0) * 30 + 1e-4);
            if (t < b.t0 || ba >= BK.length) continue;
            stroke(p, zigzag(rng(o.seed, 3, i, ba >> 1), CX, CY2, b.x1, b.y1, 0.25, 0.75), BK[ba], C, ba === 0 ? 0.95 : 0.75, { hero: ba === 0 });
            if (b.y1 > -1) p.glow(b.x1, -3, 18, C[5], 0.5 * BK[ba]);
          }
          const q = a / 0.45;
          if (q < 1) {
            const r = 8 + 80 * ease.outCubic(q), hide = (rr) => (v, g) => CY2 + Math.sin(g) * rr > -1 ? 0 : 1.1 - q;
            p.ring(CX, CY2, r, Math.max(1, 3 * (1 - q)), q < 0.25 ? WHITE : C[5], hide(r));
            const r2 = 6 + 56 * ease.outCubic(Math.min(1, q * 1.3));
            p.ring(CX, CY2, r2, 1, C[4], (v, g) => CY2 + Math.sin(g) * r2 > -1 ? 0 : 0.8 - q);
            p.glow(CX, CY2 - 6, Math.min(r * 0.9, 46), C[3], 0.42 * (1 - q) * (1 - q));
          }
          if (a > 0.15 && a < 0.5) {
            const qq = rng(o.seed, 8, f), ang = qq.range(0, TAU), l = qq.range(5, 10);
            crackle(p, zigzag(qq, CX, CY2, CX + Math.cos(ang) * l, CY2 + Math.sin(ang) * l, 0.45, 0.3), 0.8 * (1 - (a - 0.15) / 0.35) + 0.15, C, 0.3);
          }
        }
        ps.draw(p, "front");
        lights.draw(p);
      }
    };
  }

  // packages/fx/src/vendor/pixelfx/fx/scifi/force-field.js
  var force_field_exports = {};
  __export(force_field_exports, {
    act: () => act3,
    draw: () => draw,
    drawBack: () => drawBack,
    meta: () => meta7
  });

  // packages/fx/src/vendor/pixelfx/fx/scifi/_lib.js
  var SOFT2 = /* @__PURE__ */ new Set([P.VAPOUR, P.DUST, P.SMOKE]);
  var STEP3 = 1 / 240;
  function move(q, dt, age, ground) {
    switch (q.k) {
      case P.FIRE:
        q.vy -= 95 * dt;
        q.vx += Math.sin(age * 17 + q.seed) * 30 * dt;
        q.vx -= q.vx * 5 * dt;
        q.vy -= q.vy * 3.2 * dt;
        break;
      case P.GRIT: {
        q.vy += GRAVITY * dt;
        q.vx -= q.vx * 0.8 * dt;
        const g = ground(q.x), ny = q.y + q.vy * dt;
        q.x += q.vx * dt;
        if (q.vy > 0 && q.y <= g && ny >= g) {
          q.y = g - 0.25;
          if (q.vy > 130 && rand(q.seed * 1e3, q.hops++) < 0.4) q.vy = -q.vy * 0.25, q.vx = q.vx * 0.5;
          else q.vx = q.vy = 0, q.life = Math.min(q.life, 0.5);
        } else q.y = ny;
        return;
      }
      case P.SPARK: {
        q.vy += GRAVITY * 0.45 * dt;
        q.vx -= q.vx * 2.2 * dt;
        q.vy -= q.vy * 2.2 * dt;
        const g = ground(q.x), ny = q.y + q.vy * dt;
        q.x += q.vx * dt;
        if (q.vy > 0 && q.y <= g && ny >= g) q.vy = -q.vy * 0.45, q.vx *= 0.7, q.y = g - 0.25;
        else q.y = ny;
        return;
      }
      case P.STREAK:
        q.vx += q.vx * 3 * dt, q.vy += q.vy * 3 * dt;
        break;
      case P.FLAKE:
        q.vx -= q.vx * 2.2 * dt;
        q.vy -= q.vy * 2.2 * dt - 35 * dt;
        q.x += Math.sin(age * 2.5 + q.seed) * 7 * dt;
        break;
      case P.EMBER:
        q.vy += (-30 + Math.sin(age * 3 + q.seed) * 20) * dt;
        q.vx += Math.cos(age * 2.3 + q.seed) * 45 * dt;
        q.vx -= q.vx * 1.6 * dt;
        q.vy -= q.vy * 1.6 * dt;
        break;
      case P.SMOKE: {
        const big = q.flag & PF.BIG;
        q.vy -= (big ? 23 : 16) * dt;
        q.vx += Math.sin(age * 1.3 + q.seed) * 8 * dt;
        q.vx -= q.vx * 1.6 * dt;
        q.vy -= q.vy * 1.2 * dt;
        break;
      }
      case P.MOTE:
        q.vx -= q.vx * 0.6 * dt;
        q.vy -= q.vy * 0.6 * dt;
        break;
      default: {
        const drag = SOFT2.has(q.k) ? 4 : 1.6;
        q.vx -= q.vx * drag * dt;
        q.vy -= q.vy * drag * dt + 5 * dt;
      }
    }
    q.x += q.vx * dt;
    q.y += q.vy * dt;
  }
  var Ghosts = class {
    constructor(period, opts = {}) {
      this.D = period;
      this.ground = opts.ground ?? (() => Infinity);
      this.box = opts.box ?? null;
      this.ps = new Particles({ ground: this.ground, sparks: opts.sparks, haze: opts.haze });
      this.specs = [];
    }
    add(born, k, x, y, vx, vy, life, col = WHITE, size = 1, flag = 0) {
      const n = this.specs.length, D2 = this.D;
      let seed = rand(n, 41) * 100;
      if (k === P.STAR) {
        const m = Math.ceil(8 * D2 / TAU), f = TAU * m / D2 - 8;
        if (f < 5) seed = f + 5 * Math.floor(rand(n, 43) * 19);
      }
      this.specs.push({ born: (born % D2 + D2) % D2, k, x, y, vx, vy, life, col: col ? hex(col) : 0, size, flag, seed });
    }
    get count() {
      return this.specs.length;
    }
    /** The state of one particle `age` seconds after its birth, or null if it's gone. */
    state(s, age) {
      const q = { k: s.k, x: s.x, y: s.y, vx: s.vx, vy: s.vy, life: s.life, max: s.life, col: s.col, size: s.size, seed: s.seed, delay: 0, flag: s.flag, hops: 0 };
      let a = 0;
      while (a < age - 1e-9) {
        const dt = Math.min(STEP3, age - a);
        move(q, dt, a, this.ground);
        a += dt;
        q.life -= dt;
        if (q.life <= 0) {
          if (q.k !== P.FIRE || !(q.flag & PF.SMOKES)) return null;
          const big = q.flag & PF.BIG, L2 = big ? 1.3 + rand(s.seed * 7, 1) : 0.8 + rand(s.seed * 7, 1) * 0.6;
          Object.assign(q, { k: P.SMOKE, vx: q.vx * 0.6, vy: q.vy * 0.6 - 6, life: L2, max: L2, col: 0, size: q.size * (big ? 0.85 : 0.7), flag: big ? PF.BIG : 0 });
        }
      }
      if (this.box) {
        const [x0, y0, x1, y1] = this.box;
        if (q.x < x0 || q.x > x1 || q.y < y0 || q.y > y1) return null;
      }
      return q;
    }
    at(t) {
      const D2 = this.D, list = [];
      for (const s of this.specs) {
        const span = s.k === P.FIRE && s.flag & PF.SMOKES ? s.life + 2.4 : s.life;
        for (let age = ((t - s.born) % D2 + D2) % D2; age < span; age += D2) {
          const q = this.state(s, age);
          if (q) list.push(q);
        }
      }
      this.ps.list = list;
      this.ps.t = t;
      return this.ps;
    }
  };
  function flash(p, t, t0, x, y, r, c, k, life) {
    const a = t - t0;
    if (a < 0 || a >= life) return;
    const q = 1 - a / life;
    p.glow(x, y, r * (0.55 + 0.45 * q), c, k * q * q);
  }
  var since = (t, t0, D2) => ((t - t0) % D2 + D2) % D2;
  function strokeArc(p, pts, C, k = 1, w = 1) {
    const [halo, body, glow] = C;
    for (const pass of [0, 1, 2])
      for (let i = 1; i < pts.length; i++) {
        const [ax, ay] = pts[i - 1], [bx, by] = pts[i], L2 = Math.max(1, Math.hypot(bx - ax, by - ay));
        for (let d = 0; d <= L2; d += 0.5) {
          const x = ax + (bx - ax) * d / L2, y = ay + (by - ay) * d / L2;
          if (pass === 0) p.circle(x, y, (k > 0.6 ? 1.6 : 1.1) * w, halo);
          else if (pass === 1) p.circle(x, y, (k > 0.6 ? 0.9 : 0.6) * w, body);
          else if (k > 0.3) p.px(x, y, WHITE);
        }
        if (pass === 0 && i % 3 === 0) p.glow(ax, ay, 9 * w, glow, 0.45 * k);
      }
  }

  // packages/fx/src/vendor/pixelfx/fx/scifi/force-field.js
  var meta7 = {
    name: "Force field",
    desc: "A glassy dome of hex plates over the hero: plates glint, tracers from the right slam into it, a ripple and cracks of light race across, sparks glance off.",
    tags: ["scifi", "shield", "barrier", "dome", "hex", "hit", "defense", "loop"],
    size: [184, 104],
    origin: [76, 84],
    duration: 2.4,
    loop: true,
    fps: 30,
    bg: "ground",
    actor: 2,
    options: {
      palette: ["#0b1030", "#152a63", "#1d4f9e", "#2582d2", "#36b9ee", "#8ae8ff", "#d4fbff", "#ffffff"],
      sparks: ["#fff3a6", "#ffe26b", "#ff8a2a", "#f2561d"],
      radius: 44,
      seed: 5
    }
  };
  var HOLD2 = { turn: 1, crouch: 3, lean: 1, fx: -9, fy: -38, bx: 10, by: -38, ffx: -5, fbx: 6 };
  var HIT_ = { ...HOLD2, x: -2, crouch: 5, lean: -3 };
  var act3 = {
    poses: [
      [0, HOLD2],
      [0.42, HOLD2],
      [0.42, HIT_, "snap"],
      [0.7, { ...HOLD2, x: -1 }],
      [1.1, HOLD2],
      [1.5, HOLD2],
      [1.5, { ...HIT_, crouch: 4, lean: -2 }, "snap"],
      [1.75, HOLD2],
      [2.4, HOLD2]
    ],
    hits: [{ t: 0.42, stop: 0.07, shake: 0.16, amp: 2 }, { t: 1.5, stop: 0.03, shake: 0.08, amp: 1 }]
  };
  var S3 = Math.sqrt(3);
  var SA = 0.13;
  var CA = Math.sqrt(1 - SA * SA);
  var G = 6.3;
  var KY = 1.12;
  var SHOTS = [
    { t: 0.42, lon: 0.66, lat: 0.62, big: true },
    { t: 1.5, lon: 0.95, lat: 0.26, big: false }
  ].map((s) => ({ ...s, N: [Math.cos(s.lat) * Math.sin(s.lon), Math.sin(s.lat), Math.cos(s.lat) * Math.cos(s.lon)] }));
  function cell(gx, gy) {
    const fq = S3 / 3 * gx - gy / 3, fr = 2 / 3 * gy, fs = -fq - fr;
    let q = Math.round(fq), r = Math.round(fr);
    const s = Math.round(fs), dq = Math.abs(q - fq), dr = Math.abs(r - fr), ds = Math.abs(s - fs);
    if (dq > dr && dq > ds) q = -r - s;
    else if (dr > ds) r = -q - s;
    const hx = S3 * (q + r / 2), hy = 1.5 * r, dx = gx - hx, dy = gy - hy, ax = Math.abs(dx);
    const e = Math.max(ax, Math.abs(ax / 2 + dy * S3 / 2), Math.abs(ax / 2 - dy * S3 / 2)) / (S3 / 2);
    const k = Math.round((Math.atan2(dy, dx) - Math.PI / 6) / (Math.PI / 3)), ca = Math.PI / 6 + k * Math.PI / 3;
    return { q, r, hx, hy, e, corner: Math.hypot(dx - Math.cos(ca), dy - Math.sin(ca)) };
  }
  function project(R2, lon, lat) {
    const X = Math.cos(lat) * Math.sin(lon), Y = Math.sin(lat), Z = Math.cos(lat) * Math.cos(lon);
    return [R2 * X, -R2 * (Y * CA - Z * SA), Y * SA + Z * CA];
  }
  var shells = /* @__PURE__ */ new Map();
  function shell(R2) {
    let g = shells.get(R2);
    if (g) return g;
    const near = [], far = [], N2 = Math.ceil(R2) + 1, W2 = 2 * N2 + 1, ids2 = [/* @__PURE__ */ new Map(), /* @__PURE__ */ new Map()];
    for (let y = -N2; y <= Math.ceil(R2 * SA) + 1; y++)
      for (let x = -N2; x <= N2; x++) {
        const u = (x + 0.5) / R2, vy = -(y + 0.5) / R2, q = u * u + vy * vy;
        if (q > 1) continue;
        const vz = Math.sqrt(1 - q);
        for (const s of [1, -1]) {
          const Y = vy * CA + s * vz * SA, Z = -vy * SA + s * vz * CA;
          if (Y < 0) continue;
          const lon = Math.atan2(u, Z), lat = Math.asin(Math.min(1, Y)), c = cell(lon * G, lat * G * KY), id = c.q * 1e3 + c.r;
          (s > 0 ? near : far).push({ x, y, X: u, Y, Z, lon, lat, q: c.q, r: c.r, id, e: c.e, corner: c.corner, rim: 1 - vz, sil: (1 - Math.sqrt(q)) * R2 });
          ids2[s > 0 ? 0 : 1].set((y + N2) * W2 + x + N2, id);
        }
      }
    [near, far].forEach((list, i) => {
      const at = (x, y) => ids2[i].get((y + N2) * W2 + x + N2);
      for (const q of list) {
        const r = at(q.x + 1, q.y), d = at(q.x, q.y + 1), l = at(q.x - 1, q.y), u = at(q.x, q.y - 1);
        q.seam = r !== void 0 && r !== q.id || d !== void 0 && d !== q.id;
        q.bevel = !q.seam && (l !== void 0 && l !== q.id || u !== void 0 && u !== q.id);
      }
    });
    shells.set(R2, g = { near, far });
    return g;
  }
  var crackCache = /* @__PURE__ */ new Map();
  function cracks(R2, seed, s) {
    const key = `${R2}:${seed}`;
    if (crackCache.has(key)) return crackCache.get(key);
    const rn = new Rng(seed * 13 + 5), out = [];
    const toScreen = (path, u0, u1) => {
      const pts = [];
      for (let i = 0; i < path.length; i++) {
        const [lon, lat] = path[i];
        if (lat < 0.03 || lat > 1.52 || Math.abs(lon) > 1.5) break;
        pts.push([...project(R2, lon, lat), u0 + (u1 - u0) * i / (path.length - 1)]);
      }
      return pts;
    };
    for (let i = 0; i < 5; i++) {
      const a = i / 5 * TAU + rn.range(-0.35, 0.35), L2 = rn.range(0.42, 0.8);
      const path = bolt(rn, s.lon, s.lat, s.lon + Math.cos(a) * L2 / Math.cos(s.lat), s.lat + Math.sin(a) * L2, { jag: 0.2, depth: 4 });
      out.push(toScreen(path, 0, 1));
      for (const f of forks(rn, path, { count: rn.int(0, 2), len: L2 * 0.5, jag: 0.25, spread: 0.9 })) {
        const j = path.findIndex((q) => q[0] === f[0][0] && q[1] === f[0][1]), u0 = Math.max(0, j) / (path.length - 1);
        out.push(toScreen(f, u0, u0 + 0.5));
      }
    }
    crackCache.set(key, out);
    return out;
  }
  var ghostCache = /* @__PURE__ */ new Map();
  function ghosts(o, C, R2) {
    const key = `${R2}:${o.seed}:${o.sparks.join()}:${o.palette.join()}`;
    if (ghostCache.has(key)) return ghostCache.get(key);
    const W2 = meta7.size[0] - meta7.origin[0], rn = new Rng(o.seed), D2 = meta7.duration;
    const g = new Ghosts(D2, { ground: () => 0, sparks: o.sparks, box: [-70, -80, W2 - 6, 14] });
    for (const s of SHOTS) {
      const [hx, hy] = project(R2, s.lon, s.lat), n = s.big ? 1 : 0.55;
      for (let i = 0; i < 24 * n; i++) {
        const a = (s.big ? -0.9 : -0.55) + rn.range(-0.7, 0.65), sp = rn.range(100, 280) * (0.7 + 0.3 * n);
        g.add(s.t + rn.range(0, 0.02), P.SPARK, hx, hy, Math.cos(a) * sp, Math.sin(a) * sp - 30, rn.range(0.25, 0.75));
      }
      for (let i = 0; i < 7 * n; i++) {
        const a = -0.9 + rn.range(-1.2, 1.2), sp = rn.range(30, 90);
        g.add(s.t + rn.range(0, 0.05), P.MOTE, hx, hy, Math.cos(a) * sp, Math.sin(a) * sp - 15, rn.range(0.3, 0.6), rn.pick([C[5], C[6], C[4]]), 0.7);
      }
      for (let i = 0; i < 3 * n; i++) g.add(s.t + 0.04 + i * 0.07, P.STAR, hx + rn.range(-6, 6), hy + rn.range(-5, 5), 0, -4, rn.range(0.3, 0.5), C[6], rn.range(1, 2));
      for (let i = 0; i < 3 * n; i++) g.add(s.t + 0.03 + i * 0.04, P.SMOKE, hx + 2 + rn.range(-2, 2), hy - 1, rn.range(8, 22), rn.range(-14, -4), rn.range(0.9, 1.3), hex("#5b5f78"), rn.range(2.2, 3.4));
    }
    for (let r = 0; r < 12; r++)
      for (let q = -14; q <= 14; q++) {
        if (!glints(o.seed, q, r)) continue;
        const lon = S3 * (q + r / 2) / G, lat = 1.5 * r / (G * KY), [x, y, f] = project(R2, lon, lat);
        if (f < 0.25 || lat < 0.15 || lat > 1.45 || Math.abs(lon) > 1.3) continue;
        g.add(glintAt(o.seed, q, r) + 0.03, P.STAR, x, y, 0, -3, 0.4, C[6], 1.4 + rand(q, r, 9));
      }
    ghostCache.set(key, g);
    return g;
  }
  var glints = (S, q, r) => rand(S, q, r, 3) < 0.2;
  var glintAt = (S, q, r) => {
    const g = rand(S, q, r) * 1.7;
    return g < 1.4 ? 1 + g : g - 1.4;
  };
  function drawShell(p, t, o, C, near) {
    const R2 = o.radius, D2 = meta7.duration, S = o.seed, ph = t / D2, { near: N2, far: F } = shell(R2);
    const ages = SHOTS.map((s) => since(t, s.t, D2));
    const sk = clamp((ph - 0.72) / 0.26), scanLat = -0.2 + sk * 2, scanK = Math.sin(Math.PI * sk);
    for (const q of near ? N2 : F) {
      const ff = q.rim * q.rim;
      let rp = 0, hot = 0;
      for (let i = 0; i < SHOTS.length; i++) {
        const s = SHOTS[i], age = ages[i];
        if (age >= 1) continue;
        const d = Math.acos(clamp(q.X * s.N[0] + q.Y * s.N[1] + q.Z * s.N[2], -1, 1)), f = 0.06 + 3.1 * age, k = (1 - age) * (s.big ? 1 : 0.7);
        rp = Math.max(rp, Math.exp(-(((d - f) / 0.15) ** 2)) * k, d < f ? 0.22 * k * k * (1 - d / f) : 0);
        const hr = s.big ? 0.3 : 0.17;
        if (age < 0.55 && d < hr) hot = Math.max(hot, age < 0.07 && d < hr * 0.75 ? 2 : (1 - age / 0.55) ** 1.5 * (1.1 - 0.6 * d / hr));
      }
      let gl = 0;
      if (glints(S, q.q, q.r)) {
        const a = since(t, glintAt(S, q.q, q.r), D2);
        if (a < 0.45) gl = 1 - a / 0.45;
      }
      const sc = scanK * Math.exp(-(((q.lat - scanLat) / 0.09) ** 2));
      if (!near) {
        if (q.seam) p.blend(q.x + 0.5, q.y + 0.5, rp > 0.3 ? C[5] : C[3], clamp(0.18 + 0.25 * ff + 0.6 * rp + 0.3 * sc));
        else p.blend(q.x + 0.5, q.y + 0.5, C[2], 0.04 + 0.06 * ff + 0.15 * rp);
        continue;
      }
      if (q.sil < 1.15) {
        const lit = -q.X * 0.55 + q.Y * 0.85;
        p.px(q.x, q.y, rp > 0.4 || lit > 0.8 ? WHITE : lit > 0.3 ? C[6] : C[5]);
        p.light(q.x, q.y, C[4], 0.3);
        continue;
      }
      if (hot >= 2) {
        p.px(q.x, q.y, q.seam ? C[6] : WHITE);
        continue;
      }
      if (q.seam) {
        const I = 0.12 + 0.5 * ff + 0.08 * Math.sin(q.lon * 2.3 + q.lat * 3 - ph * TAU) + (q.corner < 0.32 ? 0.18 : 0) + 0.9 * gl + 0.7 * sc + 1.3 * rp + hot;
        const c = gl > 0.6 || rp > 0.55 || hot > 0.5 ? WHITE : I > 0.8 ? C[6] : I > 0.55 ? C[5] : C[4];
        if (I > 0.36) p.px(q.x, q.y, c);
        else p.blend(q.x + 0.5, q.y + 0.5, c, 0.3 + I);
        p.light(q.x, q.y, C[4], 0.04 + 0.08 * I);
      } else {
        const a = 0.05 + 0.34 * ff * q.rim + 0.1 * q.e ** 4 + (q.bevel ? 0.12 + 0.2 * ff : 0) + 0.35 * gl + 0.1 * sc + 0.3 * rp + 0.6 * hot;
        const c = hot > 0.6 ? WHITE : hot > 0.3 || gl > 0.5 ? C[6] : rp > 0.4 || q.bevel ? C[5] : ff > 0.5 ? C[4] : C[3];
        p.blend(q.x + 0.5, q.y + 0.5, c, clamp(a));
        if (rp > 0.1 || hot > 0 || gl > 0) p.light(q.x, q.y, C[4], 0.06 * (rp + hot + gl));
      }
    }
  }
  function drawFoot(p, t, C, R2, near) {
    const D2 = meta7.duration, keep = (g) => Math.sin(g) >= 0 === near;
    band(p, 0, 0, R2 + 1, SA, 2, 1, [C[1], C[3], C[5], C[6]], keep);
    for (let i = 0; i < 10; i++) {
      const g = i / 10 * TAU + 0.31;
      if (!keep(g)) continue;
      const x = Math.cos(g) * (R2 - 0.5), y = Math.sin(g) * R2 * SA, k = 0.5 + 0.5 * Math.cos(TAU * (2 * (t / D2) - i / 10));
      p.px(x - 1, y, C[2]);
      p.px(x + 1, y, C[2]);
      p.px(x, y, k > 0.6 ? WHITE : C[5]);
      p.glow(x, y, 6 + 4 * k, C[4], (near ? 0.25 : 0.15) * (0.4 + k));
    }
  }
  function drawBack(p, t, o) {
    const C = fit(o.palette, 8), R2 = o.radius;
    for (let x = -R2; x <= R2; x += R2 / 3) p.glow(x, -1, 22, C[3], 0.1);
    drawFoot(p, t, C, R2, false);
    drawShell(p, t, o, C, false);
  }
  function draw(p, t, o) {
    const C = fit(o.palette, 8), SP = fit(o.sparks, 4), R2 = o.radius, D2 = meta7.duration, W2 = meta7.size[0] - meta7.origin[0];
    drawShell(p, t, o, C, true);
    drawFoot(p, t, C, R2, true);
    for (const s of SHOTS) {
      const age = since(t, s.t, D2), [hx, hy] = project(R2, s.lon, s.lat), n = s.big ? 1 : 0.6;
      if (s.big && age < 0.9) {
        const fade = 1 - smooth(0.35, 0.9, age), reach = clamp(age / 0.09);
        for (const pass of [0, 1])
          for (const c of cracks(R2, o.seed, s))
            for (let i = 1; i < c.length; i++) {
              const [x0, y0, f0] = c[i - 1], [x1, y1, f1, u] = c[i];
              if (u > reach || f0 < 0.05 || f1 < 0.05) continue;
              const k = fade * (1.2 - u * 0.4);
              if (pass === 0) {
                if (age < 0.32) for (const [ox, oy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) p.line(x0 + ox, y0 + oy, x1 + ox, y1 + oy, age < 0.12 ? C[6] : C[5], k * (1 - age / 0.32));
                continue;
              }
              p.line(x0, y0, x1, y1, age < 0.12 + u * 0.08 ? WHITE : age < 0.3 + u * 0.1 ? C[6] : C[5], k);
              if (i % 3 === 0) p.glow(x1, y1, 6, C[4], 0.35 * fade * (1 - u * 0.5));
            }
      }
      const tk = (t - (s.t - 0.1)) / 0.1;
      if (tk >= 0 && tk < 1) {
        const sx = W2 - 3, sy = hy - 12, L2 = Math.hypot(sx - hx, sy - hy), at = (d) => [sx + (hx - sx) * Math.max(0, d) / L2, sy + (hy - sy) * Math.max(0, d) / L2];
        const h = L2 * tk, [x, y] = at(h), [x2, y2] = at(h - 2), [x7, y7] = at(h - 7), [x16, y16] = at(h - 16);
        p.line(x16, y16, x7, y7, SP[3]);
        p.line(x7, y7, x2, y2, SP[1]);
        p.line(x2, y2, x, y, SP[0]);
        p.px(x, y, WHITE);
        p.glow(x, y, 9, SP[1], 0.55);
      }
      if (age < 0.14) sparkle(p, hx, hy, (7 * (1 - age / 0.14) + 1) * n, C[6], C[5], 0.4);
      flash(p, t, s.t, hx, hy, 56 * n, C[4], 0.45, 0.45);
      flash(p, t, s.t, hx, hy, 12, WHITE, 0.5 * n, 0.08);
      flash(p, t, s.t, hx + 3, hy, 22, SP[1], 0.4 * n, 0.15);
    }
    const a0 = since(t, SHOTS[0].t, D2);
    p.glow(0, -R2 * 0.45, R2 * 1.3, C[3], 0.11 + 0.1 * Math.max(0, 1 - a0 * 2));
    ghosts(o, C, R2).at(t).draw(p);
  }

  // packages/fx/src/vendor/pixelfx/fx/scifi/energy-core.js
  var energy_core_exports = {};
  __export(energy_core_exports, {
    draw: () => draw2,
    drawBack: () => drawBack2,
    meta: () => meta8
  });
  var meta8 = {
    name: "Energy core",
    desc: "A plasma core beating in a steel cage: it swells and throws a shock ring on each beat, two tilted rings orbit it, and arcs jump to the bars and spark.",
    tags: ["scifi", "reactor", "core", "power", "plasma", "machine", "prop", "ground", "loop"],
    size: [112, 100],
    origin: [56, 88],
    duration: 2.4,
    loop: true,
    fps: 30,
    bg: "ground",
    options: {
      palette: ["#1a0516", "#3d0a33", "#701560", "#b0228f", "#f53cd1", "#ff86e6", "#ffd2f6", "#ffffff"],
      metal: ["#0e0d14", "#1e1c27", "#312e3e", "#4b4759", "#6f6a82", "#9d98b0"],
      seed: 35
    }
  };
  var D = meta8.duration;
  var CY3 = -36;
  var R0 = 11;
  var RC = 24;
  var TOPY = -64;
  var BOTY = -9;
  var SLOT = 0.1;
  var NS = Math.round(D / SLOT);
  var BEATS = [[0.05, 1, true], [0.25, 0.5, false], [1.25, 1, true], [1.45, 0.5, false]];
  var env = (a) => a < 0.03 ? a / 0.03 : Math.exp(-(a - 0.03) / 0.12);
  var pulseAt = (t) => BEATS.reduce((m, [b, k]) => Math.max(m, k * env(since(t, b, D))), 0);
  var BARS = Array.from({ length: 6 }, (_, i) => {
    const a = i / 6 * TAU + Math.PI / 6;
    return { x: RC * Math.sin(a), z: Math.cos(a) };
  });
  function ringPt(r, tilt, spin, a) {
    const x = r * Math.cos(a), z0 = r * Math.sin(a), y = -z0 * Math.sin(tilt), z = z0 * Math.cos(tilt);
    return [x * Math.cos(spin) + z * Math.sin(spin), CY3 - y, -x * Math.sin(spin) + z * Math.cos(spin)];
  }
  var RINGS = [
    { r: 17, tilt: 1.15, spin: (t) => TAU * (t / D) },
    { r: 19, tilt: -0.9, spin: (t) => -TAU * 2 * (t / D) + 1 }
  ];
  var cache = /* @__PURE__ */ new Map();
  function setup(o) {
    const key = `${o.seed}:${o.palette.join()}`;
    if (cache.has(key)) return cache.get(key);
    const C = fit(o.palette, 8), rn = new Rng(o.seed);
    const g = new Ghosts(D, { ground: () => 0, sparks: [WHITE, C[6], C[5], C[4]], haze: C[5], box: [-54, -98, 54, 11] });
    const arcs = [];
    for (let s = 0; s < NS; s++) {
      const ts = s * SLOT, hot = BEATS.some(([b, , strong]) => strong && since(ts, b, D) < 0.16);
      for (let n = 0; n < (hot ? 2 : 1); n++) {
        if (!hot && !rn.chance(0.4)) continue;
        const bar = rn.pick(BARS.filter((b) => b.z > -0.2)), ty = rn.range(TOPY + 8, BOTY - 6), ang = Math.atan2(ty - CY3, bar.x);
        const sx = Math.cos(ang) * R0, sy = CY3 + Math.sin(ang) * R0, path = bolt(rn, sx, sy, bar.x - Math.sign(bar.x) * 1.5, ty, { jag: 0.3, depth: 4 });
        arcs.push({ s, path, fk: forks(rn, path, { count: rn.int(0, 1), len: 7, jag: 0.35 }) });
        for (let i = 0; i < 5; i++) {
          const a = Math.atan2(ty - sy, bar.x - sx) + Math.PI + rn.range(-1.2, 1.2), sp = rn.range(60, 170);
          g.add(ts, P.SPARK, bar.x, ty, Math.cos(a) * sp, Math.sin(a) * sp - 40, rn.range(0.2, 0.5));
        }
      }
    }
    for (const [b, , strong] of BEATS) {
      if (!strong) continue;
      for (let i = 0; i < 12; i++) {
        const a = rn.range(0, TAU), sp = rn.range(40, 110);
        g.add(b + 0.02, P.MOTE, Math.cos(a) * R0, CY3 + Math.sin(a) * R0, Math.cos(a) * sp, Math.sin(a) * sp, rn.range(0.25, 0.5), rn.pick([WHITE, C[6], C[5]]), 0.7);
      }
    }
    const v = { C, arcs, g };
    cache.set(key, v);
    return v;
  }
  function plinth(p, C, H2, t, pulse) {
    p.shade(-30, -10, 30, 2, (x, y, out) => {
      const top = (x / 29) ** 2 + ((y + 7) / 4) ** 2 <= 1, side = Math.abs(x) <= 29 && y > -7 && y <= 0;
      if (!top && !side) return;
      if (top) out.c = (x / 29) ** 2 + ((y + 7) / 4) ** 2 > 0.82 ? H2[0] : y < -8 ? H2[5] : x < 0 ? H2[4] : H2[3];
      else out.c = Math.abs(x) > 28 || y === 0 ? H2[0] : y === -6 ? H2[4] : x < -14 ? H2[3] : x > 14 ? H2[1] : H2[2];
    });
    for (let i = 0; i < 7; i++) {
      const x = -18 + i * 6, k = 0.5 + 0.5 * Math.cos(TAU * (2 * (t / D) - i / 7));
      p.px(x, -3, k > 0.75 ? WHITE : k > 0.4 ? C[5] : C[2]);
      if (k > 0.6) p.glow(x, -3, 4, C[4], 0.3 * k);
    }
    p.glow(0, -8, 26, C[4], 0.25 + 0.3 * pulse);
  }
  function barDraw(p, b, C, H2, pulse, back) {
    const lit = back ? C[3] : pulse > 0.5 ? C[6] : C[5], inward = -Math.sign(b.x);
    for (let y = TOPY + 2; y < BOTY; y++)
      for (let i = -1; i <= 1; i++) {
        const face = i === inward;
        p.px(b.x + i, y, back ? face ? lit : H2[1] : face ? lit : i === 0 ? H2[3] : H2[1]);
      }
  }
  function hoop(p, y, rx, H2, C, near, pulse) {
    for (let i = 0, n = Math.ceil(rx * 8); i < n; i++) {
      const g = i / n * TAU, s = Math.sin(g);
      if (s >= 0 !== near) continue;
      const x = Math.cos(g) * rx, yy = y + s * 4;
      p.px(x, yy, near ? s > 0.6 ? H2[4] : H2[3] : H2[1]);
      p.px(x, yy + 1, near ? H2[1] : H2[0]);
      if (near && s < 0.3) p.px(x, yy - 1, pulse > 0.5 ? C[5] : C[3]);
    }
  }
  function core(p, t, C, R2, pulse, seed) {
    const ph = t / D;
    p.shade(-R2 - 2, CY3 - R2 - 2, R2 + 2, CY3 + R2 + 2, (x, y, out) => {
      const dx = x, dy = y - CY3, d = Math.sqrt(dx * dx + dy * dy) / R2;
      if (d > 1.1) return;
      if (d > 1) return out.c = C[2];
      if (d > 0.9) return out.c = dy < -R2 * 0.3 && dx < R2 * 0.3 ? C[6] : C[4];
      const a = Math.atan2(dy, dx), n = 0.5 + 0.5 * tileFbm(a / TAU * 6 + ph * 6 + d * 1.5, d * 2.2 - ph * 4, 6, 4, seed, 2);
      const band2 = Math.abs(n - 0.5) < 0.05 + 0.05 * pulse, heat = (1 - d) ** 2 + pulse * 0.45;
      if (band2) out.c = heat > 0.5 ? WHITE : heat > 0.2 ? C[6] : C[5];
      else out.c = heat > 0.7 ? C[6] : heat > 0.42 ? C[5] : heat > 0.2 ? C[3] : n > 0.5 ? C[2] : C[1];
    });
    const f = Math.floor(t * 15), r = rng(seed, f, 5);
    for (let i = 0; i < 3; i++) {
      const a = i / 3 * TAU + f * 0.7 + r.range(-0.4, 0.4), pts = bolt(r, 0, CY3, Math.cos(a) * R2 * 0.88, CY3 + Math.sin(a) * R2 * 0.88, { jag: 0.32, depth: 3 });
      p.polyline(pts, (u) => u < 0.4 ? WHITE : C[6]);
      const [ex, ey] = pts[pts.length - 1];
      p.px(ex, ey, WHITE);
      p.glow(ex, ey, 4, C[5], 0.4);
    }
    p.circle(0, CY3, 1.8 + pulse * 2, WHITE);
    p.circle(0, CY3, 3 + pulse * 2, (d) => d > 0.6 ? C[6] : WHITE, 1e-4);
    p.px(-R2 * 0.45, CY3 - R2 * 0.55, WHITE);
    p.px(-R2 * 0.45 + 1, CY3 - R2 * 0.55, C[6]);
  }
  function ring(p, t, rg, C, front, pulse) {
    const spin = rg.spin(t), bead = t / D * TAU * 3;
    for (let i = 0, n = Math.ceil(rg.r * 9); i < n; i++) {
      const a = i / n * TAU, [x, y, z] = ringPt(rg.r, rg.tilt, spin, a);
      if (z >= 0 !== front) continue;
      const u = ((a - bead) / TAU % 1 + 1) % 1, head = u > 0.9;
      p.px(x, y, head ? WHITE : !front ? C[3] : z > 0.5 * rg.r || pulse > 0.6 ? C[6] : C[5]);
    }
    if (front) {
      const [x, y] = ringPt(rg.r, rg.tilt, spin, bead);
      p.glow(x, y, 6, C[5], 0.5);
    }
  }
  function drawBack2(p, t, o) {
    const C = fit(o.palette, 8), H2 = fit(o.metal, 6), pulse = pulseAt(t);
    hoop(p, BOTY, RC, H2, C, false, pulse);
    hoop(p, TOPY, RC, H2, C, false, pulse);
    for (const b of BARS) if (b.z < 0) barDraw(p, b, C, H2, pulse, true);
    for (const rg of RINGS) ring(p, t, rg, C, false, pulse);
  }
  function draw2(p, t, o) {
    const { C, arcs, g } = setup(o), H2 = fit(o.metal, 6), pulse = pulseAt(t), R2 = R0 * (1 + 0.14 * pulse);
    plinth(p, C, H2, t, pulse);
    core(p, t, C, R2, pulse, o.seed);
    for (const rg of RINGS) ring(p, t, rg, C, true, pulse);
    for (const b of BARS) if (b.z >= 0) barDraw(p, b, C, H2, pulse, false);
    hoop(p, BOTY, RC, H2, C, true, pulse);
    hoop(p, TOPY, RC, H2, C, true, pulse);
    p.shade(-15, TOPY - 7, 15, TOPY, (x, y, out) => {
      const d = (x / 14.5) ** 2 + ((y - TOPY) / 6.5) ** 2;
      if (d > 1) return;
      const l = -x * 0.05 - (y - TOPY) * 0.12;
      out.c = d > 0.8 ? H2[0] : l > 0.55 ? H2[5] : l > 0.3 ? H2[4] : H2[3];
    });
    p.px(0, TOPY - 7, pulse > 0.4 ? WHITE : C[5]);
    p.glow(0, TOPY - 7, 5, C[4], 0.4 + 0.4 * pulse);
    const s = Math.floor(t / SLOT) % NS, k = 1 - (t - Math.floor(t / SLOT) * SLOT) / SLOT;
    for (const a of arcs) {
      if (a.s !== s) continue;
      strokeArc(p, a.path, [C[2], C[5], C[4]], k);
      for (const f of a.fk) strokeArc(p, f, [C[2], C[5], C[4]], k, 0.6);
      const [ex, ey] = a.path[a.path.length - 1];
      p.glow(ex, ey, 8, C[5], 0.6 * k);
    }
    for (const [b, , strong] of BEATS) {
      const a = since(t, b, D);
      if (!strong || a > 0.45) continue;
      const q = a / 0.45, r = R0 + 34 * ease.outCubic(q);
      p.ring(0, CY3, r, Math.max(1, 3 * (1 - q)), q < 0.25 ? WHITE : q < 0.5 ? C[6] : C[5], 1.1 - q);
      p.glowRing(0, CY3, r, 6, C[4], 0.35 * (1 - q));
    }
    g.at(t).draw(p);
    p.glow(0, CY3, 46, C[4], 0.2 + 0.3 * pulse);
    p.glow(0, CY3, 9, WHITE, 0.35 + 0.4 * pulse);
  }

  // packages/fx/src/vendor/pixelfx/fx/transitions/crt-off.js
  var crt_off_exports = {};
  __export(crt_off_exports, {
    draw: () => draw3,
    meta: () => meta9
  });

  // packages/fx/src/vendor/pixelfx/fx/transitions/_lib.js
  var W = 320;
  var H = 180;
  function screenMeta({ name, desc, tags, duration, options }) {
    return {
      name,
      desc,
      tags: ["transition", "screen", ...tags, "one-shot"],
      size: [W, H],
      origin: [0, 0],
      duration,
      loop: false,
      fps: 30,
      bg: "sky",
      options: { color: "#0b0a10", seed: 1, ...options }
    };
  }
  var Clipped = class extends Painter {
    inside(sx, sy) {
      const lx = this.fromX(sx + 0.5, sy + 0.5), ly = this.fromY(sx + 0.5, sy + 0.5);
      return lx >= 0 && ly >= 0 && lx < W && ly < H;
    }
    put(sx, sy, c, a) {
      if (this.inside(sx, sy)) super.put(sx, sy, c, a);
    }
    add(sx, sy, c, k) {
      if (this.inside(sx, sy)) super.add(sx, sy, c, k);
    }
    blendPx(sx, sy, c, a) {
      if (this.inside(sx, sy)) super.blendPx(sx, sy, c, a);
    }
  };
  var clips = /* @__PURE__ */ new WeakMap();
  function clipTo(p) {
    let q = clips.get(p);
    if (!q) clips.set(p, q = new Clipped(p.frame));
    q.reset();
    q.tx = p.tx;
    q.ty = p.ty;
    q.fx = p.fx;
    q.cs = p.cs;
    q.sn = p.sn;
    q.fade = p.fade;
    q.lightK = p.lightK;
    q.layer = p.layer;
    return q;
  }
  var unrotated = (p) => p.sn === 0 && p.cs === 1;
  var col0 = (p) => p.fx > 0 ? Math.floor(p.tx + 0.5) : Math.floor(p.tx - 0.5);
  function rect(p, x, y, w, h, c) {
    if (!unrotated(p)) return p.rect(x, y, w, h, c);
    const X0 = Math.round(x), X1 = Math.round(x + w), Y0 = Math.round(y), Y1 = Math.round(y + h), fx = p.fx, b = col0(p);
    for (let yy = Y0; yy < Y1; yy++) {
      const sy = Math.floor(p.ty + yy + 0.5);
      for (let xx = X0; xx < X1; xx++) p.put(b + fx * xx, sy, c, 1);
    }
  }
  function glint2(p, x, y, L2, ang, c1, c2, a = 1) {
    if (L2 < 0.8 || a <= 0) return;
    for (let i = 0; i < 8; i++) {
      const diag = i % 2 === 1, an = ang + i * TAU / 8, len2 = diag ? L2 * 0.42 : L2, ca = Math.cos(an), sa = Math.sin(an);
      for (let d = 0; d <= len2; d += 0.5) {
        const u = d / len2, c = diag ? u < 0.5 ? c1 : c2 : u < 0.3 ? WHITE : u < 0.65 ? c1 : c2;
        p.dot(x + ca * d, y + sa * d, c, a * (u < 0.7 ? 1 : 1 - (u - 0.7) / 0.35));
        if (!diag && u < 0.22 && L2 > 4) p.dot(x + ca * d - sa, y + sa * d + ca, c1, a), p.dot(x + ca * d + sa, y + sa * d - ca, c1, a);
      }
    }
    p.dot(x, y, WHITE, a);
    p.glow(x, y, 4 + L2 * 1.4, c1, 0.5 * a);
    p.glow(x, y, 2 + L2 * 0.5, WHITE, 0.4 * a);
  }

  // packages/fx/src/vendor/pixelfx/fx/transitions/crt-off.js
  var meta9 = screenMeta({
    name: "CRT off",
    desc: "The picture squeezes into a white-hot glowing line, the line into a dot that lingers as a fading afterglow; then it switches back on, dot to line to picture, with a warm-up glow.",
    tags: ["crt", "tv", "retro", "switch", "wipe"],
    duration: 2,
    options: { palette: ["#060a14", "#0e1a33", "#1a3360", "#2a5a9a", "#4a8fd0", "#8cc4f0", "#d4ecff", "#ffffff"], seed: 1 }
  });
  var YC = H / 2;
  var XC = W / 2;
  var SQ0 = 0.06;
  var SQ1 = 0.34;
  var LN1 = 0.56;
  var DOT1 = 0.86;
  var ON0 = 1.06;
  var ON1 = 1.16;
  var OPEN1 = 1.42;
  function shape(t) {
    if (t < SQ0) return { h: H, w: XC };
    if (t < SQ1) return { h: Math.max(1, H * (1 - ease.inCubic((t - SQ0) / (SQ1 - SQ0)))), w: XC };
    if (t < LN1) return { h: 1, w: XC * (1 - ease.inQuad((t - SQ1) / (LN1 - SQ1))) };
    if (t < ON0) return { h: 0, w: 0 };
    if (t < ON1) return { h: 1, w: XC * ease.outExpo((t - ON0) / (ON1 - ON0)) };
    return { h: Math.max(1, H * ease.outCubic(clamp((t - ON1) / (OPEN1 - ON1)))), w: XC };
  }
  function draw3(p0, t, o) {
    const C = fit(o.palette, 8), ink = hex(o.color), p = clipTo(p0), { h, w } = shape(t), fl = 0.85 + 0.15 * rand(Math.floor(t * 30), 7, o.seed);
    if (t >= OPEN1 + 0.02 && t < OPEN1 + 0.6) {
      const u = (t - OPEN1) / 0.6, band2 = -20 + u * (H + 40);
      for (let y = 0; y < H; y++) {
        const k = 0.22 * (1 - u) ** 2 + 0.3 * Math.max(0, 1 - Math.abs(y - band2) / 10) ** 2 * (1 - u) + (y & 1 ? 0.05 * (1 - u) : 0);
        if (k > 0.01) for (let x = 0; x < W; x += 1) p0.light(x, y, C[5], k);
      }
      return;
    }
    if (h >= H) return;
    const top = Math.round(YC - h / 2), bot = Math.round(YC + h / 2);
    if (top > 0) rect(p0, 0, 0, W, top, ink);
    if (bot < H) rect(p0, 0, bot, W, H - bot, ink);
    if (h > 2) {
      const sq = 1 - h / H;
      for (let y = top; y < bot; y++) {
        const e = Math.min(y - top, bot - 1 - y), k = 0.55 * sq * sq + (y & 1 ? 0.08 * sq : 0) + 0.35 * Math.max(0, 1 - e / 6) ** 2;
        for (let x = 0; x < W; x++) p0.light(x, y, C[5], k * fl);
      }
      for (const y of [top - 1, bot]) if (y >= 0 && y < H) rect(p0, 0, y, W, 1, sq > 0.6 ? C[6] : C[5]);
      return;
    }
    const dotPhase = t >= LN1 && t < ON0, x0 = Math.floor(XC - w), x1 = Math.ceil(XC + w), fresh = t < SQ1 + 0.08 || t > ON0 && t < ON1 + 0.04;
    if (h > 0 && w >= 1) {
      const fr = Math.floor(t * 30);
      for (let x = Math.max(0, x0); x < Math.min(W, x1); x++) {
        const u = Math.abs(x + 0.5 - XC) / w, y = YC + Math.round(noise(x / 23 + t * 9, o.seed) * (0.7 + 0.5 * u));
        p0.px(x, y, u < 0.85 ? WHITE : C[6]);
        if (u < 0.92) p0.px(x, y - 1, C[6]), p0.px(x, y + 1, u < 0.6 ? C[6] : C[5]);
        if (fresh && u < 0.8) p0.dot(x, y - 2, C[4], 0.5), p0.dot(x, y + 2, C[4], 0.5);
        if (rand(x, fr, o.seed + 3) < 0.06) p.px(x, y + (rand(x, fr, o.seed + 4) < 0.5 ? -1 : 1) * (2 + Math.floor(rand(x, fr, o.seed + 5) * 4)), rand(x, fr, 6) < 0.5 ? WHITE : C[5]);
        p0.light(x, y, C[6], 0.5 * fl * (1 - u * 0.6));
      }
      for (let x = x0; x <= x1; x += 9) p.glow(x, YC, 10, C[5], 0.35 * fl);
      p.glow(XC, YC, Math.min(70, 16 + w * 0.4), C[5], 0.4 * fl);
    }
    if (dotPhase) {
      const u = (t - LN1) / (DOT1 - LN1);
      if (u < 0.35) glint2(p, XC, YC, 10 * (1 - u / 0.35) + 3, 0.2 + u * 2, C[6], C[5]);
      if (u < 1) {
        p.px(XC, YC, u < 0.5 ? WHITE : u < 0.75 ? C[6] : C[4]);
        p.px(XC - 1, YC, u < 0.4 ? C[6] : C[4]);
        const sm = Math.round(9 * (1 - u));
        for (let k = 2; k <= sm; k++) p.dot(XC - k, YC, C[4], 1 - k / (sm + 1)), p.dot(XC + k - 1, YC, C[4], 1 - k / (sm + 1));
        p.glow(XC, YC, 22 * (1 - u * 0.5), C[5], 0.55 * (1 - u) ** 1.5);
      }
    }
    const s = t - ON0;
    if (s >= 0 && s < 0.14) glint2(p, XC, YC, 12 * (1 - s / 0.14) + 2, 0.4 + s * 6, C[6], C[5]), p.glow(XC, YC, 40, WHITE, 0.5 * (1 - s / 0.14));
  }

  // packages/fx/src/vendor/pixelfx/fx/transitions/glitch-wipe.js
  var glitch_wipe_exports = {};
  __export(glitch_wipe_exports, {
    draw: () => draw4,
    meta: () => meta10
  });
  var meta10 = screenMeta({
    name: "Glitch wipe",
    desc: "Torn bands of black stutter across the screen, freezing and jerking back, their ragged edges split into magenta and cyan ghosts spitting data slivers; then they tear on through.",
    tags: ["glitch", "digital", "rgb", "bands", "wipe"],
    duration: 1.8,
    options: { palette: PAL.cyber, split: "#ff2d6f", seed: 1 }
  });
  var TICK = 1 / 18;
  var IN0 = 0.03;
  var IN1 = 0.78;
  var OUT0 = 0.98;
  var OUT1 = 1.66;
  var cache2 = /* @__PURE__ */ new Map();
  function bands(seed) {
    if (cache2.has(seed)) return cache2.get(seed);
    const out = [];
    for (let y = 0, i = 0; y < H; i++) {
      const r = rand(i, seed), h = Math.min(H - y, r < 0.4 ? 5 + Math.floor(rand(i, seed + 1) * 6) : r < 0.85 ? 10 + Math.floor(rand(i, seed + 1) * 10) : 20 + Math.floor(rand(i, seed + 1) * 12));
      const a = clamp(0.5 + 0.55 * noise(y / 40, seed + 9) + (rand(i, seed + 2) - 0.5) * 0.25), b = clamp(0.5 + 0.55 * noise(y / 40, seed + 19) + (rand(i, seed + 3) - 0.5) * 0.25);
      const span = 0.32 + rand(i, seed + 6) * 0.12;
      out.push({ i, y, h, dir: rand(i, seed + 4) < 0.82 ? 1 : -1, off: rand(i, seed + 5), t0: IN0 + a * (IN1 - IN0 - span), t1: IN0 + a * (IN1 - IN0 - span) + span, o0: OUT0 + b * (OUT1 - OUT0 - span), o1: OUT0 + b * (OUT1 - OUT0 - span) + span });
      y += h;
    }
    cache2.set(seed, out);
    return out;
  }
  function tear(b, t, t0, t1, salt) {
    if (t <= t0) return 0;
    if (t >= t1) return 1;
    let n = Math.floor((t + b.off * TICK) / TICK);
    while (n > 0 && rand(n, b.i, salt) < 0.22) n--;
    const tq = n * TICK - b.off * TICK, u = clamp((tq - t0) / (t1 - t0));
    return clamp(ease.inOutQuad(u) + (rand(n, b.i, salt + 1) - 0.6) * 0.12 * Math.sin(Math.PI * u));
  }
  function draw4(p0, t, o) {
    const C = fit(o.palette, 8), ink = hex(o.color), RED = hex(o.split), p = clipTo(p0), B2 = bands(o.seed), fr = Math.floor(t / TICK);
    const out = t >= OUT0;
    for (const b of B2) {
      const k = out ? tear(b, t, b.o0, b.o1, 7) : tear(b, t, b.t0, b.t1, 3);
      if (!out && k <= 0 || out && k >= 1) continue;
      const moving = k > 0 && k < 1, slip = moving && rand(fr, b.i, 11) < 0.12 ? Math.round((rand(fr, b.i, 12) - 0.5) * 18) : 0;
      const fwd = b.dir, e = (b.dir > 0 ? k * W : W - k * W) + slip;
      for (let y = b.y; y < b.y + b.h; y++) {
        const jag = moving ? Math.round((rand(fr, y, 14) - 0.5) * 6 + (rand(fr >> 1, b.i, 15) - 0.5) * 6) : 0, ex2 = clamp(Math.round(e + jag), 0, W);
        const behind = fwd > 0 !== out;
        if (behind) ex2 > 0 && rect(p0, 0, y, ex2, 1, ink);
        else ex2 < W && rect(p0, ex2, y, W - ex2, 1, ink);
        if (!moving) continue;
        const e1 = behind ? ex2 - 1 : ex2, side = behind ? 1 : -1, sp = 2 + (b.i + fr) % 3;
        p.px(e1, y, WHITE);
        p.px(e1 + side * sp, y, RED), p.px(e1 + side * (sp + 1), y, RED);
        p.px(e1 - side * (sp + 1), y, C[5]), p.px(e1 - side * (sp + 2), y, C[4]);
        p.light(e1, y, WHITE, 0.45);
        p.light(e1 + side * (sp + 1), y, RED, 0.5), p.light(e1 + side * (sp + 3), y, RED, 0.22);
        p.light(e1 - side * (sp + 1), y, C[5], 0.45), p.light(e1 - side * (sp + 3), y, C[5], 0.22);
      }
      if (!moving) continue;
      const ex = clamp(Math.round(e), 0, W), open = fwd > 0 !== out ? 1 : -1;
      p.glow(ex, b.y + b.h / 2, b.h * 0.7 + 7, b.i & 1 ? RED : C[5], 0.28);
      for (let s = 0; s < b.h; s++) {
        if (rand(fr, b.i, 100 + s) > 0.55) continue;
        const x = ex + open * Math.round(rand(fr, b.i, 200 + s) ** 2 * 22 - 4), y = b.y + Math.floor(rand(fr, b.i, 300 + s) * b.h);
        p.px(x, y, [WHITE, C[6], C[5], RED][Math.floor(rand(fr, b.i, 400 + s) * 4)]);
      }
      for (let s = 0; s < 4; s++) {
        if (rand(fr, b.i, 20 + s) > 0.5) continue;
        const len2 = 2 + Math.floor(rand(fr, b.i, 30 + s) ** 2 * 60), ahead = rand(fr, b.i, 40 + s) < 0.6;
        const d = Math.floor(rand(fr, b.i, 50 + s) ** 1.5 * 70) + 4, y = b.y + Math.floor(rand(fr, b.i, 60 + s) * b.h);
        const x = ahead ? open > 0 ? ex + d : ex - d - len2 : open > 0 ? ex - d - len2 : ex + d, c = [WHITE, C[6], C[5], RED][Math.floor(rand(fr, b.i, 70 + s) * 4)];
        p.rect(x, y, len2, 1, c);
        for (let q = 0; q < len2; q += 3) p.light(x + q, y, c, 0.35);
      }
      if (b.h >= 8 && rand(fr, b.i, 80) < 0.35) {
        const bw = 6 + Math.floor(rand(fr, b.i, 81) * 10), bh = 3 + Math.floor(rand(fr, b.i, 82) * Math.min(6, b.h - 3)), x = ex + open * Math.floor(rand(fr, b.i, 83) * 24 - 4) - (open < 0 ? bw : 0);
        const y = b.y + Math.floor(rand(fr, b.i, 84) * (b.h - bh)), c = rand(fr, b.i, 85) < 0.5 ? C[5] : RED;
        p.rect(x, y, bw, 1, c), p.rect(x, y + bh - 1, bw, 1, c), p.rect(x, y, 1, bh, c), p.rect(x + bw - 1, y, 1, bh, c);
        for (let q = 0; q < bw; q += 2) p.light(x + q, y, c, 0.25);
      }
    }
    if (t > IN1 && t < OUT0 + 0.05)
      for (let s = 0; s < 3; s++) {
        if (rand(fr, s, 90) > 0.4) continue;
        const y = Math.floor(rand(fr, s, 91) * H), x = Math.floor(rand(fr, s, 92) * W), len2 = 3 + Math.floor(rand(fr, s, 93) ** 2 * 40);
        p.rect(x, y, len2, 1, s === 0 ? C[4] : s === 1 ? C[3] : RED);
      }
  }

  // packages/fx/src/index.js
  var PALETTES = {
    shu: ["#1a0806", "#3d110c", "#6b1d16", "#a8322d", "#cf4a3c", "#f07a5e", "#ffc2a8", "#fff4ec"],
    ink: ["#050505", "#141414", "#2a2a28", "#4a4842", "#7d7a72", "#b3afa5", "#e0ddd4", "#ffffff"],
    gold: ["#1a1206", "#3d2a0c", "#6e4d16", "#a87a2a", "#d6a548", "#ebc77a", "#f7e6b8", "#fffbef"],
    up: ["#06140e", "#0e2e20", "#1b4f38", "#2f7a58", "#5fae8c", "#8fd0b0", "#c8ecd9", "#f2fffa"],
    down: ["#1a060b", "#3d0f1b", "#6e1a30", "#a82a4a", "#f2607c", "#f78fa3", "#fcc8d3", "#fff2f5"]
  };
  var P2 = PALETTES;
  var MOMENTS = {
    filled: { source: "pickups/collect-burst", zh: "\u6210\u4EA4", fx: collect_burst_exports, opts: { palette: P2.up } },
    alert: { source: "ui/exclamation", zh: "\u544A\u8B66\u89E6\u53D1", fx: exclamation_exports, opts: { palette: P2.shu } },
    target: { source: "ui/quest-complete", zh: "\u6B62\u76C8 / \u76EE\u6807\u8FBE\u6210", fx: quest_complete_exports, opts: { palette: P2.gold, ribbon: P2.shu.slice(0, 7), text: "TARGET HIT" } },
    open: { source: "ui/countdown", zh: "\u5F00\u76D8\u5012\u8BA1\u65F6", fx: countdown_exports, opts: { palette: P2.ink, go: P2.up, word: "OPEN" } },
    breakout: { source: "lightning/zap-hit", zh: "\u7A81\u7834", fx: zap_hit_exports, opts: { palette: P2.gold } },
    arming: { source: "lightning/charge-up", zh: "\u59D4\u6258\u6392\u961F / \u84C4\u529B", fx: charge_up_exports, opts: { palette: P2.shu, sparks: ["#ffffff", P2.shu[6], P2.shu[5], P2.shu[3]] } },
    locked: { source: "scifi/force-field", zh: "\u4EA4\u6613\u9501\u751F\u6548", fx: force_field_exports, opts: { palette: P2.ink, sparks: [P2.shu[6], P2.shu[5], P2.shu[4], P2.shu[3]] } },
    engine: { source: "scifi/energy-core", zh: "\u5F15\u64CE\u8FD0\u884C\uFF08\u52A0\u8F7D\u4E2D\uFF09", fx: energy_core_exports, opts: { palette: P2.shu, metal: P2.ink.slice(0, 6) } },
    offline: { source: "transitions/crt-off", zh: "\u65AD\u7EBF", fx: crt_off_exports, opts: { palette: P2.ink, color: "#050505" } },
    reconnect: { source: "transitions/glitch-wipe", zh: "\u91CD\u8FDE", fx: glitch_wipe_exports, opts: { palette: P2.ink, color: "#050505", split: P2.shu[4] } }
  };
  function play(canvas, id, { scale: scale2 = 2, opts = {}, onDone } = {}) {
    const m = MOMENTS[id];
    if (!m) throw new Error(`\u6CA1\u6709\u8FD9\u4E2A\u65F6\u523B\uFF1A${id}`);
    const { size: [w, h], origin: [ox, oy], loop } = m.fx.meta;
    canvas.width = w;
    canvas.height = h;
    canvas.style.width = w * scale2 + "px";
    canvas.style.height = h * scale2 + "px";
    canvas.style.imageRendering = "pixelated";
    const ctx = canvas.getContext("2d"), frame2 = createFrame(w, h), img = new ImageData(w, h);
    const fx = createFx(m.fx, { ...m.opts, ...opts, x: ox, y: oy });
    let last = performance.now(), raf = 0, stopped = false;
    const tick = (now) => {
      if (stopped) return;
      const dt = Math.max(0, Math.min(0.1, (now - last) / 1e3));
      last = Math.max(last, now);
      try {
        fx.update(dt);
        clearFrame(frame2);
        fx.draw(frame2, "back");
        fx.draw(frame2, "front");
        img.data.fill(0);
        composite(frame2, img.data, null);
        ctx.putImageData(img, 0, 0);
      } catch (err) {
        stopped = true;
        console.error(`[katana-fx] ${id}`, err);
        return;
      }
      if (!loop && fx.done()) {
        stopped = true;
        onDone?.();
        return;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => {
      stopped = true;
      cancelAnimationFrame(raf);
      ctx.clearRect(0, 0, w, h);
    };
  }

  // ../../../tmp/fxdemo.js
  var wrap2 = document.getElementById("w");
  for (const id of Object.keys(MOMENTS)) {
    const d = document.createElement("figure"), c = document.createElement("canvas"), cap = document.createElement("figcaption");
    cap.textContent = id + " \xB7 " + MOMENTS[id].zh;
    d.append(c, cap);
    wrap2.append(d);
    play(c, id, { scale: 1, opts: {} });
  }
})();
