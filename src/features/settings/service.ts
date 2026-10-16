import * as repository from './repository';
import type { SiteSettingsInput } from './schema';
import type { SiteSettings } from './types';

export async function getSettings(): Promise<SiteSettings> {
  return repository.getSiteSettings();
}

export async function updateSettings(input: SiteSettingsInput): Promise<void> {
  await repository.upsertSiteSettings(input);
}