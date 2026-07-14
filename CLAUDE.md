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

Every npm command runs inside `site/`, never at the repository root. There
is no root `package.json`, so `npm install` or `npm run build` at the root
will not fail loudly; it will just do the wrong thing.

    npm install
    npm run dev       local dev server
    npm run build     writes site/dist
    npm run preview   serve the built site
    npm run check:meta  asserts titles fit Bing's 70 characters and meta
                        descriptions its 155, reads site/dist, so run it
                        after a build

The Open Graph card is generated, not hand-edited, and is not part of
`npm run build`. Regenerate it only when the card design changes:

    node scripts/og-card.mjs    writes site/public/og-default-v3.png

That script is the only reason `site/package.json` carries
devDependencies. `@resvg/resvg-js`, `subset-font` and `wawoff2` are pinned
to exact versions and are used by the card generator alone. Nothing in the
site's runtime imports them, and `npm run build` does not need them, so do
not "tidy them away" as unused.

## Layout

    site/src/pages/            routes (index, about, work, review, media,
                               contact, privacy, terms, notes, rss.xml,
                               404)
    site/src/content/notes/    notes collection, markdown, schema in
                               site/src/content.config.ts
    site/src/lib/schema.ts     shared JSON-LD Person/WebSite definitions
    site/scripts/og-card.mjs   generates the Open Graph card, run by hand
    site/scripts/check-meta.mjs  meta description length check, run in CI
    site/public/               copied verbatim into dist

`notes` is two files: `notes/index.astro` for the list and
`notes/[...slug].astro` for each note. `work`, `review` and `media` are
each an `index.astro` inside their own directory.

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
`main`. Jobs: `build`, `gitleaks`, `linkcheck`. These three are the
required status checks on `main`.

`build` also runs `npm run check:meta` after the build, which fails the job
if a page's title or meta description is missing or overruns Bing's limits,
70 characters and 155. It also asserts that `og:title` agrees with `<title>`
on every page, that `og:site_name` reads OkArthur, and that the brand suffix
is present everywhere except the home page. It is a step of `build` rather
than a job of its own so that it can read the dist that build just produced,
and so that the required checks stay at three. Adding a fourth job would mean
editing branch protection, and the check would have to build the site a
second time to have anything to read.

`Seo.astro` appends `" | OkArthur"` to every title. A page that passes
`titleIsComplete` skips the suffix and supplies its whole title instead. The
home page is the only page that does, because with the suffix its title ran
to 78 characters. The prop governs `<title>` and `og:title` together, and
that is deliberate: a page is called one thing, not two. Nothing is lost from
a share unfurl, because `og:site_name` still carries the brand.

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

`site/public/og-default-v2.png` must not be deleted, even though nothing in
`site/src` references it any more. The live card is `og-default-v3.png`, so
v2 looks like a dead asset and reads as safe to remove. It is not. LinkedIn
caches share renders against the absolute image URL, and posts already in
circulation still point at v2. Deleting it breaks the card on every one of
them. The same goes for any future v4: retire the reference, keep the file.

See `CARRYOVER.md` for copy that was drafted rather than written, and for
the open issues that go with it.
