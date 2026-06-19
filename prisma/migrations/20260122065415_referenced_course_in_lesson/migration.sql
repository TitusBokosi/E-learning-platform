-- AlterTable
ALTER TABLE "lessons" ADD COLUMN     "courseid" TEXT NOT NULL DEFAULT 'be981fe7-83fc-44c3-a6eb-5c41d2c4aebd';

-- AddForeignKey
ALTER TABLE "lessons" ADD CONSTRAINT "lessons_courseid_fkey" FOREIGN KEY ("courseid") REFERENCES "courses"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
