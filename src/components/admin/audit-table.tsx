import type { AuditListItem } from '@/features/audit/types';
import { formatDate } from '@/lib/utils';

const ACTION_LABELS: Record<string, string> = {
  'content.create': 'Tạo nội dung',
  'content.update': 'Sửa nội dung',
  'content.publish': 'Xuất bản nội dung',
  'content.archive': 'Lưu trữ nội dung',
  'content.submit_review': 'Gửi duyệt',
  'content.revert_draft': 'Chuyển về nháp',
  'content.soft_delete': 'Xóa mềm nội dung',
  'content.hard_delete': 'Xóa cứng nội dung',
  'content.rollback': 'Khôi phục revision',
  'media.upload': 'Upload media',
  'media.delete': 'Xóa media',
  'document.create': 'Tạo tài liệu',
  'document.update': 'Sửa tài liệu',
  'document.upload_revision': 'Upload revision',
  'document.soft_delete': 'Xóa tài liệu',
  'user.create': 'Tạo user',
  'user.update': 'Sửa user',
  'user.reset_password': 'Đặt lại mật khẩu',
  'user.revoke_sessions': 'Thu hồi session',
  'user.hard_delete': 'Xóa user'
};

type Props = {
  items: AuditListItem[];
  showDetail: boolean;
};

export function AuditTable({ items, showDetail }: Props) {
  if (items.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-neutral-300 bg-neutral-50 p-12 text-center">
        <p className="text-sm text-neutral-600">Không có bản ghi nào.</p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-lg border border-neutral-200 bg-white">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="border-b border-neutral-200 bg-neutral-50 text-left">
            <tr>
              <th className="px-4 py-3 font-medium text-neutral-700">Thời gian</th>
              <th className="px-4 py-3 font-medium text-neutral-700">Người thực hiện</th>
              <th className="px-4 py-3 font-medium text-neutral-700">Hành động</th>
              <th className="px-4 py-3 font-medium text-neutral-700">Đối tượng</th>
              {showDetail ? (
                <th className="px-4 py-3 font-medium text-neutral-700">Chi tiết</th>
              ) : null}
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-100">
            {items.map((log) => (
              <tr key={log.id} className="hover:bg-neutral-50">
                <td className="px-4 py-3 text-xs text-neutral-600 whitespace-nowrap">
                  {formatDate(log.createdAt)}
                </td>
                <td className="px-4 py-3 text-neutral-700">
                  {log.actorName ?? <span className="text-neutral-400">Hệ thống</span>}
                </td>
                <td className="px-4 py-3 text-neutral-900">
                  {ACTION_LABELS[log.action] ?? log.action}
                </td>
                <td className="px-4 py-3 text-xs text-neutral-600">
                  <span className="inline-flex rounded-full bg-neutral-100 px-2 py-0.5 font-mono">
                    {log.entityType}
                  </span>
                  <span className="ml-2 font-mono text-neutral-500">
                    {log.entityIdShort}
                  </span>
                </td>
                {showDetail ? (
                  <td className="px-4 py-3 text-xs">
                    {log.metadata ? (
                      <pre className="max-w-xs overflow-x-auto whitespace-pre-wrap text-neutral-600">
                        {JSON.stringify(log.metadata, null, 2)}
                      </pre>
                    ) : (
                      <span className="text-neutral-400">—</span>
                    )}
                  </td>
                ) : null}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}