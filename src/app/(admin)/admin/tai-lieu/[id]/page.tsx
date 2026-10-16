import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { AdminPageHeader } from '@/components/admin/admin-page-header';
import { ContentStatusBadge } from '@/components/admin/content-status-badge';
import { DocumentActions } from '@/components/admin/document-actions';
import { DocumentForm } from '@/components/admin/document-form';
import {
  getAdminDocumentById,
  getDocumentRevisions
} from '@/features/documents/service';
import { buildMetadata } from '@/lib/seo';
import { formatDate } from '@/lib/utils';

type Props = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const doc = await getAdminDocumentById(id);
  return buildMetadata({
    title: doc ? `Tài liệu: ${doc.title}` : 'Không tìm thấy',
    noIndex: true
  });
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default async function AdminDocumentDetailPage({ params }: Props) {
  const { id } = await params;

  const [doc, revisions] = await Promise.all([
    getAdminDocumentById(id),
    getDocumentRevisions(id)
  ]);

  if (!doc) notFound();

  return (
    <div className="max-w-4xl">
      <AdminPageHeader
        title="Quản lý tài liệu"
        breadcrumbs={[
          { label: 'Tài liệu', href: '/admin/tai-lieu' },
          { label: doc.title }
        ]}
        actions={<ContentStatusBadge status={doc.status} />}
      />

      <div className="mb-6 grid gap-2 text-xs text-neutral-500 sm:grid-cols-2">
        <p>Tạo lúc: {formatDate(doc.createdAt)}</p>
        <p>Cập nhật: {formatDate(doc.updatedAt)}</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <div className="rounded-lg border border-neutral-200 bg-white p-6">
            <h2 className="mb-4 text-base font-semibold text-neutral-900">
              Thông tin tài liệu
            </h2>
            <DocumentForm
              mode="edit"
              initial={{
                id: doc.id,
                title: doc.title,
                slug: doc.slug,
                status: doc.status
              }}
            />
          </div>

          <div className="rounded-lg border border-neutral-200 bg-white p-6">
            <h2 className="mb-4 text-base font-semibold text-neutral-900">
              Lịch sử revision ({revisions.length})
            </h2>
            {revisions.length === 0 ? (
              <p className="text-sm text-neutral-500">
                Chưa có file nào được upload.
              </p>
            ) : (
              <ul className="divide-y divide-neutral-100">
                {revisions.map((rev) => (
                  <li key={rev.id} className="flex items-center justify-between gap-4 py-3">
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-neutral-900">
                        {rev.fileName}
                        {rev.isCurrent ? (
                          <span className="ml-2 rounded-full bg-success/10 px-2 py-0.5 text-xs text-success">
                            Hiện tại
                          </span>
                        ) : null}
                        {rev.pinned ? (
                          <span className="ml-2 rounded-full bg-warning/10 px-2 py-0.5 text-xs text-warning">
                            Pinned
                          </span>
                        ) : null}
                      </p>
                      <p className="mt-0.5 text-xs text-neutral-500">
                        {formatFileSize(rev.fileSize)} • {formatDate(rev.createdAt)}
                        {rev.authorName ? ` • ${rev.authorName}` : ''}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        <div className="lg:col-span-1">
          <DocumentActions
            documentId={doc.id}
            hasCurrentRevision={!!doc.currentRevision}
          />
        </div>
      </div>
    </div>
  );
}