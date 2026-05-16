const repo = require('./product.repository');
const vendorRepo = require('../vendor/vendor.repository');
const { buildQuery } = require('../../common/utils/searchFilter');
const { buildPagination } = require('../../common/utils/pagination');
const { uploadBuffer } = require('../../common/utils/cloudinary');
const { ApiError } = require('../../common/middlewares/error.middleware');

const applyVendorScope = (q, user) => {
  if (user?.role === 'vendor' && user.vendorRef) {
    q.vendor = user.vendorRef;
  }
  return q;
};

const list = async (queryParams, user) => {
  const q = applyVendorScope(buildQuery(queryParams, ['title', 'description']), user);
  const { skip, limit, sort, page } = buildPagination(queryParams);
  const [items, total] = await Promise.all([
    repo.findWithQuery(q, { skip, limit, sort }),
    repo.count(q)
  ]);
  return { items, total, page, limit };
};

const resolveVendor = async (payload, user) => {
  if (user.role === 'vendor') {
    if (!user.vendorRef) throw new ApiError(403, 'Vendor account not linked');
    payload.vendor = user.vendorRef;
    return payload;
  }
  if (!payload.vendor) throw new ApiError(400, 'Vendor is required');
  const vendor = await vendorRepo.findById(payload.vendor);
  if (!vendor) throw new ApiError(400, 'Vendor not found');
  return payload;
};

const create = async (payload, fileBuffer, user) => {
  const data = await resolveVendor({ ...payload }, user);
  if (fileBuffer) {
    const result = await uploadBuffer(fileBuffer, 'products');
    data.images = [{ url: result.secure_url, publicId: result.public_id }];
  }
  return repo.create(data);
};

const get = async (id, user) => {
  const p = await repo.findById(id);
  if (!p) throw new ApiError(404, 'Product not found');
  if (user?.role === 'vendor' && String(p.vendor._id || p.vendor) !== String(user.vendorRef)) {
    throw new ApiError(403, 'Forbidden');
  }
  return p;
};

const update = async (id, payload, fileBuffer, user) => {
  await get(id, user);
  if (fileBuffer) {
    const result = await uploadBuffer(fileBuffer, 'products');
    payload.images = [{ url: result.secure_url, publicId: result.public_id }];
  }
  if (user?.role === 'vendor') delete payload.vendor;
  const p = await repo.update(id, payload);
  if (!p) throw new ApiError(404, 'Product not found');
  return p;
};

const remove = async (id, user) => {
  await get(id, user);
  const p = await repo.deleteById(id);
  if (!p) throw new ApiError(404, 'Product not found');
  return p;
};

module.exports = { list, create, get, update, remove };
