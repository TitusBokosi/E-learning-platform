const { createUser, getUserById, getAllUsers, updateUser, deleteUser } = require('../queries/users');




const getAllUsersController = async (req, res, next) => {
  try {
    const users = await getAllUsers();
    res.status(200).json({
      status: "success",
      data: users
    });
  } catch (error) {
    next(error);
  }
};

const getUserByIdController = async (req, res, next) => {
  try {
    const { id } = req.user;
    const user = await getUserById(id);

    if (!user) {
      return next(new AppError("User not found", 404));
    }

    return res.status(200).json({
      status: "success",
      data: user
    });
  } catch (error) {
    next(error);
  }
};

const deleteUserController = async (req, res, next) => {
  try {
    const { id } = req.user;
    const deletedUser = await deleteUser(id);

    if (!deletedUser) {
      return next(new AppError("User not found", 404));
    }

    return res.status(204).json({
      status: "success",
      data: null
    });
  } catch (error) {
    next(error);
  }
};

const updateUserController = async (req, res, next) => {
  try {
    const { id } = req.user;
    const data = req.body;
    
    const updatedUser = await updateUser(id, data);

    return res.status(200).json({
      status: "success",
      data: updatedUser
    });
  } catch (error) {
    next(error);
  }
};

// const changeUserRoleController = async (req, res) => {};

module.exports = {
  
  getAllUsersController,
  getUserByIdController,
  deleteUserController,
  updateUserController

};
