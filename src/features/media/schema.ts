import { z } from 'zod';

export const mediaUploadSchema = z.object({
  albumId: z.string().uuid().optional().or(z.literal('')),
  alt: z.string().trim().max(200).optional().or(z.literal(''))
});

export type MediaUploadInput = z.infer<typeof mediaUploadSchema>;