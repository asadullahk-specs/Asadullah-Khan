const mongoose = require('mongoose');

const siteSettingsSchema = new mongoose.Schema(
  {
    singletonKey:          { type: String, default: 'site', unique: true },
    siteName:              String,
    siteTagline:           String,
    seoDescription:        String,
    favicon:               String,
    adminEmail:            String,
    projectsPageIntroText: String,
  },
  { timestamps: true }
);

const SiteSettingsModel = mongoose.model('SiteSettings', siteSettingsSchema);

function serialize(doc) {
  if (!doc) return null;
  return {
    siteName:              doc.siteName,
    siteTagline:           doc.siteTagline,
    seoDescription:        doc.seoDescription,
    favicon:               doc.favicon,
    adminEmail:            doc.adminEmail,
    projectsPageIntroText: doc.projectsPageIntroText,
    updatedAt:             doc.updatedAt,
  };
}

const SiteSettings = {
  async get() {
    const doc = await SiteSettingsModel.findOne({ singletonKey: 'site' }).lean();
    return serialize(doc);
  },

  async update(data) {
    const current = (await SiteSettingsModel.findOne({ singletonKey: 'site' }).lean()) || {};
    const merged = { ...serialize(current), ...data };
    const doc = await SiteSettingsModel.findOneAndUpdate(
      { singletonKey: 'site' },
      {
        siteName:              merged.siteName,
        siteTagline:           merged.siteTagline,
        seoDescription:        merged.seoDescription,
        favicon:               merged.favicon,
        adminEmail:            merged.adminEmail,
        projectsPageIntroText: merged.projectsPageIntroText,
      },
      { upsert: true, new: true }
    ).lean();
    return serialize(doc);
  },
};

module.exports = SiteSettings;
