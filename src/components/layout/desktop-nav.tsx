'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { NavDropdown } from './nav-dropdown';

import { publicNavigation } from '@/config/navigation';
import { cn } from '@/lib/utils';


export function DesktopNav() {
  const pathname = usePathname();

  return (
    <nav aria-label="Điều hướng chính" className="hidden lg:block">
      <ul className="flex items-center gap-1">
        {publicNavigation.map((item) => {
          const isActive =
            item.href === '/'
              ? pathname === '/'
              : pathname === item.href || pathname.startsWith(item.href + '/');

          if (item.children && item.children.length > 0) {
            return <NavDropdown key={item.href} item={item} />;
          }

          return (
            <li key={item.href}>
              <Link
                href={item.href}
                className={cn(
                  'block rounded-md px-3 py-2 text-sm font-medium',
                  'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600',
                  isActive
                    ? 'text-primary-700'
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
  );
}