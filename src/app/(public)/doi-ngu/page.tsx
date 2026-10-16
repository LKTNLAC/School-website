import type { Metadata } from 'next';

import { EmptyState } from '@/components/public/empty-state';
import { PageHeader } from '@/components/public/page-header';
import { StaffCard } from '@/components/public/staff-card';
import { getAllStaff } from '@/features/staff/service';
import { buildMetadata } from '@/lib/seo';

export const metadata: Metadata = buildMetadata({
  title: 'Đội ngũ giáo viên',
  description: 'Đội ngũ giáo viên và cán bộ nhà trường.',
  path: '/doi-ngu'
});

export default async function StaffPage() {
  const staff = await getAllStaff();

  return (
    <>
      <PageHeader
        title="Đội ngũ giáo viên"
        description="Đội ngũ cán bộ, giáo viên nhà trường."
        breadcrumbs={[{ label: 'Đào tạo' }, { label: 'Đội ngũ' }]}
      />

      <div className="mx-auto max-w-7xl px-4 py-12">
        {staff.length === 0 ? (
          <EmptyState
            title="Chưa có dữ liệu"
            description="Thông tin đội ngũ sẽ được cập nhật."
          />
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {staff.map((s) => (
              <StaffCard
                key={s.id}
                fullName={s.fullName}
                position={s.position}
                email={s.email}
              />
            ))}
          </div>
        )}
      </div>
    </>
  );
}