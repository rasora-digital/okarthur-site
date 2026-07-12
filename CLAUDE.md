# okarthur-site

Static marketing site for OkArthur, a data and AI advisory in the GCC.
Live at https://okarthur.com

## What this is

An Astro site. It lives entirely in `site/`. There is nothing to build at
the repo root.

The legacy hand-written HTML site, its Jekyll layer and its Python tooling
were removed when the site was cut over to Astro. Do not add Python
application code here. If you find references to `make`, Jekyll, `_layouts`
or `requirements.txt`, they are stale and should be deleted.

## Commands

Run these inside `site/`:

    npm install
    npm run dev       local dev server
    npm run build     writes site/dist
    npm run preview   serve the built site

## Layout

    site/src/pages/            routes (index, about, review, contact,
                               privacy, terms, notes, 404)
    site/src/content/notes/    notes collection, markdown, schema in
                               site/src/content.config.ts
    site/src/lib/schema.ts     shared JSON-LD Person/WebSite definitions
    site/public/               copied verbatim into dist

`site/public/` holds `CNAME`, `humans.txt`, `robots.txt`, `llms.txt`,
fonts, favicons, and `.well-known/security.txt`. Astro copies dotfiles and
dot-directories, so `.well-known/` survives the build.

## Pages and URLs

Routes build as directories, so pages are served at `/about/`, not
`/about.html`. The old `.html` URLs from the legacy site no longer exist.

Adding a page needs no sitemap edit. `@astrojs/sitemap` generates
`sitemap-index.xml` and `sitemap-0.xml` at build time. `rss.xml` is
generated from the notes collection, drafts excluded.

## Deployment

GitHub Pages, Source set to **GitHub Actions** (not "deploy from a
branch"). `.github/workflows/deploy.yml` runs on push to `main`: it builds
`site/` with `withastro/action@v6`, which installs, builds and uploads the
Pages artifact itself, then `actions/deploy-pages@v5` publishes it.

The custom domain survives because `site/public/CNAME` lands in the build
output. There is no CNAME file at the repo root and there must not be one.

Cloudflare Free sits in front, DNS on Cloudflare. Deploy sequence: merge to
`main`, wait for the deploy workflow to go green, purge the Cloudflare
cache, then hard refresh. Purging before the deploy finishes just re-caches
the old page.

## CI

`.github/workflows/astro-ci.yml` runs on pull requests and on pushes to
`rebuild/astro`. Jobs: `build`, `gitleaks`, `linkcheck`. These three are
the required status checks on `main`.

`linkcheck` runs lychee over `site/dist`. Its `--exclude` flags are
load-bearing and documented in the workflow: our own domain (canonical
tags point at routes that only exist once deployed), `linkedin.com`
(blocks automated clients, returning 403/429 from GitHub runners), and
`open.spotify.com`, `de.bentley.com`, `ice.org.uk` and `emerald.com`
(same anti-bot behaviour against GitHub runners). The okarthur.com
exclusion was dropped once, in PR #39, on the mistaken belief the live
site made it obsolete. It broke the next PR that added a page and was
restored the same day in `90bf879`. Do not drop it again.

gitleaks runs in CI only. There is no longer a pre-commit hook.

## Facts that are easy to get wrong

The public contact address is steven@okarthur.com. `hello@okarthur.com` is
wrong wherever it appears.

`site/public/.well-known/security.txt` is the real one.

See `CARRYOVER.md` for copy that was drafted rather than written, and for
the open issues that go with it.
