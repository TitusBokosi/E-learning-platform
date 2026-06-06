const prisma = require('../config/db');

const createLesson = async (data, status = 'APPROVED') => {
  return await prisma.lesson.create({
    data: {
      lessonName: data.lessonName,
      lessonType: data.lessonType,
      content: data.content,
      videoUrl: data.videoUrl,
      topicid: data.topicId,
      position: data.position || 1,
      status: status,
    },
  });
};

const getAllLessonsForTopic = async (topicid, filter = {}) => {
  return await prisma.lesson.findMany({
    where: {
      topicid,
      ...filter
    },
    orderBy: { position: 'asc' },
  });
};

const getLessonById = async (id, filter = {}) => {
  return await prisma.lesson.findFirst({
    where: { id, ...filter },
    include: {
      topic: {
        include: {
          course: true,
        },
      },
    },
  });
};

const updateLesson = async (id, data) => {
  return await prisma.lesson.update({
    where: { id },
    data: {
      ...(data.lessonName !== undefined && { lessonName: data.lessonName }),
      ...(data.lessonType !== undefined && { lessonType: data.lessonType }),
      ...(data.content !== undefined && { content: data.content }),
      ...(data.videoUrl !== undefined && { videoUrl: data.videoUrl }),
      ...(data.topicId !== undefined && { topicid: data.topicId }),
      ...(data.position !== undefined && { position: data.position }),
      ...(data.status !== undefined && { status: data.status }),
      ...(data.feedback !== undefined && { feedback: data.feedback }),
    },
  });
};

const deleteLesson = async (id) => {
  return await prisma.lesson.delete({
    where: { id },
  });
};

const getAllLessons = async () => {
  return await prisma.lesson.findMany({
    orderBy: { position: 'asc' },
  });
};

module.exports = {
  createLesson,
  getAllLessonsForTopic,
  getLessonById,
  updateLesson,
  deleteLesson,
  getAllLessons,
};
