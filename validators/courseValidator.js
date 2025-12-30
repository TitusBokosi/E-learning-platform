const {z }=require("zod");

    const createCourseValidator =z.object({
        courseName:z
            .string()
            .min(3, "coursename must be atleast 3 characters")
            .max(50)
            .trim(),
        category:z
            .string
            .min(2, "category name must be atleast 2 characters")
            .max(100)
            .trim(),
    }) ;

    const getCourseByIdValidator = z.object({
        courseId:z
            .string()
            .uuid("Invalid courseId")
    });

    const updateCourseValidator = z.object({
        courseId:z
            .string()
            .uuid("Invalid courseId"),
        newdata: z.object({
            courseName,    
            category,
            })
    });

    const deleteCourseValidator = z.object({
        courseId:z
            .string()
            .uuid('Invalid courseId'),
    });

module.exports = {
    createCourseValidator,
    getCourseByIdValidator,
    updateCourseValidator,
    deleteCourseValidator
}