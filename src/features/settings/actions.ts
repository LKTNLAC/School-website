'use server';

import { revalidatePath } from 'next/cache';

import { siteSettingsSchema } from './schema';
import * as service from './service';

import { recordAudit } from '@/lib/audit';
import { requireAuth } from '@/lib/auth-guard';


export type SettingsActionResult =
  | { ok: true; message: string }
  | { ok: false; error: string; details?: Record<string, string[]> };

export async function updateSettingsAction(
  formData: FormData
): Promise<SettingsActionResult> {
  const user = await requireAuth();

  if (user.role !== 'ADMIN') {
    return { ok: false, error: 'Chỉ quản trị viên có quyền thay đổi cấu hình.' };
  }

  const parsed = siteSettingsSchema.safeParse({
    siteName: formData.get('siteName'),
    siteDescription: formData.get('siteDescription') ?? '',
    contactAddress: formData.get('contactAddress') ?? '',
    contactPhone: formData.get('contactPhone') ?? '',
    contactEmail: formData.get('contactEmail') ?? '',
    contactWorkingHours: formData.get('contactWorkingHours') ?? '',
    seoDefaultTitle: formData.get('seoDefaultTitle') ?? '',
    seoDefaultDescription: formData.get('seoDefaultDescription') ?? '',
    footerCopyright: formData.get('footerCopyright') ?? ''
  });

  if (!parsed.success) {
    return {
      ok: false,
      error: 'Dữ liệu không hợp lệ.',
      details: parsed.error.flatten().fieldErrors as Record<string, string[]>
    };
  }

  try {
    await service.updateSettings(parsed.data);
    await recordAudit({
      actorId: user.id,
      action: 'setting.update',
      entityType: 'Setting',
      entityId: 'site',
      metadata: { siteName: parsed.data.siteName }
    });
    revalidatePath('/admin/cau-hinh');
    revalidatePath('/', 'layout');
    revalidatePath('/');
    revalidatePath('/lien-he');
    return { ok: true, message: 'Đã lưu cấu hình.' };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : 'Không thể lưu.' };
  }
}