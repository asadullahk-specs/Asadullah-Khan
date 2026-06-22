const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true },
    lastName:  { type: String, required: true },
    email:     { type: String, required: true },
    phone:     String,
    message:   { type: String, required: true },
    isRead:    { type: Boolean, default: false },
    deletedAt: { type: Date, default: null },
  },
  { timestamps: true }
);

messageSchema.index({ isRead: 1 });

const MessageModel = mongoose.model('Message', messageSchema);

function serialize(doc) {
  if (!doc) return null;
  return {
    id:        doc._id.toString(),
    firstName: doc.firstName,
    lastName:  doc.lastName,
    email:     doc.email,
    phone:     doc.phone,
    message:   doc.message,
    isRead:    !!doc.isRead,
    createdAt: doc.createdAt,
  };
}

const Message = {
  async findAll() {
    const docs = await MessageModel.find({ deletedAt: null }).sort({ createdAt: -1 }).lean();
    return docs.map(serialize);
  },
  async findById(id) {
    const doc = await MessageModel.findOne({ _id: id, deletedAt: null }).lean();
    return serialize(doc);
  },
  async create({ firstName, lastName, email, phone, message }) {
    const doc = await MessageModel.create({ firstName, lastName, email, phone: phone || null, message });
    return serialize(doc.toObject());
  },
  async setRead(id, isRead) {
    const doc = await MessageModel.findOneAndUpdate(
      { _id: id, deletedAt: null },
      { isRead },
      { new: true }
    ).lean();
    return serialize(doc);
  },
  async softDelete(id) {
    await MessageModel.findByIdAndUpdate(id, { deletedAt: new Date() });
  },
  async unreadCount() {
    return MessageModel.countDocuments({ deletedAt: null, isRead: false });
  },
};

module.exports = Message;
