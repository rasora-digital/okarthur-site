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

2. **Legacy `.html` URLs.** The redirect rules are Cloudflare single
   redirects, not anything in this repository. Measured on 30 September 2026
   with `curl -sI`:

   | URL | Now |
   | --- | --- |
   | `/about.html` | 301 to `/about/`. Correct. |
   | `/notes/foundations-first.html` | 301 to `/notes/`. Correct. The 301 into a 404 found on 12 July was fixed on 13 July. |
   | `/notes/foundations-first/` | 301 to `/notes/`. Correct. |
   | `/privacy.html`, `/terms.html` | 404, left that way on purpose. Nobody deep-links a privacy policy. |

   One gap remains. With a query string appended, `/about.html?v=1` and
   `/notes/foundations-first.html?v=1` return 404, because the rules match
   the full URL rather than the path. Old indexed links carry no query string,
   so this bites only tagged links. The fix is in Cloudflare, Rules, Redirect
   Rules: change each rule's field from URI Full to URI Path.

3. ~~**`/capabilities/` is retired.**~~ Done. The page was deleted once
   `/review/` replaced it, and a Cloudflare redirect rule now sends both
   `/capabilities` and `/capabilities/` to `/review/` with a 301. Verified
   against the live site.

## Deliberately excluded from the site

The CV's personal email, mobile number, employer name, revenue figures and
headcount figures were **not** published. The public contact address is
`steven@okarthur.com`. Do not reintroduce the others.
