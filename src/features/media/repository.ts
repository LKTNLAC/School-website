
import type { MediaAlbumItem } from './types';
import type { MediaAlbumOption, MediaAssetListItem } from './types';

import { prisma } from '@/lib/db';

export async function findAllAlbums(): Promise<MediaAlbumItem[]> {
  const albums = await prisma.mediaAlbum.findMany({
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      slug: true,
      name: true,
      assets: {
        take: 1,
        orderBy: { createdAt: 'desc' },
        select: { storageKey: true }
      },
      _count: { select: { assets: true } }
    }
  });

  return albums.map((a) => ({
    id: a.id,
    slug: a.slug,
    name: a.name,
    assetCount: a._count.assets,
    coverUrl: a.assets[0]?.storageKey ? `/media/${a.assets[0].storageKey}` : null
  }));
}

export async function findAssets(limit = 50): Promise<MediaAssetListItem[]> {
  const rows = await prisma.mediaAsset.findMany({
    where: { deletedAt: null },
    orderBy: { createdAt: 'desc' },
    take: limit,
    select: {
      id: true,
      storageKey: true,
      fileName: true,
      fileSize: true,
      mimeType: true,
      createdAt: true,
      album: { select: { name: true } }
    }
  });

  return rows.map((r) => ({
    id: r.id,
    storageKey: r.storageKey,
    fileName: r.fileName,
    fileSize: r.fileSize,
    mimeType: r.mimeType,
    url: `/media/${r.storageKey}`,
    createdAt: r.createdAt,
    albumName: r.album?.name ?? null
  }));
}

export async function findAlbumOptions(): Promise<MediaAlbumOption[]> {
  return prisma.mediaAlbum.findMany({
    orderBy: { name: 'asc' },
    select: { id: true, name: true }
  });
}

export async function createAsset(data: {
  storageKey: string;
  fileName: string;
  fileSize: number;
  mimeType: string;
  checksum: string;
  albumId: string | null;
}): Promise<{ id: string }> {
  const asset = await prisma.mediaAsset.create({
    data,
    select: { id: true }
  });
  return asset;
}

export async function softDeleteAsset(id: string): Promise<void> {
  await prisma.mediaAsset.update({
    where: { id },
    data: { deletedAt: new Date() }
  });
}

export async function findAssetById(id: string) {
  return prisma.mediaAsset.findFirst({
    where: { id, deletedAt: null },
    select: {
      id: true,
      storageKey: true,
      fileName: true,
      fileSize: true,
      mimeType: true,
      createdAt: true,
      album: { select: { name: true } }
    }
  });
}