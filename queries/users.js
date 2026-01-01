const prisma = require ("../config/db");

const createUser = async (data)=>{
    
    return await prisma.user.create({
        data,
        select:{
            id:true,
            username:true,
            email:true,
            roleid:true
        }
    })
}

const getUserById = async(id)=>{
    return await prisma.user.findUnique({
        where:{id},
        select:{
            id: true,
            username: true,
            email: true,
            roleid: true,
        }
    })
}

const getAllUsers = async()=>{
    return await prisma.user.findmany();
}

const updateUser = async(id, data)=>{
    return await prisma.user.update({
        where:{id,},
        data,
    })
}

const deleteUser = async(id)=>{
    return await prisma.user.delete({
        where:{id},
    })
}

const getUserByEmail = async (email) => {
    return await prisma.user.findUnique({
        where: { email },
    });
}

module.exports = {
    createUser,
    getUserById,
    getAllUsers,
    updateUser,
    deleteUser,
    getUserByEmail,
}