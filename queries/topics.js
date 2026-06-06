const prisma = require('../config/db');

const createTopic = async (data, status = 'APPROVED') => {
  return await prisma.topic.create({
    data: {
      topicName: data.topicName,
      courseid: data.courseId,
      position: data.position || 1,
      status: status,
    },
  });
};

const getTopicById = async (id, filter = {}) => {
  return await prisma.topic.findFirst({
    where: { id, ...filter },
    include: {
      lessons: {
        where: filter.status ? { status: filter.status } : {},
        orderBy: { position: 'asc' },
      },
      course: true,
    },
  });
};

const getAllTopicsForCourse = async (courseid, filter = {}) => {
  return await prisma.topic.findMany({
    where: {
      courseid,
      ...filter
    },
    orderBy: { position: 'asc' },
    include: {
      lessons: {
        where: filter.status ? { status: filter.status } : {},
        orderBy: { position: 'asc' },
      },
      course: true,
    },
  });
};

const updateTopic = async (id, data) => {
  return await prisma.topic.update({
    where: { id },
    data: {
      ...(data.topicName !== undefined && { topicName: data.topicName }),
      ...(data.courseId !== undefined && { courseid: data.courseId }),
      ...(data.position !== undefined && { position: data.position }),
      ...(data.status !== undefined && { status: data.status }),
      ...(data.feedback !== undefined && { feedback: data.feedback }),
    },
  });
};

const deleteTopic = async (id) => {
  return await prisma.topic.delete({
    where: { id },
  });
};

const getAllTopics = async () => {
  return await prisma.topic.findMany({
    orderBy: { position: 'asc' },
  });
};

module.exports = {
  createTopic,
  getTopicById,
  getAllTopicsForCourse,
  updateTopic,
  deleteTopic,
  getAllTopics,
};
