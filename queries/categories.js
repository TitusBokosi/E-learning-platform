const prisma = require('../config/db');

const createCategory = async (data) => {
  return await prisma.category.create({
    data: {
      categoryName: data.categoryName,
    },
  });
};

const getCategoryById = async (id) => {
  return await prisma.category.findUnique({
    where: { categoryid: id },
    include: {
      courses: true,
    },
  });
};

const getAllCategories = async () => {
  return await prisma.category.findMany({
    include: {
      courses: true,
    },
  });
};

const updateCategory = async (id, data) => {
  return await prisma.category.update({
    where: { categoryid: id },
    data: {
      ...(data.categoryName !== undefined && { categoryName: data.categoryName }),
    },
  });
};

const deleteCategory = async (id) => {
  return await prisma.category.delete({
    where: { categoryid: id },
  });
};

module.exports = {
  createCategory,
  getCategoryById,
  getAllCategories,
  updateCategory,
  deleteCategory,
};
