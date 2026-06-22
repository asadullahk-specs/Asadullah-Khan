const mongoose = require('mongoose');

// Singleton document — always one doc with singletonKey: 'hero'
const heroSchema = new mongoose.Schema(
  {
    singletonKey:         { type: String, default: 'hero', unique: true },
    staticHeading:        String,
    typewriterTexts:      { type: [String], default: [] },
    paragraphText:        String,
    skills:               { type: [String], default: [] },
    heroImage:            String,
    cvDoc:                String,
    aboutPreviewHeading:  String,
    aboutPreviewText:     String,
    aboutPreviewImage:    String,
  },
  { timestamps: true }
);

const HeroModel = mongoose.model('Hero', heroSchema);

function serialize(doc) {
  if (!doc) return null;
  return {
    staticHeading:       doc.staticHeading,
    typewriterTexts:     doc.typewriterTexts || [],
    paragraphText:       doc.paragraphText,
    skills:              doc.skills || [],
    heroImage:           doc.heroImage,
    cvDoc:               doc.cvDoc,
    aboutPreviewHeading: doc.aboutPreviewHeading,
    aboutPreviewText:    doc.aboutPreviewText,
    aboutPreviewImage:   doc.aboutPreviewImage,
    updatedAt:           doc.updatedAt,
  };
}

const Hero = {
  async get() {
    const doc = await HeroModel.findOne({ singletonKey: 'hero' }).lean();
    return serialize(doc);
  },

  async update(data) {
    const doc = await HeroModel.findOneAndUpdate(
      { singletonKey: 'hero' },
      {
        staticHeading:       data.staticHeading,
        typewriterTexts:     data.typewriterTexts || [],
        paragraphText:       data.paragraphText,
        skills:              data.skills || [],
        heroImage:           data.heroImage,
        cvDoc:               data.cvDoc,
        aboutPreviewHeading: data.aboutPreviewHeading,
        aboutPreviewText:    data.aboutPreviewText,
        aboutPreviewImage:   data.aboutPreviewImage,
      },
      { upsert: true, new: true }
    ).lean();
    return serialize(doc);
  },
};

module.exports = Hero;
