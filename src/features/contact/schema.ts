import { z } from 'zod';

export const contactSchema = z.object({
  name: z.string().trim().min(2, 'Họ tên phải có ít nhất 2 ký tự').max(100),
  email: z.string().trim().email('Email không hợp lệ').max(200),
  message: z
    .string()
    .trim()
    .min(10, 'Nội dung phải có ít nhất 10 ký tự')
    .max(2000, 'Nội dung không được vượt quá 2000 ký tự')
});

export type ContactFormValues = z.infer<typeof contactSchema>;