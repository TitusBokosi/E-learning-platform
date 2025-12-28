const prisma = require("../config/db");

const createTopic = async (data)=>{
 return await prisma.topic.create({
    data,
 })
}

const getTopicById = async(id)=>{
    return await prisma.topic.findUnique({
        where:{id}
    })
}

const getAllTopicsForCourse = async(courseid, isPublished = true )=>{
    return await prisma.topic.findMany({
        where: {
            courseid,
            isPublished
        }
    })
}

const deleteTopic = async(id)=>{
    return await prisma.topic.delete({
        where:{id}
    })
}

const updateTopic = async(id, data) => {
    return await prisma.topic.update({
        where:{id},
        data
    })
}

module.exports = {
    createTopic,
    getTopicById,
    getAllTopicsForCourse,
    updateTopic,
    deleteTopic
}