import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="mx-auto flex min-h-[60dvh] max-w-2xl flex-col items-center justify-center px-4 text-center">
      <p className="text-sm font-medium uppercase tracking-wider text-neutral-500">
        404
      </p>
      <h1 className="mt-2 text-2xl font-semibold text-neutral-900">
        Không tìm thấy trang
      </h1>
      <p className="mt-4 text-neutral-700">
        Trang bạn tìm không tồn tại hoặc đã bị di chuyển.
      </p>
      <Link
        href="/"
        className="mt-6 rounded-md bg-primary-600 px-4 py-2 text-white hover:bg-primary-700"
      >
        Về trang chủ
      </Link>
    </main>
  );
}