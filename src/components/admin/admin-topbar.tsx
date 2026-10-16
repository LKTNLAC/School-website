'use client';

import { signOut } from 'next-auth/react';
import { useEffect, useRef, useState } from 'react';

import { AdminMobileMenu } from './admin-mobile-menu';

type AdminTopbarProps = {
  userName: string;
  userRole: string;
};

const ROLE_LABELS: Record<string, string> = {
  ADMIN: 'Quản trị viên',
  EDITOR: 'Biên tập viên',
  CONTRIBUTOR: 'Cộng tác viên',
  VIEWER: 'Người xem'
};

export function AdminTopbar({ userName, userRole }: AdminTopbarProps) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [signingOut, setSigningOut] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  async function handleSignOut() {
    setSigningOut(true);
    await signOut({ callbackUrl: '/dang-nhap' });
  }

  const initials = userName
    .split(' ')
    .filter((w) => w.length > 0)
    .slice(-2)
    .map((w) => w[0])
    .join('')
    .toUpperCase();

  return (
    <header className="flex h-16 items-center justify-between gap-3 border-b border-neutral-200 bg-white px-4 lg:px-6">
      <div className="flex items-center gap-3">
        <AdminMobileMenu />
        <span className="hidden text-sm text-neutral-600 lg:block">
          Bảng quản trị
        </span>
      </div>

      <div className="flex items-center gap-2">
        <a
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="hidden h-9 items-center rounded-md border border-neutral-300 px-3 text-sm text-neutral-700 hover:bg-neutral-50 lg:inline-flex"
        >
          Xem website
        </a>

        <div ref={dropdownRef} className="relative">
          <button
            type="button"
            onClick={() => setDropdownOpen((v) => !v)}
            aria-expanded={dropdownOpen}
            aria-haspopup="true"
            className="flex items-center gap-2 rounded-md px-2 py-1.5 hover:bg-neutral-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600"
          >
            <span
              aria-hidden="true"
              className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-100 text-xs font-semibold text-primary-700"
            >
              {initials || 'U'}
            </span>
            <span className="hidden text-sm lg:block">
              <span className="block font-medium text-neutral-900">{userName}</span>
              <span className="block text-xs text-neutral-500">
                {ROLE_LABELS[userRole] ?? userRole}
              </span>
            </span>
            <svg aria-hidden="true" viewBox="0 0 12 12" className="h-3 w-3 text-neutral-500">
              <path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.5" fill="none" />
            </svg>
          </button>

          {dropdownOpen ? (
            <div
              role="menu"
              className="absolute right-0 top-full z-50 mt-1 w-56 rounded-md border border-neutral-200 bg-white py-1 shadow-md"
            >
              <div className="border-b border-neutral-100 px-4 py-3">
                <p className="text-sm font-medium text-neutral-900">{userName}</p>
                <p className="text-xs text-neutral-500">
                  {ROLE_LABELS[userRole] ?? userRole}
                </p>
              </div>
              <button
                type="button"
                onClick={handleSignOut}
                disabled={signingOut}
                role="menuitem"
                className="block w-full px-4 py-2 text-left text-sm text-neutral-700 hover:bg-neutral-100 disabled:opacity-50"
              >
                {signingOut ? 'Đang thoát...' : 'Đăng xuất'}
              </button>
            </div>
          ) : null}
        </div>
      </div>
    </header>
  );
}