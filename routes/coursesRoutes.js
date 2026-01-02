const express = require("express");
const { createCourseController, getAllCoursesController, getCourseByIdController, updateCourseController, deleteCourseController} =require("./controllers/courseControllers");
const {createCourseValidator, getCourseByIdValidator, updateCourseValidator, deleteCourseValidator,} =require ("../validators/courseValidator");

const courseRoute = express.Router();

courseRoute.GET("/", getAllCoursesController);
courseRoute.POST("/", validate(createCourseValidator), createCourseController);
courseRoute.GET("/:courseid", validate(getCourseByIdValidator), getCourseByIdController);
courseRoute.PUT("/:courseid", validate(updateCourseValidator), updateCourseController);
courseRoute.DELETE("/:courseid", validate(deleteCourseValidator), deleteCourseController);

module.exports = courseRoute;
