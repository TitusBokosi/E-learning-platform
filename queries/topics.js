const prisma = require("../config/db");

const createTopic = (data)=>{
    return prisma.Topic.create({
        data,
    })

}

const getTopicById = (id)=>{
    return prisma.Topic.findUnique({
        where:{id},
    })

}

const getAllTopics = (isPublished = true )=>{
    return prisma.Topic.findMany({
        where:{isPublished},
    })

}

const deleteTopic = (id)=>{
    return prisma.Topic.delete({
        where:{id},
    })

}

const updateTopic = (id, data) =>{
    return prisma.Topic.update({
        where:{id},
        data,
    })

}

module.exports = {
    createTopic,
    getTopicById,
    getAllTopics,
    updateTopic,
    deleteTopic
}