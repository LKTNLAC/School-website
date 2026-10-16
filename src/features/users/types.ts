import type { UserRole, UserStatus } from '@/types';

export type AdminUserListItem = {
  id: string;
  email: string;
  name: string | null;
  role: UserRole;
  status: UserStatus;
  createdAt: Date;
  lastSessionAt: Date | null;
  sessionCount: number;
};

export type AdminUserDetail = {
  id: string;
  email: string;
  name: string | null;
  role: UserRole;
  status: UserStatus;
  createdAt: Date;
  updatedAt: Date;
  sessions: {
    id: string;
    expires: Date;
    lastSeenAt: Date;
    revokedAt: Date | null;
  }[];
};