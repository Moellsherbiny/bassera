
"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

type UpdateSettingsInput = {
  preferSimplified: boolean;
  preferSplitIntoParts: boolean;
  preferGraphics: boolean;
};

export async function updateSettings(input: UpdateSettingsInput) {
  const session = await auth();

  if (!session?.user?.id) {
    throw new Error("User not authenticated");
  }

  const studentProfile = await prisma.studentProfile.upsert({
    where: {
      userId: session.user.id,
    },
    create: {
      userId: session.user.id,
      preferSimplified: input.preferSimplified,
      preferSplitIntoParts: input.preferSplitIntoParts,
      preferGraphics: input.preferGraphics,
    },
    update: {
      preferSimplified: input.preferSimplified,
      preferSplitIntoParts: input.preferSplitIntoParts,
      preferGraphics: input.preferGraphics,
    },
    select: {
      preferSimplified: true,
      preferSplitIntoParts: true,
      preferGraphics: true,
    },
  });

  return {
    success: true,
    settings: studentProfile,
  };
}
