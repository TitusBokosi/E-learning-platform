const express = require('express');
const { validate } = require('../middlewares/validateRequest');
const { authenticateAccessToken } = require('../middlewares/authMiddleware');
const {
  createLessonProgressValidator,
  getLessonProgressByIdValidator,
  getProgressByUserValidator,
  deleteLessonProgressValidator,
} = require('../validators/lessonProgressValidator');
const {
  createLessonProgressController,
  getLessonProgressByIdController,
  getProgressByUserController,
  deleteLessonProgressController,
} = require('../controllers/lessonProgressController');

const lessonProgressRoute = express.Router();

// User routes to manage their own progress
lessonProgressRoute.post(
  '/',
  authenticateAccessToken,
  validate(createLessonProgressValidator),
  createLessonProgressController
);

lessonProgressRoute.get(
  '/user',
  authenticateAccessToken,
  getProgressByUserController
);

lessonProgressRoute.get(
  '/user/:userId',
  authenticateAccessToken,
  validate(getProgressByUserValidator),
  getProgressByUserController
);

lessonProgressRoute.get(
  '/:progressId',
  authenticateAccessToken,
  validate(getLessonProgressByIdValidator),
  getLessonProgressByIdController
);

lessonProgressRoute.delete(
  '/:progressId',
  authenticateAccessToken,
  validate(deleteLessonProgressValidator),
  deleteLessonProgressController
);

module.exports = lessonProgressRoute;
