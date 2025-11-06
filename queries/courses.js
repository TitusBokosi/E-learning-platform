const prisma = require("../config/db");

const createCourse = (data)=>{
    return prisma.course.create({
        data,
    })
}

//gets all courses which are published including the creator and the topics under the course
const getAllCourses = (isPublished = true)=>{
    return prisma.course.findmany({
where:{isPublished},
include:{
    creator: true,
    topics:true,
}
    })
}

const getCourseById = (id)=>{
    return prisma.course.findUnique({      
        where:{id},
        include:{
            creator: true,
            topics:true,
        }
    })
}

const updateCourse = (id, data)=>{
    return prisma.course.update({   
        where:{id,},
        data,
    })
}

const deleteCourse = (id)=>{
 return prisma.course.delete({
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



