import Link from 'next/link';

type AlbumCardProps = {
  href: string;
  name: string;
  assetCount: number;
};

export function AlbumCard({ href, name, assetCount }: AlbumCardProps) {
  return (
    <Link
      href={href}
      className="group flex flex-col overflow-hidden rounded-lg border border-neutral-200 bg-white transition-shadow hover:shadow-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600"
    >
      <div className="flex aspect-video items-center justify-center bg-neutral-100">
        <svg
          aria-hidden="true"
          viewBox="0 0 24 24"
          className="h-12 w-12 text-neutral-400"
          fill="none"
        >
          <path
            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </svg>
      </div>
      <div className="p-4">
        <h3 className="text-base font-semibold text-neutral-900 group-hover:text-primary-700">
          {name}
        </h3>
        <p className="mt-1 text-xs text-neutral-500">{assetCount} ảnh/video</p>
      </div>
    </Link>
  );
}