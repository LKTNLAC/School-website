import type { FaqItem } from './types';

import { prisma } from '@/lib/db';


export async function findPublished(): Promise<FaqItem[]> {
  return prisma.faq.findMany({
    where: { status: 'PUBLISHED' },
    orderBy: { sortOrder: 'asc' },
    select: {
      id: true,
      question: true,
      answer: true,
      sortOrder: true
    }
  });
}