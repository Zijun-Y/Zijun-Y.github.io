<script lang="ts">
    import { onMount } from "svelte";

    // McGill email, base64-encoded for basic spam deterrence
    const ES = "emlqdW4ueXVAbWFpbC5tY2dpbGwuY2E=";
    const email = atob(ES);
    // Force text (non-emoji) rendering of ↗ on iOS via variation selector U+FE0E
    const ARW = "↗︎";

    let open = $state(false);
    let copied = $state(false);
    let copyTimer: ReturnType<typeof setTimeout> | null = null;

    function lockScroll() {
        // scrollbar-gutter: stable on <html> keeps gutter reserved — no padding needed
        document.body.style.overflow = "hidden";
    }
    function unlockScroll() {
        document.body.style.overflow = "";
    }

    function close() {
        open = false;
        unlockScroll();
    }

    async function copyEmail() {
        try {
            if (navigator.clipboard?.writeText) {
                await navigator.clipboard.writeText(email);
            } else {
                // Fallback for non-secure contexts (HTTP dev, older browsers)
                const el = document.createElement("textarea");
                el.value = email;
                el.style.cssText = "position:absolute;left:-9999px;top:0";
                document.body.appendChild(el);
                el.select();
                document.execCommand("copy");
                document.body.removeChild(el);
            }
            copied = true;
            if (copyTimer) clearTimeout(copyTimer);
            copyTimer = setTimeout(() => {
                copied = false;
            }, 2000);
        } catch {
            // silently fail — mailto link still works
        }
    }

    onMount(() => {
        const openHandler = () => {
            open = true;
            lockScroll();
        };
        const keyHandler = (e: KeyboardEvent) => {
            if (e.key === "Escape" && open) close();
        };

        window.addEventListener("open-contact", openHandler);
        document.addEventListener("keydown", keyHandler);
        return () => {
            window.removeEventListener("open-contact", openHandler);
            document.removeEventListener("keydown", keyHandler);
            document.body.style.overflow = "";
            if (copyTimer) clearTimeout(copyTimer);
        };
    });
</script>

<!-- Scrim -->
<!-- svelte-ignore a11y_click_events_have_key_events a11y_no_static_element_interactions -->
<div
    class="zh-cscrim {open ? 'is-open' : ''}"
    onclick={close}
    aria-hidden="true"
></div>

<!-- Panel -->
<aside
    class="zh-cpanel {open ? 'is-open' : ''}"
    aria-label="Contact"
    aria-hidden={!open}
>
    <div class="zh-cpanel__inner">
        <header class="zh-cpanel__head">
            <span class="zh-eyebrow">Get in touch</span>
            <button
                class="zh-cpanel__close"
                type="button"
                onclick={close}
                aria-label="Close contact panel"
            >
                <svg
                    viewBox="0 0 24 24"
                    width="20"
                    height="20"
                    aria-hidden="true"
                >
                    <path
                        d="M6 6l12 12M18 6L6 18"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="1.4"
                        stroke-linecap="round"
                    />
                </svg>
            </button>
        </header>

        <!-- Portrait placeholder -->
        <div
            class="zh-cpanel__photo"
            role="img"
            aria-label="Photo placeholder for Zijun Yu"
        >
            <svg
                viewBox="0 0 300 360"
                preserveAspectRatio="xMidYMid slice"
                class="zh-cpanel__photo-svg"
                aria-hidden="true"
            >
                <defs>
                    <linearGradient id="zhPBg" x1="0" y1="0" x2="0" y2="1">
                        <stop
                            offset="0%"
                            stop-color="var(--accent)"
                            stop-opacity="0.14"
                        />
                        <stop
                            offset="100%"
                            stop-color="var(--accent)"
                            stop-opacity="0.04"
                        />
                    </linearGradient>
                    <pattern
                        id="zhPDots"
                        width="6"
                        height="6"
                        patternUnits="userSpaceOnUse"
                    >
                        <circle
                            cx="3"
                            cy="3"
                            r="0.6"
                            fill="var(--ink)"
                            fill-opacity="0.12"
                        />
                    </pattern>
                </defs>
                <rect width="300" height="360" fill="url(#zhPBg)" />
                <rect width="300" height="360" fill="url(#zhPDots)" />
                <path
                    d="M0 360 Q30 260 90 240 Q120 234 150 234 Q180 234 210 240 Q270 260 300 360 Z"
                    fill="var(--ink)"
                    fill-opacity="0.78"
                />
                <circle
                    cx="150"
                    cy="170"
                    r="62"
                    fill="var(--ink)"
                    fill-opacity="0.78"
                />
                <text
                    x="150"
                    y="332"
                    text-anchor="middle"
                    fill="var(--bg)"
                    font-family="var(--mono)"
                    font-size="10"
                    letter-spacing="0.12em"
                >
                    PHOTO · PLACEHOLDER
                </text>
            </svg>
        </div>

        <div class="zh-cpanel__body">
            <section class="zh-cpanel__section">
                <span class="zh-eyebrow">Reach</span>
                <ul class="zh-cpanel__links">
                    <li class="zh-cpanel__link-item">
                        <a href="mailto:{email}" class="zh-cpanel__link-a">
                            <span class="zh-cpanel__link-label">Email</span>
                            <span class="zh-cpanel__email-value"
                                >{email} {ARW}</span
                            >
                        </a>
                        <button
                            class="zh-cpanel__copy {copied ? 'is-copied' : ''}"
                            type="button"
                            onclick={copyEmail}
                            aria-label="Copy email address"
                            title="Copy email"
                        >
                            {#if copied}
                                <svg
                                    viewBox="0 0 24 24"
                                    width="14"
                                    height="14"
                                    aria-hidden="true"
                                >
                                    <path
                                        d="M5 13l4 4L19 7"
                                        fill="none"
                                        stroke="currentColor"
                                        stroke-width="2"
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                    />
                                </svg>
                            {:else}
                                <svg
                                    viewBox="0 0 24 24"
                                    width="14"
                                    height="14"
                                    aria-hidden="true"
                                >
                                    <rect
                                        x="9"
                                        y="9"
                                        width="13"
                                        height="13"
                                        rx="2"
                                        fill="none"
                                        stroke="currentColor"
                                        stroke-width="1.5"
                                    />
                                    <path
                                        d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"
                                        fill="none"
                                        stroke="currentColor"
                                        stroke-width="1.5"
                                        stroke-linecap="round"
                                    />
                                </svg>
                            {/if}
                        </button>
                    </li>
                    <li>
                        <a
                            href="https://github.com/Zijun-Y"
                            target="_blank"
                            rel="noreferrer noopener"
                        >
                            <span class="zh-cpanel__link-label">GitHub</span>
                            <span class="zh-cpanel__link-value"
                                >Zijun-Y {ARW}</span
                            >
                        </a>
                    </li>
                    <li>
                        <a
                            href="https://www.linkedin.com/in/yuzijun"
                            target="_blank"
                            rel="noreferrer noopener"
                        >
                            <span class="zh-cpanel__link-label">LinkedIn</span>
                            <span class="zh-cpanel__link-value"
                                >yuzijun {ARW}</span
                            >
                        </a>
                    </li>
                    <li>
                        <a
                            href="https://openreview.net/profile?id=~Zijun_Yu2"
                            target="_blank"
                            rel="noreferrer noopener"
                        >
                            <span class="zh-cpanel__link-label">OpenReview</span
                            >
                            <span class="zh-cpanel__link-value"
                                >Zijun_Yu2 {ARW}</span
                            >
                        </a>
                    </li>
                    <li>
                        <a
                            href="https://orcid.org/0009-0001-1989-1304"
                            target="_blank"
                            rel="noreferrer noopener"
                        >
                            <span class="zh-cpanel__link-label">ORCID</span>
                            <span class="zh-cpanel__link-value"
                                >0009-0001-1989-1304 {ARW}</span
                            >
                        </a>
                    </li>
                    <li>
                        <a
                            href="https://scholar.google.com/citations?user=EF_Zis4AAAAJ&hl=en"
                            target="_blank"
                            rel="noreferrer noopener"
                        >
                            <span class="zh-cpanel__link-label"
                                >Google Scholar</span
                            >
                            <span class="zh-cpanel__link-value"
                                >Zijun Yu {ARW}</span
                            >
                        </a>
                    </li>
                </ul>
            </section>

            <section class="zh-cpanel__section">
                <span class="zh-eyebrow">Office</span>
                <p class="zh-cpanel__addr">
                    Burnside Hall<br />
                    805 Sherbrooke Street West<br />
                    Montréal, QC&nbsp;&nbsp;H3A 0B9<br />
                </p>
                <p class="zh-cpanel__addr">
                    Pavillon André-Aisenstadt<br />
                    2920, Chemin de la Tour<br />
                    Montréal, QC&nbsp;&nbsp;H3T 1N8<br />
                </p>
                <span class="zh-cpanel__addr-quiet">
                    By appointment — drop a line first.
                </span>
            </section>
        </div>
    </div>
</aside>
