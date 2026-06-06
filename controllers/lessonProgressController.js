const {
  createLessonProgress,
  getLessonProgressById,
  getProgressByUser,
  getProgressByUserAndLesson,
  deleteLessonProgress,
} = require('../queries/lessonProgress');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

const createLessonProgressController = catchAsync(async (req, res, next) => {
  const data = {
    userId: req.body.userId || (req.user ? req.user.id : null),
    lessonId: req.body.lessonId,
  };

  // Check if it already exists
  const existing = await getProgressByUserAndLesson(data.userId, data.lessonId);
  if (existing) {
    return res.status(200).json({
      status: 'success',
      message: 'Lesson already completed',
      data: existing,
    });
  }

  const progress = await createLessonProgress(data);

  res.status(201).json({
    status: 'success',
    data: progress,
  });
});

const getLessonProgressByIdController = catchAsync(async (req, res, next) => {
  const { progressId } = req.params;
  const progress = await getLessonProgressById(progressId);

  if (!progress) {
    return next(new AppError('Progress not found', 404));
  }

  res.status(200).json({
    status: 'success',
    data: progress,
  });
});

const getProgressByUserController = catchAsync(async (req, res, next) => {
  const userId = req.params.userId || (req.user ? req.user.id : null);
  const progress = await getProgressByUser(userId);

  res.status(200).json({
    status: 'success',
    results: progress.length,
    data: progress,
  });
});

const deleteLessonProgressController = catchAsync(async (req, res, next) => {
  const { progressId } = req.params;
  await deleteLessonProgress(progressId);

  res.status(204).json({
    status: 'success',
    data: null,
  });
});

module.exports = {
  createLessonProgressController,
  getLessonProgressByIdController,
  getProgressByUserController,
  deleteLessonProgressController,
};
