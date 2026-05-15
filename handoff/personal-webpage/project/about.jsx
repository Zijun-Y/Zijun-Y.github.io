// about.jsx — About page.
//
// Short bio → editorial fact column → masonry image wall (CSS columns) with
// a click-to-zoom lightbox. Placeholder photos are SVG duotones with hints
// of the intended subject — swap in real images by replacing the `src` field
// on each photo and removing the `<Placeholder>` component.

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "palette": ["#EDEEEA", "#15171A", "#3B6FB0"],
  "typePairing": "serif-led",
  "density": "comfortable",
  "network": "subtle",
  "accent": "#3B6FB0",
  "showGrain": false
}/*EDITMODE-END*/;

// ── Photo grid ──────────────────────────────────────────────────────────────
// `kind` keys a Placeholder variant — picks colors + an abstract SVG that
// hints at the subject. `aspect` controls the masonry tile height. These
// placeholders are stand-ins for real outdoor/nature photography.
const PHOTOS = [
  { id: 1,  kind: 'mountain', aspect: 1.32, caption: "First snow on the summit",                       place: "Mont-Tremblant",     date: "Nov 2024" },
  { id: 2,  kind: 'forest',   aspect: 0.78, caption: "Birch grove along the trail",                    place: "Mont Saint-Bruno",   date: "Oct 2024" },
  { id: 3,  kind: 'river',    aspect: 1.45, caption: "Petite-Nation in spring melt",                   place: "Petite-Nation",       date: "Apr 2024" },
  { id: 4,  kind: 'lake',     aspect: 0.85, caption: "Lac Hertel at sunrise",                          place: "Mont Saint-Hilaire", date: "Jul 2024" },
  { id: 5,  kind: 'bird',     aspect: 1.05, caption: "Heron, very patient",                            place: "Marais Léon-Provancher", date: "Aug 2024" },
  { id: 6,  kind: 'deer',     aspect: 1.20, caption: "A doe at the edge of the field",                 place: "Parc Omega",         date: "Sep 2024" },
  { id: 7,  kind: 'trail',    aspect: 1.35, caption: "Switchbacks above the tree line",                place: "Adirondacks",        date: "Aug 2025" },
  { id: 8,  kind: 'sky',      aspect: 0.65, caption: "Cumulus pile, late afternoon",                   place: "Quebec City road",   date: "Jun 2025" },
  { id: 9,  kind: 'mountain', aspect: 1.00, caption: "Skiing Sutton, blue sky",                        place: "Mont Sutton",        date: "Feb 2025" },
  { id: 10, kind: 'forest',   aspect: 1.25, caption: "Ferns in the understory",                        place: "Parc de la Mauricie", date: "Jul 2024" },
  { id: 11, kind: 'river',    aspect: 0.92, caption: "Rapids on the Rouge",                            place: "La Rouge",           date: "Sep 2024" },
  { id: 12, kind: 'meadow',   aspect: 1.12, caption: "Wildflowers, name unknown",                      place: "Eastern Townships",  date: "Jul 2025" },
  { id: 13, kind: 'fox',      aspect: 0.74, caption: "Fox at dusk — surprised neither of us",          place: "Cantons-de-l'Est",   date: "Oct 2025" },
  { id: 14, kind: 'lake',     aspect: 1.35, caption: "Skies turning over Lac Brome",                   place: "Lac Brome",          date: "Oct 2024" },
  { id: 15, kind: 'mountain', aspect: 0.88, caption: "Above the cloud line",                           place: "Mont Mégantic",      date: "Jun 2024" },
];

// ── Placeholder photo SVG ──────────────────────────────────────────────────
// One component handles every variant. Each variant picks a duotone (a + b)
// out of the active palette via CSS vars, then layers a minimal illustration
// hinting at the subject. The duotones intentionally stay close to the
// palette so the wall reads as one organism, not a collage.

function Placeholder({ kind, w = 600, h = 600 }) {
  const cx = w / 2, cy = h / 2;
  const id = React.useId();

  // Subtle dot pattern overlay used by all variants.
  const dots = (
    <pattern id={`dots-${id}`} width="6" height="6" patternUnits="userSpaceOnUse">
      <circle cx="3" cy="3" r="0.5" fill="var(--ink)" fillOpacity="0.10" />
    </pattern>
  );

  // Gradient bg (top is accent-tinted, bottom is ink-tinted at low alpha).
  const bg = (
    <linearGradient id={`bg-${id}`} x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%"  stopColor="var(--accent)" stopOpacity="0.18" />
      <stop offset="100%" stopColor="var(--ink)"    stopOpacity="0.06" />
    </linearGradient>
  );

  const inkFill = (a = 0.7) => ({ fill: 'var(--ink)', fillOpacity: a });

  // Subject layer — minimal silhouettes per kind. Nature-leaning vocabulary.
  let subject = null;
  switch (kind) {
    case 'mountain':
      // Layered ridgelines, snow cap on the central peak.
      subject = (
        <g>
          <path d={`M 0 ${h} L ${w*0.18} ${h*0.62} L ${w*0.34} ${h*0.78} L ${w*0.50} ${h*0.55} L ${w*0.66} ${h*0.72} L ${w*0.84} ${h*0.58} L ${w} ${h*0.78} L ${w} ${h} Z`}
                fill="var(--ink)" fillOpacity="0.45" />
          <path d={`M 0 ${h} L ${w*0.25} ${h*0.42} L ${w*0.40} ${h*0.62} L ${w*0.58} ${h*0.28} L ${w*0.78} ${h*0.54} L ${w} ${h*0.40} L ${w} ${h} Z`}
                fill="var(--ink)" fillOpacity="0.78" />
          <path d={`M ${w*0.52} ${h*0.34} L ${w*0.58} ${h*0.28} L ${w*0.64} ${h*0.40} Z`}
                fill="var(--bg)" fillOpacity="0.78" />
        </g>
      );
      break;
    case 'forest':
      // Tree trunks rising from bottom; varied heights for parallax.
      subject = (
        <g {...inkFill(0.72)}>
          {Array.from({ length: 14 }).map((_, i) => {
            const x = (i / 14) * w + 8;
            const tw = 10 + (i % 3) * 3;
            const th = h * (0.55 + ((i * 7) % 5) * 0.07);
            return <rect key={i} x={x} y={h - th} width={tw} height={th} />;
          })}
          <rect x="0" y={h * 0.92} width={w} height={h * 0.08}
                fill="var(--ink)" fillOpacity="0.55" />
        </g>
      );
      break;
    case 'river':
      // A curve winding through the frame plus rippled banks.
      subject = (
        <>
          <path d={`M -10 ${h*0.95} C ${w*0.25} ${h*0.55}, ${w*0.55} ${h*1.05}, ${w*1.05} ${h*0.50}
                    L ${w*1.05} ${h} L -10 ${h} Z`}
                fill="var(--accent)" fillOpacity="0.20" />
          <g stroke="var(--ink)" strokeOpacity="0.35" strokeWidth="1.2" fill="none">
            {[0, 1, 2, 3, 4, 5].map((i) => (
              <path key={i}
                    d={`M 0 ${cy + 18 + i * 18} q ${w/8} -8 ${w/4} 0 t ${w/4} 0 t ${w/4} 0 t ${w/4} 0`} />
            ))}
          </g>
          <path d={`M 0 ${h*0.40} L ${w*0.30} ${h*0.32} L ${w*0.55} ${h*0.42} L ${w*0.80} ${h*0.30} L ${w} ${h*0.38} L ${w} ${h*0.55} L 0 ${h*0.55} Z`}
                fill="var(--ink)" fillOpacity="0.55" />
        </>
      );
      break;
    case 'lake':
      // Horizon line; mountain silhouette mirrored as reflection below.
      subject = (
        <>
          <path d={`M 0 ${cy} L ${w*0.30} ${cy - 80} L ${w*0.55} ${cy - 30} L ${w*0.78} ${cy - 100} L ${w} ${cy} Z`}
                fill="var(--ink)" fillOpacity="0.72" />
          <path d={`M 0 ${cy} L ${w*0.30} ${cy + 80} L ${w*0.55} ${cy + 30} L ${w*0.78} ${cy + 100} L ${w} ${cy} Z`}
                fill="var(--ink)" fillOpacity="0.22" />
          <line x1="0" y1={cy} x2={w} y2={cy}
                stroke="var(--ink)" strokeOpacity="0.35" strokeWidth="1" />
        </>
      );
      break;
    case 'sky':
      // Sun + horizontal cloud bands. Warmer accent tint.
      subject = (
        <>
          <circle cx={w*0.74} cy={h*0.32} r="46"
                  fill="var(--accent)" fillOpacity="0.55" />
          <g fill="var(--ink)" fillOpacity="0.18">
            <rect x="0" y={h*0.50} width={w} height="8" rx="4" />
            <rect x={w*0.12} y={h*0.60} width={w*0.66} height="7" rx="3.5" />
            <rect x={w*0.32} y={h*0.70} width={w*0.50} height="6" rx="3" />
          </g>
          <rect x="0" y={h*0.85} width={w} height={h*0.15}
                fill="var(--ink)" fillOpacity="0.55" />
        </>
      );
      break;
    case 'bird':
      // One bird mid-flight + smaller silhouettes in the distance.
      subject = (
        <g fill="none" stroke="var(--ink)" strokeOpacity="0.78"
           strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
          <path d={`M ${cx - 60} ${cy - 10} q 30 -36 60 0 q 30 -36 60 0`} />
          <path d={`M ${cx - 160} ${cy - 50} q 12 -14 24 0 q 12 -14 24 0`}
                strokeWidth="2" strokeOpacity="0.55" />
          <path d={`M ${cx + 130} ${cy - 80} q 10 -12 20 0 q 10 -12 20 0`}
                strokeWidth="2" strokeOpacity="0.5" />
          <path d={`M ${cx - 100} ${cy + 60} q 8 -10 16 0 q 8 -10 16 0`}
                strokeWidth="2" strokeOpacity="0.4" />
        </g>
      );
      break;
    case 'deer':
      // Standing deer silhouette + suggestion of ground/grass.
      subject = (
        <>
          <rect x="0" y={h*0.78} width={w} height={h*0.22}
                fill="var(--ink)" fillOpacity="0.32" />
          <g {...inkFill(0.82)}>
            {/* body */}
            <ellipse cx={cx} cy={cy + 10} rx="100" ry="38" />
            {/* legs */}
            <rect x={cx - 78} y={cy + 30} width="10" height="80" />
            <rect x={cx - 50} y={cy + 30} width="10" height="80" />
            <rect x={cx + 40} y={cy + 30} width="10" height="80" />
            <rect x={cx + 68} y={cy + 30} width="10" height="80" />
            {/* neck + head */}
            <path d={`M ${cx + 80} ${cy - 10} L ${cx + 110} ${cy - 70}
                      L ${cx + 138} ${cy - 70} L ${cx + 150} ${cy - 56}
                      L ${cx + 130} ${cy - 40} L ${cx + 100} ${cy + 10} Z`} />
            {/* antlers */}
            <path d={`M ${cx + 124} ${cy - 70} L ${cx + 116} ${cy - 100}
                      M ${cx + 124} ${cy - 70} L ${cx + 138} ${cy - 96}
                      M ${cx + 130} ${cy - 70} L ${cx + 144} ${cy - 92}`}
                  stroke="var(--ink)" strokeOpacity="0.82"
                  strokeWidth="3" strokeLinecap="round" fill="none" />
            {/* tail */}
            <rect x={cx - 100} y={cy + 6} width="12" height="22" />
          </g>
        </>
      );
      break;
    case 'fox':
      // Smaller, sharper silhouette — accent-tinted to read as a fox.
      subject = (
        <>
          <rect x="0" y={h*0.80} width={w} height={h*0.20}
                fill="var(--ink)" fillOpacity="0.32" />
          <g fill="var(--accent)" fillOpacity="0.78">
            <ellipse cx={cx} cy={cy + 20} rx="80" ry="30" />
            <rect x={cx - 60} y={cy + 36} width="8" height="52" />
            <rect x={cx - 38} y={cy + 36} width="8" height="52" />
            <rect x={cx + 32} y={cy + 36} width="8" height="52" />
            <rect x={cx + 54} y={cy + 36} width="8" height="52" />
            {/* head */}
            <path d={`M ${cx + 60} ${cy + 4} L ${cx + 110} ${cy - 30}
                      L ${cx + 130} ${cy - 14} L ${cx + 122} ${cy + 4}
                      L ${cx + 130} ${cy + 20} L ${cx + 90} ${cy + 24} Z`} />
            {/* ears */}
            <path d={`M ${cx + 100} ${cy - 28} L ${cx + 96} ${cy - 50} L ${cx + 112} ${cy - 36} Z`} />
            {/* tail with white tip */}
            <path d={`M ${cx - 80} ${cy + 18} q -40 -20 -50 -50 l 18 -6 q 16 26 42 36 Z`} />
          </g>
          <path d={`M ${cx - 128} ${cy - 32} q 10 6 18 4 l -4 12 q -10 -2 -18 -8 Z`}
                fill="var(--bg)" fillOpacity="0.8" />
        </>
      );
      break;
    case 'trail':
      // Path receding to a horizon, framed by darker masses on either side.
      subject = (
        <>
          <path d={`M -20 ${h} L ${w*0.40} ${h*0.55} L ${w*0.60} ${h*0.55} L ${w + 20} ${h} Z`}
                fill="var(--accent)" fillOpacity="0.18" />
          <path d={`M 0 ${h} L 0 ${h*0.55} L ${w*0.35} ${h*0.55} L ${w*0.42} ${h*0.62} L ${w*0.28} ${h*0.70} L ${w*0.10} ${h*0.80} L 0 ${h*0.95} Z`}
                fill="var(--ink)" fillOpacity="0.65" />
          <path d={`M ${w} ${h} L ${w} ${h*0.55} L ${w*0.65} ${h*0.55} L ${w*0.58} ${h*0.62} L ${w*0.72} ${h*0.72} L ${w*0.90} ${h*0.82} L ${w} ${h*0.95} Z`}
                fill="var(--ink)" fillOpacity="0.65" />
          <path d={`M 0 ${h*0.55} L ${w} ${h*0.55}`}
                stroke="var(--ink)" strokeOpacity="0.4" strokeWidth="1" fill="none" />
        </>
      );
      break;
    case 'meadow':
      // Tall grass strokes + scattered accent-tinted wildflower dots.
      subject = (
        <>
          <rect x="0" y={h*0.55} width={w} height={h*0.45}
                fill="var(--ink)" fillOpacity="0.28" />
          <g stroke="var(--ink)" strokeOpacity="0.45" strokeWidth="1.2"
             strokeLinecap="round" fill="none">
            {Array.from({ length: 40 }).map((_, i) => {
              const x = (i / 40) * w + (i % 3) * 4;
              const tilt = ((i * 13) % 11) - 5;
              return <path key={i}
                d={`M ${x} ${h} q ${tilt} -16 ${tilt * 0.6} -36`} />;
            })}
          </g>
          <g fill="var(--accent)" fillOpacity="0.75">
            {Array.from({ length: 12 }).map((_, i) => {
              const x = ((i * 53) % 100) / 100 * w;
              const y = h * 0.70 + ((i * 31) % 100) / 100 * (h * 0.25);
              return <circle key={i} cx={x} cy={y} r="3" />;
            })}
          </g>
        </>
      );
      break;
    default:
      subject = null;
  }

  return (
    <svg viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="xMidYMid slice"
         className="zh-photo__svg" aria-hidden="true">
      <defs>{bg}{dots}</defs>
      <rect width={w} height={h} fill={`url(#bg-${id})`} />
      <rect width={w} height={h} fill={`url(#dots-${id})`} />
      {subject}
    </svg>
  );
}

// ── Lightbox ────────────────────────────────────────────────────────────────
// Renders the active photo full-screen with caption + prev/next/esc. Stays
// mounted to keep the open/close transitions clean.
function Lightbox({ open, photos, index, onClose, onPrev, onNext }) {
  React.useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === 'Escape')      onClose();
      if (e.key === 'ArrowLeft')   onPrev();
      if (e.key === 'ArrowRight')  onNext();
    };
    document.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prev;
    };
  }, [open, onClose, onPrev, onNext]);

  const photo = photos[index];
  if (!photo) return null;

  return (
    <div className={`zh-lb ${open ? 'is-open' : ''}`} aria-hidden={!open}
         role="dialog" aria-modal="true" aria-label="Photo lightbox">
      <button className="zh-lb__scrim" type="button" onClick={onClose}
              aria-label="Close" />
      <div className="zh-lb__stage">
        <div className="zh-lb__frame" style={{ aspectRatio: photo.aspect }}>
          <Placeholder kind={photo.kind} w={1000} h={Math.round(1000 / photo.aspect)} />
        </div>
        <div className="zh-lb__meta">
          <span className="zh-eyebrow">
            {String(index + 1).padStart(2, '0')} / {String(photos.length).padStart(2, '0')}
            <span className="zh-lb__dot">·</span>
            {photo.place} <span className="zh-lb__dot">·</span> {photo.date}
          </span>
          <p className="zh-lb__caption">{photo.caption}</p>
        </div>
      </div>
      <button className="zh-lb__nav zh-lb__nav--prev" type="button"
              onClick={onPrev} aria-label="Previous photo">←</button>
      <button className="zh-lb__nav zh-lb__nav--next" type="button"
              onClick={onNext} aria-label="Next photo">→</button>
      <button className="zh-lb__close" type="button" onClick={onClose}
              aria-label="Close lightbox">
        <svg viewBox="0 0 24 24" width="20" height="20">
          <path d="M6 6l12 12M18 6L6 18" fill="none" stroke="currentColor"
                strokeWidth="1.4" strokeLinecap="round" />
        </svg>
      </button>
    </div>
  );
}

// ── Journey map (Yantai → Beijing → Montréal → ?) ──────────────────────────────────────
// Small illustrated map in the same duotone / dot-pattern style as the photo
// placeholders. Four location vignettes connected by dashed paths; a paper
// airplane sits on the Beijing→Montréal leg to mark the emigration step.
// Composed at 480×560 viewBox — scales fluidly via CSS.
function JourneyMap() {
  const ag = (id) => `url(#${id})`;
  return (
    <svg viewBox="0 0 480 560" className="zh-journey__svg" role="img"
         aria-label="A map of the cities I have called home: Chefoo, Beijing, Montréal, and one more to come.">
      <defs>
        <linearGradient id="j-bg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"  stopColor="var(--accent)" stopOpacity="0.16" />
          <stop offset="100%" stopColor="var(--ink)"   stopOpacity="0.06" />
        </linearGradient>
        <pattern id="j-dots" width="6" height="6" patternUnits="userSpaceOnUse">
          <circle cx="3" cy="3" r="0.5" fill="var(--ink)" fillOpacity="0.1" />
        </pattern>
        <marker id="j-arrow" viewBox="0 0 10 10" refX="9" refY="5"
                markerWidth="5.5" markerHeight="5.5" orient="auto-start-reverse">
          <path d="M 0 0 L 10 5 L 0 10 z" fill="var(--ink)" fillOpacity="0.65" />
        </marker>
      </defs>

      {/* Background — same paper-grain treatment as photo placeholders */}
      <rect width="480" height="560" fill={ag('j-bg')} />
      <rect width="480" height="560" fill={ag('j-dots')} />

      {/* ── Dashed connector paths (drawn first so vignettes sit on top) ── */}
      <g fill="none" stroke="var(--ink)" strokeOpacity="0.38" strokeWidth="1.5"
         strokeDasharray="5 5" strokeLinecap="round">
        {/* Chefoo → Beijing (skim across the bottom half) */}
        <path d="M 158 470 Q 240 500 300 420" markerEnd={ag('j-arrow')} />
        {/* Beijing → Montréal (the long flight — paper airplane sits on this leg) */}
        <path d="M 290 282 Q 248 232 215 218" markerEnd={ag('j-arrow')} />
        {/* Montréal → ? (the unknown next chapter) */}
        <path d="M 220 138 Q 295 100 348 102" markerEnd={ag('j-arrow')} />
      </g>

      {/* Paper airplane on the trans-Pacific leg — pointing up-left toward Montréal */}
      <g transform="translate(252 258) rotate(-144)">
        {/* dart silhouette (top wing, full opacity) */}
        <path d="M 20 0 L -14 -11 L -6 0 L -14 11 Z"
              fill="var(--accent)" fillOpacity="0.88" />
        {/* under-fold shading on the lower wing — paper-airplane crease feel */}
        <path d="M 20 0 L -14 11 L -6 0 Z"
              fill="var(--ink)" fillOpacity="0.22" />
        {/* center keel line (the fold along the spine) */}
        <line x1="20" y1="0" x2="-6" y2="0"
              stroke="var(--ink)" strokeOpacity="0.55" strokeWidth="0.9" />
        {/* crisp outline */}
        <path d="M 20 0 L -14 -11 L -6 0 L -14 11 Z"
              fill="none" stroke="var(--ink)" strokeOpacity="0.6" strokeWidth="1" />
      </g>

      {/* ── 1. Chefoo — sun, sea, beach (bottom-left) ── */}
      <g transform="translate(98, 458) scale(1.35)">
        <circle cx="-2" cy="-28" r="11" fill="var(--accent)" fillOpacity="0.75" />
        <g fill="none" stroke="var(--ink)" strokeOpacity="0.55" strokeWidth="1.2">
          <path d="M -38 -8 q 10 -5 20 0 t 20 0 t 20 0" />
          <path d="M -38 2 q 10 -5 20 0 t 20 0 t 20 0" />
          <path d="M -32 12 q 10 -5 20 0 t 20 0" strokeOpacity="0.35" />
        </g>
        <path d="M -44 22 Q -16 14 14 16 Q 38 18 48 26 L 48 32 L -44 32 Z"
              fill="var(--ink)" fillOpacity="0.55" />
        <text x="2" y="54" textAnchor="middle" fontSize="14"
              fontFamily="var(--display)" fontStyle="italic"
              fill="var(--ink)" fillOpacity="0.95">Chefoo</text>
        <text x="2" y="68" textAnchor="middle" fontSize="8"
              fontFamily="var(--mono)" letterSpacing="0.08em"
              fill="var(--ink)" fillOpacity="0.55">HOMETOWN</text>
      </g>

      {/* ── 2. Beijing — cluster of skyscrapers (lower-middle right) ── */}
      <g transform="translate(345, 362) scale(1.3)">
        <g fill="var(--ink)" fillOpacity="0.78">
          <rect x="-46" y="-30" width="14" height="50" />
          <rect x="-28" y="-52" width="18" height="72" />
          <rect x="-6"  y="-72" width="16" height="92" />
          <rect x="14"  y="-44" width="14" height="64" />
          <rect x="30"  y="-22" width="12" height="42" />
        </g>
        {/* slim antenna on the tallest tower */}
        <line x1="2" y1="-72" x2="2" y2="-86"
              stroke="var(--ink)" strokeOpacity="0.78" strokeWidth="1.4" />
        {/* a couple of accent windows so the cluster reads as inhabited */}
        <rect x="-2" y="-58" width="3" height="3" fill="var(--accent)" fillOpacity="0.85" />
        <rect x="4"  y="-42" width="3" height="3" fill="var(--accent)" fillOpacity="0.65" />
        <text x="-2" y="40" textAnchor="middle" fontSize="14"
              fontFamily="var(--display)" fontStyle="italic"
              fill="var(--ink)" fillOpacity="0.95">Beijing</text>
        <text x="-2" y="56" textAnchor="middle" fontSize="9"
              fontFamily="var(--mono)" letterSpacing="0.08em"
              fill="var(--ink)" fillOpacity="0.55">GREW UP</text>
      </g>

      {/* ── 3. Montréal — mountain + river + a building (higher-middle left) ── */}
      <g transform="translate(155, 175) scale(1.3)">
        {/* back ridge */}
        <path d="M -50 10 L -20 -22 L 0 -8 L 18 -32 L 38 -6 L 52 10 Z"
              fill="var(--ink)" fillOpacity="0.45" />
        {/* front mountain */}
        <path d="M -42 12 L -16 -38 L -4 -18 L 8 -44 L 28 -12 L 46 12 Z"
              fill="var(--ink)" fillOpacity="0.78" />
        {/* snow cap on the central peak */}
        <path d="M 4 -40 L 8 -44 L 14 -34 Z"
              fill="var(--bg)" fillOpacity="0.85" />
        {/* tiny building tucked at the base */}
        <rect x="22" y="4" width="12" height="16"
              fill="var(--ink)" fillOpacity="0.6" />
        <rect x="26" y="8"  width="2" height="2" fill="var(--accent)" fillOpacity="0.85" />
        {/* river — accent stroke curving below */}
        <path d="M -54 22 Q -20 16 8 22 T 56 24"
              fill="none" stroke="var(--accent)" strokeOpacity="0.7" strokeWidth="2.2"
              strokeLinecap="round" />
        <text x="0" y="46" textAnchor="middle" fontSize="14"
              fontFamily="var(--display)" fontStyle="italic"
              fill="var(--ink)" fillOpacity="0.95">Montréal</text>
        <text x="0" y="62" textAnchor="middle" fontSize="9"
              fontFamily="var(--mono)" letterSpacing="0.08em"
              fill="var(--ink)" fillOpacity="0.55">HOME</text>
      </g>

      {/* ── 4. ? — the unknown next chapter, a pirate parchment with a ? inside ── */}
      <g transform="translate(390, 80) rotate(-4) scale(1.2)">
        {/* parchment back-shadow — slight offset for depth */}
        <path d="M -33 -25 L -16 -30 L 4 -28 L 22 -30 L 35 -23 L 38 -8
                 L 36 8 L 39 22 L 28 31 L 8 28 L -10 32 L -28 27
                 L -35 16 L -33 0 L -38 -12 Z"
              fill="var(--ink)" fillOpacity="0.12"
              transform="translate(2 3)" />
        {/* parchment body — torn / irregular edges */}
        <path d="M -33 -25 L -16 -30 L 4 -28 L 22 -30 L 35 -23 L 38 -8
                 L 36 8 L 39 22 L 28 31 L 8 28 L -10 32 L -28 27
                 L -35 16 L -33 0 L -38 -12 Z"
              fill="var(--accent)" fillOpacity="0.22"
              stroke="var(--accent)" strokeOpacity="0.85" strokeWidth="1.3"
              strokeLinejoin="round" />
        {/* fold creases across the paper */}
        <g fill="none" stroke="var(--ink)" strokeOpacity="0.22" strokeWidth="0.7">
          <path d="M -32 -6 Q 0 -10 36 -2" />
          <path d="M -8 -29 Q -6 0 -4 30" strokeOpacity="0.16" />
        </g>
        {/* dotted treasure-trail in the corner */}
        <path d="M -24 20 q 8 -6 14 0 t 14 -4"
              fill="none" stroke="var(--accent)" strokeOpacity="0.65"
              strokeWidth="1.1" strokeDasharray="1.4 3" strokeLinecap="round" />
        {/* tiny X marks the spot */}
        <g stroke="var(--accent)" strokeOpacity="0.8" strokeWidth="1.4"
           strokeLinecap="round">
          <line x1="22" y1="14" x2="28" y2="20" />
          <line x1="28" y1="14" x2="22" y2="20" />
        </g>
        {/* the question mark itself, centered on the parchment */}
        <text x="-2" y="8" textAnchor="middle" fontSize="32"
              fontFamily="var(--display)" fontWeight="600" fontStyle="italic"
              fill="var(--ink)" fillOpacity="0.85">?</text>
        {/* label below */}
        <text x="0" y="54" textAnchor="middle" fontSize="13"
              fontFamily="var(--display)" fontStyle="italic"
              fill="var(--ink)" fillOpacity="0.9"
              transform="rotate(4)">Where next?</text>
      </g>
    </svg>
  );
}

// ── About content ──────────────────────────────────────────────────────────
function AboutPage() {
  const [lbIndex, setLbIndex] = React.useState(-1); // -1 = closed
  const open = lbIndex >= 0;
  const close = () => setLbIndex(-1);
  const prev  = () => setLbIndex((i) => (i - 1 + PHOTOS.length) % PHOTOS.length);
  const next  = () => setLbIndex((i) => (i + 1) % PHOTOS.length);

  return (
    <>
      <section className="zh-shell zh-about">
        <div className="zh-about__row">
          <div className="zh-about__bio">
            <p>
              Outside of work I try to spend as much time outdoors as
              Montréal weather will allow — <em>hiking</em> in the warm
              months, <em>biking</em> when the streets are dry,{' '}
              <em>skiing</em> through the long winter, and a stubborn
              weekly <em>soccer</em> game my legs are slowly losing
              patience with.
            </p>
            <p>
              What keeps me coming back is the quiet of it — wide-open
              landscapes, light through trees, a river that hasn't quite
              decided where to go. I take a lot of photographs out there,
              mostly of mountains, water, and whatever animal is willing
              to stand still long enough to be photographed.
            </p>
          </div>
          <figure className="zh-journey" aria-label="Cities I have called home">
            <JourneyMap />
            <figcaption className="zh-journey__cap">
              <span className="zh-eyebrow">Cities, in order</span>
              <span className="zh-journey__caption-text">
                Chefoo → Beijing → Montréal → <em>somewhere new</em>.
              </span>
            </figcaption>
          </figure>
        </div>
      </section>

      <section className="zh-shell zh-wall">
        <ul className="zh-wall__grid">
          {PHOTOS.map((p, i) => (
            <li key={p.id} className="zh-wall__tile">
              <button type="button" className="zh-photo"
                      style={{ aspectRatio: p.aspect }}
                      onClick={() => setLbIndex(i)}
                      aria-label={`Open photo ${i+1}: ${p.caption}`}>
                <Placeholder kind={p.kind} w={600} h={Math.round(600 / p.aspect)} />
                <span className="zh-photo__cap">
                  <span className="zh-photo__cap-place">{p.place}</span>
                  <span className="zh-photo__cap-sep">·</span>
                  <span className="zh-photo__cap-date">{p.date}</span>
                </span>
              </button>
            </li>
          ))}
        </ul>
      </section>

      <Lightbox open={open} photos={PHOTOS} index={Math.max(0, lbIndex)}
                onClose={close} onPrev={prev} onNext={next} />
    </>
  );
}

// ── Mount ───────────────────────────────────────────────────────────────────
function AboutApp() {
  return (
    <Shell page="about">
      <AboutPage />
    </Shell>
  );
}

ReactDOM.createRoot(document.getElementById('app')).render(<AboutApp />);
