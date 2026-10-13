"use server";

import { prisma } from "@/lib/prisma";
import { hashPassword } from "@/utils/password";
import { registerSchema, type RegisterInput } from "@/schemas/auth";
import { generateOtp, hashOtp } from "@/utils/otp";
import { sendEmail } from "@/lib/mailer";
import { verificationCodeTemplate } from "@/lib/email-templates";
import { enrollStudentInCourse } from "@/lib/enrollment";

export async function createAccount(input: RegisterInput) {
  const result = registerSchema.safeParse(input);

  if (!result.success) {
    return {
      success: false,
      error: result.error.issues[0]?.message ?? "بيانات غير صحيحة",
    };
  }

  const { name, email, password, phone } = result.data;

  try {
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [{ email }, { phone }],
      },
      select: {
        email: true,
        phone: true,
      },
    });

    if (existingUser?.email === email) {
      return {
        success: false,
        error: "هذا البريد الإلكتروني مستخدم بالفعل",
      };
    }

    if (existingUser?.phone === phone) {
      return {
        success: false,
        error: "رقم الهاتف مستخدم بالفعل",
      };
    }

    const passwordHash = await hashPassword(password);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: passwordHash,
        phone,
      },
      select: {
        id: true,
        email: true,
      },
    });
    await prisma.studentProfile.create({
      data: {
        userId: user.id,
      },
    });

    await enrollStudentInCourse(user.id);
    const otp = generateOtp();
    const codeHash = await hashOtp(otp);

    await prisma.otpVerification.create({
      data: {
        email: user.email,
        codeHash,
        expiresAt: new Date(Date.now() + 10 * 60 * 1000),
      },
    });

    await sendEmail({
      to: user.email,
      subject: "تأكيد البريد الإلكتروني | بَصيرة",
      html: verificationCodeTemplate(otp),
    });
    return {
      success: true as const,
      userId: user.id,
    };
  } catch (error) {
    console.error("CREATE_ACCOUNT_ERROR", error);
    return { success: false, error: "حدث خطأ أثناء إنشاء الحساب" };
  }
}
