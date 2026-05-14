import { z } from 'zod';

export const postSchema = z.object({
  title:       z.string(),
  deck:        z.string(),
  date:        z.coerce.date(),
  issue:       z.string(),
  category:    z.string(),
  tags:        z.array(z.string()).default([]),
  readTime:    z.number(),
  heroImage:   z.string().optional(),
  heroCaption: z.string().optional(),
  featured:    z.boolean().default(false),
  draft:       z.boolean().default(false),
});

export type PostData = z.infer<typeof postSchema>;
