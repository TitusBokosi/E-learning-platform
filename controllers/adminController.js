const { changeUserRole, deleteUser } = require('../queries/admin');

const changeUserRoleController = async (req, res, next) => {
    try {
        const { id } = req.params;
        const data = req.body;

        const updatedUser = await changeUserRole(id, data);
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
        const { id } = req.body.userId;

        const deletedUser = await deleteUser(id);
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
