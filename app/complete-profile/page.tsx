import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import CompleteProfileClient from "@/components/dashboard/complete-profile-client";

export default async function CompleteProfilePage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
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
      role: true,
    },
  });

  if (!user) {
    redirect("/login");
  }

  // الصفحة مخصصة للطلاب فقط
  if (user.role !== "STUDENT") {
    redirect("/dashboard");
  }

  const isProfileComplete =
    Boolean(user.name?.trim()) &&
    Boolean(user.phone?.trim()) ;

  // لو البيانات مكتملة بالفعل لا يحتاج الصفحة
  if (isProfileComplete) {
    redirect("/dashboard");
  }

  return (
    <CompleteProfileClient
      user={{
        name: user.name,
        email: user.email,
        phone: user.phone,
      }}
    />
  );
}