import { z } from "zod";

export const createMovieSchema = z.object({
 body: z.object({
  title: z.string().trim().min(2).max(255),
  description: z.string().trim().optional(),
  releaseYear: z.number().int().min(1900).max(2100).optional(),
  duration: z.number().int().positive().optional(),
  language: z.string().trim().optional(),
  categoryId: z.string().uuid(),
  genreIds: z.array(z.string().uuid()).default([]),
}),
});

export const updateMovieSchema = z.object({
  params: z.object({
    id: z.string().uuid(),
  }),
 body: z.object({
  title: z.string().trim().min(2).max(255),
  description: z.string().trim().optional(),
  releaseYear: z.number().int().min(1900).max(2100).optional(),
  duration: z.number().int().positive().optional(),
  language: z.string().trim().optional(),
  categoryId: z.string().uuid(),
  genreIds: z.array(z.string().uuid()).default([]),
}),
});

export const movieIdSchema = z.object({
  params: z.object({
    id: z.string().uuid(),
  }),
});