const mongoose = require('mongoose');
const { Schema } = mongoose;

const tokenSchema = new Schema({
  token: { type: String, required: true },
  expiresAt: { type: Date, required: true }
}, { _id: false });

const userSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, index: true },
  password: { type: String, required: true, select: false },
  role: { type: String, enum: ['admin', 'vendor'], required: true },
  vendorRef: { type: Schema.Types.ObjectId, ref: 'Vendor' },
  refreshTokens: [tokenSchema]
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
