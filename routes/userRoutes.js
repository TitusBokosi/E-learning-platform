const express = require('express');
const { validate } = require('../middlewares/validateRequest');
const { authenticateAccessToken, authorize } = require('../middlewares/authMiddleware');
const {
  updateUserSchema,
  changeUserRoleValidator,
  deleteUserValidator,
} = require('../validators/userValidator');
const {
  getUserByIdController,
  updateUserController,
  deleteUserController,
  getAllUsersController,
  changeUserRoleController,
  suspendUserController,
  unsuspendUserController,
  adminDeleteUserController,
} = require('../controllers/userControllers');
const { updatePasswordController } = require('../controllers/authControllers');

const userRoute = express.Router();

userRoute.get('/', authenticateAccessToken, authorize('ADMIN'), getAllUsersController);

// User profile management
userRoute.get('/me', authenticateAccessToken, getUserByIdController);
userRoute.get('/:userId', authenticateAccessToken, getUserByIdController);
userRoute.patch('/me', authenticateAccessToken, validate(updateUserSchema), updateUserController);
userRoute.patch('/change-password', authenticateAccessToken, updatePasswordController);
userRoute.delete('/me', authenticateAccessToken, deleteUserController);

// Admin management
userRoute.patch('/:userId/role', authenticateAccessToken, authorize('ADMIN'), validate(changeUserRoleValidator), changeUserRoleController);
userRoute.post('/:userId/suspend', authenticateAccessToken, authorize('ADMIN'), suspendUserController);
userRoute.post('/:userId/unsuspend', authenticateAccessToken, authorize('ADMIN'), unsuspendUserController);
userRoute.delete('/:userId', authenticateAccessToken, authorize('ADMIN'), validate(deleteUserValidator), adminDeleteUserController);

module.exports = userRoute;
