import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const notes = defineCollection({
	loader: glob({ pattern: '**/*.md', base: './src/content/notes' }),
	schema: z.object({
		title: z.string(),
		description: z.string(),
		pubDate: z.date(),
		updatedDate: z.date().optional(),
		draft: z.boolean().default(false),
		/** Up to two other notes, by file name without .md, chosen by hand. */
		related: z.array(z.string()).max(2).optional(),
	}),
});

export const collections = { notes };
