const { createUser, getUserById, getAllUsers, updateUser, deleteUser } = require('../queries/users');




const getAllUsersController = async (req, res) => {};

const getUserByIdController = async (req, res) => {};

const deleteUserController = async (req, res) => {};

const changeUserRoleController = async (req, res) => {};

module.exports = {
  registerUser,
  loginUser,
  getAllUsersController,
  getUserByIdController,
  deleteUserController,
  changeUserRoleController
};
