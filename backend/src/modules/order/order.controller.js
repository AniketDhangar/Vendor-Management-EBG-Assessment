const service = require('./order.service');
const { asyncHandler } = require('../../common/middlewares/asyncHandler');

const list = asyncHandler(async (req, res) => {
  const result = await service.list(req.query, req.user);
  res.json({ data: result });
});

const create = asyncHandler(async (req, res) => {
  const order = await service.create(req.body, req.user);
  res.status(201).json({ data: order });
});

const get = asyncHandler(async (req, res) => {
  const o = await service.get(req.params.id, req.user);
  res.json({ data: o });
});

const updateStatus = asyncHandler(async (req, res) => {
  const o = await service.updateStatus(req.params.id, req.body.status, req.user);
  res.json({ data: o });
});

const remove = asyncHandler(async (req, res) => {
  await service.remove(req.params.id, req.user);
  res.status(204).send();
});

module.exports = { list, create, get, updateStatus, remove };
