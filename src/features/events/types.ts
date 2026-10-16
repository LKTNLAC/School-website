export type EventListItem = {
  id: string;
  slug: string;
  title: string;
  location: string | null;
  startAt: Date;
  endAt: Date | null;
};

export type EventDetail = EventListItem & {
  description: string;
};