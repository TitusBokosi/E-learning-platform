const {
  createSubmission,
  getSubmissionByLessonAndUser,
  getAllSubmissions,
  getSubmissionById,
  updateSubmission,
} = require('../queries/submissions');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

// POST /lessons/:lessonId/submit  — Student submits a project URL
const submitProjectController = catchAsync(async (req, res, next) => {
  const { lessonId } = req.params;
  const { projectUrl } = req.body;
  const userId = req.user.id;

  if (!projectUrl) {
    return next(new AppError('Please provide a project URL', 400));
  }

  // Check if already submitted
  const existing = await getSubmissionByLessonAndUser(lessonId, userId);
  if (existing) {
    return next(new AppError('You have already submitted a project for this lesson', 400));
  }

  const submission = await createSubmission({ lessonId, userId, projectUrl });

  res.status(201).json({ status: 'success', data: submission });
});

// GET /lessons/:lessonId/submission  — Student views their own submission
const getSubmissionController = catchAsync(async (req, res, next) => {
  const { lessonId } = req.params;
  const userId = req.user.id;

  const submission = await getSubmissionByLessonAndUser(lessonId, userId);

  res.status(200).json({ status: 'success', data: submission });
});

// GET /lessons/:lessonId/submissions  — Admin lists all submissions for a lesson
const getLessonSubmissionsController = catchAsync(async (req, res, next) => {
  const { lessonId } = req.params;
  const { status } = req.query;

  const { submissions, total } = await getAllSubmissions({ lessonId, status });

  res.status(200).json({
    status: 'success',
    results: submissions.length,
    total,
    data: submissions,
  });
});

// GET /submissions  — Admin lists all submissions across the platform
const getAllSubmissionsController = catchAsync(async (req, res, next) => {
  const { status, lessonId, skip = 0, limit = 20 } = req.query;

  const { submissions, total } = await getAllSubmissions({ status, lessonId, skip, limit });

  res.status(200).json({
    status: 'success',
    results: submissions.length,
    metadata: { total, skip: parseInt(skip), limit: parseInt(limit) },
    data: submissions,
  });
});

// PATCH /submissions/:submissionId/review  — Admin approves or rejects a submission
const reviewSubmissionController = catchAsync(async (req, res, next) => {
  const { submissionId } = req.params;
  const { status, feedback } = req.body;

  if (!status) {
    return next(new AppError('Please provide a review status (APPROVED or REJECTED)', 400));
  }

  const allowed = ['APPROVED', 'REJECTED', 'PENDING'];
  if (!allowed.includes(status)) {
    return next(new AppError(`Status must be one of: ${allowed.join(', ')}`, 400));
  }

  if (status === 'REJECTED' && !feedback) {
    return next(new AppError('Please provide feedback when rejecting a submission', 400));
  }

  const submission = await getSubmissionById(submissionId);
  if (!submission) {
    return next(new AppError('Submission not found', 404));
  }

  const updated = await updateSubmission(submissionId, {
    status,
    ...(feedback !== undefined && { feedback }),
  });

  res.status(200).json({ status: 'success', data: updated });
});

module.exports = {
  submitProjectController,
  getSubmissionController,
  getLessonSubmissionsController,
  getAllSubmissionsController,
  reviewSubmissionController,
};
