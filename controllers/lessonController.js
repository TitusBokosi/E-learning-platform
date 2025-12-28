const { 
  createLesson, 
  getAllLessonsForTopic, 
  getLessonById, 
  updateLesson, 
  deleteLesson 
} = require('../queries/lessons');

const createLessonController = async (req, res, next) => {
    try {
        const data = req.body;

        const newLesson = await createLesson(data);
        res.status(201).json({
            status: "success",
            data: newLesson
        });
    } catch (error) {
        next(error);
    }
};

const getAllLessonsController = async (req, res, next) => {
    try {
        const lessons = await getAllLessonsForTopic(req.params.topicId);
        res.status(200).json({
            status: "success",
            data: lessons
        });
    } catch (error) {
        next(error);
    }
};

const getLessonByIdController = async (req, res, next) => {
    try {
        const { id } = req.params;
        const lesson = await getLessonById(id);
        if (!lesson) {
            return res.status(404).json({
                message: 'Lesson not found'
            });
        }
        res.status(200).json({
            message: 'Lesson retrieved successfully',
            data: lesson
        });
    } catch (error) {
        next(error);
    }
};

const updateLessonController = async (req, res, next) => {
    try {
        const { id } = req.params;
        const data = req.body;

        const updatedLesson = await updateLesson(id, data);

        res.status(200).json({
          status: "success",
          data: updatedLesson
        })
    } catch (error) {
        next(error);
    }
};

const deleteLessonController = async (req, res, next) => {
    try {
        const { id } = req.params;

        const deletedLesson = await deleteLesson(id);
        res.status(204).json({
            status: "success",
            data: deletedLesson
        });
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
