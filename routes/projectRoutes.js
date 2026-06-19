const express = require('express');
const { validate } = require('../middlewares/validateRequest');
const { authenticateAccessToken, authorizeAdmin } = require('../middlewares/authMiddleware');
const {
  createProjectValidator,
  getProjectByIdValidator,
  getProjectByCourseIdValidator,
  updateProjectValidator,
  deleteProjectValidator,
} = require('../validators/projectValidator');
const {
  createProjectController,
  getProjectByIdController,
  getProjectByCourseIdController,
  updateProjectController,
  deleteProjectController,
} = require('../controllers/projectController');

const projectRoute = express.Router();

projectRoute.post(
  '/',
  authenticateAccessToken,
  authorizeAdmin,
  validate(createProjectValidator),
  createProjectController
);

projectRoute.get('/course/:courseId', validate(getProjectByCourseIdValidator), getProjectByCourseIdController);
projectRoute.get('/:projectId', validate(getProjectByIdValidator), getProjectByIdController);

projectRoute.patch(
  '/:projectId',
  authenticateAccessToken,
  authorizeAdmin,
  validate(updateProjectValidator),
  updateProjectController
);
projectRoute.delete(
  '/:projectId',
  authenticateAccessToken,
  authorizeAdmin,
  validate(deleteProjectValidator),
  deleteProjectController
);

module.exports = projectRoute;
