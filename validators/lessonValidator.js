const { z } = require("zod");

const createLessonValidator = z.object({
  lessonName: z
    .string()
    .min(3, "Lesson name must be at least 3 characters")
    .max(50, "Lesson name must not exceed 50 characters")
    .trim(),

  topicId: z
    .string()
    .uuid("Invalid topicId"),
});


const getLessonByIdValidator = z.object({
  lessonId: z
    .string()
    .uuid("Invalid lessonId"),
});


const updateLessonValidator = z.object({
  lessonId: z
    .string()
    .uuid("Invalid lessonId"),

  newdata: z.object({
    lessonName: z
      .string()
      .min(3, "Lesson name must be at least 3 characters")
      .max(50)
      .trim()
      .optional(),

    topicId: z
      .string()
      .uuid("Invalid topicId")
      .optional(),
  }).strict(),
});


const deleteLessonValidator = z.object({
  lessonId: z
    .string()
    .uuid("Invalid lessonId"),
});

module.exports = {
  createLessonValidator,
  getLessonByIdValidator,
  updateLessonValidator,
  deleteLessonValidator,
};
