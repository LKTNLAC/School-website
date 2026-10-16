'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useState, type FormEvent } from 'react';

const TYPE_OPTIONS = [
  { value: '', label: 'Tất cả loại' },
  { value: 'PAGE', label: 'Trang' },
  { value: 'NEWS', label: 'Tin tức' },
  { value: 'ANNOUNCEMENT', label: 'Thông báo' }
];

const STATUS_OPTIONS = [
  { value: '', label: 'Tất cả trạng thái' },
  { value: 'DRAFT', label: 'Nháp' },
  { value: 'IN_REVIEW', label: 'Chờ duyệt' },
  { value: 'PUBLISHED', label: 'Đã xuất bản' },
  { value: 'ARCHIVED', label: 'Lưu trữ' }
];

export function ContentFilter() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [type, setType] = useState(searchParams.get('type') ?? '');
  const [status, setStatus] = useState(searchParams.get('status') ?? '');
  const [search, setSearch] = useState(searchParams.get('q') ?? '');

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const params = new URLSearchParams();
    if (type) params.set('type', type);
    if (status) params.set('status', status);
    if (search.trim()) params.set('q', search.trim());
    router.push(`/admin/noi-dung?${params.toString()}`);
  }

  function handleReset() {
    setType('');
    setStatus('');
    setSearch('');
    router.push('/admin/noi-dung');
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-wrap items-end gap-3">
      <div className="flex-1 min-w-[200px]">
        <label htmlFor="filter-search" className="block text-xs font-medium text-neutral-600">
          Tìm kiếm
        </label>
        <input
          id="filter-search"
          type="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Tiêu đề hoặc slug..."
          className="mt-1 h-10 w-full rounded-md border border-neutral-300 bg-white px-3 text-sm focus:border-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-100"
        />
      </div>

      <div>
        <label htmlFor="filter-type" className="block text-xs font-medium text-neutral-600">
          Loại
        </label>
        <select
          id="filter-type"
          value={type}
          onChange={(e) => setType(e.target.value)}
          className="mt-1 h-10 rounded-md border border-neutral-300 bg-white px-3 text-sm focus:border-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-100"
        >
          {TYPE_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="filter-status" className="block text-xs font-medium text-neutral-600">
          Trạng thái
        </label>
        <select
          id="filter-status"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="mt-1 h-10 rounded-md border border-neutral-300 bg-white px-3 text-sm focus:border-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-100"
        >
          {STATUS_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      <button
        type="submit"
        className="h-10 rounded-md bg-primary-600 px-4 text-sm font-medium text-white hover:bg-primary-700"
      >
        Lọc
      </button>
      <button
        type="button"
        onClick={handleReset}
        className="h-10 rounded-md border border-neutral-300 px-4 text-sm text-neutral-700 hover:bg-neutral-50"
      >
        Xóa lọc
      </button>
    </form>
  );
}