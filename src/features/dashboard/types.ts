export type DashboardStats = {
  newsCount: number;
  announcementCount: number;
  eventCount: number;
  documentCount: number;
  publishedCount: number;
  draftCount: number;
};

export type RecentContentItem = {
  id: string;
  type: 'PAGE' | 'NEWS' | 'ANNOUNCEMENT';
  title: string;
  slug: string;
  status: string;
  updatedAt: Date;
  href: string;
};

export type RecentAuditItem = {
  id: string;
  action: string;
  entityType: string;
  entityId: string;
  createdAt: Date;
  actorName: string | null;
};