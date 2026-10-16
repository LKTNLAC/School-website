'use client';

import { useRouter } from 'next/navigation';
import { useState, useTransition } from 'react';

import {
  archiveContentAction,
  hardDeleteContentAction,
  publishContentAction,
  revertToDraftAction,
  softDeleteContentAction,
  submitForReviewAction
} from '@/features/content/actions';
import type { UserRole } from '@/types';

type Props = {
  contentId: string;
  status: string;
  userRole: UserRole;
  isOwner: boolean;
};

type PendingAction = {
  label: string;
  confirmMessage: string;
  execute: () => Promise<{ ok: true; message: string } | { ok: false; error: string }>;
};

export function ContentActions({ contentId, status, userRole, isOwner }: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  function run(action: PendingAction) {
    if (!confirm(action.confirmMessage)) return;
    setMessage(null);
    startTransition(async () => {
      const result = await action.execute();
      if (result.ok) {
        setMessage({ type: 'success', text: result.message });
        router.refresh();
      } else {
        setMessage({ type: 'error', text: result.error });
      }
    });
  }

  const isAdmin = userRole === 'ADMIN';
  const canPublish = userRole === 'ADMIN' || userRole === 'EDITOR';
  const canEdit = canPublish || (userRole === 'CONTRIBUTOR' && isOwner);
  const canArchive = userRole === 'ADMIN' || userRole === 'EDITOR';
  const canSoftDelete = userRole === 'ADMIN' || userRole === 'EDITOR';

  return (
    <div className="space-y-3">
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

      <div className="flex flex-wrap gap-2">
        {status === 'DRAFT' && canEdit ? (
          <ActionButton
            label="Gửi duyệt"
            disabled={isPending}
            onClick={() =>
              run({
                label: 'Gửi duyệt',
                confirmMessage: 'Gửi nội dung này để chờ duyệt?',
                execute: () => submitForReviewAction(contentId)
              })
            }
          />
        ) : null}

        {status === 'IN_REVIEW' && canPublish ? (
          <>
            <ActionButton
              label="Xuất bản"
              variant="primary"
              disabled={isPending}
              onClick={() =>
                run({
                  label: 'Xuất bản',
                  confirmMessage: 'Xuất bản nội dung này?',
                  execute: () => publishContentAction(contentId)
                })
              }
            />
            <ActionButton
              label="Trả về nháp"
              disabled={isPending}
              onClick={() =>
                run({
                  label: 'Trả về nháp',
                  confirmMessage: 'Trả nội dung về trạng thái nháp?',
                  execute: () => revertToDraftAction(contentId)
                })
              }
            />
          </>
        ) : null}

        {status === 'PUBLISHED' && canArchive ? (
          <ActionButton
            label="Lưu trữ"
            disabled={isPending}
            onClick={() =>
              run({
                label: 'Lưu trữ',
                confirmMessage: 'Lưu trữ nội dung này? Nội dung sẽ không còn hiển thị công khai.',
                execute: () => archiveContentAction(contentId)
              })
            }
          />
        ) : null}

        {status === 'ARCHIVED' && canEdit ? (
          <ActionButton
            label="Khôi phục về nháp"
            disabled={isPending}
            onClick={() =>
              run({
                label: 'Khôi phục',
                confirmMessage: 'Khôi phục nội dung về trạng thái nháp?',
                execute: () => revertToDraftAction(contentId)
              })
            }
          />
        ) : null}

        {canSoftDelete ? (
          <ActionButton
            label="Xóa"
            variant="danger"
            disabled={isPending}
            onClick={() =>
              run({
                label: 'Xóa',
                confirmMessage: 'Xóa mềm nội dung? Có thể khôi phục bằng cách restore trong DB.',
                execute: () => softDeleteContentAction(contentId)
              })
            }
          />
        ) : null}

        {isAdmin ? (
          <ActionButton
            label="Xóa vĩnh viễn"
            variant="danger"
            disabled={isPending}
            onClick={() =>
              run({
                label: 'Xóa vĩnh viễn',
                confirmMessage: 'XÓA VĨNH VIỄN nội dung và mọi revision? Không thể khôi phục!',
                execute: () => hardDeleteContentAction(contentId)
              })
            }
          />
        ) : null}
      </div>
    </div>
  );
}

function ActionButton({
  label,
  onClick,
  variant = 'default',
  disabled
}: {
  label: string;
  onClick: () => void;
  variant?: 'default' | 'primary' | 'danger';
  disabled?: boolean;
}) {
  const styles = {
    default:
      'border border-neutral-300 bg-white text-neutral-700 hover:bg-neutral-50',
    primary: 'bg-primary-600 text-white hover:bg-primary-700',
    danger: 'border border-error/30 bg-white text-error hover:bg-error/5'
  };

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`inline-flex h-10 items-center rounded-md px-4 text-sm font-medium disabled:cursor-not-allowed disabled:opacity-50 ${styles[variant]}`}
    >
      {label}
    </button>
  );
}