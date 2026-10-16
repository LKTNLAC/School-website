import { redirect } from 'next/navigation';

import { AdminSidebar } from '@/components/admin/admin-sidebar';
import { AdminTopbar } from '@/components/admin/admin-topbar';
import { getSessionUser } from '@/lib/auth-guard';

export default async function AdminLayout({
  children
}: {
  children: React.ReactNode;
}) {
  const user = await getSessionUser();

  if (!user) {
    redirect('/dang-nhap');
  }

  return (
    <div className="flex min-h-dvh bg-neutral-50">
      <AdminSidebar />
      <div className="flex flex-1 flex-col">
        <AdminTopbar userName={user.name} userRole={user.role} />
        <main className="flex-1 p-4 lg:p-6">{children}</main>
      </div>
    </div>
  );
}