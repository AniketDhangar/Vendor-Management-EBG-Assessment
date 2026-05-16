const jwt = require('jsonwebtoken');
const { jwt: jwtCfg } = require('../../config');

const generateAccessToken = (payload) => jwt.sign(payload, jwtCfg.accessSecret, { expiresIn: jwtCfg.accessExpiry });
const generateRefreshToken = (payload) => jwt.sign(payload, jwtCfg.refreshSecret, { expiresIn: jwtCfg.refreshExpiry });
const verifyAccess = (token) => jwt.verify(token, jwtCfg.accessSecret);
const verifyRefresh = (token) => jwt.verify(token, jwtCfg.refreshSecret);

module.exports = { generateAccessToken, generateRefreshToken, verifyAccess, verifyRefresh };
