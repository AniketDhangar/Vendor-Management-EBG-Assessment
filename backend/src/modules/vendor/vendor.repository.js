const Vendor = require('./vendor.model');

const create = async (payload) => new Vendor(payload).save();
const findById = (id) => Vendor.findById(id);
const findByEmail = (email) => Vendor.findOne({ email });
const update = (id, payload) => Vendor.findByIdAndUpdate(id, payload, { new: true, runValidators: true });
const deleteById = (id) => Vendor.findByIdAndDelete(id);
const findWithQuery = (query, options) =>
  Vendor.find(query).sort(options.sort).skip(options.skip).limit(options.limit);
const count = (q) => Vendor.countDocuments(q);

module.exports = { create, findById, findByEmail, update, deleteById, findWithQuery, count };
