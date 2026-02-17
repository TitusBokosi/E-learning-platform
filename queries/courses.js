const prisma = require('../config/db');

const createCourse = async (data) => {
  return await prisma.course.create({
    data,
  });
};

const getAllCourses = async () => {
  return await prisma.course.findMany({
    include: {
      topics: true,
      lessons: true,
    },
  });
};

const getCourseById = async (id) => {
  return await prisma.course.findUnique({
    where: { id },
    include: {
      topics: {
        include: {
          lessons: true,
        },
      },
      lessons: true,
    },
  });
};

const updateCourse = async (id, data) => {
  return await prisma.course.update({
    where: { id },
    data: {
      ...(data.courseName && { courseName: data.courseName }),
      ...(data.categoryId && { categoryid: data.categoryId }),
    },
  });
};

const deleteCourse = async (id) => {
  return await prisma.course.delete({
    where: { id },
  });
};

module.exports = {
  createCourse,
  getAllCourses,
  getCourseById,
  updateCourse,
  deleteCourse,
};
