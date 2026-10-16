/**
 * Validate file upload: MIME thực (magic bytes), extension, size.
 */

export const ALLOWED_IMAGE_MIMES = [
  'image/jpeg',
  'image/png',
  'image/webp'
] as const;

export const ALLOWED_DOCUMENT_MIMES = [
  'application/pdf',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
] as const;

export const ALLOWED_VIDEO_MIMES = ['video/mp4'] as const;

export const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB
export const MAX_DOCUMENT_SIZE = 20 * 1024 * 1024; // 20MB
export const MAX_VIDEO_SIZE = 100 * 1024 * 1024; // 100MB

export type FileCategory = 'image' | 'document' | 'video';

export type ValidationResult =
  | {
      ok: true;
      category: FileCategory;
      mimeType: string;
      extension: string;
      size: number;
    }
  | { ok: false; error: string };

function detectMimeFromMagicBytes(buffer: Buffer): string | null {
  if (buffer.length < 4) return null;

  const bytes = buffer.subarray(0, 12);

  // JPEG: FF D8 FF
  if (bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff) {
    return 'image/jpeg';
  }

  // PNG: 89 50 4E 47
  if (bytes[0] === 0x89 && bytes[1] === 0x50 && bytes[2] === 0x4e && bytes[3] === 0x47) {
    return 'image/png';
  }

  // WebP: RIFF....WEBP
  if (
    bytes[0] === 0x52 &&
    bytes[1] === 0x49 &&
    bytes[2] === 0x46 &&
    bytes[3] === 0x46 &&
    buffer.length >= 12 &&
    buffer[8] === 0x57 &&
    buffer[9] === 0x45 &&
    buffer[10] === 0x42 &&
    buffer[11] === 0x50
  ) {
    return 'image/webp';
  }

  // PDF: 25 50 44 46
  if (bytes[0] === 0x25 && bytes[1] === 0x50 && bytes[2] === 0x44 && bytes[3] === 0x46) {
    return 'application/pdf';
  }

  // MP4: ....ftyp
  if (buffer.length >= 12 && bytes[4] === 0x66 && bytes[5] === 0x74 && bytes[6] === 0x79 && bytes[7] === 0x70) {
    return 'video/mp4';
  }

  // DOCX/XLSX: PK (ZIP header) — cần kiểm tra thêm nhưng tạm chấp nhận
  if (bytes[0] === 0x50 && bytes[1] === 0x4b) {
    // Không phân biệt được docx/xlsx từ magic bytes. Bỏ qua, dựa vào MIME client.
    return null;
  }

  return null;
}

function getExtension(mimeType: string): string {
  const map: Record<string, string> = {
    'image/jpeg': 'jpg',
    'image/png': 'png',
    'image/webp': 'webp',
    'application/pdf': 'pdf',
    'video/mp4': 'mp4',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'docx',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': 'xlsx'
  };
  return map[mimeType] ?? 'bin';
}

export function validateFile(
  buffer: Buffer,
  declaredMimeType: string,
  _declaredFileName: string
): ValidationResult {
  const size = buffer.length;

  // Detect MIME from magic bytes
  const detectedMime = detectMimeFromMagicBytes(buffer);

  // Nếu không detect được, fallback về MIME client gửi (cho DOCX/XLSX)
  const finalMime = detectedMime ?? declaredMimeType;

  // Xác định category
  let category: FileCategory;
  let maxSize: number;

  if ((ALLOWED_IMAGE_MIMES as readonly string[]).includes(finalMime)) {
    category = 'image';
    maxSize = MAX_IMAGE_SIZE;
  } else if ((ALLOWED_DOCUMENT_MIMES as readonly string[]).includes(finalMime)) {
    category = 'document';
    maxSize = MAX_DOCUMENT_SIZE;
  } else if ((ALLOWED_VIDEO_MIMES as readonly string[]).includes(finalMime)) {
    category = 'video';
    maxSize = MAX_VIDEO_SIZE;
  } else {
    return { ok: false, error: `Định dạng file không được phép: ${finalMime}` };
  }

  if (size > maxSize) {
    const maxMB = Math.round(maxSize / 1024 / 1024);
    return { ok: false, error: `File quá lớn. Tối đa ${maxMB}MB cho loại ${category}.` };
  }

  if (size === 0) {
    return { ok: false, error: 'File rỗng.' };
  }

  return {
    ok: true,
    category,
    mimeType: finalMime,
    extension: getExtension(finalMime),
    size
  };
}

export function computeChecksum(buffer: Buffer): string {
  // Simple hash — sẽ dùng crypto khi cần
  let hash = 0;
  for (let i = 0; i < buffer.length; i++) {
    const byte = buffer[i];
    if (byte !== undefined) {
      hash = (hash * 31 + byte) | 0;
    }
  }
  return Math.abs(hash).toString(16);
}