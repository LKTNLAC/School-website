'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { adminNavigation } from '@/config/navigation';
import { cn } from '@/lib/utils';

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden w-64 border-r border-neutral-200 bg-white lg:block">
      <div className="flex h-16 items-center border-b border-neutral-200 px-6">
        <Link href="/admin" className="flex items-center gap-2">
          <span
            aria-hidden="true"
            className="flex h-8 w-8 items-center justify-center rounded-md bg-primary-600 text-xs font-bold text-white"
          >
            TH
          </span>
          <span className="text-sm font-semibold text-neutral-900">Quản trị</span>
        </Link>
      </div>

      <nav aria-label="Điều hướng quản trị" className="p-3">
        <ul className="space-y-1">
          {adminNavigation.map((item) => {
            const isActive =
              item.href === '/admin'
                ? pathname === '/admin'
                : pathname === item.href || pathname.startsWith(item.href + '/');

            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={cn(
                    'block rounded-md px-3 py-2 text-sm font-medium',
                    isActive
                      ? 'bg-primary-50 text-primary-700'
                      : 'text-neutral-700 hover:bg-neutral-100 hover:text-primary-700'
                  )}
                >
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
}