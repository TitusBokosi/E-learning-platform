const prisma = require('../config/db');

const createTopic = async (data, status = 'APPROVED') => {
  // If no position provided, append to end of course topics
  let position = data.position;
  if (position === undefined || position === null) {
    const last = await prisma.topic.findFirst({
      where: { courseid: data.courseId },
      orderBy: { position: 'desc' },
    });
    position =
      last && typeof last.position === 'number' ? last.position + 1 : 1;
  }
  return await prisma.topic.create({
    data: {
      topicName: data.topicName,
      courseid: data.courseId,
      position,
      status: status,
    },
  });
};

const getTopicById = async (id, filter = {}) => {
  return await prisma.topic.findFirst({
    where: { id, ...filter },
    include: {
      lessons: {
        where: filter.status ? { status: filter.status } : {},
        orderBy: { position: 'asc' },
      },
      course: true,
    },
  });
};

const getAllTopicsForCourse = async (courseid, filter = {}) => {
  return await prisma.topic.findMany({
    where: {
      courseid,
      ...filter,
    },
    orderBy: { position: 'asc' },
    include: {
      lessons: {
        where: filter.status ? { status: filter.status } : {},
        orderBy: { position: 'asc' },
      },
      course: true,
    },
  });
};

const updateTopic = async (id, data) => {
  // If position is not being updated, do a normal update
  if (data.position === undefined || data.position === null) {
    return await prisma.topic.update({
      where: { id },
      data: {
        ...(data.topicName !== undefined && { topicName: data.topicName }),
        ...(data.courseId !== undefined && { courseid: data.courseId }),
        ...(data.status !== undefined && { status: data.status }),
        ...(data.feedback !== undefined && { feedback: data.feedback }),
      },
    });
  }

  // Position change: shift other topics within the same course accordingly.
  const topic = await prisma.topic.findUnique({ where: { id } });
  if (!topic) throw new Error('Topic not found');

  const courseid = topic.courseid;
  const currentPos = typeof topic.position === 'number' ? topic.position : null;

  // Count total topics in course
  const total = await prisma.topic.count({ where: { courseid } });

  // Clamp desired position
  let desired = Number(data.position);
  if (Number.isNaN(desired)) {
    desired = currentPos || 1;
  }
  desired = Math.max(1, Math.min(desired, Math.max(1, total)));

  // If position unchanged, just update other fields
  if (currentPos === desired) {
    return await prisma.topic.update({
      where: { id },
      data: {
        ...(data.topicName !== undefined && { topicName: data.topicName }),
        ...(data.courseId !== undefined && { courseid: data.courseId }),
        ...(data.status !== undefined && { status: data.status }),
        ...(data.feedback !== undefined && { feedback: data.feedback }),
      },
    });
  }

  // Perform shifting inside a transaction
  const ops = [];
  if (currentPos === null) {
    // treat as append, just set desired
  } else if (desired < currentPos) {
    // moving up: increment positions in [desired, currentPos-1]
    ops.push(
      prisma.topic.updateMany({
        where: { courseid, position: { gte: desired, lt: currentPos } },
        data: { position: { increment: 1 } },
      }),
    );
  } else {
    // desired > currentPos : moving down: decrement positions in (currentPos, desired]
    ops.push(
      prisma.topic.updateMany({
        where: { courseid, position: { gt: currentPos, lte: desired } },
        data: { position: { decrement: 1 } },
      }),
    );
  }

  // final update for the moved topic (set new position and other fields)
  const movedData = {
    ...(data.topicName !== undefined && { topicName: data.topicName }),
    ...(data.courseId !== undefined && { courseid: data.courseId }),
    position: desired,
    ...(data.status !== undefined && { status: data.status }),
    ...(data.feedback !== undefined && { feedback: data.feedback }),
  };

  // Execute transaction: shift others then update moved topic
  await prisma.$transaction([
    ...ops,
    prisma.topic.update({ where: { id }, data: movedData }),
  ]);

  // Return the updated topic
  return await prisma.topic.findUnique({ where: { id } });
};

const deleteTopic = async (id) => {
  // Delete the topic and shift positions of remaining topics in the same course
  const topic = await prisma.topic.findUnique({ where: { id } });
  if (!topic) return null;
  const courseid = topic.courseid;
  const deletedPos = typeof topic.position === 'number' ? topic.position : null;

  if (deletedPos === null) {
    return await prisma.topic.delete({ where: { id } });
  }

  // Delete then decrement positions greater than deletedPos
  await prisma.$transaction([
    prisma.topic.delete({ where: { id } }),
    prisma.topic.updateMany({
      where: { courseid, position: { gt: deletedPos } },
      data: { position: { decrement: 1 } },
    }),
  ]);

  return null;
};

const getAllTopics = async () => {
  return await prisma.topic.findMany({
    orderBy: { position: 'asc' },
  });
};

module.exports = {
  createTopic,
  getTopicById,
  getAllTopicsForCourse,
  updateTopic,
  deleteTopic,
  getAllTopics,
};
