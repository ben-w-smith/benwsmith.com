import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

const blog = defineCollection({
  loader: glob({ pattern: "**/[^_]*.md", base: "./src/posts" }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    category: z.enum(["Technical", "Essay", "Project"]),
    excerpt: z.string(),
  }),
});

const spec = defineCollection({
  loader: glob({ pattern: "**/[^_]*.md", base: "./src/spec" }),
  schema: z.object({
    title: z.string(),
    order: z.number(),
    description: z.string(),
  }),
});

export const collections = { blog, spec };
