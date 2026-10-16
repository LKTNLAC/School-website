import * as repository from './repository';
import type { ContactInput, ContactResult } from './types';

import { sendEmail } from '@/lib/email';
import { logger } from '@/lib/logger';


export async function submitContact(input: ContactInput): Promise<ContactResult> {
  const submissionId = await repository.createSubmission(input);

  const adminEmail = process.env.EMAIL_TO;
  if (!adminEmail) {
    logger.warn('EMAIL_TO chưa cấu hình — bỏ qua gửi email');
    await repository.markFailed(submissionId);
    return { ok: true, id: submissionId };
  }

  const result = await sendEmail({
    to: adminEmail,
    subject: `[Liên hệ] ${input.name}`,
    text: `Từ: ${input.name} <${input.email}>\n\n${input.message}`,
    idempotencyKey: submissionId
  });

  if (result.ok) {
    await repository.markSent(submissionId, result.providerMessageId);
  } else {
    await repository.markFailed(submissionId);
  }

  return { ok: true, id: submissionId };
}