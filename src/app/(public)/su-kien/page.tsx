import type { Metadata } from 'next';

import { EmptyState } from '@/components/public/empty-state';
import { EventCard } from '@/components/public/event-card';
import { PageHeader } from '@/components/public/page-header';
import { Section } from '@/components/public/section';
import { getPastEvents, getUpcomingEvents } from '@/features/events/service';
import { buildMetadata } from '@/lib/seo';

export const metadata: Metadata = buildMetadata({
  title: 'Sự kiện',
  description: 'Sự kiện sắp tới và đã diễn ra tại nhà trường.',
  path: '/su-kien'
});

export default async function EventsPage() {
  const [upcoming, past] = await Promise.all([getUpcomingEvents(), getPastEvents(6)]);

  return (
    <>
      <PageHeader
        title="Sự kiện"
        description="Sự kiện sắp tới và đã diễn ra tại nhà trường."
        breadcrumbs={[{ label: 'Sự kiện' }]}
      />

      <Section title="Sự kiện sắp tới">
        {upcoming.length === 0 ? (
          <EmptyState
            title="Chưa có sự kiện sắp tới"
            description="Sự kiện sẽ được cập nhật."
          />
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {upcoming.map((e) => (
              <EventCard
                key={e.id}
                href={`/su-kien/${e.slug}`}
                title={e.title}
                startAt={e.startAt}
                location={e.location}
              />
            ))}
          </div>
        )}
      </Section>

      {past.length > 0 ? (
        <Section title="Sự kiện đã diễn ra" className="bg-neutral-50">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {past.map((e) => (
              <EventCard
                key={e.id}
                href={`/su-kien/${e.slug}`}
                title={e.title}
                startAt={e.startAt}
                location={e.location}
              />
            ))}
          </div>
        </Section>
      ) : null}
    </>
  );
}