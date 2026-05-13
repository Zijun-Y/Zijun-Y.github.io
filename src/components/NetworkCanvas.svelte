<script lang="ts">
  import { onMount } from 'svelte';

  const MAX_NODES    = 80;
  const LINK_DIST    = 200;  // max px for an edge
  const MAX_EDGES    = 2;    // each node draws at most 2 edges (sparse tree)
  const SPAWN_MS     = 400;  // ms between cursor spawns
  const SPAWN_RADIUS = 120;

  const FADE_IN_RATE  = 0.020;
  const FADE_OUT_RATE = 0.012;

  // Frames before singleton/leaf culling kicks in (~5s at 60fps).
  // Long grace period lets nodes fade in, drift, and find neighbours before
  // being judged as isolated — without this, all nodes die on frame 1 since
  // newly-created nodes start at alpha=0 and appear unconnected.
  const CULL_GRACE   = 300;

  const AGE_SEED   = 2200;
  const AGE_CURSOR = 1400;

  interface Node {
    x: number; y: number;
    vx: number; vy: number;
    r: number;
    alpha: number;
    age: number;
    maxAge: number;
    dying: boolean;
  }

  let canvas: HTMLCanvasElement;

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

  function makeNode(x: number, y: number, vx: number, vy: number, seeded: boolean): Node {
    const maxAge = (seeded ? AGE_SEED : AGE_CURSOR) + Math.random() * 300;
    return { x, y, vx, vy, r: 1.4 + Math.random() * 0.8, alpha: 0, age: 0, maxAge, dying: false };
  }

  function seedNodes(count: number) {
    for (let i = 0; i < count && S.nodes.length < MAX_NODES; i++) {
      const x = 40 + Math.random() * (S.w - 80);
      const y = 40 + Math.random() * (S.h - 80);
      const angle = Math.random() * Math.PI * 2;
      const speed = 0.025 + Math.random() * 0.05;
      S.nodes.push(makeNode(x, y, Math.cos(angle) * speed, Math.sin(angle) * speed, true));
    }
  }

  function trySpawn(ts: number) {
    if (!S.hovering || S.reduced || S.nodes.length >= MAX_NODES) return;
    if (ts - S.lastSpawn < SPAWN_MS) return;

    const count = Math.random() < 0.25 ? 2 : 1;
    for (let i = 0; i < count && S.nodes.length < MAX_NODES; i++) {
      const angle = Math.random() * Math.PI * 2;
      const dist  = 20 + Math.random() * SPAWN_RADIUS;
      const x = S.mx + Math.cos(angle) * dist;
      const y = S.my + Math.sin(angle) * dist;
      if (x < -20 || x > S.w + 20 || y < -20 || y > S.h + 20) continue;
      const speed = 0.05 + Math.random() * 0.10;
      S.nodes.push(makeNode(
        x, y,
        Math.cos(angle) * speed * (0.4 + Math.random() * 0.8),
        Math.sin(angle) * speed * (0.4 + Math.random() * 0.8),
        false,
      ));
    }
    S.lastSpawn = ts;
  }

  // Draws sparse nearest-neighbour edges (tree-style, at most MAX_EDGES per node).
  // Computes degree for ALL nodes regardless of alpha so newly-fading nodes are
  // counted as neighbours and aren't incorrectly treated as singletons.
  function drawEdgesAndDegree(ctx: CanvasRenderingContext2D, nodes: Node[]): Int32Array {
    const linkSq = LINK_DIST * LINK_DIST;
    const degree = new Int32Array(nodes.length);
    const drawn  = new Set<number>();

    for (let i = 0; i < nodes.length; i++) {
      const a = nodes[i];

      // Collect neighbours (all nodes, even fading-in ones)
      const nbrs: { j: number; d2: number }[] = [];
      for (let j = 0; j < nodes.length; j++) {
        if (i === j) continue;
        const dx = a.x - nodes[j].x, dy = a.y - nodes[j].y;
        const d2 = dx * dx + dy * dy;
        if (d2 < linkSq) nbrs.push({ j, d2 });
      }
      nbrs.sort((p, q) => p.d2 - q.d2);

      let drawn_count = 0;
      for (const { j, d2 } of nbrs) {
        if (drawn_count >= MAX_EDGES) break;
        const key = i < j ? i * MAX_NODES + j : j * MAX_NODES + i;
        if (drawn.has(key)) { drawn_count++; continue; }
        drawn.add(key);
        drawn_count++;

        // Degree counted for both endpoints regardless of visibility
        degree[i]++;
        degree[j]++;

        // Only actually draw the line when both nodes are visible enough
        const b = nodes[j];
        const visA = a.alpha, visB = b.alpha;
        if (visA < 0.01 && visB < 0.01) continue;

        const t  = 1 - Math.sqrt(d2) / LINK_DIST;
        const ea = 0.26 * t * t * Math.min(visA, visB);
        if (ea < 0.005) continue;
        ctx.strokeStyle = `rgba(${S.color}, ${ea})`;
        ctx.lineWidth = 0.6;
        ctx.beginPath();
        ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y);
        ctx.stroke();
      }
    }

    return degree;
  }

  function frame(ts: number) {
    const ctx = canvas.getContext('2d')!;
    ctx.clearRect(0, 0, S.w, S.h);

    trySpawn(ts);

    // Drift, wrap, age
    for (const n of S.nodes) {
      if (!S.reduced) { n.x += n.vx; n.y += n.vy; }
      if (n.x < -20)      n.x = S.w + 20;
      if (n.x > S.w + 20) n.x = -20;
      if (n.y < -20)      n.y = S.h + 20;
      if (n.y > S.h + 20) n.y = -20;
      n.age++;
      if (!n.dying && n.age >= n.maxAge) n.dying = true;
    }

    if (S.nodes.length === 0) { S.raf = requestAnimationFrame(frame); return; }

    const degree = drawEdgesAndDegree(ctx, S.nodes);

    // Cull singletons and leaves — but only after CULL_GRACE frames so nodes
    // have time to fade in and drift near neighbours before being judged.
    for (let i = 0; i < S.nodes.length; i++) {
      const n = S.nodes[i];
      if (!n.dying && n.age > CULL_GRACE && degree[i] <= 1) {
        n.dying = true;
      }
    }

    // Fade in / out, garbage-collect
    const alive: Node[] = [];
    for (const n of S.nodes) {
      if (n.dying) {
        n.alpha -= FADE_OUT_RATE;
        if (n.alpha <= 0) continue;
      } else {
        n.alpha = Math.min(1, n.alpha + FADE_IN_RATE);
      }
      alive.push(n);
    }
    S.nodes = alive;

    // Draw nodes
    for (let i = 0; i < S.nodes.length; i++) {
      const n = S.nodes[i];
      if (n.alpha < 0.01) continue;
      const isAccent = i % 11 === 0;
      const c    = isAccent ? S.accent : S.color;
      const base = isAccent ? 0.48 : 0.55;
      ctx.fillStyle = `rgba(${c}, ${base * n.alpha})`;
      ctx.beginPath();
      ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
      ctx.fill();
    }

    // Cursor highlight
    if (S.hovering) {
      for (const n of S.nodes) {
        const dx = n.x - S.mx, dy = n.y - S.my;
        const d2 = dx * dx + dy * dy;
        if (d2 > 140 * 140) continue;
        const t = 1 - Math.sqrt(d2) / 140;
        ctx.strokeStyle = `rgba(${S.accent}, ${0.35 * t * n.alpha})`;
        ctx.lineWidth = 0.7;
        ctx.beginPath();
        ctx.moveTo(S.mx, S.my); ctx.lineTo(n.x, n.y);
        ctx.stroke();
      }
    }

    S.raf = requestAnimationFrame(frame);
  }

  onMount(() => {
    const prm = window.matchMedia('(prefers-reduced-motion: reduce)');
    S.reduced = prm.matches;
    prm.addEventListener('change', (e: MediaQueryListEvent) => { S.reduced = e.matches; });

    readColors();
    window.matchMedia('(prefers-color-scheme: dark)')
      .addEventListener('change', readColors);

    resize();
    window.addEventListener('resize', resize);
    seedNodes(28);

    window.addEventListener('pointermove', (e) => {
      S.mx = e.clientX; S.my = e.clientY; S.hovering = true;
    });
    window.addEventListener('pointerleave', () => { S.hovering = false; });
    window.addEventListener('blur',         () => { S.hovering = false; });

    S.raf = requestAnimationFrame(frame);
    return () => {
      cancelAnimationFrame(S.raf);
      window.removeEventListener('resize', resize);
    };
  });
</script>

<canvas bind:this={canvas} id="network-canvas" aria-hidden="true"></canvas>
