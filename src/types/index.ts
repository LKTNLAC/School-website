export type UserRole = 'ADMIN' | 'EDITOR' | 'CONTRIBUTOR' | 'VIEWER';

export type UserStatus = 'ACTIVE' | 'DISABLED';

export type ContentType = 'PAGE' | 'NEWS' | 'ANNOUNCEMENT';

export type ContentStatus = 'DRAFT' | 'IN_REVIEW' | 'PUBLISHED' | 'ARCHIVED';

export type PublishableStatus = ContentStatus;

export type ApiError = {
  error: string;
  code?: string;
  details?: Record<string, string[]>;
};

export type ApiSuccess<T> = {
  data: T;
};