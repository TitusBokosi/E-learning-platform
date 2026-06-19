const {
  createEnrollment,
  getEnrollmentById,
  getEnrollmentsByUser,
  getEnrollmentsByCourse,
  updateEnrollment,
  deleteEnrollment,
} = require('../queries/enrollments');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

const createEnrollmentController = catchAsync(async (req, res, next) => {
  const data = {
    userId: req.body.userId || (req.user ? req.user.id : null),
    courseId: req.body.courseId,
    status: req.body.status || 'ACTIVE'
  };

  const prisma = require('../config/db');
  const course = await prisma.course.findUnique({ where: { id: data.courseId } });

  if (!course || course.status !== 'APPROVED') {
    return next(new AppError('You can only enroll in approved courses', 400));
  }

  const newEnrollment = await createEnrollment(data);

  res.status(201).json({
    status: 'success',
    data: newEnrollment,
  });
});

const getEnrollmentByIdController = catchAsync(async (req, res, next) => {
  const { enrollmentId } = req.params;
  const enrollment = await getEnrollmentById(enrollmentId);

  if (!enrollment) {
    return next(new AppError('Enrollment not found', 404));
  }

  res.status(200).json({
    status: 'success',
    data: enrollment,
  });
});

const getEnrollmentsByUserController = catchAsync(async (req, res, next) => {
  const userId = req.params.userId || req.user.id;
  
  if (req.user.role !== 'ADMIN' && req.user.id !== userId) {
      return next(new AppError('Unauthorized access to other user enrollments', 403));
  }

  const enrollments = await getEnrollmentsByUser(userId);

  res.status(200).json({
    status: 'success',
    results: enrollments.length,
    data: enrollments,
  });
});

const getEnrollmentsByCourseController = catchAsync(async (req, res, next) => {
  const { courseId } = req.params;
  const enrollments = await getEnrollmentsByCourse(courseId);

  res.status(200).json({
    status: 'success',
    results: enrollments.length,
    data: enrollments,
  });
});

const updateEnrollmentController = catchAsync(async (req, res, next) => {
  const { enrollmentId } = req.params;
  const enrollment = await getEnrollmentById(enrollmentId);

  if (!enrollment) {
    return next(new AppError('Enrollment not found', 404));
  }

  const isOwner = enrollment.user?.id === req.user.id;
  const isAdmin = req.user.role === 'ADMIN';

  if (!isAdmin && (!isOwner || req.body.status !== 'DROPPED')) {
    return next(new AppError('You can only drop your own enrollment', 403));
  }

  const updatedEnrollment = await updateEnrollment(enrollmentId, req.body);

  res.status(200).json({
    status: 'success',
    data: updatedEnrollment,
  });
});

const deleteEnrollmentController = catchAsync(async (req, res, next) => {
  const { enrollmentId } = req.params;
  const enrollment = await getEnrollmentById(enrollmentId);

  if (!enrollment) {
    return next(new AppError('Enrollment not found', 404));
  }

  if (req.user.role !== 'ADMIN' && enrollment.user?.id !== req.user.id) {
    return next(new AppError('You can only delete your own enrollment', 403));
  }

  await deleteEnrollment(enrollmentId);

  res.status(204).json({
    status: 'success',
    data: null,
  });
});

module.exports = {
  createEnrollmentController,
  getEnrollmentByIdController,
  getEnrollmentsByUserController,
  getEnrollmentsByCourseController,
  updateEnrollmentController,
  deleteEnrollmentController,
};
