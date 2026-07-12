# Carry-over

The Astro site's original copy was drafted from
`Steven Yule CV - June 26.docx` rather than written by Steven, and was
carried here awaiting sign-off.

## Drafted copy: cleared

Nothing is outstanding. The drafted copy has since been replaced or
approved, page by page:

| File | Now |
| --- | --- |
| `site/src/pages/index.astro` | Rewritten around the independent review. |
| `site/src/pages/capabilities/index.astro` | Page retired; `/review/` replaced it. |
| `site/src/pages/contact.astro` | Rewritten to shape the enquiry. |
| `site/src/pages/about.astro` | Bio kept and approved; meta description and the review paragraph written. |
| `site/src/pages/rss.xml.ts` | Feed description aligned to the review line. |

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
