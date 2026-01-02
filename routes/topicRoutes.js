const express = require("express");
const {validate} =require("../middlewares/validateRequest");
const { createTopicValidator, getTopicByIdValidator, updateTopicValidator, deleteTopicValidator} = require("../validators/topicValidator");
const {createTopicController, getTopicByIdController, getAllTopicsController, updateTopicController, deleteTopicController}= require("../controllers/topicController")
const topicRoute = express.Router();

topicRoute.get("/topics", getAllTopicsController);
topicRoute.post("/createtopic", validate(createTopicValidator), createTopicController);
topicRoute.get("/topicid", validate(getTopicByIdValidator), getTopicByIdController);
topicRoute.patch("/updatetopic", validate(updateTopicValidator), updateTopicController);
topicRoute.delete("/deletetopic", validate(deleteTopicValidator), deleteTopicController)

const lessonRoute = require("./lessonRoutes");

const topicRoute = express.Router();
topicRoute.use("/:topicId/lessons", lessonRoute);

module.exports = topicRoute;