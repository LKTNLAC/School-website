import Link from 'next/link';

type Breadcrumb = { label: string; href?: string };

type PageHeaderProps = {
  title: string;
  description?: string;
  breadcrumbs?: Breadcrumb[];
};

export function PageHeader({ title, description, breadcrumbs }: PageHeaderProps) {
  return (
    <div className="border-b border-neutral-200 bg-neutral-50">
      <div className="mx-auto max-w-7xl px-4 py-12 lg:py-16">
        {breadcrumbs && breadcrumbs.length > 0 ? (
          <nav aria-label="Breadcrumb" className="mb-4">
            <ol className="flex flex-wrap items-center gap-2 text-sm text-neutral-500">
              <li>
                <Link href="/" className="hover:text-primary-700">
                  Trang chủ
                </Link>
              </li>
              {breadcrumbs.map((crumb, idx) => (
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
        ) : null}

        <h1 className="text-3xl font-bold text-neutral-900 lg:text-4xl">{title}</h1>
        {description ? (
          <p className="mt-4 max-w-3xl text-base text-neutral-700 lg:text-lg">
            {description}
          </p>
        ) : null}
      </div>
    </div>
  );
}