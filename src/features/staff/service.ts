import * as repository from './repository';
import type { DepartmentWithStaff, StaffListItem } from './types';

export async function getStaffGroupedByDepartment(): Promise<DepartmentWithStaff[]> {
  return repository.findAllGroupedByDepartment();
}

export async function getAllStaff(): Promise<StaffListItem[]> {
  return repository.findAll();
}

export async function getDepartmentBySlug(slug: string): Promise<DepartmentWithStaff | null> {
  return repository.findDepartmentBySlug(slug);
}

export async function getAllDepartments(): Promise<DepartmentWithStaff[]> {
  return repository.findAllDepartments();
}