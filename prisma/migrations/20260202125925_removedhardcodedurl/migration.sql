/*
  Warnings:

  - The primary key for the `categories` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `categoryid` column on the `categories` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `courses` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `courses` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `lessons` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `lessons` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `courseid` column on the `lessons` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `topics` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `topics` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Changed the type of `categoryid` on the `courses` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `topicid` on the `lessons` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `courseid` on the `topics` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- DropForeignKey
ALTER TABLE "public"."admins" DROP CONSTRAINT "admins_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."courses" DROP CONSTRAINT "courses_categoryid_fkey";

-- DropForeignKey
ALTER TABLE "public"."lessons" DROP CONSTRAINT "lessons_courseid_fkey";

-- DropForeignKey
ALTER TABLE "public"."lessons" DROP CONSTRAINT "lessons_topicid_fkey";

-- DropForeignKey
ALTER TABLE "public"."topics" DROP CONSTRAINT "topics_courseid_fkey";

-- AlterTable
ALTER TABLE "categories" DROP CONSTRAINT "categories_pkey",
ADD COLUMN     "createdAt" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
DROP COLUMN "categoryid",
ADD COLUMN     "categoryid" UUID NOT NULL DEFAULT gen_random_uuid(),
ADD CONSTRAINT "categories_pkey" PRIMARY KEY ("categoryid");

-- AlterTable
ALTER TABLE "courses" DROP CONSTRAINT "courses_pkey",
ADD COLUMN     "createdAt" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
DROP COLUMN "id",
ADD COLUMN     "id" UUID NOT NULL DEFAULT gen_random_uuid(),
DROP COLUMN "categoryid",
ADD COLUMN     "categoryid" UUID NOT NULL,
ADD CONSTRAINT "courses_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "lessons" DROP CONSTRAINT "lessons_pkey",
ADD COLUMN     "content" TEXT,
ADD COLUMN     "createdAt" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "position" INTEGER NOT NULL DEFAULT 1,
DROP COLUMN "id",
ADD COLUMN     "id" UUID NOT NULL DEFAULT gen_random_uuid(),
DROP COLUMN "topicid",
ADD COLUMN     "topicid" UUID NOT NULL,
DROP COLUMN "courseid",
ADD COLUMN     "courseid" UUID,
ADD CONSTRAINT "lessons_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "topics" DROP CONSTRAINT "topics_pkey",
ADD COLUMN     "createdAt" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "position" INTEGER NOT NULL DEFAULT 1,
DROP COLUMN "id",
ADD COLUMN     "id" UUID NOT NULL DEFAULT gen_random_uuid(),
DROP COLUMN "courseid",
ADD COLUMN     "courseid" UUID NOT NULL,
ADD CONSTRAINT "topics_pkey" PRIMARY KEY ("id");

-- CreateIndex
CREATE INDEX "courses_categoryid_idx" ON "courses"("categoryid");

-- CreateIndex
CREATE INDEX "lessons_topicid_idx" ON "lessons"("topicid");

-- CreateIndex
CREATE INDEX "topics_courseid_idx" ON "topics"("courseid");

-- AddForeignKey
ALTER TABLE "admins" ADD CONSTRAINT "admins_id_fkey" FOREIGN KEY ("id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "courses" ADD CONSTRAINT "courses_categoryid_fkey" FOREIGN KEY ("categoryid") REFERENCES "categories"("categoryid") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "topics" ADD CONSTRAINT "topics_courseid_fkey" FOREIGN KEY ("courseid") REFERENCES "courses"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "lessons" ADD CONSTRAINT "lessons_courseid_fkey" FOREIGN KEY ("courseid") REFERENCES "courses"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "lessons" ADD CONSTRAINT "lessons_topicid_fkey" FOREIGN KEY ("topicid") REFERENCES "topics"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- RenameIndex
ALTER INDEX "categories_categoryName_key" RENAME TO "categories_categoryname_unique";
