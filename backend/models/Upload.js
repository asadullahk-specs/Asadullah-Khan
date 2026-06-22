const mongoose = require('mongoose');

const uploadSchema = new mongoose.Schema(
  {
    originalName: { type: String, required: true },
    fileName:     { type: String, required: true },
    filePath:     { type: String, required: true },
    fileUrl:      { type: String, required: true },
    mimeType:     String,
    fileType:     { type: String, enum: ['image', 'pdf', 'doc', 'other'], default: 'other' },
    sizeBytes:    Number,
    deletedAt:    { type: Date, default: null },
  },
  { timestamps: true }
);

const UploadModel = mongoose.model('Upload', uploadSchema);

function serialize(doc) {
  if (!doc) return null;
  return {
    id:        doc._id.toString(),
    name:      doc.originalName,
    fileName:  doc.fileName,
    url:       doc.fileUrl,
    type:      doc.fileType,
    mimeType:  doc.mimeType,
    size:      doc.sizeBytes,
    createdAt: doc.createdAt,
  };
}

const Upload = {
  async findAll() {
    const docs = await UploadModel.find({ deletedAt: null }).sort({ createdAt: -1 }).lean();
    return docs.map(serialize);
  },
  async findById(id) {
    if (!mongoose.Types.ObjectId.isValid(id)) return null;
    const doc = await UploadModel.findOne({ _id: id, deletedAt: null }).lean();
    return serialize(doc);
  },
  async create({ originalName, fileName, filePath, fileUrl, mimeType, fileType, sizeBytes }) {
    const doc = await UploadModel.create({ originalName, fileName, filePath, fileUrl, mimeType, fileType, sizeBytes });
    return serialize(doc.toObject());
  },
  async softDelete(id) {
    await UploadModel.findByIdAndUpdate(id, { deletedAt: new Date() });
  },
};

module.exports = Upload;
