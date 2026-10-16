import type { EventDetail, EventListItem } from './types';

import { prisma } from '@/lib/db';


export async function findUpcoming(limit?: number): Promise<EventListItem[]> {
  return prisma.event.findMany({
    where: {
      status: 'PUBLISHED',
      deletedAt: null,
      startAt: { gte: new Date() }
    },
    orderBy: { startAt: 'asc' },
    ...(limit ? { take: limit } : {}),
    select: {
      id: true,
      slug: true,
      title: true,
      location: true,
      startAt: true,
      endAt: true
    }
  });
}

export async function findPast(limit?: number): Promise<EventListItem[]> {
  return prisma.event.findMany({
    where: {
      status: 'PUBLISHED',
      deletedAt: null,
      startAt: { lt: new Date() }
    },
    orderBy: { startAt: 'desc' },
    ...(limit ? { take: limit } : {}),
    select: {
      id: true,
      slug: true,
      title: true,
      location: true,
      startAt: true,
      endAt: true
    }
  });
}

export async function findBySlug(slug: string): Promise<EventDetail | null> {
  return prisma.event.findFirst({
    where: { slug, status: 'PUBLISHED', deletedAt: null },
    select: {
      id: true,
      slug: true,
      title: true,
      description: true,
      location: true,
      startAt: true,
      endAt: true
    }
  });
}