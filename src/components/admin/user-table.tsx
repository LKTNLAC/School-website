import Link from 'next/link';

import type { AdminUserListItem } from '@/features/users/types';
import { formatDate, formatRelativeDate } from '@/lib/utils';

const ROLE_LABELS: Record<string, string> = {
  ADMIN: 'Quản trị',
  EDITOR: 'Biên tập',
  CONTRIBUTOR: 'Cộng tác',
  VIEWER: 'Người xem'
};

const ROLE_TONES: Record<string, string> = {
  ADMIN: 'bg-primary-100 text-primary-700',
  EDITOR: 'bg-info/10 text-info',
  CONTRIBUTOR: 'bg-warning/10 text-warning',
  VIEWER: 'bg-neutral-100 text-neutral-700'
};

export function UserTable({ items }: { items: AdminUserListItem[] }) {
  if (items.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-neutral-300 bg-neutral-50 p-12 text-center">
        <p className="text-sm text-neutral-600">Chưa có người dùng nào.</p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-lg border border-neutral-200 bg-white">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="border-b border-neutral-200 bg-neutral-50 text-left">
            <tr>
              <th className="px-4 py-3 font-medium text-neutral-700">Tài khoản</th>
              <th className="px-4 py-3 font-medium text-neutral-700">Vai trò</th>
              <th className="px-4 py-3 font-medium text-neutral-700">Trạng thái</th>
              <th className="px-4 py-3 font-medium text-neutral-700">Session</th>
              <th className="px-4 py-3 font-medium text-neutral-700">Tạo lúc</th>
              <th className="px-4 py-3 text-right font-medium text-neutral-700">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-100">
            {items.map((user) => (
              <tr key={user.id} className="hover:bg-neutral-50">
                <td className="px-4 py-3">
                  <p className="font-medium text-neutral-900">{user.name ?? '—'}</p>
                  <p className="mt-0.5 text-xs text-neutral-500">{user.email}</p>
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${ROLE_TONES[user.role] ?? ''}`}
                  >
                    {ROLE_LABELS[user.role] ?? user.role}
                  </span>
                </td>
                <td className="px-4 py-3">
                  {user.status === 'ACTIVE' ? (
                    <span className="inline-flex items-center gap-1 text-xs text-success">
                      <span className="h-2 w-2 rounded-full bg-success" />
                      Hoạt động
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-xs text-error">
                      <span className="h-2 w-2 rounded-full bg-error" />
                      Vô hiệu
                    </span>
                  )}
                </td>
                <td className="px-4 py-3 text-xs text-neutral-600">
                  {user.sessionCount > 0 ? (
                    <>
                      <span>{user.sessionCount} active</span>
                      {user.lastSessionAt ? (
                        <span className="block text-neutral-500">
                          {formatRelativeDate(user.lastSessionAt)}
                        </span>
                      ) : null}
                    </>
                  ) : (
                    <span className="text-neutral-400">Không có</span>
                  )}
                </td>
                <td className="px-4 py-3 text-xs text-neutral-600">
                  {formatDate(user.createdAt)}
                </td>
                <td className="px-4 py-3 text-right">
                  <Link
                    href={`/admin/nguoi-dung/${user.id}`}
                    className="text-sm font-medium text-primary-600 hover:text-primary-700"
                  >
                    Quản lý
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}