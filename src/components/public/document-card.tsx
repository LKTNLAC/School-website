import Link from 'next/link';

function formatFileSize(bytes: number | null): string {
  if (!bytes) return 'Không rõ';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

type DocumentCardProps = {
  href: string;
  title: string;
  fileName: string | null;
  fileSize: number | null;
  mimeType: string | null;
};

export function DocumentCard({ href, title, fileName, fileSize, mimeType }: DocumentCardProps) {
  return (
    <Link
      href={href}
      className="group flex items-start gap-4 rounded-lg border border-neutral-200 bg-white p-4 transition-shadow hover:shadow-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600"
    >
      <div
        aria-hidden="true"
        className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-md bg-primary-50 text-primary-700"
      >
        <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none">
          <path
            d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6z"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          <path d="M14 2v6h6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      </div>
      <div className="flex-1">
        <h3 className="text-base font-semibold text-neutral-900 group-hover:text-primary-700">
          {title}
        </h3>
        <div className="mt-1 flex flex-wrap gap-2 text-xs text-neutral-500">
          {fileName ? <span>{fileName}</span> : null}
          {fileSize ? <span>• {formatFileSize(fileSize)}</span> : null}
          {mimeType ? <span>• {mimeType}</span> : null}
        </div>
      </div>
    </Link>
  );
}