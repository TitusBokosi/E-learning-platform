const { createUser, getUserById, getAllUsers, updateUser, deleteUser, changeUserRole } = require('../queries/users');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

const getAllUsersController = catchAsync(async (req, res, next) => {
  const users = await getAllUsers();
  res.status(200).json({
    status: "success",
    data: users
  });
});

const getUserByIdController = catchAsync(async (req, res, next) => {
  const id = req.params.userId || req.user.id;
  
  // Security check: only ADMIN or the user themselves can access this profile
  if (req.user.role !== 'ADMIN' && req.user.id !== id) {
    return next(new AppError("You do not have permission to access this profile", 403));
  }

  const user = await getUserById(id);

  if (!user) {
    return next(new AppError("User not found", 404));
  }

  return res.status(200).json({
    status: "success",
    data: user
  });
});

const deleteUserController = catchAsync(async (req, res, next) => {
  const { id } = req.user;
  const deletedUser = await deleteUser(id);

  if (!deletedUser) {
    return next(new AppError("User not found", 404));
  }

  return res.status(204).json({
    status: "success",
    data: null
  });
});

const updateUserController = catchAsync(async (req, res, next) => {
  const { id } = req.user;
  const data = req.body;
  
  const updatedUser = await updateUser(id, data);

  return res.status(200).json({
    status: "success",
    data: updatedUser
  });
});

const changeUserRoleController = catchAsync(async (req, res, next) => {
  const { userId } = req.params;
  const { role } = req.body;

  const validRoles = ['STUDENT', 'CREATOR', 'SUPER_CREATOR', 'ADMIN'];
  if (!validRoles.includes(role)) {
    return next(new AppError('Invalid role', 400));
  }

  const updatedUser = await changeUserRole(userId, role);
  res.status(200).json({
      message: 'User role updated successfully',
      data: updatedUser
  });
});

const suspendUserController = catchAsync(async (req, res, next) => {
  const { userId } = req.params;
  const updatedUser = await updateUser(userId, { isSuspended: true });
  res.status(200).json({
      status: "success",
      message: "User suspended successfully",
      data: updatedUser
  });
});

const unsuspendUserController = catchAsync(async (req, res, next) => {
  const { userId } = req.params;
  const updatedUser = await updateUser(userId, { isSuspended: false });
  res.status(200).json({
      status: "success",
      message: "User unsuspended successfully",
      data: updatedUser
  });
});

const adminDeleteUserController = catchAsync(async (req, res, next) => {
  const { userId } = req.params;

  const deletedUser = await deleteUser(userId);
  res.status(204).json({
      status: "success",
      data: deletedUser
  });
});

module.exports = {
  getAllUsersController,
  getUserByIdController,
  deleteUserController,
  updateUserController,
  changeUserRoleController,
  suspendUserController,
  unsuspendUserController,
  adminDeleteUserController
};
