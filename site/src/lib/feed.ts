/** The feed's identity, in one place.
 *
 * The title is written once and imported by both the feed itself and the
 * discovery link in the head. A reader shows the title attribute of that link
 * before it has fetched anything, so if the two ever disagreed, the feed would
 * appear to change its name the moment it was subscribed to.
 */
export const FEED_TITLE = 'OkArthur, notes';

export const FEED_DESCRIPTION =
	'Notes from Steven Yule on digital and AI in infrastructure and capital programmes.';

/** Where rss.xml.ts builds to, and so what the discovery link points at. */
export const FEED_PATH = '/rss.xml';
