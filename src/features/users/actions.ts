'use server';

import { revalidatePath } from 'next/cache';

import {
  passwordResetSchema,
  userCreateSchema,
  userUpdateSchema
} from './schema';
import * as service from './service';

import { recordAudit } from '@/lib/audit';
import { requireAuth } from '@/lib/auth-guard';



export type UserActionResult =
  | { ok: true; id: string; message: string }
  | { ok: false; error: string; details?: Record<string, string[]> };

function requireUserManage(role: string) {
  if (role !== 'ADMIN') {
    return { ok: false as const, error: 'Chỉ quản trị viên có quyền quản lý người dùng.' };
  }
  return { ok: true as const };
}

export async function createUserAction(formData: FormData): Promise<UserActionResult> {
  const user = await requireAuth();
  const check = requireUserManage(user.role);
  if (!check.ok) return check;

  const parsed = userCreateSchema.safeParse({
    email: formData.get('email'),
    name: formData.get('name'),
    password: formData.get('password'),
    role: formData.get('role')
  });

  if (!parsed.success) {
    return {
      ok: false,
      error: 'Dữ liệu không hợp lệ.',
      details: parsed.error.flatten().fieldErrors as Record<string, string[]>
    };
  }

  try {
    const result = await service.createUser(parsed.data);
    await recordAudit({
      actorId: user.id,
      action: 'user.create',
      entityType: 'User',
      entityId: result.id,
      metadata: { email: parsed.data.email, role: parsed.data.role }
    });
    revalidatePath('/admin/nguoi-dung');
    return { ok: true, id: result.id, message: 'Đã tạo tài khoản.' };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : 'Không thể tạo.' };
  }
}

export async function updateUserAction(formData: FormData): Promise<UserActionResult> {
  const user = await requireAuth();
  const check = requireUserManage(user.role);
  if (!check.ok) return check;

  const parsed = userUpdateSchema.safeParse({
    id: formData.get('id'),
    name: formData.get('name'),
    role: formData.get('role'),
    status: formData.get('status')
  });

  if (!parsed.success) {
    return {
      ok: false,
      error: 'Dữ liệu không hợp lệ.',
      details: parsed.error.flatten().fieldErrors as Record<string, string[]>
    };
  }

  try {
    const result = await service.updateUser(parsed.data, user.id);
    await recordAudit({
      actorId: user.id,
      action: 'user.update',
      entityType: 'User',
      entityId: result.id,
      metadata: {
        role: parsed.data.role,
        status: parsed.data.status,
        revokedSessions: result.revoked
      }
    });
    revalidatePath('/admin/nguoi-dung');
    revalidatePath(`/admin/nguoi-dung/${result.id}`);
    return {
      ok: true,
      id: result.id,
      message: result.revoked > 0
        ? `Đã cập nhật. ${result.revoked} session bị thu hồi.`
        : 'Đã cập nhật.'
    };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : 'Không thể cập nhật.' };
  }
}

export async function resetPasswordAction(formData: FormData): Promise<UserActionResult> {
  const user = await requireAuth();
  const check = requireUserManage(user.role);
  if (!check.ok) return check;

  const parsed = passwordResetSchema.safeParse({
    id: formData.get('id'),
    password: formData.get('password')
  });

  if (!parsed.success) {
    return {
      ok: false,
      error: 'Dữ liệu không hợp lệ.',
      details: parsed.error.flatten().fieldErrors as Record<string, string[]>
    };
  }

  try {
    await service.resetPassword(parsed.data);
    await recordAudit({
      actorId: user.id,
      action: 'user.reset_password',
      entityType: 'User',
      entityId: parsed.data.id
    });
    revalidatePath(`/admin/nguoi-dung/${parsed.data.id}`);
    return { ok: true, id: parsed.data.id, message: 'Đã đặt lại mật khẩu và thu hồi mọi session.' };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : 'Không thể đặt lại mật khẩu.' };
  }
}

export async function revokeSessionsAction(id: string): Promise<UserActionResult> {
  const user = await requireAuth();
  const check = requireUserManage(user.role);
  if (!check.ok) return check;

  try {
    const count = await service.revokeUserSessions(id);
    await recordAudit({
      actorId: user.id,
      action: 'user.revoke_sessions',
      entityType: 'User',
      entityId: id,
      metadata: { count }
    });
    revalidatePath(`/admin/nguoi-dung/${id}`);
    return { ok: true, id, message: `Đã thu hồi ${count} session.` };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : 'Không thể thu hồi.' };
  }
}

export async function deleteUserAction(id: string): Promise<UserActionResult> {
  const user = await requireAuth();
  const check = requireUserManage(user.role);
  if (!check.ok) return check;

  try {
    await service.deleteUser(id, user.id);
    await recordAudit({
      actorId: user.id,
      action: 'user.hard_delete',
      entityType: 'User',
      entityId: id
    });
    revalidatePath('/admin/nguoi-dung');
    return { ok: true, id, message: 'Đã xóa tài khoản.' };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : 'Không thể xóa.' };
  }
}