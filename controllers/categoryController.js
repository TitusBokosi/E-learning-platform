const {
  createCategory,
  getAllCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
} = require('../queries/categories');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

exports.createCategoryController = catchAsync(async (req, res, next) => {
  const newCategory = await createCategory(req.body);
  res.status(201).json({ status: 'success', data: newCategory });
});

exports.getAllCategoriesController = catchAsync(async (req, res, next) => {
  const categories = await getAllCategories();
  res.status(200).json({ status: 'success', results: categories.length, data: categories });
});

exports.getCategoryByIdController = catchAsync(async (req, res, next) => {
  const category = await getCategoryById(req.params.id);
  if (!category) return next(new AppError('Category not found', 404));
  res.status(200).json({ status: 'success', data: category });
});

exports.updateCategoryController = catchAsync(async (req, res, next) => {
  const updated = await updateCategory(req.params.id, req.body);
  res.status(200).json({ status: 'success', data: updated });
});

exports.deleteCategoryController = catchAsync(async (req, res, next) => {
  await deleteCategory(req.params.id);
  res.status(204).json({ status: 'success', data: null });
});
