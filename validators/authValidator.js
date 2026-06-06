const { z } = require("zod");

const email = z.string().email("Invalid email address").max(255);
const password = z.string().min(6, "Password must be at least 6 characters").max(255);

const registerSchema = z.object({
  body: z.object({
    firstname: z.string().min(3, "Firstname must be at least 3 characters").max(10, "Firstname must be at most 10 characters"),
    lastname: z.string().min(3, "Lastname must be at least 3 characters").max(10, "Lastname must be at most 10 characters"),
    email,
    password,
  }),
});

const loginSchema = z.object({
  body: z.object({
    email,
    password: z.string().min(6, "Password must be at least 6 characters"),
  }),
});

module.exports = {
  registerSchema,
  loginSchema,
};
