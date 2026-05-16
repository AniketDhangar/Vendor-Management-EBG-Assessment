const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const morgan = require('morgan');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const routes = require('./routes');
const { limiter } = require('./common/middlewares/rateLimiter.middleware');
const { ApiError, errorHandler } = require('./common/middlewares/error.middleware');
const { clientUrl } = require('./config');

const app = express();

app.use(helmet());
const allowedOrigins = [
    "http://localhost:5173",
    "https://vendorsmanagement-ebg.netlify.app"
];
if (clientUrl) {
    allowedOrigins.push(clientUrl);
}

app.use(cors({
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error("CORS blocked"));
        }
    },
    credentials: true
}));
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
