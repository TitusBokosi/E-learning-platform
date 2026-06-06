const prisma = require('../config/db');
const catchAsync = require('../utils/catchAsync');

exports.getAdminStats = catchAsync(async (req, res, next) => {
  const [
    totalUsers,
    totalCourses,
    pendingCourses,
    activeEnrollments,
    totalCreators,
    totalCategories,
    totalAnnouncements
  ] = await Promise.all([
    prisma.user.count(),
    prisma.course.count(),
    prisma.course.count({ where: { status: 'PENDING' } }),
    prisma.enrollment.count({ where: { status: 'ACTIVE' } }),
    prisma.user.count({ where: { role: 'CREATOR' } }),
    prisma.category.count(),
    prisma.announcement.count()
  ]);

  res.status(200).json({
    status: 'success',
    data: {
      totalUsers,
      totalCourses,
      pendingCourses,
      activeEnrollments,
      totalCreators,
      totalCategories,
      totalAnnouncements
    }
  });
});

exports.getRecentActivity = catchAsync(async (req, res, next) => {
    // Basic fetch of recent logs if we had them, otherwise just mock for now or fetch recent courses
    const recentCourses = await prisma.course.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        include: { creator: { select: { firstname: true, lastname: true } } }
    });

    res.status(200).json({
        status: 'success',
        data: recentCourses
    });
});
