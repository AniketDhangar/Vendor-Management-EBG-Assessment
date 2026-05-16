const Joi = require('joi');

const createVendor = Joi.object({
  name: Joi.string().min(2).max(200).required(),
  email: Joi.string().email().required(),
  phone: Joi.string().allow('').optional(),
  address: Joi.string().allow('').optional(),
  isActive: Joi.boolean().optional()
});

const updateVendor = Joi.object({
  name: Joi.string().min(2).max(200).optional(),
  email: Joi.string().email().optional(),
  phone: Joi.string().allow('').optional(),
  address: Joi.string().allow('').optional(),
  isActive: Joi.boolean().optional()
}).min(1);

module.exports = { createVendor, updateVendor };
