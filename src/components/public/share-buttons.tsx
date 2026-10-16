'use client';

import { useState } from 'react';

export function ShareButtons({ url }: { url: string; title: string }) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // ignore
    }
  }

  return (
    <div className="mt-8 flex flex-wrap items-center gap-3 border-t border-neutral-200 pt-6">
      <span className="text-sm text-neutral-600">Chia sẻ:</span>
      <a
        href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`}
        target="_blank"
        rel="noopener noreferrer"
        className="rounded-md border border-neutral-300 px-3 py-1.5 text-sm text-neutral-700 hover:bg-neutral-50"
      >
        Facebook
      </a>
      <button
        type="button"
        onClick={handleCopy}
        className="rounded-md border border-neutral-300 px-3 py-1.5 text-sm text-neutral-700 hover:bg-neutral-50"
        aria-label="Sao chép liên kết"
      >
        {copied ? 'Đã sao chép' : 'Sao chép liên kết'}
      </button>
    </div>
  );
}