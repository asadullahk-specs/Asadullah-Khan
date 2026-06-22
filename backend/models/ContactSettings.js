const mongoose = require('mongoose');

const contactSettingsSchema = new mongoose.Schema(
  {
    singletonKey:     { type: String, default: 'contact', unique: true },
    contactSubtitle:  String,
    availabilityText: String,
    adminEmail:       String,
    adminPhone:       String,
    adminLocation:    String,
    linkedinUrl:      String,
    githubUrl:        String,
  },
  { timestamps: true }
);

const ContactSettingsModel = mongoose.model('ContactSettings', contactSettingsSchema);

function serialize(doc) {
  if (!doc) return null;
  return {
    contactSubtitle:  doc.contactSubtitle,
    availabilityText: doc.availabilityText,
    adminEmail:       doc.adminEmail,
    adminPhone:       doc.adminPhone,
    adminLocation:    doc.adminLocation,
    linkedinUrl:      doc.linkedinUrl,
    githubUrl:        doc.githubUrl,
    updatedAt:        doc.updatedAt,
  };
}

const ContactSettings = {
  async get() {
    const doc = await ContactSettingsModel.findOne({ singletonKey: 'contact' }).lean();
    return serialize(doc);
  },

  async update(data) {
    const doc = await ContactSettingsModel.findOneAndUpdate(
      { singletonKey: 'contact' },
      {
        contactSubtitle:  data.contactSubtitle,
        availabilityText: data.availabilityText,
        adminEmail:       data.adminEmail,
        adminPhone:       data.adminPhone,
        adminLocation:    data.adminLocation,
        linkedinUrl:      data.linkedinUrl,
        githubUrl:        data.githubUrl,
      },
      { upsert: true, new: true }
    ).lean();
    return serialize(doc);
  },
};

module.exports = ContactSettings;
