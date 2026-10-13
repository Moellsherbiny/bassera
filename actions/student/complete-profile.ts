"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

type CompleteStudentProfileInput = {
  name: string;
  phone: string;
};

export async function completeStudentProfile(
  input: CompleteStudentProfileInput,
) {
  const session = await auth();

  if (!session?.user?.id) {
    return {
      success: false,
      message: "يجب تسجيل الدخول أولًا.",
    };
  }

  const name = input.name.trim();
  const phone = input.phone.trim();

  if (!name || !phone ) {
    return {
      success: false,
      message: "جميع البيانات المطلوبة يجب إدخالها.",
    };
  }

  const user = await prisma.user.findUnique({
    where: {
      id: session.user.id,
    },
    select: {
      id: true,
      role: true,
    },
  });

  if (!user) {
    return {
      success: false,
      message: "المستخدم غير موجود.",
    };
  }

  if (user.role !== "STUDENT") {
    return {
      success: false,
      message: "هذه الصفحة مخصصة للطلاب فقط.",
    };
  }

  // نتأكد أن رقم الهاتف غير مستخدم بالفعل
  const existingPhone = await prisma.user.findFirst({
    where: {
      phone,
      NOT: {
        id: user.id,
      },
    },
    select: {
      id: true,
    },
  });

  if (existingPhone) {
    return {
      success: false,
      message: "رقم الهاتف مستخدم بالفعل بواسطة حساب آخر.",
    };
  }

  try {
    await prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        name,
        phone,
      },
    });

    return {
      success: true,
      message: "تم حفظ بياناتك بنجاح.",
    };
  } catch (error) {
    console.error("Complete student profile error:", error);

    return {
      success: false,
      message: "حدث خطأ أثناء حفظ البيانات. حاول مرة أخرى.",
    };
  }
}