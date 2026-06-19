const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const lessonId = '91e1398f-bbd4-44d2-ac9f-fa119644a136';
  const newContent = `
# Getting Started with JavaScript

JavaScript is a versatile language used for both frontend and backend development. Let's start with the classic "Hello World" program.

### Hello World Code

Here is how you print "Hello World" to the console in JavaScript:

\`\`\`javascript
// The classic hello world
console.log('Hello, World!');
\`\`\`

### Explanation
- \`console.log\` is a function that outputs text to the web console or terminal.
- The text is wrapped in single or double quotes to signify it is a string.
  `;

  const updatedLesson = await prisma.lesson.update({
    where: { id: lessonId },
    data: {
      content: newContent,
    },
  });

  console.log('Successfully updated lesson:', updatedLesson.lessonName);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
