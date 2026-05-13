<script lang="ts">
    import { onMount } from "svelte";

    let scrolled = $state(false);

    function openContact() {
        window.dispatchEvent(new CustomEvent("open-contact"));
    }

    onMount(() => {
        const onScroll = () => {
            scrolled = window.scrollY > 8;
        };
        onScroll();
        window.addEventListener("scroll", onScroll, { passive: true });
        return () => window.removeEventListener("scroll", onScroll);
    });
</script>

<header class="zh-header {scrolled ? 'zh-header--scrolled' : ''}">
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

        <a href="#top" class="zh-mark" aria-label="Home">
            <span class="zh-mark__name">Zijun Yu</span>
            <span class="zh-mark__role">PhD · McGill</span>
        </a>

        <nav class="zh-nav" aria-label="Primary">
            <a href="/#top" class="zh-nav__a">Home</a>
            <a href="/publications" class="zh-nav__a">Publications</a>
            <a href="/cv" class="zh-nav__a">CV</a>
        </nav>
    </div>
</header>
