import type { AuditFilter, AuditListResult } from './types';

import { prisma } from '@/lib/db';


export async function findAuditLogs(
  filter: AuditFilter = {},
  allowedActions: readonly string[] | null = null
): Promise<AuditListResult> {
  const page = Math.max(1, filter.page ?? 1);
  const pageSize = Math.min(100, Math.max(1, filter.pageSize ?? 30));

  const where: {
    action?: string;
    entityType?: string;
    actorId?: string;
    action_in?: string[];
  } = {};

  if (filter.action) where.action = filter.action;
  if (filter.entityType) where.entityType = filter.entityType;
  if (filter.actorId) where.actorId = filter.actorId;

  // VIEWER chỉ thấy action được phép
  if (allowedActions) {
    where.action_in = [...allowedActions];
  }

  const [rows, total] = await Promise.all([
    prisma.auditLog.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: pageSize,
      skip: (page - 1) * pageSize,
      select: {
        id: true,
        action: true,
        entityType: true,
        entityId: true,
        createdAt: true,
        actorId: true,
        metadata: true,
        actor: { select: { name: true, email: true } }
      }
    }),
    prisma.auditLog.count({ where })
  ]);

  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  return {
    items: rows.map((r) => ({
      id: r.id,
      action: r.action,
      entityType: r.entityType,
      entityId: r.entityId,
      entityIdShort: r.entityId.slice(0, 8),
      createdAt: r.createdAt,
      actorId: r.actorId,
      actorName: r.actor?.name ?? r.actor?.email ?? null,
      metadata: r.metadata as Record<string, unknown> | null
    })),
    total,
    page,
    pageSize,
    totalPages
  };
}

export async function findDistinctActions(): Promise<string[]> {
  const rows = await prisma.auditLog.findMany({
    distinct: ['action'],
    select: { action: true },
    orderBy: { action: 'asc' }
  });
  return rows.map((r) => r.action);
}

export async function findDistinctEntityTypes(): Promise<string[]> {
  const rows = await prisma.auditLog.findMany({
    distinct: ['entityType'],
    select: { entityType: true },
    orderBy: { entityType: 'asc' }
  });
  return rows.map((r) => r.entityType);
}