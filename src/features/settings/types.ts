export type SiteSettings = {
  siteName: string;
  siteDescription: string;
  contactAddress: string;
  contactPhone: string;
  contactEmail: string;
  contactWorkingHours: string;
  seoDefaultTitle: string;
  seoDefaultDescription: string;
  footerCopyright: string;
};

export const DEFAULT_SETTINGS: SiteSettings = {
  siteName: 'Trường THPT',
  siteDescription:
    'Website chính thức của trường THPT — thông tin, tin tức, tuyển sinh và hoạt động.',
  contactAddress: 'Số 1, Đường Demo, Phường Demo, Quận Demo, TP. Demo',
  contactPhone: '(0123) 456 789',
  contactEmail: 'contact@example.com',
  contactWorkingHours: 'Thứ 2 - Thứ 6: 7h30 - 11h30, 13h30 - 17h00',
  seoDefaultTitle: 'Trường THPT',
  seoDefaultDescription:
    'Website chính thức của trường THPT — thông tin, tin tức, tuyển sinh và hoạt động.',
  footerCopyright: 'Bảo lưu mọi quyền.'
};