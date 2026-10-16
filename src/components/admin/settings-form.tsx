'use client';

import { useRouter } from 'next/navigation';
import { useState, type FormEvent } from 'react';

import { updateSettingsAction } from '@/features/settings/actions';
import type { SiteSettings } from '@/features/settings/types';

export function SettingsForm({ initial }: { initial: SiteSettings }) {
  const router = useRouter();
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus('submitting');
    setMessage(null);
    setFieldErrors({});

    const result = await updateSettingsAction(new FormData(event.currentTarget));

    if (result.ok) {
      setStatus('success');
      setMessage(result.message);
      router.refresh();
    } else {
      setStatus('error');
      setMessage(result.error);
      setFieldErrors(result.details ?? {});
    }
  }

  function FieldError({ name }: { name: string }) {
    const errors = fieldErrors[name];
    if (!errors || errors.length === 0) return null;
    return <p className="mt-1 text-xs text-error">{errors.join(', ')}</p>;
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
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

      <section>
        <h2 className="mb-4 text-base font-semibold text-neutral-900">
          Thông tin chung
        </h2>
        <div className="space-y-4">
          <div>
            <label htmlFor="siteName" className="block text-sm font-medium text-neutral-900">
              Tên site <span className="text-error">*</span>
            </label>
            <input
              id="siteName"
              name="siteName"
              type="text"
              defaultValue={initial.siteName}
              required
              className="mt-1 h-10 w-full rounded-md border border-neutral-300 bg-white px-3 text-sm focus:border-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-100"
            />
            <FieldError name="siteName" />
          </div>

          <div>
            <label
              htmlFor="siteDescription"
              className="block text-sm font-medium text-neutral-900"
            >
              Mô tả ngắn
            </label>
            <textarea
              id="siteDescription"
              name="siteDescription"
              defaultValue={initial.siteDescription}
              rows={3}
              maxLength={500}
              className="mt-1 w-full rounded-md border border-neutral-300 bg-white p-3 text-sm focus:border-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-100"
            />
            <FieldError name="siteDescription" />
          </div>

          <div>
            <label
              htmlFor="footerCopyright"
              className="block text-sm font-medium text-neutral-900"
            >
              Dòng bản quyền (footer)
            </label>
            <input
              id="footerCopyright"
              name="footerCopyright"
              type="text"
              defaultValue={initial.footerCopyright}
              className="mt-1 h-10 w-full rounded-md border border-neutral-300 bg-white px-3 text-sm focus:border-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-100"
            />
            <FieldError name="footerCopyright" />
          </div>
        </div>
      </section>

      <section>
        <h2 className="mb-4 text-base font-semibold text-neutral-900">
          Thông tin liên hệ
        </h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label
              htmlFor="contactAddress"
              className="block text-sm font-medium text-neutral-900"
            >
              Địa chỉ
            </label>
            <input
              id="contactAddress"
              name="contactAddress"
              type="text"
              defaultValue={initial.contactAddress}
              className="mt-1 h-10 w-full rounded-md border border-neutral-300 bg-white px-3 text-sm focus:border-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-100"
            />
            <FieldError name="contactAddress" />
          </div>

          <div>
            <label
              htmlFor="contactPhone"
              className="block text-sm font-medium text-neutral-900"
            >
              Điện thoại
            </label>
            <input
              id="contactPhone"
              name="contactPhone"
              type="text"
              defaultValue={initial.contactPhone}
              className="mt-1 h-10 w-full rounded-md border border-neutral-300 bg-white px-3 text-sm focus:border-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-100"
            />
            <FieldError name="contactPhone" />
          </div>

          <div>
            <label
              htmlFor="contactEmail"
              className="block text-sm font-medium text-neutral-900"
            >
              Email <span className="text-error">*</span>
            </label>
            <input
              id="contactEmail"
              name="contactEmail"
              type="email"
              defaultValue={initial.contactEmail}
              required
              className="mt-1 h-10 w-full rounded-md border border-neutral-300 bg-white px-3 text-sm focus:border-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-100"
            />
            <FieldError name="contactEmail" />
          </div>

          <div className="sm:col-span-2">
            <label
              htmlFor="contactWorkingHours"
              className="block text-sm font-medium text-neutral-900"
            >
              Giờ làm việc
            </label>
            <input
              id="contactWorkingHours"
              name="contactWorkingHours"
              type="text"
              defaultValue={initial.contactWorkingHours}
              className="mt-1 h-10 w-full rounded-md border border-neutral-300 bg-white px-3 text-sm focus:border-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-100"
            />
            <FieldError name="contactWorkingHours" />
          </div>
        </div>
      </section>

      <section>
        <h2 className="mb-4 text-base font-semibold text-neutral-900">
          SEO mặc định
        </h2>
        <div className="space-y-4">
          <div>
            <label
              htmlFor="seoDefaultTitle"
              className="block text-sm font-medium text-neutral-900"
            >
              Title mặc định
            </label>
            <input
              id="seoDefaultTitle"
              name="seoDefaultTitle"
              type="text"
              defaultValue={initial.seoDefaultTitle}
              className="mt-1 h-10 w-full rounded-md border border-neutral-300 bg-white px-3 text-sm focus:border-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-100"
            />
            <FieldError name="seoDefaultTitle" />
          </div>

          <div>
            <label
              htmlFor="seoDefaultDescription"
              className="block text-sm font-medium text-neutral-900"
            >
              Description mặc định
            </label>
            <textarea
              id="seoDefaultDescription"
              name="seoDefaultDescription"
              defaultValue={initial.seoDefaultDescription}
              rows={3}
              maxLength={300}
              className="mt-1 w-full rounded-md border border-neutral-300 bg-white p-3 text-sm focus:border-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-100"
            />
            <FieldError name="seoDefaultDescription" />
          </div>
        </div>
      </section>

      <div className="flex items-center gap-3 border-t border-neutral-200 pt-6">
        <button
          type="submit"
          disabled={status === 'submitting'}
          className="inline-flex h-10 items-center rounded-md bg-primary-600 px-6 text-sm font-medium text-white hover:bg-primary-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {status === 'submitting' ? 'Đang lưu...' : 'Lưu cấu hình'}
        </button>
      </div>
    </form>
  );
}