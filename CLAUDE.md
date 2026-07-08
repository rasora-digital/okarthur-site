# okarthur-site

Static marketing site for OkArthur, a data and AI advisory in the GCC.
Live at https://okarthur.com

## What this is

Plain static HTML and CSS, partially migrated to Jekyll (_config.yml,
_layouts/main.html, kramdown, no theme). No JavaScript framework.

There is no Python application code in this repo, despite the presence of
black, flake8, isort and requirements files. requirements.txt is empty.
Do not add Python application code here.

## Pages

index.html, about.html, contact.html, privacy.html, terms.html, 404.html
notes/ contains a blog-style Notes section.

## Deployment

GitHub Pages builds from main. CNAME points to okarthur.com.
Cloudflare Free sits in front, DNS on Cloudflare.

Deploy sequence. Merge to main, wait for the Pages build to finish,
purge the Cloudflare cache, then hard refresh. Purging before the build
completes just re-caches the old page.

If you add a page, update sitemap.xml.

## Commands

make run       serves on port 8013 via python -m http.server
make stop
make check     runs fmt, lint and test
The Makefile uses hard tabs, not .RECIPEPREFIX. Do not change this
casually.

## CI

.github/workflows/ci.yml runs pre-commit on all files, then asserts that
index.html and CNAME exist. It does not run pytest.

pre-commit runs black, isort, flake8 and gitleaks.

## Facts that are easy to get wrong

The public contact address is steven@okarthur.com.
hello@okarthur.com is wrong wherever it appears and should be corrected.

.well-known/security.txt is the real one. The security.txt at the repo
root is an empty stray file and should be deleted.
