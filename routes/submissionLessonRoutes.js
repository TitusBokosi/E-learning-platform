const express = require('express');
const { authenticateAccessToken, authorize } = require('../middlewares/authMiddleware');
const {
  submitProjectController,
  getSubmissionController,
  getLessonSubmissionsController,
} = require('../controllers/submissionControllers');

const submissionLessonRoute = express.Router();

submissionLessonRoute.post('/:lessonId/submit', authenticateAccessToken, submitProjectController);
submissionLessonRoute.get('/:lessonId/submission', authenticateAccessToken, getSubmissionController);
submissionLessonRoute.get(
  '/:lessonId/submissions',
  authenticateAccessToken,
  authorize('ADMIN', 'SUPER_CREATOR'),
  getLessonSubmissionsController,
);

module.exports = submissionLessonRoute;
