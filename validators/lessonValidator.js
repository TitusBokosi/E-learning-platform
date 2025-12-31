const z = require("zod");

 const createTopicValidator = z.object({
    lessonName:z    
        .string()
        .min(3, "lesson-name must be atleast 3 characters")
        .trim(),
    topicId:z
        .string()
        .uuid("invalid topicId")
        .trim()
 });

    const getLessonByIdValidator =z.object({
        lessonid:z
            .string()
            .uuid("invalid lessonId")
            .trim()
    });
    const updateLessonValidator = z.object({
        lessonid:z
            .string()
            .uuid("invalid lessonId")
            .trim(),
        lessonName:z
            .string()
            .min(3,"lesson-name must be atleast 3 characters")
            .max(50),
        topicId:z   
            .string()
            .uuid()
            .trim()
    });

    const deleteLessonValidator = z.object({
        lessonId:z  
            .string()
            .uuid("invalid lessonId")
            .trim()

    });
    
module.exports = {
    createLessonValidator,
    getLessonByIdValidator,
    updateLessonValidator,
    deleteLessonValidator
}