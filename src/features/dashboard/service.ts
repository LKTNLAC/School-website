import * as repository from './repository';
import type { DashboardStats, RecentAuditItem, RecentContentItem } from './types';

export async function getDashboardStats(): Promise<DashboardStats> {
  return repository.getStats();
}

export async function getRecentContent(limit = 10): Promise<RecentContentItem[]> {
  return repository.getRecentContent(limit);
}

export async function getRecentAudit(limit = 10): Promise<RecentAuditItem[]> {
  return repository.getRecentAudit(limit);
}