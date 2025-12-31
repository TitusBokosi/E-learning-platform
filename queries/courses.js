const prisma = require("../config/db");


const createCourse = async (data) => {
  return await prisma.course.create({
    data: {
      courseName: data.courseName,
      categoryid: data.categoryId, 
    },
  });
};


const getAllCourses = async () => {
  return await prisma.course.findMany({
    include: {
      category: true,
      topics: true,
    },
  });
};


const getCourseById = async (id) => {
  return await prisma.course.findUnique({
    where: { id },
    include: {
      category: true,
      topics: true,
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
