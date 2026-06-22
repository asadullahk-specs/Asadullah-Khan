const mongoose = require('mongoose');

const adminSchema = new mongoose.Schema(
  {
    name:     { type: String, required: true, trim: true },
    email:    { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true }, // bcrypt hash
  },
  { timestamps: true }
);

const AdminModel = mongoose.model('Admin', adminSchema);

function serialize(doc) {
  if (!doc) return null;
  return {
    id: doc._id.toString(),
    name: doc.name,
    email: doc.email,
    password: doc.password,
    createdAt: doc.createdAt,
  };
}

const Admin = {
  async findByEmail(email) {
    const doc = await AdminModel.findOne({ email: email.toLowerCase().trim() }).lean();
    return serialize(doc);
  },

  async findById(id) {
    if (!mongoose.Types.ObjectId.isValid(id)) return null;
    const doc = await AdminModel.findById(id).select('-password').lean();
    return serialize(doc);
  },

  async count() {
    return AdminModel.countDocuments();
  },

  async create({ name, email, passwordHash }) {
    const doc = await AdminModel.create({ name, email, password: passwordHash });
    return this.findById(doc._id);
  },

  async updatePassword(id, passwordHash) {
    await AdminModel.findByIdAndUpdate(id, { password: passwordHash });
  },

  async updateProfile(id, { name, email }) {
    await AdminModel.findByIdAndUpdate(id, { name, email });
    return this.findById(id);
  },
};

module.exports = Admin;
