const { ApiError } = require('./error.middleware');

const validationMiddleware = (schema) => (req, res, next) => {
  if (!schema) return next();
  const { error, value } = schema.validate(req.body, { abortEarly: false, stripUnknown: true });
  if (error) return next(new ApiError(400, 'Validation failed', error.details));
  req.body = value;
  next();
};

module.exports = { validationMiddleware };
