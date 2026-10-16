'use server';

import { revalidatePath } from 'next/cache';

import * as service from './service';

import { recordAudit } from '@/lib/audit';
import { requireAuth } from '@/lib/auth-guard';
import { hasPermission } from '@/lib/rbac';


export type MediaActionResult =
  | { ok: true; id: string; url: string }
  | { ok: false; error: string };

const MAX_UPLOAD_SIZE = 100 * 1024 * 1024; // 100MB (video max)

export async function uploadMediaAction(formData: FormData): Promise<MediaActionResult> {
  const user = await requireAuth();

  if (!hasPermission(user.role, 'media:upload')) {
    return { ok: false, error: 'Bạn không có quyền upload file.' };
  }

  const file = formData.get('file');
  if (!(file instanceof File)) {
    return { ok: false, error: 'Thiếu file.' };
  }

  if (file.size > MAX_UPLOAD_SIZE) {
    return { ok: false, error: 'File vượt quá giới hạn 100MB.' };
  }

  const albumId = String(formData.get('albumId') ?? '');

  try {
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const result = await service.uploadMedia(
      buffer,
      file.name,
      file.type,
      albumId || null
    );

    await recordAudit({
      actorId: user.id,
      action: 'media.upload',
      entityType: 'MediaAsset',
      entityId: result.id,
      metadata: { fileName: file.name, size: file.size }
    });

    revalidatePath('/admin/media');
    return { ok: true, id: result.id, url: result.url };
  } catch (err) {
    return {
      ok: false,
      error: err instanceof Error ? err.message : 'Không thể upload file.'
    };
  }
}

export async function deleteMediaAction(id: string): Promise<{ ok: true } | { ok: false; error: string }> {
  const user = await requireAuth();

  if (!hasPermission(user.role, 'media:delete')) {
    return { ok: false, error: 'Bạn không có quyền xóa media.' };
  }

  try {
    await service.deleteAsset(id);
    await recordAudit({
      actorId: user.id,
      action: 'media.delete',
      entityType: 'MediaAsset',
      entityId: id
    });
    revalidatePath('/admin/media');
    return { ok: true };
  } catch (err) {
    return {
      ok: false,
      error: err instanceof Error ? err.message : 'Không thể xóa media.'
    };
  }
}