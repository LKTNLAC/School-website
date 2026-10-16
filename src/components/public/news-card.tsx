import Link from 'next/link';

import { formatRelativeDate } from '@/lib/utils';

type NewsCardProps = {
  href: string;
  title: string;
  summary: string | null;
  publishedAt: Date | null;
  categoryName?: string | null;
};

export function NewsCard({ href, title, summary, publishedAt, categoryName }: NewsCardProps) {
  return (
    <Link
      href={href}
      className="group flex flex-col rounded-lg border border-neutral-200 bg-white p-6 transition-shadow hover:shadow-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600"
    >
      {categoryName ? (
        <span className="mb-3 inline-flex w-fit rounded-full bg-primary-50 px-2 py-0.5 text-xs font-medium text-primary-700">
          {categoryName}
        </span>
      ) : null}
      <h3 className="text-lg font-semibold text-neutral-900 group-hover:text-primary-700">
        {title}
      </h3>
      {summary ? (
        <p className="mt-3 flex-1 text-sm text-neutral-600 line-clamp-3">{summary}</p>
      ) : null}
      {publishedAt ? (
        <time
          dateTime={publishedAt.toISOString()}
          className="mt-4 text-xs text-neutral-500"
        >
          {formatRelativeDate(publishedAt)}
        </time>
      ) : null}
    </Link>
  );
}