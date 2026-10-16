'use client';

import { useRouter } from 'next/navigation';
import { useRef, useState, useTransition } from 'react';

import {
  deleteDocumentAction,
  uploadDocumentRevisionAction
} from '@/features/documents/actions';

type Props = {
  documentId: string;
  hasCurrentRevision: boolean;
};

export function DocumentActions({ documentId, hasCurrentRevision }: Props) {
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(
    null
  );

  async function handleUpload(formData: FormData) {
    setMessage(null);
    const result = await uploadDocumentRevisionAction(formData);
    if (result.ok) {
      setMessage({ type: 'success', text: result.message });
      formRef.current?.reset();
      router.refresh();
    } else {
      setMessage({ type: 'error', text: result.error });
    }
  }

  function handleDelete() {
    if (!confirm('Xóa tài liệu này? Tài liệu sẽ không hiển thị công khai.')) return;
    setMessage(null);
    startTransition(async () => {
      const result = await deleteDocumentAction(documentId);
      if (result.ok) {
        router.push('/admin/tai-lieu');
        router.refresh();
      } else {
        setMessage({ type: 'error', text: result.error });
      }
    });
  }

  return (
    <div className="space-y-4">
      {message ? (
        <div
          role="alert"
          className={
            message.type === 'success'
              ? 'rounded-md border border-success/30 bg-success/5 p-3 text-sm text-success'
              : 'rounded-md border border-error/30 bg-error/5 p-3 text-sm text-error'
          }
        >
          {message.text}
        </div>
      ) : null}

      <form
        ref={formRef}
        action={handleUpload}
        className="rounded-lg border border-neutral-200 bg-white p-4"
      >
        <input type="hidden" name="documentId" value={documentId} />
        <h3 className="text-sm font-semibold text-neutral-900">
          {hasCurrentRevision ? 'Upload revision mới' : 'Upload file'}
        </h3>
        <div className="mt-3 flex flex-wrap items-center gap-3">
          <input
            type="file"
            name="file"
            required
            accept="application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
            className="text-sm file:mr-3 file:rounded-md file:border-0 file:bg-primary-600 file:px-4 file:py-2 file:text-sm file:font-medium file:text-white hover:file:bg-primary-700"
          />
          <button
            type="submit"
            disabled={isPending}
            className="inline-flex h-10 items-center rounded-md bg-primary-600 px-4 text-sm font-medium text-white hover:bg-primary-700 disabled:opacity-50"
          >
            Upload
          </button>
        </div>
        <p className="mt-2 text-xs text-neutral-500">
          Chấp nhận PDF, DOCX, XLSX. Tối đa 20MB.
        </p>
      </form>

      <div className="rounded-lg border border-error/30 bg-error/5 p-4">
        <h3 className="text-sm font-semibold text-error">Vùng nguy hiểm</h3>
        <p className="mt-1 text-xs text-neutral-700">
          Xóa tài liệu khỏi danh sách công khai. Có thể khôi phục bằng cách xóa
          `deletedAt` trong DB.
        </p>
        <button
          type="button"
          onClick={handleDelete}
          disabled={isPending}
          className="mt-3 inline-flex h-10 items-center rounded-md border border-error/40 bg-white px-4 text-sm font-medium text-error hover:bg-error/10 disabled:opacity-50"
        >
          {isPending ? 'Đang xóa...' : 'Xóa tài liệu'}
        </button>
      </div>
    </div>
  );
}