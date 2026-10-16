import type { Metadata } from 'next';
import { Suspense } from 'react';

import { EmptyState } from '@/components/public/empty-state';
import { PageHeader } from '@/components/public/page-header';
import { Pagination } from '@/components/public/pagination';
import { SearchBox } from '@/components/public/search-box';
import { SearchResultItem } from '@/components/public/search-result-item';
import { search } from '@/features/search/service';
import { buildMetadata } from '@/lib/seo';

export const metadata: Metadata = buildMetadata({
  title: 'Tìm kiếm',
  description: 'Tìm kiếm nội dung trên website nhà trường.',
  path: '/tim-kiem',
  noIndex: true
});

type Props = {
  searchParams: Promise<{ q?: string; page?: string }>;
};

export default async function SearchPage({ searchParams }: Props) {
  const sp = await searchParams;
  const query = (sp.q ?? '').trim();
  const page = Math.max(1, parseInt(sp.page ?? '1', 10) || 1);

  const result = query.length >= 2 ? await search(query, page, 10) : null;

  return (
    <>
      <PageHeader
        title="Tìm kiếm"
        description="Tìm kiếm tin tức, thông báo, sự kiện và tài liệu."
        breadcrumbs={[{ label: 'Tìm kiếm' }]}
      />

      <div className="mx-auto max-w-4xl px-4 py-12">
        <Suspense fallback={<div className="h-11 rounded-md bg-neutral-100" />}>
          <SearchBox />
        </Suspense>

        {!query ? (
          <p className="mt-8 text-sm text-neutral-600">
            Nhập ít nhất 2 ký tự để bắt đầu tìm kiếm.
          </p>
        ) : null}

        {query.length > 0 && query.length < 2 ? (
          <p className="mt-8 text-sm text-neutral-600">
            Từ khóa quá ngắn. Vui lòng nhập ít nhất 2 ký tự.
          </p>
        ) : null}

        {result ? (
          <div className="mt-8">
            <p className="text-sm text-neutral-600">
              {result.total === 0
                ? `Không tìm thấy kết quả cho "${result.query}".`
                : `Tìm thấy ${result.total} kết quả cho "${result.query}".`}
            </p>

            {result.results.length > 0 ? (
              <>
                <div className="mt-4">
                  {result.results.map((r) => (
                    <SearchResultItem key={`${r.type}-${r.id}`} result={r} />
                  ))}
                </div>
                <Pagination
                  currentPage={result.page}
                  totalPages={result.totalPages}
                  basePath="/tim-kiem"
                  searchParams={{ q: result.query }}
                />
              </>
            ) : (
              <div className="mt-6">
                <EmptyState
                  title="Không có kết quả"
                  description="Thử từ khóa khác hoặc kiểm tra chính tả."
                />
              </div>
            )}
          </div>
        ) : null}
      </div>
    </>
  );
}