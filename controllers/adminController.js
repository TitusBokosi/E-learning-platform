const { changeUserRole, deleteUser } = require('../queries/admin');

const changeUserRoleController = async (req, res, next) => {
    try {
        const {  userId } = req.params;
        const data = req.body;

        const updatedUser = await changeUserRole(userId, data);
        res.status(200).json({
            message: 'User role updated successfully',
            data: updatedUser
        });
    } catch (error) {
        next(error);
    }
};

const deleteUserController = async (req, res, next) => {
    try {
        const {  userId } = req.body;

        const deletedUser = await deleteUser(userId);
        res.status(204).json({
           status:"success",
            data: deletedUser
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
  changeUserRoleController,
  deleteUserController
};
