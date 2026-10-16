import { z } from 'zod';

export const documentCreateSchema = z.object({
  title: z.string().trim().min(3, 'Tiêu đề phải có ít nhất 3 ký tự').max(200),
  slug: z
    .string()
    .trim()
    .min(3, 'Slug phải có ít nhất 3 ký tự')
    .max(200)
    .regex(/^[a-z0-9-]+$/, 'Slug chỉ chứa chữ thường, số và dấu gạch ngang'),
  status: z.enum(['DRAFT', 'PUBLISHED']).default('DRAFT')
});

export type DocumentCreateInput = z.infer<typeof documentCreateSchema>;