const express = require('express');
const {
  createCourseController,
  getAllCoursesController,
  getCourseByIdController,
  updateCourseController,
  deleteCourseController,
  approveCourseController,
  rejectCourseController
} = require('../controllers/courseControllers');
const {
  createCourseValidator,
  getCourseByIdValidator,
  updateCourseValidator,
  deleteCourseValidator,
} = require('../validators/courseValidator');
const topicRoute = require('./topicRoutes');
const { validate } = require('../middlewares/validateRequest');
const { authenticateAccessToken, maybeAuthenticate, authorize } = require('../middlewares/authMiddleware');

const courseRoute = express.Router();

courseRoute.get('/', maybeAuthenticate, getAllCoursesController);
courseRoute.get('/:courseId', maybeAuthenticate, validate(getCourseByIdValidator), getCourseByIdController);

courseRoute.post('/', authenticateAccessToken, authorize('ADMIN', 'SUPER_CREATOR', 'CREATOR'), validate(createCourseValidator), createCourseController);
courseRoute.patch('/:courseId', authenticateAccessToken, authorize('ADMIN', 'SUPER_CREATOR', 'CREATOR'), validate(updateCourseValidator), updateCourseController);
courseRoute.delete('/:courseId', authenticateAccessToken, authorize('ADMIN', 'SUPER_CREATOR', 'CREATOR'), validate(deleteCourseValidator), deleteCourseController);

// Approval routes
courseRoute.post('/:courseId/approve', authenticateAccessToken, authorize('ADMIN', 'SUPER_CREATOR'), approveCourseController);
courseRoute.post('/:courseId/reject', authenticateAccessToken, authorize('ADMIN', 'SUPER_CREATOR'), rejectCourseController);

courseRoute.use('/:courseId/topics', topicRoute);

module.exports = courseRoute;
