
"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
// x =1 
// x = "ahmed"
export async function checkProfileCompletion() {
  const session = await auth();

  if (!session?.user?.id) {
    return {
      authenticated: false,
      profileComplete: false,
      shouldRedirect: true,
      redirectTo: "/login",
    };
  }

  const user = await prisma.user.findUnique({
    where: {
      id: session.user.id,
    },
    select: {
      role: true,
      name: true,
      phone: true,
    },
  });

  if (!user) {
    return {
      authenticated: false,
      profileComplete: false,
      shouldRedirect: true,
      redirectTo: "/login",
    };
  }

  // التحقق من بيانات الطالب فقط
  if (user.role !== "STUDENT") {
    return {
      authenticated: true,
      profileComplete: true,
      shouldRedirect: false,
      redirectTo: null,
    };
  }

  const profileComplete =
    Boolean(user.name?.trim()) &&
    Boolean(user.phone?.trim());

  return {
    authenticated: true,
    profileComplete,
    shouldRedirect: !profileComplete,
    redirectTo: profileComplete ? null : "/complete-profile",
  };
}
