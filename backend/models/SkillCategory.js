const mongoose = require('mongoose');

const skillCategorySchema = new mongoose.Schema(
  {
    categoryName:        { type: String, required: true },
    categoryDescription: String,
    subSkills:           { type: [String], default: [] },
    sortOrder:           { type: Number, default: 0 },
    deletedAt:           { type: Date, default: null },
  },
  { timestamps: true }
);

const SkillCategoryModel = mongoose.model('SkillCategory', skillCategorySchema);

function serialize(doc) {
  if (!doc) return null;
  return {
    id:                  doc._id.toString(),
    categoryName:        doc.categoryName,
    categoryDescription: doc.categoryDescription,
    subSkills:           doc.subSkills || [],
    sortOrder:           doc.sortOrder,
  };
}

const SkillCategory = {
  async findAll() {
    const docs = await SkillCategoryModel.find({ deletedAt: null })
      .sort({ sortOrder: 1, _id: 1 })
      .lean();
    return docs.map(serialize);
  },

  async findById(id) {
    const doc = await SkillCategoryModel.findOne({ _id: id, deletedAt: null }).lean();
    return serialize(doc);
  },

  async create({ categoryName, categoryDescription, subSkills }) {
    const count = await SkillCategoryModel.countDocuments({ deletedAt: null });
    const doc = await SkillCategoryModel.create({
      categoryName,
      categoryDescription,
      subSkills: subSkills || [],
      sortOrder: count,
    });
    return serialize(doc.toObject());
  },

  async update(id, { categoryName, categoryDescription, subSkills }) {
    const doc = await SkillCategoryModel.findOneAndUpdate(
      { _id: id, deletedAt: null },
      { categoryName, categoryDescription, subSkills: subSkills || [] },
      { new: true }
    ).lean();
    return serialize(doc);
  },

  async softDelete(id) {
    await SkillCategoryModel.findByIdAndUpdate(id, { deletedAt: new Date() });
  },
};

module.exports = SkillCategory;
