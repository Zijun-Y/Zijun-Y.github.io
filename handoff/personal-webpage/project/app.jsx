// app.jsx — Zijun Yu personal site sketch
// Editorial "ink on paper" academic feel. Single page, fast first paint.
// Header (Get in touch · wordmark) → Hero → Publications (with floating year
// rail) → Footer. Get in touch opens a slide-out contact panel.

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "palette": ["#EDEEEA", "#15171A", "#3B6FB0"],
  "typePairing": "serif-led",
  "density": "comfortable",
  "network": "subtle",
  "accent": "#3B6FB0",
  "showGrain": false
}/*EDITMODE-END*/;

// Curated palettes — [bg, ink, accent]
const PALETTES = [
  ["#F4EEE3", "#1B1714", "#B85C38"], // warm cream + rust
  ["#EFE9DD", "#2A2520", "#8A6E3A"], // sand + olive
  ["#EDEEEA", "#15171A", "#3B6FB0"], // cool stone + blue   (default)
  ["#F6F2EC", "#1B1714", "#5A6E4B"], // moss
  ["#15110E", "#F2EADC", "#C9A270"], // dark ink (noir)
];

// Type pairings: [displayFamily, sansFamily, monoFamily, ...]
const TYPE_PAIRINGS = {
  "serif-led": {
    display: '"Newsreader", "Source Serif 4", Georgia, serif',
    body:    '"Geist", ui-sans-serif, system-ui, sans-serif',
    mono:    '"Geist Mono", ui-monospace, "SF Mono", monospace',
    displayWeight: 400,
    headingTracking: '-0.02em',
  },
  "sans-led": {
    display: '"Geist", ui-sans-serif, system-ui, sans-serif',
    body:    '"Geist", ui-sans-serif, system-ui, sans-serif',
    mono:    '"Geist Mono", ui-monospace, "SF Mono", monospace',
    displayWeight: 500,
    headingTracking: '-0.035em',
  },
  "mono-led": {
    display: '"Geist Mono", ui-monospace, monospace',
    body:    '"Geist", ui-sans-serif, system-ui, sans-serif',
    mono:    '"Geist Mono", ui-monospace, "SF Mono", monospace',
    displayWeight: 500,
    headingTracking: '-0.02em',
  },
};

// Hex → "r, g, b" tuple for canvas rgba() interpolation.
function hexToRgb(hex) {
  const h = hex.replace('#', '');
  const x = h.length === 3 ? h.split('').map((c) => c + c).join('') : h;
  const n = parseInt(x, 16);
  return `${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}`;
}

// Mix a hex toward another hex by t (0..1).
function mix(a, b, t) {
  const pa = hexToRgb(a).split(', ').map(Number);
  const pb = hexToRgb(b).split(', ').map(Number);
  const m = pa.map((v, i) => Math.round(v + (pb[i] - v) * t));
  return `rgb(${m[0]}, ${m[1]}, ${m[2]})`;
}

// ── Data ────────────────────────────────────────────────────────────────────
// Selected publications. Co-first authorship marked with † on the listed
// names; the footnote in <Publications> spells it out.
const PUBLICATIONS = [
  {
    year: 2026,
    venue: "ICML",
    venueLong: "International Conference on Machine Learning",
    title: "Beyond Procedure: Substantive Fairness in Conformal Prediction",
    authors: [
      { name: "Pengqi Liu",       coFirst: true },
      { name: "Zijun Yu",         coFirst: true, self: true },
      { name: "Mouloud Belbahri" },
      { name: "Arthur Charpentier" },
      { name: "Masoud Asgharian" },
      { name: "Jesse C. Cresswell" },
    ],
    tags: ["Conformal Prediction", "Fairness"],
    status: "accepted",
    links: { arxiv: "https://arxiv.org/abs/2602.16794" },
  },
  {
    year: 2026,
    venue: "In submission",
    venueLong: "Submitted — preprint forthcoming",
    title: "Pause and Reflect: Conformal Aggregation for Chain-of-Thought Reasoning",
    authors: [
      { name: "Yu Gu",            coFirst: true },
      { name: "Zijun Yu",         coFirst: true, self: true },
      { name: "Vahid Partovi Nia" },
      { name: "Masoud Asgharian" },
    ],
    tags: ["Conformal Prediction", "LLM Reasoning"],
    status: "submitted",
    links: {},
  },
];

const RESEARCH_TAGS = ["Conformal Prediction", "Survival Analysis", "Deep Learning"];

const NAV = [
  { label: "Index",        href: "#top" },
  { label: "Publications", href: "#publications" },
  { label: "CV",           href: "/cv.pdf" },
];

const CONTACT_LINKS = [
  { label: "Email",      value: "hello@zijunyu.com",
    href: "mailto:hello@zijunyu.com" },
  { label: "GitHub",     value: "github.com/Zijun-Y",
    href: "https://github.com/Zijun-Y" },
  { label: "LinkedIn",   value: "linkedin.com/in/yuzijun",
    href: "https://www.linkedin.com/in/yuzijun" },
  { label: "OpenReview", value: "openreview.net/~Zijun_Yu2",
    href: "https://openreview.net/profile?id=~Zijun_Yu2" },
];

// ── Header ──────────────────────────────────────────────────────────────────

function Header({ onOpenContact }) {
  const [scrolled, setScrolled] = React.useState(false);
  React.useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header className={`zh-header ${scrolled ? 'zh-header--scrolled' : ''}`}>
      <div className="zh-shell zh-header__inner">
        <button className="zh-getintouch" type="button" onClick={onOpenContact}
                aria-label="Open contact panel">
          <span className="zh-getintouch__dot" aria-hidden="true" />
          <span className="zh-getintouch__label">Get in touch</span>
        </button>

        <a href="#top" className="zh-mark" aria-label="Home">
          <span className="zh-mark__name">Zijun Yu</span>
          <span className="zh-mark__role">PhD · McGill</span>
        </a>

        <nav className="zh-nav" aria-label="Primary">
          {NAV.map((n) => (
            <a key={n.label} href={n.href} className="zh-nav__a">{n.label}</a>
          ))}
        </nav>
      </div>
    </header>
  );
}

// ── Contact slide-out panel ─────────────────────────────────────────────────

function ContactPanel({ open, onClose }) {
  // Close on Escape; lock body scroll while open.
  React.useEffect(() => {
    if (!open) return;
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prev;
    };
  }, [open, onClose]);

  return (
    <>
      <div className={`zh-cscrim ${open ? 'is-open' : ''}`}
           onClick={onClose} aria-hidden={!open} />
      <aside className={`zh-cpanel ${open ? 'is-open' : ''}`}
             aria-label="Contact" aria-hidden={!open}>
        <div className="zh-cpanel__inner">
          <header className="zh-cpanel__head">
            <span className="zh-eyebrow">Get in touch</span>
            <button className="zh-cpanel__close" type="button"
                    onClick={onClose} aria-label="Close contact panel">
              <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
                <path d="M6 6l12 12M18 6L6 18" fill="none" stroke="currentColor"
                      strokeWidth="1.4" strokeLinecap="round" />
              </svg>
            </button>
          </header>

          <div className="zh-cpanel__photo" role="img" aria-label="Photo of Zijun Yu">
            {/* Placeholder portrait — abstracted ink-on-paper figure. */}
            <svg viewBox="0 0 300 360" preserveAspectRatio="xMidYMid slice"
                 className="zh-cpanel__photo-svg" aria-hidden="true">
              <defs>
                <linearGradient id="zhPhotoBg" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%"  stopColor="var(--accent)" stopOpacity="0.14" />
                  <stop offset="100%" stopColor="var(--accent)" stopOpacity="0.04" />
                </linearGradient>
                <pattern id="zhPhotoDots" width="6" height="6" patternUnits="userSpaceOnUse">
                  <circle cx="3" cy="3" r="0.6" fill="var(--ink)" fillOpacity="0.12" />
                </pattern>
              </defs>
              <rect width="300" height="360" fill="url(#zhPhotoBg)" />
              <rect width="300" height="360" fill="url(#zhPhotoDots)" />
              {/* Shoulders + head silhouette */}
              <path d="M0 360 Q30 260 90 240 Q120 234 150 234 Q180 234 210 240 Q270 260 300 360 Z"
                    fill="var(--ink)" fillOpacity="0.78" />
              <circle cx="150" cy="170" r="62" fill="var(--ink)" fillOpacity="0.78" />
              <text x="150" y="332" textAnchor="middle" fill="var(--bg)"
                    fontFamily="var(--mono)" fontSize="10"
                    letterSpacing="0.12em">PHOTO · PLACEHOLDER</text>
            </svg>
          </div>

          <div className="zh-cpanel__body">
            <h2 className="zh-cpanel__greet">
              Always happy to chat about <em>conformal prediction</em>,
              statistics, or a good cup of coffee in Montréal.
            </h2>

            <section className="zh-cpanel__section">
              <span className="zh-eyebrow">Reach</span>
              <ul className="zh-cpanel__links">
                {CONTACT_LINKS.map((l) => (
                  <li key={l.label}>
                    <a href={l.href} target={l.href.startsWith('http') ? '_blank' : undefined}
                       rel="noreferrer noopener">
                      <span className="zh-cpanel__link-label">{l.label}</span>
                      <span className="zh-cpanel__link-value">
                        {l.value} <span aria-hidden="true">↗</span>
                      </span>
                    </a>
                  </li>
                ))}
              </ul>
            </section>

            <section className="zh-cpanel__section">
              <span className="zh-eyebrow">Office</span>
              <p className="zh-cpanel__addr">
                Burnside Hall<br />
                805 Sherbrooke Street West<br />
                Montréal, QC&nbsp;&nbsp;H3A 0B9<br />
                <span className="zh-cpanel__addr-quiet">
                  By appointment — drop a line first.
                </span>
              </p>
            </section>
          </div>
        </div>
      </aside>
    </>
  );
}

// ── Hero ────────────────────────────────────────────────────────────────────

function Hero() {
  return (
    <section id="top" className="zh-hero zh-shell">
      <div className="zh-hero__meta">
        <span className="zh-meta-loc">
          <span className="zh-meta-loc-dash" /> Montréal, QC
        </span>
        <span className="zh-meta-year">
          <time>MMXXVI</time>
        </span>
      </div>

      <h1 className="zh-hero__name">
        <span className="zh-hero__line">Zijun</span>
        <span className="zh-hero__line zh-hero__line--italic">Yu</span>
      </h1>

      <p className="zh-hero__bio">
        I'm a PhD student in Mathematics &amp; Statistics at <em>McGill University</em>,
        working at the intersection of statistical theory and modern machine learning —
        with a focus on <em>conformal prediction</em> and <em>survival analysis</em>.
        Before academia, four years building production software taught me to keep things
        simple and shipping.
      </p>

      <ul className="zh-tags" aria-label="Research interests">
        {RESEARCH_TAGS.map((t) => (
          <li key={t} className="zh-tag"><span>{t}</span></li>
        ))}
      </ul>

      <a href="#publications" className="zh-scroll-cue" aria-label="Scroll to publications">
        <span className="zh-scroll-cue__label">Selected publications</span>
        <span className="zh-scroll-cue__line" />
      </a>
    </section>
  );
}

// ── Publications ────────────────────────────────────────────────────────────

function PubRow({ pub, idx, registerRef }) {
  const ref = React.useRef(null);
  React.useEffect(() => {
    if (ref.current) registerRef(idx, ref.current, pub.year);
  }, [idx, pub.year, registerRef]);

  const authors = pub.authors.map((a, i) => (
    <React.Fragment key={i}>
      {i > 0 && <span className="zh-pub__sep">, </span>}
      <span className={`zh-pub__author ${a.self ? 'zh-pub__author--self' : ''}`}>
        {a.name}
        {a.coFirst && <sup className="zh-pub__co">†</sup>}
      </span>
    </React.Fragment>
  ));

  return (
    <article ref={ref} className="zh-pub" data-year={pub.year}>
      <div className="zh-pub__num" aria-hidden="true">
        {String(idx + 1).padStart(2, '0')}
      </div>
      <header className="zh-pub__head">
        <span className="zh-pub__venue" title={pub.venueLong}>
          <span className="zh-pub__venue-name">{pub.venue}</span>
          <span className="zh-pub__venue-sep">·</span>
          <span className="zh-pub__venue-year">{pub.year}</span>
          {pub.status === 'accepted'  && <span className="zh-pub__status">Accepted</span>}
          {pub.status === 'preprint'  && <span className="zh-pub__status zh-pub__status--quiet">Preprint</span>}
          {pub.status === 'submitted' && <span className="zh-pub__status zh-pub__status--quiet">Under review</span>}
        </span>
      </header>
      <h3 className="zh-pub__title">{pub.title}</h3>
      <p className="zh-pub__authors">{authors}</p>
      <div className="zh-pub__foot">
        <ul className="zh-pub__tags">
          {pub.tags.map((t) => <li key={t}>{t}</li>)}
        </ul>
        <div className="zh-pub__links">
          {pub.links.paper      && <a href={pub.links.paper}      target="_blank" rel="noreferrer noopener">Paper ↗</a>}
          {pub.links.arxiv      && <a href={pub.links.arxiv}      target="_blank" rel="noreferrer noopener">arXiv ↗</a>}
          {pub.links.code       && <a href={pub.links.code}       target="_blank" rel="noreferrer noopener">Code ↗</a>}
          {pub.links.openreview && <a href={pub.links.openreview} target="_blank" rel="noreferrer noopener">OpenReview ↗</a>}
          {Object.keys(pub.links).length === 0 && pub.status === 'submitted' && (
            <span className="zh-pub__pending">Preprint coming soon</span>
          )}
        </div>
      </div>
    </article>
  );
}

// Floating year rail. Tracks the first publication entry that's in view
// (top edge in upper-half of viewport) and displays its year. Sticky-left on
// desktop, sticky-top on mobile.
function YearRail({ years, activeYear, visible }) {
  // Deduped list, preserving order of first appearance.
  const unique = React.useMemo(() => {
    const seen = new Set(); const out = [];
    for (const y of years) { if (!seen.has(y)) { seen.add(y); out.push(y); } }
    return out;
  }, [years]);

  return (
    <aside className={`zh-yearrail ${visible ? 'is-visible' : ''}`} aria-hidden="true">
      <span className="zh-yearrail__label">Year</span>
      <div className="zh-yearrail__years">
        {unique.map((y) => (
          <span key={y}
                className={`zh-yearrail__y ${y === activeYear ? 'is-active' : ''}`}>
            {y}
          </span>
        ))}
      </div>
      <span className="zh-yearrail__count">
        {String(unique.indexOf(activeYear) + 1).padStart(2, '0')}/
        {String(unique.length).padStart(2, '0')}
      </span>
    </aside>
  );
}

function Publications() {
  const refsRef = React.useRef(new Map()); // idx → {el, year}
  const sectionRef = React.useRef(null);
  const [activeYear, setActiveYear] = React.useState(PUBLICATIONS[0].year);
  const [railVisible, setRailVisible] = React.useState(false);

  const registerRef = React.useCallback((idx, el, year) => {
    refsRef.current.set(idx, { el, year });
  }, []);

  // Scroll listener: pick the topmost row whose top is above ~30% viewport;
  // also decide whether the rail should be shown — only while the
  // publications section overlaps the viewport (with a small top margin so it
  // doesn't appear while the heading is still entering).
  React.useEffect(() => {
    const tick = () => {
      const triggerY = window.innerHeight * 0.3;
      let best = null;
      for (const { el, year } of refsRef.current.values()) {
        if (!el) continue;
        const top = el.getBoundingClientRect().top;
        if (top <= triggerY) {
          if (!best || top > best.top) best = { top, year };
        }
      }
      if (best) setActiveYear(best.year);
      else setActiveYear(PUBLICATIONS[0].year);

      // Rail visibility: section's top edge has scrolled above viewport
      // midpoint, AND section's bottom hasn't passed above viewport top.
      const s = sectionRef.current;
      if (s) {
        const r = s.getBoundingClientRect();
        const vh = window.innerHeight;
        setRailVisible(r.top < vh * 0.6 && r.bottom > vh * 0.2);
      }
    };
    tick();
    window.addEventListener('scroll', tick, { passive: true });
    window.addEventListener('resize', tick);
    return () => {
      window.removeEventListener('scroll', tick);
      window.removeEventListener('resize', tick);
    };
  }, []);

  return (
    <section id="publications" className="zh-pubs-wrap" ref={sectionRef}>
      <YearRail
        years={PUBLICATIONS.map((p) => p.year)}
        activeYear={activeYear}
        visible={railVisible}
      />
      <div className="zh-pubs zh-shell">
        <header className="zh-pubs__head">
          <span className="zh-eyebrow">§ Selected publications</span>
          <h2 className="zh-pubs__title">
            Recent work in <em>conformal prediction</em>.
          </h2>
          <p className="zh-pubs__sub">
            <sup>†</sup> denotes equal contribution. Full list on{' '}
            <a href="https://openreview.net/profile?id=~Zijun_Yu2"
               target="_blank" rel="noreferrer noopener">OpenReview ↗</a>.
          </p>
        </header>
        <ol className="zh-pubs__list">
          {PUBLICATIONS.map((p, i) => (
            <PubRow key={i} pub={p} idx={i} registerRef={registerRef} />
          ))}
        </ol>
      </div>
    </section>
  );
}

// ── Colophon ────────────────────────────────────────────────────────────────

function Colophon({ onOpenContact }) {
  return (
    <footer className="zh-footer zh-shell">
      <div className="zh-footer__row">
        <div className="zh-footer__col">
          <span className="zh-eyebrow">Contact</span>
          <button type="button" className="zh-footer__contact" onClick={onOpenContact}>
            <em>Get in touch</em>
            <span aria-hidden="true">→</span>
          </button>
        </div>
        <div className="zh-footer__col zh-footer__col--right">
          <span className="zh-eyebrow">Colophon</span>
          <p className="zh-footer__addr">
            Set in <em>Newsreader</em> &amp; <em>Geist</em>.<br />
            Hand-coded, baked with care.
          </p>
        </div>
      </div>
      <div className="zh-footer__bottom">
        <span>© 2026 Zijun Yu</span>
        <span className="zh-footer__motto">— last updated <time>May 2026</time></span>
      </div>
    </footer>
  );
}

// ── App ─────────────────────────────────────────────────────────────────────

function App() {
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);
  const [contactOpen, setContactOpen] = React.useState(false);

  const palette = t.palette || PALETTES[0];
  const [bg, ink, accentDefault] = palette;
  const accent = t.accent || accentDefault;
  const isDark = palette[0] === PALETTES[4][0];
  const type = TYPE_PAIRINGS[t.typePairing] || TYPE_PAIRINGS["serif-led"];

  // Push palette + type + density into CSS custom properties.
  React.useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty('--bg', bg);
    root.style.setProperty('--ink', ink);
    root.style.setProperty('--ink-rgb', hexToRgb(ink));
    root.style.setProperty('--bg-rgb', hexToRgb(bg));
    root.style.setProperty('--accent', accent);
    root.style.setProperty('--accent-rgb', hexToRgb(accent));
    root.style.setProperty('--muted', mix(ink, bg, 0.45));
    root.style.setProperty('--rule', mix(ink, bg, 0.82));
    root.style.setProperty('--paper', mix(bg, ink, 0.03));
    root.style.setProperty('--display', type.display);
    root.style.setProperty('--body', type.body);
    root.style.setProperty('--mono', type.mono);
    root.style.setProperty('--display-weight', String(type.displayWeight));
    root.style.setProperty('--display-tracking', type.headingTracking);

    const dens = t.density || 'comfortable';
    root.style.setProperty('--space-unit',
      dens === 'compact' ? '6px' : dens === 'spacious' ? '11px' : '8px');
    root.style.setProperty('--hero-size',
      dens === 'compact'   ? 'clamp(56px, 11vw, 132px)'
      : dens === 'spacious' ? 'clamp(72px, 15vw, 192px)'
      : 'clamp(64px, 13vw, 168px)');

    root.classList.toggle('zh-grain-on', !!t.showGrain);
    root.classList.toggle('zh-dark', isDark);
  }, [bg, ink, accent, type, t.density, t.showGrain, isDark]);

  // Sync network canvas
  React.useEffect(() => {
    if (window.__network) {
      window.__network.setColors({ ink: hexToRgb(ink), accent: hexToRgb(accent) });
      window.__network.setIntensity(t.network || 'subtle');
    }
  }, [ink, accent, t.network]);

  // Smooth-scroll for in-page anchors.
  React.useEffect(() => {
    const onClick = (e) => {
      const a = e.target.closest('a[href^="#"]');
      if (!a) return;
      const id = a.getAttribute('href').slice(1);
      if (!id) return;
      const el = document.getElementById(id);
      if (!el) return;
      e.preventDefault();
      const top = el.getBoundingClientRect().top + window.scrollY - 24;
      window.scrollTo({ top, behavior: 'smooth' });
    };
    document.addEventListener('click', onClick);
    return () => document.removeEventListener('click', onClick);
  }, []);

  return (
    <>
      <Header onOpenContact={() => setContactOpen(true)} />
      <main className="zh-main">
        <Hero />
        <Publications />
      </main>
      <Colophon onOpenContact={() => setContactOpen(true)} />
      <ContactPanel open={contactOpen} onClose={() => setContactOpen(false)} />

      <TweaksPanel title="Design tweaks">
        <TweakSection label="Palette">
          <TweakColor
            label="Mood"
            value={palette}
            options={PALETTES}
            onChange={(v) => setTweak({ palette: v, accent: v[2] })}
          />
          <TweakColor
            label="Accent"
            value={accent}
            options={[palette[2], "#B85C38", "#8A6E3A", "#3B6FB0", "#5A6E4B", "#C9A270"]}
            onChange={(v) => setTweak('accent', v)}
          />
        </TweakSection>

        <TweakSection label="Type">
          <TweakRadio
            label="Pairing"
            value={t.typePairing}
            options={[
              { value: "serif-led", label: "Serif" },
              { value: "sans-led",  label: "Sans" },
              { value: "mono-led",  label: "Mono" },
            ]}
            onChange={(v) => setTweak('typePairing', v)}
          />
        </TweakSection>

        <TweakSection label="Layout">
          <TweakRadio
            label="Density"
            value={t.density}
            options={[
              { value: "compact",      label: "Tight" },
              { value: "comfortable",  label: "Comfy" },
              { value: "spacious",     label: "Open" },
            ]}
            onChange={(v) => setTweak('density', v)}
          />
        </TweakSection>

        <TweakSection label="Atmosphere">
          <TweakRadio
            label="Network"
            value={t.network}
            options={[
              { value: "off",    label: "Off" },
              { value: "subtle", label: "Subtle" },
              { value: "lively", label: "Lively" },
            ]}
            onChange={(v) => setTweak('network', v)}
          />
          <TweakToggle
            label="Paper grain"
            value={!!t.showGrain}
            onChange={(v) => setTweak('showGrain', v)}
          />
        </TweakSection>
      </TweaksPanel>
    </>
  );
}

ReactDOM.createRoot(document.getElementById('app')).render(<App />);
