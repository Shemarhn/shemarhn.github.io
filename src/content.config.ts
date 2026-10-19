import { defineCollection } from 'astro:content';
import { z } from 'astro/zod';
import { glob } from 'astro/loaders';
const insights = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/insights' }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    updated: z.coerce.date().optional(),
    author: z.literal('Shemar Marks'),
    category: z.string(),
    tags: z.array(z.string()),
    excerpt: z.string(),
    readTime: z.number(),
    hero: z.string().default('/assets/social-preview.png'),
    status: z.enum(['draft', 'published']).default('draft'),
    relatedServices: z.array(z.string()),
    relatedCases: z.array(z.string()),
    canonical: z.url().optional(),
    social: z
      .object({
        enabled: z.boolean().default(true),
        linkedin: z.string().max(3000).optional(),
        x: z.string().max(240).optional(),
      })
      .optional(),
  }),
});
export const collections = { insights };
