import * as repository from './repository';
import type { FaqItem } from './types';

export async function getPublishedFaqs(): Promise<FaqItem[]> {
  return repository.findPublished();
}