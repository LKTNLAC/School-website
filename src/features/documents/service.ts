import * as repository from './repository';
import type { DocumentCreateInput } from './schema';
import type { DocumentDetail, DocumentListItem } from './types';
import type {
  AdminDocumentDetail,
  AdminDocumentListItem,
  DocumentRevisionListItem
} from './types';

import { computeChecksum, validateFile } from '@/lib/file-validation';
import { putObject } from '@/lib/storage';


export async function getPublishedDocuments(): Promise<DocumentListItem[]> {
  return repository.findPublished();
}

export async function getDocumentBySlug(slug: string): Promise<DocumentDetail | null> {
  return repository.findBySlug(slug);
}

export async function getAdminDocumentList(): Promise<AdminDocumentListItem[]> {
  return repository.findAdminList();
}

export async function getAdminDocumentById(id: string): Promise<AdminDocumentDetail | null> {
  return repository.findAdminById(id);
}

export async function getDocumentRevisions(
  documentId: string
): Promise<DocumentRevisionListItem[]> {
  return repository.findDocumentRevisions(documentId);
}

export async function createDocument(
  input: DocumentCreateInput
): Promise<{ id: string; slug: string }> {
  const exists = await repository.slugExists(input.slug);
  if (exists) throw new Error('Slug đã tồn tại.');
  return repository.createDocument(input);
}

export async function updateDocument(
  id: string,
  input: DocumentCreateInput
): Promise<{ id: string; slug: string }> {
  const exists = await repository.slugExists(input.slug, id);
  if (exists) throw new Error('Slug đã tồn tại.');
  return repository.updateDocumentMeta(id, input);
}

export async function uploadDocumentRevision(
  documentId: string,
  buffer: Buffer,
  fileName: string,
  mimeType: string,
  createdBy: string
): Promise<{ revisionId: string; storageKey: string }> {
  const validation = validateFile(buffer, mimeType, fileName);
  if (!validation.ok) throw new Error(validation.error);

  // Chỉ chấp nhận document category
  if (validation.category !== 'document') {
    throw new Error('Chỉ chấp nhận file tài liệu (PDF, DOCX, XLSX).');
  }

  const checksum = computeChecksum(buffer);
  const stored = await putObject({
    buffer,
    mimeType: validation.mimeType,
    extension: validation.extension,
    prefix: `documents/${documentId}`
  });

  const revision = await repository.createDocumentRevision({
    documentId,
    storageKey: stored.key,
    fileName,
    fileSize: stored.size,
    mimeType: validation.mimeType,
    checksum,
    createdBy
  });

  return { revisionId: revision.id, storageKey: stored.key };
}

export async function deleteDocument(id: string): Promise<void> {
  await repository.softDeleteDocument(id);
}