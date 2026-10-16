export type NavItem = {
  label: string;
  href: string;
  children?: NavItem[];
};

export const publicNavigation: NavItem[] = [
  { label: 'Trang chủ', href: '/' },
  {
    label: 'Giới thiệu',
    href: '/gioi-thieu',
    children: [
      { label: 'Về nhà trường', href: '/gioi-thieu' },
      { label: 'Sứ mệnh - Tầm nhìn', href: '/gioi-thieu/su-menh' },
      { label: 'Cơ cấu tổ chức', href: '/gioi-thieu/co-cau-to-chuc' },
      { label: 'Lịch sử hình thành', href: '/gioi-thieu/lich-su' }
    ]
  },
  {
    label: 'Đào tạo',
    href: '/dao-tao',
    children: [
      { label: 'Tổ chuyên môn', href: '/to-chuyen-mon' },
      { label: 'Đội ngũ giáo viên', href: '/doi-ngu' },
      { label: 'Hoạt động chuyên môn', href: '/dao-tao/hoat-dong' }
    ]
  },
  {
    label: 'Tin tức',
    href: '/tin-tuc',
    children: [
      { label: 'Tin tức', href: '/tin-tuc' },
      { label: 'Thông báo', href: '/thong-bao' },
      { label: 'Sự kiện', href: '/su-kien' }
    ]
  },
  { label: 'Tuyển sinh', href: '/tuyen-sinh' },
  { label: 'Tài nguyên', href: '/tai-nguyen' },
  { label: 'Liên hệ', href: '/lien-he' },
  { label: 'Tìm kiếm', href: '/tim-kiem' }
];

export const footerNavigation: { title: string; items: NavItem[] }[] = [
  {
    title: 'Về nhà trường',
    items: [
      { label: 'Giới thiệu', href: '/gioi-thieu' },
      { label: 'Sứ mệnh - Tầm nhìn', href: '/gioi-thieu/su-menh' },
      { label: 'Cơ cấu tổ chức', href: '/gioi-thieu/co-cau-to-chuc' },
      { label: 'Đội ngũ giáo viên', href: '/doi-ngu' }
    ]
  },
  {
    title: 'Thông tin',
    items: [
      { label: 'Tin tức', href: '/tin-tuc' },
      { label: 'Thông báo', href: '/thong-bao' },
      { label: 'Sự kiện', href: '/su-kien' },
      { label: 'Tuyển sinh', href: '/tuyen-sinh' }
    ]
  },
  {
    title: 'Hỗ trợ',
    items: [
      { label: 'Câu hỏi thường gặp', href: '/tuyen-sinh/faq' },
      { label: 'Tài nguyên', href: '/tai-nguyen' },
      { label: 'Thư viện ảnh', href: '/thu-vien' },
      { label: 'Liên hệ', href: '/lien-he' }
    ]
  }
];

export const adminNavigation: NavItem[] = [
  { label: 'Dashboard', href: '/admin' },
  { label: 'Nội dung', href: '/admin/noi-dung' },
  { label: 'Media', href: '/admin/media' },
  { label: 'Tài liệu', href: '/admin/tai-lieu' },
  { label: 'Người dùng', href: '/admin/nguoi-dung' },
  { label: 'Nhật ký', href: '/admin/nhat-ky' },
  { label: 'Cấu hình', href: '/admin/cau-hinh' }
];