const express = require('express');
const { validate } = require('../middlewares/validateRequest');
const { authenticateAccessToken, maybeAuthenticate, authorize } = require('../middlewares/authMiddleware');
const {
  createLessonValidator,
  getLessonByIdValidator,
  updateLessonValidator,
  deleteLessonValidator,
} = require('../validators/lessonValidator');
const {
  createLessonController,
  getAllLessonsController,
  getLessonByIdController,
  updateLessonController,
  deleteLessonController,
  getAllLessonsForTopicController,
  rejectLessonController
} = require('../controllers/lessonController');
const { submitProjectController, getSubmissionController } = require('../controllers/submissionControllers');

const lessonRoute = express.Router({ mergeParams: true });

lessonRoute.get('/', maybeAuthenticate, getAllLessonsForTopicController);
lessonRoute.get('/:lessonId', maybeAuthenticate, validate(getLessonByIdValidator), getLessonByIdController);

lessonRoute.post('/', authenticateAccessToken, authorize('ADMIN', 'SUPER_CREATOR', 'CREATOR'), validate(createLessonValidator), createLessonController);
lessonRoute.patch('/:lessonId', authenticateAccessToken, authorize('ADMIN', 'SUPER_CREATOR', 'CREATOR'), validate(updateLessonValidator), updateLessonController);
lessonRoute.delete('/:lessonId', authenticateAccessToken, authorize('ADMIN', 'SUPER_CREATOR', 'CREATOR'), validate(deleteLessonValidator), deleteLessonController);

// Approval routes
lessonRoute.post('/:lessonId/approve', authenticateAccessToken, authorize('ADMIN', 'SUPER_CREATOR'), approveLessonController);
lessonRoute.post('/:lessonId/reject', authenticateAccessToken, authorize('ADMIN', 'SUPER_CREATOR'), rejectLessonController);

// Submissions
lessonRoute.post('/:lessonId/submit', authenticateAccessToken, submitProjectController);
lessonRoute.get('/:lessonId/submission', authenticateAccessToken, getSubmissionController);

module.exports = lessonRoute;
