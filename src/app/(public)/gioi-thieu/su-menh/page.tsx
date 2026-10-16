import type { Metadata } from 'next';

import { EmptyState } from '@/components/public/empty-state';
import { PageHeader } from '@/components/public/page-header';
import { Prose } from '@/components/public/prose';
import { getPageBySlug } from '@/features/content/service';
import { buildMetadata } from '@/lib/seo';

export const metadata: Metadata = buildMetadata({
  title: 'Sứ mệnh - Tầm nhìn',
  description: 'Sứ mệnh, tầm nhìn và giá trị cốt lõi của nhà trường.',
  path: '/gioi-thieu/su-menh'
});

export default async function MissionPage() {
  const page = await getPageBySlug('su-menh');

  return (
    <>
      <PageHeader
        title={page?.title ?? 'Sứ mệnh - Tầm nhìn'}
        breadcrumbs={[
          { label: 'Giới thiệu', href: '/gioi-thieu' },
          { label: 'Sứ mệnh - Tầm nhìn' }
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