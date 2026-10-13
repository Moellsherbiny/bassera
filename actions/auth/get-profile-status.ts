
"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function getProfileStatus() {
  const session = await auth();

  if (!session?.user?.id) {
    return {
      user: null,
      isProfileComplete: false,
    };
  }

  const user = await prisma.user.findUnique({
    where: {
      id: session.user.id,
    },
    select: {
      id: true,
      role: true,
      name: true,
      phone: true,
    },
  });

  if (!user) {
    return {
      user: null,
      isProfileComplete: false,
    };
  }

  // المدرس والأدمن لا يحتاجون لإكمال بيانات الطالب
  if (user.role !== "STUDENT") {
    return {
      user,
      isProfileComplete: true,
    };
  }

  const isProfileComplete =
    Boolean(user.name?.trim()) &&
    Boolean(user.phone?.trim());

  return {
    user,
    isProfileComplete,
  };
}
