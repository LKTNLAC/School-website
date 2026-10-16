import { redirect } from 'next/navigation';

import { auth } from '@/lib/auth';
import type { UserRole } from '@/types';

export type SessionUser = {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  status: string;
};

export async function getSessionUser(): Promise<SessionUser | null> {
  const session = await auth();
  if (!session?.user) return null;

  const user = session.user;
  if (!user.id || !user.role || user.status !== 'ACTIVE') return null;

  return {
    id: user.id,
    email: user.email ?? '',
    name: user.name ?? '',
    role: user.role as UserRole,
    status: user.status
  };
}

export async function requireAuth(): Promise<SessionUser> {
  const user = await getSessionUser();
  if (!user) {
    redirect('/dang-nhap');
  }
  return user;
}