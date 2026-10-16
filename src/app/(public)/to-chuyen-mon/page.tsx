import type { Metadata } from 'next';

import { DepartmentCard } from '@/components/public/department-card';
import { EmptyState } from '@/components/public/empty-state';
import { PageHeader } from '@/components/public/page-header';
import { getAllDepartments } from '@/features/staff/service';
import { buildMetadata } from '@/lib/seo';

export const metadata: Metadata = buildMetadata({
  title: 'Tổ chuyên môn',
  description: 'Các tổ chuyên môn của nhà trường.',
  path: '/to-chuyen-mon'
});

export default async function DepartmentsPage() {
  const departments = await getAllDepartments();

  return (
    <>
      <PageHeader
        title="Tổ chuyên môn"
        description="Các tổ chuyên môn trong nhà trường."
        breadcrumbs={[{ label: 'Đào tạo' }, { label: 'Tổ chuyên môn' }]}
      />

      <div className="mx-auto max-w-7xl px-4 py-12">
        {departments.length === 0 ? (
          <EmptyState
            title="Chưa có tổ chuyên môn"
            description="Thông tin tổ chuyên môn sẽ được cập nhật."
          />
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {departments.map((dept) => (
              <DepartmentCard
                key={dept.id}
                href={`/to-chuyen-mon/${dept.slug}`}
                name={dept.name}
                description={dept.description}
                staffCount={dept.staff.length}
              />
            ))}
          </div>
        )}
      </div>
    </>
  );
}