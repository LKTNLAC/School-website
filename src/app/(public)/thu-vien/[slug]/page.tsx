
import { EmptyState } from '@/components/public/empty-state';
import { PageHeader } from '@/components/public/page-header';

type Props = { params: Promise<{ slug: string }> };

export default async function AlbumDetailPage({ params }: Props) {
  const { slug } = await params;
  return (
    <>
      <PageHeader title="Album" breadcrumbs={[{ label: 'Thư viện', href: '/thu-vien' }, { label: slug }]} />
      <div className="mx-auto max-w-7xl px-4 py-12">
        <EmptyState title="Chưa có ảnh" description="Album sẽ được cập nhật." />
      </div>
    </>
  );
}