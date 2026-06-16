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

const getAllCourses = async ({ limit, skip, filter = {}, search = '' }) => {
  // Separate the course-level filter from nested status filtering
  const { status } = filter;

  // Build search condition
  const searchCondition = search
    ? {
        OR: [
          { title: { contains: search, mode: 'insensitive' } },
          { description: { contains: search, mode: 'insensitive' } },
        ],
      }
    : {};

  const whereClause = {
    ...filter,
    ...searchCondition,
  };

  const [courses, total] = await Promise.all([
    prisma.course.findMany({
      where: whereClause,
      include: {
        category: true,
        creator: {
          select: {
            id: true,
            firstname: true,
            lastname: true,
          },
        },
        topics: {
          where: status ? { status } : {},
          orderBy: { position: 'asc' },
          include: {
            lessons: {
              where: status ? { status } : {},
              orderBy: { position: 'asc' },
            },
          },
        },
        benefits: true,
      },
      take: limit ?? 10,
      skip: skip ?? 0,
      orderBy: { createdAt: 'desc' },
    }),
    prisma.course.count({ where: whereClause }),
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
