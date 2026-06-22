const mongoose = require('mongoose');

const certificationSchema = new mongoose.Schema(
  {
    title:            { type: String, required: true },
    issuer:           String,
    duration:         String,
    certificateImage: String,
    pdfDocument:      String,
    sortOrder:        { type: Number, default: 0 },
    deletedAt:        { type: Date, default: null },
  },
  { timestamps: true }
);

const CertificationModel = mongoose.model('Certification', certificationSchema);

function serialize(doc) {
  if (!doc) return null;
  return {
    id:               doc._id.toString(),
    title:            doc.title,
    issuer:           doc.issuer,
    duration:         doc.duration,
    certificateImage: doc.certificateImage,
    pdfDocument:      doc.pdfDocument,
    sortOrder:        doc.sortOrder,
  };
}

const Certification = {
  async findAll() {
    const docs = await CertificationModel.find({ deletedAt: null })
      .sort({ sortOrder: 1, _id: 1 })
      .lean();
    return docs.map(serialize);
  },

  async findById(id) {
    const doc = await CertificationModel.findOne({ _id: id, deletedAt: null }).lean();
    return serialize(doc);
  },

  async create({ title, issuer, duration, certificateImage, pdfDocument }) {
    const count = await CertificationModel.countDocuments({ deletedAt: null });
    const doc = await CertificationModel.create({
      title, issuer, duration, certificateImage, pdfDocument, sortOrder: count,
    });
    return serialize(doc.toObject());
  },

  async update(id, { title, issuer, duration, certificateImage, pdfDocument }) {
    const doc = await CertificationModel.findOneAndUpdate(
      { _id: id, deletedAt: null },
      { title, issuer, duration, certificateImage, pdfDocument },
      { new: true }
    ).lean();
    return serialize(doc);
  },

  async softDelete(id) {
    await CertificationModel.findByIdAndUpdate(id, { deletedAt: new Date() });
  },
};

module.exports = Certification;
