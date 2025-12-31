const { z } = require("zod");


const createTopicValidator = z.object({
  topicName: z
    .string()
    .min(3, "Topic name must be at least 3 characters")
    .max(50, "Topic name must not exceed 50 characters")
    .trim(),

  courseId: z
    .string()
    .uuid("Invalid courseId"),
});


const getTopicByIdValidator = z.object({
  topicId: z
    .string()
    .uuid("Invalid topicId"),
});


const updateTopicValidator = z.object({
  topicId: z
    .string()
    .uuid("Invalid topicId"),

  newdata: z.object({
    topicName: z
      .string()
      .min(3, "Topic name must be at least 3 characters")
      .max(50)
      .trim()
      .optional(),

    courseId: z
      .string()
      .uuid("Invalid courseId")
      .optional(),
  }).strict(),
});


const deleteTopicValidator = z.object({
  topicId: z
    .string()
    .uuid("Invalid topicId"),
});

module.exports = {
  createTopicValidator,
  getTopicByIdValidator,
  updateTopicValidator,
  deleteTopicValidator,
};
