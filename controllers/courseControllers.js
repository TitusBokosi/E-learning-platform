const {
  createCourse,
  getAllCourses,
  getCourseById,
  updateCourse,
  deleteCourse,
} = require("../queries/courses");

const AppError = require("../utils/appError");

/**
 * CREATE COURSE
 */
const createCourseController = async (req, res, next) => {
  try {
    const newCourse = await createCourse(req.body);

    return res.status(201).json({
      status: "success",
      data: newCourse,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * GET ALL COURSES
 */
const getAllCoursesController = async (req, res, next) => {
  try {
    const courses = await getAllCourses();

    return res.status(200).json({
      status: "success",
      results: courses.length,
      data: courses,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * GET COURSE BY ID
 */
const getCourseByIdController = async (req, res, next) => {
  try {
    const { courseId } = req.params;

    const course = await getCourseById(courseId);

    if (!course) {
      return next(new AppError("Course not found", 404));
    }

    return res.status(200).json({
      status: "success",
      data: course,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * UPDATE COURSE
 */
const updateCourseController = async (req, res, next) => {
  try {
    const { courseId } = req.params;

    const updatedCourse = await updateCourse(courseId, req.body);

    return res.status(200).json({
      status: "success",
      data: updatedCourse,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * DELETE COURSE
 */
const deleteCourseController = async (req, res, next) => {
  try {
    const { courseId } = req.params;

    await deleteCourse(courseId);

    return res.status(204).send();
  } catch (err) {
    next(err);
  }
};

module.exports = {
  createCourseController,
  getAllCoursesController,
  getCourseByIdController,
  updateCourseController,
  deleteCourseController,
};
