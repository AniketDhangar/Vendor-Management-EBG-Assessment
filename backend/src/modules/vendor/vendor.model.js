const mongoose = require('mongoose');
const { Schema } = mongoose;

const vendorSchema = new Schema({
  name: { type: String, required: true, index: 'text' },
  email: { type: String, required: true, unique: true, index: true },
  phone: { type: String },
  address: { type: String },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

vendorSchema.index({ name: 'text', email: 'text' });

module.exports = mongoose.model('Vendor', vendorSchema);
