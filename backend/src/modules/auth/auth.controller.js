const service = require('./auth.service');
const { asyncHandler } = require('../../common/middlewares/asyncHandler');

const register = asyncHandler(async (req, res) => {
  const user = await service.register(req.body);
  res.status(201).json({ data: user });
});

const login = asyncHandler(async (req, res) => {
  const tokens = await service.login(req.body);
  res.status(200).json({ data: tokens });
});

const refresh = asyncHandler(async (req, res) => {
  const data = await service.refresh(req.body.refreshToken);
  res.status(200).json({ data });
});

const logout = asyncHandler(async (req, res) => {
  await service.logout(req.user.id, req.body.refreshToken);
  res.status(200).json({ data: { message: 'Logged out' } });
});

const me = asyncHandler(async (req, res) => {
  const user = await service.getProfile(req.user.id);
  res.status(200).json({ data: user });
});

module.exports = { register, login, refresh, logout, me };
