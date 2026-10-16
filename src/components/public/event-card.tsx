import Link from 'next/link';

import { formatDate } from '@/lib/utils';

type EventCardProps = {
  href: string;
  title: string;
  startAt: Date;
  location: string | null;
};

export function EventCard({ href, title, startAt, location }: EventCardProps) {
  const day = startAt.getDate().toString().padStart(2, '0');
  const month = (startAt.getMonth() + 1).toString().padStart(2, '0');

  return (
    <Link
      href={href}
      className="group flex gap-4 rounded-lg border border-neutral-200 bg-white p-4 transition-shadow hover:shadow-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600"
    >
      <div className="flex h-16 w-16 flex-shrink-0 flex-col items-center justify-center rounded-md bg-primary-50 text-primary-700">
        <span className="text-2xl font-bold leading-none">{day}</span>
        <span className="mt-1 text-xs font-medium">Tháng {month}</span>
      </div>
      <div className="flex-1">
        <h3 className="text-base font-semibold text-neutral-900 group-hover:text-primary-700 line-clamp-2">
          {title}
        </h3>
        <div className="mt-2 space-y-1 text-xs text-neutral-500">
          <p>📅 {formatDate(startAt)}</p>
          {location ? <p>📍 {location}</p> : null}
        </div>
      </div>
    </Link>
  );
}