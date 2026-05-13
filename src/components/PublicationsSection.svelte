<script lang="ts">
    import { onMount } from "svelte";
    import type { Publication } from "@/content/publications";

    let { publications, showHeading = true }: { publications: Publication[]; showHeading?: boolean } = $props();

    let sectionEl: HTMLElement;
    let activeYear = $state(publications[0]?.year ?? 0);
    let railVisible = $state(false);

    const uniqueYears: number[] = (() => {
        const seen = new Set<number>();
        const out: number[] = [];
        for (const p of publications) {
            if (!seen.has(p.year)) {
                seen.add(p.year);
                out.push(p.year);
            }
        }
        return out;
    })();

    onMount(() => {
        const tick = () => {
            // Read pub row positions via DOM query — avoids ref-collecting in each loop
            const rows =
                sectionEl?.querySelectorAll<HTMLElement>("[data-year]");
            const triggerY = window.innerHeight * 0.3;
            let best: { top: number; year: number } | null = null;
            rows?.forEach((el) => {
                const top = el.getBoundingClientRect().top;
                const year = Number(el.dataset.year);
                if (top <= triggerY) {
                    if (!best || top > best.top) best = { top, year };
                }
            });
            if (best) activeYear = best.year;

            if (sectionEl) {
                const r = sectionEl.getBoundingClientRect();
                const vh = window.innerHeight;
                railVisible = r.top < vh * 0.6 && r.bottom > vh * 0.2;
            }
        };

        tick();
        window.addEventListener("scroll", tick, { passive: true });
        window.addEventListener("resize", tick);
        return () => {
            window.removeEventListener("scroll", tick);
            window.removeEventListener("resize", tick);
        };
    });
</script>

<section id="publications" class="zh-pubs-wrap" bind:this={sectionEl}>
    <!-- Year rail -->
    <aside
        class="zh-yearrail {railVisible ? 'is-visible' : ''}"
        aria-hidden="true"
    >
        <span class="zh-yearrail__label">Year</span>
        <div class="zh-yearrail__years">
            {#each uniqueYears as year}
                <span
                    class="zh-yearrail__y {year === activeYear
                        ? 'is-active'
                        : ''}">{year}</span
                >
            {/each}
        </div>
        <span class="zh-yearrail__count">
            {String(uniqueYears.indexOf(activeYear) + 1).padStart(
                2,
                "0",
            )}/{String(uniqueYears.length).padStart(2, "0")}
        </span>
    </aside>

    <div class="zh-pubs zh-shell">
        {#if showHeading}
        <header class="zh-pubs__head">
            <h2 class="zh-pubs__title">
                Recent work in <em>conformal prediction</em>.
            </h2>
            <p class="zh-pubs__sub">
                <sup>†</sup> denotes equal contribution.
            </p>
        </header>
        {:else}
        <div class="zh-pubs__head--minimal">
            <p class="zh-pubs__sub">
                <sup>†</sup> denotes equal contribution.
            </p>
        </div>
        {/if}

        <ol class="zh-pubs__list">
            {#each publications as pub, idx}
                <article class="zh-pub" data-year={pub.year}>
                    <div class="zh-pub__num" aria-hidden="true">
                        {String(idx + 1).padStart(2, "0")}
                    </div>

                    <header class="zh-pub__head">
                        <span class="zh-pub__venue" title={pub.venueLong}>
                            <span class="zh-pub__venue-name">{pub.venue}</span>
                            <span class="zh-pub__venue-sep">·</span>
                            <span class="zh-pub__venue-year">{pub.year}</span>
                            {#if pub.status === "accepted"}
                                <span class="zh-pub__status">Accepted</span>
                            {:else if pub.status === "preprint"}
                                <span
                                    class="zh-pub__status zh-pub__status--quiet"
                                    >Preprint</span
                                >
                            {:else if pub.status === "submitted"}
                                <span
                                    class="zh-pub__status zh-pub__status--quiet"
                                    >Under review</span
                                >
                            {/if}
                        </span>
                    </header>

                    <h3 class="zh-pub__title">{pub.title}</h3>

                    <p class="zh-pub__authors">
                        {#each pub.authors as author, i}
                            {#if i > 0}<span class="zh-pub__sep"
                                    >,&nbsp;
                                </span>{/if}<span
                                class="zh-pub__author {author.self
                                    ? 'zh-pub__author--self'
                                    : ''}"
                                >{author.name}{#if author.coFirst}<sup
                                        class="zh-pub__co">†</sup
                                    >{/if}</span
                            >
                        {/each}
                    </p>

                    <div class="zh-pub__foot">
                        <ul class="zh-pub__tags">
                            {#each pub.tags as tag}
                                <li>{tag}</li>
                            {/each}
                        </ul>
                        <div class="zh-pub__links">
                            {#if pub.links.paper}
                                <a
                                    href={pub.links.paper}
                                    target="_blank"
                                    rel="noreferrer noopener">Paper ↗</a
                                >
                            {/if}
                            {#if pub.links.arxiv}
                                <a
                                    href={pub.links.arxiv}
                                    target="_blank"
                                    rel="noreferrer noopener">arXiv ↗</a
                                >
                            {/if}
                            {#if pub.links.code}
                                <a
                                    href={pub.links.code}
                                    target="_blank"
                                    rel="noreferrer noopener">Code ↗</a
                                >
                            {/if}
                            {#if pub.links.openreview}
                                <a
                                    href={pub.links.openreview}
                                    target="_blank"
                                    rel="noreferrer noopener">OpenReview ↗</a
                                >
                            {/if}
                            {#if Object.keys(pub.links).length === 0 && pub.status === "submitted"}
                                <span class="zh-pub__pending"
                                    >Preprint coming soon</span
                                >
                            {/if}
                        </div>
                    </div>
                </article>
            {/each}
        </ol>
    </div>
</section>
