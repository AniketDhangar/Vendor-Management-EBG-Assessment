const mongoose = require('mongoose');
const { Schema } = mongoose;

const orderItemSchema = new Schema({
  product: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
  qty: { type: Number, required: true },
  price: { type: Number, required: true }
}, { _id: false });

const orderSchema = new Schema({
  vendor: { type: Schema.Types.ObjectId, ref: 'Vendor', required: true },
  user: { type: Schema.Types.ObjectId, ref: 'User' },
  items: [orderItemSchema],
  subtotal: { type: Number, required: true },
  total: { type: Number, required: true },
  status: { type: String, enum: ['pending','processing','shipped','delivered','cancelled'], default: 'pending' },
  shipping: { address: String, method: String }
}, { timestamps: true });

orderSchema.index({ vendor: 1, createdAt: -1 });

module.exports = mongoose.model('Order', orderSchema);
