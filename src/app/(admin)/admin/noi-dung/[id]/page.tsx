import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { AdminPageHeader } from '@/components/admin/admin-page-header';
import { ContentActions } from '@/components/admin/content-actions';
import { ContentForm } from '@/components/admin/content-form';
import { ContentStatusBadge } from '@/components/admin/content-status-badge';
import { getAdminContentById, getCategories, getContentAuthorId } from '@/features/content/service';
import { requireAuth } from '@/lib/auth-guard';
import { buildMetadata } from '@/lib/seo';
import { formatDate } from '@/lib/utils';

type Props = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const content = await getAdminContentById(id);
  return buildMetadata({
    title: content ? `Sửa: ${content.title}` : 'Không tìm thấy',
    noIndex: true
  });
}

export default async function AdminContentEditPage({ params }: Props) {
  const { id } = await params;

  const [user, content, categories, authorId] = await Promise.all([
    requireAuth(),
    getAdminContentById(id),
    getCategories(),
    getContentAuthorId(id)
  ]);

  if (!content) notFound();

  const isOwner = authorId === user.id;

  return (
    <div className="max-w-4xl">
      <AdminPageHeader
        title="Chỉnh sửa nội dung"
        breadcrumbs={[
          { label: 'Nội dung', href: '/admin/noi-dung' },
          { label: content.title }
        ]}
        actions={<ContentStatusBadge status={content.status} />}
      />

      <div className="mb-4 grid gap-2 text-xs text-neutral-500 sm:grid-cols-2">
        <p>Tạo lúc: {formatDate(content.createdAt)}</p>
        <p>Cập nhật: {formatDate(content.updatedAt)}</p>
      </div>

      <div className="mb-6 rounded-lg border border-neutral-200 bg-white p-4">
        <h2 className="mb-3 text-sm font-semibold text-neutral-900">Thao tác</h2>
        <ContentActions
          contentId={content.id}
          status={content.status}
          userRole={user.role}
          isOwner={isOwner}
        />
      </div>

      <div className="rounded-lg border border-neutral-200 bg-white p-6">
        <ContentForm
          mode="edit"
          categories={categories}
          lockType
          initial={{
            id: content.id,
            type: content.type,
            title: content.title,
            slug: content.slug,
            summary: content.summary ?? '',
            body: content.body,
            seoTitle: content.seoTitle ?? '',
            seoDescription: content.seoDescription ?? '',
            categoryId: content.categoryId ?? ''
          }}
        />
      </div>
    </div>
  );
}