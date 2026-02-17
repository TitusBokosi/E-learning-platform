const express = require('express');
const { validate } = require('../middlewares/validateRequest');
const {
  createLessonValidator,
  getLessonByIdValidator,
  updateLessonValidator,
  deleteLessonValidator,
} = require('../validators/lessonValidator');
const {
  createLessonController,
  getAllLessonsController,
  getLessonByIdController,
  updateLessonController,
  deleteLessonController,
} = require('../controllers/lessonController');

const lessonRoute = express.Router();

lessonRoute.get('/', getAllLessonsController);
lessonRoute.post(
  '/createlesson',
  validate(createLessonValidator),
  createLessonController,
);
lessonRoute.get(
  '/:lessonId',

  getLessonByIdController,
);
lessonRoute.patch(
  '/updatelesson',
  validate(updateLessonValidator),
  updateLessonController,
);
lessonRoute.delete(
  '/deletelesson',
  validate(deleteLessonValidator),
  deleteLessonController,
);

module.exports = lessonRoute;
