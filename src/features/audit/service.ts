
import * as repository from './repository';
import {
  VIEWER_ALLOWED_ACTIONS,
  type AuditFilter,
  type AuditListResult
} from './types';

import type { UserRole } from '@/types';

export async function getAuditLogs(
  filter: AuditFilter,
  role: UserRole
): Promise<AuditListResult> {
  const allowed = role === 'VIEWER' ? VIEWER_ALLOWED_ACTIONS : null;
  return repository.findAuditLogs(filter, allowed);
}

export async function getDistinctActions(): Promise<string[]> {
  return repository.findDistinctActions();
}

export async function getDistinctEntityTypes(): Promise<string[]> {
  return repository.findDistinctEntityTypes();
}