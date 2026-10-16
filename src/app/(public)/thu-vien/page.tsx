import type { Metadata } from 'next';

import { AlbumCard } from '@/components/public/album-card';
import { EmptyState } from '@/components/public/empty-state';
import { PageHeader } from '@/components/public/page-header';
import { getAllAlbums } from '@/features/media/service';
import { buildMetadata } from '@/lib/seo';

export const metadata: Metadata = buildMetadata({
  title: 'Thư viện',
  description: 'Thư viện ảnh và video của nhà trường.',
  path: '/thu-vien'
});

export default async function LibraryPage() {
  const albums = await getAllAlbums();

  return (
    <>
      <PageHeader
        title="Thư viện"
        description="Thư viện ảnh và video hoạt động của nhà trường."
        breadcrumbs={[{ label: 'Thư viện' }]}
      />

      <div className="mx-auto max-w-7xl px-4 py-12">
        {albums.length === 0 ? (
          <EmptyState
            title="Chưa có album"
            description="Thư viện ảnh sẽ được cập nhật."
          />
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {albums.map((album) => (
              <AlbumCard
                key={album.id}
                href={`/thu-vien/${album.slug}`}
                name={album.name}
                assetCount={album.assetCount}
              />
            ))}
          </div>
        )}
      </div>
    </>
  );
}