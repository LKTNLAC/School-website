import type { Metadata } from 'next';

import { siteConfig } from '@/config/site';
import { DEFAULT_SETTINGS, type SiteSettings } from '@/features/settings/types';

type SeoInput = {
  title: string;
  description?: string;
  path?: string;
  image?: string;
  noIndex?: boolean;
  settings?: SiteSettings;
};

export function buildMetadata(input: SeoInput): Metadata {
  const settings = input.settings ?? DEFAULT_SETTINGS;
  const siteName = settings.siteName || siteConfig.name;
  const siteDescription = settings.siteDescription || siteConfig.description;
  const url = input.path ? `${siteConfig.url}${input.path}` : siteConfig.url;

  return {
    title: input.title,
    description: input.description ?? siteDescription,
    alternates: { canonical: url },
    openGraph: {
      title: input.title,
      description: input.description ?? siteDescription,
      url,
      siteName,
      locale: siteConfig.locale,
      type: 'website',
      ...(input.image ? { images: [{ url: input.image }] } : {})
    },
    robots: input.noIndex
      ? { index: false, follow: false }
      : { index: true, follow: true }
  };
}