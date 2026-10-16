import Link from 'next/link';

import { ContentStatusBadge } from './content-status-badge';

import type { AdminContentListItem } from '@/features/content/types';
import { formatRelativeDate } from '@/lib/utils';


const TYPE_LABELS: Record<string, string> = {
  PAGE: 'Trang',
  NEWS: 'Tin tức',
  ANNOUNCEMENT: 'Thông báo'
};

export function ContentTable({ items }: { items: AdminContentListItem[] }) {
  if (items.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-neutral-300 bg-neutral-50 p-12 text-center">
        <p className="text-sm text-neutral-600">
          Không có nội dung nào khớp với bộ lọc.
        </p>
        <Link
          href="/admin/noi-dung/moi"
          className="mt-4 inline-flex h-10 items-center rounded-md bg-primary-600 px-4 text-sm font-medium text-white hover:bg-primary-700"
        >
          Tạo nội dung mới
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
              <th className="px-4 py-3 font-medium text-neutral-700">Loại</th>
              <th className="px-4 py-3 font-medium text-neutral-700">Trạng thái</th>
              <th className="px-4 py-3 font-medium text-neutral-700">Cập nhật</th>
              <th className="px-4 py-3 text-right font-medium text-neutral-700">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-100">
            {items.map((item) => (
              <tr key={item.id} className="hover:bg-neutral-50">
                <td className="px-4 py-3">
                  <div>
                    <p className="font-medium text-neutral-900 line-clamp-1">
                      {item.title}
                    </p>
                    <p className="mt-0.5 text-xs text-neutral-500">/{item.slug}</p>
                  </div>
                </td>
                <td className="px-4 py-3 text-neutral-700">
                  {TYPE_LABELS[item.type] ?? item.type}
                </td>
                <td className="px-4 py-3">
                  <ContentStatusBadge status={item.status} />
                </td>
                <td className="px-4 py-3 text-neutral-600">
                  {formatRelativeDate(item.updatedAt)}
                </td>
                <td className="px-4 py-3 text-right">
                  <Link
                    href={`/admin/noi-dung/${item.id}`}
                    className="text-sm font-medium text-primary-600 hover:text-primary-700"
                  >
                    Sửa
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