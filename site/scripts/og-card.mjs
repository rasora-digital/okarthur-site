/**
 * Generates the default Open Graph share card.
 *
 *     node scripts/og-card.mjs
 *
 * The v2 card was a committed PNG with no script behind it. This reproduces
 * its layout from repository assets alone, so the card can be regenerated
 * rather than hand-edited. Geometry below was measured off og-default-v2.png
 * pixel by pixel; the type scale is v2's, only the wrap and the headline text
 * differ.
 *
 * Two things about the fonts are not obvious.
 *
 * resvg cannot read woff2, so the site's woff2 faces are decompressed to
 * TrueType first. And resvg does not interpolate variable-font axes: it
 * renders the default instance. Public Sans Variable defaults to Thin (100),
 * which would set the footer as a hairline, so the weight axis is pinned with
 * harfbuzz before the font ever reaches the renderer. Source Serif 4 already
 * defaults to Regular, but is pinned the same way to keep the two paths alike.
 */
import { readFile, writeFile, mkdtemp, rm } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { tmpdir } from 'node:os';
import { decompress } from 'wawoff2';
import subsetFont from 'subset-font';
import { Resvg } from '@resvg/resvg-js';

const here = dirname(fileURLToPath(import.meta.url));
const site = join(here, '..');

/* --- Content ---------------------------------------------------------- */

/** The practice line. Wrapped by hand: the renderer does not break lines. */
const HEADLINE = [
	'Independent advice on',
	'digital and AI in infrastructure',
	'and capital programmes.',
];

const WORDMARK = 'OA';
const FOOTER = 'okarthur.com';

const OUT = join(site, 'public', 'og-default-v3.png');

/* --- Geometry, measured from og-default-v2.png ------------------------- */

const CARD = { w: 1200, h: 630 };

/** Left margin, and the right edge the rule stops at: 88px each side. */
const MARGIN = 88;

const COLOUR = {
	field: '#1f4e6b', // --accent, carrying the card
	ink: '#eeeeea', // --paper, reversed out of it
	rule: '#517489', // the hairline: accent lifted toward paper
	footer: '#a8b8bf', // muted, but muted against the accent field
};

const WORDMARK_TYPE = { size: 49, baseline: 112, tracking: -1 };

/** One hairline, from just right of the wordmark to the right margin. */
const RULE = { y: 98, x1: 176, x2: CARD.w - MARGIN + 1 };

/** v2's scale exactly: 71px on an 84px line, --tracking-hero at -0.03em. */
const HEADLINE_TYPE = {
	size: 71,
	leading: 84,
	tracking: -0.03 * 71,
	firstBaseline: 289,
};

const FOOTER_TYPE = { size: 21, baseline: 567, tracking: 1 };

/* --- Fonts ------------------------------------------------------------- */

/** woff2 -> TrueType, with the weight axis pinned to a fixed instance. */
async function loadFace(file, text, weight) {
	const woff2 = await readFile(join(site, 'public', 'fonts', file));
	const ttf = Buffer.from(await decompress(woff2));
	return subsetFont(ttf, text, {
		targetFormat: 'truetype',
		variationAxes: { wght: weight },
	});
}

const escape = (s) =>
	s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

function svg() {
	const lines = HEADLINE.map((line, i) => {
		const y = HEADLINE_TYPE.firstBaseline + i * HEADLINE_TYPE.leading;
		return `		<text x="${MARGIN}" y="${y}" font-family="Source Serif 4" font-size="${HEADLINE_TYPE.size}" letter-spacing="${HEADLINE_TYPE.tracking}" fill="${COLOUR.ink}">${escape(line)}</text>`;
	}).join('\n');

	return `<svg xmlns="http://www.w3.org/2000/svg" width="${CARD.w}" height="${CARD.h}" viewBox="0 0 ${CARD.w} ${CARD.h}">
	<rect width="${CARD.w}" height="${CARD.h}" fill="${COLOUR.field}"/>
	<text x="${MARGIN}" y="${WORDMARK_TYPE.baseline}" font-family="Source Serif 4" font-size="${WORDMARK_TYPE.size}" letter-spacing="${WORDMARK_TYPE.tracking}" fill="${COLOUR.ink}">${WORDMARK}</text>
	<rect x="${RULE.x1}" y="${RULE.y}" width="${RULE.x2 - RULE.x1}" height="1" fill="${COLOUR.rule}"/>
${lines}
	<text x="${MARGIN}" y="${FOOTER_TYPE.baseline}" font-family="Public Sans" font-size="${FOOTER_TYPE.size}" letter-spacing="${FOOTER_TYPE.tracking}" fill="${COLOUR.footer}">${FOOTER}</text>
</svg>`;
}

/* --- Render ------------------------------------------------------------ */

const scratch = await mkdtemp(join(tmpdir(), 'og-card-'));
try {
	const serifText = WORDMARK + HEADLINE.join('');
	const serif = await loadFace(
		'source-serif-4-variable-roman.woff2',
		serifText,
		400
	);
	const sans = await loadFace('public-sans-variable-roman.woff2', FOOTER, 400);

	const serifPath = join(scratch, 'source-serif-4.ttf');
	const sansPath = join(scratch, 'public-sans.ttf');
	await writeFile(serifPath, serif);
	await writeFile(sansPath, sans);

	const resvg = new Resvg(svg(), {
		fitTo: { mode: 'width', value: CARD.w },
		font: {
			fontFiles: [serifPath, sansPath],
			loadSystemFonts: false,
			defaultFontFamily: 'Source Serif 4',
		},
	});

	const png = resvg.render().asPng();
	await writeFile(OUT, png);

	console.log(`${OUT}  ${CARD.w}x${CARD.h}  ${png.length} bytes`);
} finally {
	await rm(scratch, { recursive: true, force: true });
}
