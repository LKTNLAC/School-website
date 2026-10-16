'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useState, type FormEvent } from 'react';

type AuditFilterProps = {
  actions: string[];
  entityTypes: string[];
};

export function AuditFilter({ actions, entityTypes }: AuditFilterProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [action, setAction] = useState(searchParams.get('action') ?? '');
  const [entityType, setEntityType] = useState(searchParams.get('entityType') ?? '');

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const params = new URLSearchParams();
    if (action) params.set('action', action);
    if (entityType) params.set('entityType', entityType);
    router.push(`/admin/nhat-ky?${params.toString()}`);
  }

  function handleReset() {
    setAction('');
    setEntityType('');
    router.push('/admin/nhat-ky');
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-wrap items-end gap-3">
      <div>
        <label htmlFor="filter-action" className="block text-xs font-medium text-neutral-600">
          Hành động
        </label>
        <select
          id="filter-action"
          value={action}
          onChange={(e) => setAction(e.target.value)}
          className="mt-1 h-10 rounded-md border border-neutral-300 bg-white px-3 text-sm focus:border-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-100"
        >
          <option value="">Tất cả</option>
          {actions.map((a) => (
            <option key={a} value={a}>
              {a}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label
          htmlFor="filter-entity"
          className="block text-xs font-medium text-neutral-600"
        >
          Đối tượng
        </label>
        <select
          id="filter-entity"
          value={entityType}
          onChange={(e) => setEntityType(e.target.value)}
          className="mt-1 h-10 rounded-md border border-neutral-300 bg-white px-3 text-sm focus:border-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-100"
        >
          <option value="">Tất cả</option>
          {entityTypes.map((e) => (
            <option key={e} value={e}>
              {e}
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