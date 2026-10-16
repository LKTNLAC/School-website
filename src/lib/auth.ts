import { PrismaAdapter } from '@auth/prisma-adapter';
import { compare } from 'bcryptjs';
import NextAuth, { type DefaultSession } from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { z } from 'zod';

import { prisma } from '@/lib/db';
import type { UserRole } from '@/types';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      role: UserRole;
      status: string;
    } & DefaultSession['user'];
  }
}

const credentialsSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8)
});

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: { strategy: 'jwt', maxAge: 7 * 24 * 60 * 60 },
  pages: { signIn: '/dang-nhap' },
  providers: [
    Credentials({
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Mật khẩu', type: 'password' }
      },
      async authorize(raw) {
        const parsed = credentialsSchema.safeParse(raw);
        if (!parsed.success) return null;

        const user = await prisma.user.findUnique({
          where: { email: parsed.data.email }
        });
        if (!user || user.status !== 'ACTIVE') return null;

        const ok = await compare(parsed.data.password, user.passwordHash);
        if (!ok) return null;

        return {
          id: user.id,
          email: user.email,
          name: user.name ?? user.email,
          role: user.role,
          status: user.status
        };
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      // Lần đầu đăng nhập: gán thông tin từ user object
      if (user) {
        token.id = user.id;
        token.role = (user as unknown as { role: UserRole }).role;
        token.status = (user as unknown as { status: string }).status;
        return token;
      }

      // Các request sau: verify user vẫn ACTIVE trong DB
      if (token.id && typeof token.id === 'string') {
        const dbUser = await prisma.user.findUnique({
          where: { id: token.id },
          select: { status: true, role: true }
        });

        if (!dbUser || dbUser.status !== 'ACTIVE') {
          // Trả token rỗng để session hết hiệu lực
          return null as unknown as typeof token;
        }

        // Cập nhật role mới nếu admin đã đổi
        token.role = dbUser.role as UserRole;
        token.status = dbUser.status;
      }

      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        if (token.status !== 'ACTIVE') {
          // Session không hợp lệ
          session.user.id = '';
          session.user.role = 'VIEWER' as UserRole;
          session.user.status = 'DISABLED';
          return session;
        }
        session.user.id = token.id as string;
        session.user.role = token.role as UserRole;
        session.user.status = token.status as string;
      }
      return session;
    }
  }
});