const express = require('express');
const {
  createCourseController,
  getAllCoursesController,
  getCourseByIdController,
  updateCourseController,
  deleteCourseController,
} = require('../controllers/courseControllers');
const {
  createCourseValidator,
  getCourseByIdValidator,
  updateCourseValidator,
  deleteCourseValidator,
} = require('../validators/courseValidator');
const topicRoute = require('./topicRoutes');
const { validate } = require('../middlewares/validateRequest');

const courseRoute = express.Router();

courseRoute.get('/', getAllCoursesController);
courseRoute.post('/', validate(createCourseValidator), createCourseController);
courseRoute.get('/:courseId', getCourseByIdController);
courseRoute.put(
  '/:courseId',
  validate(updateCourseValidator),
  updateCourseController,
);
courseRoute.delete(
  '/:courseId',

  deleteCourseController,
);
courseRoute.use('/:courseId/topics', topicRoute);

module.exports = courseRoute;
