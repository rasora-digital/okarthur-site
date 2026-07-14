/** Stable identifier so Article.author and WebSite can point at the Person
 * rather than restating it. */
export const PERSON_ID = 'https://okarthur.com/#person';

export const person = {
	'@type': 'Person',
	'@id': PERSON_ID,
	name: 'Steven Yule',
	jobTitle: 'Chartered civil engineer',
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
	memberOf: [
		{
			'@type': 'Organization',
			name: 'Institution of Civil Engineers',
			url: 'https://www.ice.org.uk',
		},
		{
			'@type': 'Organization',
			name: 'Chartered Institution of Highways and Transportation',
			url: 'https://www.ciht.org.uk',
		},
		{
			'@type': 'Organization',
			name: 'Institute of Asset Management',
			url: 'https://theiam.org',
		},
		{
			'@type': 'Organization',
			name: 'Worshipful Company of Engineers',
			url: 'https://www.engineerscompany.org.uk',
		},
	],
	knowsAbout: [
		'Digital twins',
		'Asset information management',
		'Infrastructure data strategy',
		'Artificial intelligence in infrastructure',
		'Capital programme delivery',
		'Whole-life asset management',
		'Digital and AI investment appraisal',
		'Technology procurement for infrastructure owners',
		'Independent technical review',
		'Digital twin assurance',
	],
};
