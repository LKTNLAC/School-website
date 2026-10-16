import type { Metadata } from 'next';

import { ContactForm } from '@/components/public/contact-form';
import { PageHeader } from '@/components/public/page-header';
import { getSettings } from '@/features/settings/service';
import { buildMetadata } from '@/lib/seo';

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSettings();
  return buildMetadata({
    title: 'Liên hệ',
    description: 'Liên hệ với nhà trường.',
    path: '/lien-he',
    settings
  });
}

export default async function ContactPage() {
  const settings = await getSettings();

  return (
    <>
      <PageHeader
        title="Liên hệ"
        description="Gửi câu hỏi hoặc phản hồi tới nhà trường."
        breadcrumbs={[{ label: 'Liên hệ' }]}
      />

      <div className="mx-auto grid max-w-7xl gap-12 px-4 py-12 lg:grid-cols-2">
        <div>
          <h2 className="text-xl font-semibold text-neutral-900">Thông tin liên hệ</h2>
          <dl className="mt-6 space-y-4 text-sm">
            <div>
              <dt className="font-medium text-neutral-900">Địa chỉ</dt>
              <dd className="mt-1 text-neutral-700">
                {settings.contactAddress || '—'}
              </dd>
            </div>
            <div>
              <dt className="font-medium text-neutral-900">Điện thoại</dt>
              <dd className="mt-1 text-neutral-700">
                {settings.contactPhone || '—'}
              </dd>
            </div>
            <div>
              <dt className="font-medium text-neutral-900">Email</dt>
              <dd className="mt-1 text-neutral-700">
                {settings.contactEmail ? (
                  <a
                    href={`mailto:${settings.contactEmail}`}
                    className="text-primary-600 hover:text-primary-700"
                  >
                    {settings.contactEmail}
                  </a>
                ) : (
                  '—'
                )}
              </dd>
            </div>
            <div>
              <dt className="font-medium text-neutral-900">Giờ làm việc</dt>
              <dd className="mt-1 text-neutral-700">
                {settings.contactWorkingHours || '—'}
              </dd>
            </div>
          </dl>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-neutral-900">Gửi liên hệ</h2>
          <div className="mt-6">
            <ContactForm />
          </div>
        </div>
      </div>
    </>
  );
}