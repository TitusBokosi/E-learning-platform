const prisma = require("./db");

async function testPrismaConnection() {
  try {
    console.log("Testing Prisma connection...");
    const users = await prisma.user.findMany();
    console.log("Users:", users);
    console.log("Prisma test succeeded!");
  } catch (err) {
    console.error(" Prisma test failed:", err);
  } finally {
    await prisma.$disconnect();
  }
}

testPrismaConnection();
