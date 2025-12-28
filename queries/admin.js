const prisma = require("../config/db");

const changeUserRole = async(id, data)=>{
 return await prisma.user.update({
    where:{
        id
    },
    data
 })
}

const deleteUser = async(id) =>{
return prisma.user.delete({
    where:{id}
})
}


module.exports = {
    changeUserRole,
    deleteUser
}