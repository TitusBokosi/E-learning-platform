const express = require('express');
const { validate } = require('../middlewares/validateRequest');
const { authenticateAccessToken, authorizeAdmin } = require('../middlewares/authMiddleware');
const {
  createEnrollmentValidator,
  getEnrollmentByIdValidator,
  getEnrollmentsByUserValidator,
  getEnrollmentsByCourseValidator,
  updateEnrollmentValidator,
  deleteEnrollmentValidator,
} = require('../validators/enrollmentValidator');
const {
  createEnrollmentController,
  getEnrollmentByIdController,
  getEnrollmentsByUserController,
  getEnrollmentsByCourseController,
  updateEnrollmentController,
  deleteEnrollmentController,
} = require('../controllers/enrollmentController');

const enrollmentRoute = express.Router();

// A user can enroll themselves
enrollmentRoute.post(
  '/',
  authenticateAccessToken,
  validate(createEnrollmentValidator),
  createEnrollmentController
);

// Admin reading
enrollmentRoute.get(
  '/course/:courseId',
  authenticateAccessToken,
  authorizeAdmin,
  validate(getEnrollmentsByCourseValidator),
  getEnrollmentsByCourseController
);

// Users can read their own or admin can read any
enrollmentRoute.get(
  '/user',
  authenticateAccessToken,
  getEnrollmentsByUserController
);

enrollmentRoute.get(
  '/user/:userId',
  authenticateAccessToken,
  validate(getEnrollmentsByUserValidator),
  getEnrollmentsByUserController
);

enrollmentRoute.get(
  '/:enrollmentId',
  authenticateAccessToken,
  validate(getEnrollmentByIdValidator),
  getEnrollmentByIdController
);

// Admins can update any enrollment; students can drop/delete their own enrollment.
enrollmentRoute.patch(
  '/:enrollmentId',
  authenticateAccessToken,
  validate(updateEnrollmentValidator),
  updateEnrollmentController
);

enrollmentRoute.delete(
  '/:enrollmentId',
  authenticateAccessToken,
  validate(deleteEnrollmentValidator),
  deleteEnrollmentController
);

module.exports = enrollmentRoute;
