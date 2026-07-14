/**
 * Fails if a built page's title or meta description is missing or malformed.
 *
 *     npm run build && npm run check:meta
 *
 * Bing truncates meta descriptions at roughly 155 characters and titles at
 * roughly 70, and those are the tighter of the two limits that matter to us;
 * Google's are longer and vary. Neither overrun is an error anyone sees
 * locally — the page looks fine, and only the search result is cut — so both
 * went unnoticed until three of five descriptions were over. Hence a check.
 *
 * This reads dist rather than src on purpose. Title and description reach a
 * page by several routes — props on the page, frontmatter on a note threaded
 * through notes/[...slug].astro, and the brand suffix that Seo.astro appends
 * on the way out — and a source-level check would have to know all of them,
 * and would still miss the suffix, which is where the home page overran. The
 * built HTML is the only place every route converges, and it is what a crawler
 * actually reads.
 *
 * The home page is the one page that sets titleIsComplete and so carries no
 * " | OkArthur" suffix, because with it the title ran to 78 characters. Every
 * other page must still carry the suffix, and og:title must agree with <title>
 * everywhere: a page is called one thing, not two. The brand still reaches a
 * share unfurl through og:site_name, which is asserted here too.
 *
 * Entities are decoded before counting, so an apostrophe escaped as &#39;
 * counts as the one character a crawler sees, not six.
 */
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join, relative } from 'node:path';

const here = dirname(fileURLToPath(import.meta.url));
const DIST = join(here, '..', 'dist');

const DESC_LIMIT = 155;
const TITLE_LIMIT = 70;
const BRAND_SUFFIX = ' | OkArthur';
const SITE_NAME = 'OkArthur';
const HOME = 'index.html';

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

const attr = (html, prop) => {
	const m = html.match(
		new RegExp(`<meta\\s+(?:name|property)="${prop}"\\s+content="([^"]*)"\\s*/?>`, 'i')
	);
	return m ? decode(m[1]) : null;
};

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
	const t = html.match(/<title>([\s\S]*?)<\/title>/i);
	return {
		path: relative(DIST, file),
		title: t ? decode(t[1].trim()) : null,
		ogTitle: attr(html, 'og:title'),
		siteName: attr(html, 'og:site_name'),
		desc: attr(html, 'description'),
	};
});

const len = (s) => (s === null ? -1 : [...s].length);
const isHome = (p) => p.path === HOME;

const failures = [];
const fail = (msg) => failures.push(msg);

// Titles, longest first.
console.log(`Titles, limit ${TITLE_LIMIT}\n`);
for (const p of [...pages].sort((a, b) => len(b.title) - len(a.title))) {
	if (p.title === null) {
		console.log(`  missing  ---  ${p.path}`);
		continue;
	}
	const n = len(p.title);
	console.log(`  ${n > TITLE_LIMIT ? 'OVER' : '  ok'}  ${String(n).padStart(3)}  ${p.path}`);
	console.log(`             ${p.title}`);
}

// Descriptions, longest first.
console.log(`\nDescriptions, limit ${DESC_LIMIT}\n`);
for (const p of [...pages].sort((a, b) => len(b.desc) - len(a.desc))) {
	if (p.desc === null) {
		console.log(`  missing  ---  ${p.path}`);
		continue;
	}
	const n = len(p.desc);
	console.log(`  ${n > DESC_LIMIT ? 'OVER' : '  ok'}  ${String(n).padStart(3)}  ${p.path}`);
	console.log(`             ${p.desc}`);
}

// Assertions.
const home = pages.find(isHome);
if (!home) fail(`No ${HOME} in dist. The home page is the one that skips the suffix.`);

for (const p of pages) {
	if (p.title === null) fail(`${p.path} has no <title>.`);
	else if (len(p.title) > TITLE_LIMIT)
		fail(`${p.path} title is ${len(p.title)} characters, ${TITLE_LIMIT} is the limit: ${p.title}`);

	if (p.desc === null) fail(`${p.path} has no meta description.`);
	else if (len(p.desc) > DESC_LIMIT)
		fail(`${p.path} description is ${len(p.desc)} characters, ${DESC_LIMIT} is the limit: ${p.desc}`);

	if (p.title !== null) {
		if (isHome(p)) {
			if (p.title.includes('|'))
				fail(`${p.path} title contains a pipe; the home page carries no brand suffix: ${p.title}`);
		} else if (!p.title.endsWith(BRAND_SUFFIX)) {
			fail(`${p.path} title does not end in "${BRAND_SUFFIX}": ${p.title}`);
		}
	}

	if (p.ogTitle === null) fail(`${p.path} has no og:title.`);
	else if (p.ogTitle !== p.title)
		fail(`${p.path} og:title differs from <title>:\n    <title>  ${p.title}\n    og:title ${p.ogTitle}`);

	if (p.siteName === null) fail(`${p.path} has no og:site_name.`);
	else if (p.siteName !== SITE_NAME)
		fail(`${p.path} og:site_name is "${p.siteName}", expected "${SITE_NAME}".`);
}

// One pass or fail line per assertion, in the order they were asked for.
const others = pages.filter((p) => !isHome(p));
const check = (label, ok) => console.log(`  ${ok ? 'PASS' : 'FAIL'}  ${label}`);

console.log('\nAssertions\n');
check(
	`no <title> exceeds ${TITLE_LIMIT} characters`,
	pages.every((p) => p.title !== null && len(p.title) <= TITLE_LIMIT)
);
check(
	`no description exceeds ${DESC_LIMIT} characters`,
	pages.every((p) => p.desc !== null && len(p.desc) <= DESC_LIMIT)
);
check(
	'the home page title contains no pipe',
	!!home && home.title !== null && !home.title.includes('|')
);
check(
	`every page but the home page has a title ending in "${BRAND_SUFFIX}"`,
	others.every((p) => p.title !== null && p.title.endsWith(BRAND_SUFFIX))
);
check(
	'every page but the home page has og:title identical to its <title>',
	others.every((p) => p.ogTitle !== null && p.ogTitle === p.title)
);
check(
	'the home page has og:title identical to its <title>',
	!!home && home.ogTitle !== null && home.ogTitle === home.title
);
check(
	`og:site_name is present and reads "${SITE_NAME}" on every page`,
	pages.every((p) => p.siteName === SITE_NAME)
);

if (failures.length) {
	console.error(`\nFailed: ${failures.length} problem(s).\n`);
	for (const f of failures) console.error(`  ${f}`);
	process.exit(1);
}

console.log(`\n${pages.length} pages checked, all assertions passed.`);
