'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { useState, type FormEvent } from 'react';

type Status = 'idle' | 'submitting' | 'error';

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const from = searchParams.get('from') ?? '/admin';

  const [status, setStatus] = useState<Status>('idle');
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus('submitting');
    setError(null);

    const formData = new FormData(event.currentTarget);
    const email = String(formData.get('email') ?? '');
    const password = String(formData.get('password') ?? '');

    const result = await signIn('credentials', {
      email,
      password,
      redirect: false
    });

    if (result?.error) {
      setStatus('error');
      setError('Email hoặc mật khẩu không đúng, hoặc tài khoản bị vô hiệu hóa.');
      return;
    }

    router.push(from);
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4" noValidate>
      {error ? (
        <div
          role="alert"
          className="rounded-md border border-error/30 bg-error/5 p-4 text-sm text-error"
        >
          {error}
        </div>
      ) : null}

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-neutral-900">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          autoComplete="email"
          autoFocus
          className="mt-1 h-10 w-full rounded-md border border-neutral-300 bg-white px-3 text-sm focus:border-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-100"
        />
      </div>

      <div>
        <label htmlFor="password" className="block text-sm font-medium text-neutral-900">
          Mật khẩu
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          autoComplete="current-password"
          className="mt-1 h-10 w-full rounded-md border border-neutral-300 bg-white px-3 text-sm focus:border-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-100"
        />
      </div>

      <button
        type="submit"
        disabled={status === 'submitting'}
        className="inline-flex h-11 w-full items-center justify-center rounded-md bg-primary-600 px-4 text-sm font-medium text-white hover:bg-primary-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {status === 'submitting' ? 'Đang đăng nhập...' : 'Đăng nhập'}
      </button>
    </form>
  );
}