const dotenv = require('dotenv');

dotenv.config();

const mongoUri =
  process.env.MONGO_URI ||
  process.env.MONGODB_URI ||
  process.env.DATABASE_URL;

const jwtAccessSecret =
  process.env.JWT_ACCESS_SECRET || process.env.JWT_SECRET;

const jwtRefreshSecret =
  process.env.JWT_REFRESH_SECRET || process.env.REFRESH_TOKEN_SECRET;

const required = [
  { key: 'MONGO_URI', value: mongoUri },
  { key: 'JWT_ACCESS_SECRET', value: jwtAccessSecret },
  { key: 'JWT_REFRESH_SECRET', value: jwtRefreshSecret }
];

if (process.env.NODE_ENV !== 'test') {
  required.forEach(({ key, value }) => {
    if (!value) console.warn(`[config] Warning: ${key} is not set`);
  });
}

module.exports = {
  port: Number(process.env.PORT) || 4000,
  mongoUri,
  clientUrl:
    process.env.CLIENT_URL ||
    process.env.CORS_ORIGIN,
  jwt: {
    accessSecret: jwtAccessSecret,
    refreshSecret: jwtRefreshSecret,
    accessExpiry:
      process.env.JWT_ACCESS_EXPIRES ||
      process.env.JWT_EXPIRES ||
      process.env.JWT_EXPIRY ||
      '15m',
    refreshExpiry:
      process.env.JWT_REFRESH_EXPIRES ||
      process.env.JWT_REFRESH_EXPIRY ||
      '7d'
  },
  cloudinary: {
    cloudName: process.env.CLOUDINARY_CLOUD_NAME,
    apiKey: process.env.CLOUDINARY_API_KEY,
    apiSecret: process.env.CLOUDINARY_API_SECRET
  },
  rateLimit: {
    windowMs:
      Number(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000,
    max:
      Number(process.env.RATE_LIMIT_MAX) ||
      Number(process.env.RATE_LIMIT_MAX_REQUESTS) ||
      100
  }
};
