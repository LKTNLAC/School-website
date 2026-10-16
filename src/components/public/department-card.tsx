import Link from 'next/link';

type DepartmentCardProps = {
  href: string;
  name: string;
  description: string | null;
  staffCount: number;
};

export function DepartmentCard({ href, name, description, staffCount }: DepartmentCardProps) {
  return (
    <Link
      href={href}
      className="group flex flex-col rounded-lg border border-neutral-200 bg-white p-6 transition-shadow hover:shadow-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600"
    >
      <h3 className="text-lg font-semibold text-neutral-900 group-hover:text-primary-700">
        {name}
      </h3>
      {description ? (
        <p className="mt-2 flex-1 text-sm text-neutral-600">{description}</p>
      ) : null}
      <p className="mt-4 text-xs text-neutral-500">
        {staffCount} thành viên
      </p>
    </Link>
  );
}