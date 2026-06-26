const {
  createLesson,
  getAllLessonsForTopic,
  getLessonById,
  updateLesson,
  deleteLesson,
  getAllLessons,
} = require('../queries/lessons');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

const createLessonController = catchAsync(async (req, res, next) => {
  const { topicId } = req.params;
  const status = (req.user.role === 'ADMIN' || req.user.role === 'SUPER_CREATOR') ? 'APPROVED' : 'PENDING';
  
  const data = { ...req.body, topicId };
  const newLesson = await createLesson(data, status);
  res.status(201).json({ status: 'success', data: newLesson });
});

const getAllLessonsController = catchAsync(async (req, res, next) => {
  const filter = {};
  if (!req.user || req.user.role === 'STUDENT') {
    filter.status = 'APPROVED';
  }
  const lessons = await getAllLessons(filter);
  res.status(200).json({ status: 'success', data: lessons });
});

const getAllLessonsForTopicController = catchAsync(async (req, res, next) => {
  const { topicId } = req.params;
  const filter = {};
  if (!req.user || req.user.role === 'STUDENT') {
    filter.status = 'APPROVED';
  }
  const lessons = await getAllLessonsForTopic(topicId, filter);
  res.status(200).json({ status: 'success', data: lessons });
});

const getLessonByIdController = catchAsync(async (req, res, next) => {
  const { lessonId } = req.params;
  const filter = {};
  if (!req.user || req.user.role === 'STUDENT') {
    filter.status = 'APPROVED';
  }
  const lesson = await getLessonById(lessonId, filter);

  if (!lesson) {
    return next(new AppError('Lesson not found or unauthorized', 404));
  }

  // Navigation logic: find prev and next lessons in the same topic
  const prisma = require('../config/db');
  const allLessons = await prisma.lesson.findMany({
    where: { topicid: lesson.topicid, ...filter },
    orderBy: { position: 'asc' },
    select: { id: true }
  });

  const currentIndex = allLessons.findIndex(l => l.id === lesson.id);
  const prevLessonId = currentIndex > 0 ? allLessons[currentIndex - 1].id : null;
  const nextLessonId = currentIndex < allLessons.length - 1 ? allLessons[currentIndex + 1].id : null;

  res.status(200).json({
    status: 'success',
    data: {
      ...lesson,
      prevLessonId,
      nextLessonId
    },
  });
});

const updateLessonController = catchAsync(async (req, res, next) => {
  const { lessonId } = req.params;
  const lesson = await getLessonById(lessonId);
  if (!lesson) return next(new AppError('Lesson not found', 404));

  // Ownership check
  if (req.user.role === 'CREATOR') {
    const prisma = require('../config/db');
    const topic = await prisma.topic.findUnique({ where: { id: lesson.topicid } });
    const course = await prisma.course.findUnique({ where: { id: topic.courseid } });
    if (course.creatorId !== req.user.id) {
       return next(new AppError('You can only update lessons in your own courses', 403));
    }
  }

  const updateData = { ...req.body };
  if (req.user.role === 'CREATOR' && lesson.status !== 'APPROVED') {
    // updateData.status = 'PENDING'; // Removed automatic pending
  }
  const updatedLesson = await updateLesson(lessonId, updateData);
  res.status(200).json({ status: 'success', data: updatedLesson });
});

const deleteLessonController = catchAsync(async (req, res, next) => {
  const { lessonId } = req.params;
  const lesson = await getLessonById(lessonId);
  if (!lesson) return next(new AppError('Lesson not found', 404));

  if (req.user.role === 'CREATOR') {
    const prisma = require('../config/db');
    const topic = await prisma.topic.findUnique({ where: { id: lesson.topicid } });
    const course = await prisma.course.findUnique({ where: { id: topic.courseid } });
    if (course.creatorId !== req.user.id) {
       return next(new AppError('You can only delete lessons in your own courses', 403));
    }
  }

  await deleteLesson(lessonId);
  res.status(204).send();
});

const approveLessonController = catchAsync(async (req, res, next) => {
    const { lessonId } = req.params;
    const lesson = await getLessonById(lessonId);
    if (!lesson) return next(new AppError('Lesson not found', 404));

    if (lesson.status === 'PENDING_DELETE') {
        await deleteLesson(lessonId);
        return res.status(200).json({ status: 'success', message: 'Lesson deleted' });
    }

    const updated = await updateLesson(lessonId, { status: 'APPROVED' });
    res.status(200).json({ status: 'success', data: updated });
});

const rejectLessonController = catchAsync(async (req, res, next) => {
    const { lessonId } = req.params;
    const { feedback } = req.body;
    
    if (!feedback) {
        return next(new AppError('Please provide a reason for rejection', 400));
    }

    const updated = await updateLesson(lessonId, { 
        status: 'REJECTED',
        feedback: feedback
    });

    res.status(200).json({ status: 'success', data: updated });
});

module.exports = {
  createLessonController,
  getAllLessonsController,
  getLessonByIdController,
  updateLessonController,
  deleteLessonController,
  getAllLessonsForTopicController,
  approveLessonController,
  rejectLessonController
};
