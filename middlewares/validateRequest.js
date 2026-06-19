const { ZodError } = require('zod');

exports.validate = (schema) => (req, res, next) => {
  try {
    const validatedData = schema.parse({
      body: req.body,
      query: req.query,
      params: req.params,
    });
    if (typeof validatedData.body !== 'undefined')
      req.body = validatedData.body;
    if (typeof validatedData.query !== 'undefined')
      req.query = validatedData.query;
    if (typeof validatedData.params !== 'undefined')
      req.params = validatedData.params;

    next();
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(400).json({
        status: 'error',
        message: 'Validation failed',
        errors: error.issues.map((issue) => ({
          field: issue.path.join('.'),
          message: issue.message,
        })),
      });
    }

    next(error);
  }
};
