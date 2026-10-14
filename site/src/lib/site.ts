/**
 * Facts the layout repeats on every page. Each is set here once, so changing
 * one is a one-line edit.
 */

export const CONTACT_EMAIL = 'steven@okarthur.com';

export const LINKEDIN_URL = 'https://www.linkedin.com/in/stevenyule';

/**
 * The 30-minute booking page on Calendly. A link out, not a form on the site,
 * so the decision of 14 July that contact is one named address still holds.
 * Calendly sees a visitor's name and email when they book, which is why the
 * privacy page names it. The slug is whatever Calendly holds, so if the event
 * is renamed there, change it here and nowhere else.
 */
export const BOOKING_URL =
	'https://calendly.com/stevenyule1/portfolio-integration-30-minutes-clone';

/**
 * The date shown as "Revised" in the footer title block of every page that
 * does not pass its own. Bump it when the site-wide design or copy changes.
 * Notes pass their own date, the updated date if there is one.
 */
export const SITE_REVISED = new Date('2026-10-15');
