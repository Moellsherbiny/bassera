"use server";

import { prisma } from "@/lib/prisma";
import { sendEmail } from "@/lib/mailer";
import { verificationCodeTemplate } from "@/lib/email-templates";
import { generateOtp, hashOtp } from "@/utils/otp";

const OTP_EXPIRY_MINUTES = 10;

type ForgotPasswordResult =
  | {
      success: true;
    }
  | {
      success: false;
      error: string;
    };

type ForgotPasswordInput = {
  email: string;
};

export async function forgotPassword(
  input: ForgotPasswordInput,
): Promise<ForgotPasswordResult> {
  const email = input.email.trim().toLowerCase();

  if (!email) {
    return {
      success: false,
      error: "البريد الإلكتروني مطلوب.",
    };
  }

  try {
    const user = await prisma.user.findUnique({
      where: {
        email,
      },
      select: {
        id: true,
        email: true,
        emailVerified: true,
        password: true,
      },
    });

    /*
     * لا نكشف للمستخدم إذا كان البريد موجودًا أم لا.
     * هذا يمنع Email Enumeration.
     */
    if (!user) {
      return {
        success: true,
      };
    }

    /*
     * لا نرسل Reset OTP لحساب غير مؤكد.
     */
    if (!user.emailVerified) {
      return {
        success: true,
      };
    }

    /*
     * إلغاء أي OTP قديم خاص بإعادة تعيين كلمة المرور.
     *
     * ملاحظة:
     * حاليًا OtpVerification لا يحتوي على type/purpose،
     * لذلك نستخدم نفس الجدول.
     */
    await prisma.otpVerification.deleteMany({
      where: {
        email,
        verified: false,
      },
    });

    /*
     * Generate new 6-digit OTP.
     */
    const otp = generateOtp();

    /*
     * Never store the OTP itself.
     */
    const codeHash = await hashOtp(otp);

    await prisma.otpVerification.create({
      data: {
        email,
        codeHash,
        expiresAt: new Date(
          Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000,
        ),
      },
    });

    /*
     * Send OTP email.
     */
    await sendEmail({
      to: email,
      subject: "إعادة تعيين كلمة المرور | بَصيرة",
      html: verificationCodeTemplate(otp),
    });

    return {
      success: true,
    };
  } catch (error) {
    console.error("FORGOT_PASSWORD_ERROR", error);

    return {
      success: false,
      error: "حدث خطأ أثناء إرسال رمز التحقق.",
    };
  }
}
