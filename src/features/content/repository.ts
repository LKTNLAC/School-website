import type { ContentCreateInput } from './schema';
import type { ContentDetail, ContentListItem, PaginatedResult } from './types';
import type { AdminContentDetail, AdminContentFilter, AdminContentListItem } from './types';

import { prisma } from '@/lib/db';



type ListType = 'NEWS' | 'ANNOUNCEMENT';

export async function findPublishedList(
  type: ListType,
  options: { page?: number; pageSize?: number } = {}
): Promise<PaginatedResult<ContentListItem>> {
  const page = Math.max(1, options.page ?? 1);
  const pageSize = Math.min(50, Math.max(1, options.pageSize ?? 9));

  const where = {
    type,
    status: 'PUBLISHED' as const,
    deletedAt: null
  };

  const [rows, total] = await Promise.all([
    prisma.content.findMany({
      where,
      orderBy: { publishedAt: 'desc' },
      take: pageSize,
      skip: (page - 1) * pageSize,
      select: {
        id: true,
        type: true,
        slug: true,
        title: true,
        summary: true,
        publishedAt: true,
        category: { select: { id: true, name: true, slug: true } }
      }
    }),
    prisma.content.count({ where })
  ]);

  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  return {
    items: rows.map((r) => ({
      ...r,
      type: r.type as ListType
    })),
    total,
    page,
    pageSize,
    totalPages
  };
}

export async function findPublishedBySlug(
  type: 'PAGE' | 'NEWS' | 'ANNOUNCEMENT',
  slug: string
): Promise<ContentDetail | null> {
  const row = await prisma.content.findFirst({
    where: {
      type,
      slug,
      status: 'PUBLISHED',
      deletedAt: null
    },
    select: {
      id: true,
      type: true,
      slug: true,
      title: true,
      summary: true,
      body: true,
      publishedAt: true,
      seoTitle: true,
      seoDescription: true,
      category: { select: { id: true, name: true, slug: true } }
    }
  });

  if (!row) return null;
  return {
    ...row,
    type: row.type as 'PAGE' | 'NEWS' | 'ANNOUNCEMENT'
  };
}

export async function findLatest(type: ListType, limit = 3): Promise<ContentListItem[]> {
  const rows = await prisma.content.findMany({
    where: { type, status: 'PUBLISHED', deletedAt: null },
    orderBy: { publishedAt: 'desc' },
    take: limit,
    select: {
      id: true,
      type: true,
      slug: true,
      title: true,
      summary: true,
      publishedAt: true,
      category: { select: { id: true, name: true, slug: true } }
    }
  });

  return rows.map((r) => ({
    ...r,
    type: r.type as ListType
  }));
}



export async function findAdminList(
  filter: AdminContentFilter = {}
): Promise<PaginatedResult<AdminContentListItem>> {
  const page = Math.max(1, filter.page ?? 1);
  const pageSize = Math.min(50, Math.max(1, filter.pageSize ?? 20));

  const where: {
    type?: string;
    status?: string;
    deletedAt: null;
    OR?: Array<Record<string, unknown>>;
  } = {
    deletedAt: null
  };

  if (filter.type) where.type = filter.type;
  if (filter.status) where.status = filter.status;

  if (filter.search && filter.search.trim().length >= 2) {
    where.OR = [
      { title: { contains: filter.search, mode: 'insensitive' } },
      { slug: { contains: filter.search, mode: 'insensitive' } }
    ];
  }

  const [rows, total] = await Promise.all([
    prisma.content.findMany({
      where,
      orderBy: { updatedAt: 'desc' },
      take: pageSize,
      skip: (page - 1) * pageSize,
      select: {
        id: true,
        type: true,
        slug: true,
        title: true,
        status: true,
        publishedAt: true,
        updatedAt: true,
        author: { select: { name: true, email: true } },
        category: { select: { name: true } }
      }
    }),
    prisma.content.count({ where })
  ]);

  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  return {
    items: rows.map((r) => ({
      id: r.id,
      type: r.type as 'PAGE' | 'NEWS' | 'ANNOUNCEMENT',
      slug: r.slug,
      title: r.title,
      status: r.status,
      publishedAt: r.publishedAt,
      updatedAt: r.updatedAt,
      authorName: r.author?.name ?? r.author?.email ?? null,
      categoryName: r.category?.name ?? null
    })),
    total,
    page,
    pageSize,
    totalPages
  };
}

export async function findAdminById(id: string): Promise<AdminContentDetail | null> {
  const row = await prisma.content.findFirst({
    where: { id, deletedAt: null },
    select: {
      id: true,
      type: true,
      slug: true,
      title: true,
      summary: true,
      body: true,
      status: true,
      seoTitle: true,
      seoDescription: true,
      categoryId: true,
      publishedAt: true,
      createdAt: true,
      updatedAt: true
    }
  });

  if (!row) return null;
  return {
    ...row,
    type: row.type as 'PAGE' | 'NEWS' | 'ANNOUNCEMENT'
  };
}

export async function createContent(
  input: ContentCreateInput,
  authorId: string
): Promise<{ id: string; slug: string }> {
  const content = await prisma.content.create({
    data: {
      type: input.type,
      title: input.title,
      slug: input.slug,
      summary: input.summary || null,
      body: input.body,
      seoTitle: input.seoTitle || null,
      seoDescription: input.seoDescription || null,
      categoryId: input.categoryId || null,
      status: 'DRAFT',
      authorId
    },
    select: { id: true, slug: true }
  });
  return content;
}

export async function updateContent(
  id: string,
  input: Omit<ContentCreateInput, 'type'>
): Promise<{ id: string; slug: string }> {
  const content = await prisma.content.update({
    where: { id },
    data: {
      title: input.title,
      slug: input.slug,
      summary: input.summary || null,
      body: input.body,
      seoTitle: input.seoTitle || null,
      seoDescription: input.seoDescription || null,
      categoryId: input.categoryId || null
    },
    select: { id: true, slug: true }
  });
  return content;
}

export async function slugExists(
  slug: string,
  type: string,
  excludeId?: string
): Promise<boolean> {
  const existing = await prisma.content.findFirst({
    where: {
      slug,
      type,
      deletedAt: null,
      ...(excludeId ? { id: { not: excludeId } } : {})
    },
    select: { id: true }
  });
  return !!existing;
}

export async function findCategories(): Promise<{ id: string; name: string }[]> {
  return prisma.category.findMany({
    orderBy: { name: 'asc' },
    select: { id: true, name: true }
  });
}

export async function updateStatus(
  id: string,
  status: 'DRAFT' | 'IN_REVIEW' | 'PUBLISHED' | 'ARCHIVED'
): Promise<void> {
  const data: {
    status: string;
    publishedAt?: Date | null;
  } = { status };

  if (status === 'PUBLISHED') {
    data.publishedAt = new Date();
  }

  await prisma.content.update({
    where: { id },
    data
  });
}

export async function softDelete(id: string): Promise<void> {
  await prisma.content.update({
    where: { id },
    data: { deletedAt: new Date() }
  });
}

export async function hardDelete(id: string): Promise<void> {
  await prisma.content.delete({
    where: { id }
  });
}

export async function createRevision(
  contentId: string,
  snapshot: Record<string, unknown>,
  createdBy: string
): Promise<void> {
  await prisma.contentRevision.create({
    data: {
      contentId,
      snapshot: snapshot as never,
      createdBy
    }
  });
}

export async function findRevisions(contentId: string, limit = 20) {
  const rows = await prisma.contentRevision.findMany({
    where: { contentId },
    orderBy: { createdAt: 'desc' },
    take: limit,
    select: {
      id: true,
      createdAt: true,
      pinned: true,
      createdBy: true,
      author: { select: { name: true, email: true } }
    }
  });

  return rows.map((r) => ({
    id: r.id,
    createdAt: r.createdAt,
    pinned: r.pinned,
    authorName: r.author?.name ?? r.author?.email ?? null
  }));
}

export async function findRevisionSnapshot(revisionId: string) {
  return prisma.contentRevision.findUnique({
    where: { id: revisionId },
    select: {
      id: true,
      contentId: true,
      snapshot: true,
      createdAt: true
    }
  });
}

export async function findAuthorId(id: string): Promise<string | null> {
  const row = await prisma.content.findUnique({
    where: { id },
    select: { authorId: true }
  });
  return row?.authorId ?? null;
}