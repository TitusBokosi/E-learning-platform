const { z } = require("zod");


const userIdParamSchema = z.object({
  id: z.string().uuid("Invalid user ID"),
});

const updateUserSchema = z.object({
  username: z
    .string()
    .min(3, "Username must be at least 3 characters")
    .max(50)
    .optional(),

  email: z
    .string()
    .email("Invalid email address")
    .max(255)
    .optional(),
}).refine(
  (data) => Object.keys(data).length > 0,
  { message: "At least one field must be provided" }
);


const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, "Current password is required"),

  newPassword: z
    .string()
    .min(6, "New password must be at least 6 characters")
    .max(255),
});


const updateUserRoleSchema = z.object({
  roleid: z.string().uuid("Invalid role ID"),
});

module.exports = {
  userIdParamSchema,
  updateUserSchema,
  changePasswordSchema,
  updateUserRoleSchema,
};
