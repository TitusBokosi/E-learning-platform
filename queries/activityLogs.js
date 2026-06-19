const prisma = require('../config/db');

const logActivity = async ({ action, details, adminId }) => {
  if (!adminId) return null;

  return prisma.activityLog.create({
    data: {
      action,
      details,
      adminId,
    },
  });
};

module.exports = {
  logActivity,
};
