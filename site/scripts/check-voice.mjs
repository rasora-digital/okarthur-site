/**
 * Fails if the page copy drifts back into brochure register.
 *
 *     npm run build && npm run check:voice
 *
 * The page copy was rewritten in October 2026 to match the register of the
 * notes Steven wrote himself, which run to full sentences of fifteen to twenty
 * words, use no fragments as punchlines and almost never pivot on a contrast.
 * The earlier copy had twelve fragments of four words or fewer and leaned on
 * "rather than" in about one sentence in fifteen. This check counts both, per
 * page, in the built HTML, and fails above the limits below.
 *
 * What it reads. The text of every <p> inside <main>, for fragments, and all
 * the visible text inside <main>, for "rather than". Paragraphs with the meta
 * class are skipped, because they carry post-nominals and dates, which are
 * meant to be terse. Individual notes are skipped too. They are drafted in
 * Steven's writing project under its own style guide, and their voice is his
 * to settle there, not a build check's.
 *
 * It reads dist rather than src for the same reason check:text does. The page
 * text is assembled from arrays and components, so the sentences a reader sees
 * exist whole only in the build output.
 *
 * An optional argument names a different directory to read, which is how the
 * check is proved to fail: copy dist, plant a fragment, point the check at it.
 */
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join, relative, resolve, sep } from 'node:path';

const here = dirname(fileURLToPath(import.meta.url));
const DIST = process.argv[2] ? resolve(process.argv[2]) : join(here, '..', 'dist');

/* A sentence this short or shorter, in a paragraph, counts as a fragment. */
const FRAGMENT_MAX_WORDS = 4;
/* Per page. */
const MAX_FRAGMENTS = 0;
const MAX_RATHER_THAN = 1;

function files(dir) {
	const out = [];
	for (const entry of readdirSync(dir)) {
		const full = join(dir, entry);
		if (statSync(full).isDirectory()) out.push(...files(full));
		else out.push(full);
	}
	return out;
}

const decode = (s) =>
	s
		.replace(/&nbsp;/g, ' ')
		.replace(/&amp;/g, '&')
		.replace(/&quot;/g, '"')
		.replace(/&#39;|&#x27;|&apos;/g, "'")
		.replace(/&lt;/g, '<')
		.replace(/&gt;/g, '>');

const text = (html) =>
	decode(html.replace(/<script[\s\S]*?<\/script>/gi, ' ').replace(/<[^>]+>/g, ' '))
		.replace(/\s+/g, ' ')
		.trim();

/* Split on a full stop, question mark or exclamation mark followed by a space
   and a capital, a digit or an opening quote. Good enough for this copy, which
   has no abbreviations mid-sentence. */
const sentences = (para) =>
	para
		.split(/(?<=[.?!])\s+(?=[A-Z0-9"'(])/)
		.map((s) => s.trim())
		.filter(Boolean);

const words = (sentence) => sentence.split(/\s+/).filter((w) => /[A-Za-z0-9]/.test(w));

let all;
try {
	all = files(DIST);
} catch {
	console.error(`No directory at ${DIST}. Run \`npm run build\` first.`);
	process.exit(1);
}

const isNote = (rel) => /^notes\/[^/]+\/index\.html$/.test(rel.split(sep).join('/'));

const pages = all
	.filter((f) => f.endsWith('.html'))
	.map((f) => ({ file: f, rel: relative(DIST, f) }))
	.filter(({ rel }) => !isNote(rel))
	.sort((a, b) => a.rel.localeCompare(b.rel));

if (pages.length === 0) {
	console.error('No HTML pages found. Did the build succeed?');
	process.exit(1);
}

const failures = [];

for (const { file, rel } of pages) {
	const html = readFileSync(file, 'utf8');
	const main = html.match(/<main\b[^>]*>([\s\S]*?)<\/main>/i);
	if (!main) {
		failures.push(`${rel}: no <main> element, so nothing could be checked`);
		continue;
	}
	const body = main[1];

	const fragments = [];
	for (const m of body.matchAll(/<p\b([^>]*)>([\s\S]*?)<\/p>/gi)) {
		const cls = (m[1].match(/class\s*=\s*"([^"]*)"/i) || [, ''])[1].split(/\s+/);
		if (cls.includes('meta')) continue;
		for (const s of sentences(text(m[2]))) {
			if (words(s).length <= FRAGMENT_MAX_WORDS) fragments.push(s);
		}
	}

	const ratherThan = (text(body).match(/\brather than\b/gi) || []).length;

	const ok = fragments.length <= MAX_FRAGMENTS && ratherThan <= MAX_RATHER_THAN;
	console.log(
		`  ${ok ? 'ok  ' : 'FAIL'}  ${rel.padEnd(28)}  fragments ${fragments.length}  rather than ${ratherThan}`
	);

	if (fragments.length > MAX_FRAGMENTS) {
		failures.push(
			`${rel}: ${fragments.length} fragment(s) of ${FRAGMENT_MAX_WORDS} words or fewer, limit ${MAX_FRAGMENTS}\n` +
				fragments.map((f) => `      "${f}"`).join('\n')
		);
	}
	if (ratherThan > MAX_RATHER_THAN) {
		failures.push(`${rel}: "rather than" ${ratherThan} times, limit ${MAX_RATHER_THAN}`);
	}
}

if (failures.length) {
	console.error(`\nFailed: the page copy has drifted from the house register.\n`);
	for (const f of failures) console.error(`  ${f}`);
	console.error(
		'\nJoin a fragment to the sentence it belongs to, or rewrite it as a full\n' +
			'sentence. Recast a second "rather than" as a plain statement.'
	);
	process.exit(1);
}

console.log(`\n${pages.length} pages checked, all within the voice limits.`);
