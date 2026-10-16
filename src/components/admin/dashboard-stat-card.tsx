import Link from 'next/link';

type Tone = 'primary' | 'success' | 'warning' | 'neutral';

const TONES: Record<Tone, string> = {
  primary: 'bg-primary-50 text-primary-700',
  success: 'bg-success/10 text-success',
  warning: 'bg-warning/10 text-warning',
  neutral: 'bg-neutral-100 text-neutral-700'
};

type DashboardStatCardProps = {
  label: string;
  value: number | string;
  href?: string;
  tone?: Tone;
};

export function DashboardStatCard({
  label,
  value,
  href,
  tone = 'neutral'
}: DashboardStatCardProps) {
  const content = (
    <div className="rounded-lg border border-neutral-200 bg-white p-5 transition-shadow hover:shadow-sm">
      <div className="flex items-center gap-3">
        <div
          className={`flex h-10 w-10 items-center justify-center rounded-md text-base font-semibold ${TONES[tone]}`}
        >
          <span aria-hidden="true">{typeof value === 'number' ? value : '—'}</span>
        </div>
        <div>
          <p className="text-xs font-medium uppercase tracking-wider text-neutral-500">
            {label}
          </p>
          <p className="mt-0.5 text-2xl font-semibold text-neutral-900">
            {typeof value === 'number' ? value : value}
          </p>
        </div>
      </div>
    </div>
  );

  if (href) {
    return (
      <Link
        href={href}
        className="block focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600"
      >
        {content}
      </Link>
    );
  }
  return content;
}