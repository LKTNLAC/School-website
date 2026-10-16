'use server';

import { revalidatePath } from 'next/cache';

import { documentCreateSchema } from './schema';
import * as service from './service';

import { recordAudit } from '@/lib/audit';
import { requireAuth } from '@/lib/auth-guard';
import { hasPermission } from '@/lib/rbac';


export type DocumentActionResult =
  | { ok: true; id: string; slug?: string; message: string }
  | { ok: false; error: string; details?: Record<string, string[]> };

const MAX_DOC_SIZE = 20 * 1024 * 1024; // 20MB

export async function createDocumentAction(formData: FormData): Promise<DocumentActionResult> {
  const user = await requireAuth();
  if (!hasPermission(user.role, 'content:create')) {
    return { ok: false, error: 'Bạn không có quyền tạo tài liệu.' };
  }

  const parsed = documentCreateSchema.safeParse({
    title: formData.get('title'),
    slug: formData.get('slug'),
    status: formData.get('status') ?? 'DRAFT'
  });

  if (!parsed.success) {
    return {
      ok: false,
      error: 'Dữ liệu không hợp lệ.',
      details: parsed.error.flatten().fieldErrors as Record<string, string[]>
    };
  }

  try {
    const result = await service.createDocument(parsed.data);
    await recordAudit({
      actorId: user.id,
      action: 'document.create',
      entityType: 'Document',
      entityId: result.id,
      metadata: { slug: result.slug }
    });
    revalidatePath('/admin/tai-lieu');
    return { ok: true, id: result.id, slug: result.slug, message: 'Đã tạo tài liệu.' };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : 'Không thể tạo.' };
  }
}

export async function updateDocumentAction(formData: FormData): Promise<DocumentActionResult> {
  const user = await requireAuth();
  if (!hasPermission(user.role, 'content:update:any')) {
    return { ok: false, error: 'Bạn không có quyền sửa tài liệu.' };
  }

  const id = String(formData.get('id') ?? '');
  if (!id) return { ok: false, error: 'Thiếu ID.' };

  const parsed = documentCreateSchema.safeParse({
    title: formData.get('title'),
    slug: formData.get('slug'),
    status: formData.get('status') ?? 'DRAFT'
  });

  if (!parsed.success) {
    return {
      ok: false,
      error: 'Dữ liệu không hợp lệ.',
      details: parsed.error.flatten().fieldErrors as Record<string, string[]>
    };
  }

  try {
    const result = await service.updateDocument(id, parsed.data);
    await recordAudit({
      actorId: user.id,
      action: 'document.update',
      entityType: 'Document',
      entityId: id
    });
    revalidatePath('/admin/tai-lieu');
    revalidatePath(`/admin/tai-lieu/${id}`);
    return { ok: true, id: result.id, message: 'Đã cập nhật.' };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : 'Không thể cập nhật.' };
  }
}

export async function uploadDocumentRevisionAction(
  formData: FormData
): Promise<DocumentActionResult> {
  const user = await requireAuth();
  if (!hasPermission(user.role, 'media:upload')) {
    return { ok: false, error: 'Bạn không có quyền upload.' };
  }

  const documentId = String(formData.get('documentId') ?? '');
  if (!documentId) return { ok: false, error: 'Thiếu ID tài liệu.' };

  const file = formData.get('file');
  if (!(file instanceof File) || file.size === 0) {
    return { ok: false, error: 'Vui lòng chọn file.' };
  }

  if (file.size > MAX_DOC_SIZE) {
    return { ok: false, error: 'File vượt quá 20MB.' };
  }

  try {
    const buffer = Buffer.from(await file.arrayBuffer());
    const result = await service.uploadDocumentRevision(
      documentId,
      buffer,
      file.name,
      file.type,
      user.id
    );

    await recordAudit({
      actorId: user.id,
      action: 'document.upload_revision',
      entityType: 'DocumentRevision',
      entityId: result.revisionId,
      metadata: { documentId, fileName: file.name }
    });

    revalidatePath('/admin/tai-lieu');
    revalidatePath(`/admin/tai-lieu/${documentId}`);
    return { ok: true, id: documentId, message: 'Đã upload revision mới.' };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : 'Không thể upload.' };
  }
}

export async function deleteDocumentAction(id: string): Promise<DocumentActionResult> {
  const user = await requireAuth();
  if (!hasPermission(user.role, 'content:delete:soft')) {
    return { ok: false, error: 'Bạn không có quyền xóa.' };
  }

  try {
    await service.deleteDocument(id);
    await recordAudit({
      actorId: user.id,
      action: 'document.soft_delete',
      entityType: 'Document',
      entityId: id
    });
    revalidatePath('/admin/tai-lieu');
    return { ok: true, id, message: 'Đã xóa.' };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : 'Không thể xóa.' };
  }
}