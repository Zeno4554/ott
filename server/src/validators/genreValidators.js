import { z } from "zod";

export const createGenreSchema = z.object({
  body: z.object({
    name: z.string().trim().min(2).max(100),
  }),
});

export const updateGenreSchema = z.object({
  params: z.object({
    id: z.string().uuid(),
  }),
  body: z.object({
    name: z.string().trim().min(2).max(100),
  }),
});

export const genreIdSchema = z.object({
  params: z.object({
    id: z.string().uuid(),
  }),
});