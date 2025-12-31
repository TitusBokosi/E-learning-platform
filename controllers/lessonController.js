const { 
  createLesson, 
  getAllLessonsForTopic, 
  getLessonById, 
  updateLesson, 
  deleteLesson 
} = require('../queries/lessons');

const createLessonController = async (req, res, next) => {
  try {
    const newLesson = await createLesson(req.body);
    res.status(201).json({ status: "success", data: newLesson });
  } catch (error) {
    next(error);
  }
};

const getAllLessonsController = async (req, res, next) => {
  try {
    const { topicId } = req.params;
    const lessons = await getAllLessonsForTopic(topicId);
    res.status(200).json({ status: "success", data: lessons });
  } catch (error) {
    next(error);
  }
};

const getLessonByIdController = async (req, res, next) => {
  try {
    
    const { lessonId } = req.params; 
    const lesson = await getLessonById(lessonId);
    
    if (!lesson) {
      return res.status(404).json({ status: "fail", message: 'Lesson not found' });
    }
    res.status(200).json({ status: "success", data: lesson });
  } catch (error) {
    next(error);
  }
};

const updateLessonController = async (req, res, next) => {
  try {
    const { lessonId, newdata } = req.body; 
    const updatedLesson = await updateLesson(lessonId, newdata);
    res.status(200).json({ status: "success", data: updatedLesson });
  } catch (error) {
    next(error);
  }
};

const deleteLessonController = async (req, res, next) => {
  try {
    const { lessonId } = req.params;
    await deleteLesson(lessonId);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createLessonController,
  getAllLessonsController,
  getLessonByIdController,
  updateLessonController,
  deleteLessonController
};