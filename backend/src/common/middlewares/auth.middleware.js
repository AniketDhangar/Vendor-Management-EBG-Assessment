const { verifyAccess } = require('../../modules/auth/tokens.service');
const { ApiError } = require('./error.middleware');

const authenticate = (req, res, next) => {
  const header = req.headers.authorization;
  if (!header || !header.startsWith('Bearer ')) {
    return next(new ApiError(401, 'No token provided'));
  }
  const token = header.split(' ')[1];
  try {
    const payload = verifyAccess(token);
    req.user = {
      id: payload.sub,
      role: payload.role,
      vendorRef: payload.vendorRef || null
    };
    return next();
  } catch {
    return next(new ApiError(401, 'Invalid token'));
  }
};

module.exports = { authenticate };
