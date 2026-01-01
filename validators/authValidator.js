const { z } = require("zod");


const email = z
  .string()
  .email("Invalid email address")
  .max(255);

const password = z
  .string()
  .min(6, "Password must be at least 6 characters")
  .max(255);


const registerSchema = z.object({
  name: z
    .string()
    .min(3, "Username must be at least 3 characters")
    .max(50),

  email,
  password,
});


const loginSchema = z.object({
  email,
  password: z.string().min(6, "Password must be at least 6 characters"),
});

module.exports = {
  registerSchema,
  loginSchema,
};
