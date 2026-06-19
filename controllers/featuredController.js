const prisma = require('../config/db');
const catchAsync = require('../utils/catchAsync');

exports.toggleFeaturedController = catchAsync(async (req, res) => {
  const { courseId } = req.params;
  const course = await prisma.course.findUnique({ where: { id: courseId } });
  if (!course) {
    return res.status(404).json({ status: 'fail', message: 'Course not found' });
  }

  // Only allow featuring if the course is already APPROVED
  if (course.status !== 'APPROVED' && !course.isFeatured) {
      return res.status(400).json({ status: 'fail', message: 'Only approved courses can be featured' });
  }

  const updated = await prisma.course.update({
    where: { id: courseId },
    data: { isFeatured: !course.isFeatured },
  });
  res.status(200).json({ status: 'success', data: updated });
});

exports.getFeaturedCoursesController = catchAsync(async (req, res) => {
  const courses = await prisma.course.findMany({
    where: { isFeatured: true, status: 'APPROVED' },
    include: { category: true },
  });
  res.status(200).json({ status: 'success', data: courses });
});
