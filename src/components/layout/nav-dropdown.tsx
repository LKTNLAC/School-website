'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';

import type { NavItem } from '@/config/navigation';
import { cn } from '@/lib/utils';

export function NavDropdown({ item }: { item: NavItem }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLLIElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  function handleKeyDown(event: React.KeyboardEvent) {
    if (event.key === 'Escape') setOpen(false);
  }

  return (
    <li ref={ref} className="relative" onKeyDown={handleKeyDown}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-haspopup="true"
        className={cn(
          'flex items-center gap-1 px-3 py-2 text-sm font-medium text-neutral-700 rounded-md',
          'hover:bg-neutral-100 hover:text-primary-700',
          'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600',
          open && 'bg-neutral-100 text-primary-700'
        )}
      >
        {item.label}
        <svg
          aria-hidden="true"
          viewBox="0 0 12 12"
          className={cn('h-3 w-3 transition-transform', open && 'rotate-180')}
        >
          <path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.5" fill="none" />
        </svg>
      </button>

      {open ? (
        <ul
          role="menu"
          className="absolute left-0 top-full z-50 mt-1 w-56 rounded-md border border-neutral-200 bg-white py-1 shadow-md"
        >
          {item.children?.map((child) => (
            <li key={child.href} role="none">
              <Link
                href={child.href}
                role="menuitem"
                onClick={() => setOpen(false)}
                className="block px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-100 hover:text-primary-700"
              >
                {child.label}
              </Link>
            </li>
          ))}
        </ul>
      ) : null}
    </li>
  );
}