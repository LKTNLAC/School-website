import Link from 'next/link';

import type { SearchResult } from '@/features/search/types';
import { formatDate } from '@/lib/utils';

const TYPE_LABELS: Record<string, string> = {
  PAGE: 'Trang',
  NEWS: 'Tin tức',
  ANNOUNCEMENT: 'Thông báo',
  EVENT: 'Sự kiện',
  DOCUMENT: 'Tài liệu'
};

export function SearchResultItem({ result }: { result: SearchResult }) {
  return (
    <article className="border-b border-neutral-200 py-6 last:border-b-0">
      <Link href={result.href} className="group block">
        <div className="flex items-center gap-2">
          <span className="inline-flex rounded-full bg-primary-50 px-2 py-0.5 text-xs font-medium text-primary-700">
            {TYPE_LABELS[result.type] ?? result.type}
          </span>
          {result.publishedAt ? (
            <time
              dateTime={result.publishedAt.toISOString()}
              className="text-xs text-neutral-500"
            >
              {formatDate(result.publishedAt)}
            </time>
          ) : null}
        </div>
        <h3 className="mt-2 text-lg font-semibold text-neutral-900 group-hover:text-primary-700">
          {result.title}
        </h3>
        {result.summary ? (
          <p className="mt-1 text-sm text-neutral-600 line-clamp-2">{result.summary}</p>
        ) : null}
      </Link>
    </article>
  );
}