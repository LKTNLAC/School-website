import type { Metadata } from 'next';
import Link from 'next/link';

import { AdmissionCard } from '@/components/public/admission-card';
import { EmptyState } from '@/components/public/empty-state';
import { PageHeader } from '@/components/public/page-header';
import { getPublishedAdmissions } from '@/features/admissions/service';
import { buildMetadata } from '@/lib/seo';

export const metadata: Metadata = buildMetadata({
  title: 'Tuyển sinh',
  description: 'Thông tin tuyển sinh, điều kiện, quy trình và hồ sơ dự tuyển.',
  path: '/tuyen-sinh'
});

export default async function AdmissionsPage() {
  const admissions = await getPublishedAdmissions();

  return (
    <>
      <PageHeader
        title="Tuyển sinh"
        description="Thông tin tuyển sinh, điều kiện, quy trình và hồ sơ dự tuyển."
        breadcrumbs={[{ label: 'Tuyển sinh' }]}
      />

      <div className="mx-auto max-w-7xl px-4 py-12">
        <div className="mb-8 rounded-lg border border-primary-200 bg-primary-50 p-6">
          <h2 className="text-lg font-semibold text-primary-900">
            Câu hỏi thường gặp
          </h2>
          <p className="mt-2 text-sm text-primary-800">
            Xem giải đáp các thắc mắc phổ biến về tuyển sinh.
          </p>
          <Link
            href="/tuyen-sinh/faq"
            className="mt-4 inline-flex h-10 items-center rounded-md bg-primary-600 px-4 text-sm font-medium text-white hover:bg-primary-700"
          >
            Xem FAQ
          </Link>
        </div>

        {admissions.length === 0 ? (
          <EmptyState
            title="Chưa có thông tin tuyển sinh"
            description="Thông tin tuyển sinh sẽ được cập nhật."
          />
        ) : (
          <div className="space-y-8">
            {admissions.map((a) => (
              <AdmissionCard
                key={a.id}
                schoolYear={a.schoolYear}
                title={a.title}
                body={a.body}
              />
            ))}
          </div>
        )}
      </div>
    </>
  );
}