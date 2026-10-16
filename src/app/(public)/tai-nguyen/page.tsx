import type { Metadata } from 'next';

import { DocumentCard } from '@/components/public/document-card';
import { EmptyState } from '@/components/public/empty-state';
import { PageHeader } from '@/components/public/page-header';
import { getPublishedDocuments } from '@/features/documents/service';
import { buildMetadata } from '@/lib/seo';

export const metadata: Metadata = buildMetadata({
  title: 'Tài nguyên',
  description: 'Tài liệu, biểu mẫu và văn bản dành cho học sinh, phụ huynh.',
  path: '/tai-nguyen'
});

export default async function ResourcesPage() {
  const documents = await getPublishedDocuments();

  return (
    <>
      <PageHeader
        title="Tài nguyên"
        description="Tài liệu, biểu mẫu và văn bản dành cho học sinh, phụ huynh."
        breadcrumbs={[{ label: 'Tài nguyên' }]}
      />

      <div className="mx-auto max-w-4xl px-4 py-12">
        {documents.length === 0 ? (
          <EmptyState
            title="Chưa có tài liệu"
            description="Tài liệu sẽ được cập nhật."
          />
        ) : (
          <div className="space-y-3">
            {documents.map((doc) => (
              <DocumentCard
                key={doc.id}
                href={`/tai-nguyen/${doc.slug}`}
                title={doc.title}
                fileName={doc.fileName}
                fileSize={doc.fileSize}
                mimeType={doc.mimeType}
              />
            ))}
          </div>
        )}
      </div>
    </>
  );
}