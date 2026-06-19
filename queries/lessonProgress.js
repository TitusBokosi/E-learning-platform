const prisma = require('../config/db');

const createLessonProgress = async (data) => {
  return await prisma.lessonProgress.create({
    data: {
      userid: data.userId,
      lessonid: data.lessonId,
    },
  });
};

const getLessonProgressById = async (id) => {
  return await prisma.lessonProgress.findUnique({
    where: { id },
  });
};

const getProgressByUser = async (userid) => {
  return await prisma.lessonProgress.findMany({
    where: { userid },
    include: {
      lesson: {
        include: {
          topic: {
            include: {
              course: true
            }
          }
        }
      },
    },
  });
};

const getProgressByUserAndLesson = async (userid, lessonid) => {
  return await prisma.lessonProgress.findUnique({
    where: {
      userid_lessonid: {
        userid,
        lessonid,
      },
    },
  });
};

const deleteLessonProgress = async (id) => {
  return await prisma.lessonProgress.delete({
    where: { id },
  });
};

module.exports = {
  createLessonProgress,
  getLessonProgressById,
  getProgressByUser,
  getProgressByUserAndLesson,
  deleteLessonProgress,
};
