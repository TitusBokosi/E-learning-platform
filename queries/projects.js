const prisma = require('../config/db');

const createProject = async (data) => {
  return await prisma.project.create({
    data: {
      title: data.title,
      description: data.description,
      rubric: data.rubric,
      courseid: data.courseId,
    },
  });
};

const getProjectById = async (id) => {
  return await prisma.project.findUnique({
    where: { id },
  });
};

const getProjectByCourseId = async (courseid) => {
  return await prisma.project.findUnique({
    where: { courseid },
  });
};

const updateProject = async (id, data) => {
  return await prisma.project.update({
    where: { id },
    data: {
      ...(data.title !== undefined && { title: data.title }),
      ...(data.description !== undefined && { description: data.description }),
      ...(data.rubric !== undefined && { rubric: data.rubric }),
      ...(data.courseId !== undefined && { courseid: data.courseId }),
    },
  });
};

const deleteProject = async (id) => {
  return await prisma.project.delete({
    where: { id },
  });
};

module.exports = {
  createProject,
  getProjectById,
  getProjectByCourseId,
  updateProject,
  deleteProject,
};
