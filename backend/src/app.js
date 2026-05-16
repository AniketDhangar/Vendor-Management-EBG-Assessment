const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const morgan = require('morgan');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const routes = require('./routes');
const { limiter } = require('./common/middlewares/rateLimiter.middleware');
const { ApiError, errorHandler } = require('./common/middlewares/error.middleware');

const app = express();

app.use(helmet());
app.use(cors({ origin: [process.env.CLIENT_URL], credentials: true }));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(mongoSanitize());
app.use(xss());
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));
app.use(limiter);

app.use('/api/v1', routes);

app.use((req, res, next) => next(new ApiError(404, 'Route not found')));
app.use(errorHandler);

module.exports = app;
