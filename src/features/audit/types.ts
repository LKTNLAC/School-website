export type AuditListItem = {
  id: string;
  action: string;
  entityType: string;
  entityId: string;
  entityIdShort: string;
  createdAt: Date;
  actorName: string | null;
  actorId: string | null;
  metadata: Record<string, unknown> | null;
};

export type AuditFilter = {
  action?: string;
  entityType?: string;
  actorId?: string;
  page?: number;
  pageSize?: number;
};

export type AuditListResult = {
  items: AuditListItem[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
};

// VIEWER chỉ thấy các action được phép
export const VIEWER_ALLOWED_ACTIONS = [
  'content.create',
  'content.update',
  'content.publish',
  'content.archive',
  'content.rollback',
  'media.upload'
] as const;