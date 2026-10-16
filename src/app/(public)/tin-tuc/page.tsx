import type { Metadata } from 'next';

import { ContentListItem } from '@/components/public/content-list-item';
import { EmptyState } from '@/components/public/empty-state';
import { PageHeader } from '@/components/public/page-header';
import { Pagination } from '@/components/public/pagination';
import { getNewsList } from '@/features/news/service';
import { buildMetadata } from '@/lib/seo';

export const metadata: Metadata = buildMetadata({
  title: 'Tin tức',
  description: 'Tin tức mới nhất từ nhà trường.',
  path: '/tin-tuc'
});

type Props = {
  searchParams: Promise<{ page?: string }>;
};

export default async function NewsPage({ searchParams }: Props) {
  const sp = await searchParams;
  const page = Math.max(1, parseInt(sp.page ?? '1', 10) || 1);
  const result = await getNewsList(page, 9);

  return (
    <>
      <PageHeader
        title="Tin tức"
        description="Tin tức mới nhất từ nhà trường."
        breadcrumbs={[{ label: 'Tin tức' }]}
      />

      <div className="mx-auto max-w-4xl px-4 py-12">
        {result.items.length === 0 ? (
          <EmptyState
            title="Chưa có tin tức"
            description="Tin tức sẽ được cập nhật."
          />
        ) : (
          <>
            <div>
              {result.items.map((item) => (
                <ContentListItem
                  key={item.id}
                  href={`/tin-tuc/${item.slug}`}
                  title={item.title}
                  summary={item.summary}
                  publishedAt={item.publishedAt}
                  categoryName={item.category?.name ?? null}
                />
              ))}
            </div>
            <Pagination
              currentPage={result.page}
              totalPages={result.totalPages}
              basePath="/tin-tuc"
            />
          </>
        )}
      </div>
    </>
  );
}