const prisma = require('../config/db');

const createUser = async (data) => {
  return await prisma.user.create({
    data,
    select: {
      id: true,
      firstname: true,
      lastname: true,
      email: true,
      role: true,
    },
  });
};

const getUserById = async (id) => {
  return await prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      firstname: true,
      lastname: true,
      email: true,
      role: true,
    },
  });
};

const getAllUsers = async () => {
  return await prisma.user.findMany();
};

const updateUser = async (id, data) => {
  return await prisma.user.update({
    where: { id },
    data,
  });
};

const changeUserRole = async (id, roleName) => {
  return await prisma.user.update({
    where: { id },
    data: { role: roleName },
  });
};

const suspendUser = async (id, isSuspended) => {
  return await prisma.user.update({
    where: { id },
    data: { isSuspended },
  });
};

const deleteUser = async (id) => {
  return await prisma.user.delete({
    where: { id },
  });
};

const getUserByEmail = async (email) => {
  return await prisma.user.findUnique({
    where: { email },
  });
};

module.exports = {
  createUser,
  getUserById,
  getAllUsers,
  updateUser,
  changeUserRole,
  deleteUser,
  getUserByEmail,
};
