const { z } = require("zod");

const EnrollmentStatusEnum = z.enum(["ACTIVE", "COMPLETED", "DROPPED"]);

const createEnrollmentValidator = z.object({
  body: z.object({
    userId: z.string().uuid().optional(),
    courseId: z.string().uuid("Invalid courseId"),
    status: EnrollmentStatusEnum.optional(),
  }),
});

const getEnrollmentByIdValidator = z.object({
  params: z.object({
    enrollmentId: z.string().uuid("Invalid enrollmentId"),
  }),
});

const getEnrollmentsByUserValidator = z.object({
  params: z.object({
    userId: z.string().uuid("Invalid userId").optional(),
  }),
});

const getEnrollmentsByCourseValidator = z.object({
  params: z.object({
    courseId: z.string().uuid("Invalid courseId"),
  }),
});

const updateEnrollmentValidator = z.object({
  params: z.object({
    enrollmentId: z.string().uuid("Invalid enrollmentId"),
  }),
  body: z.object({
    status: EnrollmentStatusEnum.optional(),
  }).strict(),
});

const deleteEnrollmentValidator = z.object({
  params: z.object({
    enrollmentId: z.string().uuid("Invalid enrollmentId"),
  }),
});

module.exports = {
  createEnrollmentValidator,
  getEnrollmentByIdValidator,
  getEnrollmentsByUserValidator,
  getEnrollmentsByCourseValidator,
  updateEnrollmentValidator,
  deleteEnrollmentValidator,
};
