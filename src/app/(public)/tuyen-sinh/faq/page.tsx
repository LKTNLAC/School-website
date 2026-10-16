import type { Metadata } from 'next';

import { EmptyState } from '@/components/public/empty-state';
import { FaqAccordion } from '@/components/public/faq-accordion';
import { PageHeader } from '@/components/public/page-header';
import { getPublishedFaqs } from '@/features/faq/service';
import { buildMetadata } from '@/lib/seo';

export const metadata: Metadata = buildMetadata({
  title: 'Câu hỏi thường gặp',
  description: 'Giải đáp các câu hỏi thường gặp về tuyển sinh và nhà trường.',
  path: '/tuyen-sinh/faq'
});

export default async function FaqPage() {
  const faqs = await getPublishedFaqs();

  return (
    <>
      <PageHeader
        title="Câu hỏi thường gặp"
        description="Giải đáp các thắc mắc phổ biến về tuyển sinh và nhà trường."
        breadcrumbs={[
          { label: 'Tuyển sinh', href: '/tuyen-sinh' },
          { label: 'FAQ' }
        ]}
      />

      <div className="mx-auto max-w-7xl px-4 py-12">
        <div className="max-w-3xl">
          {faqs.length === 0 ? (
            <EmptyState
              title="Chưa có câu hỏi"
              description="Câu hỏi thường gặp sẽ được cập nhật."
            />
          ) : (
            <FaqAccordion items={faqs} />
          )}
        </div>
      </div>
    </>
  );
}