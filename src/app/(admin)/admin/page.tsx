import type { Metadata } from 'next';

import { AdminPageHeader } from '@/components/admin/admin-page-header';
import { DashboardQuickActions } from '@/components/admin/dashboard-quick-actions';
import { RecentAuditList, RecentContentList } from '@/components/admin/dashboard-recent-list';
import { DashboardStatCard } from '@/components/admin/dashboard-stat-card';
import {
  getDashboardStats,
  getRecentAudit,
  getRecentContent
} from '@/features/dashboard/service';
import { getSessionUser } from '@/lib/auth-guard';
import { buildMetadata } from '@/lib/seo';

export const metadata: Metadata = buildMetadata({
  title: 'Dashboard',
  noIndex: true
});

export default async function AdminDashboardPage() {
  const user = await getSessionUser();

  const [stats, recentContent, recentAudit] = await Promise.all([
    getDashboardStats(),
    getRecentContent(8),
    getRecentAudit(6)
  ]);

  return (
    <div>
      <AdminPageHeader
        title={`Xin chào, ${user?.name ?? 'Admin'}`}
        description="Tổng quan về nội dung và hoạt động của website."
      />

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <DashboardStatCard
          label="Tin tức"
          value={stats.newsCount}
          href="/admin/tin-tuc"
          tone="primary"
        />
        <DashboardStatCard
          label="Thông báo"
          value={stats.announcementCount}
          href="/admin/noi-dung"
          tone="primary"
        />
        <DashboardStatCard
          label="Sự kiện"
          value={stats.eventCount}
          href="/admin/su-kien"
          tone="primary"
        />
        <DashboardStatCard
          label="Tài liệu"
          value={stats.documentCount}
          href="/admin/tai-lieu"
          tone="primary"
        />
      </div>

      {/* Trạng thái xuất bản */}
      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <DashboardStatCard
          label="Đã xuất bản"
          value={stats.publishedCount}
          tone="success"
        />
        <DashboardStatCard
          label="Bản nháp"
          value={stats.draftCount}
          tone="warning"
        />
      </div>

      {/* Recent + Quick actions */}
      <div className="mt-8 grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div className="rounded-lg border border-neutral-200 bg-white p-6">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-semibold text-neutral-900">
                Nội dung cập nhật gần đây
              </h2>
            </div>
            <div className="mt-4">
              <RecentContentList items={recentContent} />
            </div>
          </div>

          <div className="mt-6 rounded-lg border border-neutral-200 bg-white p-6">
            <h2 className="text-base font-semibold text-neutral-900">
              Hoạt động gần đây
            </h2>
            <div className="mt-4">
              <RecentAuditList items={recentAudit} />
            </div>
          </div>
        </div>

        <div>
          <div className="rounded-lg border border-neutral-200 bg-white p-6">
            <h2 className="text-base font-semibold text-neutral-900">
              Thao tác nhanh
            </h2>
            <div className="mt-4">
              <DashboardQuickActions />
            </div>
          </div>

          <div className="mt-6 rounded-lg border border-neutral-200 bg-white p-6">
            <h2 className="text-base font-semibold text-neutral-900">
              Trạng thái hệ thống
            </h2>
            <ul className="mt-4 space-y-2 text-sm">
              <li className="flex items-center justify-between">
                <span className="text-neutral-600">Cơ sở dữ liệu</span>
                <span className="inline-flex items-center gap-1 text-success">
                  <span className="h-2 w-2 rounded-full bg-success" />
                  Hoạt động
                </span>
              </li>
              <li className="flex items-center justify-between">
                <span className="text-neutral-600">Bảo mật</span>
                <span className="inline-flex items-center gap-1 text-warning">
                  <span className="h-2 w-2 rounded-full bg-warning" />
                  Có nợ kỹ thuật
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}