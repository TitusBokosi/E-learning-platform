const { z } = require("zod");

const createTopicValidator = z.object({
  body: z.object({
    topicName: z.string().min(3).max(50).trim(),
    courseId: z.string().uuid("Invalid courseId"),
    position: z.number().int().optional(),
  }),
});

const getTopicByIdValidator = z.object({
  params: z.object({
    topicId: z.string().uuid("Invalid topicId"),
  }),
});

const updateTopicValidator = z.object({
  params: z.object({
    topicId: z.string().uuid("Invalid topicId"),
  }),
  body: z.object({
    topicName: z.string().min(3).max(50).trim().optional(),
    courseId: z.string().uuid("Invalid courseId").optional(),
    position: z.number().int().optional(),
  }).strict(),
});

const deleteTopicValidator = z.object({
  params: z.object({
    topicId: z.string().uuid("Invalid topicId"),
  }),
});

module.exports = {
  createTopicValidator,
  getTopicByIdValidator,
  updateTopicValidator,
  deleteTopicValidator,
};
