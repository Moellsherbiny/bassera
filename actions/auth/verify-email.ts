
"use server";

import { prisma } from "@/lib/prisma";
import { sendEmail } from "@/lib/mailer";
import { verificationCodeTemplate } from "@/lib/email-templates";
import { generateOtp, hashOtp, verifyOtp } from "@/utils/otp";

const MAX_ATTEMPTS = 5;
const OTP_EXPIRY_MINUTES = 10;

type VerifyEmailResult =
  | {
      success: true;
    }
  | {
      success: false;
      error: string;
    };

type VerifyEmailInput = {
  email: string;
  code: string;
};

type ResendVerificationResult =
  | {
      success: true;
    }
  | {
      success: false;
      error: string;
    };

/**
 * Verify user's email using the OTP sent to their email.
 */
export async function verifyEmail(
  input: VerifyEmailInput,
): Promise<VerifyEmailResult> {
  const email = input.email.trim().toLowerCase();
  const code = input.code.trim();

  if (!email || !code) {
    return {
      success: false,
      error: "بيانات التحقق غير مكتملة.",
    };
  }

  if (!/^\d{6}$/.test(code)) {
    return {
      success: false,
      error: "رمز التحقق يجب أن يتكون من 6 أرقام.",
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

    if (!user) {
      return {
        success: false,
        error: "لم يتم العثور على حساب بهذا البريد الإلكتروني.",
      };
    }

    if (user.emailVerified) {
      return {
        success: false,
        error: "البريد الإلكتروني مؤكد بالفعل.",
      };
    }

    /**
     * Get the latest unverified OTP.
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
        error: "رمز التحقق غير موجود. اطلب رمزًا جديدًا.",
      };
    }

    /**
     * Check expiration.
     */
    if (otpRecord.expiresAt.getTime() < Date.now()) {
      return {
        success: false,
        error: "انتهت صلاحية رمز التحقق. اطلب رمزًا جديدًا.",
      };
    }

    /**
     * Prevent brute-force attempts.
     */
    if (otpRecord.attempts >= MAX_ATTEMPTS) {
      return {
        success: false,
        error:
          "تم تجاوز عدد محاولات التحقق المسموح بها. اطلب رمزًا جديدًا.",
      };
    }

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

    /**
     * Mark OTP as verified and verify the user's email.
     */
    await prisma.$transaction([
      prisma.otpVerification.update({
        where: {
          id: otpRecord.id,
        },
        data: {
          verified: true,
        },
      }),

      prisma.user.update({
        where: {
          id: user.id,
        },
        data: {
          emailVerified: new Date(),
        },
      }),
    ]);

    return {
      success: true,
    };
  } catch (error) {
    console.error("VERIFY_EMAIL_ERROR", error);

    return {
      success: false,
      error: "حدث خطأ أثناء التحقق من البريد الإلكتروني.",
    };
  }
}

/**
 * Generate and send a new verification code.
 */
export async function resendVerificationCode(
  input: { email: string },
): Promise<ResendVerificationResult> {
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
        emailVerified: true,
      },
    });

    if (!user) {
      return {
        success: false,
        error: "لم يتم العثور على حساب بهذا البريد الإلكتروني.",
      };
    }

    if (user.emailVerified) {
      return {
        success: false,
        error: "البريد الإلكتروني مؤكد بالفعل.",
      };
    }

    /**
     * Remove previous unused OTPs.
     */
    await prisma.otpVerification.deleteMany({
      where: {
        email,
        verified: false,
      },
    });

    /**
     * Generate a new 6-digit OTP.
     */
    const otp = generateOtp();
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

    /**
     * Send OTP email.
     */
    await sendEmail({
      to: email,
      subject: "تأكيد البريد الإلكتروني | بَصيرة",
      html: verificationCodeTemplate(otp),
    });

    return {
      success: true,
    };
  } catch (error) {
    console.error(
      "RESEND_VERIFICATION_CODE_ERROR",
      error,
    );

    return {
      success: false,
      error: "حدث خطأ أثناء إرسال رمز التحقق.",
    };
  }
}
