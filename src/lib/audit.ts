import { prisma } from '@/lib/db';
import { logger } from '@/lib/logger';

type AuditInput = {
  actorId: string | null;
  action: string;
  entityType: string;
  entityId: string;
  metadata?: Record<string, unknown>;
};

const FORBIDDEN_KEYS = new Set([
  'password',
  'passwordHash',
  'token',
  'accessToken',
  'refreshToken',
  'secret'
]);

function sanitize(metadata: Record<string, unknown> | undefined) {
  if (!metadata) return null;
  const out: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(metadata)) {
    if (FORBIDDEN_KEYS.has(k)) continue;
    out[k] = v;
  }
  return out;
}

export async function recordAudit(input: AuditInput): Promise<void> {
  try {
    await prisma.auditLog.create({
      data: {
        actorId: input.actorId,
        action: input.action,
        entityType: input.entityType,
        entityId: input.entityId,
        metadata: sanitize(input.metadata) as never
      }
    });
  } catch (err) {
    logger.error('Ghi audit log thất bại', {
      action: input.action,
      entityType: input.entityType,
      error: err instanceof Error ? err.message : 'unknown'
    });
  }
}