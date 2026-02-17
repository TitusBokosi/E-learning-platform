require('dotenv').config();

const express = require('express');
const cookieParser = require('cookie-parser');
const passport = require('passport');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const AppError = require('./utils/appError');
const { initializePassport } = require('./config/passport-local');
const morgan = require('morgan');
const userRoute = require('./routes/userRoutes');
const courseRoute = require('./routes/coursesRoutes');
const { errorHandler } = require('./middlewares/errorHandler');
const topicRoute = require('./routes/topicRoutes');
const lessonRoute = require('./routes/lessonRoutes');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

initializePassport(passport);
require('./config/passport-jwt')(passport);

app.use(passport.initialize());

app.use(morgan('dev'));

app.use(
  cors({
    origin: (origin, cb) => cb(null, true),
    credentials: true,
  }),
);

app.use('/auth', authRoutes);
app.use('/users', userRoute);
app.use('/courses', courseRoute);
app.use('/topics', topicRoute);
app.use('/lessons', lessonRoute);

app.all(/.*/, (req, res, next) => {
  next(new AppError(`Route ${req.originalUrl} not found`, 404));
});

app.use(errorHandler);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
