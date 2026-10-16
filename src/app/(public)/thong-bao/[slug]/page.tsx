import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { PageHeader } from '@/components/public/page-header';
import { Prose } from '@/components/public/prose';
import { ShareButtons } from '@/components/public/share-buttons';
import { getAnnouncementBySlug } from '@/features/content/service';
import { buildMetadata } from '@/lib/seo';
import { formatDate } from '@/lib/utils';

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const item = await getAnnouncementBySlug(slug);
  if (!item) {
    return buildMetadata({ title: 'Không tìm thấy', noIndex: true });
  }
  return buildMetadata({
    title: item.seoTitle ?? item.title,
    description: item.seoDescription ?? item.summary ?? undefined,
    path: `/thong-bao/${item.slug}`
  });
}

export default async function AnnouncementDetailPage({ params }: Props) {
  const { slug } = await params;
  const item = await getAnnouncementBySlug(slug);

  if (!item) notFound();

  const url = `/thong-bao/${item.slug}`;

  return (
    <>
      <PageHeader
        title={item.title}
        breadcrumbs={[
          { label: 'Thông báo', href: '/thong-bao' },
          { label: item.title }
        ]}
      />

      <article className="mx-auto max-w-3xl px-4 py-12">
        {item.publishedAt ? (
          <time
            dateTime={item.publishedAt.toISOString()}
            className="mb-6 block text-sm text-neutral-500"
          >
            {formatDate(item.publishedAt)}
          </time>
        ) : null}

        {item.summary ? (
          <p className="mb-8 text-lg font-medium text-neutral-700">{item.summary}</p>
        ) : null}

        <Prose content={item.body} />

        <ShareButtons url={url} title={item.title} />
      </article>
    </>
  );
}