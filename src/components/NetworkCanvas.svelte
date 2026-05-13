<script lang="ts">
  import { onMount } from 'svelte';

  const MAX_NODES = 80;
  const LINK_DIST = 180;
  const SPAWN_MS = 90;    // ms between spawn ticks while hovering
  const SPAWN_RADIUS = 100; // spawn spread around cursor

  interface Node {
    x: number; y: number;
    vx: number; vy: number;
    r: number;
    alpha: number; // 0→1 fade-in
  }

  let canvas: HTMLCanvasElement;

  // All perf-critical state lives outside Svelte reactivity
  const S = {
    nodes: [] as Node[],
    mx: -9999, my: -9999, hovering: false,
    lastSpawn: 0,
    color:  '21, 23, 26',
    accent: '59, 111, 176',
    w: 0, h: 0, dpr: 1,
    reduced: false,
    raf: 0,
  };

  function readColors() {
    const cs = getComputedStyle(document.documentElement);
    const ink = cs.getPropertyValue('--ink-rgb').trim();
    const acc = cs.getPropertyValue('--accent-rgb').trim();
    if (ink) S.color  = ink;
    if (acc) S.accent = acc;
  }

  function resize() {
    S.w = window.innerWidth;
    S.h = window.innerHeight;
    S.dpr = Math.min(2, window.devicePixelRatio || 1);
    canvas.width  = S.w * S.dpr;
    canvas.height = S.h * S.dpr;
    canvas.style.width  = S.w + 'px';
    canvas.style.height = S.h + 'px';
    canvas.getContext('2d')!.setTransform(S.dpr, 0, 0, S.dpr, 0, 0);
  }

  function trySpawn(ts: number) {
    if (!S.hovering || S.reduced || S.nodes.length >= MAX_NODES) return;
    if (ts - S.lastSpawn < SPAWN_MS) return;
    const count = Math.random() < 0.3 ? 2 : 1;
    for (let i = 0; i < count && S.nodes.length < MAX_NODES; i++) {
      const angle = Math.random() * Math.PI * 2;
      const dist  = 20 + Math.random() * SPAWN_RADIUS;
      const x = S.mx + Math.cos(angle) * dist;
      const y = S.my + Math.sin(angle) * dist;
      if (x < -20 || x > S.w + 20 || y < -20 || y > S.h + 20) continue;
      const speed = 0.08 + Math.random() * 0.16;
      // Velocity biased outward from cursor so nodes drift away naturally
      S.nodes.push({
        x, y,
        vx: Math.cos(angle) * speed * (0.4 + Math.random() * 0.9),
        vy: Math.sin(angle) * speed * (0.4 + Math.random() * 0.9),
        r: 1.4 + Math.random() * 0.8,
        alpha: 0,
      });
    }
    S.lastSpawn = ts;
  }

  function frame(ts: number) {
    const ctx = canvas.getContext('2d')!;
    ctx.clearRect(0, 0, S.w, S.h);
    if (S.nodes.length === 0) { S.raf = requestAnimationFrame(frame); return; }

    trySpawn(ts);

    // Drift & wrap
    for (const n of S.nodes) {
      if (!S.reduced) { n.x += n.vx; n.y += n.vy; }
      if (n.x < -20)     n.x = S.w + 20;
      if (n.x > S.w + 20) n.x = -20;
      if (n.y < -20)     n.y = S.h + 20;
      if (n.y > S.h + 20) n.y = -20;
      n.alpha = Math.min(1, n.alpha + 0.022);
    }

    // Edges
    const linkSq = LINK_DIST * LINK_DIST;
    for (let i = 0; i < S.nodes.length; i++) {
      const a = S.nodes[i];
      for (let j = i + 1; j < S.nodes.length; j++) {
        const b = S.nodes[j];
        const dx = a.x - b.x, dy = a.y - b.y;
        const d2 = dx * dx + dy * dy;
        if (d2 > linkSq) continue;
        const t = 1 - Math.sqrt(d2) / LINK_DIST;
        const ea = 0.16 * t * t * Math.min(a.alpha, b.alpha);
        ctx.strokeStyle = `rgba(${S.color}, ${ea})`;
        ctx.lineWidth = 0.6;
        ctx.beginPath();
        ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y);
        ctx.stroke();
      }
    }

    // Nodes
    for (let i = 0; i < S.nodes.length; i++) {
      const n = S.nodes[i];
      const isAccent = i % 11 === 0;
      const c = isAccent ? S.accent : S.color;
      const base = isAccent ? 0.36 : 0.42;
      ctx.fillStyle = `rgba(${c}, ${base * n.alpha})`;
      ctx.beginPath();
      ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
      ctx.fill();
    }

    // Cursor-to-nearby-node highlight
    if (S.hovering) {
      for (const n of S.nodes) {
        const dx = n.x - S.mx, dy = n.y - S.my;
        const d2 = dx * dx + dy * dy;
        if (d2 > 130 * 130) continue;
        const t = 1 - Math.sqrt(d2) / 130;
        ctx.strokeStyle = `rgba(${S.accent}, ${0.32 * t * n.alpha})`;
        ctx.lineWidth = 0.7;
        ctx.beginPath();
        ctx.moveTo(S.mx, S.my); ctx.lineTo(n.x, n.y);
        ctx.stroke();
      }
    }

    S.raf = requestAnimationFrame(frame);
  }

  onMount(() => {
    // Reduced motion
    const prm = window.matchMedia('(prefers-reduced-motion: reduce)');
    S.reduced = prm.matches;
    prm.addEventListener('change', (e: MediaQueryListEvent) => { S.reduced = e.matches; });

    // Colors — read from CSS vars so dark mode works automatically
    readColors();
    window.matchMedia('(prefers-color-scheme: dark)')
      .addEventListener('change', readColors);

    resize();
    window.addEventListener('resize', resize);

    window.addEventListener('pointermove', (e) => {
      S.mx = e.clientX; S.my = e.clientY; S.hovering = true;
    });
    window.addEventListener('pointerleave', () => { S.hovering = false; });
    window.addEventListener('blur',        () => { S.hovering = false; });

    S.raf = requestAnimationFrame(frame);
    return () => {
      cancelAnimationFrame(S.raf);
      window.removeEventListener('resize', resize);
    };
  });
</script>

<canvas bind:this={canvas} id="network-canvas" aria-hidden="true"></canvas>
