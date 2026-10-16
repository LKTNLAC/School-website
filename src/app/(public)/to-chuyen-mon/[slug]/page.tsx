import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { EmptyState } from '@/components/public/empty-state';
import { PageHeader } from '@/components/public/page-header';
import { StaffCard } from '@/components/public/staff-card';
import { getDepartmentBySlug, getAllDepartments } from '@/features/staff/service';
import { buildMetadata } from '@/lib/seo';

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  const departments = await getAllDepartments();
  return departments.map((d) => ({ slug: d.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const dept = await getDepartmentBySlug(slug);
  if (!dept) {
    return buildMetadata({ title: 'Không tìm thấy', noIndex: true });
  }
  return buildMetadata({
    title: dept.name,
    description: dept.description ?? undefined,
    path: `/to-chuyen-mon/${dept.slug}`
  });
}

export default async function DepartmentDetailPage({ params }: Props) {
  const { slug } = await params;
  const dept = await getDepartmentBySlug(slug);

  if (!dept) notFound();

  return (
    <>
      <PageHeader
        title={dept.name}
        description={dept.description ?? undefined}
        breadcrumbs={[
          { label: 'Đào tạo' },
          { label: 'Tổ chuyên môn', href: '/to-chuyen-mon' },
          { label: dept.name }
        ]}
      />

      <div className="mx-auto max-w-7xl px-4 py-12">
        {dept.staff.length === 0 ? (
          <EmptyState
            title="Chưa có thành viên"
            description="Thông tin thành viên sẽ được cập nhật."
          />
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {dept.staff.map((s) => (
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