import { readFile } from 'node:fs/promises';
import path from 'node:path';

import { NextResponse } from 'next/server';

const STORAGE_ROOT = path.resolve(
  /* turbopackIgnore: true */
  process.env.STORAGE_LOCAL_PATH ?? './storage'
);

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const { path: pathParts } = await params;
  const relativePath = pathParts.join('/');

  const normalized = path.normalize(relativePath).replace(/^(\.\.(\/|\\|$))+/, '');
  if (normalized.includes('..')) {
    return new NextResponse('Forbidden', { status: 403 });
  }

  const fullPath = path.join(/* turbopackIgnore: true */ STORAGE_ROOT, normalized);

  if (!fullPath.startsWith(STORAGE_ROOT)) {
    return new NextResponse('Forbidden', { status: 403 });
  }

  try {
    const buffer = await readFile(/* turbopackIgnore: true */ fullPath);

    const ext = path.extname(fullPath).toLowerCase();
    const mimeMap: Record<string, string> = {
      '.jpg': 'image/jpeg',
      '.jpeg': 'image/jpeg',
      '.png': 'image/png',
      '.webp': 'image/webp',
      '.pdf': 'application/pdf',
      '.mp4': 'video/mp4',
      '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      '.xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    };

    const mimeType = mimeMap[ext] ?? 'application/octet-stream';

    return new NextResponse(buffer, {
      status: 200,
      headers: {
        'Content-Type': mimeType,
        'Cache-Control': 'public, max-age=31536000, immutable'
      }
    });
  } catch {
    return new NextResponse('Not found', { status: 404 });
  }
}