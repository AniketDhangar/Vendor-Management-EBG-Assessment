const Joi = require('joi');

const createProduct = Joi.object({
  title: Joi.string().min(2).max(300).required(),
  description: Joi.string().allow('').optional(),
  price: Joi.number().min(0).required(),
  vendor: Joi.string().hex().length(24).when('$role', { is: 'admin', then: Joi.required(), otherwise: Joi.optional() }),
  stock: Joi.number().integer().min(0).optional(),
  categories: Joi.alternatives().try(
    Joi.array().items(Joi.string()),
    Joi.string()
  ).optional(),
  isPublished: Joi.boolean().optional()
});

// const createProduct = Joi.array().items(
//   Joi.object({
//     title: Joi.string().min(2).max(300).required(),
//     description: Joi.string().allow('').optional(),
//     price: Joi.number().min(0).required(),
//     vendor: Joi.string().hex().length(24).when('$role', { is: 'admin', then: Joi.required(), otherwise: Joi.optional() }),
//     stock: Joi.number().integer().min(0).optional(),
//     categories: Joi.alternatives().try(
//       Joi.array().items(Joi.string()),
//       Joi.string()
//     ).optional(),
//     isPublished: Joi.boolean().optional()
//   })
// );

const updateProduct = Joi.object({
  title: Joi.string().min(2).max(300).optional(),
  description: Joi.string().allow('').optional(),
  price: Joi.number().min(0).optional(),
  vendor: Joi.string().hex().length(24).optional(),
  stock: Joi.number().integer().min(0).optional(),
  categories: Joi.alternatives().try(
    Joi.array().items(Joi.string()),
    Joi.string()
  ).optional(),
  isPublished: Joi.boolean().optional()
}).min(1);

module.exports = { createProduct, updateProduct };
