const prisma = require('../config/db');

const createEnrollment = async (data) => {
  return await prisma.enrollment.create({
    data: {
      userid: data.userId,
      courseid: data.courseId,
      status: data.status,
    },
  });
};

const getEnrollmentById = async (id) => {
  return await prisma.enrollment.findUnique({
    where: { id },
    include: {
      user: {
        select: { firstname: true, lastname: true, email: true },
      },
      course: {
        select: { courseName: true },
      },
    },
  });
};

const getEnrollmentsByUser = async (userid) => {
  return await prisma.enrollment.findMany({
    where: { userid },
    include: {
      course: {
        include: {
          project: true,
          topics: {
            include: {
              lessons: {
                select: { id: true }
              }
            }
          }
        }
      },
    },
  });
};

const getEnrollmentsByCourse = async (courseid) => {
  return await prisma.enrollment.findMany({
    where: { courseid },
    include: {
      user: {
        select: { id: true, firstname: true, lastname: true, email: true },
      },
    },
  });
};

const updateEnrollment = async (id, data) => {
  return await prisma.enrollment.update({
    where: { id },
    data: {
      ...(data.status !== undefined && { status: data.status }),
    },
  });
};

const deleteEnrollment = async (id) => {
  return await prisma.enrollment.delete({
    where: { id },
  });
};

module.exports = {
  createEnrollment,
  getEnrollmentById,
  getEnrollmentsByUser,
  getEnrollmentsByCourse,
  updateEnrollment,
  deleteEnrollment,
};
