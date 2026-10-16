'use server';

import { headers } from 'next/headers';


import { contactSchema } from './schema';
import { submitContact } from './service';
import type { ContactResult } from './types';

import { getClientKey, rateLimit } from '@/lib/rate-limit';

export async function submitContactAction(formData: FormData): Promise<ContactResult> {
  const headersList = await headers();
  const key = getClientKey(headersList, 'contact');
  const limit = rateLimit(key, 5, 60_000);

  if (!limit.allowed) {
    return {
      ok: false,
      error: 'Bạn đã gửi quá nhiều yêu cầu. Vui lòng thử lại sau 1 phút.'
    };
  }

  const parsed = contactSchema.safeParse({
    name: formData.get('name'),
    email: formData.get('email'),
    message: formData.get('message')
  });

  if (!parsed.success) {
    return {
      ok: false,
      error: 'Dữ liệu không hợp lệ',
      details: parsed.error.flatten().fieldErrors as Record<string, string[]>
    };
  }

  return submitContact(parsed.data);
}