const prisma = require('../config/db');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

exports.createAnnouncementController = catchAsync(async (req, res) => {
  const { title, content } = req.body;
  if (!title || !content) throw new AppError('Title and content are required', 400);
  const announcement = await prisma.announcement.create({ data: { title, content } });
  res.status(201).json({ status: 'success', data: announcement });
});

exports.getAllAnnouncementsController = catchAsync(async (req, res) => {
  const filter = (req.user && req.user.role === 'ADMIN') ? {} : { isActive: true };
  const announcements = await prisma.announcement.findMany({ 
    where: filter,
    orderBy: { createdAt: 'desc' } 
  });
  res.status(200).json({ status: 'success', data: announcements });
});

exports.updateAnnouncementController = catchAsync(async (req, res) => {
  const announcement = await prisma.announcement.update({
    where: { id: req.params.id },
    data: req.body,
  });
  res.status(200).json({ status: 'success', data: announcement });
});

exports.deleteAnnouncementController = catchAsync(async (req, res) => {
  await prisma.announcement.delete({ where: { id: req.params.id } });
  res.status(204).send();
});

exports.toggleAnnouncementController = catchAsync(async (req, res) => {
  const existing = await prisma.announcement.findUnique({ where: { id: req.params.id } });
  if (!existing) throw new AppError('Announcement not found', 404);
  const updated = await prisma.announcement.update({
    where: { id: req.params.id },
    data: { isActive: !existing.isActive },
  });
  res.status(200).json({ status: 'success', data: updated });
});
