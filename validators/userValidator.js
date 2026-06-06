const { z } = require("zod");

const RoleEnum = z.enum(["USER", "ADMIN"]);

const deleteUserValidator = z.object({
  params: z.object({
    userId: z.string().uuid("Invalid user ID"),
  }),
});

const changeUserRoleValidator = z.object({
  params: z.object({
    userId: z.string().uuid("Invalid user ID"),
  }),
  body: z.object({
    role: RoleEnum,
  }),
});

const updateUserSchema = z.object({
  body: z.object({
    firstname: z.string().min(3).max(10).optional(),
    lastname: z.string().min(3).max(10).optional(),
    email: z.string().email("Invalid email address").max(255).optional(),
  }).refine((data) => Object.keys(data).length > 0, {
    message: "At least one field must be provided",
  })
});

const changePasswordSchema = z.object({
  body: z.object({
    currentPassword: z.string().min(1, "Current password is required"),
    verifiedPassword: z.string().min(1, "Verified password is required"),
    newPassword: z.string().min(6, "New password must be at least 6 characters").max(255),
  }),
});

module.exports = {
  deleteUserValidator,
  changeUserRoleValidator,
  updateUserSchema,
  changePasswordSchema,
};
