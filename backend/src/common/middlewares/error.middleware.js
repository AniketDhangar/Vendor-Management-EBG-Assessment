class ApiError extends Error {
  constructor(status, message, details = null) {
    super(message);
    this.status = status;
    this.details = details;
  }
}

const errorHandler = (err, req, res, next) => {
  const status = err.status || 500;
  const payload = { message: err.message || 'Internal Server Error' };
  if (process.env.NODE_ENV !== 'production' && err.stack) payload.stack = err.stack;
  if (err.details) payload.details = err.details;
  res.status(status).json(payload);
};

module.exports = { ApiError, errorHandler };
