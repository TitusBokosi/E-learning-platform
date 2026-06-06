const express = require("express");
const { validate } = require("../middlewares/validateRequest");
const { registerSchema, loginSchema } = require("../validators/authValidator");
const { changePasswordSchema } = require("../validators/userValidator");
const {
  registerUser,
  loginUser,
  refreshTokenController,
  updatePasswordController,
  logOutUserController,
} = require("../controllers/authControllers");
const {
  authenticateLocal,
  authenticateAccessToken,
  authenticateRefreshToken,
} = require("../middlewares/authMiddleware");

const authRoute = express.Router();

authRoute.post("/signup", validate(registerSchema), registerUser);
authRoute.post("/login", validate(loginSchema), authenticateLocal, loginUser);
authRoute.post("/refresh", authenticateRefreshToken, refreshTokenController);
authRoute.post("/logout", authenticateAccessToken, logOutUserController);
authRoute.patch(
  "/password",
  authenticateAccessToken,
  validate(changePasswordSchema),
  updatePasswordController
);

module.exports = authRoute;