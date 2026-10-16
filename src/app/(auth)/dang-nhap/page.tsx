import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { Suspense } from 'react';

import { LoginForm } from '@/components/admin/login-form';
import { siteConfig } from '@/config/site';
import { auth } from '@/lib/auth';
import { buildMetadata } from '@/lib/seo';

export const metadata: Metadata = buildMetadata({
  title: 'Đăng nhập',
  noIndex: true
});

export default async function LoginPage() {
  // Chỉ redirect nếu có session Auth.js hợp lệ
  const session = await auth();
  if (session?.user?.id) {
    redirect('/admin');
  }

  return (
    <div className="flex min-h-dvh items-center justify-center bg-neutral-50 px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center">
          <div
            aria-hidden="true"
            className="mx-auto flex h-12 w-12 items-center justify-center rounded-md bg-primary-600 text-base font-bold text-white"
          >
            TH
          </div>
          <h1 className="mt-4 text-2xl font-bold text-neutral-900">
            Đăng nhập quản trị
          </h1>
          <p className="mt-2 text-sm text-neutral-600">{siteConfig.name}</p>
        </div>

        <div className="mt-8 rounded-lg border border-neutral-200 bg-white p-6 shadow-sm">
          <Suspense fallback={<div className="h-64" />}>
            <LoginForm />
          </Suspense>
        </div>

        <p className="mt-6 text-center text-xs text-neutral-500">
          Chỉ dành cho quản trị viên và biên tập viên được ủy quyền.
        </p>
      </div>
    </div>
  );
}