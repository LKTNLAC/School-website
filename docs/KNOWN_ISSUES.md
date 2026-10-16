# Known Issues

## Security — 11 lỗ hổng còn lại sau Phase 5.1

**Ngày:** 2026-10-16
**Trạng thái:** Chấp nhận tạm thời

### Tóm tắt

Sau khi nâng Next.js 16.4.0, next-auth beta.32, eslint 9.39.5, vitest 5.0.4, còn 11 lỗ hổng:

- 0 critical
- 10 high (chủ yếu `braces` qua ESLint tooling)
- 1 moderate (`postcss` qua Next.js)

### Đánh giá rủi ro

- **`braces`**: dependency gián tiếp qua `eslint-config-next` → `@next/eslint-plugin-next` → `fast-glob` → `micromatch` → `braces`. Chỉ dùng trong dev/build. Không ảnh hưởng runtime production.
- **`postcss`**: dependency trực tiếp của Next.js. Vá ở bản Next.js tiếp theo.

### Biện pháp

- Không thể vá trực tiếp vì là dependency gián tiếp.
- Chờ upstream (Next.js, ESLint).
- Kiểm tra lại sau mỗi lần nâng Next.js.

### Điều kiện gỡ

- Khi Next.js ra bản vá `postcss`.
- Khi ESLint ra bản vá `braces`.

## @types/node invalid peer dependency

**Vấn đề:** `vitest@5.0.4` yêu cầu `@types/node@^22.0.0 || >=24.0.0`, project dùng `20.19.0`.

**Biện pháp:** Dùng `npm install --legacy-peer-deps`. Build PASS.

**Kế hoạch:** Nâng `@types/node` lên 22 khi nâng Node.js runtime lên 22 LTS.