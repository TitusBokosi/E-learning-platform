const express = require("express");
const {validate} =require("../middlewares/validateRequest");
const { createTopicValidator, getTopicByIdValidator, updateTopicValidator, deleteTopicValidator} = require("../validators/topicValidator");
const {createTopicController, getTopicByIdController, getAllTopicsController, updateTopicController, deleteTopicController}= require("../controllers/topicController");
const lessonRoute = require("./lessonRoutes");

const topicRoute = express.Router();
topicRoute.use("/:topicId/lessons", lessonRoute);
topicRoute.get("/", getAllTopicsController);
topicRoute.post("/", validate(createTopicValidator), createTopicController);
topicRoute.get("/:topicId", validate(getTopicByIdValidator), getTopicByIdController);
topicRoute.patch("/:topicId", validate(updateTopicValidator), updateTopicController);
topicRoute.delete("/:topicId", validate(deleteTopicValidator), deleteTopicController);


module.exports = topicRoute;