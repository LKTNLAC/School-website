import type { Metadata } from 'next';
import Link from 'next/link';
import { Suspense } from 'react';

import { AdminPageHeader } from '@/components/admin/admin-page-header';
import { ContentFilter } from '@/components/admin/content-filter';
import { ContentTable } from '@/components/admin/content-table';
import { getAdminContentList } from '@/features/content/service';
import { buildMetadata } from '@/lib/seo';

export const metadata: Metadata = buildMetadata({
  title: 'Quản lý nội dung',
  noIndex: true
});

type Props = {
  searchParams: Promise<{
    type?: string;
    status?: string;
    q?: string;
    page?: string;
  }>;
};

export default async function AdminContentListPage({ searchParams }: Props) {
  const sp = await searchParams;

  const result = await getAdminContentList({
    type: sp.type as 'PAGE' | 'NEWS' | 'ANNOUNCEMENT' | undefined,
    status: sp.status as 'DRAFT' | 'IN_REVIEW' | 'PUBLISHED' | 'ARCHIVED' | undefined,
    search: sp.q,
    page: Math.max(1, parseInt(sp.page ?? '1', 10) || 1),
    pageSize: 20
  });

  return (
    <div>
      <AdminPageHeader
        title="Quản lý nội dung"
        description={`Tổng ${result.total} nội dung.`}
        breadcrumbs={[{ label: 'Nội dung' }]}
        actions={
          <Link
            href="/admin/noi-dung/moi"
            className="inline-flex h-10 items-center rounded-md bg-primary-600 px-4 text-sm font-medium text-white hover:bg-primary-700"
          >
            + Tạo mới
          </Link>
        }
      />

      <div className="mb-4 rounded-lg border border-neutral-200 bg-white p-4">
        <Suspense fallback={<div className="h-10" />}>
          <ContentFilter />
        </Suspense>
      </div>

      <ContentTable items={result.items} />

      {result.totalPages > 1 ? (
        <div className="mt-6 flex items-center justify-between text-sm text-neutral-600">
          <p>
            Trang {result.page} / {result.totalPages}
          </p>
          <div className="flex gap-2">
            {result.page > 1 ? (
              <Link
                href={`/admin/noi-dung?page=${result.page - 1}`}
                className="rounded-md border border-neutral-300 px-3 py-1.5 hover:bg-neutral-50"
              >
                ← Trước
              </Link>
            ) : null}
            {result.page < result.totalPages ? (
              <Link
                href={`/admin/noi-dung?page=${result.page + 1}`}
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