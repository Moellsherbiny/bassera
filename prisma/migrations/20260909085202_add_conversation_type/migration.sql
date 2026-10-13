/*
  Warnings:

  - Added the required column `type` to the `Conversation` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "ConversationType" AS ENUM ('COURSE', 'LESSON', 'GENERAL');

-- AlterTable
ALTER TABLE "Conversation" ADD COLUMN     "lessonId" TEXT,
ADD COLUMN     "type" "ConversationType" NOT NULL;

-- AddForeignKey
ALTER TABLE "Conversation" ADD CONSTRAINT "Conversation_lessonId_fkey" FOREIGN KEY ("lessonId") REFERENCES "Lesson"("id") ON DELETE CASCADE ON UPDATE CASCADE;
