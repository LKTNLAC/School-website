import type { Metadata } from 'next';

import { EmptyState } from '@/components/public/empty-state';
import { PageHeader } from '@/components/public/page-header';
import { Prose } from '@/components/public/prose';
import { getPageBySlug } from '@/features/content/service';
import { buildMetadata } from '@/lib/seo';

export const metadata: Metadata = buildMetadata({
  title: 'Lịch sử hình thành',
  description: 'Lịch sử hình thành và phát triển của nhà trường.',
  path: '/gioi-thieu/lich-su'
});

export default async function HistoryPage() {
  const page = await getPageBySlug('lich-su');

  return (
    <>
      <PageHeader
        title={page?.title ?? 'Lịch sử hình thành'}
        breadcrumbs={[
          { label: 'Giới thiệu', href: '/gioi-thieu' },
          { label: 'Lịch sử' }
        ]}
      />

      <div className="mx-auto max-w-7xl px-4 py-12">
        {page?.body ? (
          <Prose content={page.body} />
        ) : (
          <EmptyState
            title="Chưa có nội dung"
            description="Nội dung sẽ được cập nhật."
          />
        )}
      </div>
    </>
  );
}