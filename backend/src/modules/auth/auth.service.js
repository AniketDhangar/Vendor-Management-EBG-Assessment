const bcrypt = require('bcrypt');
const jwtLib = require('jsonwebtoken');
const tokens = require('./tokens.service');
const repo = require('./auth.repository');
const vendorRepo = require('../vendor/vendor.repository');
const { ApiError } = require('../../common/middlewares/error.middleware');

const SALT_ROUNDS = 12;

const toPublicUser = (user) => ({
  id: user._id,
  email: user.email,
  name: user.name,
  role: user.role,
  vendorRef: user.vendorRef || null
});

const buildTokenPayload = (user) => {
  const payload = { sub: user._id.toString(), role: user.role };
  if (user.vendorRef) payload.vendorRef = user.vendorRef.toString();
  return payload;
};

const register = async ({ name, email, password, role, vendorRef = null }) => {
  const existing = await repo.findByEmail(email);
  if (existing) throw new ApiError(409, 'Email already registered');
  if (role === 'vendor') {
    if (!vendorRef) throw new ApiError(400, 'Vendor ID is required for vendor accounts');
    const vendor = await vendorRepo.findById(vendorRef);
    if (!vendor) throw new ApiError(400, 'Vendor not found');
  }
  const hashed = await bcrypt.hash(password, SALT_ROUNDS);
  const user = await repo.create({ name, email, password: hashed, role, vendorRef });
  return toPublicUser(user);
};

const login = async ({ email, password }) => {
  const user = await repo.findByEmail(email, true);
  if (!user) throw new ApiError(401, 'Invalid credentials');
  const match = await bcrypt.compare(password, user.password);
  if (!match) throw new ApiError(401, 'Invalid credentials');

  const payload = buildTokenPayload(user);
  const accessToken = tokens.generateAccessToken(payload);
  const refreshToken = tokens.generateRefreshToken(payload);
  const decoded = jwtLib.decode(refreshToken);
  await repo.addRefreshToken(user._id, {
    token: refreshToken,
    expiresAt: new Date(decoded.exp * 1000)
  });

  return {
    accessToken,
    refreshToken,
    user: toPublicUser(user)
  };
};

const refresh = async (refreshToken) => {
  try {
    const payload = tokens.verifyRefresh(refreshToken);
    const stored = await repo.findByRefreshToken(refreshToken);
    if (!stored) throw new ApiError(401, 'Invalid refresh token');
    const accessToken = tokens.generateAccessToken({
      sub: payload.sub,
      role: payload.role,
      ...(payload.vendorRef && { vendorRef: payload.vendorRef })
    });
    return { accessToken };
  } catch (err) {
    if (err instanceof ApiError) throw err;
    throw new ApiError(401, 'Invalid refresh token');
  }
};

const logout = async (userId, refreshToken) => {
  if (refreshToken) await repo.removeRefreshToken(userId, refreshToken);
};

const getProfile = async (userId) => {
  const user = await repo.findById(userId);
  if (!user) throw new ApiError(404, 'User not found');
  return toPublicUser(user);
};

module.exports = { register, login, refresh, logout, getProfile };
