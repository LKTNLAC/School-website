import { DEFAULT_SETTINGS, type SiteSettings } from './types';

import { prisma } from '@/lib/db';


const SETTINGS_KEY = 'site';

export async function getSiteSettings(): Promise<SiteSettings> {
  const row = await prisma.setting.findUnique({
    where: { key: SETTINGS_KEY }
  });

  if (!row) return DEFAULT_SETTINGS;

  const value = row.value as Partial<SiteSettings> | null;
  if (!value || typeof value !== 'object') return DEFAULT_SETTINGS;

  return { ...DEFAULT_SETTINGS, ...value };
}

export async function upsertSiteSettings(settings: SiteSettings): Promise<void> {
  await prisma.setting.upsert({
    where: { key: SETTINGS_KEY },
    update: { value: settings as never },
    create: { key: SETTINGS_KEY, value: settings as never }
  });
}