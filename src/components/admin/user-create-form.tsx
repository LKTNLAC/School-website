'use client';

import { useRouter } from 'next/navigation';
import { useState, type FormEvent } from 'react';

import { createUserAction } from '@/features/users/actions';

const ROLE_OPTIONS = [
  { value: 'EDITOR', label: 'Biên tập viên' },
  { value: 'CONTRIBUTOR', label: 'Cộng tác viên' },
  { value: 'VIEWER', label: 'Người xem' },
  { value: 'ADMIN', label: 'Quản trị viên' }
];

export function UserCreateForm() {
  const router = useRouter();
  const [status, setStatus] = useState<'idle' | 'submitting' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus('submitting');
    setErrorMessage(null);
    setFieldErrors({});

    const result = await createUserAction(new FormData(event.currentTarget));
    if (result.ok) {
      router.push('/admin/nguoi-dung');
      router.refresh();
    } else {
      setStatus('error');
      setErrorMessage(result.error);
      setFieldErrors(result.details ?? {});
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {errorMessage ? (
        <div
          role="alert"
          className="rounded-md border border-error/30 bg-error/5 p-4 text-sm text-error"
        >
          {errorMessage}
        </div>
      ) : null}

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-neutral-900">
          Email <span className="text-error">*</span>
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          className="mt-1 h-10 w-full rounded-md border border-neutral-300 bg-white px-3 text-sm focus:border-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-100"
        />
        {fieldErrors.email ? (
          <p className="mt-1 text-xs text-error">{fieldErrors.email.join(', ')}</p>
        ) : null}
      </div>

      <div>
        <label htmlFor="name" className="block text-sm font-medium text-neutral-900">
          Họ tên <span className="text-error">*</span>
        </label>
        <input
          id="name"
          name="name"
          type="text"
          required
          className="mt-1 h-10 w-full rounded-md border border-neutral-300 bg-white px-3 text-sm focus:border-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-100"
        />
        {fieldErrors.name ? (
          <p className="mt-1 text-xs text-error">{fieldErrors.name.join(', ')}</p>
        ) : null}
      </div>

      <div>
        <label htmlFor="password" className="block text-sm font-medium text-neutral-900">
          Mật khẩu <span className="text-error">*</span>
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          minLength={8}
          autoComplete="new-password"
          className="mt-1 h-10 w-full rounded-md border border-neutral-300 bg-white px-3 text-sm focus:border-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-100"
        />
        <p className="mt-1 text-xs text-neutral-500">
          Ít nhất 8 ký tự, có chữ hoa, chữ thường và số.
        </p>
        {fieldErrors.password ? (
          <p className="mt-1 text-xs text-error">{fieldErrors.password.join(', ')}</p>
        ) : null}
      </div>

      <div>
        <label htmlFor="role" className="block text-sm font-medium text-neutral-900">
          Vai trò <span className="text-error">*</span>
        </label>
        <select
          id="role"
          name="role"
          required
          defaultValue="EDITOR"
          className="mt-1 h-10 w-full rounded-md border border-neutral-300 bg-white px-3 text-sm focus:border-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-100"
        >
          {ROLE_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      <div className="flex items-center gap-3 border-t border-neutral-200 pt-6">
        <button
          type="submit"
          disabled={status === 'submitting'}
          className="inline-flex h-10 items-center rounded-md bg-primary-600 px-6 text-sm font-medium text-white hover:bg-primary-700 disabled:opacity-50"
        >
          {status === 'submitting' ? 'Đang tạo...' : 'Tạo tài khoản'}
        </button>
        <button
          type="button"
          onClick={() => router.push('/admin/nguoi-dung')}
          className="inline-flex h-10 items-center rounded-md border border-neutral-300 px-6 text-sm text-neutral-700 hover:bg-neutral-50"
        >
          Hủy
        </button>
      </div>
    </form>
  );
}