const rateLimit = require('express-rate-limit');
const { rateLimit: cfg } = require('../../config');

const limiter = rateLimit({ windowMs: cfg.windowMs, max: cfg.max });

module.exports = { limiter };
