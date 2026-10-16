import type { Metadata } from 'next';
import Link from 'next/link';
import { redirect } from 'next/navigation';

import { AdminPageHeader } from '@/components/admin/admin-page-header';
import { UserTable } from '@/components/admin/user-table';
import { getAllUsers } from '@/features/users/service';
import { requireAuth } from '@/lib/auth-guard';
import { buildMetadata } from '@/lib/seo';

export const metadata: Metadata = buildMetadata({
  title: 'Quản lý người dùng',
  noIndex: true
});

export default async function AdminUsersPage() {
  const user = await requireAuth();

  if (user.role !== 'ADMIN') {
    redirect('/admin');
  }

  const users = await getAllUsers();

  return (
    <div>
      <AdminPageHeader
        title="Quản lý người dùng"
        description={`Tổng ${users.length} tài khoản.`}
        breadcrumbs={[{ label: 'Người dùng' }]}
        actions={
          <Link
            href="/admin/nguoi-dung/moi"
            className="inline-flex h-10 items-center rounded-md bg-primary-600 px-4 text-sm font-medium text-white hover:bg-primary-700"
          >
            + Tạo tài khoản
          </Link>
        }
      />

      <UserTable items={users} />
    </div>
  );
}