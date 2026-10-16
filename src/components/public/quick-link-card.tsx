import Link from 'next/link';

type QuickLinkCardProps = {
  title: string;
  description: string;
  href: string;
};

export function QuickLinkCard({ title, description, href }: QuickLinkCardProps) {
  return (
    <Link
      href={href}
      className="group flex flex-col rounded-lg border border-neutral-200 bg-white p-6 transition-shadow hover:shadow-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600"
    >
      <h3 className="text-base font-semibold text-neutral-900 group-hover:text-primary-700">
        {title}
      </h3>
      <p className="mt-2 flex-1 text-sm text-neutral-600">{description}</p>
      <span className="mt-4 text-sm font-medium text-primary-600">Xem thêm →</span>
    </Link>
  );
}