// shared.jsx — Shared shell for all pages of the Zijun Yu site.
//
// Each page (index, blog, about) loads this file BEFORE its own page-specific
// JSX. Components and helpers are pinned to `window` so the page scripts —
// which run in their own Babel scopes — can reference them.
//
// The page script:
//   1. Calls useTweaks(TWEAK_DEFAULTS) for tweak state.
//   2. Renders <Shell page="..." onOpenContact={...}><PageContent /></Shell>.
//   3. Mounts via ReactDOM.createRoot(document.getElementById('app')).render(...).
//
// All theming (palette, type, density, network sync) lives inside <Shell>, so
// individual pages only worry about page content.

// ── Defaults (each page declares its own EDITMODE block; this is a fallback)─
const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "palette": ["#EDEEEA", "#15171A", "#3B6FB0"],
  "typePairing": "serif-led",
  "density": "comfortable",
  "network": "subtle",
  "accent": "#3B6FB0",
  "showGrain": false
}/*EDITMODE-END*/;

const PALETTES = [
  ["#F4EEE3", "#1B1714", "#B85C38"], // warm cream + rust
  ["#EFE9DD", "#2A2520", "#8A6E3A"], // sand + olive
  ["#EDEEEA", "#15171A", "#3B6FB0"], // cool stone + blue   (default)
  ["#F6F2EC", "#1B1714", "#5A6E4B"], // moss
  ["#15110E", "#F2EADC", "#C9A270"], // dark ink (noir)
];

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

// Nav lives next to the wordmark in the header. Hrefs use flat filenames so
// the sketch works as static HTML; production (Svelte) will swap to /blog,
// /about, etc. "Home" link respects the current page — on index it points to
// the top anchor, on other pages it points to index.html.
const NAV = [
  { label: "Home",         href: "index.html"             },
  { label: "Blog",         href: "blog.html"              },
  { label: "About",        href: "about.html"             },
  { label: "Publications", href: "index.html#publications"},
  { label: "CV",           href: "/cv.pdf"                },
];

const CONTACT_LINKS = [
  { label: "Email",      value: "hello@zijunyu.com",
    href:  "mailto:hello@zijunyu.com" },
  { label: "GitHub",     value: "github.com/Zijun-Y",
    href:  "https://github.com/Zijun-Y" },
  { label: "LinkedIn",   value: "linkedin.com/in/yuzijun",
    href:  "https://www.linkedin.com/in/yuzijun" },
  { label: "OpenReview", value: "openreview.net/~Zijun_Yu2",
    href:  "https://openreview.net/profile?id=~Zijun_Yu2" },
];

// ── helpers ─────────────────────────────────────────────────────────────────
function hexToRgb(hex) {
  const h = hex.replace('#', '');
  const x = h.length === 3 ? h.split('').map((c) => c + c).join('') : h;
  const n = parseInt(x, 16);
  return `${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}`;
}
function mix(a, b, t) {
  const pa = hexToRgb(a).split(', ').map(Number);
  const pb = hexToRgb(b).split(', ').map(Number);
  const m = pa.map((v, i) => Math.round(v + (pb[i] - v) * t));
  return `rgb(${m[0]}, ${m[1]}, ${m[2]})`;
}

// ── Header ──────────────────────────────────────────────────────────────────
// `page` is the current page key — used to dim its own link in the nav and
// to redirect Home → top-of-page when we're already on the index.
function Header({ onOpenContact, page = 'home' }) {
  const [scrolled, setScrolled] = React.useState(false);
  React.useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const homeHref = page === 'home' ? '#top' : 'index.html';
  // A nav link is "current" when its target matches the current page. The
  // Publications row is a hash on the home page and we don't highlight it.
  const isCurrent = (n) => {
    if (page === 'home' && n.label === 'Home')  return true;
    if (page === 'blog' && n.label === 'Blog')  return true;
    if (page === 'about' && n.label === 'About') return true;
    return false;
  };

  return (
    <header className={`zh-header ${scrolled ? 'zh-header--scrolled' : ''}`}>
      <div className="zh-shell zh-header__inner">
        <button className="zh-getintouch" type="button" onClick={onOpenContact}
                aria-label="Open contact panel">
          <span className="zh-getintouch__dot" aria-hidden="true" />
          <span className="zh-getintouch__label">Get in touch</span>
        </button>

        <a href={homeHref} className="zh-mark" aria-label="Home">
          <span className="zh-mark__name">Zijun Yu</span>
          <span className="zh-mark__role">PhD · McGill</span>
        </a>

        <nav className="zh-nav" aria-label="Primary">
          {NAV.map((n) => (
            <a key={n.label}
               href={n.label === 'Home' ? homeHref : n.href}
               className={`zh-nav__a ${isCurrent(n) ? 'is-current' : ''}`}
               aria-current={isCurrent(n) ? 'page' : undefined}>
              {n.label}
            </a>
          ))}
        </nav>
      </div>
    </header>
  );
}

// ── Contact slide-out panel ─────────────────────────────────────────────────
function ContactPanel({ open, onClose }) {
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

// ── Tweaks panel (consistent across pages) ─────────────────────────────────
function SiteTweaksPanel({ t, setTweak, accent, palette }) {
  return (
    <TweaksPanel title="Design tweaks">
      <TweakSection label="Palette">
        <TweakColor label="Mood" value={palette} options={PALETTES}
                    onChange={(v) => setTweak({ palette: v, accent: v[2] })} />
        <TweakColor label="Accent" value={accent}
                    options={[palette[2], "#B85C38", "#8A6E3A", "#3B6FB0", "#5A6E4B", "#C9A270"]}
                    onChange={(v) => setTweak('accent', v)} />
      </TweakSection>
      <TweakSection label="Type">
        <TweakRadio label="Pairing" value={t.typePairing}
                    options={[
                      { value: "serif-led", label: "Serif" },
                      { value: "sans-led",  label: "Sans" },
                      { value: "mono-led",  label: "Mono" },
                    ]}
                    onChange={(v) => setTweak('typePairing', v)} />
      </TweakSection>
      <TweakSection label="Layout">
        <TweakRadio label="Density" value={t.density}
                    options={[
                      { value: "compact",     label: "Tight" },
                      { value: "comfortable", label: "Comfy" },
                      { value: "spacious",    label: "Open"  },
                    ]}
                    onChange={(v) => setTweak('density', v)} />
      </TweakSection>
      <TweakSection label="Atmosphere">
        <TweakRadio label="Network" value={t.network}
                    options={[
                      { value: "off",    label: "Off"    },
                      { value: "subtle", label: "Subtle" },
                      { value: "lively", label: "Lively" },
                    ]}
                    onChange={(v) => setTweak('network', v)} />
        <TweakToggle label="Paper grain" value={!!t.showGrain}
                     onChange={(v) => setTweak('showGrain', v)} />
      </TweakSection>
    </TweaksPanel>
  );
}

// ── Shell ───────────────────────────────────────────────────────────────────
// Owns theme syncing (CSS vars, network canvas, smooth-scroll handler) and
// renders the chrome — Header, ContactPanel, Colophon, TweaksPanel. Page
// content goes between header and colophon as children.
function Shell({ page = 'home', children }) {
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);
  const [contactOpen, setContactOpen] = React.useState(false);

  const palette = t.palette || PALETTES[0];
  const [bg, ink, accentDefault] = palette;
  const accent = t.accent || accentDefault;
  const isDark = palette[0] === PALETTES[4][0];
  const type = TYPE_PAIRINGS[t.typePairing] || TYPE_PAIRINGS["serif-led"];

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

  React.useEffect(() => {
    if (window.__network) {
      window.__network.setColors({ ink: hexToRgb(ink), accent: hexToRgb(accent) });
      window.__network.setIntensity(t.network || 'subtle');
    }
  }, [ink, accent, t.network]);

  // Smooth-scroll for in-page hash links; ignore links pointing to other pages.
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
      <Header page={page} onOpenContact={() => setContactOpen(true)} />
      <main className="zh-main">{children}</main>
      <Colophon onOpenContact={() => setContactOpen(true)} />
      <ContactPanel open={contactOpen} onClose={() => setContactOpen(false)} />
      <SiteTweaksPanel t={t} setTweak={setTweak} accent={accent} palette={palette} />
    </>
  );
}

// Expose to page scripts (each runs in its own Babel scope).
Object.assign(window, {
  Shell, Header, ContactPanel, Colophon, SiteTweaksPanel,
  PALETTES, TYPE_PAIRINGS, TWEAK_DEFAULTS,
  CONTACT_LINKS, NAV,
  hexToRgb, mix,
});
