
import Google from "next-auth/providers/google";
import Credentials, {
  type CredentialInput,
} from "next-auth/providers/credentials";
import { CredentialsSignin } from "next-auth";

import { prisma } from "@/lib/prisma";
import { verifyPassword } from "@/utils/password";

class InvalidCredentialsError extends CredentialsSignin {
  code = "invalid_credentials";
}

class EmailNotVerifiedError extends CredentialsSignin {
  code = "email_not_verified";
}

class PasswordNotSetError extends CredentialsSignin {
  code = "password_not_set";
}

export const authProviders = [
  Google({
    clientId: process.env.AUTH_GOOGLE_ID,
    clientSecret: process.env.AUTH_GOOGLE_SECRET,
  }),

  Credentials({
    name: "Credentials",

    credentials: {
      email: {
        label: "Email",
        type: "email",
      } as CredentialInput,

      password: {
        label: "Password",
        type: "password",
      } as CredentialInput,
    },

    async authorize(credentials) {
      if (
        !credentials?.email ||
        !credentials?.password
      ) {
        throw new InvalidCredentialsError();
      }

      const email = String(credentials.email)
        .trim()
        .toLowerCase();

      const password = String(credentials.password);

      const user = await prisma.user.findUnique({
        where: {
          email,
        },
      });

      // لا تكشف للمستخدم إذا كان الإيميل موجودًا أم لا
      if (!user) {
        throw new InvalidCredentialsError();
      }

      // الحساب موجود لكن ليس لديه Password
      // غالبًا تم إنشاؤه عن طريق Google
      if (!user.password) {
        throw new PasswordNotSetError();
      }

      // البريد غير مؤكد
      if (!user.emailVerified) {
        throw new EmailNotVerifiedError();
      }

      const isValid = await verifyPassword(
        password,
        user.password,
      );

      if (!isValid) {
        throw new InvalidCredentialsError();
      }

      return {
        id: user.id,
        name: user.name,
        email: user.email,
        image: user.image,
        role: user.role,
      };
    },
  }),
];
