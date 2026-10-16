import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { PageHeader } from '@/components/public/page-header';
import { getDocumentBySlug } from '@/features/documents/service';
import { buildMetadata } from '@/lib/seo';

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const doc = await getDocumentBySlug(slug);
  if (!doc) {
    return buildMetadata({ title: 'Không tìm thấy', noIndex: true });
  }
  return buildMetadata({
    title: doc.title,
    path: `/tai-nguyen/${doc.slug}`
  });
}

function formatFileSize(bytes: number | null): string {
  if (!bytes) return 'Không rõ';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default async function DocumentDetailPage({ params }: Props) {
  const { slug } = await params;
  const doc = await getDocumentBySlug(slug);

  if (!doc) notFound();

  return (
    <>
      <PageHeader
        title={doc.title}
        breadcrumbs={[
          { label: 'Tài nguyên', href: '/tai-nguyen' },
          { label: doc.title }
        ]}
      />

      <div className="mx-auto max-w-2xl px-4 py-12">
        <dl className="space-y-3 rounded-lg border border-neutral-200 bg-white p-6">
          <div className="flex justify-between gap-4">
            <dt className="text-sm text-neutral-500">Tên file</dt>
            <dd className="text-sm text-neutral-900">{doc.fileName ?? 'Không rõ'}</dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-sm text-neutral-500">Kích thước</dt>
            <dd className="text-sm text-neutral-900">{formatFileSize(doc.fileSize)}</dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-sm text-neutral-500">Định dạng</dt>
            <dd className="text-sm text-neutral-900">{doc.mimeType ?? 'Không rõ'}</dd>
          </div>
        </dl>

        <div className="mt-6 rounded-md border border-warning/30 bg-warning/5 p-4 text-sm text-warning">
          File demo chưa được upload. Admin cần upload file thật trong CMS.
        </div>
      </div>
    </>
  );
}