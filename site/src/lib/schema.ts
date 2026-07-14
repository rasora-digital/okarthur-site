/** Stable identifier so Article.author and WebSite can point at the Person
 * rather than restating it. */
export const PERSON_ID = 'https://okarthur.com/#person';

export const person = {
	'@type': 'Person',
	'@id': PERSON_ID,
	name: 'Steven Yule',
	jobTitle: 'Independent adviser on digital and AI in infrastructure',
	honorificSuffix: 'CEng FICE FCIHT MIAM',
	url: 'https://okarthur.com',
	image: 'https://okarthur.com/steven-yule.jpg',
	email: 'steven@okarthur.com',
	address: {
		'@type': 'PostalAddress',
		addressLocality: 'Dubai',
		addressCountry: 'AE',
	},
	sameAs: ['https://www.linkedin.com/in/stevenyule'],
	knowsAbout: [
		'Digital twins',
		'Asset information management',
		'Infrastructure data strategy',
		'Artificial intelligence in infrastructure',
		'Capital programme delivery',
		'Whole-life asset management',
	],
};
