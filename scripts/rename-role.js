const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  try {
    console.log('Renaming USER to STUDENT in Role enum...');
    // This is for PostgreSQL
    await prisma.$executeRawUnsafe(`ALTER TYPE "Role" RENAME VALUE 'USER' TO 'STUDENT'`);
    console.log('Success!');
  } catch (error) {
    console.error('Failed or already exists:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

main();
