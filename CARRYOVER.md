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

2. **Legacy `.html` URLs, partly covered.** A Cloudflare redirect exists, but
   it only ever covered two of the four, and one of those has since rotted.
   Measured against the live site on 12 July 2026:

   | URL | Now |
   | --- | --- |
   | `/about.html` | 301 to `/about/`, which is 200. Correct. |
   | `/notes/foundations-first.html` | 301 to `/notes/foundations-first/`, **which is a 404**. |
   | `/privacy.html` | 404, never redirected. |
   | `/terms.html` | 404, never redirected. |

   The `foundations-first` chain broke when that note was deliberately deleted
   in `d7d82b9` (11 July 2026), leaving a redirect pointing at a page that no
   longer exists. A 301 into a 404 is worse than a plain 404, because crawlers
   follow it and find nothing. **Repoint that rule at `/notes/`**, which is a
   reasonable home for anyone still arriving from an indexed link.

   `/privacy.html` and `/terms.html` are left to 404 on purpose. Nobody
   deep-links a privacy policy, and an honest 404 beats an invented target.

3. ~~**`/capabilities/` is retired.**~~ Done. The page was deleted once
   `/review/` replaced it, and a Cloudflare redirect rule now sends both
   `/capabilities` and `/capabilities/` to `/review/` with a 301. Verified
   against the live site.

## Deliberately excluded from the site

The CV's personal email, mobile number, employer name, revenue figures and
headcount figures were **not** published. The public contact address is
`steven@okarthur.com`. Do not reintroduce the others.
