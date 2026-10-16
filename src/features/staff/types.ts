export type StaffListItem = {
  id: string;
  slug: string;
  fullName: string;
  position: string | null;
  email: string | null;
  departmentId: string | null;
  departmentName: string | null;
};

export type DepartmentWithStaff = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  staff: StaffListItem[];
};