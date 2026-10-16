import { AdminBreadcrumbs, type Breadcrumb } from './admin-breadcrumbs';

type AdminPageHeaderProps = {
  title: string;
  description?: string;
  breadcrumbs?: Breadcrumb[];
  actions?: React.ReactNode;
};

export function AdminPageHeader({
  title,
  description,
  breadcrumbs,
  actions
}: AdminPageHeaderProps) {
  return (
    <div className="mb-6">
      {breadcrumbs && breadcrumbs.length > 0 ? (
        <div className="mb-3">
          <AdminBreadcrumbs items={breadcrumbs} />
        </div>
      ) : null}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-neutral-900">{title}</h1>
          {description ? (
            <p className="mt-1 text-sm text-neutral-600">{description}</p>
          ) : null}
        </div>
        {actions ? <div className="flex items-center gap-2">{actions}</div> : null}
      </div>
    </div>
  );
}