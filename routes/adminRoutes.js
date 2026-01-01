const express = require("express");
const { validate } = require("../middlewares/validateRequest");
const { deleteUserValidator } = require("../validators/adminValidator");
const { authenticateAccessToken } = require("../middlewares/authMiddleware");
const { deleteUserController } = require("../controllers/adminController");
const courseRoute = require("./coursesRoutes");
const lessonRoute = require("./lessonRoutes");
const topicRoute = require("./topicRoutes");

const adminRoute = express.Router();

adminRoute.use("/:adminId/courses", authenticateAccessToken, courseRoute)
adminRoute.use("/:adminId/lessons", authenticateAccessToken, lessonRoute )
adminRoute.use("/:adminId/topics", authenticateAccessToken, topicRoute)
adminRoute.patch("/:adminId/updateUser", validate(deleteUserValidator), authenticateAccessToken, deleteUserController);
adminRoute.delete("/:adminId/deleteUser", validate(deleteUserValidator), deleteUserController);


module.exports = adminRoute;