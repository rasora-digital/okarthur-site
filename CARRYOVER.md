# Carry-over: copy needs sign-off before or during Phase 7

The Astro site's placeholder copy was drafted from
`Steven Yule CV - June 26.docx` rather than written by Steven. It reads
plausibly and contains no invented facts, but **nobody has approved the
wording**. Treat everything below as draft until it is read and signed off.

## Drafted copy awaiting sign-off

| File | What was drafted |
| --- | --- |
| `site/src/pages/about.astro` | Page headline and two-paragraph biography |
| `site/src/pages/rss.xml.ts` | RSS feed description |
| `*.astro` | Meta descriptions (also used for `og:description`) |

The Capabilities page has since been retired, and the Home page rewritten
around the independent review. That copy was written rather than drafted,
so it is not awaiting sign-off.

## Known issues to fix

1. ~~**Positioning is not coherent across the site.**~~ Resolved. The legacy
   site's triad ("secure delivery, data platforms and practical AI") no longer
   appears anywhere in `site/`. Home, Contact, Notes and the new `/review/`
   page now share the independent-review framing.

2. **Old URLs die at cutover.** `/about.html`, `/privacy.html`, `/terms.html`
   and `/notes/foundations-first.html` become `/about/`, `/privacy/`, `/terms/`
   and `/notes/foundations-first/`. `foundations-first.html` is live and
   indexed today. A Cloudflare Bulk Redirect rule would preserve them.

3. **`/capabilities/` is retired.** The page was deleted once `/review/`
   replaced it. The URL was live and is linked from outside the site, so it
   needs a Cloudflare redirect to `/review/`, in place as soon as the
   retirement deploys.

## Deliberately excluded from the site

The CV's personal email, mobile number, employer name, revenue figures and
headcount figures were **not** published. The public contact address is
`steven@okarthur.com`. Do not reintroduce the others.
