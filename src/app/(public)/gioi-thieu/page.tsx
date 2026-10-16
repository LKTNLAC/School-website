import type { Metadata } from 'next';

import { EmptyState } from '@/components/public/empty-state';
import { PageHeader } from '@/components/public/page-header';
import { Prose } from '@/components/public/prose';
import { getPageBySlug } from '@/features/content/service';
import { buildMetadata } from '@/lib/seo';

export const metadata: Metadata = buildMetadata({
  title: 'Giới thiệu',
  description: 'Giới thiệu tổng quan về nhà trường.',
  path: '/gioi-thieu'
});

export default async function AboutPage() {
  const page = await getPageBySlug('gioi-thieu');

  return (
    <>
      <PageHeader
        title={page?.title ?? 'Giới thiệu nhà trường'}
        description={page?.summary ?? undefined}
        breadcrumbs={[{ label: 'Giới thiệu' }]}
      />

      <div className="mx-auto max-w-7xl px-4 py-12">
        {page?.body ? (
          <Prose content={page.body} />
        ) : (
          <EmptyState
            title="Chưa có nội dung"
            description="Nội dung trang giới thiệu sẽ được cập nhật."
          />
        )}
      </div>
    </>
  );
}