import { PrismaClient } from '@prisma/client';
import { hash } from 'bcryptjs';

const prisma = new PrismaClient();

const IS_DEMO = process.env.IS_DEMO === 'true';

async function main() {
  if (!IS_DEMO) {
    console.log('IS_DEMO != true — bỏ qua seed.');
    return;
  }

  console.log('Bắt đầu seed dữ liệu DEMO...');

  const passwordHash = await hash('ChangeMe123!', 12);

  const admin = await prisma.user.upsert({
    where: { email: 'admin@demo.local' },
    update: {},
    create: {
      email: 'admin@demo.local',
      passwordHash,
      name: 'Admin Demo',
      role: 'ADMIN',
      status: 'ACTIVE'
    }
  });

  const editor = await prisma.user.upsert({
    where: { email: 'editor@demo.local' },
    update: {},
    create: {
      email: 'editor@demo.local',
      passwordHash,
      name: 'Editor Demo',
      role: 'EDITOR',
      status: 'ACTIVE'
    }
  });

  const department = await prisma.department.upsert({
    where: { slug: 'to-toan' },
    update: {},
    create: { name: 'Tổ Toán', slug: 'to-toan', description: 'Tổ chuyên môn Toán' }
  });

  await prisma.staff.upsert({
    where: { slug: 'nguyen-van-a' },
    update: {},
    create: {
      slug: 'nguyen-van-a',
      fullName: 'Nguyễn Văn A',
      position: 'Giáo viên',
      departmentId: department.id
    }
  });

  await prisma.content.upsert({
    where: { type_slug: { type: 'PAGE', slug: 'gioi-thieu' } },
    update: {},
    create: {
      type: 'PAGE',
      slug: 'gioi-thieu',
      title: 'Giới thiệu trường',
      body: '# Giới thiệu\n\nĐây là nội dung DEMO.',
      status: 'PUBLISHED',
      publishedAt: new Date(),
      authorId: admin.id
    }
  });

  // ===== Demo data cho trang chủ =====

  // Danh mục
  const catTinTuc = await prisma.category.upsert({
    where: { slug: 'tin-nha-truong' },
    update: {},
    create: { name: 'Tin nhà trường', slug: 'tin-nha-truong' }
  });

  const catHoatDong = await prisma.category.upsert({
    where: { slug: 'hoat-dong' },
    update: {},
    create: { name: 'Hoạt động', slug: 'hoat-dong' }
  });

  // Tin tức demo
  const newsData = [
    {
      slug: 'le-khai-giang-nam-hoc-2025-2026',
      title: 'Lễ khai giảng năm học 2025-2026',
      summary:
        'Sáng ngày 5/9, nhà trường long trọng tổ chức lễ khai giảng năm học mới với sự tham gia của toàn thể cán bộ, giáo viên và học sinh.',
      categoryId: catTinTuc.id
    },
    {
      slug: 'hoi-thao-doi-moi-phuong-phap-day-hoc',
      title: 'Hội thảo đổi mới phương pháp dạy học',
      summary:
        'Nhà trường tổ chức hội thảo nhằm nâng cao chất lượng giảng dạy và cập nhật phương pháp sư phạm hiện đại.',
      categoryId: catHoatDong.id
    },
    {
      slug: 'hoc-sinh-dat-giai-hoc-sinh-gioi-quoc-gia',
      title: 'Học sinh nhà trường đạt giải học sinh giỏi quốc gia',
      summary:
        'Ba học sinh của trường đã xuất sắc đạt giải trong kỳ thi học sinh giỏi quốc gia năm nay.',
      categoryId: catTinTuc.id
    }
  ];

  for (let i = 0; i < newsData.length; i++) {
    const n = newsData[i];
    if (!n) continue;
    await prisma.content.upsert({
      where: { type_slug: { type: 'NEWS', slug: n.slug } },
      update: {},
      create: {
        type: 'NEWS',
        slug: n.slug,
        title: n.title,
        summary: n.summary,
        body: `# ${n.title}\n\n${n.summary}\n\nNội dung chi tiết sẽ được cập nhật.`,
        status: 'PUBLISHED',
        publishedAt: new Date(Date.now() - i * 24 * 60 * 60 * 1000),
        authorId: editor.id,
        categoryId: n.categoryId
      }
    });
  }

  // Sự kiện demo
  const now = new Date();
  const eventsData = [
    {
      slug: 'ngay-hoi-truyen-thong',
      title: 'Ngày hội truyền thống nhà trường',
      location: 'Sân trường',
      daysFromNow: 7
    },
    {
      slug: 'hoi-khoe-phu-dong',
      title: 'Hội khỏe Phù Đổng cấp trường',
      location: 'Nhà thi đấu',
      daysFromNow: 14
    },
    {
      slug: 'giao-luu-van-nghe',
      title: 'Giao lưu văn nghệ chào mừng 20/11',
      location: 'Hội trường',
      daysFromNow: 21
    }
  ];

  for (const e of eventsData) {
    const startAt = new Date(now.getTime() + e.daysFromNow * 24 * 60 * 60 * 1000);
    await prisma.event.upsert({
      where: { slug: e.slug },
      update: {},
      create: {
        slug: e.slug,
        title: e.title,
        description: `${e.title} — sự kiện quan trọng của nhà trường.`,
        location: e.location,
        startAt,
        status: 'PUBLISHED',
        authorId: editor.id
      }
    });
  }

  
  // ===== Trang tĩnh giới thiệu =====
  const pagesData = [
    {
      slug: 'gioi-thieu',
      title: 'Giới thiệu nhà trường',
      summary: 'Tổng quan về nhà trường.',
      body: `Trường THPT Demo là cơ sở giáo dục phổ thông với bề dày truyền thống.

Nhà trường có đội ngũ giáo viên giàu kinh nghiệm, cơ sở vật chất hiện đại và môi trường học tập thân thiện.

Chúng tôi cam kết mang đến cho học sinh nền tảng kiến thức vững vàng và kỹ năng cần thiết cho tương lai.`
    },
    {
      slug: 'su-menh',
      title: 'Sứ mệnh - Tầm nhìn - Giá trị cốt lõi',
      summary: 'Định hướng phát triển của nhà trường.',
      body: `Sứ mệnh
Đào tạo thế hệ trẻ có kiến thức, kỹ năng và phẩm chất đạo đức tốt, sẵn sàng hội nhập.

Tầm nhìn
Trở thành trường THPT chất lượng cao, được cộng đồng tin tưởng và học sinh yêu mến.

Giá trị cốt lõi
- Chất lượng
- Trách nhiệm
- Sáng tạo
- Nhân văn`
    },
    {
      slug: 'lich-su',
      title: 'Lịch sử hình thành và phát triển',
      summary: 'Quá trình hình thành và phát triển của nhà trường.',
      body: `Nhà trường được thành lập với sứ mệnh đào tạo thế hệ trẻ.

Trải qua nhiều giai đoạn phát triển, nhà trường không ngừng nâng cao chất lượng giáo dục.

Đến nay, nhà trường đã đạt được nhiều thành tích trong công tác giảng dạy và học tập.`
    },
    {
      slug: 'co-cau-to-chuc',
      title: 'Cơ cấu tổ chức',
      summary: 'Cơ cấu tổ chức của nhà trường.',
      body: 'Thông tin chi tiết về ban giám hiệu và các tổ chuyên môn.'
    }
  ];

  for (const p of pagesData) {
    await prisma.content.upsert({
      where: { type_slug: { type: 'PAGE', slug: p.slug } },
      update: {},
      create: {
        type: 'PAGE',
        slug: p.slug,
        title: p.title,
        summary: p.summary,
        body: p.body,
        status: 'PUBLISHED',
        publishedAt: new Date(),
        authorId: admin.id
      }
    });
  }

  // ===== Nhân sự demo =====
  const staffData = [
    { slug: 'nguyen-van-hieu-truong', fullName: 'Nguyễn Văn A', position: 'Hiệu trưởng', deptSlug: null },
    { slug: 'tran-thi-pho-hieu-truong', fullName: 'Trần Thị B', position: 'Phó Hiệu trưởng', deptSlug: null },
    { slug: 'le-van-toan', fullName: 'Lê Văn C', position: 'Giáo viên', deptSlug: 'to-toan' },
    { slug: 'pham-thi-van', fullName: 'Phạm Thị D', position: 'Giáo viên', deptSlug: 'to-toan' },
    { slug: 'hoang-van-anh', fullName: 'Hoàng Văn E', position: 'Giáo viên', deptSlug: 'to-toan' }
  ];

  const toToan = await prisma.department.upsert({
    where: { slug: 'to-toan' },
    update: {},
    create: {
      name: 'Tổ Toán',
      slug: 'to-toan',
      description: 'Tổ chuyên môn Toán - Tin học'
    }
  });

  for (const s of staffData) {
    let deptId: string | null = null;
    if (s.deptSlug === 'to-toan') deptId = toToan.id;

    await prisma.staff.upsert({
      where: { slug: s.slug },
      update: {},
      create: {
        slug: s.slug,
        fullName: s.fullName,
        position: s.position,
        departmentId: deptId
      }
    });
  }
  // ===== Tổ chuyên môn bổ sung =====
  const departmentsExtra = [
    {
      slug: 'to-van',
      name: 'Tổ Ngữ văn',
      description: 'Tổ chuyên môn Ngữ văn - Lịch sử - Địa lý'
    },
    {
      slug: 'to-anh',
      name: 'Tổ Ngoại ngữ',
      description: 'Tổ chuyên môn Tiếng Anh'
    },
    {
      slug: 'to-ly-hoa-sinh',
      name: 'Tổ Lý - Hóa - Sinh',
      description: 'Tổ chuyên môn Vật lý, Hóa học, Sinh học'
    },
    {
      slug: 'to-the-duc',
      name: 'Tổ Thể dục - GDQP',
      description: 'Tổ chuyên môn Thể dục và Giáo dục quốc phòng'
    }
  ];

  for (const d of departmentsExtra) {
    await prisma.department.upsert({
      where: { slug: d.slug },
      update: {},
      create: d
    });
  }

  // ===== Nhân sự bổ sung =====
  const staffExtra = [
    { slug: 'nguyen-thi-van', fullName: 'Nguyễn Thị V', position: 'Tổ trưởng', deptSlug: 'to-van' },
    { slug: 'tran-van-ngu', fullName: 'Trần Văn N', position: 'Giáo viên', deptSlug: 'to-van' },
    { slug: 'le-thi-anh', fullName: 'Lê Thị A', position: 'Tổ trưởng', deptSlug: 'to-anh' },
    { slug: 'pham-van-binh', fullName: 'Phạm Văn B', position: 'Giáo viên', deptSlug: 'to-anh' },
    { slug: 'hoang-thi-cuc', fullName: 'Hoàng Thị C', position: 'Tổ trưởng', deptSlug: 'to-ly-hoa-sinh' },
    { slug: 'do-van-dung', fullName: 'Đỗ Văn D', position: 'Giáo viên', deptSlug: 'to-ly-hoa-sinh' },
    { slug: 'vu-van-em', fullName: 'Vũ Văn E', position: 'Tổ trưởng', deptSlug: 'to-the-duc' }
  ];

  for (const s of staffExtra) {
    const dept = await prisma.department.findUnique({
      where: { slug: s.deptSlug }
    });
    if (!dept) continue;

    await prisma.staff.upsert({
      where: { slug: s.slug },
      update: {},
      create: {
        slug: s.slug,
        fullName: s.fullName,
        position: s.position,
        departmentId: dept.id
      }
    });
  }

  // ===== Tuyển sinh demo =====
  await prisma.admissionInfo.upsert({
    where: { schoolYear: '2025-2026' },
    update: {},
    create: {
      schoolYear: '2025-2026',
      title: 'Tuyển sinh năm học 2025-2026',
      body: `Đối tượng tuyển sinh
  Học sinh đã tốt nghiệp THCS trên địa bàn và các khu vực lân cận.

  Chỉ tiêu tuyển sinh
  - Lớp 10: 360 học sinh (8 lớp)
  - Hệ chuyên: 70 học sinh

  Hồ sơ dự tuyển
  - Đơn xin dự tuyển (theo mẫu)
  - Học bạ THCS (bản chính)
  - Bằng tốt nghiệp THCS (bản chính hoặc công chứng)
  - Giấy khai sinh (bản sao công chứng)
  - Ảnh 3x4 (4 ảnh)

  Thời gian tuyển sinh
  - Nhận hồ sơ: từ 01/06/2025 đến 15/07/2025
  - Thi tuyển: 20/07/2025
  - Công bố kết quả: 30/07/2025
  - Nhập học: từ 01/08/2025 đến 10/08/2025

  Địa điểm nộp hồ sơ
  Phòng Hành chính - Văn phòng nhà trường
  Thời gian: 8h00 - 11h00 và 14h00 - 16h30 (thứ 2 - thứ 6)`,
      status: 'PUBLISHED'
    }
  });

  // ===== FAQ demo =====
  const faqData = [
    {
      question: 'Hồ sơ tuyển sinh cần những giấy tờ gì?',
      answer: 'Hồ sơ bao gồm: đơn xin dự tuyển, học bạ THCS, bằng tốt nghiệp THCS, giấy khai sinh và ảnh 3x4. Chi tiết xem tại trang Tuyển sinh.',
      sortOrder: 1
    },
    {
      question: 'Thời gian nhận hồ sơ là khi nào?',
      answer: 'Nhà trường nhận hồ sơ từ ngày 01/06 đến hết ngày 15/07 hàng năm. Thời gian cụ thể có thể thay đổi theo thông báo chính thức.',
      sortOrder: 2
    },
    {
      question: 'Trường có tổ chức thi tuyển không?',
      answer: 'Có. Nhà trường tổ chức thi tuyển đối với học sinh đăng ký vào lớp 10. Hình thức và môn thi theo quy định của Sở Giáo dục và Đào tạo.',
      sortOrder: 3
    },
    {
      question: 'Học phí của trường là bao nhiêu?',
      answer: 'Học phí được thực hiện theo quy định của Nhà nước đối với trường THPT công lập. Chi tiết xin liên hệ văn phòng nhà trường.',
      sortOrder: 4
    },
    {
      question: 'Trường có xe đưa đón học sinh không?',
      answer: 'Nhà trường không tổ chức xe đưa đón. Học sinh tự túc phương tiện đi lại hoặc sử dụng dịch vụ xe buýt công cộng.',
      sortOrder: 5
    }
  ];

  for (const f of faqData) {
    const existing = await prisma.faq.findFirst({
      where: { question: f.question }
    });
    if (!existing) {
      await prisma.faq.create({
        data: {
          question: f.question,
          answer: f.answer,
          sortOrder: f.sortOrder,
          status: 'PUBLISHED'
        }
      });
    }
  }

  // ===== Thêm nhiều tin tức, thông báo demo =====
  const moreNews = [
    {
      slug: 'hoi-nghi-phu-huynh-hoc-sinh-ky-1',
      title: 'Hội nghị phụ huynh học sinh học kỳ 1',
      summary: 'Nhà trường tổ chức hội nghị phụ huynh nhằm trao đổi về tình hình học tập của học sinh.',
      categoryId: catTinTuc.id
    },
    {
      slug: 'trai-nghiem-sang-tao-stem',
      title: 'Ngày hội trải nghiệm sáng tạo STEM',
      summary: 'Học sinh tham gia các hoạt động STEM bổ ích và sáng tạo.',
      categoryId: catHoatDong.id
    },
    {
      slug: 'chuyen-de-huong-nghiep-lop-12',
      title: 'Chuyên đề hướng nghiệp cho học sinh lớp 12',
      summary: 'Nhà trường phối hợp tổ chức chuyên đề hướng nghiệp giúp học sinh định hướng tương lai.',
      categoryId: catHoatDong.id
    },
    {
      slug: 'hoc-sinh-giao-luu-quoc-te',
      title: 'Học sinh nhà trường giao lưu với trường quốc tế',
      summary: 'Buổi giao lưu giúp học sinh mở rộng hiểu biết và rèn luyện kỹ năng ngoại ngữ.',
      categoryId: catHoatDong.id
    },
    {
      slug: 'le-tong-ket-nam-hoc',
      title: 'Lễ tổng kết năm học và trao thưởng học sinh giỏi',
      summary: 'Nhà trường tổ chức lễ tổng kết và trao thưởng cho học sinh có thành tích xuất sắc.',
      categoryId: catTinTuc.id
    }
  ];

  for (let i = 0; i < moreNews.length; i++) {
    const n = moreNews[i];
    if (!n) continue;
    await prisma.content.upsert({
      where: { type_slug: { type: 'NEWS', slug: n.slug } },
      update: {},
      create: {
        type: 'NEWS',
        slug: n.slug,
        title: n.title,
        summary: n.summary,
        body: `# ${n.title}\n\n${n.summary}\n\nNội dung chi tiết sẽ được cập nhật.`,
        status: 'PUBLISHED',
        publishedAt: new Date(Date.now() - (i + 3) * 24 * 60 * 60 * 1000),
        authorId: editor.id,
        categoryId: n.categoryId
      }
    });
  }

  // ===== Thông báo demo =====
  const announcements = [
    {
      slug: 'thong-bao-lich-nghi-tet',
      title: 'Thông báo lịch nghỉ Tết Nguyên đán',
      summary: 'Nhà trường thông báo lịch nghỉ Tết cho cán bộ, giáo viên và học sinh.',
      daysAgo: 1
    },
    {
      slug: 'thong-bao-thi-hoc-ky-1',
      title: 'Thông báo lịch thi học kỳ 1',
      summary: 'Lịch thi học kỳ 1 năm học 2025-2026 cho các khối lớp.',
      daysAgo: 3
    },
    {
      slug: 'thong-bao-tuyen-sinh-bo-sung',
      title: 'Thông báo tuyển sinh bổ sung',
      summary: 'Nhà trường thông báo tuyển sinh bổ sung một số chỉ tiêu.',
      daysAgo: 5
    },
    {
      slug: 'thong-bao-hop-phu-huynh',
      title: 'Thông báo họp phụ huynh học sinh',
      summary: 'Nhà trường tổ chức họp phụ huynh học sinh các khối lớp.',
      daysAgo: 7
    },
    {
      slug: 'thong-bao-tuyen-dung-giao-vien',
      title: 'Thông báo tuyển dụng giáo viên',
      summary: 'Nhà trường có nhu cầu tuyển dụng giáo viên các bộ môn.',
      daysAgo: 10
    },
    {
      slug: 'thong-bao-hoc-bu',
      title: 'Thông báo lịch học bù',
      summary: 'Lịch học bù cho các lớp do nghỉ lễ.',
      daysAgo: 12
    },
    {
      slug: 'thong-bao-kham-suc-khoe',
      title: 'Thông báo khám sức khỏe định kỳ',
      summary: 'Nhà trường phối hợp tổ chức khám sức khỏe định kỳ cho học sinh.',
      daysAgo: 15
    }
  ];

  for (const a of announcements) {
    await prisma.content.upsert({
      where: { type_slug: { type: 'ANNOUNCEMENT', slug: a.slug } },
      update: {},
      create: {
        type: 'ANNOUNCEMENT',
        slug: a.slug,
        title: a.title,
        summary: a.summary,
        body: `# ${a.title}\n\n${a.summary}\n\nChi tiết xem tại văn phòng nhà trường.`,
        status: 'PUBLISHED',
        publishedAt: new Date(Date.now() - a.daysAgo * 24 * 60 * 60 * 1000),
        authorId: editor.id
      }
    });
  }

  // ===== Sự kiện đã qua =====
  const pastEvents = [
    {
      slug: 'khai-giang-nam-hoc-moi',
      title: 'Lễ khai giảng năm học mới',
      location: 'Sân trường',
      daysAgo: 30
    },
    {
      slug: 'hoi-thao-huong-nghiep',
      title: 'Hội thảo hướng nghiệp cho học sinh lớp 12',
      location: 'Hội trường',
      daysAgo: 45
    }
  ];

  for (const e of pastEvents) {
    const startAt = new Date(now.getTime() - e.daysAgo * 24 * 60 * 60 * 1000);
    await prisma.event.upsert({
      where: { slug: e.slug },
      update: {},
      create: {
        slug: e.slug,
        title: e.title,
        description: `${e.title} đã diễn ra thành công tốt đẹp.`,
        location: e.location,
        startAt,
        status: 'PUBLISHED',
        authorId: editor.id
      }
    });
  }

  // ===== Thư viện ảnh demo =====
  const albumData = [
    {
      slug: 'le-khai-giang-2025',
      name: 'Lễ khai giảng 2025-2026'
    },
    {
      slug: 'hoat-dong-ngoai-khoa',
      name: 'Hoạt động ngoại khóa'
    },
    {
      slug: 'co-so-vat-chat',
      name: 'Cơ sở vật chất nhà trường'
    }
  ];

  for (const a of albumData) {
    await prisma.mediaAlbum.upsert({
      where: { slug: a.slug },
      update: {},
      create: a
    });
  }

  // ===== Tài liệu demo =====
  const documentData = [
    {
      slug: 'noi-quy-hoc-sinh',
      title: 'Nội quy học sinh',
      fileName: 'noi-quy-hoc-sinh.pdf',
      mimeType: 'application/pdf',
      fileSize: 245000
    },
    {
      slug: 'bieu-mau-dang-ky-tuyen-sinh',
      title: 'Biểu mẫu đăng ký tuyển sinh',
      fileName: 'bieu-mau-dang-ky.pdf',
      mimeType: 'application/pdf',
      fileSize: 128000
    },
    {
      slug: 'huong-dan-su-dung-thu-vien',
      title: 'Hướng dẫn sử dụng thư viện',
      fileName: 'huong-dan-thu-vien.pdf',
      mimeType: 'application/pdf',
      fileSize: 89000
    },
    {
      slug: 'de-thi-thu-toan-2025',
      title: 'Đề thi thử môn Toán 2025',
      fileName: 'de-thi-thu-toan.pdf',
      mimeType: 'application/pdf',
      fileSize: 320000
    }
  ];

  for (const d of documentData) {
    const doc = await prisma.document.upsert({
      where: { slug: d.slug },
      update: {},
      create: {
        slug: d.slug,
        title: d.title,
        status: 'PUBLISHED'
      }
    });

    // Tạo revision demo
    const existing = await prisma.documentRevision.findFirst({
      where: { documentId: doc.id }
    });

    if (!existing) {
      await prisma.documentRevision.create({
        data: {
          documentId: doc.id,
          storageKey: `documents/demo/${d.slug}.pdf`,
          fileName: d.fileName,
          fileSize: d.fileSize,
          mimeType: d.mimeType,
          checksum: 'demo-checksum-' + d.slug,
          snapshot: { demo: true },
          createdBy: admin.id
        }
      });
    }
  }

  console.log('Đã thêm thư viện và tài liệu demo.');

  console.log('Đã thêm tin tức, thông báo, sự kiện demo.');

  console.log('Đã thêm tuyển sinh và FAQ demo.');

  console.log('Đã thêm trang giới thiệu và nhân sự demo.');

  console.log('Seed hoàn tất.');
  console.log('  Admin: admin@demo.local / ChangeMe123!');
  console.log('  Editor: editor@demo.local / ChangeMe123!');
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
