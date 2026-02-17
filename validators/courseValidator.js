const { z } = require('zod');

const createCourseValidator = z.object({
  courseName: z
    .string()
    .min(3, 'Course name must be at least 3 characters')
    .max(50, 'Course name must not exceed 50 characters')
    .trim(),
  description: z
    .string()
    .min(10, 'Description must be at least 10 characters')
    .max(500, 'Description must not exceed 500 characters')
    .trim(),
  imageUrl: z.string().optional(),
});

const getCourseByIdValidator = z.object({
  courseId: z.string().uuid('Invalid courseId'),
});

const updateCourseValidator = z.object({
  courseId: z.string().uuid('Invalid courseId'),

  newdata: z
    .object({
      courseName: z
        .string()
        .min(3, 'Course name must be at least 3 characters')
        .max(50)
        .trim()
        .optional(),

      categoryId: z.string().uuid('Invalid categoryId').optional(),
    })
    .strict(),
});

const deleteCourseValidator = z.object({
  courseId: z.string().uuid('Invalid courseId'),
});

module.exports = {
  createCourseValidator,
  getCourseByIdValidator,
  updateCourseValidator,
  deleteCourseValidator,
};
