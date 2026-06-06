const {
  createCourse,
  getAllCourses,
  getCourseById,
  updateCourse,
  deleteCourse,
} = require('../queries/courses');

const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

const createCourseController = catchAsync(async (req, res, next) => {
  const status = (req.user.role === 'ADMIN' || req.user.role === 'SUPER_CREATOR') ? 'APPROVED' : 'PENDING';
  const newCourse = await createCourse(req.body, req.user.id, status);

  return res.status(201).json({
    status: 'success',
    data: newCourse,
  });
});

const getAllCoursesController = catchAsync(async (req, res, next) => {
  const limit = parseInt(req.query.limit) || 10;
  const skip = parseInt(req.query.skip) || 0;
  
  const filter = {};
  // If user is a student (or not logged in), only show approved courses
  if (!req.user || req.user.role === 'STUDENT') {
    filter.status = 'APPROVED';
  } else if (req.user.role === 'CREATOR') {
    if (req.query.onlyMine === 'true') {
      filter.creatorId = req.user.id;
    } else {
      // Creators see their own courses AND approved ones
      filter.OR = [
        { status: 'APPROVED' },
        { creatorId: req.user.id }
      ];
    }
  }

  const { courses, total } = await getAllCourses(limit, skip, filter);
  const page = Math.floor(skip / limit) + 1;

  return res.status(200).json({
    status: 'success',
    results: courses.length,
    metadata: {
      total,
      limit,
      skip,
      page,
      totalPages: Math.ceil(total / limit),
    },
    data: courses,
  });
});

/**
 * GET COURSE BY ID
 */
const getCourseByIdController = catchAsync(async (req, res, next) => {
  const { courseId } = req.params;
  const filter = {};
  if (!req.user || req.user.role === 'STUDENT') {
    filter.status = 'APPROVED';
  }

  const course = await getCourseById(courseId, filter);

  if (!course) {
    return next(new AppError('Course not found or unauthorized', 404));
  }

  return res.status(200).json({
    status: 'success',
    data: course,
  });
});

/**
 * UPDATE COURSE
 */
const updateCourseController = catchAsync(async (req, res, next) => {
  const { courseId } = req.params;
  const course = await getCourseById(courseId);

  if (!course) {
    return next(new AppError('Course not found', 404));
  }

  // Check if Creator is updating their own course
  if (req.user.role === 'CREATOR' && course.creatorId !== req.user.id) {
    return next(new AppError('You can only update your own courses', 403));
  }

  // If Creator updates, don't change status if it's already APPROVED
  // but if it's REJECTED or PENDING, keep it there until they 'submit for review'
  const updateData = { ...req.body };
  if (req.user.role === 'CREATOR' && course.status !== 'APPROVED') {
    // Optionally we could have a manual 'submit' button, 
    // but the user said 'an update to an approved course... does not change its status'
    // so we only avoid changing it if it's already approved.
  }

  const updatedCourse = await updateCourse(courseId, updateData);

  return res.status(200).json({
    status: 'success',
    data: updatedCourse,
  });
});

/**
 * DELETE COURSE
 */
const deleteCourseController = catchAsync(async (req, res, next) => {
  const { courseId } = req.params;
  const course = await getCourseById(courseId);

  if (!course) {
    return next(new AppError('Course not found', 404));
  }

  // Creator needs approval to delete
  if (req.user.role === 'CREATOR') {
    if (course.creatorId !== req.user.id) {
      return next(new AppError('You can only delete your own courses', 403));
    }
    // Mark for deletion instead of deleting immediately
    const updated = await updateCourse(courseId, { status: 'PENDING_DELETE' });
    return res.status(200).json({
      status: 'success',
      message: 'Deletion request sent for approval',
      data: updated
    });
  }

  await deleteCourse(courseId);

  return res.status(204).json({
    status: 'success',
    data: null,
  });
});

const approveCourseController = catchAsync(async (req, res, next) => {
    const { courseId } = req.params;
    const course = await getCourseById(courseId);

    if (!course) {
        return next(new AppError('Course not found', 404));
    }

    if (course.status === 'PENDING_DELETE') {
        await deleteCourse(courseId);
        return res.status(200).json({
            status: 'success',
            message: 'Course deleted successfully (Approved deletion)',
        });
    }

    const updatedCourse = await updateCourse(courseId, { status: 'APPROVED' });
    res.status(200).json({
        status: 'success',
        data: updatedCourse
    });
});

const rejectCourseController = catchAsync(async (req, res, next) => {
    const { courseId } = req.params;
    const { feedback } = req.body;
    
    if (!feedback) {
        return next(new AppError('Please provide a reason for rejection', 400));
    }

    const updatedCourse = await updateCourse(courseId, { 
        status: 'REJECTED',
        feedback: feedback
    });

    res.status(200).json({
        status: 'success',
        data: updatedCourse
    });
});

module.exports = {
  createCourseController,
  getAllCoursesController,
  getCourseByIdController,
  updateCourseController,
  deleteCourseController,
  approveCourseController,
  rejectCourseController
};
