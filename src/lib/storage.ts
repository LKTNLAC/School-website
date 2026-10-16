import { randomUUID } from 'node:crypto';
import { mkdir, writeFile, readFile, unlink } from 'node:fs/promises';
import path from 'node:path';

import { logger } from '@/lib/logger';

const STORAGE_ROOT = path.resolve(
  /* turbopackIgnore: true */
  process.env.STORAGE_LOCAL_PATH ?? './storage'
);

export type StoredObject = {
  key: string;
  size: number;
  mimeType: string;
};

export async function putObject(params: {
  buffer: Buffer;
  mimeType: string;
  extension: string;
  prefix: string;
}): Promise<StoredObject> {
  const key = `${params.prefix}/${randomUUID()}.${params.extension}`;
  const fullPath = path.join(/* turbopackIgnore: true */ STORAGE_ROOT, key);
  await mkdir(path.dirname(fullPath), { recursive: true });
  await writeFile(fullPath, params.buffer);
  logger.info('Đã lưu object', { key, size: params.buffer.length });
  return { key, size: params.buffer.length, mimeType: params.mimeType };
}

export async function getObject(key: string): Promise<Buffer> {
  return readFile(/* turbopackIgnore: true */ path.join(STORAGE_ROOT, key));
}

export async function deleteObject(key: string): Promise<void> {
  try {
    await unlink(/* turbopackIgnore: true */ path.join(STORAGE_ROOT, key));
  } catch (err) {
    logger.warn('Xóa object thất bại', {
      key,
      error: err instanceof Error ? err.message : 'unknown'
    });
  }
}

export function publicUrl(key: string): string {
  const base = process.env.STORAGE_PUBLIC_URL ?? '/media';
  return `${base}/${key}`;
}