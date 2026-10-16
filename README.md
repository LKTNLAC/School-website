# School Website — THPT + CMS

Website công khai trường THPT và CMS quản trị nội dung.

## Trạng thái

Phase 2 — Foundation. Chưa có public features, chưa có admin features.

## Yêu cầu

- Node.js 20 LTS
- PostgreSQL 16
- npm 10+

## Cài đặt

```bash
npm install
cp .env.example .env
# Sửa .env với thông tin thực tế
npx prisma generate
npx prisma migrate dev
npm run db:seed
npm run dev
```
Script
npm run dev — chạy dev server

npm run build — build production

npm run start — chạy production

npm run lint — lint

npm run typecheck — kiểm tra type

npm run test — unit test

npm run test:e2e — E2E test

npm run db:migrate — migration dev

npm run db:seed — seed demo data

Cấu trúc
Xem docs/ARCHITECTURE.md và docs/FILE_MANIFEST.md.

Lưu ý
Không commit .env.

Không sửa schema mà không cập nhật docs/DATA_MODEL.md.

Mọi thay đổi kiến trúc cần Change Request.


---

## 3. DESIGN TOKENS

### 3.1. `src/styles/tokens.css`

```css
:root {
  /* Colors — primary */
  --color-primary-50: 210 100% 97%;
  --color-primary-100: 210 100% 92%;
  --color-primary-500: 210 80% 45%;
  --color-primary-600: 210 80% 38%;
  --color-primary-700: 210 80% 30%;
  --color-primary-900: 210 80% 18%;

  /* Colors — neutral */
  --color-neutral-50: 210 20% 98%;
  --color-neutral-100: 210 16% 95%;
  --color-neutral-200: 210 14% 89%;
  --color-neutral-500: 210 10% 45%;
  --color-neutral-700: 210 12% 25%;
  --color-neutral-900: 210 15% 12%;

  /* Colors — semantic */
  --color-success: 142 70% 40%;
  --color-warning: 38 92% 50%;
  --color-error: 0 72% 50%;
  --color-info: 200 90% 45%;

  /* Radius */
  --radius-sm: 4px;
  --radius-md: 8px;
  --radius-lg: 12px;

  /* Shadow */
  --shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.05);
  --shadow-md: 0 4px 8px rgba(0, 0, 0, 0.08);
  --shadow-lg: 0 8px 24px rgba(0, 0, 0, 0.12);

  /* Font */
  --font-sans: 'Inter', system-ui, sans-serif;

  /* Motion */
  --motion-fast: 150ms;
  --motion-normal: 250ms;
  --motion-slow: 350ms;
}

@media (prefers-reduced-motion: reduce) {
  :root {
    --motion-fast: 0ms;
    --motion-normal: 0ms;
    --motion-slow: 0ms;
  }
}

