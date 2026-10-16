'use client';

import { useState, type FormEvent } from 'react';

import { submitContactAction } from '@/features/contact/actions';


type Status = 'idle' | 'submitting' | 'success' | 'error';

export function ContactForm() {
  const [status, setStatus] = useState<Status>('idle');
  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const [message, setMessage] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus('submitting');
    setErrors({});
    setMessage(null);

    const formData = new FormData(event.currentTarget);
    const result = await submitContactAction(formData);

    if (result.ok) {
      setStatus('success');
      setMessage('Cảm ơn bạn đã gửi liên hệ. Chúng tôi sẽ phản hồi sớm nhất.');
      event.currentTarget.reset();
    } else {
      setStatus('error');
      setErrors(result.details ?? {});
      setMessage(result.error);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4" noValidate>
      {message ? (
        <div
          role="alert"
          className={
            status === 'success'
              ? 'rounded-md border border-success/30 bg-success/5 p-4 text-sm text-success'
              : 'rounded-md border border-error/30 bg-error/5 p-4 text-sm text-error'
          }
        >
          {message}
        </div>
      ) : null}

      <div>
        <label htmlFor="name" className="block text-sm font-medium text-neutral-900">
          Họ và tên <span className="text-error">*</span>
        </label>
        <input
          id="name"
          name="name"
          type="text"
          required
          autoComplete="name"
          aria-invalid={!!errors.name}
          aria-describedby={errors.name ? 'name-error' : undefined}
          className="mt-1 h-10 w-full rounded-md border border-neutral-200 bg-white px-3 text-sm focus:border-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-100"
        />
        {errors.name ? (
          <p id="name-error" className="mt-1 text-xs text-error">
            {errors.name.join(', ')}
          </p>
        ) : null}
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-neutral-900">
          Email <span className="text-error">*</span>
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          autoComplete="email"
          aria-invalid={!!errors.email}
          aria-describedby={errors.email ? 'email-error' : undefined}
          className="mt-1 h-10 w-full rounded-md border border-neutral-200 bg-white px-3 text-sm focus:border-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-100"
        />
        {errors.email ? (
          <p id="email-error" className="mt-1 text-xs text-error">
            {errors.email.join(', ')}
          </p>
        ) : null}
      </div>

      <div>
        <label htmlFor="message" className="block text-sm font-medium text-neutral-900">
          Nội dung <span className="text-error">*</span>
        </label>
        <textarea
          id="message"
          name="message"
          required
          rows={6}
          aria-invalid={!!errors.message}
          aria-describedby={errors.message ? 'message-error' : undefined}
          className="mt-1 w-full rounded-md border border-neutral-200 bg-white p-3 text-sm focus:border-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-100"
        />
        {errors.message ? (
          <p id="message-error" className="mt-1 text-xs text-error">
            {errors.message.join(', ')}
          </p>
        ) : null}
      </div>

      <button
        type="submit"
        disabled={status === 'submitting'}
        className="inline-flex h-10 items-center rounded-md bg-primary-600 px-6 text-sm font-medium text-white hover:bg-primary-700 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {status === 'submitting' ? 'Đang gửi...' : 'Gửi liên hệ'}
      </button>
    </form>
  );
}