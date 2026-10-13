"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function getAvailableUsers() {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return {
        success: false,
        error: "غير مصرح",
        users: [],
      };
    }

    const currentUserId = session.user.id;

    const users = await prisma.user.findMany({
      where: {
        id: {
          not: currentUserId,
        },
        role: {
          in: ["STUDENT", "TEACHER"],
        },
      },
      select: {
        id: true,
        name: true,
        role: true,
      },
      orderBy: {
        name: "asc",
      },
    });

    return {
      success: true,
      users,
    };
  } catch (error) {
    console.error(
      "GET_AVAILABLE_USERS_ERROR:",
      error,
    );

    return {
      success: false,
      error: "حدث خطأ أثناء تحميل المستخدمين",
      users: [],
    };
  }
}