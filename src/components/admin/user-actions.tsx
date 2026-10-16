'use client';

import { useRouter } from 'next/navigation';
import { useState, useTransition, type FormEvent } from 'react';

import {
  deleteUserAction,
  resetPasswordAction,
  revokeSessionsAction,
  updateUserAction
} from '@/features/users/actions';
import type { UserRole, UserStatus } from '@/types';

const ROLE_OPTIONS = [
  { value: 'ADMIN', label: 'Quản trị viên' },
  { value: 'EDITOR', label: 'Biên tập viên' },
  { value: 'CONTRIBUTOR', label: 'Cộng tác viên' },
  { value: 'VIEWER', label: 'Người xem' }
];

type Props = {
  userId: string;
  currentUserId: string;
  name: string | null;
  role: UserRole;
  status: UserStatus;
};

export function UserActions({
  userId,
  currentUserId,
  name,
  role,
  status
}: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(
    null
  );
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});

  const isSelf = userId === currentUserId;

  async function handleUpdate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage(null);
    setFieldErrors({});
    const result = await updateUserAction(new FormData(event.currentTarget));
    if (result.ok) {
      setMessage({ type: 'success', text: result.message });
      router.refresh();
    } else {
      setMessage({ type: 'error', text: result.error });
      setFieldErrors(result.details ?? {});
    }
  }

  async function handleResetPassword(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!confirm('Đặt lại mật khẩu? Mọi session của người dùng sẽ bị thu hồi.')) return;
    setMessage(null);
    const form = event.currentTarget;
    const result = await resetPasswordAction(new FormData(form));
    if (result.ok) {
      setMessage({ type: 'success', text: result.message });
      form.reset();
    } else {
      setMessage({ type: 'error', text: result.error });
    }
  }

  function handleRevokeSessions() {
    if (!confirm('Thu hồi mọi session của người dùng này?')) return;
    setMessage(null);
    startTransition(async () => {
      const result = await revokeSessionsAction(userId);
      if (result.ok) {
        setMessage({ type: 'success', text: result.message });
        router.refresh();
      } else {
        setMessage({ type: 'error', text: result.error });
      }
    });
  }

  function handleDelete() {
    if (!confirm('XÓA VĨNH VIỄN tài khoản này? Không thể khôi phục!')) return;
    setMessage(null);
    startTransition(async () => {
      const result = await deleteUserAction(userId);
      if (result.ok) {
        router.push('/admin/nguoi-dung');
        router.refresh();
      } else {
        setMessage({ type: 'error', text: result.error });
      }
    });
  }

  return (
    <div className="space-y-6">
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
        onSubmit={handleUpdate}
        className="rounded-lg border border-neutral-200 bg-white p-4"
      >
        <input type="hidden" name="id" value={userId} />
        <h3 className="text-sm font-semibold text-neutral-900">Thông tin tài khoản</h3>

        <div className="mt-3 space-y-3">
          <div>
            <label htmlFor="name" className="block text-xs font-medium text-neutral-700">
              Họ tên
            </label>
            <input
              id="name"
              name="name"
              type="text"
              defaultValue={name ?? ''}
              required
              className="mt-1 h-10 w-full rounded-md border border-neutral-300 bg-white px-3 text-sm focus:border-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-100"
            />
            {fieldErrors.name ? (
              <p className="mt-1 text-xs text-error">{fieldErrors.name.join(', ')}</p>
            ) : null}
          </div>

          <div>
            <label htmlFor="role" className="block text-xs font-medium text-neutral-700">
              Vai trò
            </label>
            <select
              id="role"
              name="role"
              defaultValue={role}
              className="mt-1 h-10 w-full rounded-md border border-neutral-300 bg-white px-3 text-sm focus:border-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-100"
            >
              {ROLE_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="status" className="block text-xs font-medium text-neutral-700">
              Trạng thái
            </label>
            <select
              id="status"
              name="status"
              defaultValue={status}
              className="mt-1 h-10 w-full rounded-md border border-neutral-300 bg-white px-3 text-sm focus:border-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-100"
            >
              <option value="ACTIVE">Hoạt động</option>
              <option value="DISABLED">Vô hiệu hóa</option>
            </select>
          </div>
        </div>

        <button
          type="submit"
          className="mt-4 inline-flex h-10 items-center rounded-md bg-primary-600 px-4 text-sm font-medium text-white hover:bg-primary-700"
        >
          Lưu thay đổi
        </button>
      </form>

      <form
        onSubmit={handleResetPassword}
        className="rounded-lg border border-neutral-200 bg-white p-4"
      >
        <input type="hidden" name="id" value={userId} />
        <h3 className="text-sm font-semibold text-neutral-900">Đặt lại mật khẩu</h3>
        <div className="mt-3">
          <input
            name="password"
            type="password"
            required
            minLength={8}
            placeholder="Mật khẩu mới"
            autoComplete="new-password"
            className="h-10 w-full rounded-md border border-neutral-300 bg-white px-3 text-sm focus:border-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-100"
          />
          {fieldErrors.password ? (
            <p className="mt-1 text-xs text-error">{fieldErrors.password.join(', ')}</p>
          ) : null}
        </div>
        <button
          type="submit"
          className="mt-3 inline-flex h-10 items-center rounded-md border border-neutral-300 px-4 text-sm text-neutral-700 hover:bg-neutral-50"
        >
          Đặt lại và thu hồi session
        </button>
      </form>

      <div className="rounded-lg border border-neutral-200 bg-white p-4">
        <h3 className="text-sm font-semibold text-neutral-900">Session</h3>
        <p className="mt-1 text-xs text-neutral-600">
          Thu hồi mọi session đang hoạt động của người dùng.
        </p>
        <button
          type="button"
          onClick={handleRevokeSessions}
          disabled={isPending}
          className="mt-3 inline-flex h-10 items-center rounded-md border border-neutral-300 px-4 text-sm text-neutral-700 hover:bg-neutral-50 disabled:opacity-50"
        >
          Thu hồi tất cả session
        </button>
      </div>

      {!isSelf ? (
        <div className="rounded-lg border border-error/30 bg-error/5 p-4">
          <h3 className="text-sm font-semibold text-error">Vùng nguy hiểm</h3>
          <p className="mt-1 text-xs text-neutral-700">
            Xóa vĩnh viễn tài khoản và mọi session, audit log liên quan.
          </p>
          <button
            type="button"
            onClick={handleDelete}
            disabled={isPending}
            className="mt-3 inline-flex h-10 items-center rounded-md border border-error/40 bg-white px-4 text-sm font-medium text-error hover:bg-error/10 disabled:opacity-50"
          >
            Xóa tài khoản
          </button>
        </div>
      ) : (
        <div className="rounded-lg border border-neutral-200 bg-neutral-50 p-4 text-xs text-neutral-600">
          Không thể xóa hoặc vô hiệu hóa tài khoản của chính mình.
        </div>
      )}
    </div>
  );
}