const { Schema, model } = require('mongoose');

const staffSchema = new Schema({
  user_type: { type: String, default: 'staff' },
  staffId: { type: String, required: true, unique: true }, // e.g., EMP001
  name: { type: String, required: true },
  password: { type: String, required: true }
}, { timestamps: true });

module.exports = model('Staff', staffSchema);