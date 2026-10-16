import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { PageHeader } from '@/components/public/page-header';
import { Prose } from '@/components/public/prose';
import { ShareButtons } from '@/components/public/share-buttons';
import { getNewsBySlug } from '@/features/news/service';
import { buildMetadata } from '@/lib/seo';
import { formatDate } from '@/lib/utils';

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const article = await getNewsBySlug(slug);
  if (!article) {
    return buildMetadata({ title: 'Không tìm thấy', noIndex: true });
  }
  return buildMetadata({
    title: article.seoTitle ?? article.title,
    description: article.seoDescription ?? article.summary ?? undefined,
    path: `/tin-tuc/${article.slug}`
  });
}

export default async function NewsDetailPage({ params }: Props) {
  const { slug } = await params;
  const article = await getNewsBySlug(slug);

  if (!article) notFound();

  const url = `/${'tin-tuc'}/${article.slug}`;

  return (
    <>
      <PageHeader
        title={article.title}
        breadcrumbs={[
          { label: 'Tin tức', href: '/tin-tuc' },
          { label: article.title }
        ]}
      />

      <article className="mx-auto max-w-3xl px-4 py-12">
        <div className="mb-6 flex flex-wrap items-center gap-4 text-sm text-neutral-500">
          {article.publishedAt ? (
            <time dateTime={article.publishedAt.toISOString()}>
              {formatDate(article.publishedAt)}
            </time>
          ) : null}
          {article.category ? (
            <span className="rounded-full bg-primary-50 px-2 py-0.5 text-xs font-medium text-primary-700">
              {article.category.name}
            </span>
          ) : null}
        </div>

        {article.summary ? (
          <p className="mb-8 text-lg font-medium text-neutral-700">
            {article.summary}
          </p>
        ) : null}

        <Prose content={article.body} />

        <ShareButtons url={url} title={article.title} />
      </article>
    </>
  );
}