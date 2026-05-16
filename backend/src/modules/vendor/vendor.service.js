const repo = require('./vendor.repository');
const { buildQuery } = require('../../common/utils/searchFilter');
const { buildPagination } = require('../../common/utils/pagination');
const { ApiError } = require('../../common/middlewares/error.middleware');

const list = async (queryParams) => {
  const q = buildQuery(queryParams, ['name', 'email']);
  const { skip, limit, sort, page } = buildPagination(queryParams);
  const [items, total] = await Promise.all([
    repo.findWithQuery(q, { skip, limit, sort }),
    repo.count(q)
  ]);
  return { items, total, page, limit };
};

const create = async (payload) => {
  const existing = await repo.findByEmail(payload.email);
  if (existing) throw new ApiError(409, 'Vendor email already exists');
  return repo.create(payload);
};

const get = async (id) => {
  const v = await repo.findById(id);
  if (!v) throw new ApiError(404, 'Vendor not found');
  return v;
};

const update = async (id, payload) => {
  const v = await repo.update(id, payload);
  if (!v) throw new ApiError(404, 'Vendor not found');
  return v;
};

const remove = async (id) => {
  const v = await repo.deleteById(id);
  if (!v) throw new ApiError(404, 'Vendor not found');
  return v;
};

module.exports = { list, create, get, update, remove };
