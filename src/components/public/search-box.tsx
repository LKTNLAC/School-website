'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useState, type FormEvent } from 'react';

export function SearchBox() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [value, setValue] = useState(searchParams.get('q') ?? '');

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmed = value.trim();
    if (trimmed.length < 2) return;
    router.push(`/tim-kiem?q=${encodeURIComponent(trimmed)}`);
  }

  return (
    <form onSubmit={handleSubmit} role="search" className="w-full">
      <div className="flex gap-2">
        <label htmlFor="search-input" className="sr-only">
          Tìm kiếm
        </label>
        <input
          id="search-input"
          type="search"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Nhập từ khóa tìm kiếm..."
          autoComplete="off"
          className="h-11 flex-1 rounded-md border border-neutral-300 bg-white px-4 text-base focus:border-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-100"
        />
        <button
          type="submit"
          className="inline-flex h-11 items-center rounded-md bg-primary-600 px-6 text-sm font-medium text-white hover:bg-primary-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600"
        >
          Tìm kiếm
        </button>
      </div>
    </form>
  );
}