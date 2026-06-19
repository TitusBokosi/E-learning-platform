/*
  Warnings:

  - The primary key for the `categories` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `courses` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `lessons` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `courseid` on the `lessons` table. All the data in the column will be lost.
  - The primary key for the `topics` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `roleid` on the `users` table. All the data in the column will be lost.
  - You are about to drop the `admins` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `roles` table. If the table is not empty, all the data it contains will be lost.
  - Made the column `createdAt` on table `categories` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `updatedAt` to the `courses` table without a default value. This is not possible if the table is not empty.
  - Made the column `createdAt` on table `courses` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `updatedAt` to the `lessons` table without a default value. This is not possible if the table is not empty.
  - Made the column `createdAt` on table `lessons` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `updatedAt` to the `topics` table without a default value. This is not possible if the table is not empty.
  - Made the column `createdAt` on table `topics` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `updatedAt` to the `users` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Role" AS ENUM ('STUDENT', 'CREATOR', 'SUPER_CREATOR', 'ADMIN');

-- CreateEnum
CREATE TYPE "ContentStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED', 'PENDING_DELETE');

-- CreateEnum
CREATE TYPE "LessonType" AS ENUM ('VIDEO', 'TEXT', 'MINI_PROJECT');

-- CreateEnum
CREATE TYPE "EnrollmentStatus" AS ENUM ('ACTIVE', 'COMPLETED', 'DROPPED');

-- DropForeignKey
ALTER TABLE "public"."admins" DROP CONSTRAINT "admins_adminRole_fkey";

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

-- DropForeignKey
ALTER TABLE "public"."users" DROP CONSTRAINT "users_roleid_fkey";

-- AlterTable
ALTER TABLE "categories" DROP CONSTRAINT "categories_pkey",
ALTER COLUMN "createdAt" SET NOT NULL,
ALTER COLUMN "createdAt" SET DATA TYPE TIMESTAMP(3),
ALTER COLUMN "categoryid" DROP DEFAULT,
ALTER COLUMN "categoryid" SET DATA TYPE TEXT,
ADD CONSTRAINT "categories_pkey" PRIMARY KEY ("categoryid");

-- AlterTable
ALTER TABLE "courses" DROP CONSTRAINT "courses_pkey",
ADD COLUMN     "creatorId" TEXT,
ADD COLUMN     "isFeatured" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "status" "ContentStatus" NOT NULL DEFAULT 'APPROVED',
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ALTER COLUMN "createdAt" SET NOT NULL,
ALTER COLUMN "createdAt" SET DATA TYPE TIMESTAMP(3),
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "categoryid" SET DATA TYPE TEXT,
ADD CONSTRAINT "courses_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "lessons" DROP CONSTRAINT "lessons_pkey",
DROP COLUMN "courseid",
ADD COLUMN     "lessonType" "LessonType" NOT NULL DEFAULT 'TEXT',
ADD COLUMN     "status" "ContentStatus" NOT NULL DEFAULT 'APPROVED',
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "videoUrl" TEXT,
ALTER COLUMN "createdAt" SET NOT NULL,
ALTER COLUMN "createdAt" SET DATA TYPE TIMESTAMP(3),
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "topicid" SET DATA TYPE TEXT,
ADD CONSTRAINT "lessons_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "topics" DROP CONSTRAINT "topics_pkey",
ADD COLUMN     "status" "ContentStatus" NOT NULL DEFAULT 'APPROVED',
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ALTER COLUMN "createdAt" SET NOT NULL,
ALTER COLUMN "createdAt" SET DATA TYPE TIMESTAMP(3),
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "courseid" SET DATA TYPE TEXT,
ADD CONSTRAINT "topics_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "users" DROP COLUMN "roleid",
ADD COLUMN     "isSuspended" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "role" "Role" NOT NULL DEFAULT 'STUDENT',
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- DropTable
DROP TABLE "public"."admins";

-- DropTable
DROP TABLE "public"."roles";

-- CreateTable
CREATE TABLE "projects" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "rubric" TEXT,
    "courseid" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "projects_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "enrollments" (
    "id" TEXT NOT NULL,
    "userid" TEXT NOT NULL,
    "courseid" TEXT NOT NULL,
    "status" "EnrollmentStatus" NOT NULL DEFAULT 'ACTIVE',
    "enrolledAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "enrollments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "lesson_progress" (
    "id" TEXT NOT NULL,
    "userid" TEXT NOT NULL,
    "lessonid" TEXT NOT NULL,
    "completedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "lesson_progress_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "announcements" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "announcements_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "activity_logs" (
    "id" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "details" TEXT NOT NULL,
    "adminId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "activity_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "feedback" (
    "id" TEXT NOT NULL,
    "subject" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'UNREAD',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "feedback_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "projects_courseid_key" ON "projects"("courseid");

-- CreateIndex
CREATE INDEX "enrollments_userid_idx" ON "enrollments"("userid");

-- CreateIndex
CREATE INDEX "enrollments_courseid_idx" ON "enrollments"("courseid");

-- CreateIndex
CREATE UNIQUE INDEX "enrollments_userid_courseid_key" ON "enrollments"("userid", "courseid");

-- CreateIndex
CREATE INDEX "lesson_progress_userid_idx" ON "lesson_progress"("userid");

-- CreateIndex
CREATE UNIQUE INDEX "lesson_progress_userid_lessonid_key" ON "lesson_progress"("userid", "lessonid");

-- CreateIndex
CREATE INDEX "courses_creatorId_idx" ON "courses"("creatorId");

-- AddForeignKey
ALTER TABLE "courses" ADD CONSTRAINT "courses_categoryid_fkey" FOREIGN KEY ("categoryid") REFERENCES "categories"("categoryid") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "courses" ADD CONSTRAINT "courses_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "topics" ADD CONSTRAINT "topics_courseid_fkey" FOREIGN KEY ("courseid") REFERENCES "courses"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lessons" ADD CONSTRAINT "lessons_topicid_fkey" FOREIGN KEY ("topicid") REFERENCES "topics"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "projects" ADD CONSTRAINT "projects_courseid_fkey" FOREIGN KEY ("courseid") REFERENCES "courses"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "enrollments" ADD CONSTRAINT "enrollments_userid_fkey" FOREIGN KEY ("userid") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "enrollments" ADD CONSTRAINT "enrollments_courseid_fkey" FOREIGN KEY ("courseid") REFERENCES "courses"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lesson_progress" ADD CONSTRAINT "lesson_progress_userid_fkey" FOREIGN KEY ("userid") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lesson_progress" ADD CONSTRAINT "lesson_progress_lessonid_fkey" FOREIGN KEY ("lessonid") REFERENCES "lessons"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- RenameIndex
ALTER INDEX "categories_categoryname_unique" RENAME TO "categories_categoryName_key";
