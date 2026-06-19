const {
  createProject,
  getProjectById,
  getProjectByCourseId,
  updateProject,
  deleteProject,
} = require('../queries/projects');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

const createProjectController = catchAsync(async (req, res, next) => {
  const newProject = await createProject(req.body);

  res.status(201).json({
    status: 'success',
    data: newProject,
  });
});

const getProjectByIdController = catchAsync(async (req, res, next) => {
  const { projectId } = req.params;
  const project = await getProjectById(projectId);

  if (!project) {
    return next(new AppError('Project not found', 404));
  }

  res.status(200).json({
    status: 'success',
    data: project,
  });
});

const getProjectByCourseIdController = catchAsync(async (req, res, next) => {
  const { courseId } = req.params;
  const project = await getProjectByCourseId(courseId);

  if (!project) {
    return next(new AppError('Project not found for this course', 404));
  }

  res.status(200).json({
    status: 'success',
    data: project,
  });
});

const updateProjectController = catchAsync(async (req, res, next) => {
  const { projectId } = req.params;
  const updatedProject = await updateProject(projectId, req.body);

  res.status(200).json({
    status: 'success',
    data: updatedProject,
  });
});

const deleteProjectController = catchAsync(async (req, res, next) => {
  const { projectId } = req.params;
  await deleteProject(projectId);

  res.status(204).json({
    status: 'success',
    data: null,
  });
});

module.exports = {
  createProjectController,
  getProjectByIdController,
  getProjectByCourseIdController,
  updateProjectController,
  deleteProjectController,
};
