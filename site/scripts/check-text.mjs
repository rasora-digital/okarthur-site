/**
 * Fails if the build output contains a curly quote or an em dash.
 *
 *     npm run build && npm run check:text
 *
 * Astro runs SmartyPants over markdown by default, which rewrites the straight
 * apostrophes in the note sources into curly ones somewhere between src and
 * dist. That is why this reads dist and not src: the sources were always clean,
 * a grep of src/ found nothing, and the curly characters existed only in the
 * built HTML. astro.config.mjs now sets smartypants: false, and this check is
 * what stops it coming back — a dependency bump that restored the default would
 * otherwise reintroduce it silently, and nothing on the page would look wrong.
 *
 * The em dash is included because the same transform produces it, from a double
 * hyphen, and because the house style does not use it. If a piece of copy ever
 * genuinely needs one, this is the check to change, deliberately.
 */
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join, relative } from 'node:path';

const here = dirname(fileURLToPath(import.meta.url));
const DIST = join(here, '..', 'dist');

const FORBIDDEN = [
	['U+2018', 'left single curly quote', '‘'],
	['U+2019', 'right single curly quote', '’'],
	['U+201C', 'left double curly quote', '“'],
	['U+201D', 'right double curly quote', '”'],
	['U+2014', 'em dash', '—'],
];

/* Anything a reader or a crawler reads as text. Fonts and images are binary and
   would only produce noise. */
const TEXT = /\.(html|xml|txt|json|css|js|mjs|svg)$/i;

function files(dir) {
	const out = [];
	for (const entry of readdirSync(dir)) {
		const full = join(dir, entry);
		if (statSync(full).isDirectory()) out.push(...files(full));
		else out.push(full);
	}
	return out;
}

let all;
try {
	all = files(DIST);
} catch {
	console.error('No dist directory. Run `npm run build` first.');
	process.exit(1);
}

const scanned = all.filter((f) => TEXT.test(f)).sort();
if (scanned.length === 0) {
	console.error('dist contains no text files. Did the build succeed?');
	process.exit(1);
}

const hits = [];
for (const file of scanned) {
	const lines = readFileSync(file, 'utf8').split('\n');
	lines.forEach((line, i) => {
		for (const [code, name, ch] of FORBIDDEN) {
			let col = line.indexOf(ch);
			while (col !== -1) {
				hits.push({
					path: relative(DIST, file),
					line: i + 1,
					col: col + 1,
					code,
					name,
					/* Enough of the line to recognise, not the whole of a minified one. */
					context: line.slice(Math.max(0, col - 40), col + 40).trim(),
				});
				col = line.indexOf(ch, col + 1);
			}
		}
	});
}

for (const [code, name, ch] of FORBIDDEN) {
	const n = hits.filter((h) => h.code === code).length;
	console.log(`  ${code}  ${name.padEnd(26)}  ${n} match(es)`);
}

if (hits.length) {
	console.error(`\nFailed: ${hits.length} forbidden character(s) in the build output.\n`);
	for (const h of hits) {
		console.error(`  ${h.path}:${h.line}:${h.col}  ${h.code} ${h.name}`);
		console.error(`    ${h.context}`);
	}
	console.error(
		'\nIf these came from markdown, check that astro.config.mjs still sets\n' +
			'markdown.smartypants to false. Astro turns it on by default.'
	);
	process.exit(1);
}

console.log(`\n${scanned.length} text files checked, none contain a curly quote or an em dash.`);
