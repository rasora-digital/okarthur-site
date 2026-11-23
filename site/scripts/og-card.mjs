/**
 * Generates the default Open Graph share card.
 *
 *     node scripts/og-card.mjs
 *
 * From v6 the card follows the site's deck style. It is white, with a blue
 * kicker, the practice line in bold, and the portfolio drawing that heads the
 * home page, read from public/drawings/portfolio.svg so the two never drift.
 *
 * Two things about the fonts are not obvious.
 *
 * The site sets everything in Arial, through the OkArthur Sans family, but
 * Arial cannot be committed to the repository. The card is set in Arimo,
 * which the site already serves as Arial's stand-in and which shares Arial's
 * metrics, so the card matches the page.
 *
 * resvg cannot read woff2, so the faces are decompressed to TrueType first,
 * then subset to the card's text. Earlier cards (v2 to v5) stay in public/,
 * because LinkedIn caches shares against the image URL.
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

const KICKER = 'Steven Yule, chartered civil engineer';

/** The practice line. Wrapped by hand: the renderer does not break lines. */
const HEADLINE = [
	'Digital, data and AI',
	'for owners delivering',
	'more than one',
	'development at once.',
];

const FOOTER = 'okarthur.com';

const OUT = join(site, 'public', 'og-default-v6.png');

/* --- Geometry ---------------------------------------------------------- */

const CARD = { w: 1200, h: 630 };
const MARGIN = 72;

/** The site's tokens. */
const COLOUR = {
	paper: '#ffffff',
	ink: '#1e2b33',
	blue: '#2e5e7e',
	muted: '#5b6770',
	rule: '#d5dade',
};

const KICKER_TYPE = { size: 24, baseline: 112 };
const HEADLINE_TYPE = { size: 50, leading: 60, firstBaseline: 196 };
const FOOTER_TYPE = { size: 22, baseline: 566 };

/** The drawing, right of the text, bottom-aligned with the footer. */
const DRAWING = { x: 612, w: 548, bottom: 590 };

/* --- Fonts ------------------------------------------------------------- */

async function loadFace(file, text) {
	const woff2 = await readFile(join(site, 'public', 'fonts', file));
	const ttf = Buffer.from(await decompress(woff2));
	return subsetFont(ttf, text, { targetFormat: 'truetype' });
}

const escape = (s) =>
	s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

/** The drawing's own SVG, nested at the card's scale. */
async function drawing() {
	const src = await readFile(join(site, 'public', 'drawings', 'portfolio.svg'), 'utf8');
	const viewBox = src.match(/viewBox="([^"]+)"/)[1];
	const [, , vw, vh] = viewBox.split(/\s+/).map(Number);
	const inner = src.replace(/^<svg[^>]*>/, '').replace(/<\/svg>\s*$/, '');
	const h = Math.round((DRAWING.w * vh) / vw);
	const y = DRAWING.bottom - h;
	return `<svg x="${DRAWING.x}" y="${y}" width="${DRAWING.w}" height="${h}" viewBox="${viewBox}">${inner}</svg>`;
}

async function svg() {
	const lines = HEADLINE.map((line, i) => {
		const y = HEADLINE_TYPE.firstBaseline + i * HEADLINE_TYPE.leading;
		return `	<text x="${MARGIN}" y="${y}" font-family="Arimo" font-weight="700" font-size="${HEADLINE_TYPE.size}" fill="${COLOUR.ink}">${escape(line)}</text>`;
	}).join('\n');

	return `<svg xmlns="http://www.w3.org/2000/svg" width="${CARD.w}" height="${CARD.h}" viewBox="0 0 ${CARD.w} ${CARD.h}">
	<rect width="${CARD.w}" height="${CARD.h}" fill="${COLOUR.paper}"/>
	${await drawing()}
	<text x="${MARGIN}" y="${KICKER_TYPE.baseline}" font-family="Arimo" font-weight="700" font-size="${KICKER_TYPE.size}" fill="${COLOUR.blue}">${escape(KICKER)}</text>
${lines}
	<rect x="${MARGIN}" y="${FOOTER_TYPE.baseline - 44}" width="${DRAWING.x - MARGIN - 40}" height="1" fill="${COLOUR.rule}"/>
	<text x="${MARGIN}" y="${FOOTER_TYPE.baseline}" font-family="Arimo" font-weight="400" font-size="${FOOTER_TYPE.size}" fill="${COLOUR.muted}">${FOOTER}</text>
</svg>`;
}

/* --- Render ------------------------------------------------------------ */

const scratch = await mkdtemp(join(tmpdir(), 'og-card-'));
try {
	const bold = await loadFace('arimo-latin-700-normal.woff2', KICKER + HEADLINE.join(''));
	const regular = await loadFace('arimo-latin-400-normal.woff2', FOOTER);

	const boldPath = join(scratch, 'arimo-700.ttf');
	const regularPath = join(scratch, 'arimo-400.ttf');
	await writeFile(boldPath, bold);
	await writeFile(regularPath, regular);

	const resvg = new Resvg(await svg(), {
		fitTo: { mode: 'width', value: CARD.w },
		font: {
			fontFiles: [boldPath, regularPath],
			loadSystemFonts: false,
			defaultFontFamily: 'Arimo',
		},
	});

	const png = resvg.render().asPng();
	await writeFile(OUT, png);

	console.log(`${OUT}  ${CARD.w}x${CARD.h}  ${png.length} bytes`);
} finally {
	await rm(scratch, { recursive: true, force: true });
}
