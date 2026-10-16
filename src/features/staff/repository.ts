import type { DepartmentWithStaff, StaffListItem } from './types';

import { prisma } from '@/lib/db';


export async function findAllGroupedByDepartment(): Promise<DepartmentWithStaff[]> {
  const departments = await prisma.department.findMany({
    orderBy: { name: 'asc' },
    select: {
      id: true,
      name: true,
      slug: true,
      description: true,
      staff: {
        orderBy: { fullName: 'asc' },
        select: {
          id: true,
          slug: true,
          fullName: true,
          position: true,
          email: true,
          departmentId: true
        }
      }
    }
  });

  return departments.map((d) => ({
    id: d.id,
    name: d.name,
    slug: d.slug,
    description: d.description,
    staff: d.staff.map((s) => ({
      ...s,
      departmentName: d.name
    }))
  }));
}

export async function findAll(): Promise<StaffListItem[]> {
  const rows = await prisma.staff.findMany({
    orderBy: { fullName: 'asc' },
    select: {
      id: true,
      slug: true,
      fullName: true,
      position: true,
      email: true,
      departmentId: true,
      department: { select: { name: true } }
    }
  });

  return rows.map((s) => ({
    id: s.id,
    slug: s.slug,
    fullName: s.fullName,
    position: s.position,
    email: s.email,
    departmentId: s.departmentId,
    departmentName: s.department?.name ?? null
  }));
}

export async function findDepartmentBySlug(slug: string): Promise<DepartmentWithStaff | null> {
  const d = await prisma.department.findUnique({
    where: { slug },
    select: {
      id: true,
      name: true,
      slug: true,
      description: true,
      staff: {
        orderBy: { fullName: 'asc' },
        select: {
          id: true,
          slug: true,
          fullName: true,
          position: true,
          email: true,
          departmentId: true
        }
      }
    }
  });

  if (!d) return null;

  return {
    id: d.id,
    name: d.name,
    slug: d.slug,
    description: d.description,
    staff: d.staff.map((s) => ({
      ...s,
      departmentName: d.name
    }))
  };
}

export async function findAllDepartments(): Promise<DepartmentWithStaff[]> {
  const departments = await prisma.department.findMany({
    orderBy: { name: 'asc' },
    select: {
      id: true,
      name: true,
      slug: true,
      description: true,
      _count: { select: { staff: true } }
    }
  });

  return departments.map((d) => ({
    id: d.id,
    name: d.name,
    slug: d.slug,
    description: d.description,
    staff: new Array(d._count.staff).fill(null).map(() => ({
      id: '',
      slug: '',
      fullName: '',
      position: null,
      email: null,
      departmentId: d.id,
      departmentName: d.name
    }))
  }));
}