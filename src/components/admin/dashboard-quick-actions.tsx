import Link from 'next/link';

const ACTIONS = [
  {
    label: 'Tạo tin tức mới',
    description: 'Đăng tin tức, hoạt động nhà trường',
    href: '/admin/noi-dung/moi?type=NEWS'
  },
  {
    label: 'Tạo thông báo',
    description: 'Thông báo cho học sinh, phụ huynh',
    href: '/admin/noi-dung/moi?type=ANNOUNCEMENT'
  },
  {
    label: 'Tạo trang tĩnh',
    description: 'Trang giới thiệu, sứ mệnh, ...',
    href: '/admin/noi-dung/moi?type=PAGE'
  },
  {
    label: 'Quản lý tài liệu',
    description: 'Biểu mẫu, văn bản, tài nguyên',
    href: '/admin/tai-lieu'
  }
];

export function DashboardQuickActions() {
  return (
    <ul className="space-y-2">
      {ACTIONS.map((action) => (
        <li key={action.href}>
          <Link
            href={action.href}
            className="flex items-start justify-between gap-3 rounded-md border border-neutral-200 bg-white px-4 py-3 transition-colors hover:border-primary-300 hover:bg-primary-50"
          >
            <div className="min-w-0">
              <p className="text-sm font-medium text-neutral-800">{action.label}</p>
              <p className="mt-0.5 text-xs text-neutral-500">{action.description}</p>
            </div>
            <span aria-hidden="true" className="shrink-0 text-neutral-400">
              →
            </span>
          </Link>
        </li>
      ))}
    </ul>
  );
}