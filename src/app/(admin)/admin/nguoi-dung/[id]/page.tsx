import type { Metadata } from 'next';
import { notFound, redirect } from 'next/navigation';

import { AdminPageHeader } from '@/components/admin/admin-page-header';
import { UserActions } from '@/components/admin/user-actions';
import { getUserById } from '@/features/users/service';
import { requireAuth } from '@/lib/auth-guard';
import { buildMetadata } from '@/lib/seo';
import { formatDate, formatRelativeDate } from '@/lib/utils';

type Props = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const target = await getUserById(id);
  return buildMetadata({
    title: target ? `Người dùng: ${target.name ?? target.email}` : 'Không tìm thấy',
    noIndex: true
  });
}

export default async function AdminUserDetailPage({ params }: Props) {
  const { id } = await params;
  const currentUser = await requireAuth();

  if (currentUser.role !== 'ADMIN') redirect('/admin');

  const target = await getUserById(id);
  if (!target) notFound();

  return (
    <div className="max-w-2xl">
      <AdminPageHeader
        title={target.name ?? target.email}
        description={target.email}
        breadcrumbs={[
          { label: 'Người dùng', href: '/admin/nguoi-dung' },
          { label: target.name ?? target.email }
        ]}
      />

      <div className="mb-6 grid gap-2 text-xs text-neutral-500 sm:grid-cols-2">
        <p>Tạo lúc: {formatDate(target.createdAt)}</p>
        <p>Cập nhật: {formatDate(target.updatedAt)}</p>
      </div>

      <div className="mb-6 rounded-lg border border-neutral-200 bg-white p-4">
        <h3 className="text-sm font-semibold text-neutral-900">
          Session gần đây ({target.sessions.length})
        </h3>
        {target.sessions.length === 0 ? (
          <p className="mt-2 text-sm text-neutral-500">Không có session nào.</p>
        ) : (
          <ul className="mt-3 divide-y divide-neutral-100">
            {target.sessions.map((s) => (
              <li key={s.id} className="flex items-center justify-between py-2 text-xs">
                <span className="text-neutral-600">
                  {s.revokedAt
                    ? 'Đã thu hồi'
                    : s.expires < new Date()
                      ? 'Hết hạn'
                      : 'Đang hoạt động'}
                </span>
                <span className="text-neutral-500">
                  {formatRelativeDate(s.lastSeenAt)}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>

      <UserActions
        userId={target.id}
        currentUserId={currentUser.id}
        name={target.name}
        role={target.role}
        status={target.status}
      />
    </div>
  );
}