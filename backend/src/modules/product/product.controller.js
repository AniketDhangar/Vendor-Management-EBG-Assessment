const service = require('./product.service');
const { asyncHandler } = require('../../common/middlewares/asyncHandler');

const list = asyncHandler(async (req, res) => {
  const result = await service.list(req.query, req.user);
  res.json({ data: result });
});

const create = asyncHandler(async (req, res) => {
  const product = await service.create(req.body, req.file?.buffer, req.user);
  res.status(201).json({ data: product });
});

const get = asyncHandler(async (req, res) => {
  const p = await service.get(req.params.id, req.user);
  res.json({ data: p });
});

const update = asyncHandler(async (req, res) => {
  const p = await service.update(req.params.id, req.body, req.file?.buffer, req.user);
  res.json({ data: p });
});

const remove = asyncHandler(async (req, res) => {
  await service.remove(req.params.id, req.user);
  res.status(204).send();
});

module.exports = { list, create, get, update, remove };
