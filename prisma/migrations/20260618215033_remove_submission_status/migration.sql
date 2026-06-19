/*
  Warnings:

  - You are about to drop the column `feedback` on the `submissions` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `submissions` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "submissions" DROP COLUMN "feedback",
DROP COLUMN "status";
