const express = require("express");
const lessonRoute = require("./lessonRoutes");

const topicRoute = express.Router();
topicRoute.use("/:topicId/lessons", lessonRoute);

module.exports = topicRoute;