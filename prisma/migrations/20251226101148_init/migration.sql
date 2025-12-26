-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "userName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "roleid" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "roles" (
    "roleid" TEXT NOT NULL,
    "roleName" TEXT NOT NULL,

    CONSTRAINT "roles_pkey" PRIMARY KEY ("roleid")
);

-- CreateTable
CREATE TABLE "admins" (
    "id" TEXT NOT NULL,
    "adminRole" TEXT NOT NULL,

    CONSTRAINT "admins_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "courses" (
    "id" TEXT NOT NULL,
    "courseName" TEXT NOT NULL,
    "categoryid" TEXT NOT NULL,

    CONSTRAINT "courses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "topics" (
    "id" TEXT NOT NULL,
    "topicName" TEXT NOT NULL,
    "courseid" TEXT NOT NULL,

    CONSTRAINT "topics_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "lessons" (
    "id" TEXT NOT NULL,
    "lessonName" TEXT NOT NULL,
    "topicid" TEXT NOT NULL,

    CONSTRAINT "lessons_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "categories" (
    "categoryid" TEXT NOT NULL,
    "categoryName" TEXT NOT NULL,

    CONSTRAINT "categories_pkey" PRIMARY KEY ("categoryid")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "roles_roleName_key" ON "roles"("roleName");

-- CreateIndex
CREATE UNIQUE INDEX "courses_courseName_key" ON "courses"("courseName");

-- CreateIndex
CREATE UNIQUE INDEX "topics_topicName_key" ON "topics"("topicName");

-- CreateIndex
CREATE UNIQUE INDEX "lessons_lessonName_key" ON "lessons"("lessonName");

-- CreateIndex
CREATE UNIQUE INDEX "categories_categoryName_key" ON "categories"("categoryName");

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_roleid_fkey" FOREIGN KEY ("roleid") REFERENCES "roles"("roleid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "admins" ADD CONSTRAINT "admins_id_fkey" FOREIGN KEY ("id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "admins" ADD CONSTRAINT "admins_adminRole_fkey" FOREIGN KEY ("adminRole") REFERENCES "roles"("roleid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "courses" ADD CONSTRAINT "courses_categoryid_fkey" FOREIGN KEY ("categoryid") REFERENCES "categories"("categoryid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "topics" ADD CONSTRAINT "topics_courseid_fkey" FOREIGN KEY ("courseid") REFERENCES "courses"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lessons" ADD CONSTRAINT "lessons_topicid_fkey" FOREIGN KEY ("topicid") REFERENCES "topics"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
