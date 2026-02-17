const prisma = require('../config/db');

const createTopic = async (data) => {
  return await prisma.topic.create({
    data: {
      topicName: data.topicName,
      courseid: data.courseId,
    },
  });
};

const getTopicById = async (id) => {
  return await prisma.topic.findUnique({
    where: { id },
    include: {
      lessons: true,
      course: true,
    },
  });
};

const getAllTopicsForCourse = async (courseid) => {
  return await prisma.topic.findMany({
    where: {
      courseid,
    },
    include: {
      lessons: true,
      course: true,
    },
  });
};

const updateTopic = async (id, data) => {
  return await prisma.topic.update({
    where: { id },
    data: {
      ...(data.topicName && { topicName: data.topicName }),
      ...(data.courseId && { courseid: data.courseId }),
    },
  });
};

const deleteTopic = async (id) => {
  return await prisma.topic.delete({
    where: { id },
  });
};

const getAllTopics = async () => {
  return await prisma.topic.findMany({});
};

module.exports = {
  createTopic,
  getTopicById,
  getAllTopicsForCourse,
  updateTopic,
  deleteTopic,
  getAllTopics,
};
