const env = require('./config/env');

const express = require('express');
const cookieParser = require('cookie-parser');
const passport = require('passport');
const cors = require('cors');
const morgan = require('morgan');

const { initializePassport } = require('./config/passport-local');
const initializeGooglePassport = require('./config/passport-google');
const AppError = require('./utils/appError');
const { errorHandler } = require('./middlewares/errorHandler');

// Routes
const authRoutes = require('./routes/authRoutes');
const userRoute = require('./routes/userRoutes');
const courseRoute = require('./routes/coursesRoutes');
const categoryRoute = require('./routes/categoryRoutes');
const projectRoute = require('./routes/projectRoutes');
const enrollmentRoute = require('./routes/enrollmentRoutes');
const lessonProgressRoute = require('./routes/lessonProgressRoutes');
const adminRoute = require('./routes/adminRoutes');
const submissionRoute = require('./routes/submissionRoutes');
const submissionLessonRoute = require('./routes/submissionLessonRoutes');
const feedbackRoute = require('./routes/feedbackRoutes');

const app = express();

// Body parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Passport
initializePassport(passport);
initializeGooglePassport(passport);
require('./config/passport-jwt')(passport);
app.use(passport.initialize());

// Logging
app.use(morgan(env.NODE_ENV === 'production' ? 'combined' : 'dev'));

// CORS
app.use(
  cors({
    origin: env.CORS_ORIGIN || '*',
    credentials: true,
  }),
);

// Mount Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoute);
app.use('/api/courses', courseRoute); // Topics and Lessons are nested under courses
app.use('/api/categories', categoryRoute);
app.use('/api/projects', projectRoute);
app.use('/api/enrollments', enrollmentRoute);
app.use('/api/progress', lessonProgressRoute);
app.use('/api/submissions', submissionRoute);
app.use('/api/lessons', submissionLessonRoute);
app.use('/api/feedback', feedbackRoute);
app.use('/api/admin', adminRoute);

// Debug: list registered routes (helps diagnose missing route matches)
try {
  const listRoutes = () => {
    const routes = [];
    if (app._router && app._router.stack) {
      app._router.stack.forEach((layer) => {
        if (layer.route && layer.route.path) {
          // Direct route
          const methods = Object.keys(layer.route.methods)
            .join(',')
            .toUpperCase();
          routes.push(`${methods} ${layer.route.path}`);
        } else if (layer.name === 'router' && layer.handle && layer.regexp) {
          // Mounted router - try to extract mount path
          const mountPath = layer.regexp.source
            .replace('^\\', '')
            .replace('\\/?(?=\/|$)', '')
            .replace('(?=\/|$)', '')
            .replace('\\/', '/');
          routes.push(`MOUNT ${mountPath}`);
        }
      });
    }
    console.log('Registered routes:', routes);
  };

  listRoutes();
} catch (err) {
  console.log('Route listing failed', err);
}

// 404 catch-all
app.all(/.*/, (req, res, next) => {
  next(new AppError(`Route ${req.originalUrl} not found`, 404));
});

// Global error handler
app.use(errorHandler);

const PORT = env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running in ${env.NODE_ENV} mode on port ${PORT}`);
});
