const { z } = require("zod");

const createCourseValidator = z.object({
  body: z.object({
    courseName: z.string().min(3, "Course name must be at least 3 characters").max(50).trim(),
    description: z.string().min(10, "Description must be at least 10 characters").max(500).trim(),
    imageUrl: z.string().optional(),
    categoryId: z.string().uuid("Invalid categoryId").optional(),
  }),
});

const getCourseByIdValidator = z.object({
  params: z.object({
    courseId: z.string().uuid("Invalid courseId"),
  }),
});

const updateCourseValidator = z.object({
  params: z.object({
    courseId: z.string().uuid("Invalid courseId"),
  }),
  body: z.object({
    courseName: z.string().min(3).max(50).trim().optional(),
    description: z.string().min(10).max(500).trim().optional(),
    imageUrl: z.string().optional(),
    categoryId: z.string().uuid("Invalid categoryId").optional(),
  }).strict(),
});

const deleteCourseValidator = z.object({
  params: z.object({
    courseId: z.string().uuid("Invalid courseId"),
  }),
});

module.exports = {
  createCourseValidator,
  getCourseByIdValidator,
  updateCourseValidator,
  deleteCourseValidator,
};
