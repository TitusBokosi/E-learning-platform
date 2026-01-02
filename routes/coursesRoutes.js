const express = require("express");
const topicRoute = require("./topicRoutes");

const courseRoute = express.Router();

courseRoute.use("/:courseId/topics", topicRoute);


module.exports = courseRoute;