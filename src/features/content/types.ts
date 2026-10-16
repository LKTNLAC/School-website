export type ContentType = 'PAGE' | 'NEWS' | 'ANNOUNCEMENT';
export type ContentStatus = 'DRAFT' | 'IN_REVIEW' | 'PUBLISHED' | 'ARCHIVED';

export type ContentListItem = {
  id: string;
  type: ContentType;
  slug: string;
  title: string;
  summary: string | null;
  publishedAt: Date | null;
  category: { id: string; name: string; slug: string } | null;
};

export type ContentDetail = ContentListItem & {
  body: string;
  seoTitle: string | null;
  seoDescription: string | null;
};

export type PaginatedResult<T> = {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
};
export type AdminContentFilter = {
  type?: 'PAGE' | 'NEWS' | 'ANNOUNCEMENT';
  status?: 'DRAFT' | 'IN_REVIEW' | 'PUBLISHED' | 'ARCHIVED';
  search?: string;
  page?: number;
  pageSize?: number;
};

export type AdminContentListItem = {
  id: string;
  type: 'PAGE' | 'NEWS' | 'ANNOUNCEMENT';
  slug: string;
  title: string;
  status: string;
  publishedAt: Date | null;
  updatedAt: Date;
  authorName: string | null;
  categoryName: string | null;
};

export type AdminContentDetail = {
  id: string;
  type: 'PAGE' | 'NEWS' | 'ANNOUNCEMENT';
  slug: string;
  title: string;
  summary: string | null;
  body: string;
  status: string;
  seoTitle: string | null;
  seoDescription: string | null;
  categoryId: string | null;
  publishedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
};