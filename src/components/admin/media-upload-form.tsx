'use client';

import { useRouter } from 'next/navigation';
import { useRef, useState, type FormEvent } from 'react';

import { uploadMediaAction } from '@/features/media/actions';

type AlbumOption = {
  id: string;
  name: string;
};

export function MediaUploadForm({ albums }: { albums: AlbumOption[] }) {
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);
  const [status, setStatus] = useState<'idle' | 'uploading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus('uploading');
    setMessage(null);

    const formData = new FormData(event.currentTarget);
    const file = formData.get('file');

    if (!(file instanceof File) || file.size === 0) {
      setStatus('error');
      setMessage('Vui lòng chọn file.');
      return;
    }

    const result = await uploadMediaAction(formData);

    if (result.ok) {
      setStatus('success');
      setMessage('Upload thành công.');
      formRef.current?.reset();
      router.refresh();
      setTimeout(() => setMessage(null), 3000);
    } else {
      setStatus('error');
      setMessage(result.error);
    }
  }

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="space-y-4">
      {message ? (
        <div
          role="alert"
          className={
            status === 'success'
              ? 'rounded-md border border-success/30 bg-success/5 p-3 text-sm text-success'
              : 'rounded-md border border-error/30 bg-error/5 p-3 text-sm text-error'
          }
        >
          {message}
        </div>
      ) : null}

      <div>
        <label htmlFor="file" className="block text-sm font-medium text-neutral-900">
          Chọn file <span className="text-error">*</span>
        </label>
        <input
          id="file"
          name="file"
          type="file"
          required
          accept="image/jpeg,image/png,image/webp,application/pdf,video/mp4"
          className="mt-1 block w-full text-sm text-neutral-700 file:mr-3 file:rounded-md file:border-0 file:bg-primary-600 file:px-4 file:py-2 file:text-sm file:font-medium file:text-white hover:file:bg-primary-700"
        />
        <p className="mt-1 text-xs text-neutral-500">
          Hỗ trợ: JPEG, PNG, WebP, PDF, MP4. Ảnh tối đa 5MB, tài liệu 20MB, video 100MB.
        </p>
      </div>

      <div>
        <label htmlFor="albumId" className="block text-sm font-medium text-neutral-900">
          Album (tùy chọn)
        </label>
        <select
          id="albumId"
          name="albumId"
          className="mt-1 h-10 w-full rounded-md border border-neutral-300 bg-white px-3 text-sm focus:border-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-100"
        >
          <option value="">— Không chọn —</option>
          {albums.map((album) => (
            <option key={album.id} value={album.id}>
              {album.name}
            </option>
          ))}
        </select>
      </div>

      <button
        type="submit"
        disabled={status === 'uploading'}
        className="inline-flex h-10 items-center rounded-md bg-primary-600 px-6 text-sm font-medium text-white hover:bg-primary-700 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {status === 'uploading' ? 'Đang upload...' : 'Upload'}
      </button>
    </form>
  );
}