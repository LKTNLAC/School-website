import Link from 'next/link';

export type Breadcrumb = {
  label: string;
  href?: string;
};

export function AdminBreadcrumbs({ items }: { items: Breadcrumb[] }) {
  if (items.length === 0) return null;

  return (
    <nav aria-label="Breadcrumb">
      <ol className="flex flex-wrap items-center gap-2 text-sm text-neutral-500">
        <li>
          <Link href="/admin" className="hover:text-primary-700">
            Dashboard
          </Link>
        </li>
        {items.map((crumb, idx) => (
          <li key={idx} className="flex items-center gap-2">
            <span aria-hidden="true">/</span>
            {crumb.href ? (
              <Link href={crumb.href} className="hover:text-primary-700">
                {crumb.label}
              </Link>
            ) : (
              <span className="text-neutral-700">{crumb.label}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}