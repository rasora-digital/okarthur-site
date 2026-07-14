/**
 * Fails if a URL in the built llms.txt does not exist on the site.
 *
 *     npm run build && npm run check:llms
 *
 * llms.txt is a hand-written file of hand-written links, and nothing else in
 * the build refers to it. Rename a route and every other reference to it moves
 * with the rename or breaks the build; llms.txt just goes quietly stale, and
 * the first thing to notice is a model citing a URL that 404s.
 *
 * lychee does not cover this. It is pointed at the HTML in dist, and our own
 * domain is excluded from it anyway, because canonical tags point at routes
 * that do not exist on the live site until after the merge that adds them.
 * The sitemap is the honest local answer to "what routes exist", since Astro
 * generates it from the pages it actually built.
 *
 * Only the Pages section is checked. Prose elsewhere in the file may name a
 * URL without linking it, and the contact address is not a route.
 *
 * The reverse is deliberately not asserted. Plenty of routes belong in the
 * sitemap and not in llms.txt: the individual notes, privacy, terms. They are
 * listed as information at the end, not as failures.
 */
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const here = dirname(fileURLToPath(import.meta.url));
const DIST = join(here, '..', 'dist');

let llms, sitemap;
try {
	llms = readFileSync(join(DIST, 'llms.txt'), 'utf8');
	sitemap = readFileSync(join(DIST, 'sitemap-0.xml'), 'utf8');
} catch {
	console.error('Missing dist/llms.txt or dist/sitemap-0.xml. Run `npm run build` first.');
	process.exit(1);
}

const pages = llms.split(/^## /m).find((s) => s.startsWith('Pages'));
if (!pages) {
	console.error('No "## Pages" section in dist/llms.txt.');
	process.exit(1);
}

const linked = [...pages.matchAll(/\]\((https?:\/\/[^)]+)\)/g)].map((m) => m[1]);
const routes = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);

if (linked.length === 0) {
	console.error('The Pages section of dist/llms.txt links to nothing. Expected links.');
	process.exit(1);
}

for (const url of linked) {
	console.log(`  ${routes.includes(url) ? '  ok' : 'GONE'}  ${url}`);
}

const gone = linked.filter((u) => !routes.includes(u));

const unlinked = routes.filter((u) => !linked.includes(u));
if (unlinked.length) {
	console.log(`\n  Not linked from llms.txt, which is allowed:`);
	for (const u of unlinked) console.log(`    ${u}`);
}

if (gone.length) {
	console.error(
		`\nFailed: ${gone.length} URL(s) in llms.txt are not routes on this site:`
	);
	for (const u of gone) console.error(`  ${u}`);
	console.error('\nEither the route was renamed, or the link is a typo.');
	process.exit(1);
}

console.log(
	`\n${linked.length} of ${linked.length} URLs in llms.txt exist in the sitemap.`
);
