const { z } = require('zod');

const LessonTypeEnum = z.enum(['VIDEO', 'TEXT', 'MINI_PROJECT']);

const createLessonValidator = z.object({
  body: z.object({
    lessonName: z.string().min(3).max(50).trim(),
    lessonType: LessonTypeEnum.default('TEXT'),
    content: z.string().optional(),
    videoUrl: z.string().optional(),
    topicId: z.string().uuid('Invalid topicId'),
    position: z.number().int().optional(),
  }),
});

const getLessonByIdValidator = z.object({
  params: z.object({
    lessonId: z.string().uuid('Invalid lessonId'),
  }),
});

const updateLessonValidator = z.object({
  params: z.object({
    lessonId: z.string().uuid('Invalid lessonId'),
  }),
  body: z
    .object({
      lessonName: z.string().min(3).max(50).trim().optional(),
      lessonType: LessonTypeEnum.optional(),
      content: z.string().optional(),
      videoUrl: z.string().optional(),
      topicId: z.string().uuid('Invalid topicId').optional(),
      position: z.number().int().optional(),
    })
    .strict(),
});

const deleteLessonValidator = z.object({
  params: z.object({
    lessonId: z.string().uuid('Invalid lessonId'),
  }),
});

module.exports = {
  createLessonValidator,
  getLessonByIdValidator,
  updateLessonValidator,
  deleteLessonValidator,
};
