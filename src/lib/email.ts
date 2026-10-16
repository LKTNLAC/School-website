import { logger } from '@/lib/logger';

export type SendEmailInput = {
  to: string;
  subject: string;
  text: string;
  idempotencyKey?: string;
};

export type SendEmailResult =
  | { ok: true; providerMessageId: string }
  | { ok: false; error: string };

/**
 * Adapter email — giả định Resend.
 * Khi chọn provider thực tế, thay thế implementation.
 */
export async function sendEmail(input: SendEmailInput): Promise<SendEmailResult> {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.EMAIL_FROM;

  if (!apiKey || !from) {
    logger.warn('Email chưa được cấu hình — bỏ qua gửi');
    return { ok: false, error: 'EMAIL_NOT_CONFIGURED' };
  }

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
        ...(input.idempotencyKey ? { 'Idempotency-Key': input.idempotencyKey } : {})
      },
      body: JSON.stringify({
        from,
        to: input.to,
        subject: input.subject,
        text: input.text
      }),
      signal: AbortSignal.timeout(10_000)
    });

    if (!response.ok) {
      const body = await response.text().catch(() => '');
      logger.warn('Gửi email thất bại', {
        status: response.status,
        body: body.slice(0, 200)
      });
      return { ok: false, error: `HTTP_${response.status}` };
    }

    const data = (await response.json()) as { id?: string };
    return { ok: true, providerMessageId: data.id ?? 'unknown' };
  } catch (err) {
    logger.error('Lỗi gửi email', {
      error: err instanceof Error ? err.message : 'unknown'
    });
    return { ok: false, error: 'NETWORK_ERROR' };
  }
}