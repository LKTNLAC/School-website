import type { DashboardStats, RecentAuditItem, RecentContentItem } from './types';

import { prisma } from '@/lib/db';


function toContentHref(type: string, slug: string): string {
  switch (type) {
    case 'NEWS':
      return `/tin-tuc/${slug}`;
    case 'ANNOUNCEMENT':
      return `/thong-bao/${slug}`;
    case 'PAGE':
      return `/${slug}`;
    default:
      return `/${slug}`;
  }
}

export async function getStats(): Promise<DashboardStats> {
  const [
    newsCount,
    announcementCount,
    eventCount,
    documentCount,
    publishedCount,
    draftCount
  ] = await Promise.all([
    prisma.content.count({
      where: { type: 'NEWS', deletedAt: null }
    }),
    prisma.content.count({
      where: { type: 'ANNOUNCEMENT', deletedAt: null }
    }),
    prisma.event.count({ where: { deletedAt: null } }),
    prisma.document.count({ where: { deletedAt: null } }),
    prisma.content.count({
      where: { status: 'PUBLISHED', deletedAt: null }
    }),
    prisma.content.count({
      where: { status: 'DRAFT', deletedAt: null }
    })
  ]);

  return {
    newsCount,
    announcementCount,
    eventCount,
    documentCount,
    publishedCount,
    draftCount
  };
}

export async function getRecentContent(limit = 10): Promise<RecentContentItem[]> {
  const rows = await prisma.content.findMany({
    where: { deletedAt: null },
    orderBy: { updatedAt: 'desc' },
    take: limit,
    select: {
      id: true,
      type: true,
      title: true,
      slug: true,
      status: true,
      updatedAt: true
    }
  });

  return rows.map((r) => ({
    id: r.id,
    type: r.type as 'PAGE' | 'NEWS' | 'ANNOUNCEMENT',
    title: r.title,
    slug: r.slug,
    status: r.status,
    updatedAt: r.updatedAt,
    href: toContentHref(r.type, r.slug)
  }));
}

export async function getRecentAudit(limit = 10): Promise<RecentAuditItem[]> {
  const rows = await prisma.auditLog.findMany({
    orderBy: { createdAt: 'desc' },
    take: limit,
    select: {
      id: true,
      action: true,
      entityType: true,
      entityId: true,
      createdAt: true,
      actor: { select: { name: true, email: true } }
    }
  });

  return rows.map((r) => ({
    id: r.id,
    action: r.action,
    entityType: r.entityType,
    entityId: r.entityId,
    createdAt: r.createdAt,
    actorName: r.actor?.name ?? r.actor?.email ?? null
  }));
}