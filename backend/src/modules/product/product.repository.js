const Product = require('./product.model');

const create = async (payload) => new Product(payload).save();
const findById = (id) => Product.findById(id).populate('vendor');
const update = (id, payload) => Product.findByIdAndUpdate(id, payload, { new: true });
const deleteById = (id) => Product.findByIdAndDelete(id);
const findWithQuery = (query, options) => Product.find(query).sort(options.sort).skip(options.skip).limit(options.limit).populate('vendor');
const count = (q) => Product.countDocuments(q);

module.exports = { create, findById, update, deleteById, findWithQuery, count };
