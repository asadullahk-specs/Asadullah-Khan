const Project = require('../models/Project');
const SiteSettings = require('../models/SiteSettings');
const ApiError = require('../utils/ApiError');
const asyncHandler = require('../utils/asyncHandler');

// GET /api/projects?category=&recent=true (public)
const getProjects = asyncHandler(async (req, res) => {
  const { category, recent } = req.query;
  const projects = await Project.findAll({ category, recentOnly: recent === 'true' });
  res.json({ success: true, data: projects });
});

// GET /api/projects/categories (public) — "All Projects" + per-category counts
const getCategories = asyncHandler(async (req, res) => {
  const counts = await Project.categoryCounts();
  const total = counts.reduce((sum, c) => sum + c.count, 0);
  res.json({
    success: true,
    data: [{ name: 'All Projects', count: total }, ...counts],
  });
});

// GET /api/projects/page-settings (public) — Projects page intro text
const getPageSettings = asyncHandler(async (req, res) => {
  const settings = await SiteSettings.get();
  res.json({ success: true, data: { projectsPageIntroText: settings?.projectsPageIntroText || '' } });
});

// PUT /api/projects/page-settings (admin)
const updatePageSettings = asyncHandler(async (req, res) => {
  const { projectsPageIntroText } = req.body;
  const settings = await SiteSettings.update({ projectsPageIntroText });
  res.json({ success: true, data: { projectsPageIntroText: settings.projectsPageIntroText } });
});

// POST /api/projects (admin)
const createProject = asyncHandler(async (req, res) => {
  const { title, description, technologies, projectImage, detailsLink, isRecent, projectCategory } = req.body;
  if (!title) throw new ApiError(400, 'title is required.');
  const project = await Project.create({
    title,
    description,
    technologies,
    projectImage,
    detailsLink,
    isRecent,
    projectCategory,
  });
  res.status(201).json({ success: true, data: project });
});

// PUT /api/projects/:id (admin)
const updateProject = asyncHandler(async (req, res) => {
  const existing = await Project.findById(req.params.id);
  if (!existing) throw new ApiError(404, 'Project not found.');
  const { title, description, technologies, projectImage, detailsLink, isRecent, projectCategory } = req.body;
  const project = await Project.update(req.params.id, {
    title,
    description,
    technologies,
    projectImage,
    detailsLink,
    isRecent,
    projectCategory,
  });
  res.json({ success: true, data: project });
});

// DELETE /api/projects/:id (admin)
const deleteProject = asyncHandler(async (req, res) => {
  const existing = await Project.findById(req.params.id);
  if (!existing) throw new ApiError(404, 'Project not found.');
  await Project.softDelete(req.params.id);
  res.json({ success: true, message: 'Project deleted.' });
});

module.exports = {
  getProjects,
  getCategories,
  getPageSettings,
  updatePageSettings,
  createProject,
  updateProject,
  deleteProject,
};
