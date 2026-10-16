import Link from 'next/link';

import { formatRelativeDate } from '@/lib/utils';

type ContentListItemProps = {
  href: string;
  title: string;
  summary: string | null;
  publishedAt: Date | null;
  categoryName?: string | null;
};

export function ContentListItem({
  href,
  title,
  summary,
  publishedAt,
  categoryName
}: ContentListItemProps) {
  return (
    <article className="border-b border-neutral-200 py-6 last:border-b-0">
      <Link href={href} className="group block">
        {categoryName ? (
          <span className="mb-2 inline-flex rounded-full bg-primary-50 px-2 py-0.5 text-xs font-medium text-primary-700">
            {categoryName}
          </span>
        ) : null}
        <h3 className="text-lg font-semibold text-neutral-900 group-hover:text-primary-700 lg:text-xl">
          {title}
        </h3>
        {summary ? (
          <p className="mt-2 text-sm text-neutral-600 line-clamp-2 lg:text-base">
            {summary}
          </p>
        ) : null}
        {publishedAt ? (
          <time
            dateTime={publishedAt.toISOString()}
            className="mt-3 block text-xs text-neutral-500"
          >
            {formatRelativeDate(publishedAt)}
          </time>
        ) : null}
      </Link>
    </article>
  );
}