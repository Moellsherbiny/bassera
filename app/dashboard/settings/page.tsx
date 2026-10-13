
import { redirect } from "next/navigation";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

import SettingsClient from "@/components/settings/client";

export default async function SettingsPage() {
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
      studentProfile: {
        select: {
          preferSimplified: true,
          preferSplitIntoParts: true,
          preferGraphics: true,
        },
      },
    },
  });

  if (!user) {
    redirect("/login");
  }

  // المستخدمين القدامى ممكن ما يكونش عندهم StudentProfile
  const studentProfile =
    user.studentProfile ??
    (await prisma.studentProfile.upsert({
      where: {
        userId: user.id,
      },
      create: {
        userId: user.id,
      },
      update: {},
      select: {
        preferSimplified: true,
        preferSplitIntoParts: true,
        preferGraphics: true,
      },
    }));

  return (
    <SettingsClient
      settings={{
        preferSimplified: studentProfile.preferSimplified,
        preferSplitIntoParts: studentProfile.preferSplitIntoParts,
        preferGraphics: studentProfile.preferGraphics,
      }}
    />
  );
}
