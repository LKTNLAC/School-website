import type { UserRole } from '@/types';

export type Permission =
  | 'content:create'
  | 'content:update:own'
  | 'content:update:any'
  | 'content:publish'
  | 'content:archive'
  | 'content:delete:soft'
  | 'content:delete:hard'
  | 'content:rollback'
  | 'media:upload'
  | 'media:delete'
  | 'user:manage'
  | 'role:manage'
  | 'setting:manage'
  | 'audit:view:full'
  | 'audit:view:summary';

const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  ADMIN: [
    'content:create',
    'content:update:own',
    'content:update:any',
    'content:publish',
    'content:archive',
    'content:delete:soft',
    'content:delete:hard',
    'content:rollback',
    'media:upload',
    'media:delete',
    'user:manage',
    'role:manage',
    'setting:manage',
    'audit:view:full'
  ],
  EDITOR: [
    'content:create',
    'content:update:own',
    'content:update:any',
    'content:publish',
    'content:archive',
    'content:delete:soft',
    'content:rollback',
    'media:upload',
    'media:delete',
    'audit:view:full'
  ],
  CONTRIBUTOR: ['content:create', 'content:update:own', 'media:upload'],
  VIEWER: ['audit:view:summary']
};

export function hasPermission(role: UserRole, permission: Permission): boolean {
  return ROLE_PERMISSIONS[role]?.includes(permission) ?? false;
}

export function requirePermission(role: UserRole, permission: Permission): void {
  if (!hasPermission(role, permission)) {
    const error = new Error('Forbidden: thiếu quyền ' + permission);
    (error as Error & { statusCode?: number }).statusCode = 403;
    throw error;
  }
}