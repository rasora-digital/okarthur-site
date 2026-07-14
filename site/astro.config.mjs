// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  site: 'https://okarthur.com',
  integrations: [sitemap()],
  markdown: {
    // Astro runs SmartyPants over markdown by default, which turns the straight
    // apostrophes in the note sources into curly ones on the way to HTML. The
    // source stays clean, so a grep of src/ finds nothing, and the curly
    // characters appear only in the build. Off, so that what is written is what
    // is served. Nothing is lost: no note uses -- or ..., so em dash and
    // ellipsis conversion were doing no work. Enforced by scripts/check-text.mjs.
    smartypants: false,
  },
});
