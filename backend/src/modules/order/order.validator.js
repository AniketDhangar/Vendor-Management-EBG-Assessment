const Joi = require('joi');

const orderItem = Joi.object({
  product: Joi.string().hex().length(24).required(),
  qty: Joi.number().integer().min(1).required(),
  price: Joi.number().min(0).optional()
});

const createOrder = Joi.object({
  vendor: Joi.string().hex().length(24).when('$role', { is: 'admin', then: Joi.required(), otherwise: Joi.optional() }),
  user: Joi.string().hex().length(24).optional(),
  items: Joi.array().items(orderItem).min(1).required(),
  subtotal: Joi.number().min(0).optional(),
  total: Joi.number().min(0).optional(),
  shipping: Joi.object({
    address: Joi.string().allow('').optional(),
    method: Joi.string().allow('').optional()
  }).optional()
});

const updateOrderStatus = Joi.object({
  status: Joi.string().valid('pending', 'processing', 'shipped', 'delivered', 'cancelled').required()
});

module.exports = { createOrder, updateOrderStatus };
