const prisma = require('../config/db');

const createCourse = async (data, creatorId, status = 'APPROVED') => {
  return await prisma.course.create({
    data: {
      courseName: data.courseName,
      description: data.description,
      imageUrl: data.imageUrl,
      categoryid: data.categoryId,
      creatorId: creatorId,
      status: status,
      benefits: data.benefits ? {
        create: data.benefits.map(b => ({ content: typeof b === 'string' ? b : b.content }))
      } : undefined
    },
  });
};

const getAllCourses = async (limit, skip, filter = {}) => {
  const [courses, total] = await Promise.all([
    prisma.course.findMany({
      where: filter,
      include: {
        category: true,
        creator: {
          select: {
            id: true,
            firstname: true,
            lastname: true,
          }
        },
        topics: {
          where: filter.status ? { status: filter.status } : {},
          include: {
            lessons: {
              where: filter.status ? { status: filter.status } : {},
            },
          },
        },
        benefits: true,
      },
      take: limit || undefined,
      skip: skip || undefined,
    }),
    prisma.course.count({ where: filter }),
  ]);
  return { courses, total };
};

const getCourseById = async (id, filter = {}) => {
  return await prisma.course.findFirst({
    where: { id, ...filter },
    include: {
      category: true,
      creator: {
        select: {
          id: true,
          firstname: true,
          lastname: true,
        }
      },
      topics: {
        where: filter.status ? { status: filter.status } : {},
        orderBy: { position: 'asc' },
        include: {
          lessons: {
            where: filter.status ? { status: filter.status } : {},
            orderBy: { position: 'asc' },
          },
        },
      },
      benefits: true,
      project: true,
    },
  });
};

const updateCourse = async (id, data) => {
  return await prisma.course.update({
    where: { id },
    data: {
      ...(data.courseName !== undefined && { courseName: data.courseName }),
      ...(data.description !== undefined && { description: data.description }),
      ...(data.imageUrl !== undefined && { imageUrl: data.imageUrl }),
      ...(data.categoryId !== undefined && { categoryid: data.categoryId }),
      ...(data.status !== undefined && { status: data.status }),
      ...(data.feedback !== undefined && { feedback: data.feedback }),
      ...(data.benefits !== undefined && {
        benefits: {
          deleteMany: {},
          create: data.benefits.map(b => ({ content: typeof b === 'string' ? b : b.content }))
        }
      }),
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
