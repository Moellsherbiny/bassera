"use server";

import { prisma } from "@/lib/prisma";
import { hashPassword } from "@/utils/password";
import { verifyOtp } from "@/utils/otp";

const MAX_ATTEMPTS = 5;

type ResetPasswordInput = {
  email: string;
  code: string;
  password: string;
  confirmPassword: string;
};

type ResetPasswordResult =
  | {
      success: true;
    }
  | {
      success: false;
      error: string;
    };

export async function resetPassword(
  input: ResetPasswordInput,
): Promise<ResetPasswordResult> {
  const email = input.email.trim().toLowerCase();
  const code = input.code.trim();
  const password = input.password;
  const confirmPassword = input.confirmPassword;

  if (!email || !code || !password || !confirmPassword) {
    return {
      success: false,
      error: "جميع الحقول مطلوبة.",
    };
  }

  if (!/^\d{6}$/.test(code)) {
    return {
      success: false,
      error: "رمز التحقق يجب أن يتكون من 6 أرقام.",
    };
  }

  if (password.length < 8) {
    return {
      success: false,
      error: "كلمة المرور يجب أن تكون 8 أحرف على الأقل.",
    };
  }

  if (password !== confirmPassword) {
    return {
      success: false,
      error: "كلمتا المرور غير متطابقتين.",
    };
  }

  try {
    const user = await prisma.user.findUnique({
      where: {
        email,
      },
      select: {
        id: true,
        emailVerified: true,
      },
    });

    /*
     * لا نكشف تفاصيل الحساب.
     */
    if (!user) {
      return {
        success: false,
        error: "بيانات إعادة التعيين غير صالحة.",
      };
    }

    if (!user.emailVerified) {
      return {
        success: false,
        error: "يجب تأكيد البريد الإلكتروني أولًا.",
      };
    }

    /*
     * Get the latest unused PASSWORD_RESET OTP.
     */
    const otpRecord = await prisma.otpVerification.findFirst({
      where: {
        email,
        verified: false,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    if (!otpRecord) {
      return {
        success: false,
        error: "رمز التحقق غير موجود أو انتهت صلاحيته.",
      };
    }

    /*
     * Check expiration.
     */
    if (otpRecord.expiresAt.getTime() <= Date.now()) {
      return {
        success: false,
        error: "انتهت صلاحية رمز التحقق. اطلب رمزًا جديدًا.",
      };
    }

    /*
     * Prevent brute-force attacks.
     */
    if (otpRecord.attempts >= MAX_ATTEMPTS) {
      return {
        success: false,
        error:
          "تم تجاوز عدد محاولات التحقق المسموح بها. اطلب رمزًا جديدًا.",
      };
    }

    /*
     * Verify OTP hash.
     */
    const isValid = await verifyOtp(
      code,
      otpRecord.codeHash,
    );

    if (!isValid) {
      await prisma.otpVerification.update({
        where: {
          id: otpRecord.id,
        },
        data: {
          attempts: {
            increment: 1,
          },
        },
      });

      const remainingAttempts =
        MAX_ATTEMPTS - (otpRecord.attempts + 1);

      return {
        success: false,
        error:
          remainingAttempts > 0
            ? `رمز التحقق غير صحيح. متبقي ${remainingAttempts} محاولات.`
            : "رمز التحقق غير صحيح. اطلب رمزًا جديدًا.",
      };
    }

    /*
     * Hash the new password before storing it.
     */
    const passwordHash = await hashPassword(password);

    /*
     * Mark OTP as used and update password atomically.
     */
    await prisma.$transaction([
      prisma.user.update({
        where: {
          id: user.id,
        },
        data: {
          password: passwordHash,
        },
      }),

      prisma.otpVerification.update({
        where: {
          id: otpRecord.id,
        },
        data: {
          verified: true,
        },
      }),
    ]);

    return {
      success: true,
    };
  } catch (error) {
    console.error("RESET_PASSWORD_ERROR", error);

    return {
      success: false,
      error: "حدث خطأ أثناء إعادة تعيين كلمة المرور.",
    };
  }
}
