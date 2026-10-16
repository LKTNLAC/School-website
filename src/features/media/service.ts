import * as repository from './repository';
import type { MediaAlbumItem } from './types';
import type { MediaAlbumOption, MediaAssetListItem } from './types';

import { computeChecksum, validateFile } from '@/lib/file-validation';
import { putObject } from '@/lib/storage';


export async function getAllAlbums(): Promise<MediaAlbumItem[]> {
  return repository.findAllAlbums();
}

export async function getAssets(limit = 50): Promise<MediaAssetListItem[]> {
  return repository.findAssets(limit);
}

export async function getAlbumOptions(): Promise<MediaAlbumOption[]> {
  return repository.findAlbumOptions();
}

export async function uploadMedia(
  buffer: Buffer,
  fileName: string,
  mimeType: string,
  albumId: string | null
): Promise<{ id: string; url: string }> {
  const validation = validateFile(buffer, mimeType, fileName);
  if (!validation.ok) {
    throw new Error(validation.error);
  }

  const checksum = computeChecksum(buffer);
  const stored = await putObject({
    buffer,
    mimeType: validation.mimeType,
    extension: validation.extension,
    prefix: validation.category === 'image' ? 'images' : validation.category === 'video' ? 'videos' : 'documents'
  });

  const asset = await repository.createAsset({
    storageKey: stored.key,
    fileName,
    fileSize: stored.size,
    mimeType: validation.mimeType,
    checksum,
    albumId
  });

  return { id: asset.id, url: `/media/${stored.key}` };
}

export async function deleteAsset(id: string): Promise<void> {
  await repository.softDeleteAsset(id);
}

export async function getAssetById(id: string) {
  return repository.findAssetById(id);
}