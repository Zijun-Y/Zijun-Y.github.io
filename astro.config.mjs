// @ts-check
import { defineConfig } from "astro/config";

import tailwindcss from "@tailwindcss/vite";

import svelte from "@astrojs/svelte";

// https://astro.build/config
export default defineConfig({
    vite: {
        plugins: [tailwindcss()],
        resolve: {
            alias: {
                "@": "/src",
            },
        },
    },

    integrations: [svelte()],
    site: "https://zijunyu.com",
    output: "static",
    build: {
        inlineStylesheets: 'always',
    },
});
