import { z } from "zod";

export const searchQuerySchema = z.object({
  query: z
    .string()
    .min(1, "Search query is required")
    .max(100, "Search query must be less than 100 characters")
    .regex(/^[a-zA-Z0-9\s\-_]+$/, "Search query contains invalid characters")
    .transform(str => str.trim()),
});

export type SearchActionState<T> = {
  success: boolean;
  error?: string;
  data?: T;
};

export type SearchQueryInput = z.infer<typeof searchQuerySchema>;
