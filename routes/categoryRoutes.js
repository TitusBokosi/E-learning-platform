const express = require('express');
const {
  createCategoryController,
  getAllCategoriesController,
  getCategoryByIdController,
  updateCategoryController,
  deleteCategoryController,
} = require('../controllers/categoryController');
const { authenticateAccessToken, authorize, maybeAuthenticate } = require('../middlewares/authMiddleware');

const categoryRoute = express.Router();

// Publicly viewable categories
categoryRoute.get('/', maybeAuthenticate, getAllCategoriesController);
categoryRoute.get('/:id', maybeAuthenticate, getCategoryByIdController);

// Admin only management
categoryRoute.post('/', authenticateAccessToken, authorize('ADMIN'), createCategoryController);
categoryRoute.patch('/:id', authenticateAccessToken, authorize('ADMIN'), updateCategoryController);
categoryRoute.delete('/:id', authenticateAccessToken, authorize('ADMIN'), deleteCategoryController);

module.exports = categoryRoute;
