const Joi = require('joi');

const idParam = Joi.object({ id: Joi.string().hex().length(24).required() });

module.exports = { Joi, idParam };
