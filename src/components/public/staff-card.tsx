type StaffCardProps = {
  fullName: string;
  position: string | null;
  email: string | null;
};

export function StaffCard({ fullName, position, email }: StaffCardProps) {
  const initials = fullName
    .split(' ')
    .filter((w) => w.length > 0)
    .slice(-2)
    .map((w) => w[0])
    .join('')
    .toUpperCase();

  return (
    <div className="flex flex-col items-center rounded-lg border border-neutral-200 bg-white p-6 text-center">
      <div
        aria-hidden="true"
        className="flex h-16 w-16 items-center justify-center rounded-full bg-primary-100 text-xl font-semibold text-primary-700"
      >
        {initials}
      </div>
      <h3 className="mt-4 text-base font-semibold text-neutral-900">{fullName}</h3>
      {position ? (
        <p className="mt-1 text-sm text-neutral-600">{position}</p>
      ) : null}
      {email ? (
        <a
          href={`mailto:${email}`}
          className="mt-2 text-xs text-primary-600 hover:text-primary-700"
        >
          {email}
        </a>
      ) : null}
    </div>
  );
}