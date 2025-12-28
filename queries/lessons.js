const prisma = require("../config/db");

const createLesson = async(data)=>{
    return await prisma.lesson.create({
        data,
    })

}

const getAllLessonsForTopic = async(topicid,isPublished = true )=>{
    return await prisma.lesson.findMany({
        where:{isPublished,
            topicid
        }
    })

}

const getLessonById = async(id)=>{
    return await prisma.lesson.findUnique({
        where:{id},
    })

}

const updateLesson = async(id, data) => {
    return await prisma.lesson.update({
        where:{id},
        data,
    })

}

const deleteLesson = async(id) =>{
    return await prisma.lesson.delete({
        where:{id},
    })

}

module.exports = {
    createLesson,
    getAllLessonsForTopic,
    getLessonById,
    deleteLesson,
    updateLesson
}