<script lang="ts">
    import { onMount } from "svelte";

    let scrolled = $state(false);
    let mobileOpen = $state(false);
    let headerEl: HTMLElement;

    function openContact() {
        window.dispatchEvent(new CustomEvent("open-contact"));
    }
    function toggleMobile() {
        mobileOpen = !mobileOpen;
    }
    function closeMobile() {
        mobileOpen = false;
    }

    onMount(() => {
        const onScroll = () => { scrolled = window.scrollY > 8; };
        onScroll();
        window.addEventListener("scroll", onScroll, { passive: true });

        // Close mobile nav when clicking anywhere outside the header
        const onDocClick = (e: MouseEvent) => {
            if (mobileOpen && !headerEl.contains(e.target as Node)) {
                mobileOpen = false;
            }
        };
        document.addEventListener("click", onDocClick, { capture: true });

        return () => {
            window.removeEventListener("scroll", onScroll);
            document.removeEventListener("click", onDocClick, { capture: true });
        };
    });
</script>

<header class="zh-header {scrolled || mobileOpen ? 'zh-header--scrolled' : ''}" bind:this={headerEl}>
    <div class="zh-shell zh-header__inner">
        <button
            class="zh-getintouch"
            type="button"
            onclick={openContact}
            aria-label="Open contact panel"
        >
            <span class="zh-getintouch__dot" aria-hidden="true"></span>
            <span class="zh-getintouch__label">Get in touch</span>
        </button>

        <a href="/#top" class="zh-mark" aria-label="Home">
            <span class="zh-mark__name">Zijun Yu</span>
            <span class="zh-mark__role">PhD · McGill</span>
        </a>

        <nav class="zh-nav" aria-label="Primary">
            <a href="/#top" class="zh-nav__a">Home</a>
            <a href="/publications" class="zh-nav__a">Publications</a>
            <a href="/cv" class="zh-nav__a">CV</a>
        </nav>

        <button
            class="zh-hamburger"
            type="button"
            onclick={toggleMobile}
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileOpen}
        >
            {#if mobileOpen}
                <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
                    <path
                        d="M6 6l12 12M18 6L6 18"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="1.5"
                        stroke-linecap="round"
                    />
                </svg>
            {:else}
                <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
                    <path
                        d="M4 7h16M4 12h16M4 17h16"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="1.5"
                        stroke-linecap="round"
                    />
                </svg>
            {/if}
        </button>
    </div>

    <nav
        class="zh-mobile-nav {mobileOpen ? 'is-open' : ''}"
        aria-label="Mobile navigation"
        aria-hidden={!mobileOpen}
    >
        <div class="zh-mobile-nav__inner">
            <a href="/#top" class="zh-mobile-nav__a" onclick={closeMobile}>Home</a>
            <a href="/publications" class="zh-mobile-nav__a" onclick={closeMobile}>Publications</a>
            <a href="/cv" class="zh-mobile-nav__a" onclick={closeMobile}>CV</a>
        </div>
    </nav>
</header>
