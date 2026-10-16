import Link from 'next/link';

import type { RecentAuditItem, RecentContentItem } from '@/features/dashboard/types';
import { formatDate, formatRelativeDate } from '@/lib/utils';

const STATUS_LABELS: Record<string, string> = {
  DRAFT: 'Nháp',
  IN_REVIEW: 'Chờ duyệt',
  PUBLISHED: 'Đã xuất bản',
  ARCHIVED: 'Lưu trữ'
};

const STATUS_TONES: Record<string, string> = {
  DRAFT: 'bg-neutral-100 text-neutral-700',
  IN_REVIEW: 'bg-warning/10 text-warning',
  PUBLISHED: 'bg-success/10 text-success',
  ARCHIVED: 'bg-neutral-100 text-neutral-500'
};

export function RecentContentList({ items }: { items: RecentContentItem[] }) {
  if (items.length === 0) {
    return (
      <p className="text-sm text-neutral-500">Chưa có nội dung nào.</p>
    );
  }

  return (
    <ul className="divide-y divide-neutral-100">
      {items.map((item) => (
        <li key={item.id} className="flex items-center justify-between gap-4 py-3">
          <div className="min-w-0 flex-1">
            <Link
              href={item.href}
              className="block truncate text-sm font-medium text-neutral-900 hover:text-primary-700"
            >
              {item.title}
            </Link>
            <p className="mt-0.5 text-xs text-neutral-500">
              Cập nhật {formatRelativeDate(item.updatedAt)}
            </p>
          </div>
          <span
            className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-medium ${STATUS_TONES[item.status] ?? ''}`}
          >
            {STATUS_LABELS[item.status] ?? item.status}
          </span>
        </li>
      ))}
    </ul>
  );
}

export function RecentAuditList({ items }: { items: RecentAuditItem[] }) {
  if (items.length === 0) {
    return <p className="text-sm text-neutral-500">Chưa có hoạt động nào.</p>;
  }

  return (
    <ul className="divide-y divide-neutral-100">
      {items.map((item) => (
        <li key={item.id} className="py-3">
          <p className="text-sm text-neutral-900">
            <span className="font-medium">{item.actorName ?? 'Hệ thống'}</span>{' '}
            <span className="text-neutral-600">{item.action}</span>{' '}
            <span className="text-neutral-500">({item.entityType})</span>
          </p>
          <p className="mt-0.5 text-xs text-neutral-500">
            {formatDate(item.createdAt)}
          </p>
        </li>
      ))}
    </ul>
  );
}