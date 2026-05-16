const { ApiError } = require('./error.middleware');

/** Ensures vendor-role users only access their own vendor record. */
const assertVendorAccess = (req, res, next) => {
  if (req.user.role !== 'vendor') return next();
  if (!req.user.vendorRef) return next(new ApiError(403, 'Vendor account not linked'));
  if (req.params.id && req.params.id !== req.user.vendorRef) {
    return next(new ApiError(403, 'Forbidden'));
  }
  next();
};

module.exports = { assertVendorAccess };
