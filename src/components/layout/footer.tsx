import Link from 'next/link';

import { footerNavigation } from '@/config/navigation';
import { siteConfig } from '@/config/site';
import type { SiteSettings } from '@/features/settings/types';

type FooterProps = {
  settings?: SiteSettings;
};

export function Footer({ settings }: FooterProps) {
  const year = new Date().getFullYear();
  const siteName = settings?.siteName || siteConfig.name;
  const siteDescription = settings?.siteDescription || siteConfig.description;
  const copyrightText = settings?.footerCopyright || 'Bảo lưu mọi quyền.';

  const contactLines = [
    settings?.contactAddress,
    settings?.contactPhone ? `ĐT: ${settings.contactPhone}` : null,
    settings?.contactEmail ? `Email: ${settings.contactEmail}` : null
  ].filter(Boolean) as string[];

  return (
    <footer className="border-t border-neutral-200 bg-neutral-50">
      <div className="mx-auto max-w-7xl px-4 py-12">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          <div>
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
              <span className="text-base font-semibold text-neutral-900">
                {siteName}
              </span>
            </Link>
            <p className="mt-4 text-sm text-neutral-700">{siteDescription}</p>

            {contactLines.length > 0 ? (
              <address className="mt-4 space-y-1 text-sm not-italic text-neutral-600">
                {contactLines.map((line, idx) => (
                  <p key={idx}>{line}</p>
                ))}
              </address>
            ) : null}
          </div>

          {footerNavigation.map((section) => (
            <div key={section.title}>
              <h2 className="text-sm font-semibold uppercase tracking-wider text-neutral-900">
                {section.title}
              </h2>
              <ul className="mt-4 space-y-2">
                {section.items.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className="text-sm text-neutral-700 hover:text-primary-700"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-col items-start gap-4 border-t border-neutral-200 pt-8 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-neutral-500">
            © {year} {siteName}. {copyrightText}
          </p>
          <ul className="flex items-center gap-4 text-sm text-neutral-500">
            <li>
              <Link href="/chinh-sach-bao-mat" className="hover:text-primary-700">
                Chính sách bảo mật
              </Link>
            </li>
            <li>
              <Link href="/dieu-khoan" className="hover:text-primary-700">
                Điều khoản
              </Link>
            </li>
            <li>
              <Link href="/dang-nhap" className="hover:text-primary-700">
                Quản trị
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
}