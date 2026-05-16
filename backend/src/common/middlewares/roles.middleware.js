const { ApiError } = require('./error.middleware');

const permit = (...allowed) => (req, res, next) => {
  const { user } = req;
  if (!user) return next(new ApiError(401, 'Unauthorized'));
  if (!allowed.includes(user.role)) return next(new ApiError(403, 'Forbidden'));
  next();
};

module.exports = { permit };
