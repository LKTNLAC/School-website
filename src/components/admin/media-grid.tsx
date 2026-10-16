'use client';

import { useRouter } from 'next/navigation';
import { useState, useTransition } from 'react';

import { deleteMediaAction } from '@/features/media/actions';
import type { MediaAssetListItem } from '@/features/media/types';
import { formatDate } from '@/lib/utils';

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function isImage(mimeType: string): boolean {
  return mimeType.startsWith('image/');
}

export function MediaGrid({ assets }: { assets: MediaAssetListItem[] }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function handleDelete(id: string, fileName: string) {
    if (!confirm(`Xóa file "${fileName}"? File sẽ không hiển thị nữa.`)) return;
    setError(null);
    startTransition(async () => {
      const result = await deleteMediaAction(id);
      if (result.ok) {
        router.refresh();
      } else {
        setError(result.error);
      }
    });
  }

  if (assets.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-neutral-300 bg-neutral-50 p-12 text-center">
        <p className="text-sm text-neutral-600">Chưa có file nào. Upload file đầu tiên.</p>
      </div>
    );
  }

  return (
    <div>
      {error ? (
        <div
          role="alert"
          className="mb-4 rounded-md border border-error/30 bg-error/5 p-3 text-sm text-error"
        >
          {error}
        </div>
      ) : null}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {assets.map((asset) => (
          <div
            key={asset.id}
            className="overflow-hidden rounded-lg border border-neutral-200 bg-white"
          >
            <div className="flex aspect-video items-center justify-center bg-neutral-100">
              {isImage(asset.mimeType) ? (
                
                <img
                  src={asset.url}
                  alt={asset.fileName}
                  className="h-full w-full object-cover"
                  loading="lazy"
                />
              ) : (
                <svg
                  aria-hidden="true"
                  viewBox="0 0 24 24"
                  className="h-12 w-12 text-neutral-400"
                  fill="none"
                >
                  <path
                    d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6z"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                </svg>
              )}
            </div>

            <div className="p-3">
              <p className="truncate text-sm font-medium text-neutral-900" title={asset.fileName}>
                {asset.fileName}
              </p>
              <p className="mt-1 text-xs text-neutral-500">
                {formatFileSize(asset.fileSize)} • {formatDate(asset.createdAt)}
              </p>
              {asset.albumName ? (
                <p className="mt-0.5 text-xs text-neutral-500">Album: {asset.albumName}</p>
              ) : null}

              <div className="mt-3 flex items-center justify-between gap-2">
                <a
                  href={asset.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-medium text-primary-600 hover:text-primary-700"
                >
                  Mở
                </a>
                <button
                  type="button"
                  onClick={() => handleDelete(asset.id, asset.fileName)}
                  disabled={isPending}
                  className="text-xs font-medium text-error hover:underline disabled:opacity-50"
                >
                  Xóa
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}