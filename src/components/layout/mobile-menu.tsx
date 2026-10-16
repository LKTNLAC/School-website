'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

import { publicNavigation } from '@/config/navigation';
import { cn } from '@/lib/utils';

export function MobileMenu() {
  const [open, setOpen] = useState(false);
  const [expandedItem, setExpandedItem] = useState<string | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    setOpen(false);
    setExpandedItem(null);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Mở menu"
        aria-expanded={open}
        className="lg:hidden inline-flex h-10 w-10 items-center justify-center rounded-md text-neutral-700 hover:bg-neutral-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600"
      >
        <svg aria-hidden="true" viewBox="0 0 24 24" className="h-6 w-6" fill="none">
          <path
            d="M4 6h16M4 12h16M4 18h16"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      </button>

      {open ? (
        <div
          className="fixed inset-0 z-50 bg-neutral-900/50 lg:hidden"
          onClick={() => setOpen(false)}
        >
          <div
            className="absolute right-0 top-0 h-full w-full max-w-sm bg-white shadow-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-neutral-200 p-4">
              <span className="text-base font-semibold">Menu</span>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Đóng menu"
                className="inline-flex h-10 w-10 items-center justify-center rounded-md text-neutral-700 hover:bg-neutral-100"
              >
                <svg aria-hidden="true" viewBox="0 0 24 24" className="h-6 w-6" fill="none">
                  <path
                    d="M6 6l12 12M18 6L6 18"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
              </button>
            </div>

            <nav aria-label="Điều hướng mobile" className="overflow-y-auto p-4">
              <ul className="space-y-1">
                {publicNavigation.map((item) => {
                  const hasChildren = item.children && item.children.length > 0;
                  const isExpanded = expandedItem === item.href;

                  return (
                    <li key={item.href}>
                      {hasChildren ? (
                        <>
                          <button
                            type="button"
                            onClick={() => setExpandedItem(isExpanded ? null : item.href)}
                            aria-expanded={isExpanded}
                            className="flex w-full items-center justify-between rounded-md px-3 py-3 text-base font-medium text-neutral-800 hover:bg-neutral-100"
                          >
                            {item.label}
                            <svg
                              aria-hidden="true"
                              viewBox="0 0 12 12"
                              className={cn('h-3 w-3 transition-transform', isExpanded && 'rotate-180')}
                            >
                              <path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.5" fill="none" />
                            </svg>
                          </button>
                          {isExpanded ? (
                            <ul className="ml-3 mt-1 space-y-1 border-l border-neutral-200 pl-3">
                              {item.children?.map((child) => (
                                <li key={child.href}>
                                  <Link
                                    href={child.href}
                                    className="block rounded-md px-3 py-2 text-sm text-neutral-700 hover:bg-neutral-100"
                                  >
                                    {child.label}
                                  </Link>
                                </li>
                              ))}
                            </ul>
                          ) : null}
                        </>
                      ) : (
                        <Link
                          href={item.href}
                          className="block rounded-md px-3 py-3 text-base font-medium text-neutral-800 hover:bg-neutral-100"
                        >
                          {item.label}
                        </Link>
                      )}
                    </li>
                  );
                })}
                <li key="/tim-kiem">
                  <Link
                    href="/tim-kiem"
                    className="block rounded-md px-3 py-3 text-base font-medium text-neutral-800 hover:bg-neutral-100"
                  >
                    Tìm kiếm
                  </Link>
                </li>
              </ul>
            </nav>
          </div>
        </div>
      ) : null}
    </>
  );
}