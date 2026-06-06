const { createUser, getUserByEmail, updateUser } = require('../queries/users');
const AppError = require('../utils/appError');
const { hashPassword, comparePassword } = require('../utils/password');
const authService = require("../services/auth-service");
const catchAsync = require('../utils/catchAsync');

exports.registerUser = catchAsync(async (req, res, next) => {
  const { firstname, lastname, email, password } = req.body;

  const existingUser = await getUserByEmail(email);

  if (existingUser) {
    return res.status(400).json({
      status: "fail",
      message: "User already exists"
    });
  }

  const hashedPassword = await hashPassword(password);
  
  const newUser = await createUser({ firstname, lastname, email, password: hashedPassword });

  if (!newUser) {
    return next(new AppError("failed to create user", 500));
  }
  
  return res.status(201).json({
    status: "success",
    data: newUser,
  });
});

exports.loginUser = catchAsync(async (req, res, next) => {
  const { accessToken, refreshToken, user } = authService.login(req.user); 
  
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    sameSite: "Strict",
  });

  return res.status(200).json({
    status: "success",
    data: {
      accessToken,
      user
    }
  });
});

exports.updatePasswordController = catchAsync(async (req, res, next) => {
  const { currentPassword, verifiedPassword, newPassword } = req.body || {};

  if (!currentPassword || !newPassword || !verifiedPassword) {
    return next(new AppError("Please provide current, new, and verified passwords", 400));
  }

  if (newPassword !== verifiedPassword) {
    return next(new AppError("New passwords do not match", 400));
  }

  const userEmail = req.user.email;
  const user = await getUserByEmail(userEmail);
  
  if (!user) {
    return next(new AppError("User not found", 404));
  }

  const isMatch = await comparePassword(currentPassword, user.password);

  if (!isMatch) {
    return next(new AppError("Incorrect current password", 400));
  }

  const hashedPassword = await hashPassword(newPassword);

  await updateUser(req.user.id, { password: hashedPassword });

  return res.status(200).json({
    status: "Success",
    message: "Password updated successfully",
  });
});

exports.refreshTokenController = catchAsync(async (req, res, next) => {
  const { accessToken, refreshToken } = authService.login(req.user);

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    sameSite: "Strict",
  });

  return res.status(200).json({
    status: "Success",
    data: {
      accessToken
    }
  });
});

exports.logOutUserController = catchAsync(async (req, res, next) => {
  res.clearCookie("refreshToken", {
    httpOnly: true,
    sameSite: "Strict"
  });

  return res.status(200).json({
    status: "Success",
    message: "Logout successful"
  });
});
