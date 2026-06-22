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

const Admin = {
  async findByEmail(email) {
    return AdminModel.findOne({ email: email.toLowerCase().trim() }).lean();
  },

  async findById(id) {
    return AdminModel.findById(id).select('-password').lean();
  },

  async count() {
    return AdminModel.countDocuments();
  },

  async create({ name, email, passwordHash }) {
    const doc = await AdminModel.create({ name, email, password: passwordHash });
    return AdminModel.findById(doc._id).select('-password').lean();
  },

  async updatePassword(id, passwordHash) {
    await AdminModel.findByIdAndUpdate(id, { password: passwordHash });
  },

  async updateProfile(id, { name, email }) {
    return AdminModel.findByIdAndUpdate(id, { name, email }, { new: true }).select('-password').lean();
  },
};

module.exports = Admin;
