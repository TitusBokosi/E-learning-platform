const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

const SALT_ROUNDS = 10;

const coursesData = [
  {
    courseName: 'React Development Mastery',
    description: 'Learn advanced React concepts, build scalable web apps, and master state management, hooks, and performance optimization.',
    category: 'Web Development',
    status: 'APPROVED',
    isFeatured: true,
    project: {
      title: 'Build a React Dashboard App',
      description: 'Create a fully functional dashboard application using React, with state management and routing.',
      rubric: 'Criteria: Component structure, state management, responsiveness, code quality.',
    },
    topics: [
      { name: 'React Hooks Deep Dive', lessons: ['useState & useEffect', 'useContext & useRef', 'Custom Hooks', 'useMemo & useCallback'] },
      { name: 'State Management', lessons: ['Redux Core Concepts', 'Redux Toolkit Setup', 'Async Thunks', 'Selectors & Slices'] },
    ],
  },
  {
    courseName: 'System Design Interview Prep',
    description: 'Master large scale system design, scalability, availability, and distributed systems for top tier engineering roles.',
    category: 'Backend',
    status: 'PENDING',
    isFeatured: false,
    project: {
      title: 'Design a Distributed URL Shortener',
      description: 'Design a system that can handle 100M+ requests per day with low latency.',
      rubric: 'Criteria: Scalability, database choice, API design, caching strategy.',
    },
    topics: [
      { name: 'Scalability Fundamentals', lessons: ['Load Balancers', 'Vertical vs Horizontal Scaling', 'Caching Strategies'] },
      { name: 'Distributed Databases', lessons: ['SQL vs NoSQL', 'Database Sharding', 'Replication & Consistency'] },
    ],
  },
  {
    courseName: 'Node.js & Express Backends',
    description: 'Master Node.js and Express by building robust APIs and backend services with authentication and databases.',
    category: 'Backend',
    status: 'APPROVED',
    isFeatured: true,
    project: {
      title: 'Build a REST API with Auth',
      description: 'Design and implement a fully authenticated REST API with CRUD operations and JWT tokens.',
      rubric: 'Criteria: Route design, auth security, error handling, database integration.',
    },
    topics: [
      { name: 'Node.js Basics', lessons: ['Node.js Architecture', 'Modules & CommonJS', 'File System API'] },
      { name: 'Express Middleware', lessons: ['Request Lifecycle', 'Custom Middleware', 'Error Middleware'] },
    ],
  },
  {
    courseName: 'Python for Data Science',
    description: 'Learn Python programming and its applications in data analysis, visualization, and machine learning fundamentals.',
    category: 'Data Science',
    status: 'APPROVED',
    isFeatured: true,
    project: {
      title: 'Data Analysis Project',
      description: 'Analyze a real-world dataset using Pandas and NumPy and present your findings with visualizations.',
      rubric: 'Criteria: Data cleaning, analysis depth, visualization quality, insights.',
    },
    topics: [
      { name: 'Python Basics', lessons: ['Variables & Types', 'Control Flow', 'Functions & Scope'] },
      { name: 'Data Structures', lessons: ['Lists & Tuples', 'Dictionaries & Sets', 'Stacks & Queues'] },
    ],
  },
  {
    courseName: 'UI/UX Design with Figma',
    description: 'Understand user experience principles and learn how to create stunning UI components and prototypes in Figma.',
    category: 'Design',
    status: 'PENDING',
    isFeatured: false,
    project: {
      title: 'Redesign a Mobile App',
      description: 'Identify UX issues in a popular mobile app and propose a full redesign.',
      rubric: 'Criteria: User research, wireframing, visual hierarchy, prototyping.',
    },
    topics: [
      { name: 'Design Principles', lessons: ['Visual Hierarchy', 'Typography', 'Color Theory'] },
      { name: 'Figma Mastery', lessons: ['Auto Layout', 'Variants', 'Components & Libraries'] },
    ],
  },
];

async function main() {
  console.log('🌱 Starting full seed...');

  // ── 1. USERS ────────────────────────────────────────────────────
  console.log('👤 Creating users with different roles...');
  
  const usersToCreate = [
    {
      email: 'admin@titsate.com',
      firstname: 'Titsate',
      lastname: 'Admin',
      password: 'AdminPassword123!',
      role: 'ADMIN',
    },
    {
      email: 'creator@titsate.com',
      firstname: 'Dev',
      lastname: 'Creator',
      password: 'CreatorPassword123!',
      role: 'CREATOR',
    },
    {
      email: 'super-creator@titsate.com',
      firstname: 'Master',
      lastname: 'Creator',
      password: 'SuperCreatorPassword123!',
      role: 'SUPER_CREATOR',
    },
    {
      email: 'john@example.com',
      firstname: 'John',
      lastname: 'Doe',
      password: '123456789',
      role: 'STUDENT',
    },
    {
      email: 'student1@example.com',
      firstname: 'Demo',
      lastname: 'Student',
      password: 'Password123!',
      role: 'STUDENT',
    }
  ];

  const userMap = {};

  for (const u of usersToCreate) {
    const hashedPassword = await bcrypt.hash(u.password, SALT_ROUNDS);
    const user = await prisma.user.upsert({
      where: { email: u.email },
      update: {
          password: hashedPassword,
          role: u.role
      },
      create: {
        email: u.email,
        firstname: u.firstname,
        lastname: u.lastname,
        password: hashedPassword,
        role: u.role,
      },
    });
    userMap[u.role] = user;
    console.log(`   - Created ${u.role}: ${u.email}`);
  }

  // ── 2. CATEGORIES ───────────────────────────────────────────────
  console.log('📂 Creating categories...');
  const categoryNames = ['Web Development', 'Backend', 'Data Science', 'Design', 'Mobile'];
  const categoryMap = {};
  for (const name of categoryNames) {
    const cat = await prisma.category.upsert({
      where: { categoryName: name },
      update: {},
      create: { categoryName: name },
    });
    categoryMap[name] = cat;
  }

  // ── 3. COURSES, TOPICS, LESSONS, PROJECTS ───────────────────────
  console.log('📚 Creating courses, topics, and lessons...');
  const createdCourses = [];

  for (let i = 0; i < coursesData.length; i++) {
    const data = coursesData[i];
    const category = categoryMap[data.category];
    
    // Switch between creator and super_creator as creators
    const creator = i % 2 === 0 ? userMap['SUPER_CREATOR'] : userMap['CREATOR'];

    const course = await prisma.course.create({
      data: {
        courseName: data.courseName,
        description: data.description,
        status: data.status,
        isFeatured: data.isFeatured,
        imageUrl: `https://placehold.co/600x300/1e293b/ffffff?text=${encodeURIComponent(data.courseName)}`,
        categoryid: category.categoryid,
        creatorId: creator.id,
      },
    });
    createdCourses.push(course);

    // Topics
    for (let t = 0; t < data.topics.length; t++) {
      const topicData = data.topics[t];
      const topicStatus = data.status; // Match course status for now
      
      const topic = await prisma.topic.create({
        data: {
          topicName: topicData.name,
          courseid: course.id,
          position: t + 1,
          status: topicStatus,
        },
      });

      // Lessons under each topic
      for (let l = 0; l < topicData.lessons.length; l++) {
        const lessonName = topicData.lessons[l];
        const lessonType = l % 3 === 0 ? 'VIDEO' : l % 3 === 1 ? 'TEXT' : 'MINI_PROJECT';
        
        await prisma.lesson.create({
          data: {
            lessonName,
            lessonType: lessonType,
            status: topicStatus,
            content: lessonType !== 'VIDEO' 
                ? `# ${lessonName}\n\nReviewing the core details of ${lessonName}.\n\n### Requirements\n\n1. Active participation\n2. Practical exercises\n\n[More information](https://example.com)`
                : null,
            videoUrl: lessonType === 'VIDEO' ? 'https://www.w3schools.com/html/mov_bbb.mp4' : null,
            topicid: topic.id,
            position: l + 1,
          },
        });
      }
    }

    // Capstone project per course
    await prisma.project.create({
      data: {
        title: data.project.title,
        description: data.project.description,
        rubric: data.project.rubric,
        courseid: course.id,
      },
    });
  }

  // ── 4. ENROLLMENTS & PROGRESS ──────────────────────────────────
  console.log('📝 Creating student enrollments and progress...');
  const john = await prisma.user.findUnique({ where: { email: 'john@example.com' } });
  const approvedCourses = createdCourses.filter(c => c.status === 'APPROVED');

  for (const course of approvedCourses) {
    await prisma.enrollment.create({
      data: {
        userid: john.id,
        courseid: course.id,
        status: 'ACTIVE',
      },
    });
    
    // Complete first lesson for each active course
    const firstLesson = await prisma.lesson.findFirst({
      where: { topic: { courseid: course.id } },
      orderBy: { position: 'asc' }
    });

    if (firstLesson) {
      await prisma.lessonProgress.create({
        data: {
          userid: john.id,
          lessonid: firstLesson.id,
        }
      });
    }
  }

  console.log('🎉 Seeding complete!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });