const express = require('express');
const { getAdminStats, getRecentActivity, getAdminAnalytics } = require('../controllers/adminController');
const {
  createAnnouncementController,
  getAllAnnouncementsController,
  updateAnnouncementController,
  deleteAnnouncementController,
  toggleAnnouncementController,
} = require('../controllers/announcementController');
const { toggleFeaturedController, getFeaturedCoursesController } = require('../controllers/featuredController');
const { authenticateAccessToken, authorize, maybeAuthenticate } = require('../middlewares/authMiddleware');

const adminRoute = express.Router();

// Public: get active announcements & featured courses
adminRoute.get('/announcements/public', maybeAuthenticate, getAllAnnouncementsController);
adminRoute.get('/featured-courses', maybeAuthenticate, getFeaturedCoursesController);

// Protected admin routes
adminRoute.use(authenticateAccessToken, authorize('ADMIN', 'SUPER_CREATOR'));

adminRoute.get('/stats', getAdminStats);
adminRoute.get('/activity', getRecentActivity);
adminRoute.get('/analytics', getAdminAnalytics);

// Announcements CRUD
adminRoute.get('/announcements', getAllAnnouncementsController);
adminRoute.post('/announcements', createAnnouncementController);
adminRoute.patch('/announcements/:id', updateAnnouncementController);
adminRoute.patch('/announcements/:id/toggle', toggleAnnouncementController);
adminRoute.delete('/announcements/:id', deleteAnnouncementController);

// Featured content
adminRoute.patch('/courses/:courseId/toggle-featured', toggleFeaturedController);

module.exports = adminRoute;
