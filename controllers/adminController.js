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
    totalAnnouncements,
    totalSubmissions,
  ] = await Promise.all([
    prisma.user.count(),
    prisma.course.count(),
    prisma.course.count({ where: { status: 'PENDING' } }),
    prisma.enrollment.count({ where: { status: 'ACTIVE' } }),
    prisma.user.count({ where: { role: 'CREATOR' } }),
    prisma.category.count(),
    prisma.announcement.count(),
    prisma.submission.count(),
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
      totalAnnouncements,
      totalSubmissions,
    }
  });
});

exports.getRecentActivity = catchAsync(async (req, res, next) => {
    const activity = await prisma.activityLog.findMany({
        take: 10,
        orderBy: { createdAt: 'desc' },
    });

    res.status(200).json({
        status: 'success',
        data: activity
    });
});

exports.getAdminAnalytics = catchAsync(async (req, res, next) => {
    const since = new Date();
    since.setDate(since.getDate() - 29);
    since.setHours(0, 0, 0, 0);

    const [enrollments, topCreators] = await Promise.all([
        prisma.enrollment.findMany({
            where: { enrolledAt: { gte: since } },
            select: { enrolledAt: true },
            orderBy: { enrolledAt: 'asc' },
        }),
        prisma.user.findMany({
            where: { role: { in: ['CREATOR', 'SUPER_CREATOR'] } },
            select: {
                id: true,
                firstname: true,
                lastname: true,
                _count: { select: { createdCourses: true } },
            },
            orderBy: { createdCourses: { _count: 'desc' } },
            take: 5,
        }),
    ]);

    const trendMap = new Map();
    for (let i = 0; i < 30; i += 1) {
        const day = new Date(since);
        day.setDate(since.getDate() + i);
        trendMap.set(day.toISOString().slice(0, 10), 0);
    }

    enrollments.forEach((enrollment) => {
        const key = enrollment.enrolledAt.toISOString().slice(0, 10);
        trendMap.set(key, (trendMap.get(key) || 0) + 1);
    });

    res.status(200).json({
        status: 'success',
        data: {
            enrollmentTrends: Array.from(trendMap.entries()).map(([date, count]) => ({ date, count })),
            topCreators: topCreators.map((creator) => ({
                id: creator.id,
                name: `${creator.firstname} ${creator.lastname}`,
                courseCount: creator._count.createdCourses,
            })),
        },
    });
});
