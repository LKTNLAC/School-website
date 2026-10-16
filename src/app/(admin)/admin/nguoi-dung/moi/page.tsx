import type { Metadata } from 'next';
import { redirect } from 'next/navigation';

import { AdminPageHeader } from '@/components/admin/admin-page-header';
import { UserCreateForm } from '@/components/admin/user-create-form';
import { requireAuth } from '@/lib/auth-guard';
import { buildMetadata } from '@/lib/seo';

export const metadata: Metadata = buildMetadata({
  title: 'Tạo tài khoản',
  noIndex: true
});

export default async function AdminUserCreatePage() {
  const user = await requireAuth();
  if (user.role !== 'ADMIN') redirect('/admin');

  return (
    <div className="max-w-2xl">
      <AdminPageHeader
        title="Tạo tài khoản mới"
        breadcrumbs={[
          { label: 'Người dùng', href: '/admin/nguoi-dung' },
          { label: 'Tạo mới' }
        ]}
      />

      <div className="rounded-lg border border-neutral-200 bg-white p-6">
        <UserCreateForm />
      </div>
    </div>
  );
}