/** Stable identifier so Article.author and WebSite can point at the Person
 * rather than restating it. */
export const PERSON_ID = 'https://okarthur.com/#person';

export const person = {
	'@type': 'Person',
	'@id': PERSON_ID,
	name: 'Steven Yule',
	jobTitle: 'Digital, data and infrastructure transformation director',
	honorificSuffix: 'CEng FICE',
	url: 'https://okarthur.com',
	email: 'steven@okarthur.com',
	address: {
		'@type': 'PostalAddress',
		addressLocality: 'Dubai',
		addressCountry: 'AE',
	},
	sameAs: ['[PLACEHOLDER: LinkedIn URL]'],
};
