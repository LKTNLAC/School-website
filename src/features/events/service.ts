import * as repository from './repository';
import type { EventDetail, EventListItem } from './types';

export async function getUpcomingEvents(limit?: number): Promise<EventListItem[]> {
  return repository.findUpcoming(limit);
}

export async function getPastEvents(limit?: number): Promise<EventListItem[]> {
  return repository.findPast(limit);
}

export async function getEventBySlug(slug: string): Promise<EventDetail | null> {
  return repository.findBySlug(slug);
}