-- DropForeignKey
ALTER TABLE "public"."lessons" DROP CONSTRAINT "lessons_courseid_fkey";

-- DropForeignKey
ALTER TABLE "public"."lessons" DROP CONSTRAINT "lessons_topicid_fkey";

-- DropForeignKey
ALTER TABLE "public"."topics" DROP CONSTRAINT "topics_courseid_fkey";

-- AddForeignKey
ALTER TABLE "topics" ADD CONSTRAINT "topics_courseid_fkey" FOREIGN KEY ("courseid") REFERENCES "courses"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lessons" ADD CONSTRAINT "lessons_topicid_fkey" FOREIGN KEY ("topicid") REFERENCES "topics"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lessons" ADD CONSTRAINT "lessons_courseid_fkey" FOREIGN KEY ("courseid") REFERENCES "courses"("id") ON DELETE CASCADE ON UPDATE CASCADE;
