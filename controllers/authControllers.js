const {createUser, getUserById, updateUser} = require('../queries/users');

const registerUser = async (req, res) => {};

const loginUser = async (req, res) => {};

const updatePasswordController = async (req, res) => {};

const refreshTokenController = async (req, res) => {};

module.exports = {
  registerUser,
  loginUser,
    updatePasswordController,
    refreshTokenController
};