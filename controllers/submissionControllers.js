const { createSubmission, getSubmissionByLessonAndUser } = require('../queries/submissions');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

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

  const submission = await createSubmission({
    lessonId,
    userId,
    projectUrl,
  });

  res.status(201).json({
    status: 'success',
    data: submission,
  });
});

const getSubmissionController = catchAsync(async (req, res, next) => {
    const { lessonId } = req.params;
    const userId = req.user.id;
    
    const submission = await getSubmissionByLessonAndUser(lessonId, userId);
    
    res.status(200).json({
        status: 'success',
        data: submission
    });
});

module.exports = {
  submitProjectController,
  getSubmissionController
};
