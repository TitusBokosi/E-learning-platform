const {z} = require("zod");

const deleteUserValidator = z.object({
    userId:z.string().uuid("Invalid user id"),

});

const changeUserRoleValidator = z.object({
    userId:z.string().uuid("Invalid user id"),
    newRoleId:string().max(1, "Invalid role id"),
    oldRoleId:string().max(1, "Invalid role id"),

}).refine((data)=> data.oldRoleId != newRoleId,
{
    message: "New role must be different from old role",
    path: [newRoleId],
})

module.exports({
    changeUserRoleValidator, deleteUserValidator
})