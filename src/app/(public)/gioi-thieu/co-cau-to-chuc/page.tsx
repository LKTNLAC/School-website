import type { Metadata } from 'next';

import { EmptyState } from '@/components/public/empty-state';
import { PageHeader } from '@/components/public/page-header';
import { StaffCard } from '@/components/public/staff-card';
import { getAllStaff, getStaffGroupedByDepartment } from '@/features/staff/service';
import { buildMetadata } from '@/lib/seo';

export const metadata: Metadata = buildMetadata({
  title: 'Cơ cấu tổ chức',
  description: 'Cơ cấu tổ chức, ban giám hiệu và tổ chuyên môn của nhà trường.',
  path: '/gioi-thieu/co-cau-to-chuc'
});

export default async function OrganizationPage() {
  const [departments, allStaff] = await Promise.all([
    getStaffGroupedByDepartment(),
    getAllStaff()
  ]);

  const hasDepartments = departments.some((d) => d.staff.length > 0);
  const hasStaff = allStaff.length > 0;

  return (
    <>
      <PageHeader
        title="Cơ cấu tổ chức"
        description="Ban giám hiệu, tổ chuyên môn và đội ngũ cán bộ, giáo viên."
        breadcrumbs={[
          { label: 'Giới thiệu', href: '/gioi-thieu' },
          { label: 'Cơ cấu tổ chức' }
        ]}
      />

      <div className="mx-auto max-w-7xl px-4 py-12">
        {!hasDepartments && !hasStaff ? (
          <EmptyState
            title="Chưa có dữ liệu"
            description="Thông tin cơ cấu tổ chức sẽ được cập nhật."
          />
        ) : null}

        {hasDepartments ? (
          <div className="space-y-12">
            {departments
              .filter((d) => d.staff.length > 0)
              .map((dept) => (
                <div key={dept.id}>
                  <h2 className="text-2xl font-semibold text-neutral-900">
                    {dept.name}
                  </h2>
                  {dept.description ? (
                    <p className="mt-2 text-sm text-neutral-600">{dept.description}</p>
                  ) : null}
                  <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {dept.staff.map((s) => (
                      <StaffCard
                        key={s.id}
                        fullName={s.fullName}
                        position={s.position}
                        email={s.email}
                      />
                    ))}
                  </div>
                </div>
              ))}
          </div>
        ) : null}

        {!hasDepartments && hasStaff ? (
          <div>
            <h2 className="text-2xl font-semibold text-neutral-900">
              Đội ngũ cán bộ, giáo viên
            </h2>
            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {allStaff.map((s) => (
                <StaffCard
                  key={s.id}
                  fullName={s.fullName}
                  position={s.position}
                  email={s.email}
                />
              ))}
            </div>
          </div>
        ) : null}
      </div>
    </>
  );
}