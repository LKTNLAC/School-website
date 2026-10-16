export type DocumentListItem = {
  id: string;
  slug: string;
  title: string;
  fileName: string | null;
  fileSize: number | null;
  mimeType: string | null;
};

export type DocumentDetail = DocumentListItem & {
  storageKey: string | null;
};

export type AdminDocumentListItem = {
  id: string;
  slug: string;
  title: string;
  status: string;
  revisionCount: number;
  currentFileName: string | null;
  currentFileSize: number | null;
  updatedAt: Date;
};

export type AdminDocumentDetail = {
  id: string;
  slug: string;
  title: string;
  status: string;
  createdAt: Date;
  updatedAt: Date;
  currentRevision: {
    id: string;
    storageKey: string;
    fileName: string;
    fileSize: number;
    mimeType: string;
    checksum: string;
    createdAt: Date;
    pinned: boolean;
  } | null;
};

export type DocumentRevisionListItem = {
  id: string;
  fileName: string;
  fileSize: number;
  createdAt: Date;
  pinned: boolean;
  authorName: string | null;
  isCurrent: boolean;
};