const repo = require('./order.repository');
const productRepo = require('../product/product.repository');
const { buildQuery } = require('../../common/utils/searchFilter');
const { buildPagination } = require('../../common/utils/pagination');
const { ApiError } = require('../../common/middlewares/error.middleware');

const applyVendorScope = (q, user) => {
  if (user?.role === 'vendor' && user.vendorRef) {
    q.vendor = user.vendorRef;
  }
  return q;
};

const list = async (queryParams, user) => {
  const q = applyVendorScope(buildQuery(queryParams, []), user);
  const { skip, limit, sort, page } = buildPagination(queryParams);
  const [items, total] = await Promise.all([
    repo.findWithQuery(q, { skip, limit, sort }),
    repo.count(q)
  ]);
  return { items, total, page, limit };
};

const create = async (payload, user) => {
  if (user?.role === 'vendor') {
    if (!user.vendorRef) throw new ApiError(403, 'Vendor account not linked');
    payload.vendor = user.vendorRef;
  }

  for (const it of payload.items) {
    const prod = await productRepo.findById(it.product);
    if (!prod) throw new ApiError(400, `Product not found: ${it.product}`);
    if (String(prod.vendor._id || prod.vendor) !== String(payload.vendor)) {
      throw new ApiError(400, 'Product does not belong to this vendor');
    }
    if (prod.stock < it.qty) throw new ApiError(400, `Insufficient stock for ${prod.title}`);
    it.price = it.price ?? prod.price;
  }

  const subtotal = payload.items.reduce((sum, it) => sum + it.price * it.qty, 0);
  payload.subtotal = payload.subtotal ?? subtotal;
  payload.total = payload.total ?? payload.subtotal;

  for (const it of payload.items) {
    const prod = await productRepo.findById(it.product);
    await productRepo.update(prod._id, { stock: prod.stock - it.qty });
  }

  return repo.create(payload);
};

const get = async (id, user) => {
  const o = await repo.findById(id);
  if (!o) throw new ApiError(404, 'Order not found');
  if (user?.role === 'vendor' && String(o.vendor._id || o.vendor) !== user.vendorRef) {
    throw new ApiError(403, 'Forbidden');
  }
  return o;
};

const updateStatus = async (id, status, user) => {
  await get(id, user);
  const o = await repo.update(id, { status });
  if (!o) throw new ApiError(404, 'Order not found');
  return o;
};

const remove = async (id, user) => {
  const o = await get(id, user);
  if (o.status !== 'cancelled' && o.status !== 'pending') {
    throw new ApiError(400, 'Only pending or cancelled orders can be deleted');
  }
  const deleted = await repo.deleteById(id);
  if (!deleted) throw new ApiError(404, 'Order not found');
  return deleted;
};

module.exports = { list, create, get, updateStatus, remove };
