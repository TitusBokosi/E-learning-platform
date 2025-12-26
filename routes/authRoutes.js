const express = require("express");

const authRoute = express.Router();
const {registerUser, loginUser, refreshTokenController, updatePasswordController, logOutUserController} = require("../controllers/authControllers");
const {authenticateLocal, authenticateAccessToken, authenticateRefreshToken} = require ("../middlewares/authMiddleware");
authRoute.post("/register", registerUser);
authRoute.post("/login", authenticateLocal, loginUser);
authRoute.post("/refresh" ,authenticateRefreshToken, refreshTokenController);
authRoute.post("/logout", logOutUserController);
authRoute.patch("/password", authenticateAccessToken, updatePasswordController);

module.exports = authRoute;