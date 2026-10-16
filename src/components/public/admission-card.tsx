import { Prose } from '@/components/public/prose';

type AdmissionCardProps = {
  schoolYear: string;
  title: string;
  body: string;
};

export function AdmissionCard({ schoolYear, title, body }: AdmissionCardProps) {
  return (
    <article className="rounded-lg border border-neutral-200 bg-white p-6 lg:p-8">
      <header className="border-b border-neutral-200 pb-4">
        <p className="text-sm font-medium uppercase tracking-wider text-primary-700">
          Năm học {schoolYear}
        </p>
        <h2 className="mt-1 text-2xl font-semibold text-neutral-900">{title}</h2>
      </header>
      <div className="mt-6">
        <Prose content={body} />
      </div>
    </article>
  );
}