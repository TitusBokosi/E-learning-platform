const prisma = require ("../config/db");

const createUser = async (data)=>{
    
    return await prisma.user.create({
        data,
    })
}

const getUserById = (id)=>{
    return prisma.user.findUnique({
        where:{id}
    })
}

const getAllUsers = ()=>{
    return prisma.user.findmany();
}

const updateUser = (id, data)=>{
    return prisma.user.update({
        where:{id,},
        data,
    })
}

const deleteUser = (id)=>{
    return prisma.user.delete({
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