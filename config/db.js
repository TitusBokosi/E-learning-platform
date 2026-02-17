// db.js
const { PrismaClient } = require('@prisma/client');

// This checks if there is already a prisma instance on the global object
// If not, it creates one. This survives the --watch reloads.
const prisma = global.prisma || new PrismaClient();

if (process.env.NODE_ENV !== 'production') {
  global.prisma = prisma;
}

module.exports = prisma;
