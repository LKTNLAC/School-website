import type { Metadata } from 'next';

import { EmptyState } from '@/components/public/empty-state';
import { EventCard } from '@/components/public/event-card';
import { Hero } from '@/components/public/hero';
import { NewsCard } from '@/components/public/news-card';
import { QuickLinkCard } from '@/components/public/quick-link-card';
import { Section } from '@/components/public/section';
import { getUpcomingEvents } from '@/features/events/service';
import { getLatestNews } from '@/features/news/service';
import { getSettings } from '@/features/settings/service';
import { buildMetadata } from '@/lib/seo';

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSettings();
  return buildMetadata({
    title: 'Trang chủ',
    path: '/',
    settings
  });
}

const quickLinks = [
  {
    title: 'Giới thiệu nhà trường',
    description: 'Tìm hiểu về lịch sử, sứ mệnh và cơ cấu tổ chức của trường.',
    href: '/gioi-thieu'
  },
  {
    title: 'Tuyển sinh',
    description: 'Thông tin tuyển sinh, điều kiện, quy trình và câu hỏi thường gặp.',
    href: '/tuyen-sinh'
  },
  {
    title: 'Đội ngũ giáo viên',
    description: 'Đội ngũ giáo viên và cán bộ nhà trường theo tổ chuyên môn.',
    href: '/doi-ngu'
  },
  {
    title: 'Tài nguyên',
    description: 'Tài liệu học tập, biểu mẫu và văn bản dành cho học sinh, phụ huynh.',
    href: '/tai-nguyen'
  }
];

export default async function HomePage() {
  const [settings, latestNews, upcomingEvents] = await Promise.all([
    getSettings(),
    getLatestNews(3),
    getUpcomingEvents(3)
  ]);

  return (
    <>
      <Hero settings={settings} />

      <Section title="Liên kết nhanh">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {quickLinks.map((link) => (
            <QuickLinkCard key={link.href} {...link} />
          ))}
        </div>
      </Section>

      <Section title="Tin tức mới" viewAllHref="/tin-tuc" className="bg-neutral-50">
        {latestNews.length === 0 ? (
          <EmptyState
            title="Chưa có tin tức"
            description="Tin tức sẽ được cập nhật trong thời gian sớm nhất."
          />
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {latestNews.map((item) => (
              <NewsCard
                key={item.id}
                href={`/tin-tuc/${item.slug}`}
                title={item.title}
                summary={item.summary}
                publishedAt={item.publishedAt}
                categoryName={item.category?.name ?? null}
              />
            ))}
          </div>
        )}
      </Section>

      <Section title="Sự kiện sắp tới" viewAllHref="/su-kien">
        {upcomingEvents.length === 0 ? (
          <EmptyState
            title="Chưa có sự kiện"
            description="Sự kiện sắp tới sẽ được cập nhật tại đây."
          />
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {upcomingEvents.map((event) => (
              <EventCard
                key={event.id}
                href={`/su-kien/${event.slug}`}
                title={event.title}
                startAt={event.startAt}
                location={event.location}
              />
            ))}
          </div>
        )}
      </Section>
    </>
  );
}