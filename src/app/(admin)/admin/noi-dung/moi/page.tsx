import type { Metadata } from 'next';

import { AdminPageHeader } from '@/components/admin/admin-page-header';
import { ContentForm } from '@/components/admin/content-form';
import { getCategories } from '@/features/content/service';
import { buildMetadata } from '@/lib/seo';

export const metadata: Metadata = buildMetadata({
  title: 'Tạo nội dung mới',
  noIndex: true
});

type Props = {
  searchParams: Promise<{ type?: string }>;
};

export default async function AdminContentCreatePage({ searchParams }: Props) {
  const [categories, sp] = await Promise.all([getCategories(), searchParams]);

  const initialType: 'PAGE' | 'NEWS' | 'ANNOUNCEMENT' =
    sp.type === 'PAGE' || sp.type === 'ANNOUNCEMENT' || sp.type === 'NEWS'
      ? sp.type
      : 'NEWS';

  return (
    <div className="max-w-4xl">
      <AdminPageHeader
        title="Tạo nội dung mới"
        description="Điền thông tin để tạo nội dung. Nội dung sẽ ở trạng thái Nháp."
        breadcrumbs={[
          { label: 'Nội dung', href: '/admin/noi-dung' },
          { label: 'Tạo mới' }
        ]}
      />

      <div className="rounded-lg border border-neutral-200 bg-white p-6">
        <ContentForm
          mode="create"
          categories={categories}
          initial={{
            type: initialType,
            title: '',
            slug: '',
            summary: '',
            body: '',
            seoTitle: '',
            seoDescription: '',
            categoryId: ''
          }}
        />
      </div>
    </div>
  );
}