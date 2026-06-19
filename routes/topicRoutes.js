const express = require('express');
const { validate } = require('../middlewares/validateRequest');
const {
  authenticateAccessToken,
  maybeAuthenticate,
  authorize,
} = require('../middlewares/authMiddleware');
const {
  createTopicValidator,
  getTopicByIdValidator,
  updateTopicValidator,
  deleteTopicValidator,
} = require('../validators/topicValidator');
const {
  createTopicController,
  getTopicByIdController,
  getAllTopicsController,
  updateTopicController,
  deleteTopicController,
  getAllTopicsForCourseController,
  approveTopicController,
  rejectTopicController
} = require('../controllers/topicController');
const lessonRoute = require('./lessonRoutes');

const topicRoute = express.Router({ mergeParams: true });

topicRoute.use('/:topicId/lessons', lessonRoute);

topicRoute.get('/', maybeAuthenticate, getAllTopicsForCourseController);
topicRoute.get(
  '/:topicId',
  maybeAuthenticate, 
  validate(getTopicByIdValidator),
  getTopicByIdController,
);

topicRoute.post(
  '/',
  authenticateAccessToken,
  authorize('ADMIN', 'SUPER_CREATOR', 'CREATOR'),
  validate(createTopicValidator),
  createTopicController,
);
topicRoute.patch(
  '/:topicId',
  authenticateAccessToken,
  authorize('ADMIN', 'SUPER_CREATOR', 'CREATOR'),
  validate(updateTopicValidator),
  updateTopicController,
);
topicRoute.delete(
  '/:topicId',
  authenticateAccessToken,
  authorize('ADMIN', 'SUPER_CREATOR', 'CREATOR'),
  validate(deleteTopicValidator),
  deleteTopicController,
);

// Approval routes
topicRoute.post('/:topicId/approve', authenticateAccessToken, authorize('ADMIN', 'SUPER_CREATOR'), approveTopicController);
topicRoute.post('/:topicId/reject', authenticateAccessToken, authorize('ADMIN', 'SUPER_CREATOR'), rejectTopicController);

module.exports = topicRoute;
