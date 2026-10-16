import { z } from 'zod';

export const userCreateSchema = z.object({
  email: z.string().trim().email('Email không hợp lệ').max(200),
  name: z.string().trim().min(2, 'Tên phải có ít nhất 2 ký tự').max(100),
  password: z
    .string()
    .min(8, 'Mật khẩu phải có ít nhất 8 ký tự')
    .max(200)
    .regex(/[A-Z]/, 'Phải có ít nhất 1 chữ hoa')
    .regex(/[a-z]/, 'Phải có ít nhất 1 chữ thường')
    .regex(/[0-9]/, 'Phải có ít nhất 1 chữ số'),
  role: z.enum(['ADMIN', 'EDITOR', 'CONTRIBUTOR', 'VIEWER'])
});

export const userUpdateSchema = z.object({
  id: z.string().uuid(),
  name: z.string().trim().min(2).max(100),
  role: z.enum(['ADMIN', 'EDITOR', 'CONTRIBUTOR', 'VIEWER']),
  status: z.enum(['ACTIVE', 'DISABLED'])
});

export const passwordResetSchema = z.object({
  id: z.string().uuid(),
  password: z
    .string()
    .min(8, 'Mật khẩu phải có ít nhất 8 ký tự')
    .max(200)
    .regex(/[A-Z]/, 'Phải có ít nhất 1 chữ hoa')
    .regex(/[a-z]/, 'Phải có ít nhất 1 chữ thường')
    .regex(/[0-9]/, 'Phải có ít nhất 1 chữ số')
});

export type UserCreateInput = z.infer<typeof userCreateSchema>;
export type UserUpdateInput = z.infer<typeof userUpdateSchema>;
export type PasswordResetInput = z.infer<typeof passwordResetSchema>;