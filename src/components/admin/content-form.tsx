'use client';

import { useRouter } from 'next/navigation';
import { useState, type FormEvent } from 'react';

import { createContentAction, updateContentAction } from '@/features/content/actions';
import { slugify } from '@/lib/utils';

type ContentType = 'PAGE' | 'NEWS' | 'ANNOUNCEMENT';

export type ContentFormValues = {
  id?: string;
  type: ContentType;
  title: string;
  slug: string;
  summary: string;
  body: string;
  seoTitle: string;
  seoDescription: string;
  categoryId: string;
};

type Category = { id: string; name: string };

type ContentFormProps = {
  mode: 'create' | 'edit';
  initial?: ContentFormValues;
  categories: Category[];
  lockType?: boolean;
};

const TYPE_OPTIONS: { value: ContentType; label: string }[] = [
  { value: 'NEWS', label: 'Tin tức' },
  { value: 'ANNOUNCEMENT', label: 'Thông báo' },
  { value: 'PAGE', label: 'Trang' }
];

export function ContentForm({
  mode,
  initial,
  categories,
  lockType = false
}: ContentFormProps) {
  const router = useRouter();

  const [values, setValues] = useState<ContentFormValues>({
    id: initial?.id,
    type: initial?.type ?? 'NEWS',
    title: initial?.title ?? '',
    slug: initial?.slug ?? '',
    summary: initial?.summary ?? '',
    body: initial?.body ?? '',
    seoTitle: initial?.seoTitle ?? '',
    seoDescription: initial?.seoDescription ?? '',
    categoryId: initial?.categoryId ?? ''
  });

  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});
  const [slugTouched, setSlugTouched] = useState(!!initial?.slug);

  function update<K extends keyof ContentFormValues>(key: K, value: ContentFormValues[K]) {
    setValues((prev) => ({ ...prev, [key]: value }));
  }

  function handleTitleChange(title: string) {
    update('title', title);
    if (!slugTouched) {
      update('slug', slugify(title));
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus('submitting');
    setErrorMessage(null);
    setFieldErrors({});

    const formData = new FormData();
    if (values.id) formData.set('id', values.id);
    formData.set('type', values.type);
    formData.set('title', values.title);
    formData.set('slug', values.slug);
    formData.set('summary', values.summary);
    formData.set('body', values.body);
    formData.set('seoTitle', values.seoTitle);
    formData.set('seoDescription', values.seoDescription);
    formData.set('categoryId', values.categoryId);

    const action = mode === 'create' ? createContentAction : updateContentAction;
    const result = await action(formData);

    if (result.ok) {
      setStatus('success');
      router.push('/admin/noi-dung');
      router.refresh();
    } else {
      setStatus('error');
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

      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label htmlFor="type" className="block text-sm font-medium text-neutral-900">
            Loại nội dung <span className="text-error">*</span>
          </label>
          <select
            id="type"
            value={values.type}
            onChange={(e) => update('type', e.target.value as ContentType)}
            disabled={lockType}
            className="mt-1 h-10 w-full rounded-md border border-neutral-300 bg-white px-3 text-sm focus:border-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-100 disabled:bg-neutral-100"
          >
            {TYPE_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="categoryId" className="block text-sm font-medium text-neutral-900">
            Danh mục
          </label>
          <select
            id="categoryId"
            value={values.categoryId}
            onChange={(e) => update('categoryId', e.target.value)}
            className="mt-1 h-10 w-full rounded-md border border-neutral-300 bg-white px-3 text-sm focus:border-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-100"
          >
            <option value="">— Không chọn —</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label htmlFor="title" className="block text-sm font-medium text-neutral-900">
          Tiêu đề <span className="text-error">*</span>
        </label>
        <input
          id="title"
          type="text"
          value={values.title}
          onChange={(e) => handleTitleChange(e.target.value)}
          required
          aria-invalid={!!fieldErrors.title}
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
          value={values.slug}
          onChange={(e) => {
            setSlugTouched(true);
            update('slug', e.target.value);
          }}
          required
          aria-invalid={!!fieldErrors.slug}
          className="mt-1 h-10 w-full rounded-md border border-neutral-300 bg-white px-3 text-sm font-mono focus:border-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-100"
        />
        <p className="mt-1 text-xs text-neutral-500">
          Chỉ chữ thường, số và gạch ngang. Ví dụ: le-khai-giang-2025
        </p>
        {fieldErrors.slug ? (
          <p className="mt-1 text-xs text-error">{fieldErrors.slug.join(', ')}</p>
        ) : null}
      </div>

      <div>
        <label htmlFor="summary" className="block text-sm font-medium text-neutral-900">
          Tóm tắt
        </label>
        <textarea
          id="summary"
          value={values.summary}
          onChange={(e) => update('summary', e.target.value)}
          rows={2}
          maxLength={500}
          className="mt-1 w-full rounded-md border border-neutral-300 bg-white p-3 text-sm focus:border-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-100"
        />
        <p className="mt-1 text-xs text-neutral-500">
          {values.summary.length}/500 ký tự. Hiển thị ở danh sách và SEO.
        </p>
      </div>

      <div>
        <label htmlFor="body" className="block text-sm font-medium text-neutral-900">
          Nội dung <span className="text-error">*</span>
        </label>
        <textarea
          id="body"
          value={values.body}
          onChange={(e) => update('body', e.target.value)}
          rows={16}
          required
          aria-invalid={!!fieldErrors.body}
          className="mt-1 w-full rounded-md border border-neutral-300 bg-white p-3 font-mono text-sm focus:border-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-100"
        />
        <p className="mt-1 text-xs text-neutral-500">
          Hỗ trợ plain text. Xuống dòng bằng Enter. Markdown sẽ hỗ trợ ở phiên bản sau.
        </p>
        {fieldErrors.body ? (
          <p className="mt-1 text-xs text-error">{fieldErrors.body.join(', ')}</p>
        ) : null}
      </div>

      <fieldset className="rounded-lg border border-neutral-200 bg-neutral-50 p-4">
        <legend className="px-2 text-sm font-medium text-neutral-900">
          SEO (tùy chọn)
        </legend>

        <div className="mt-3 space-y-3">
          <div>
            <label htmlFor="seoTitle" className="block text-xs font-medium text-neutral-700">
              SEO Title
            </label>
            <input
              id="seoTitle"
              type="text"
              value={values.seoTitle}
              onChange={(e) => update('seoTitle', e.target.value)}
              maxLength={200}
              className="mt-1 h-10 w-full rounded-md border border-neutral-300 bg-white px-3 text-sm focus:border-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-100"
            />
          </div>

          <div>
            <label
              htmlFor="seoDescription"
              className="block text-xs font-medium text-neutral-700"
            >
              SEO Description
            </label>
            <textarea
              id="seoDescription"
              value={values.seoDescription}
              onChange={(e) => update('seoDescription', e.target.value)}
              rows={2}
              maxLength={300}
              className="mt-1 w-full rounded-md border border-neutral-300 bg-white p-3 text-sm focus:border-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-100"
            />
          </div>
        </div>
      </fieldset>

      <div className="flex items-center gap-3 border-t border-neutral-200 pt-6">
        <button
          type="submit"
          disabled={status === 'submitting'}
          className="inline-flex h-10 items-center rounded-md bg-primary-600 px-6 text-sm font-medium text-white hover:bg-primary-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {status === 'submitting'
            ? 'Đang lưu...'
            : mode === 'create'
              ? 'Tạo nội dung'
              : 'Lưu thay đổi'}
        </button>
        <button
          type="button"
          onClick={() => router.push('/admin/noi-dung')}
          className="inline-flex h-10 items-center rounded-md border border-neutral-300 px-6 text-sm text-neutral-700 hover:bg-neutral-50"
        >
          Hủy
        </button>
      </div>
    </form>
  );
}