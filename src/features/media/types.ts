export type MediaAlbumItem = {
  id: string;
  slug: string;
  name: string;
  assetCount: number;
  coverUrl: string | null;
};
export type MediaAssetListItem = {
  id: string;
  storageKey: string;
  fileName: string;
  fileSize: number;
  mimeType: string;
  url: string;
  createdAt: Date;
  albumName: string | null;
};

export type MediaAlbumOption = {
  id: string;
  name: string;
};