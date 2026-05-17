const Order = require('./order.model');

const create = async (payload) => new Order(payload).save();
const findById = (id) => Order.findById(id).populate('items.product').populate('vendor').populate('user', 'name email');
const update = (id, payload) => Order.findByIdAndUpdate(id, payload, { new: true }).populate('items.product').populate('vendor').populate('user', 'name email');
const deleteById = (id) => Order.findByIdAndDelete(id);
const findWithQuery = (query, options) => Order.find(query).sort(options.sort).skip(options.skip).limit(options.limit).populate('vendor').populate('user', 'name email').populate('items.product');
const count = (q) => Order.countDocuments(q);

module.exports = { create, findById, update, deleteById, findWithQuery, count };
