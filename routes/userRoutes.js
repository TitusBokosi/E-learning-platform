const express = require('express');
const { validate } = require('../middlewares/validateRequest');
const {
  userIdParamSchema,
  changePasswordSchema,
  updateUserSchema,
} = require('../validators/userValidator');
const { authenticateAccessToken } = require('../middlewares/authMiddleware');
const {
  getUserByIdController,
  updateUserController,
  deleteUserController,
  getAllUsersController,
} = require('../controllers/userControllers');
const adminRoute = require('./adminRoutes');

const userRoute = express.Router();
userRoute.get('/', getAllUsersController);
userRoute.use('/admin', adminRoute);
userRoute.get('/:username', authenticateAccessToken, getUserByIdController);
userRoute.patch(
  '/:username',
  authenticateAccessToken,
  validate(updateUserSchema),
  updateUserController,
);
userRoute.delete('/:username', authenticateAccessToken, deleteUserController);
userRoute.patch(
  '/:username/password',
  validate(changePasswordSchema),
  authenticateAccessToken,
  updateUserController,
);

module.exports = userRoute;
