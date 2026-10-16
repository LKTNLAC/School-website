'use server';

import { revalidatePath } from 'next/cache';


import {
  contentCreateSchema,
  contentUpdateSchema
} from './schema';
import * as service from './service';

import { recordAudit } from '@/lib/audit';
import { requireAuth } from '@/lib/auth-guard';
import { hasPermission } from '@/lib/rbac';


export type ActionResult =
  | { ok: true; id: string; slug: string }
  | { ok: false; error: string; details?: Record<string, string[]> };

export async function createContentAction(formData: FormData): Promise<ActionResult> {
  const user = await requireAuth();

  if (!hasPermission(user.role, 'content:create')) {
    return { ok: false, error: 'Bạn không có quyền tạo nội dung.' };
  }

  const parsed = contentCreateSchema.safeParse({
    type: formData.get('type'),
    title: formData.get('title'),
    slug: formData.get('slug'),
    summary: formData.get('summary') ?? '',
    body: formData.get('body'),
    seoTitle: formData.get('seoTitle') ?? '',
    seoDescription: formData.get('seoDescription') ?? '',
    categoryId: formData.get('categoryId') ?? ''
  });

  if (!parsed.success) {
    return {
      ok: false,
      error: 'Dữ liệu không hợp lệ.',
      details: parsed.error.flatten().fieldErrors as Record<string, string[]>
    };
  }

  try {
    const result = await service.createContent(parsed.data, user.id);
    await recordAudit({
      actorId: user.id,
      action: 'content.create',
      entityType: 'Content',
      entityId: result.id,
      metadata: { type: parsed.data.type, slug: parsed.data.slug }
    });
    revalidatePath('/admin/noi-dung');
    return { ok: true, id: result.id, slug: result.slug };
  } catch (err) {
    return {
      ok: false,
      error: err instanceof Error ? err.message : 'Không thể tạo nội dung.'
    };
  }
}

export async function updateContentAction(formData: FormData): Promise<ActionResult> {
  const user = await requireAuth();

  const id = String(formData.get('id') ?? '');
  if (!id) return { ok: false, error: 'Thiếu ID nội dung.' };

  const detail = await service.getAdminContentById(id);
  if (!detail) return { ok: false, error: 'Không tìm thấy nội dung.' };

  // Kiểm tra quyền: CONTRIBUTOR chỉ sửa content của mình
  const canEditAny = hasPermission(user.role, 'content:update:any');
  const canEditOwn = hasPermission(user.role, 'content:update:own');

  if (!canEditAny && !canEditOwn) {
    return { ok: false, error: 'Bạn không có quyền sửa nội dung.' };
  }

  const parsed = contentUpdateSchema.safeParse({
    id,
    type: detail.type,
    title: formData.get('title'),
    slug: formData.get('slug'),
    summary: formData.get('summary') ?? '',
    body: formData.get('body'),
    seoTitle: formData.get('seoTitle') ?? '',
    seoDescription: formData.get('seoDescription') ?? '',
    categoryId: formData.get('categoryId') ?? ''
  });

  if (!parsed.success) {
    return {
      ok: false,
      error: 'Dữ liệu không hợp lệ.',
      details: parsed.error.flatten().fieldErrors as Record<string, string[]>
    };
  }

  try {
    const result = await service.updateContent(parsed.data);
    await recordAudit({
      actorId: user.id,
      action: 'content.update',
      entityType: 'Content',
      entityId: result.id,
      metadata: { slug: result.slug }
    });
    revalidatePath('/admin/noi-dung');
    revalidatePath(`/admin/noi-dung/${result.id}`);
    return { ok: true, id: result.id, slug: result.slug };
  } catch (err) {
    return {
      ok: false,
      error: err instanceof Error ? err.message : 'Không thể cập nhật nội dung.'
    };
  }
}

export type ActionSimple =
  | { ok: true; message: string }
  | { ok: false; error: string };

export async function publishContentAction(id: string): Promise<ActionSimple> {
  const user = await requireAuth();
  if (!hasPermission(user.role, 'content:publish')) {
    return { ok: false, error: 'Bạn không có quyền xuất bản.' };
  }

  try {
    await service.publishContent(id, user.id);
    await recordAudit({
      actorId: user.id,
      action: 'content.publish',
      entityType: 'Content',
      entityId: id
    });
    revalidatePath('/admin/noi-dung');
    revalidatePath(`/admin/noi-dung/${id}`);
    return { ok: true, message: 'Đã xuất bản.' };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : 'Lỗi không xác định.' };
  }
}

export async function archiveContentAction(id: string): Promise<ActionSimple> {
  const user = await requireAuth();
  if (!hasPermission(user.role, 'content:archive')) {
    return { ok: false, error: 'Bạn không có quyền lưu trữ.' };
  }

  try {
    await service.archiveContent(id);
    await recordAudit({
      actorId: user.id,
      action: 'content.archive',
      entityType: 'Content',
      entityId: id
    });
    revalidatePath('/admin/noi-dung');
    revalidatePath(`/admin/noi-dung/${id}`);
    return { ok: true, message: 'Đã lưu trữ.' };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : 'Lỗi không xác định.' };
  }
}

export async function submitForReviewAction(id: string): Promise<ActionSimple> {
  const user = await requireAuth();
  try {
    await service.submitForReview(id);
    await recordAudit({
      actorId: user.id,
      action: 'content.submit_review',
      entityType: 'Content',
      entityId: id
    });
    revalidatePath('/admin/noi-dung');
    revalidatePath(`/admin/noi-dung/${id}`);
    return { ok: true, message: 'Đã gửi duyệt.' };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : 'Lỗi không xác định.' };
  }
}

export async function revertToDraftAction(id: string): Promise<ActionSimple> {
  const user = await requireAuth();
  try {
    await service.revertToDraft(id);
    await recordAudit({
      actorId: user.id,
      action: 'content.revert_draft',
      entityType: 'Content',
      entityId: id
    });
    revalidatePath('/admin/noi-dung');
    revalidatePath(`/admin/noi-dung/${id}`);
    return { ok: true, message: 'Đã chuyển về nháp.' };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : 'Lỗi không xác định.' };
  }
}

export async function softDeleteContentAction(id: string): Promise<ActionSimple> {
  const user = await requireAuth();
  if (!hasPermission(user.role, 'content:delete:soft')) {
    return { ok: false, error: 'Bạn không có quyền xóa.' };
  }

  try {
    await service.softDeleteContent(id);
    await recordAudit({
      actorId: user.id,
      action: 'content.soft_delete',
      entityType: 'Content',
      entityId: id
    });
    revalidatePath('/admin/noi-dung');
    return { ok: true, message: 'Đã xóa mềm.' };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : 'Lỗi không xác định.' };
  }
}

export async function hardDeleteContentAction(id: string): Promise<ActionSimple> {
  const user = await requireAuth();
  if (!hasPermission(user.role, 'content:delete:hard')) {
    return { ok: false, error: 'Chỉ quản trị viên có quyền xóa cứng.' };
  }

  try {
    await service.hardDeleteContent(id);
    await recordAudit({
      actorId: user.id,
      action: 'content.hard_delete',
      entityType: 'Content',
      entityId: id
    });
    revalidatePath('/admin/noi-dung');
    return { ok: true, message: 'Đã xóa vĩnh viễn.' };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : 'Lỗi không xác định.' };
  }
}

export async function restoreRevisionAction(revisionId: string): Promise<ActionSimple> {
  const user = await requireAuth();
  if (!hasPermission(user.role, 'content:rollback')) {
    return { ok: false, error: 'Bạn không có quyền khôi phục.' };
  }

  try {
    const result = await service.restoreFromRevision(revisionId, user.id);
    await recordAudit({
      actorId: user.id,
      action: 'content.rollback',
      entityType: 'Content',
      entityId: result.id,
      metadata: { revisionId }
    });
    revalidatePath('/admin/noi-dung');
    revalidatePath(`/admin/noi-dung/${result.id}`);
    return { ok: true, message: 'Đã khôi phục từ revision.' };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : 'Lỗi không xác định.' };
  }
}