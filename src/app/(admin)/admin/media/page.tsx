import type { Metadata } from 'next';

import { AdminPageHeader } from '@/components/admin/admin-page-header';
import { MediaGrid } from '@/components/admin/media-grid';
import { MediaUploadForm } from '@/components/admin/media-upload-form';
import { getAlbumOptions, getAssets } from '@/features/media/service';
import { buildMetadata } from '@/lib/seo';

export const metadata: Metadata = buildMetadata({
  title: 'Quản lý media',
  noIndex: true
});

export default async function AdminMediaPage() {
  const [assets, albums] = await Promise.all([
    getAssets(48),
    getAlbumOptions()
  ]);

  return (
    <div>
      <AdminPageHeader
        title="Quản lý media"
        description={`Tổng ${assets.length} file.`}
        breadcrumbs={[{ label: 'Media' }]}
      />

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-1">
          <div className="rounded-lg border border-neutral-200 bg-white p-6">
            <h2 className="mb-4 text-base font-semibold text-neutral-900">
              Upload file mới
            </h2>
            <MediaUploadForm albums={albums} />
          </div>
        </div>

        <div className="lg:col-span-2">
          <MediaGrid assets={assets} />
        </div>
      </div>
    </div>
  );
}