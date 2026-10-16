import { Footer } from '@/components/layout/footer';
import { Header } from '@/components/layout/header';
import { getSettings } from '@/features/settings/service';

export default async function PublicLayout({
  children
}: {
  children: React.ReactNode;
}) {
  const settings = await getSettings();

  return (
    <div className="flex min-h-dvh flex-col">
      <Header settings={settings} />
      <main id="main-content" className="flex-1">
        {children}
      </main>
      <Footer settings={settings} />
    </div>
  );
}