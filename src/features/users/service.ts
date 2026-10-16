import { hash } from 'bcryptjs';


import * as repository from './repository';
import type { PasswordResetInput, UserCreateInput, UserUpdateInput } from './schema';
import type { AdminUserDetail, AdminUserListItem } from './types';



export async function getAllUsers(): Promise<AdminUserListItem[]> {
  return repository.findAll();
}

export async function getUserById(id: string): Promise<AdminUserDetail | null> {
  return repository.findById(id);
}

export async function createUser(input: UserCreateInput): Promise<{ id: string }> {
  const exists = await repository.findByEmail(input.email);
  if (exists) {
    throw new Error('Email đã tồn tại.');
  }

  const passwordHash = await hash(input.password, 12);
  return repository.createUser({
    email: input.email,
    name: input.name,
    passwordHash,
    role: input.role
  });
}

export async function updateUser(
  input: UserUpdateInput,
  currentUserId: string
): Promise<{ id: string; revoked: number }> {
  const user = await repository.findById(input.id);
  if (!user) throw new Error('Không tìm thấy người dùng.');

  // Không cho phép tự hạ quyền chính mình
  if (input.id === currentUserId && input.role !== 'ADMIN') {
    throw new Error('Không thể tự hạ quyền của chính mình.');
  }

  // Không cho phép disable chính mình
  if (input.id === currentUserId && input.status !== 'ACTIVE') {
    throw new Error('Không thể tự vô hiệu hóa tài khoản của chính mình.');
  }

  // Không cho phép hạ cấp admin cuối cùng
  if (user.role === 'ADMIN' && input.role !== 'ADMIN') {
    const adminCount = await repository.countAdmins();
    if (adminCount <= 1) {
      throw new Error('Không thể hạ cấp quản trị viên cuối cùng.');
    }
  }

  const roleChanged = user.role !== input.role;
  const statusChanged = user.status !== input.status;

  await repository.updateUser({
    id: input.id,
    name: input.name,
    role: input.role,
    status: input.status
  });

  // Revoke session khi role/status thay đổi
  let revoked = 0;
  if (roleChanged || (statusChanged && input.status === 'DISABLED')) {
    revoked = await repository.revokeAllSessions(input.id);
  }

  return { id: input.id, revoked };
}

export async function resetPassword(input: PasswordResetInput): Promise<void> {
  const user = await repository.findById(input.id);
  if (!user) throw new Error('Không tìm thấy người dùng.');

  const passwordHash = await hash(input.password, 12);
  await repository.updatePassword(input.id, passwordHash);
  await repository.revokeAllSessions(input.id);
}

export async function revokeUserSessions(id: string): Promise<number> {
  return repository.revokeAllSessions(id);
}

export async function deleteUser(id: string, currentUserId: string): Promise<void> {
  if (id === currentUserId) {
    throw new Error('Không thể xóa chính mình.');
  }

  const user = await repository.findById(id);
  if (!user) throw new Error('Không tìm thấy người dùng.');

  if (user.role === 'ADMIN') {
    const adminCount = await repository.countAdmins();
    if (adminCount <= 1) {
      throw new Error('Không thể xóa quản trị viên cuối cùng.');
    }
  }

  await repository.hardDelete(id);
}