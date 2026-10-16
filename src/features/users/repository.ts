import type { AdminUserDetail, AdminUserListItem } from './types';

import { prisma } from '@/lib/db';
import type { UserRole, UserStatus } from '@/types';


export async function findAll(): Promise<AdminUserListItem[]> {
  const rows = await prisma.user.findMany({
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      status: true,
      createdAt: true,
      sessions: {
        orderBy: { lastSeenAt: 'desc' },
        take: 1,
        select: { lastSeenAt: true, revokedAt: true }
      },
      _count: {
        select: {
          sessions: {
            where: {
              revokedAt: null,
              expires: { gt: new Date() }
            }
          }
        }
      }
    }
  });

  return rows.map((r) => {
    const activeSession = r.sessions[0];
    return {
      id: r.id,
      email: r.email,
      name: r.name,
      role: r.role as UserRole,
      status: r.status as UserStatus,
      createdAt: r.createdAt,
      lastSessionAt:
        activeSession && !activeSession.revokedAt ? activeSession.lastSeenAt : null,
      sessionCount: r._count.sessions
    };
  });
}

export async function findById(id: string): Promise<AdminUserDetail | null> {
  const row = await prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      status: true,
      createdAt: true,
      updatedAt: true,
      sessions: {
        orderBy: { lastSeenAt: 'desc' },
        take: 20,
        select: {
          id: true,
          expires: true,
          lastSeenAt: true,
          revokedAt: true
        }
      }
    }
  });

  if (!row) return null;

  return {
    id: row.id,
    email: row.email,
    name: row.name,
    role: row.role as UserRole,
    status: row.status as UserStatus,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
    sessions: row.sessions
  };
}

export async function findByEmail(email: string): Promise<{ id: string } | null> {
  return prisma.user.findUnique({
    where: { email },
    select: { id: true }
  });
}

export async function createUser(data: {
  email: string;
  name: string;
  passwordHash: string;
  role: string;
}): Promise<{ id: string }> {
  return prisma.user.create({
    data: {
      email: data.email,
      name: data.name,
      passwordHash: data.passwordHash,
      role: data.role,
      status: 'ACTIVE'
    },
    select: { id: true }
  });
}

export async function updateUser(data: {
  id: string;
  name: string;
  role: string;
  status: string;
}): Promise<{ id: string }> {
  return prisma.user.update({
    where: { id: data.id },
    data: {
      name: data.name,
      role: data.role,
      status: data.status
    },
    select: { id: true }
  });
}

export async function updatePassword(id: string, passwordHash: string): Promise<void> {
  await prisma.user.update({
    where: { id },
    data: { passwordHash }
  });
}

export async function revokeAllSessions(userId: string): Promise<number> {
  const result = await prisma.session.updateMany({
    where: { userId, revokedAt: null },
    data: { revokedAt: new Date() }
  });
  return result.count;
}

export async function countAdmins(): Promise<number> {
  return prisma.user.count({
    where: { role: 'ADMIN', status: 'ACTIVE' }
  });
}

export async function hardDelete(id: string): Promise<void> {
  await prisma.user.delete({ where: { id } });
}