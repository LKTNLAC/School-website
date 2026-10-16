import Link from 'next/link';

import { DesktopNav } from './desktop-nav';
import { MobileMenu } from './mobile-menu';

import { siteConfig } from '@/config/site';
import type { SiteSettings } from '@/features/settings/types';


type HeaderProps = {
  settings?: SiteSettings;
};

export function Header({ settings }: HeaderProps) {
  const siteName = settings?.siteName || siteConfig.name;

  return (
    <header className="sticky top-0 z-40 border-b border-neutral-200 bg-white">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4">
        <Link
          href="/"
          className="flex items-center gap-2 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600"
        >
          <span
            aria-hidden="true"
            className="flex h-9 w-9 items-center justify-center rounded-md bg-primary-600 text-sm font-bold text-white"
          >
            TH
          </span>
          <span className="text-base font-semibold text-neutral-900 lg:text-lg">
            {siteName}
          </span>
        </Link>

        <div className="flex items-center gap-2">
          <DesktopNav />
          <Link
            href="/tim-kiem"
            aria-label="Tìm kiếm"
            className="hidden h-10 w-10 items-center justify-center rounded-md text-neutral-700 hover:bg-neutral-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600 lg:inline-flex"
          >
            <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5" fill="none">
              <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="1.5" />
              <path
                d="M20 20l-3.5-3.5"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
          </Link>
          <MobileMenu />
        </div>
      </div>
    </header>
  );
}