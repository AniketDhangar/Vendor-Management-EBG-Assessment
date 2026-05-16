const service = require('./vendor.service');
const { asyncHandler } = require('../../common/middlewares/asyncHandler');

const list = asyncHandler(async (req, res) => {
  const result = await service.list(req.query);
  res.json({ data: result });
});

const create = asyncHandler(async (req, res) => {
  const v = await service.create(req.body);
  res.status(201).json({ data: v });
});

const get = asyncHandler(async (req, res) => {
  const v = await service.get(req.params.id);
  res.json({ data: v });
});

const update = asyncHandler(async (req, res) => {
  const v = await service.update(req.params.id, req.body);
  res.json({ data: v });
});

const remove = asyncHandler(async (req, res) => {
  await service.remove(req.params.id);
  res.status(204).send();
});

module.exports = { list, create, get, update, remove };
