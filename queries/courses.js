const prisma = require("../config/db");

const createCourse = async(data)=>{
    return await prisma.course.create({
        data,
    })
}

//gets all courses which are published including the creator and the topics under the course
const getAllCourses = async(isPublished = true)=>{
    return await prisma.course.findMany({
where:{isPublished},
include:{
    creator: true,
    topics:true,
}
    })
}

const getCourseById = async(id)=>{
    return await prisma.course.findUnique({      
        where:{id},
        include:{
            creator: true,
            topics:true,
        }
    })
}

const updateCourse = async(id, data)=>{
    return await prisma.course.update({   
        where:{id,},
        data,
    })
}

const deleteCourse = async(id)=>{
 return await prisma.course.delete({
    where:{
        id,
    }
 })
}

module.exports = {
    createCourse,
    getAllCourses,
    getCourseById,
    deleteCourse,
    updateCourse
}



