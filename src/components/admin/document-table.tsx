import Link from 'next/link';

import { ContentStatusBadge } from './content-status-badge';

import type { AdminDocumentListItem } from '@/features/documents/types';
import { formatRelativeDate } from '@/lib/utils';


function formatFileSize(bytes: number | null): string {
  if (!bytes) return '—';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function DocumentTable({ items }: { items: AdminDocumentListItem[] }) {
  if (items.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-neutral-300 bg-neutral-50 p-12 text-center">
        <p className="text-sm text-neutral-600">Chưa có tài liệu nào.</p>
        <Link
          href="/admin/tai-lieu/moi"
          className="mt-4 inline-flex h-10 items-center rounded-md bg-primary-600 px-4 text-sm font-medium text-white hover:bg-primary-700"
        >
          Tạo tài liệu mới
        </Link>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-lg border border-neutral-200 bg-white">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="border-b border-neutral-200 bg-neutral-50 text-left">
            <tr>
              <th className="px-4 py-3 font-medium text-neutral-700">Tiêu đề</th>
              <th className="px-4 py-3 font-medium text-neutral-700">Trạng thái</th>
              <th className="px-4 py-3 font-medium text-neutral-700">File hiện tại</th>
              <th className="px-4 py-3 font-medium text-neutral-700">Số revision</th>
              <th className="px-4 py-3 font-medium text-neutral-700">Cập nhật</th>
              <th className="px-4 py-3 text-right font-medium text-neutral-700">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-100">
            {items.map((doc) => (
              <tr key={doc.id} className="hover:bg-neutral-50">
                <td className="px-4 py-3">
                  <p className="font-medium text-neutral-900 line-clamp-1">{doc.title}</p>
                  <p className="mt-0.5 text-xs text-neutral-500">/{doc.slug}</p>
                </td>
                <td className="px-4 py-3">
                  <ContentStatusBadge status={doc.status} />
                </td>
                <td className="px-4 py-3 text-neutral-600">
                  {doc.currentFileName ? (
                    <span className="text-xs">
                      {doc.currentFileName}
                      <br />
                      <span className="text-neutral-500">
                        {formatFileSize(doc.currentFileSize)}
                      </span>
                    </span>
                  ) : (
                    <span className="text-xs text-warning">Chưa upload</span>
                  )}
                </td>
                <td className="px-4 py-3 text-neutral-600">{doc.revisionCount}</td>
                <td className="px-4 py-3 text-neutral-600">
                  {formatRelativeDate(doc.updatedAt)}
                </td>
                <td className="px-4 py-3 text-right">
                  <Link
                    href={`/admin/tai-lieu/${doc.id}`}
                    className="text-sm font-medium text-primary-600 hover:text-primary-700"
                  >
                    Quản lý
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}