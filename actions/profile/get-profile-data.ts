
"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

export async function getProfileData() {
  const session = await auth();

  if (!session?.user?.id) {
    throw new Error("User not authenticated");
  }

  const user = await prisma.user.findUnique({
    where: {
      id: session.user.id,
    },
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      image: true,
      role: true,
      emailVerified: true,

      studentProfile: {
        select: {
          preferSimplified: true,
          preferSplitIntoParts: true,
          preferGraphics: true,
          overallAverageScore: true,
          totalAttempts: true,
          strugglingFlag: true,
        },
      },
    },
  });

  if (!user) {
    throw new Error("User not found");
  }

  // المستخدمين القدامى ممكن ما يكونش عندهم StudentProfile
  const studentProfile =
    user.studentProfile ??
    (await prisma.studentProfile.upsert({
      where: {
        userId: user.id,
      },
      create: {
        userId: user.id,
      },
      update: {},
      select: {
        preferSimplified: true,
        preferSplitIntoParts: true,
        preferGraphics: true,
        overallAverageScore: true,
        totalAttempts: true,
        strugglingFlag: true,
      },
    }));

  // المستخدم العادي: التحقق من emailVerified
  // Google: الحساب يعتبر Verified أيضًا
  const isGoogleProvider = await prisma.account.findFirst({
    where: {
      userId: user.id,
      provider: "google",
    },
    select: {
      userId: true,
    },
  });

  const isVerified =
    user.emailVerified !== null || isGoogleProvider !== null;

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    phone: user.phone,
    image: user.image,
    role: user.role,
    studentProfile,
    isVerified,
  };
}
