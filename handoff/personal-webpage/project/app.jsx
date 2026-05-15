// app.jsx — Index page (Home).
// Hero + Publications. Shell (header, contact panel, footer, tweaks) lives in
// shared.jsx and is loaded before this file.

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "palette": ["#EDEEEA", "#15171A", "#3B6FB0"],
  "typePairing": "serif-led",
  "density": "comfortable",
  "network": "subtle",
  "accent": "#3B6FB0",
  "showGrain": false
}/*EDITMODE-END*/;

// ── Data ────────────────────────────────────────────────────────────────────
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

// ── Hero ────────────────────────────────────────────────────────────────────
function Hero() {
  return (
    <section id="top" className="zh-hero zh-shell">
      <div className="zh-hero__meta">
        <span className="zh-meta-loc">
          <span className="zh-meta-loc-dash" /> Montréal, QC
        </span>
        <span className="zh-meta-year"><time>MMXXVI</time></span>
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

function YearRail({ years, activeYear, visible }) {
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
  const refsRef = React.useRef(new Map());
  const sectionRef = React.useRef(null);
  const [activeYear, setActiveYear] = React.useState(PUBLICATIONS[0].year);
  const [railVisible, setRailVisible] = React.useState(false);

  const registerRef = React.useCallback((idx, el, year) => {
    refsRef.current.set(idx, { el, year });
  }, []);

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

// ── Mount ───────────────────────────────────────────────────────────────────
function App() {
  return (
    <Shell page="home">
      <Hero />
      <Publications />
    </Shell>
  );
}

ReactDOM.createRoot(document.getElementById('app')).render(<App />);
