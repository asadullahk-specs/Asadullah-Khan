const mongoose = require('mongoose');

const footerSettingsSchema = new mongoose.Schema(
  {
    singletonKey:      { type: String, default: 'footer', unique: true },
    footerSummaryText: String,
    footerSkillsList:  { type: [String], default: [] },
    joinUsLinks:       { type: [{ label: String, url: String }], default: [] },
  },
  { timestamps: true }
);

const FooterSettingsModel = mongoose.model('FooterSettings', footerSettingsSchema);

function serialize(doc) {
  if (!doc) return null;
  return {
    footerSummaryText: doc.footerSummaryText,
    footerSkillsList:  doc.footerSkillsList || [],
    joinUsLinks:       doc.joinUsLinks || [],
    updatedAt:         doc.updatedAt,
  };
}

const FooterSettings = {
  async get() {
    const doc = await FooterSettingsModel.findOne({ singletonKey: 'footer' }).lean();
    return serialize(doc);
  },

  async update(data) {
    const doc = await FooterSettingsModel.findOneAndUpdate(
      { singletonKey: 'footer' },
      {
        footerSummaryText: data.footerSummaryText,
        footerSkillsList:  data.footerSkillsList || [],
        joinUsLinks:       data.joinUsLinks || [],
      },
      { upsert: true, new: true }
    ).lean();
    return serialize(doc);
  },
};

module.exports = FooterSettings;
