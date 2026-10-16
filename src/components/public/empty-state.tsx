type EmptyStateProps = {
  title: string;
  description?: string;
};

export function EmptyState({ title, description }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-neutral-300 bg-neutral-50 p-12 text-center">
      <svg
        aria-hidden="true"
        viewBox="0 0 24 24"
        className="h-12 w-12 text-neutral-400"
        fill="none"
      >
        <path
          d="M9 13h6m-6 4h6m-9 4h12a2 2 0 002-2V7a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </svg>
      <h3 className="mt-4 text-base font-semibold text-neutral-900">{title}</h3>
      {description ? (
        <p className="mt-2 max-w-md text-sm text-neutral-600">{description}</p>
      ) : null}
    </div>
  );
}