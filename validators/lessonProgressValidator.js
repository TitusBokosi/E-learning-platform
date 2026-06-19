const { z } = require("zod");

const createLessonProgressValidator = z.object({
  body: z.object({
    userId: z.string().uuid().optional(),
    lessonId: z.string().uuid("Invalid lessonId"),
  }),
});

const getLessonProgressByIdValidator = z.object({
  params: z.object({
    progressId: z.string().uuid("Invalid progressId"),
  }),
});

const getProgressByUserValidator = z.object({
  params: z.object({
    userId: z.string().uuid("Invalid userId").optional(),
  }),
});

const deleteLessonProgressValidator = z.object({
  params: z.object({
    progressId: z.string().uuid("Invalid progressId"),
  }),
});

module.exports = {
  createLessonProgressValidator,
  getLessonProgressByIdValidator,
  getProgressByUserValidator,
  deleteLessonProgressValidator,
};
