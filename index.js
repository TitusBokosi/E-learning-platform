require("dotenv").config();

const express = require("express");
const cookieParser = require("cookie-parser");
const passport = require("passport");

const authRoutes = require("./routes/authRoutes");
const AppError = require("./utils/appError");
const {initializePassport} = require ("./config/passport-local");
const morgan = require("morgan");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());


initializePassport(passport);
require("./config/passport-jwt")(passport);


app.use(passport.initialize());

app.use(morgan("dev"));

app.use("/auth", authRoutes);


// app.all("/*", (req, res, next) => {
//   next(new AppError(`Route ${req.originalUrl} not found`, 404));
// });


app.use((err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
  });
});


const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
