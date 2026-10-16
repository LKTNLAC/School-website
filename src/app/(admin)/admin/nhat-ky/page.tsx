import type { Metadata } from 'next';
import Link from 'next/link';
import { Suspense } from 'react';

import { AdminPageHeader } from '@/components/admin/admin-page-header';
import { AuditFilter } from '@/components/admin/audit-filter';
import { AuditTable } from '@/components/admin/audit-table';
import {
  getAuditLogs,
  getDistinctActions,
  getDistinctEntityTypes
} from '@/features/audit/service';
import { requireAuth } from '@/lib/auth-guard';
import { buildMetadata } from '@/lib/seo';

export const metadata: Metadata = buildMetadata({
  title: 'Nhật ký hoạt động',
  noIndex: true
});

type Props = {
  searchParams: Promise<{
    action?: string;
    entityType?: string;
    page?: string;
  }>;
};

export default async function AdminAuditPage({ searchParams }: Props) {
  const [user, sp] = await Promise.all([requireAuth(), searchParams]);

  const [result, actions, entityTypes] = await Promise.all([
    getAuditLogs(
      {
        action: sp.action,
        entityType: sp.entityType,
        page: Math.max(1, parseInt(sp.page ?? '1', 10) || 1),
        pageSize: 30
      },
      user.role
    ),
    getDistinctActions(),
    getDistinctEntityTypes()
  ]);

  const showDetail = user.role === 'ADMIN' || user.role === 'EDITOR';

  return (
    <div>
      <AdminPageHeader
        title="Nhật ký hoạt động"
        description={`Tổng ${result.total} bản ghi.`}
        breadcrumbs={[{ label: 'Nhật ký' }]}
      />

      {user.role === 'VIEWER' ? (
        <div className="mb-4 rounded-md border border-info/30 bg-info/5 p-3 text-sm text-info">
          Bạn đang xem phiên bản rút gọn. Chi tiết metadata và một số hành động nhạy
          cảm không hiển thị với vai trò Người xem.
        </div>
      ) : null}

      <div className="mb-4 rounded-lg border border-neutral-200 bg-white p-4">
        <Suspense fallback={<div className="h-10" />}>
          <AuditFilter actions={actions} entityTypes={entityTypes} />
        </Suspense>
      </div>

      <AuditTable items={result.items} showDetail={showDetail} />

      {result.totalPages > 1 ? (
        <div className="mt-6 flex items-center justify-between text-sm text-neutral-600">
          <p>
            Trang {result.page} / {result.totalPages}
          </p>
          <div className="flex gap-2">
            {result.page > 1 ? (
              <Link
                href={`/admin/nhat-ky?page=${result.page - 1}`}
                className="rounded-md border border-neutral-300 px-3 py-1.5 hover:bg-neutral-50"
              >
                ← Trước
              </Link>
            ) : null}
            {result.page < result.totalPages ? (
              <Link
                href={`/admin/nhat-ky?page=${result.page + 1}`}
                className="rounded-md border border-neutral-300 px-3 py-1.5 hover:bg-neutral-50"
              >
                Sau →
              </Link>
            ) : null}
          </div>
        </div>
      ) : null}
    </div>
  );
}