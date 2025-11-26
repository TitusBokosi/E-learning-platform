const z= require("zod")

    const createTopicValidator = z.object({
        content:z
            .string()
            .min(100)
            .max(10000)
            .trim(),
        courseId:z
            .string()
            .uuid("provide a valid courseId")
            .trim(),
    })

    const getTopicByIdValidator = z.object({
        topicId:z
            .string()
            .uuid("provide a valide topicId")
            .trim(),    
    })

    const updateTopicValidator = z.object({
        topicId:z
            .string()
            .uuid("provide a valid topicId")
            .trim(),
        courseId:z
            .string()
            .uuid("povide a valid topicId")
            .trim(),
        topicName:z
            .string()
            .min(5)
            .max(100)
            .trim()
    });

    const deleteTopicValidator = z.object({
        topicId:z
            .string()
            .uuid("provide a valid topicId")
            .trim(),
    })
    
module.exports = {
    createTopicValidator,
    getTopicByIdValidator,
    updateTopicValidator,
    deleteTopicValidator
}
    