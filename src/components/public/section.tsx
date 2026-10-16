import Link from 'next/link';
import type { ReactNode } from 'react';

type SectionProps = {
  title: string;
  viewAllHref?: string;
  viewAllLabel?: string;
  children: ReactNode;
  className?: string;
};

export function Section({
  title,
  viewAllHref,
  viewAllLabel = 'Xem tất cả',
  children,
  className = ''
}: SectionProps) {
  return (
    <section className={`py-12 lg:py-16 ${className}`}>
      <div className="mx-auto max-w-7xl px-4">
        <div className="mb-8 flex items-end justify-between">
          <h2 className="text-2xl font-semibold text-neutral-900 lg:text-3xl">{title}</h2>
          {viewAllHref ? (
            <Link
              href={viewAllHref}
              className="text-sm font-medium text-primary-600 hover:text-primary-700"
            >
              {viewAllLabel} →
            </Link>
          ) : null}
        </div>
        {children}
      </div>
    </section>
  );
}