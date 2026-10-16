export type SearchResultType = 'PAGE' | 'NEWS' | 'ANNOUNCEMENT' | 'EVENT' | 'DOCUMENT';

export type SearchResult = {
  id: string;
  type: SearchResultType;
  slug: string;
  title: string;
  summary: string | null;
  publishedAt: Date | null;
  href: string;
};

export type SearchResponse = {
  query: string;
  results: SearchResult[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
};