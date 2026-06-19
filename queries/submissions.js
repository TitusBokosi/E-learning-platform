const prisma = require('../config/db');

const createSubmission = async (data) => {
  return await prisma.submission.create({
    data: {
      lessonId: data.lessonId,
      userId: data.userId,
      projectUrl: data.projectUrl,
    },
    include: {
      user: { select: { id: true, firstname: true, lastname: true, email: true } },
      lesson: { select: { id: true, lessonName: true, topicid: true } },
    },
  });
};

const getSubmissionByLessonAndUser = async (lessonId, userId) => {
  return await prisma.submission.findFirst({
    where: { lessonId, userId },
    include: {
      user: { select: { id: true, firstname: true, lastname: true, email: true } },
      lesson: { select: { id: true, lessonName: true, topicid: true } },
    },
  });
};

const getAllSubmissions = async ({ userId, lessonId, skip = 0, limit = 20 } = {}) => {
  const where = {};
  if (userId) where.userId = userId;
  if (lessonId) where.lessonId = lessonId;

  const [submissions, total] = await Promise.all([
    prisma.submission.findMany({
      where,
      include: {
        user: { select: { id: true, firstname: true, lastname: true, email: true } },
        lesson: {
          select: {
            id: true,
            lessonName: true,
            topic: {
              select: {
                id: true,
                topicName: true,
                course: { select: { id: true, courseName: true } },
              },
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
      skip: parseInt(skip),
      take: parseInt(limit),
    }),
    prisma.submission.count({ where }),
  ]);

  return { submissions, total };
};

const getSubmissionById = async (id) => {
  return await prisma.submission.findUnique({
    where: { id },
    include: {
      user: { select: { id: true, firstname: true, lastname: true, email: true } },
      lesson: {
        select: {
          id: true,
          lessonName: true,
          topic: {
            select: {
              id: true,
              topicName: true,
              course: { select: { id: true, courseName: true } },
            },
          },
        },
      },
    },
  });
};

const updateSubmission = async (id, data) => {
  return await prisma.submission.update({
    where: { id },
    data,
    include: {
      user: { select: { id: true, firstname: true, lastname: true, email: true } },
      lesson: {
        select: {
          id: true,
          lessonName: true,
          topic: {
            select: {
              id: true,
              topicName: true,
              course: { select: { id: true, courseName: true } },
            },
          },
        },
      },
    },
  });
};

module.exports = {
  createSubmission,
  getSubmissionByLessonAndUser,
  getAllSubmissions,
  getSubmissionById,
  updateSubmission,
};
