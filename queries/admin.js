const prisma = require("../config/db");

const changeUserRole = (id, data)=>{
    return prisma.User.update({
        where:{id},
        data,
    })

}

const deleteUser = id =>{
    return prisma.User.delete({
        where:{id},
    })

}


module.exports = {
    changeUserRole,
    deleteUser
}