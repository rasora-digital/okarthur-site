import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import type { APIContext } from 'astro';
import { FEED_TITLE, FEED_DESCRIPTION } from '../lib/feed';

export async function GET(context: APIContext) {
	const notes = await getCollection('notes', ({ data }) => !data.draft);

	return rss({
		title: FEED_TITLE,
		description: FEED_DESCRIPTION,
		site: context.site!,
		items: notes
			.sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf())
			.map((note) => ({
				title: note.data.title,
				description: note.data.description,
				pubDate: note.data.pubDate,
				link: `/notes/${note.id}/`,
			})),
	});
}
