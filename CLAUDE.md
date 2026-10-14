# okarthur-site

Static site for OkArthur, the practice of Steven Yule, chartered civil engineer.
Independent advice on digital and AI in infrastructure and capital
programmes, in the GCC and the UK. Live at https://okarthur.com

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
    npm run check:llms  asserts every URL in llms.txt is a real route, also
                        reads site/dist, so run it after a build
    npm run check:text  asserts no curly quotes or em dashes reach the build
                        output, same again
    npm run check:voice  asserts the page copy has no fragments of four
                        words or fewer, at most one "rather than" and one
                        ", but" per page, no sentence over three commas
                        and none of the banned phrases, same again

The Open Graph card is generated, not hand-edited, and is not part of
`npm run build`. Regenerate it only when the card design changes:

    node scripts/og-card.mjs    writes site/public/og-default-v5.png

That script is the only reason `site/package.json` carries
devDependencies. `@resvg/resvg-js`, `subset-font` and `wawoff2` are pinned
to exact versions and are used by the card generator alone. Nothing in the
site's runtime imports them, and `npm run build` does not need them, so do
not "tidy them away" as unused.

## Layout

    site/src/pages/            routes (index, about, work, review, media,
                               contact, privacy, terms, notes, elsewhere,
                               rss.xml, 404)
    site/src/content/notes/    notes collection, markdown, schema in
                               site/src/content.config.ts
    site/src/lib/schema.ts     shared JSON-LD Person/WebSite definitions
    site/scripts/og-card.mjs   generates the Open Graph card, run by hand
    site/scripts/check-meta.mjs  title and meta description check, run in CI
    site/scripts/check-llms.mjs  llms.txt link check, run in CI
    site/scripts/check-text.mjs  curly quote and em dash check, run in CI
    site/scripts/check-voice.mjs  page copy register check, run in CI
    site/src/lib/feed.ts       feed title, description and path, imported by
                               rss.xml.ts and by the head in Base.astro
    site/src/lib/elsewhere.ts  writing and talks published by others, read
                               by the elsewhere page in full and by the Notes
                               index for its five most recent
    site/src/lib/site.ts       contact email, LinkedIn URL, the Calendly
                               booking URL and the default revision date,
                               each set once and used by the layout
    site/src/styles/global.css the whole design, "Datum", the site's only
                               stylesheet
    site/public/               copied verbatim into dist

`notes` is two files: `notes/index.astro` for the list and
`notes/[...slug].astro` for each note. `work`, `review`, `media` and
`elsewhere` are each an `index.astro` inside their own directory.

A note can name up to two others in a `related` frontmatter list, by file
name without `.md`, and they are shown above the bridge to the review. A name
that matches no published note fails the build, so renaming or drafting a
note means updating any note that points at it.

Published elsewhere entries are added to `site/src/lib/elsewhere.ts` once,
after checking the title, the byline and the date against the published page.
The date is as precise as the publisher gives it.

`site/public/` holds `CNAME`, `humans.txt`, `robots.txt`, `llms.txt`,
fonts, favicons, and `.well-known/security.txt`. Astro copies dotfiles and
dot-directories, so `.well-known/` survives the build.

## Design

`global.css` is Datum version 2, from October 2026. One family, Charis SIL,
sets everything a reader reads, and IBM Plex Mono sets dates, references and
labels. Both are self-hosted Latin subsets in `site/public/fonts`, and
Charis SIL's licence sits beside it as `charis-sil-OFL.txt`. Charis ships in
400 and 700 only, so a weight of 500 or 600 on serif text falls back to one
of those, and nothing should ask for one. The red-pen colour, `--pen`, is
used at most once a page, through the `pen-mark` class or in a figure. Links
stay drawing blue. The masthead carries an email action and a "Book 30
minutes" link to Calendly, and the footer is a drawing title block whose
Revised date comes from `SITE_REVISED` in `site.ts` unless a page passes
`revised`. There is no fade-in on scroll and no client script. The reveal
was removed because it hid content from link previews and background tabs.
The Datum design system in Claude Design was extracted from this stylesheet,
so when the stylesheet changes, Datum is re-extracted from it, not the other
way round.

The portrait crops `steven-yule-portrait-360` and `-720`, in WebP and JPEG,
were cut once from `steven-yule.jpg` with sharp and are committed. The press
photo itself stays at full size for editors.

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
`main`, wait for the deploy workflow to go green, then check the changed page
with a unique query string such as `?v=20260930a`. No Cloudflare purge is
needed. Cloudflare does not cache this site's HTML (every response is
`cf-cache-status: DYNAMIC`), and the GitHub Pages cache behind it sends
`max-age=600`, so a deploy is live within ten minutes. A page still stale
after that needs a fresh deployment, not a purge.

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

`build` also runs `npm run check:llms`, which fails the job if a URL in the
Pages section of `llms.txt` is not a route in the built sitemap. `linkcheck`
does not cover this: lychee reads the HTML in `dist`, and okarthur.com is
excluded from it in any case. Nothing else in the build links these URLs, so
without the check a renamed route leaves `llms.txt` pointing at a 404 and
nothing says so. The reverse is not asserted, because plenty of routes
belong in the sitemap and not in `llms.txt`: the individual notes, privacy,
terms.

`build` also runs `npm run check:text`, which fails the job if a curly quote
or an em dash reaches `site/dist`. Astro runs SmartyPants over markdown by
default, which rewrites the straight apostrophes in the note sources into
curly ones between `src` and `dist`. The sources were always clean, so a grep
of `src/` finds nothing and the characters appear only in the build.
`astro.config.mjs` sets `markdown.smartypants` to `false`; the check is what
stops a dependency bump quietly restoring the default. If a piece of copy
ever genuinely needs an em dash, change the check deliberately rather than
working around it.

`build` also runs `npm run check:voice`. The page copy was rewritten in
October 2026 in the register of the notes Steven wrote himself, full sentences
and few contrasts, because the earlier copy read as a brochure. The check
counts sentences of four words or fewer in each paragraph inside `<main>`, and
uses of "rather than" across the page, and fails above the limits set at the
top of the script. Since the language pass of 15 October it also fails on more
than one ", but" a page, on any sentence with more than three commas, and on
any phrase in its BANNED list, which holds the habits Steven has asked never
to see, such as "reading across", "sits" and "the seat". Add to that list
when a new habit appears. Paragraphs with the `meta` class are skipped, because
post-nominals and dates are meant to be terse, and so are individual notes,
whose voice is settled in Steven's writing project. If a limit is ever wrong,
change it in the script deliberately rather than padding a sentence to pass.

`linkcheck` runs lychee over `site/dist`. Its `--exclude` flags are
load-bearing and documented in the workflow: our own domain (canonical
tags point at routes that only exist once deployed), `linkedin.com`
(blocks automated clients, returning 403/429 from GitHub runners), and
`open.spotify.com`, `de.bentley.com`, `ice.org.uk` and `emerald.com`
(same anti-bot behaviour against GitHub runners). The okarthur.com
exclusion was dropped once, in PR #39, on the mistaken belief the live
site made it obsolete. It broke the next PR that added a page and was
restored the same day in `90bf879`. Do not drop it again.

gitleaks runs in CI only. There is no longer a pre-commit hook. The job
downloads the gitleaks scanner at a pinned version, checks it against a pinned
SHA-256, and scans git history. It does not use gitleaks/gitleaks-action,
which needs a licence key held as a secret that Dependabot's pull requests
cannot read. Bump the version and checksum together.

## Facts that are easy to get wrong

The public contact address is steven@okarthur.com. `hello@okarthur.com` is
wrong wherever it appears.

`site/public/.well-known/security.txt` is the real one.

`site/public/og-default-v2.png`, `og-default-v3.png` and `og-default-v4.png`
must not be deleted, even though nothing in `site/src` references them any
more. The live card is `og-default-v5.png`, so the older three look like dead
assets and read as safe to remove. They are not. LinkedIn caches share renders
against the absolute image URL, and posts already in circulation still point
at them. Deleting any of them breaks the card on every one of those posts. The
same goes for any future v6: retire the reference, keep the file.

See `CARRYOVER.md` for copy that was drafted rather than written, and for
the open issues that go with it.
