export const siteConfig = {
  name: process.env.NEXT_PUBLIC_SITE_NAME ?? 'Trường THPT',
  description:
    'Website chính thức của trường THPT — thông tin, tin tức, tuyển sinh và hoạt động.',
  url: process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000',
  locale: 'vi-VN',
  defaultMetadata: {
    title: 'Trang chủ',
    description:
      'Website chính thức của trường THPT — thông tin, tin tức, tuyển sinh và hoạt động.'
  }
} as const;