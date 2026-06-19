const {
  createSubmission,
  getSubmissionByLessonAndUser,
  getAllSubmissions,
  getSubmissionById,
  updateSubmission,
} = require('../queries/submissions');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const { logActivity } = require('../queries/activityLogs');

// POST /lessons/:lessonId/submit  — Student submits a project URL
const submitProjectController = catchAsync(async (req, res, next) => {
  const { lessonId } = req.params;
  const { projectUrl } = req.body;
  const userId = req.user.id;

  if (!projectUrl) {
    return next(new AppError('Please provide a project URL', 400));
  }

  const existing = await getSubmissionByLessonAndUser(lessonId, userId);
  if (existing) {
    const updated = await updateSubmission(existing.id, {
      projectUrl,
    });

    return res.status(200).json({ status: 'success', data: updated });
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

  const { submissions, total } = await getAllSubmissions({ lessonId });

  res.status(200).json({
    status: 'success',
    results: submissions.length,
    total,
    data: submissions,
  });
});

// GET /submissions  — Admin lists all submissions across the platform
const getAllSubmissionsController = catchAsync(async (req, res, next) => {
  const { lessonId, skip = 0, limit = 20 } = req.query;
  let { userId } = req.query;

  // Security: Students can only see their own submissions
  if (req.user.role === 'STUDENT') {
    userId = req.user.id;
  }

  const { submissions, total } = await getAllSubmissions({ userId, lessonId, skip, limit });

  res.status(200).json({
    status: 'success',
    results: submissions.length,
    metadata: { total, skip: parseInt(skip), limit: parseInt(limit) },
    data: submissions,
  });
});



module.exports = {
  submitProjectController,
  getSubmissionController,
  getLessonSubmissionsController,
  getAllSubmissionsController,
};
