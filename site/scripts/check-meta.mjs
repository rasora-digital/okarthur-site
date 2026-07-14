/**
 * Fails if any built page's meta description is missing or too long.
 *
 *     npm run build && npm run check:meta
 *
 * Bing truncates meta descriptions at roughly 155 characters, which is the
 * tighter of the two limits that matter to us; Google's is longer and varies.
 * A description that overruns is not an error anyone sees locally, so it went
 * unnoticed until three of five pages were over. Hence a check.
 *
 * This reads dist rather than src on purpose. The description reaches the page
 * by three different routes — a prop on index.astro and about.astro, a prop on
 * work/index.astro, and frontmatter on each note, threaded through
 * notes/[...slug].astro — and a source-level check would have to know all
 * three, and would miss a fourth added later. The built HTML is the only place
 * every route converges, and it is what a crawler actually reads.
 *
 * Entities are decoded before counting so that an apostrophe escaped as &#39;
 * counts as the one character a crawler sees, not six.
 */
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join, relative } from 'node:path';

const here = dirname(fileURLToPath(import.meta.url));
const DIST = join(here, '..', 'dist');

const LIMIT = 155;

function htmlFiles(dir) {
	const out = [];
	for (const entry of readdirSync(dir)) {
		const full = join(dir, entry);
		if (statSync(full).isDirectory()) out.push(...htmlFiles(full));
		else if (entry.endsWith('.html')) out.push(full);
	}
	return out;
}

const decode = (s) =>
	s
		.replace(/&quot;/g, '"')
		.replace(/&#39;/g, "'")
		.replace(/&apos;/g, "'")
		.replace(/&lt;/g, '<')
		.replace(/&gt;/g, '>')
		.replace(/&nbsp;/g, ' ')
		.replace(/&amp;/g, '&');

let files;
try {
	files = htmlFiles(DIST).sort();
} catch {
	console.error('No dist directory. Run `npm run build` first.');
	process.exit(1);
}

if (files.length === 0) {
	console.error('dist contains no .html files. Did the build succeed?');
	process.exit(1);
}

const pages = files.map((file) => {
	const html = readFileSync(file, 'utf8');
	const m = html.match(/<meta\s+name="description"\s+content="([^"]*)"\s*\/?>/i);
	return { path: relative(DIST, file), desc: m ? decode(m[1]) : null };
});

pages.sort((a, b) => (b.desc?.length ?? -1) - (a.desc?.length ?? -1));

for (const { path, desc } of pages) {
	if (desc === null) {
		console.log(`  missing  ---  ${path}`);
		continue;
	}
	const n = [...desc].length;
	console.log(`  ${n > LIMIT ? 'OVER' : '  ok'}  ${String(n).padStart(3)}  ${path}`);
}

const missing = pages.filter((p) => p.desc === null);
const over = pages.filter((p) => p.desc && [...p.desc].length > LIMIT);

for (const { path } of missing) {
	console.error(`\n${path} has no meta description.`);
}
for (const { path, desc } of over) {
	console.error(
		`\n${path} has a ${[...desc].length} character meta description, ` +
			`${LIMIT} is the limit:\n  ${desc}`
	);
}

if (missing.length || over.length) {
	console.error(
		`\nFailed: ${over.length} over ${LIMIT} characters, ${missing.length} missing.`
	);
	process.exit(1);
}

console.log(
	`\n${pages.length} pages checked, none over ${LIMIT} characters.`
);
