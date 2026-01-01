const express = require("express");
const {validate} = require("../middlewares/validateRequest");
const {registerSchema, loginSchema} = require("../validators/authValidator");

const authRoute = express.Router();
const {registerUser, loginUser, refreshTokenController, updatePasswordController, logOutUserController} = require("../controllers/authControllers");
const {authenticateLocal, authenticateAccessToken, authenticateRefreshToken} = require ("../middlewares/authMiddleware");
const { changePasswordSchema } = require("../validators/userValidator");


authRoute.post("/register", validate(registerSchema), registerUser);
authRoute.post("/login", validate(loginSchema),authenticateLocal, loginUser);
authRoute.post("/refresh" ,authenticateRefreshToken, refreshTokenController);
authRoute.post("/logout", logOutUserController);


module.exports = authRoute;