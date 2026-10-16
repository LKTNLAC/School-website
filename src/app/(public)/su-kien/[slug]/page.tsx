import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { PageHeader } from '@/components/public/page-header';
import { Prose } from '@/components/public/prose';
import { ShareButtons } from '@/components/public/share-buttons';
import { getEventBySlug } from '@/features/events/service';
import { buildMetadata } from '@/lib/seo';
import { formatDate } from '@/lib/utils';

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const event = await getEventBySlug(slug);
  if (!event) {
    return buildMetadata({ title: 'Không tìm thấy', noIndex: true });
  }
  return buildMetadata({
    title: event.title,
    description: event.description.slice(0, 160),
    path: `/su-kien/${event.slug}`
  });
}

export default async function EventDetailPage({ params }: Props) {
  const { slug } = await params;
  const event = await getEventBySlug(slug);

  if (!event) notFound();

  const url = `/su-kien/${event.slug}`;

  return (
    <>
      <PageHeader
        title={event.title}
        breadcrumbs={[
          { label: 'Sự kiện', href: '/su-kien' },
          { label: event.title }
        ]}
      />

      <article className="mx-auto max-w-3xl px-4 py-12">
        <dl className="mb-8 grid gap-4 rounded-lg border border-neutral-200 bg-neutral-50 p-6 sm:grid-cols-2">
          <div>
            <dt className="text-xs font-medium uppercase tracking-wider text-neutral-500">
              Bắt đầu
            </dt>
            <dd className="mt-1 text-sm text-neutral-900">{formatDate(event.startAt)}</dd>
          </div>
          {event.endAt ? (
            <div>
              <dt className="text-xs font-medium uppercase tracking-wider text-neutral-500">
                Kết thúc
              </dt>
              <dd className="mt-1 text-sm text-neutral-900">{formatDate(event.endAt)}</dd>
            </div>
          ) : null}
          {event.location ? (
            <div className="sm:col-span-2">
              <dt className="text-xs font-medium uppercase tracking-wider text-neutral-500">
                Địa điểm
              </dt>
              <dd className="mt-1 text-sm text-neutral-900">{event.location}</dd>
            </div>
          ) : null}
        </dl>

        <Prose content={event.description} />

        <ShareButtons url={url} title={event.title} />
      </article>
    </>
  );
}