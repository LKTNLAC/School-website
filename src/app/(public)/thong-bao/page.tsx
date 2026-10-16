import type { Metadata } from 'next';

import { ContentListItem } from '@/components/public/content-list-item';
import { EmptyState } from '@/components/public/empty-state';
import { PageHeader } from '@/components/public/page-header';
import { Pagination } from '@/components/public/pagination';
import { getAnnouncementList } from '@/features/content/service';
import { buildMetadata } from '@/lib/seo';

export const metadata: Metadata = buildMetadata({
  title: 'Thông báo',
  description: 'Thông báo mới nhất từ nhà trường.',
  path: '/thong-bao'
});

type Props = {
  searchParams: Promise<{ page?: string }>;
};

export default async function AnnouncementsPage({ searchParams }: Props) {
  const sp = await searchParams;
  const page = Math.max(1, parseInt(sp.page ?? '1', 10) || 1);
  const result = await getAnnouncementList(page, 9);

  return (
    <>
      <PageHeader
        title="Thông báo"
        description="Thông báo mới nhất từ nhà trường."
        breadcrumbs={[{ label: 'Thông báo' }]}
      />

      <div className="mx-auto max-w-4xl px-4 py-12">
        {result.items.length === 0 ? (
          <EmptyState
            title="Chưa có thông báo"
            description="Thông báo sẽ được cập nhật."
          />
        ) : (
          <>
            <div>
              {result.items.map((item) => (
                <ContentListItem
                  key={item.id}
                  href={`/thong-bao/${item.slug}`}
                  title={item.title}
                  summary={item.summary}
                  publishedAt={item.publishedAt}
                />
              ))}
            </div>
            <Pagination
              currentPage={result.page}
              totalPages={result.totalPages}
              basePath="/thong-bao"
            />
          </>
        )}
      </div>
    </>
  );
}