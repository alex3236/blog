import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

const posts = defineCollection({
  loader: glob({ pattern: "**/*.typ", base: "./posts" }),
  schema: z.object({
    title: z.string(),
    date: z.string(),
    tags: z
      .union([z.array(z.string()), z.string()])
      .transform((v) => (Array.isArray(v) ? v : [v]))
      .default([]),
    category: z.string().nullish().default(""),
    draft: z.boolean().default(false),
    page: z.boolean().default(false),
    summary: z.string().nullish().default(""),
    weather: z.string().nullish().default(""),
    description: z.string().nullish().default(""),
    bibliography: z.string().nullish().default(""),
  }),
});

export const collections = { posts };
