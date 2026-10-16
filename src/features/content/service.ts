import * as repository from './repository';
import type { ContentCreateInput, ContentUpdateInput } from './schema';
import type { ContentDetail, ContentListItem, PaginatedResult } from './types';
import type { AdminContentDetail, AdminContentFilter, AdminContentListItem } from './types';

export async function getNewsList(page = 1, pageSize = 9): Promise<PaginatedResult<ContentListItem>> {
  return repository.findPublishedList('NEWS', { page, pageSize });
}

export async function getAnnouncementList(page = 1, pageSize = 9): Promise<PaginatedResult<ContentListItem>> {
  return repository.findPublishedList('ANNOUNCEMENT', { page, pageSize });
}

export async function getLatestNews(limit = 3): Promise<ContentListItem[]> {
  return repository.findLatest('NEWS', limit);
}

export async function getLatestAnnouncements(limit = 5): Promise<ContentListItem[]> {
  return repository.findLatest('ANNOUNCEMENT', limit);
}

export async function getPageBySlug(slug: string): Promise<ContentDetail | null> {
  return repository.findPublishedBySlug('PAGE', slug);
}

export async function getNewsBySlug(slug: string): Promise<ContentDetail | null> {
  return repository.findPublishedBySlug('NEWS', slug);
}

export async function getAnnouncementBySlug(slug: string): Promise<ContentDetail | null> {
  return repository.findPublishedBySlug('ANNOUNCEMENT', slug);
}

export async function getAdminContentList(
  filter: AdminContentFilter = {}
): Promise<PaginatedResult<AdminContentListItem>> {
  return repository.findAdminList(filter);
}

export async function getAdminContentById(id: string): Promise<AdminContentDetail | null> {
  return repository.findAdminById(id);
}

export async function createContent(
  input: ContentCreateInput,
  authorId: string
): Promise<{ id: string; slug: string }> {
  const exists = await repository.slugExists(input.slug, input.type);
  if (exists) {
    throw new Error('Slug đã tồn tại cho loại nội dung này.');
  }
  return repository.createContent(input, authorId);
}

export async function updateContent(
  input: ContentUpdateInput
): Promise<{ id: string; slug: string }> {
  const detail = await repository.findAdminById(input.id);
  if (!detail) {
    throw new Error('Không tìm thấy nội dung.');
  }

  const exists = await repository.slugExists(input.slug, detail.type, input.id);
  if (exists) {
    throw new Error('Slug đã tồn tại cho loại nội dung này.');
  }

  return repository.updateContent(input.id, {
    title: input.title,
    slug: input.slug,
    summary: input.summary,
    body: input.body,
    seoTitle: input.seoTitle,
    seoDescription: input.seoDescription,
    categoryId: input.categoryId
  });
}

export async function getCategories(): Promise<{ id: string; name: string }[]> {
  return repository.findCategories();
}

export async function publishContent(id: string, publishedBy: string): Promise<void> {
  const detail = await repository.findAdminById(id);
  if (!detail) throw new Error('Không tìm thấy nội dung.');

  const snapshot = {
    title: detail.title,
    slug: detail.slug,
    summary: detail.summary,
    body: detail.body,
    seoTitle: detail.seoTitle,
    seoDescription: detail.seoDescription,
    categoryId: detail.categoryId
  };

  await repository.updateStatus(id, 'PUBLISHED');
  await repository.createRevision(id, snapshot, publishedBy);
}

export async function archiveContent(id: string): Promise<void> {
  await repository.updateStatus(id, 'ARCHIVED');
}

export async function submitForReview(id: string): Promise<void> {
  await repository.updateStatus(id, 'IN_REVIEW');
}

export async function revertToDraft(id: string): Promise<void> {
  await repository.updateStatus(id, 'DRAFT');
}

export async function softDeleteContent(id: string): Promise<void> {
  await repository.softDelete(id);
}

export async function hardDeleteContent(id: string): Promise<void> {
  await repository.hardDelete(id);
}

export async function getContentRevisions(contentId: string) {
  return repository.findRevisions(contentId);
}

export async function getContentAuthorId(id: string): Promise<string | null> {
  return repository.findAuthorId(id);
}

export async function restoreFromRevision(
  revisionId: string,
  createdBy: string
): Promise<{ id: string }> {
  const revision = await repository.findRevisionSnapshot(revisionId);
  if (!revision) throw new Error('Không tìm thấy revision.');

  const snapshot = revision.snapshot as Record<string, unknown>;

  await repository.updateContent(revision.contentId, {
    title: String(snapshot.title ?? ''),
    slug: String(snapshot.slug ?? ''),
    summary: snapshot.summary ? String(snapshot.summary) : '',
    body: String(snapshot.body ?? ''),
    seoTitle: snapshot.seoTitle ? String(snapshot.seoTitle) : '',
    seoDescription: snapshot.seoDescription ? String(snapshot.seoDescription) : '',
    categoryId: snapshot.categoryId ? String(snapshot.categoryId) : ''
  });

  await repository.updateStatus(revision.contentId, 'DRAFT');
  await repository.createRevision(revision.contentId, snapshot, createdBy);

  return { id: revision.contentId };
}