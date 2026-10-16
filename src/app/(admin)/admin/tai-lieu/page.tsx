import type { Metadata } from 'next';
import Link from 'next/link';

import { AdminPageHeader } from '@/components/admin/admin-page-header';
import { DocumentTable } from '@/components/admin/document-table';
import { getAdminDocumentList } from '@/features/documents/service';
import { buildMetadata } from '@/lib/seo';

export const metadata: Metadata = buildMetadata({
  title: 'Quản lý tài liệu',
  noIndex: true
});

export default async function AdminDocumentsPage() {
  const documents = await getAdminDocumentList();

  return (
    <div>
      <AdminPageHeader
        title="Quản lý tài liệu"
        description={`Tổng ${documents.length} tài liệu.`}
        breadcrumbs={[{ label: 'Tài liệu' }]}
        actions={
          <Link
            href="/admin/tai-lieu/moi"
            className="inline-flex h-10 items-center rounded-md bg-primary-600 px-4 text-sm font-medium text-white hover:bg-primary-700"
          >
            + Tạo tài liệu
          </Link>
        }
      />

      <DocumentTable items={documents} />
    </div>
  );
}