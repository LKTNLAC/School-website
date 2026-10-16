
import type { DocumentDetail, DocumentListItem } from './types';
import type {
  AdminDocumentDetail,
  AdminDocumentListItem,
  DocumentRevisionListItem
} from './types';

import { prisma } from '@/lib/db';

export async function findPublished(): Promise<DocumentListItem[]> {
  const rows = await prisma.document.findMany({
    where: { status: 'PUBLISHED', deletedAt: null },
    orderBy: { title: 'asc' },
    select: {
      id: true,
      slug: true,
      title: true,
      currentRevision: {
        select: {
          fileName: true,
          fileSize: true,
          mimeType: true
        }
      }
    }
  });

  return rows.map((d) => ({
    id: d.id,
    slug: d.slug,
    title: d.title,
    fileName: d.currentRevision?.fileName ?? null,
    fileSize: d.currentRevision?.fileSize ?? null,
    mimeType: d.currentRevision?.mimeType ?? null
  }));
}

export async function findBySlug(slug: string): Promise<DocumentDetail | null> {
  const d = await prisma.document.findFirst({
    where: { slug, status: 'PUBLISHED', deletedAt: null },
    select: {
      id: true,
      slug: true,
      title: true,
      currentRevision: {
        select: {
          fileName: true,
          fileSize: true,
          mimeType: true,
          storageKey: true
        }
      }
    }
  });

  if (!d) return null;

  return {
    id: d.id,
    slug: d.slug,
    title: d.title,
    fileName: d.currentRevision?.fileName ?? null,
    fileSize: d.currentRevision?.fileSize ?? null,
    mimeType: d.currentRevision?.mimeType ?? null,
    storageKey: d.currentRevision?.storageKey ?? null
  };
}

export async function findAdminList(): Promise<AdminDocumentListItem[]> {
  const rows = await prisma.document.findMany({
    where: { deletedAt: null },
    orderBy: { updatedAt: 'desc' },
    select: {
      id: true,
      slug: true,
      title: true,
      status: true,
      updatedAt: true,
      currentRevision: {
        select: { fileName: true, fileSize: true }
      },
      _count: { select: { revisions: true } }
    }
  });

  return rows.map((r) => ({
    id: r.id,
    slug: r.slug,
    title: r.title,
    status: r.status,
    revisionCount: r._count.revisions,
    currentFileName: r.currentRevision?.fileName ?? null,
    currentFileSize: r.currentRevision?.fileSize ?? null,
    updatedAt: r.updatedAt
  }));
}

export async function findAdminById(id: string): Promise<AdminDocumentDetail | null> {
  const row = await prisma.document.findFirst({
    where: { id, deletedAt: null },
    select: {
      id: true,
      slug: true,
      title: true,
      status: true,
      createdAt: true,
      updatedAt: true,
      currentRevision: {
        select: {
          id: true,
          storageKey: true,
          fileName: true,
          fileSize: true,
          mimeType: true,
          checksum: true,
          createdAt: true,
          pinned: true
        }
      }
    }
  });

  return row;
}

export async function createDocument(input: {
  title: string;
  slug: string;
  status: string;
}): Promise<{ id: string; slug: string }> {
  return prisma.document.create({
    data: {
      title: input.title,
      slug: input.slug,
      status: input.status
    },
    select: { id: true, slug: true }
  });
}

export async function updateDocumentMeta(
  id: string,
  input: { title: string; slug: string; status: string }
): Promise<{ id: string; slug: string }> {
  return prisma.document.update({
    where: { id },
    data: {
      title: input.title,
      slug: input.slug,
      status: input.status
    },
    select: { id: true, slug: true }
  });
}

export async function createDocumentRevision(data: {
  documentId: string;
  storageKey: string;
  fileName: string;
  fileSize: number;
  mimeType: string;
  checksum: string;
  createdBy: string;
}): Promise<{ id: string }> {
  const revision = await prisma.documentRevision.create({
    data: {
      documentId: data.documentId,
      storageKey: data.storageKey,
      fileName: data.fileName,
      fileSize: data.fileSize,
      mimeType: data.mimeType,
      checksum: data.checksum,
      snapshot: { createdFrom: 'admin-upload' } as never,
      createdBy: data.createdBy
    },
    select: { id: true }
  });

  // Cập nhật currentRevisionId
  await prisma.document.update({
    where: { id: data.documentId },
    data: { currentRevisionId: revision.id }
  });

  return revision;
}

export async function findDocumentRevisions(
  documentId: string
): Promise<DocumentRevisionListItem[]> {
  const rows = await prisma.documentRevision.findMany({
    where: { documentId },
    orderBy: { createdAt: 'desc' },
    take: 50,
    select: {
      id: true,
      fileName: true,
      fileSize: true,
      createdAt: true,
      pinned: true,
      author: { select: { name: true, email: true } }
    }
  });

  const doc = await prisma.document.findUnique({
    where: { id: documentId },
    select: { currentRevisionId: true }
  });

  return rows.map((r) => ({
    id: r.id,
    fileName: r.fileName,
    fileSize: r.fileSize,
    createdAt: r.createdAt,
    pinned: r.pinned,
    authorName: r.author?.name ?? r.author?.email ?? null,
    isCurrent: r.id === doc?.currentRevisionId
  }));
}

export async function softDeleteDocument(id: string): Promise<void> {
  await prisma.document.update({
    where: { id },
    data: { deletedAt: new Date() }
  });
}

export async function slugExists(slug: string, excludeId?: string): Promise<boolean> {
  const existing = await prisma.document.findFirst({
    where: {
      slug,
      deletedAt: null,
      ...(excludeId ? { id: { not: excludeId } } : {})
    },
    select: { id: true }
  });
  return !!existing;
}