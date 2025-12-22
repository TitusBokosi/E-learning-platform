const prisma = require("../config/db");

const createLesson = (data)=>{
    return prisma.Lesson.create({
        data,
    })

}

const getAllLessons = (isPublished = true )=>{
    return prisma.Lesson.findMany({
        where:{isPublished}
    })

}

const getLessonById = (id)=>{
    return prisma.Lesson.findUnique({
        where:{id},
    })

}

const updateLesson = (id, data) => {
    return prisma.Lesson.update({
        where:{id},
        data,
    })

}

const deleteLesson = (id) =>{
    return prisma.lesson.delete({
        where:{id},
    })

}

module.exports = {
    createLesson,
    getAllLessons,
    getLessonById,
    deleteLesson,
    updateLesson
}