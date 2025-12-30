const {z }=require("zod");

    const createCourseValidator =z.object({
        title:z
            .string()
            .min(5)
            .max(225)
            .trim(),
        description:z
            .string()
            .min(20)
            .max(225)
            .trim(),
        category:z
            .string.min(2)
            .max(200)
            .trim(),
        level: z
            .enum(["beginner", "intermediate", "advanced", "all levels"]),
        toltalLessons:z
            .number()
            .min(1)
            .max(500)
            .default(1),
        instructorId:z
            .string()
            .uuid()
            .min(1),
        courseStatus:z
            .boolean()
            .default(false),
    }) ;

    const getCourseByIdValidator = z.object({
        courseId:z
            .string()
            .uuid("must be a valid courseId")
    });

    const updateCourseValidator = z.object({
        courseId:z
            .string()
            .uuid("should be a valid courseId"),
            newdata: z.object({
                title,
                descripion,
                category,
                level,
                toltalLessons,
                instructorId,
                courseStatus

            })
    });

    const deleteCourseValidator = z.object({
        courseId:z
            .string()
            .uuid('invalid courseId'),
        courseTitle:z
            .string()
    });

module.exports = {
    createCourseValidator,
    getCourseByIdValidator,
    updateCourseValidator,
    deleteCourseValidator
}