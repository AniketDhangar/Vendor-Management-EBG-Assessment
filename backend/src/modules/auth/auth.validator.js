const Joi = require('joi');

const register = Joi.object({
  name: Joi.string().min(2).max(100).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(8).required(),
  role: Joi.string().valid('admin', 'vendor').required(),
  vendorRef: Joi.string().hex().length(24).optional()
});

const login = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required()
});

const refresh = Joi.object({
  refreshToken: Joi.string().required()
});

const logout = Joi.object({
  refreshToken: Joi.string().optional()
});

module.exports = { register, login, refresh, logout };
