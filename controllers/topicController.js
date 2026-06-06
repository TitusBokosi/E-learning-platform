const {
  createTopic,
  getTopicById,
  getAllTopicsForCourse,
  updateTopic,
  deleteTopic,
  getAllTopics,
} = require('../queries/topics');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

const createTopicController = catchAsync(async (req, res, next) => {
  const courseId = req.params.courseId || req.body.courseId;
  const status = (req.user.role === 'ADMIN' || req.user.role === 'SUPER_CREATOR') ? 'APPROVED' : 'PENDING';
  
  const data = { ...req.body, courseId };
  const newTopic = await createTopic(data, status);

  res.status(201).json({
    status: 'success',
    data: newTopic,
  });
});

const getTopicByIdController = catchAsync(async (req, res, next) => {
  const { topicId } = req.params;
  const filter = {};
  if (!req.user || req.user.role === 'STUDENT') {
    filter.status = 'APPROVED';
  }
  const topic = await getTopicById(topicId, filter);

  if (!topic) {
    return next(new AppError('Topic not found or unauthorized', 404));
  }

  res.status(200).json({
    status: 'success',
    data: topic,
  });
});

const getAllTopicsController = catchAsync(async (req, res, next) => {
  const filter = {};
  if (!req.user || req.user.role === 'STUDENT') {
    filter.status = 'APPROVED';
  }
  const topics = await getAllTopics(filter);

  res.status(200).json({
    status: 'success',
    results: topics.length,
    data: topics,
  });
});

const getAllTopicsForCourseController = catchAsync(async (req, res, next) => {
  const { courseId } = req.params;
  const filter = {};
  if (!req.user || req.user.role === 'STUDENT') {
    filter.status = 'APPROVED';
  }
  const topics = await getAllTopicsForCourse(courseId, filter);

  res.status(200).json({
    status: 'success',
    results: topics.length,
    data: topics,
  });
});

const updateTopicController = catchAsync(async (req, res, next) => {
  const { topicId } = req.params;
  const topic = await getTopicById(topicId);
  if (!topic) return next(new AppError('Topic not found', 404));

  // Ownership check
  if (req.user.role === 'CREATOR') {
    const prisma = require('../config/db');
    const course = await prisma.course.findUnique({ where: { id: topic.courseid } });
    if (course.creatorId !== req.user.id) {
       return next(new AppError('You can only update topics in your own courses', 403));
    }
  }

  const updateData = { ...req.body };
  if (req.user.role === 'CREATOR' && topic.status !== 'APPROVED') {
    // updateData.status = 'PENDING'; // Removed automatic pending
  }
  const updatedTopic = await updateTopic(topicId, updateData);

  res.status(200).json({
    status: 'success',
    data: updatedTopic,
  });
});

const deleteTopicController = catchAsync(async (req, res, next) => {
  const { topicId } = req.params;
  const topic = await getTopicById(topicId);
  if (!topic) return next(new AppError('Topic not found', 404));

  if (req.user.role === 'CREATOR') {
    const prisma = require('../config/db');
    const course = await prisma.course.findUnique({ where: { id: topic.courseid } });
    if (course.creatorId !== req.user.id) {
       return next(new AppError('You can only delete topics in your own courses', 403));
    }
    
    const updated = await updateTopic(topicId, { status: 'PENDING_DELETE' });
    return res.status(200).json({
        status: 'success',
        message: 'Topic deletion request sent for approval',
        data: updated
    });
  }
  await deleteTopic(topicId);

  res.status(204).json({
    status: 'success',
    data: null,
  });
});

const approveTopicController = catchAsync(async (req, res, next) => {
    const { topicId } = req.params;
    const topic = await getTopicById(topicId);
    if (!topic) return next(new AppError('Topic not found', 404));

    if (topic.status === 'PENDING_DELETE') {
        await deleteTopic(topicId);
        return res.status(200).json({ status: 'success', message: 'Topic deleted' });
    }

    const updated = await updateTopic(topicId, { status: 'APPROVED' });
    res.status(200).json({ status: 'success', data: updated });
});

const rejectTopicController = catchAsync(async (req, res, next) => {
    const { topicId } = req.params;
    const { feedback } = req.body;
    
    if (!feedback) {
        return next(new AppError('Please provide a reason for rejection', 400));
    }

    const updated = await updateTopic(topicId, { 
        status: 'REJECTED',
        feedback: feedback
    });

    res.status(200).json({ status: 'success', data: updated });
});

module.exports = {
  createTopicController,
  getTopicByIdController,
  getAllTopicsController,
  updateTopicController,
  deleteTopicController,
  getAllTopicsForCourseController,
  approveTopicController,
  rejectTopicController
};
