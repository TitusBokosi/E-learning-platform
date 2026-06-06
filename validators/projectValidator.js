const { z } = require("zod");

const createProjectValidator = z.object({
  body: z.object({
    title: z.string().min(3).max(100).trim(),
    description: z.string().min(10).max(1000).trim(),
    rubric: z.string().optional(),
    courseId: z.string().uuid("Invalid courseId"),
  }),
});

const getProjectByIdValidator = z.object({
  params: z.object({
    projectId: z.string().uuid("Invalid projectId"),
  }),
});

const getProjectByCourseIdValidator = z.object({
  params: z.object({
    courseId: z.string().uuid("Invalid courseId"),
  }),
});

const updateProjectValidator = z.object({
  params: z.object({
    projectId: z.string().uuid("Invalid projectId"),
  }),
  body: z.object({
    title: z.string().min(3).max(100).trim().optional(),
    description: z.string().min(10).max(1000).trim().optional(),
    rubric: z.string().optional(),
    courseId: z.string().uuid().optional(),
  }).strict(),
});

const deleteProjectValidator = z.object({
  params: z.object({
    projectId: z.string().uuid("Invalid projectId"),
  }),
});

module.exports = {
  createProjectValidator,
  getProjectByIdValidator,
  getProjectByCourseIdValidator,
  updateProjectValidator,
  deleteProjectValidator,
};
