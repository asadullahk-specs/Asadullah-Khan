const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema(
  {
    title:           { type: String, required: true },
    description:     String,
    technologies:    { type: [String], default: [] },
    projectImage:    String,
    detailsLink:     String,
    isRecent:        { type: Boolean, default: false },
    projectCategory: String,
    sortOrder:       { type: Number, default: 0 },
    deletedAt:       { type: Date, default: null },
  },
  { timestamps: true }
);

projectSchema.index({ projectCategory: 1 });
projectSchema.index({ isRecent: 1 });

const ProjectModel = mongoose.model('Project', projectSchema);

function serialize(doc) {
  if (!doc) return null;
  return {
    id:              doc._id.toString(),
    title:           doc.title,
    description:     doc.description,
    technologies:    doc.technologies || [],
    projectImage:    doc.projectImage,
    detailsLink:     doc.detailsLink,
    isRecent:        !!doc.isRecent,
    projectCategory: doc.projectCategory,
    sortOrder:       doc.sortOrder,
  };
}

const Project = {
  async findAll({ category, recentOnly } = {}) {
    const filter = { deletedAt: null };
    if (category && category !== 'All Projects' && category !== 'All') {
      filter.projectCategory = category;
    }
    if (recentOnly) filter.isRecent = true;
    const docs = await ProjectModel.find(filter).sort({ sortOrder: 1, _id: 1 }).lean();
    return docs.map(serialize);
  },

  async findById(id) {
    const doc = await ProjectModel.findOne({ _id: id, deletedAt: null }).lean();
    return serialize(doc);
  },

  async categoryCounts() {
    const result = await ProjectModel.aggregate([
      { $match: { deletedAt: null, projectCategory: { $nin: [null, ''] } } },
      { $group: { _id: '$projectCategory', count: { $sum: 1 } } },
      { $sort: { _id: 1 } },
    ]);
    return result.map((r) => ({ name: r._id, count: r.count }));
  },

  async create({ title, description, technologies, projectImage, detailsLink, isRecent, projectCategory }) {
    const count = await ProjectModel.countDocuments({ deletedAt: null });
    const doc = await ProjectModel.create({
      title, description,
      technologies: technologies || [],
      projectImage, detailsLink,
      isRecent: !!isRecent,
      projectCategory,
      sortOrder: count,
    });
    return serialize(doc.toObject());
  },

  async update(id, { title, description, technologies, projectImage, detailsLink, isRecent, projectCategory }) {
    const doc = await ProjectModel.findOneAndUpdate(
      { _id: id, deletedAt: null },
      { title, description, technologies: technologies || [], projectImage, detailsLink, isRecent: !!isRecent, projectCategory },
      { new: true }
    ).lean();
    return serialize(doc);
  },

  async softDelete(id) {
    await ProjectModel.findByIdAndUpdate(id, { deletedAt: new Date() });
  },
};

module.exports = Project;
