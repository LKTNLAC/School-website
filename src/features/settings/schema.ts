import { z } from 'zod';

export const siteSettingsSchema = z.object({
  siteName: z.string().trim().min(1, 'Tên site không được để trống').max(200),
  siteDescription: z.string().trim().max(500),
  contactAddress: z.string().trim().max(300),
  contactPhone: z.string().trim().max(50),
  contactEmail: z.string().trim().email('Email không hợp lệ').max(200),
  contactWorkingHours: z.string().trim().max(200),
  seoDefaultTitle: z.string().trim().max(200),
  seoDefaultDescription: z.string().trim().max(300),
  footerCopyright: z.string().trim().max(200)
});

export type SiteSettingsInput = z.infer<typeof siteSettingsSchema>;