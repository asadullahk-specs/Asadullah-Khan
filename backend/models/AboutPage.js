const mongoose = require('mongoose');

const aboutPageSchema = new mongoose.Schema(
  {
    singletonKey:    { type: String, default: 'about', unique: true },
    paragraphs:      { type: [String], default: [] },
    skills:          { type: [String], default: [] },
    cvAttachmentUrl: String,
  },
  { timestamps: true }
);

const AboutPageModel = mongoose.model('AboutPage', aboutPageSchema);

function serialize(doc) {
  if (!doc) return null;
  return {
    aboutPageParagraphs: doc.paragraphs || [],
    aboutPageSkills:     doc.skills || [],
    cvAttachmentUrl:     doc.cvAttachmentUrl,
    updatedAt:           doc.updatedAt,
  };
}

const AboutPage = {
  async get() {
    const doc = await AboutPageModel.findOne({ singletonKey: 'about' }).lean();
    return serialize(doc);
  },

  async update(data) {
    const doc = await AboutPageModel.findOneAndUpdate(
      { singletonKey: 'about' },
      {
        paragraphs:      data.aboutPageParagraphs || [],
        skills:          data.aboutPageSkills || [],
        cvAttachmentUrl: data.cvAttachmentUrl,
      },
      { upsert: true, new: true }
    ).lean();
    return serialize(doc);
  },
};

module.exports = AboutPage;
