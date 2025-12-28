const { 
  createCourse, 
  getAllCourses, 
  getCourseById, 
  updateCourse, 
  deleteCourse 
} = require('../queries/courses');
const AppError = require('../utils/appError');

const createCourseController = async (req, res, next) => {
  try{
    const courseData = req.body;
    const newCourse = await createCourse(courseData);

    if(!newCourse){
      return next(new AppError("Failed to create course", 500))
    }

    return res.status(201).json({
      status: "success",
      data: newCourse,
    })
  }
  catch(err){
    return next (err);
  }
};

const getAllCoursesController = async (req, res, next) => {
  try{
    const courses = await getAllCourses();
    if(!courses){
      return next(new AppError("Could not fetch courses", 500))
    }
    return res.status(200).json({
      status: "success",
      data: courses,
    })
  }
  catch(err){
    return next (err);
  }
};

const getCourseByIdController = async (req, res, next) => {
  try{
    const courseId = req.params.id;
    const course = await getCourseById(courseId);

    if(!course){
      return next(new AppError("Course not found", 404))
    }

    return res.status(200).json({
      status: "success",
      data: course,
    })
  }
  catch(err){
    return next (err);
  }
};

const updateCourseController = async (req, res, next) => {
  try{
    const courseId = req.params.id;
    const courseData = req.body;
    const updatedCourse = await updateCourse(courseId, courseData);

    if(!updatedCourse){
      return next(new AppError("Failed to update course", 500))
    }

    return res.status(200).json({
      status: "success",
      data: updatedCourse,
    })
  }
  catch(err){
    return next (err);
  }
};

const deleteCourseController = async (req, res, next) => {
  try{
    const courseId = req.params.id;
    const deleted = await deleteCourse(courseId);

    if(!deleted){
      return next(new AppError("Failed to delete course", 500))
    }

    return res.status(204).json({
      status: "success",
      data: null,
    })
  }
  catch(err){
    return next (err);
  }
};

module.exports = {
  createCourseController,
  getAllCoursesController,
  getCourseByIdController,
  updateCourseController,
  deleteCourseController
};
