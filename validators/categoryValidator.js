const { z } = require("zod");

const createCategoryValidator = z.object({
  body: z.object({
    categoryName: z.string().min(2, "Category name must be at least 2 characters").max(50).trim(),
  }),
});

const getCategoryByIdValidator = z.object({
  params: z.object({
    categoryId: z.string().uuid("Invalid categoryId"),
  }),
});

const updateCategoryValidator = z.object({
  params: z.object({
    categoryId: z.string().uuid("Invalid categoryId"),
  }),
  body: z.object({
    categoryName: z.string().min(2).max(50).trim().optional(),
  }).strict(),
});

const deleteCategoryValidator = z.object({
  params: z.object({
    categoryId: z.string().uuid("Invalid categoryId"),
  }),
});

module.exports = {
  createCategoryValidator,
  getCategoryByIdValidator,
  updateCategoryValidator,
  deleteCategoryValidator,
};
