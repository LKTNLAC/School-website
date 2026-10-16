import type { ContactInput } from './types';

import { prisma } from '@/lib/db';


export async function createSubmission(input: ContactInput): Promise<string> {
  const submission = await prisma.contactSubmission.create({
    data: {
      name: input.name,
      email: input.email,
      message: input.message,
      status: 'PENDING'
    }
  });
  return submission.id;
}

export async function markSent(id: string, providerMessageId: string): Promise<void> {
  await prisma.contactSubmission.update({
    where: { id },
    data: {
      status: 'SENT',
      attemptCount: { increment: 1 },
      lastAttemptAt: new Date(),
      providerMessageId
    }
  });
}

export async function markFailed(id: string): Promise<void> {
  await prisma.contactSubmission.update({
    where: { id },
    data: {
      status: 'FAILED',
      attemptCount: { increment: 1 },
      lastAttemptAt: new Date()
    }
  });
}