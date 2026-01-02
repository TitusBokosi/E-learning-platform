const express = require("express");
const { validate } = require("../middlewares/validateRequest");
const { deleteUserValidator } = require("../validators/adminValidator");
const { authenticateAccessToken } = require("../middlewares/authMiddleware");
const { deleteUserController } = require("../controllers/adminController");
const courseRoute = require("./coursesRoutes");
const lessonRoute = require("./lessonRoutes");
const topicRoute = require("./topicRoutes");

const adminRoute = express.Router();

adminRoute.use("/:adminname/courses", authenticateAccessToken, courseRoute)
adminRoute.use("/:adminname/lessons", authenticateAccessToken, lessonRoute )
adminRoute.use("/:adminname/topics", authenticateAccessToken, topicRoute)
adminRoute.patch("/:adminname/updateUser/:userId", validate(deleteUserValidator), authenticateAccessToken, deleteUserController);
adminRoute.delete("/:adminname/deleteUser/:userId", validate(deleteUserValidator), deleteUserController);


module.exports = adminRoute;