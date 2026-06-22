const mongoose = require('mongoose');

const aboutSkillsSchema = new mongoose.Schema(
  {
    singletonKey:    { type: String, default: 'aboutSkills', unique: true },
    introParagraph:  { type: String, default: '' },
  },
  { timestamps: true }
);

const AboutSkillsModel = mongoose.model('AboutSkills', aboutSkillsSchema);

const AboutSkills = {
  async getIntro() {
    const doc = await AboutSkillsModel.findOne({ singletonKey: 'aboutSkills' }).lean();
    return doc ? doc.introParagraph : '';
  },

  async updateIntro(introParagraph) {
    await AboutSkillsModel.findOneAndUpdate(
      { singletonKey: 'aboutSkills' },
      { introParagraph },
      { upsert: true, new: true }
    );
    return this.getIntro();
  },
};

module.exports = AboutSkills;
