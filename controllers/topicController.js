const { 
  createTopic, 
  getTopicById, 
  getAllTopicsForCourse, 
  updateTopic, 
  deleteTopic 
} = require('../queries/topics');
const AppError = require('../utils/appError');

const createTopicController = async (req, res, next) => {
  try{
      const data = req.body;

      const newTopic = await createTopic(data);
      res.status(201).json({
          status: "success",
          data: newTopic
      });
  } catch (error) {
      next(error);
  }
};

const getTopicByIdController = async (req, res, next) => {
  try{
    const {id} = req.params;

    const topic = await getTopicById(id);

    if(!topic){
      return next( new AppError("Topic not found", 404));
    }

    return res.status(200).json({
      status: "success",
      data: topic,
    })
  }
  catch(err){
    return next (err);
  }
};

const getAllTopicsController = async (req, res, next) => {
  try {
    const topics = await getAllTopicsForCourse(req.params.courseId);
    res.status(200).json({
      status: "success",
      data: topics
    });
  } catch (error) {
    next(error);
  }
};

const updateTopicController = async (req, res, next) => {
  try{
    const {id} = req.params;
    const data = req.body;

    const updatedTopic = await updateTopic(id, data);

    return  res.status(200).json({
      status: "success",
      data: updatedTopic
    })
  }
  catch(err){
    return next (err);
  }
};

const deleteTopicController = async (req, res, next) => {
  try {
    const { id } = req.params;

    const deletedTopic = await deleteTopic(id);

    if (!deletedTopic) {
      return next(new AppError("Topic not found", 404));
    }

    return res.status(204).json({
      status: "success",
      data: null
    });
  } catch (err) {
    return next(err);
  }
};

module.exports = {
  createTopicController,
  getTopicByIdController,
  getAllTopicsController,
  updateTopicController,
  deleteTopicController
};
