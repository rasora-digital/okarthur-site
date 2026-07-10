# Carry-over: copy needs sign-off before or during Phase 7

The Astro site's placeholder copy was drafted from
`Steven Yule CV - June 26.docx` rather than written by Steven. It reads
plausibly and contains no invented facts, but **nobody has approved the
wording**. Treat everything below as draft until it is read and signed off.

## Drafted copy awaiting sign-off

| File | What was drafted |
| --- | --- |
| `site/src/pages/index.astro` | Hero headline and positioning standfirst |
| `site/src/pages/about.astro` | Page headline and two-paragraph biography |
| `site/src/pages/capabilities/index.astro` | Lede and all three capability titles + descriptions |
| `site/src/pages/rss.xml.ts` | RSS feed description |
| 8 × `*.astro` | Meta descriptions (also used for `og:description`) |

## Known issues to fix

1. **Positioning is not coherent across the site.** The meta descriptions on
   Home, Notes and 404 still use the legacy site's triad ("secure delivery,
   data platforms and practical AI"). The Capabilities page and About page now
   use the CV's framing (capital delivery, digital twins, operating models).
   Pick one and make the whole site agree.

2. **Old URLs die at cutover.** `/about.html`, `/privacy.html`, `/terms.html`
   and `/notes/foundations-first.html` become `/about/`, `/privacy/`, `/terms/`
   and `/notes/foundations-first/`. `foundations-first.html` is live and
   indexed today. A Cloudflare Bulk Redirect rule would preserve them.

## Deliberately excluded from the site

The CV's personal email, mobile number, employer name, revenue figures and
headcount figures were **not** published. The public contact address is
`steven@okarthur.com`. Do not reintroduce the others.
