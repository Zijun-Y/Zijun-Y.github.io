// blog.jsx — Blog index + post detail.
//
// Single page, hash-routed: empty hash → index (list of posts), #post/<slug>
// → detail view. Production (Svelte) will swap this for proper routes; the
// list and post markup carry over unchanged.

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/ {
    palette: ["#EDEEEA", "#15171A", "#3B6FB0"],
    typePairing: "serif-led",
    density: "comfortable",
    network: "subtle",
    accent: "#3B6FB0",
    showGrain: false,
}; /*EDITMODE-END*/

// ── Data ────────────────────────────────────────────────────────────────────
// Each post: slug, date, readMin, category, title, excerpt, tags, body (JSX).
// Body is plain JSX — at production time these would come from a real source
// (mdx, markdown + remark, a CMS, etc).

const POSTS = [];

const CATEGORIES = [
    "All",
    ...Array.from(new Set(POSTS.map((p) => p.category))),
];

// ── Helpers ─────────────────────────────────────────────────────────────────
function fmtDate(iso) {
    // "Apr 22, 2026" — short month + day + 4-digit year.
    const d = new Date(iso + "T00:00:00");
    return d.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
    });
}
function yearOf(iso) {
    return iso.slice(0, 4);
}

// ── Hash routing ────────────────────────────────────────────────────────────
// Empty hash → index. `#post/<slug>` → detail. We keep it simple — the
// component re-reads `location.hash` on every change.
function useHashRoute() {
    const [hash, setHash] = React.useState(() => window.location.hash || "");
    React.useEffect(() => {
        const onHash = () => {
            setHash(window.location.hash || "");
            window.scrollTo({ top: 0, behavior: "instant" });
        };
        window.addEventListener("hashchange", onHash);
        return () => window.removeEventListener("hashchange", onHash);
    }, []);
    const m = hash.match(/^#post\/([^/?#]+)/);
    return { kind: m ? "post" : "index", slug: m ? m[1] : null };
}

// ── Blog index ──────────────────────────────────────────────────────────────
function BlogIndex() {
    const [filter, setFilter] = React.useState("All");
    const filtered =
        filter === "All" ? POSTS : POSTS.filter((p) => p.category === filter);

    return (
        <section className="zh-shell zh-blog">
            <div
                className="zh-blog__filters"
                role="tablist"
                aria-label="Filter by category"
            >
                {CATEGORIES.map((c) => (
                    <button
                        key={c}
                        type="button"
                        className={`zh-blog__filter ${filter === c ? "is-active" : ""}`}
                        role="tab"
                        aria-selected={filter === c}
                        onClick={() => setFilter(c)}
                    >
                        <span className="zh-blog__filter-label">{c}</span>
                        <span className="zh-blog__filter-count">
                            {c === "All"
                                ? POSTS.length
                                : POSTS.filter((p) => p.category === c).length}
                        </span>
                    </button>
                ))}
            </div>

            <ol className="zh-blog__list">
                {filtered.map((p, i) => (
                    <li key={p.slug} className="zh-blog__item">
                        <a href={`#post/${p.slug}`} className="zh-blog__row">
                            <span className="zh-blog__num" aria-hidden="true">
                                {String(i + 1).padStart(2, "0")}
                            </span>
                            <div className="zh-blog__meta">
                                <span className="zh-blog__date">
                                    <time dateTime={p.date}>
                                        {fmtDate(p.date)}
                                    </time>
                                </span>
                                <span className="zh-blog__cat">
                                    {p.category}
                                </span>
                                <span className="zh-blog__read">
                                    {p.readMin} min
                                </span>
                            </div>
                            <div className="zh-blog__body">
                                <h2 className="zh-blog__title">{p.title}</h2>
                                <p className="zh-blog__excerpt">{p.excerpt}</p>
                                <ul className="zh-blog__tags">
                                    {p.tags.map((t) => (
                                        <li key={t}>{t}</li>
                                    ))}
                                </ul>
                            </div>
                            <span className="zh-blog__arrow" aria-hidden="true">
                                →
                            </span>
                        </a>
                    </li>
                ))}
            </ol>

            {filtered.length === 0 && (
                <p className="zh-blog__empty">
                    Nothing under <em>{filter}</em> yet.
                </p>
            )}
        </section>
    );
}

// ── Post detail ─────────────────────────────────────────────────────────────
function PostDetail({ slug }) {
    const post = POSTS.find((p) => p.slug === slug);

    // 404
    if (!post) {
        return (
            <section className="zh-shell zh-blog">
                <header className="zh-page__head">
                    <span className="zh-eyebrow">§ Not found</span>
                    <h1 className="zh-page__title">
                        <em>This page wandered off.</em>
                    </h1>
                    <p className="zh-page__sub">
                        The post <code>{slug}</code> isn't here. Try the{" "}
                        <a href="#">full list</a>.
                    </p>
                </header>
            </section>
        );
    }

    const idx = POSTS.findIndex((p) => p.slug === post.slug);
    const prev = POSTS[idx + 1]; // older
    const next = POSTS[idx - 1]; // newer

    return (
        <article className="zh-post-wrap">
            <div className="zh-shell zh-post">
                <nav className="zh-post__crumbs">
                    <a href="#" className="zh-post__back">
                        <span aria-hidden="true">←</span>
                        <span>All posts</span>
                    </a>
                    <span className="zh-post__breadsep">/</span>
                    <span className="zh-post__crumb">{post.category}</span>
                </nav>

                <header className="zh-post__head">
                    <div className="zh-post__meta">
                        <span className="zh-post__date">
                            <time dateTime={post.date}>
                                {fmtDate(post.date)}
                            </time>
                        </span>
                        <span className="zh-post__dot" aria-hidden="true">
                            ·
                        </span>
                        <span className="zh-post__cat">{post.category}</span>
                        <span className="zh-post__dot" aria-hidden="true">
                            ·
                        </span>
                        <span className="zh-post__read">
                            {post.readMin} min read
                        </span>
                    </div>
                    <h1 className="zh-post__title">{post.title}</h1>
                    <p className="zh-post__lede">{post.excerpt}</p>
                </header>

                <div className="zh-post__body">{post.body()}</div>

                <footer className="zh-post__foot">
                    <ul className="zh-post__tags">
                        {post.tags.map((t) => (
                            <li key={t}>{t}</li>
                        ))}
                    </ul>
                    <div className="zh-post__nav">
                        {prev && (
                            <a
                                href={`#post/${prev.slug}`}
                                className="zh-post__navlink zh-post__navlink--prev"
                            >
                                <span className="zh-eyebrow">Older</span>
                                <span className="zh-post__navtitle">
                                    {prev.title}
                                </span>
                            </a>
                        )}
                        {next && (
                            <a
                                href={`#post/${next.slug}`}
                                className="zh-post__navlink zh-post__navlink--next"
                            >
                                <span className="zh-eyebrow">Newer</span>
                                <span className="zh-post__navtitle">
                                    {next.title}
                                </span>
                            </a>
                        )}
                    </div>
                </footer>
            </div>
        </article>
    );
}

// ── Mount ───────────────────────────────────────────────────────────────────
function BlogApp() {
    const route = useHashRoute();
    return (
        <Shell page="blog">
            {route.kind === "post" ? (
                <PostDetail slug={route.slug} />
            ) : (
                <BlogIndex />
            )}
        </Shell>
    );
}

ReactDOM.createRoot(document.getElementById("app")).render(<BlogApp />);
