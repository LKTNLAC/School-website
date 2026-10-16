'use client';

import { useRouter } from 'next/navigation';
import { useState, type FormEvent } from 'react';

import { createDocumentAction, updateDocumentAction } from '@/features/documents/actions';
import { slugify } from '@/lib/utils';

type DocumentFormProps = {
  mode: 'create' | 'edit';
  initial?: {
    id?: string;
    title: string;
    slug: string;
    status: string;
  };
};

export function DocumentForm({ mode, initial }: DocumentFormProps) {
  const router = useRouter();

  const [title, setTitle] = useState(initial?.title ?? '');
  const [slug, setSlug] = useState(initial?.slug ?? '');
  const [status, setStatus] = useState(initial?.status ?? 'DRAFT');
  const [slugTouched, setSlugTouched] = useState(!!initial?.slug);

  const [status_, setStatus_] = useState<'idle' | 'submitting' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});

  function handleTitleChange(value: string) {
    setTitle(value);
    if (!slugTouched) setSlug(slugify(value));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus_('submitting');
    setErrorMessage(null);
    setFieldErrors({});

    const formData = new FormData();
    if (initial?.id) formData.set('id', initial.id);
    formData.set('title', title);
    formData.set('slug', slug);
    formData.set('status', status);

    const action = mode === 'create' ? createDocumentAction : updateDocumentAction;
    const result = await action(formData);

    if (result.ok) {
      router.push('/admin/tai-lieu');
      router.refresh();
    } else {
      setStatus_('error');
      setErrorMessage(result.error);
      setFieldErrors(result.details ?? {});
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {errorMessage ? (
        <div
          role="alert"
          className="rounded-md border border-error/30 bg-error/5 p-4 text-sm text-error"
        >
          {errorMessage}
        </div>
      ) : null}

      <div>
        <label htmlFor="title" className="block text-sm font-medium text-neutral-900">
          Tiêu đề <span className="text-error">*</span>
        </label>
        <input
          id="title"
          type="text"
          value={title}
          onChange={(e) => handleTitleChange(e.target.value)}
          required
          className="mt-1 h-10 w-full rounded-md border border-neutral-300 bg-white px-3 text-sm focus:border-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-100"
        />
        {fieldErrors.title ? (
          <p className="mt-1 text-xs text-error">{fieldErrors.title.join(', ')}</p>
        ) : null}
      </div>

      <div>
        <label htmlFor="slug" className="block text-sm font-medium text-neutral-900">
          Slug <span className="text-error">*</span>
        </label>
        <input
          id="slug"
          type="text"
          value={slug}
          onChange={(e) => {
            setSlugTouched(true);
            setSlug(e.target.value);
          }}
          required
          className="mt-1 h-10 w-full rounded-md border border-neutral-300 bg-white px-3 font-mono text-sm focus:border-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-100"
        />
        {fieldErrors.slug ? (
          <p className="mt-1 text-xs text-error">{fieldErrors.slug.join(', ')}</p>
        ) : null}
      </div>

      <div>
        <label htmlFor="status" className="block text-sm font-medium text-neutral-900">
          Trạng thái
        </label>
        <select
          id="status"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="mt-1 h-10 w-full rounded-md border border-neutral-300 bg-white px-3 text-sm focus:border-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-100"
        >
          <option value="DRAFT">Nháp</option>
          <option value="PUBLISHED">Đã xuất bản</option>
        </select>
      </div>

      <div className="flex items-center gap-3 border-t border-neutral-200 pt-6">
        <button
          type="submit"
          disabled={status_ === 'submitting'}
          className="inline-flex h-10 items-center rounded-md bg-primary-600 px-6 text-sm font-medium text-white hover:bg-primary-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {status_ === 'submitting'
            ? 'Đang lưu...'
            : mode === 'create'
              ? 'Tạo tài liệu'
              : 'Lưu thay đổi'}
        </button>
        <button
          type="button"
          onClick={() => router.push('/admin/tai-lieu')}
          className="inline-flex h-10 items-center rounded-md border border-neutral-300 px-6 text-sm text-neutral-700 hover:bg-neutral-50"
        >
          Hủy
        </button>
      </div>
    </form>
  );
}