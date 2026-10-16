import { z } from 'zod';

export const contentCreateSchema = z.object({
  type: z.enum(['PAGE', 'NEWS', 'ANNOUNCEMENT']),
  title: z.string().trim().min(3, 'Tiêu đề phải có ít nhất 3 ký tự').max(200),
  slug: z
    .string()
    .trim()
    .min(3, 'Slug phải có ít nhất 3 ký tự')
    .max(200)
    .regex(/^[a-z0-9-]+$/, 'Slug chỉ chứa chữ thường, số và dấu gạch ngang'),
  summary: z.string().trim().max(500).optional().or(z.literal('')),
  body: z.string().trim().min(10, 'Nội dung phải có ít nhất 10 ký tự'),
  seoTitle: z.string().trim().max(200).optional().or(z.literal('')),
  seoDescription: z.string().trim().max(300).optional().or(z.literal('')),
  categoryId: z.string().uuid().optional().or(z.literal(''))
});

export const contentUpdateSchema = contentCreateSchema.extend({
  id: z.string().uuid()
});

export type ContentCreateInput = z.infer<typeof contentCreateSchema>;
export type ContentUpdateInput = z.infer<typeof contentUpdateSchema>;