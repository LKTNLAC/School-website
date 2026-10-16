import Link from 'next/link';

import { siteConfig } from '@/config/site';
import type { SiteSettings } from '@/features/settings/types';

type HeroProps = {
  settings?: SiteSettings;
};

export function Hero({ settings }: HeroProps) {
  const siteName = settings?.siteName || siteConfig.name;
  const siteDescription = settings?.siteDescription || siteConfig.description;

  return (
    <section className="border-b border-neutral-200 bg-gradient-to-b from-primary-50 to-white">
      <div className="mx-auto max-w-7xl px-4 py-16 lg:py-24">
        <div className="max-w-3xl">
          <p className="text-sm font-medium uppercase tracking-wider text-primary-700">
            {siteName}
          </p>
          <h1 className="mt-2 text-4xl font-bold leading-tight text-neutral-900 lg:text-5xl">
            Chào mừng đến với website nhà trường
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-neutral-700">
            {siteDescription}
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/gioi-thieu"
              className="inline-flex h-11 items-center rounded-md bg-primary-600 px-6 text-sm font-medium text-white hover:bg-primary-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600"
            >
              Tìm hiểu về trường
            </Link>
            <Link
              href="/tuyen-sinh"
              className="inline-flex h-11 items-center rounded-md border border-neutral-300 bg-white px-6 text-sm font-medium text-neutral-800 hover:bg-neutral-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600"
            >
              Thông tin tuyển sinh
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}