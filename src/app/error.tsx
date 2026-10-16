'use client';

import { useEffect } from 'react';

export default function GlobalError({
  error,
  reset
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Client error:', error.digest ?? 'unknown');
  }, [error]);

  return (
    <main className="mx-auto flex min-h-[60dvh] max-w-2xl flex-col items-center justify-center px-4 text-center">
      <h1 className="text-2xl font-semibold text-neutral-900">Đã xảy ra lỗi</h1>
      <p className="mt-4 text-neutral-700">
        Vui lòng thử lại. Nếu lỗi tiếp tục, liên hệ quản trị viên.
      </p>
      <button
        type="button"
        onClick={reset}
        className="mt-6 rounded-md bg-primary-600 px-4 py-2 text-white hover:bg-primary-700"
      >
        Thử lại
      </button>
    </main>
  );
}