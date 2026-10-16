import * as repository from './repository';
import type { AdmissionInfoItem } from './types';

export async function getPublishedAdmissions(): Promise<AdmissionInfoItem[]> {
  return repository.findPublished();
}

export async function getAdmissionByYear(year: string): Promise<AdmissionInfoItem | null> {
  return repository.findBySchoolYear(year);
}