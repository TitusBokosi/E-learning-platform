const prisma = require('../config/db');

const createLesson = async (data) => {
  return await prisma.lesson.create({
    data: {
      lessonName: data.lessonName,
      topicid: data.topicId,
    },
  });
};

const getAllLessonsForTopic = async (topicid) => {
  return await prisma.lesson.findMany({
    where: {
      topicid,
    },
  });
};

const getLessonById = async (id) => {
  return await prisma.lesson.findUnique({
    where: { id },
  });
};

const updateLesson = async (id, data) => {
  return await prisma.lesson.update({
    where: { id },
    data: {
      ...(data.lessonName && { lessonName: data.lessonName }),
      ...(data.topicId && { topicid: data.topicId }),
    },
  });
};

const deleteLesson = async (id) => {
  return await prisma.lesson.delete({
    where: { id },
  });
};

const getAllLessons = async () => {
  return await prisma.lesson.findMany();
};

module.exports = {
  createLesson,
  getAllLessonsForTopic,
  getLessonById,
  updateLesson,
  deleteLesson,
  getAllLessons,
};
