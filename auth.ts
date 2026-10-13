import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";

import { prisma } from "./lib/prisma";
import { authProviders } from "./lib/auth/providers";
import { UserRole } from "./generated/prisma/browser";
import { enrollStudentInCourse } from "./lib/enrollment";

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(prisma),

  providers: authProviders,

  session: {
    strategy: "jwt",
  },

  events: {
    async createUser({ user }) {
      if (!user.id) {
        return;
      }

      const dbUser = await prisma.user.findUnique({
        where: {
          id: user.id,
        },
        select: {
          id: true,
          role: true,
        },
      });

      if (!dbUser || dbUser.role !== UserRole.STUDENT) {
        return;
      }

      try {
        await enrollStudentInCourse(dbUser.id);

        console.log(`Student ${dbUser.id} enrolled automatically.`);
      } catch (error) {
        console.error(`Failed to enroll student ${dbUser.id}:`, error);
      }
    },
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }

      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        if (typeof token.id === "string") {
          session.user.id = token.id;
        }

        if (token.role) {
          session.user.role = token.role as UserRole;
        }
      }

      return session;
    },
  },
});
