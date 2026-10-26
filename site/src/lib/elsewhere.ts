/**
 * Writing, talks and interviews published by other organisations. One list,
 * read by the Published elsewhere page in full and by the Notes index for its
 * most recent few, so an entry is added here once and appears in both.
 *
 * `date` is as precise as the publisher states it: a day where the page
 * carries one, otherwise a month or a year. It sorts as a string, newest
 * first, and an entry with no date sorts last. Check a title, a byline and a
 * date against the published page before adding an entry.
 */

export interface ElsewhereEntry {
	title: string;
	url: string;
	/** Publisher and form, as shown under the title. */
	source: string;
	/** YYYY-MM-DD, YYYY-MM or YYYY. Omit when the publisher gives none. */
	date?: string;
}

const entries: ElsewhereEntry[] = [
	{
		title: 'Planted broken link to prove the linkcheck report, reverted before merge',
		url: 'https://okarthur-linkcheck-proof-zz9.com/missing',
		source: 'Test',
		date: '2026-10-26',
	},
	{
		title: 'From pilot to enterprise: Scaling AI across construction organizations',
		url: 'https://www.big5global.com/agenda/',
		source: 'Big 5 Global, panel moderator',
		date: '2026-11',
	},
	{
		title: 'The long-term consequences of a really good idea',
		url: 'https://www.ice.org.uk/news-views-insights/inside-infrastructure/the-long-term-consequences-of-a-really-good-idea',
		source: 'Institution of Civil Engineers, Inside Infrastructure',
		date: '2026-10',
	},
	{
		title: 'When every consultancy looks the same, where does innovation go?',
		url: 'https://www.ice.org.uk/news-views-insights/inside-infrastructure/innovations-role-when-consultancies-look-the-same',
		source: 'Institution of Civil Engineers, Inside Infrastructure',
		date: '2026-09',
	},
	{
		title: "Engineers, if it's not in the contract, it's unlikely to happen",
		url: 'https://www.ice.org.uk/news-views-insights/inside-infrastructure/if-its-not-in-the-contract-its-unlikely-to-happen',
		source: 'Institution of Civil Engineers, Inside Infrastructure',
		date: '2026-09',
	},
	{
		title: 'Digital delivery depends on engineering judgement',
		url: 'https://www.newcivilengineer.com/ice/spotlight-digital-delivery-depends-on-engineering-judgement-17-08-2026/',
		source: 'New Civil Engineer, Spotlight opinion',
		date: '2026-08-17',
	},
	{
		title: 'Meet the engineers: Steven Yule',
		url: 'https://www.ice.org.uk/what-is-civil-engineering/meet-the-engineers/steven-yule',
		source: 'Institution of Civil Engineers, profile',
		date: '2026-08-07',
	},
	{
		title: 'The limits of efficiency: not every slow step in engineering is waste',
		url: 'https://www.ice.org.uk/news-views-insights/inside-infrastructure/not-every-slow-step-in-engineering-is-waste',
		source: 'Institution of Civil Engineers, Inside Infrastructure',
		date: '2026-07',
	},
	{
		title:
			'From hype to impact: how the Middle East can turn artificial intelligence ambition into real-world value',
		url: 'https://www.jacobs.com/insights/thought-leadership/hype-impact-how-middle-east-can-turn-artificial-intelligence-ambition',
		source: 'Jacobs, interview',
		date: '2026-04-19',
	},
	{
		title: 'From infrastructure to experience: designing city-scale, digitally enabled entertainment',
		url: 'https://www.jacobs.com/newsroom/news/infrastructure-experience-designing-city-scale-digitally-enabled-entertainment',
		source: 'Jacobs, article',
		date: '2025-12-04',
	},
	{
		title: 'How AI is shaping the built environment in the Middle East',
		url: 'https://www.ice.org.uk/events/recorded-lectures/beyond-engineering-digital-transformation-middle-east',
		source: 'Institution of Civil Engineers, recorded lecture',
		date: '2025-05',
	},
	{
		title: 'How digital engineering is improving project delivery',
		url: 'https://open.spotify.com/episode/4ZU81nDTxpErpH06PYYfMB',
		source: 'The Engineers Collective, podcast',
		date: '2022-01',
	},
	{
		title: 'Informing the information requirements of a digital twin, a rail industry case study',
		url: 'https://www.emerald.com/jsmic/article-abstract/174/2/33/411939/Informing-the-information-requirements-of-a',
		source: 'Proceedings of the Institution of Civil Engineers, Smart Infrastructure and Construction',
		date: '2022',
	},
	{
		title: 'Civil engineering means going digital',
		url: 'https://de.bentley.com/wp-content/uploads/BSY-121421-TRU.pdf',
		source: 'Bentley Systems, case study',
	},
];

/** Newest first. Stable, so entries sharing a date keep their order above. */
export const elsewhere: ElsewhereEntry[] = entries
	.map((entry, i) => ({ entry, i }))
	.sort((a, b) => {
		const da = a.entry.date ?? '';
		const db = b.entry.date ?? '';
		/* Compare on the shared precision, so a month sorts with its days. */
		const n = Math.min(da.length, db.length) || Math.max(da.length, db.length);
		const cmp = db.slice(0, n).localeCompare(da.slice(0, n));
		return cmp !== 0 ? cmp : a.i - b.i;
	})
	.map(({ entry }) => entry);

const MONTHS = [
	'January',
	'February',
	'March',
	'April',
	'May',
	'June',
	'July',
	'August',
	'September',
	'October',
	'November',
	'December',
];

/** Month and year where known, the year alone otherwise. Days are not shown,
    because most publishers give none and a mixed list reads unevenly. */
export function elsewhereDate(date?: string): string {
	if (!date) return '';
	const [year, month] = date.split('-');
	return month ? `${MONTHS[Number(month) - 1]} ${year}` : year;
}
