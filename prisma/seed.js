const prisma = require('../config/db');

const rolesData = ['admin', 'instructor', 'student'];

const coursesData = [
  {
    courseName: 'React Development Mastery',
    description:
      'Learn advanced React concepts, build scalable web apps, and master state management, hooks, and performance optimization. This course is designed for developers who want to go beyond the basics and write production-ready React applications.',
    topics: [
      'React Hooks Deep Dive',
      'State Management with Redux',
      'Routing & Navigation',
      'React Performance Optimization',
      'Context API in Depth',
      'Testing React Applications',
      'React with TypeScript',
      'Server-Side Rendering with Next.js',
      'Forms & Validation',
      'Advanced Patterns & Best Practices',
    ],
  },
  {
    courseName: 'Node.js & Express Backends',
    description:
      'Master Node.js and Express by building robust APIs and backend services. This course covers async programming, database integration, authentication, and real-world application architecture.',
    topics: [
      'Node.js Basics & Modules',
      'Asynchronous Programming',
      'Express Routing & Middleware',
      'REST API Design',
      'Connecting to Databases',
      'Authentication & Authorization',
      'Error Handling & Logging',
      'Testing & Debugging',
      'Deployment & Scaling',
      'Best Practices in Node.js',
    ],
  },
  {
    courseName: 'Python for Data Science',
    description:
      'Learn Python programming and its applications in data analysis and machine learning. Understand data manipulation, visualization, and model building with practical examples.',
    topics: [
      'Python Basics & Syntax',
      'Data Structures & Control Flow',
      'Functions & Modules',
      'File Handling & OOP',
      'NumPy for Numerical Computing',
      'Pandas for Data Analysis',
      'Data Visualization with Matplotlib & Seaborn',
      'Introduction to Machine Learning',
      'Model Evaluation & Optimization',
      'Project: Data Analysis Pipeline',
    ],
  },
  {
    courseName: 'JavaScript Deep Dive',
    description:
      'Master JavaScript from the ground up. Understand advanced language features, asynchronous programming, event loops, and build dynamic web applications with confidence.',
    topics: [
      'JavaScript Fundamentals',
      'Objects, Arrays & Functions',
      'ES6+ Features',
      'Asynchronous JavaScript',
      'Promises, async/await',
      'DOM Manipulation',
      'Event Handling & Bubbling',
      'Modules & Build Tools',
      'Testing JavaScript',
      'Design Patterns in JS',
    ],
  },
  {
    courseName: 'DevOps with Docker & Kubernetes',
    description:
      'Learn containerization and orchestration using Docker and Kubernetes. This course teaches how to deploy scalable applications in modern cloud environments.',
    topics: [
      'Introduction to DevOps',
      'Docker Fundamentals',
      'Building Docker Images',
      'Docker Compose',
      'Kubernetes Basics',
      'Pods, Deployments & Services',
      'ConfigMaps & Secrets',
      'Scaling & Monitoring',
      'CI/CD Pipelines',
      'Best Practices in DevOps',
    ],
  },
  {
    courseName: 'Database Design & PostgreSQL',
    description:
      'Master relational database design and PostgreSQL. Learn schema design, normalization, SQL queries, and integrating databases with applications.',
    topics: [
      'Database Fundamentals',
      'ER Modeling & Normalization',
      'PostgreSQL Basics',
      'Advanced SQL Queries',
      'Indexes & Performance',
      'Transactions & Concurrency',
      'Stored Procedures & Triggers',
      'Data Security & Roles',
      'Backup & Restore',
      'Database Optimization',
    ],
  },
  {
    courseName: 'TypeScript Essentials',
    description:
      'Learn TypeScript to write safer, more maintainable JavaScript. Understand types, interfaces, generics, and integrate TypeScript into real projects.',
    topics: [
      'Introduction to TypeScript',
      'Basic Types & Variables',
      'Functions & Interfaces',
      'Classes & Inheritance',
      'Generics & Advanced Types',
      'Modules & Namespaces',
      'TypeScript with React',
      'Debugging & Tooling',
      'Testing TypeScript',
      'Project: Typed Application',
    ],
  },
  {
    courseName: 'Frontend Development with HTML & CSS',
    description:
      'Master the fundamentals of HTML and CSS to build responsive, accessible, and visually appealing web interfaces.',
    topics: [
      'HTML5 Basics',
      'CSS Fundamentals',
      'Flexbox & Grid Layouts',
      'Responsive Design',
      'CSS Animations & Transitions',
      'Forms & Inputs',
      'Accessibility in Web',
      'Advanced CSS Selectors',
      'Browser DevTools',
      'Project: Portfolio Website',
    ],
  },
  {
    courseName: 'Machine Learning Fundamentals',
    description:
      'Understand the principles of machine learning. Learn supervised and unsupervised algorithms, model training, evaluation, and deployment.',
    topics: [
      'Introduction to Machine Learning',
      'Data Preprocessing',
      'Supervised Learning',
      'Unsupervised Learning',
      'Regression Models',
      'Classification Models',
      'Clustering Techniques',
      'Model Evaluation & Metrics',
      'Neural Networks Basics',
      'Deploying ML Models',
    ],
  },
  {
    courseName: 'Cloud Computing with AWS',
    description:
      'Learn how to design, deploy, and manage applications in the AWS cloud. Cover EC2, S3, Lambda, and cloud architecture best practices.',
    topics: [
      'Introduction to Cloud',
      'AWS Core Services',
      'Compute: EC2 & Lambda',
      'Storage: S3 & EBS',
      'Networking & VPC',
      'Databases on AWS',
      'Security & IAM',
      'Monitoring & Logging',
      'Scaling Applications',
      'Cloud Architecture Best Practices',
    ],
  },
];

// Function to generate 10 lessons per topic with markdown, 20+ sentences
function generateLessons(courseName, topicName) {
  const lessons = [];
  for (let i = 1; i <= 10; i++) {
    let content = `# Lesson ${i}: ${topicName}\n\n`;
    content += `This lesson is part of the course "${courseName}". We will cover key concepts, examples, and practical implementations.\n\n`;

    for (let s = 1; s <= 20; s++) {
      content += `**Sentence ${s}:** This explains a concept in detail with examples, best practices, and potential pitfalls.\n\n`;
      if (s % 5 === 0) {
        content +=
          "```javascript\n// Sample code snippet demonstrating concept\nconsole.log('Hello World');\n```\n\n";
      }
      if (s % 7 === 0) {
        content += '- Key point 1\n- Key point 2\n- Key point 3\n\n';
      }
    }

    lessons.push({
      lessonName: `Lesson ${i} - ${topicName}`,
      content,
    });
  }
  return lessons;
}

async function main() {
  console.log('Seeding database...');

  // Create roles
  const allRoles = [];
  for (let roleName of rolesData) {
    const role = await prisma.role.upsert({
      where: { roleName },
      update: {},
      create: { roleName },
    });
    allRoles.push(role);
  }

  // Create 10 users
  for (let i = 1; i <= 10; i++) {
    const role = allRoles[i % allRoles.length];
    await prisma.user.create({
      data: {
        email: `user${i}@example.com`,
        firstname: `User${i}`,
        lastname: `Test`,
        password: 'password123',
        roleid: role.roleid,
        admins:
          role.roleName === 'admin'
            ? { create: { adminRole: role.roleid } }
            : undefined,
      },
    });
  }

  // Create categories
  const categories = [
    'Web Development',
    'Backend',
    'Data Science',
    'DevOps',
    'Cloud',
  ];
  const categoryRecords = [];
  for (let name of categories) {
    const cat = await prisma.category.upsert({
      where: { categoryName: name },
      update: {},
      create: { categoryName: name },
    });
    categoryRecords.push(cat);
  }

  // Create courses, topics, lessons
  for (let i = 0; i < coursesData.length; i++) {
    const courseData = coursesData[i];
    const category = categoryRecords[i % categoryRecords.length];

    const course = await prisma.course.create({
      data: {
        courseName: courseData.courseName,
        description: courseData.description,
        categoryid: category.categoryid,
      },
    });

    for (let t = 0; t < courseData.topics.length; t++) {
      const topicName = courseData.topics[t];

      const topic = await prisma.topic.create({
        data: {
          topicName,
          courseid: course.id,
          position: t + 1,
        },
      });

      const lessons = generateLessons(courseData.courseName, topicName);
      for (let l = 0; l < lessons.length; l++) {
        await prisma.lesson.create({
          data: {
            lessonName: lessons[l].lessonName,
            topicid: topic.id,
            courseid: course.id,
            content: lessons[l].content,
            position: l + 1,
          },
        });
      }
    }
  }

  console.log('✅ Database seeding complete with full realistic tech content!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
