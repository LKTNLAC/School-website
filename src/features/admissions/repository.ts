import type { AdmissionInfoItem } from './types';

import { prisma } from '@/lib/db';


export async function findPublished(): Promise<AdmissionInfoItem[]> {
  const rows = await prisma.admissionInfo.findMany({
    where: { status: 'PUBLISHED' },
    orderBy: { schoolYear: 'desc' },
    select: {
      id: true,
      schoolYear: true,
      title: true,
      body: true
    }
  });

  return rows;
}

export async function findBySchoolYear(year: string): Promise<AdmissionInfoItem | null> {
  return prisma.admissionInfo.findUnique({
    where: { schoolYear: year },
    select: {
      id: true,
      schoolYear: true,
      title: true,
      body: true
    }
  });
}