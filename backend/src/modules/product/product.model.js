const mongoose = require('mongoose');
const { Schema } = mongoose;

const imageSchema = new Schema({ url: String, publicId: String }, { _id: false });

const productSchema = new Schema({
  title: { type: String, required: true, index: 'text' },
  description: { type: String },
  price: { type: Number, required: true, index: true },
  vendor: { type: Schema.Types.ObjectId, ref: 'Vendor', required: true, index: true },
  images: [imageSchema],
  stock: { type: Number, default: 0 },
  categories: [String],
  isPublished: { type: Boolean, default: false }
}, { timestamps: true });

productSchema.index({ title: 'text', description: 'text' });

module.exports = mongoose.model('Product', productSchema);
