const { z } = require('zod');

const feedbackValidator = z.object({
  body: z.object({
    name: z.string().min(2, "Name is too short"),
    email: z.string().email("Invalid email address"),
    subject: z.string().min(3, "Subject is too short"),
    message: z.string().min(10, "Message is too short"),
  }),
});

module.exports = { feedbackValidator };
