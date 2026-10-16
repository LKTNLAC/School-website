import type { SearchResult } from './types';

import { prisma } from '@/lib/db';




function toHref(type: string, slug: string): string {
  switch (type) {
    case 'PAGE':
      return `/${slug}`;
    case 'NEWS':
      return `/tin-tuc/${slug}`;
    case 'ANNOUNCEMENT':
      return `/thong-bao/${slug}`;
    case 'EVENT':
      return `/su-kien/${slug}`;
    case 'DOCUMENT':
      return `/tai-nguyen/${slug}`;
    default:
      return `/${slug}`;
  }
}

export async function searchContent(query: string, limit = 20): Promise<SearchResult[]> {
  

  const [contents, events, documents] = await Promise.all([
    prisma.content.findMany({
      where: {
        status: 'PUBLISHED',
        deletedAt: null,
        OR: [{ title: { contains: query, mode: 'insensitive' } }, { summary: { contains: query, mode: 'insensitive' } }]
      },
      orderBy: { publishedAt: 'desc' },
      take: limit,
      select: {
        id: true,
        type: true,
        slug: true,
        title: true,
        summary: true,
        publishedAt: true
      }
    }),
    prisma.event.findMany({
      where: {
        status: 'PUBLISHED',
        deletedAt: null,
        OR: [
          { title: { contains: query, mode: 'insensitive' } },
          { description: { contains: query, mode: 'insensitive' } }
        ]
      },
      orderBy: { startAt: 'desc' },
      take: limit,
      select: {
        id: true,
        slug: true,
        title: true,
        description: true,
        startAt: true
      }
    }),
    prisma.document.findMany({
      where: {
        status: 'PUBLISHED',
        deletedAt: null,
        title: { contains: query, mode: 'insensitive' }
      },
      orderBy: { title: 'asc' },
      take: limit,
      select: {
        id: true,
        slug: true,
        title: true
      }
    })
  ]);

  const results: SearchResult[] = [];

  for (const c of contents) {
    results.push({
      id: c.id,
      type: c.type as 'PAGE' | 'NEWS' | 'ANNOUNCEMENT',
      slug: c.slug,
      title: c.title,
      summary: c.summary,
      publishedAt: c.publishedAt,
      href: toHref(c.type, c.slug)
    });
  }

  for (const e of events) {
    results.push({
      id: e.id,
      type: 'EVENT',
      slug: e.slug,
      title: e.title,
      summary: e.description.slice(0, 200),
      publishedAt: e.startAt,
      href: toHref('EVENT', e.slug)
    });
  }

  for (const d of documents) {
    results.push({
      id: d.id,
      type: 'DOCUMENT',
      slug: d.slug,
      title: d.title,
      summary: null,
      publishedAt: null,
      href: toHref('DOCUMENT', d.slug)
    });
  }

  return results;
}