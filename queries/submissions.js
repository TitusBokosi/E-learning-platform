const prisma = require('../config/db');

const createSubmission = async (data) => {
  return await prisma.submission.create({
    data: {
      lessonId: data.lessonId,
      userId: data.userId,
      projectUrl: data.projectUrl,
    },
  });
};

const getSubmissionByLessonAndUser = async (lessonId, userId) => {
  return await prisma.submission.findFirst({
    where: {
      lessonId,
      userId,
    },
  });
};

module.exports = {
  createSubmission,
  getSubmissionByLessonAndUser,
};
