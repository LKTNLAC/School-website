type Tone = 'neutral' | 'warning' | 'success' | 'error';

const TONES: Record<Tone, string> = {
  neutral: 'bg-neutral-100 text-neutral-700',
  warning: 'bg-warning/10 text-warning',
  success: 'bg-success/10 text-success',
  error: 'bg-error/10 text-error'
};

const STATUS_MAP: Record<string, { label: string; tone: Tone }> = {
  DRAFT: { label: 'Nháp', tone: 'neutral' },
  IN_REVIEW: { label: 'Chờ duyệt', tone: 'warning' },
  PUBLISHED: { label: 'Đã xuất bản', tone: 'success' },
  ARCHIVED: { label: 'Lưu trữ', tone: 'error' }
};

export function ContentStatusBadge({ status }: { status: string }) {
  const meta = STATUS_MAP[status] ?? { label: status, tone: 'neutral' as Tone };
  return (
    <span
      className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${TONES[meta.tone]}`}
    >
      {meta.label}
    </span>
  );
}