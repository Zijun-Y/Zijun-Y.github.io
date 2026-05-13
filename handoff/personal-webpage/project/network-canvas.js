// network-canvas.js
// Realtime "ink on paper" network background.
// Sparse warm-toned nodes drift slowly, edges fade in when nodes pass close.
// Tuned to read as a paper texture rather than a tech demo — low contrast,
// no saturation, generous spacing. Respects prefers-reduced-motion.
//
// Configure via window.__networkConfig before/after init; intensity:
//   'off'    — paused, fully transparent
//   'subtle' — ~38 nodes, low opacity, slow drift (default)
//   'lively' — ~80 nodes, higher opacity, brisker drift

(function () {
  const canvas = document.getElementById('network-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  const PRESETS = {
    off:    { count: 0,   speed: 0,    nodeAlpha: 0,    edgeAlpha: 0,    linkDist: 0,   nodeRadius: 1.6 },
    subtle: { count: 38,  speed: 0.10, nodeAlpha: 0.42, edgeAlpha: 0.16, linkDist: 180, nodeRadius: 1.8 },
    lively: { count: 80,  speed: 0.22, nodeAlpha: 0.55, edgeAlpha: 0.22, linkDist: 200, nodeRadius: 2.0 },
  };

  const state = {
    nodes: [],
    dpr: 1,
    width: 0,
    height: 0,
    mouse: { x: -9999, y: -9999, active: false },
    cfg: PRESETS.subtle,
    color: '27, 23, 20',     // ink rgb
    accent: '184, 92, 56',   // accent rgb
    raf: null,
    reduceMotion: false,
  };

  const prm = window.matchMedia?.('(prefers-reduced-motion: reduce)');
  state.reduceMotion = !!prm?.matches;
  prm?.addEventListener?.('change', (e) => { state.reduceMotion = e.matches; });

  function resize() {
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    state.dpr = dpr;
    state.width = window.innerWidth;
    state.height = window.innerHeight;
    canvas.width = state.width * dpr;
    canvas.height = state.height * dpr;
    canvas.style.width = state.width + 'px';
    canvas.style.height = state.height + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    seed();
  }

  function seed() {
    const { count } = state.cfg;
    // Reuse existing positions when growing/shrinking to avoid flash.
    const next = [];
    for (let i = 0; i < count; i++) {
      const prev = state.nodes[i];
      if (prev) { next.push(prev); continue; }
      next.push({
        x: Math.random() * state.width,
        y: Math.random() * state.height,
        vx: (Math.random() - 0.5) * state.cfg.speed,
        vy: (Math.random() - 0.5) * state.cfg.speed,
        r: state.cfg.nodeRadius * (0.7 + Math.random() * 0.6),
      });
    }
    state.nodes = next;
  }

  function step() {
    const { width: W, height: H, cfg, color, accent, mouse } = state;
    ctx.clearRect(0, 0, W, H);
    if (cfg.count === 0) { state.raf = requestAnimationFrame(step); return; }

    const speedScale = state.reduceMotion ? 0 : 1;

    // Update positions
    for (const n of state.nodes) {
      n.x += n.vx * speedScale;
      n.y += n.vy * speedScale;
      // Wrap with a small buffer so nodes don't pop in/out on edges.
      if (n.x < -20) n.x = W + 20;
      if (n.x > W + 20) n.x = -20;
      if (n.y < -20) n.y = H + 20;
      if (n.y > H + 20) n.y = -20;

      // Soft cursor repulsion — feels like ink shying away.
      if (mouse.active) {
        const dx = n.x - mouse.x;
        const dy = n.y - mouse.y;
        const d2 = dx * dx + dy * dy;
        if (d2 < 140 * 140 && d2 > 0.01) {
          const d = Math.sqrt(d2);
          const f = (140 - d) / 140 * 0.6;
          n.x += (dx / d) * f;
          n.y += (dy / d) * f;
        }
      }
    }

    // Edges — O(n²) but n is small.
    const { linkDist, edgeAlpha } = cfg;
    const linkSq = linkDist * linkDist;
    for (let i = 0; i < state.nodes.length; i++) {
      const a = state.nodes[i];
      for (let j = i + 1; j < state.nodes.length; j++) {
        const b = state.nodes[j];
        const dx = a.x - b.x, dy = a.y - b.y;
        const d2 = dx * dx + dy * dy;
        if (d2 > linkSq) continue;
        const t = 1 - Math.sqrt(d2) / linkDist;
        ctx.strokeStyle = `rgba(${color}, ${edgeAlpha * t * t})`;
        ctx.lineWidth = 0.6;
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.stroke();
      }
    }

    // Nodes — with one in N accented in warm rust to tie to the brand.
    for (let i = 0; i < state.nodes.length; i++) {
      const n = state.nodes[i];
      const isAccent = i % 11 === 0;
      const c = isAccent ? accent : color;
      const a = isAccent ? cfg.nodeAlpha * 0.85 : cfg.nodeAlpha;
      ctx.fillStyle = `rgba(${c}, ${a})`;
      ctx.beginPath();
      ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
      ctx.fill();
    }

    // Cursor highlight: edges from mouse to nearby nodes.
    if (mouse.active) {
      for (const n of state.nodes) {
        const dx = n.x - mouse.x, dy = n.y - mouse.y;
        const d2 = dx * dx + dy * dy;
        if (d2 > 130 * 130) continue;
        const t = 1 - Math.sqrt(d2) / 130;
        ctx.strokeStyle = `rgba(${accent}, ${0.35 * t})`;
        ctx.lineWidth = 0.7;
        ctx.beginPath();
        ctx.moveTo(mouse.x, mouse.y);
        ctx.lineTo(n.x, n.y);
        ctx.stroke();
      }
    }

    state.raf = requestAnimationFrame(step);
  }

  // ── Public API ───────────────────────────────────────────────────────────
  window.__network = {
    setIntensity(name) {
      const next = PRESETS[name] || PRESETS.subtle;
      state.cfg = next;
      seed();
    },
    setColors({ ink, accent }) {
      if (ink) state.color = ink;
      if (accent) state.accent = accent;
    },
  };

  // Mouse tracking — pointer-move is throttled by rAF naturally via redraw.
  window.addEventListener('pointermove', (e) => {
    state.mouse.x = e.clientX;
    state.mouse.y = e.clientY;
    state.mouse.active = true;
  });
  window.addEventListener('pointerleave', () => { state.mouse.active = false; });
  window.addEventListener('blur', () => { state.mouse.active = false; });

  window.addEventListener('resize', resize);
  resize();
  step();
})();
