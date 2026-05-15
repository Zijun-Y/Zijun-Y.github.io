<script lang="ts">
    import { onMount } from "svelte";

    interface Photo {
        name: string;
        thumb: string;
        full: string;
        aspect: number;
        caption: string;
        place: string;
        date: string;
    }

    let { photos }: { photos: Photo[] } = $props();

    let lbIndex = $state(-1);
    let open = $derived(lbIndex >= 0);

    function close() { lbIndex = -1; }
    function prev() { lbIndex = (lbIndex - 1 + photos.length) % photos.length; }
    function next() { lbIndex = (lbIndex + 1) % photos.length; }

    $effect(() => {
        if (!open) return;
        const onKey = (e: KeyboardEvent) => {
            if (e.key === "Escape")     close();
            if (e.key === "ArrowLeft")  prev();
            if (e.key === "ArrowRight") next();
        };
        const prevOverflow = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        document.addEventListener("keydown", onKey);
        return () => {
            document.body.style.overflow = prevOverflow;
            document.removeEventListener("keydown", onKey);
        };
    });

    let currentPhoto = $derived(open ? photos[lbIndex] : null);
    let lbLabel = $derived(open
        ? `${String(lbIndex + 1).padStart(2, "0")} / ${String(photos.length).padStart(2, "0")}`
        : "");
</script>

<section class="zh-wall zh-shell">
    <ul class="zh-wall__grid">
        {#each photos as photo, i}
            <li class="zh-wall__tile">
                <button
                    type="button"
                    class="zh-photo"
                    style="aspect-ratio: {photo.aspect}"
                    onclick={() => (lbIndex = i)}
                    aria-label={`Open photo ${i + 1}: ${photo.caption}`}
                >
                    <img
                        src={photo.thumb}
                        alt={photo.caption}
                        class="zh-photo__img"
                        loading="lazy"
                        decoding="async"
                    />
                    <span class="zh-photo__cap">
                        <span class="zh-photo__cap-place">{photo.place}</span>
                        <span class="zh-photo__cap-sep">·</span>
                        <span class="zh-photo__cap-date">{photo.date}</span>
                    </span>
                </button>
            </li>
        {/each}
    </ul>
</section>

<!-- Lightbox — kept mounted for CSS transitions -->
<div
    class="zh-lb {open ? 'is-open' : ''}"
    role="dialog"
    aria-modal="true"
    aria-label="Photo lightbox"
    aria-hidden={!open}
>
    <button class="zh-lb__scrim" type="button" onclick={close} aria-label="Close lightbox" />

    <div class="zh-lb__stage">
        {#if currentPhoto}
            <div class="zh-lb__frame">
                <img
                    src={currentPhoto.full}
                    alt={currentPhoto.caption}
                    loading="eager"
                    decoding="async"
                />
            </div>
            <div class="zh-lb__meta">
                <span class="zh-eyebrow">
                    {lbLabel}
                    <span class="zh-lb__dot">·</span>
                    {currentPhoto.place}
                    <span class="zh-lb__dot">·</span>
                    {currentPhoto.date}
                </span>
                <p class="zh-lb__caption">{currentPhoto.caption}</p>
            </div>
        {/if}
    </div>

    <button class="zh-lb__nav zh-lb__nav--prev" type="button" onclick={prev} aria-label="Previous photo">←</button>
    <button class="zh-lb__nav zh-lb__nav--next" type="button" onclick={next} aria-label="Next photo">→</button>
    <button class="zh-lb__close" type="button" onclick={close} aria-label="Close lightbox">
        <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
            <path d="M6 6l12 12M18 6L6 18" fill="none" stroke="currentColor"
                  stroke-width="1.4" stroke-linecap="round" />
        </svg>
    </button>
</div>
