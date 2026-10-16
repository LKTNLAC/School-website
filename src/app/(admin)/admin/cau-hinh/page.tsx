import type { Metadata } from 'next';
import { redirect } from 'next/navigation';

import { AdminPageHeader } from '@/components/admin/admin-page-header';
import { SettingsForm } from '@/components/admin/settings-form';
import { getSettings } from '@/features/settings/service';
import { requireAuth } from '@/lib/auth-guard';
import { buildMetadata } from '@/lib/seo';

export const metadata: Metadata = buildMetadata({
  title: 'Cấu hình hệ thống',
  noIndex: true
});

export default async function AdminSettingsPage() {
  const user = await requireAuth();
  if (user.role !== 'ADMIN') redirect('/admin');

  const settings = await getSettings();

  return (
    <div className="max-w-3xl">
      <AdminPageHeader
        title="Cấu hình hệ thống"
        description="Thông tin chung, liên hệ và SEO mặc định của website."
        breadcrumbs={[{ label: 'Cấu hình' }]}
      />

      <div className="rounded-lg border border-neutral-200 bg-white p-6">
        <SettingsForm initial={settings} />
      </div>
    </div>
  );
}