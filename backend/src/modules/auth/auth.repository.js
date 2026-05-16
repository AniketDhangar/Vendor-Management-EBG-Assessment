const User = require('./auth.model');

const create = async (payload) => new User(payload).save();

const findByEmail = async (email, withPassword = false) =>
  User.findOne({ email }).select(withPassword ? '+password' : '-refreshTokens');

const findById = (id) => User.findById(id).select('-password -refreshTokens');

const findByRefreshToken = (token) =>
  User.findOne({ 'refreshTokens.token': token }).select('+refreshTokens');

const addRefreshToken = async (userId, tokenObj) =>
  User.findByIdAndUpdate(userId, { $push: { refreshTokens: tokenObj } });

const removeRefreshToken = async (userId, token) =>
  User.findByIdAndUpdate(userId, { $pull: { refreshTokens: { token } } });

module.exports = {
  create,
  findByEmail,
  findById,
  findByRefreshToken,
  addRefreshToken,
  removeRefreshToken
};
