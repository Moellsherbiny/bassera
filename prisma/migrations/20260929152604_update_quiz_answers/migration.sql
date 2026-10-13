/*
  Warnings:

  - You are about to drop the column `selectedOptionId` on the `Answer` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Answer" DROP CONSTRAINT "Answer_selectedOptionId_fkey";

-- AlterTable
ALTER TABLE "Answer" DROP COLUMN "selectedOptionId";

-- CreateTable
CREATE TABLE "AnswerOption" (
    "id" TEXT NOT NULL,
    "answerId" TEXT NOT NULL,
    "optionId" TEXT NOT NULL,

    CONSTRAINT "AnswerOption_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "AnswerOption_optionId_idx" ON "AnswerOption"("optionId");

-- CreateIndex
CREATE UNIQUE INDEX "AnswerOption_answerId_optionId_key" ON "AnswerOption"("answerId", "optionId");

-- AddForeignKey
ALTER TABLE "AnswerOption" ADD CONSTRAINT "AnswerOption_answerId_fkey" FOREIGN KEY ("answerId") REFERENCES "Answer"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AnswerOption" ADD CONSTRAINT "AnswerOption_optionId_fkey" FOREIGN KEY ("optionId") REFERENCES "QuestionOption"("id") ON DELETE CASCADE ON UPDATE CASCADE;
