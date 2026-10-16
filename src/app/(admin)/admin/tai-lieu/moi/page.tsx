import type { Metadata } from 'next';

import { AdminPageHeader } from '@/components/admin/admin-page-header';
import { DocumentForm } from '@/components/admin/document-form';
import { buildMetadata } from '@/lib/seo';

export const metadata: Metadata = buildMetadata({
  title: 'Tạo tài liệu',
  noIndex: true
});

export default function AdminDocumentCreatePage() {
  return (
    <div className="max-w-2xl">
      <AdminPageHeader
        title="Tạo tài liệu mới"
        description="Tạo metadata trước. Sau đó upload file ở trang quản lý."
        breadcrumbs={[
          { label: 'Tài liệu', href: '/admin/tai-lieu' },
          { label: 'Tạo mới' }
        ]}
      />

      <div className="rounded-lg border border-neutral-200 bg-white p-6">
        <DocumentForm mode="create" />
      </div>
    </div>
  );
}