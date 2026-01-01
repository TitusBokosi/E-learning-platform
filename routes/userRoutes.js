const express = require("express");
const { validate } = require("../middlewares/validateRequest");
const { userIdParamSchema, changePasswordSchema } = require("../validators/userValidator");
const { authenticateAccessToken } = require("../middlewares/authMiddleware");
const { getUserByIdController, updateUserController, deleteUserController} = require("../controllers/userControllers");
const adminRoute = require("./adminRoutes");



const userRoute = express.Router();
userRoutes.use("/admin", adminRoute);
userRoute.get("/:userId", validate(userIdParamSchema), authenticateAccessToken, getUserByIdController);
userRoute.patch("/:userId", validate(userIdParamSchema), validate(userUpdateSchema), authenticateAccessToken, updateUserController);
userRoute.delete("/:userId", authenticateAccessToken, deleteUserController);
userRoute.patch("/:userId/password", validate(changePasswordSchema), authenticateAccessToken, updateUserController)

module.exports = userRoute;