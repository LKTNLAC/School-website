'use client';

import { useState } from 'react';

import type { FaqItem } from '@/features/faq/types';

export function FaqAccordion({ items }: { items: FaqItem[] }) {
  const [openId, setOpenId] = useState<string | null>(null);

  function toggle(id: string) {
    setOpenId((current) => (current === id ? null : id));
  }

  return (
    <div className="divide-y divide-neutral-200 rounded-lg border border-neutral-200 bg-white">
      {items.map((item) => {
        const isOpen = openId === item.id;
        return (
          <div key={item.id}>
            <button
              type="button"
              onClick={() => toggle(item.id)}
              aria-expanded={isOpen}
              className="flex w-full items-center justify-between gap-4 px-6 py-4 text-left hover:bg-neutral-50 focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-primary-600"
            >
              <span className="text-base font-medium text-neutral-900">
                {item.question}
              </span>
              <svg
                aria-hidden="true"
                viewBox="0 0 12 12"
                className={`h-3 w-3 flex-shrink-0 text-neutral-500 transition-transform ${
                  isOpen ? 'rotate-180' : ''
                }`}
              >
                <path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.5" fill="none" />
              </svg>
            </button>
            {isOpen ? (
              <div className="border-t border-neutral-100 px-6 py-4 text-sm leading-relaxed text-neutral-700 whitespace-pre-line">
                {item.answer}
              </div>
            ) : null}
          </div>
        );
      })}
    </div>
  );
}