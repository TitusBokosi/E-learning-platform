const { 
  createTopic, 
  getTopicById, 
  getAllTopicsForCourse, 
  updateTopic, 
  deleteTopic 
} = require('../queries/topics');
const AppError = require('../utils/appError');

const createTopicController = async (req, res, next) => {
  try {

    const newTopic = await createTopic(req.body);
    
    res.status(201).json({
      status: "success",
      data: newTopic
    });
  } catch (error) {
    next(error);
  }
};

const getTopicByIdController = async (req, res, next) => {
  try {

    const { topicId } = req.params;

    const topic = await getTopicById(topicId);

    if (!topic) {
      return next(new AppError("Topic not found", 404));
    }

    res.status(200).json({
      status: "success",
      data: topic,
    });
  } catch (err) {
    next(err);
  }
};

const getAllTopicsController = async (req, res, next) => {
  try {

    const { courseId } = req.params;
    
    const topics = await getAllTopicsForCourse(courseId);
    
    res.status(200).json({
      status: "success",
      results: topics.length,
      data: topics
    });
  } catch (error) {
    next(error);
  }
};

const updateTopicController = async (req, res, next) => {
  try {
  
    const { topicId, newdata } = req.body;

    const updatedTopic = await updateTopic(topicId, newdata);

    res.status(200).json({
      status: "success",
      data: updatedTopic
    });
  } catch (err) {
    next(err);
  }
};

const deleteTopicController = async (req, res, next) => {
  try {
    const { topicId } = req.params;

    await deleteTopic(topicId);

    res.status(204).json({
      status: "success",
      data: null
    });
  } catch (err) {
   
    next(err);
  }
};

module.exports = {
  createTopicController,
  getTopicByIdController,
  getAllTopicsController,
  updateTopicController,
  deleteTopicController
};