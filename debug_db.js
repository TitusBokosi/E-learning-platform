const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkData() {
  const users = await prisma.user.count();
  const courses = await prisma.course.count();
  const categories = await prisma.category.count();
  
  console.log('Record Counts:');
  console.log(`- Users: ${users}`);
  console.log(`- Courses: ${courses}`);
  console.log(`- Categories: ${categories}`);
  
  const allUsers = await prisma.user.findMany({ select: { email: true, role: true } });
  console.log('\nUsers in DB:', allUsers);
}

checkData()
  .catch(e => console.error(e))
  .finally(() => prisma.$disconnect());
