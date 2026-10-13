
"use server";

import bcrypt from "bcryptjs";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

type ChangePasswordInput = {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
};

export async function changePassword(input: ChangePasswordInput) {
  const session = await auth();

  if (!session?.user?.id) {
    return {
      success: false,
      message: "يجب تسجيل الدخول أولًا.",
    };
  }

  const { currentPassword, newPassword, confirmPassword } = input;

  if (!currentPassword || !newPassword || !confirmPassword) {
    return {
      success: false,
      message: "جميع الحقول مطلوبة.",
    };
  }

  if (newPassword !== confirmPassword) {
    return {
      success: false,
      message: "كلمتا المرور الجديدتان غير متطابقتين.",
    };
  }

  if (newPassword.length < 8) {
    return {
      success: false,
      message: "كلمة المرور الجديدة يجب أن تكون 8 أحرف على الأقل.",
    };
  }

  if (currentPassword === newPassword) {
    return {
      success: false,
      message: "كلمة المرور الجديدة يجب أن تكون مختلفة عن الحالية.",
    };
  }

  const user = await prisma.user.findUnique({
    where: {
      id: session.user.id,
    },
    select: {
      id: true,
      password: true,
    },
  });

  if (!user) {
    return {
      success: false,
      message: "المستخدم غير موجود.",
    };
  }

  // الحسابات التي لا تملك كلمة مرور محلية
  // مثل بعض حسابات OAuth
  if (!user.password) {
    return {
      success: false,
      message:
        "هذا الحساب لا يستخدم كلمة مرور محلية. يرجى استخدام طريقة تسجيل الدخول المرتبطة بالحساب.",
    };
  }

  const isCurrentPasswordCorrect = await bcrypt.compare(
    currentPassword,
    user.password,
  );

  if (!isCurrentPasswordCorrect) {
    return {
      success: false,
      message: "كلمة المرور الحالية غير صحيحة.",
    };
  }

  const hashedPassword = await bcrypt.hash(newPassword, 12);

  await prisma.user.update({
    where: {
      id: user.id,
    },
    data: {
      password: hashedPassword,
    },
  });

  return {
    success: true,
    message: "تم تغيير كلمة المرور بنجاح.",
  };
}
